import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from './embeddings';
import { openai } from './client';

// Initialize Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UNCATEGORIZED_KEYWORDS = ['Uncategorized', 'Ask My Accountant', 'Suspense', 'Uncategorized Expense', 'Uncategorized Income'];

export async function processUncategorizedTransactions(tenantId: string) {
    console.log(`[AI] Processing tenant: ${tenantId}`);

    // 1. Identify Uncategorized Accounts for this tenant
    // We fetch all accounts that look like "Uncategorized" to detect which transactions are sitting there
    const { data: accounts } = await supabaseAdmin
        .from('chart_of_accounts')
        .select('id, name, account_sub_type')
        .eq('tenant_id', tenantId);

    if (!accounts) return;

    const uncategorizedAccountIds = accounts
        .filter(acc =>
            UNCATEGORIZED_KEYWORDS.some(k => acc.name.includes(k) || acc.account_sub_type?.includes(k))
        )
        .map(acc => acc.id);

    // Also include transactions with NO account assigned (if nullable)
    // Query transactions that are either in an uncategorized account OR have no account
    // For MVP, simplified to: status = 'pending' or assigned_account_id is null

    // 1b. Fetch Reconciliation Rules
    const { data: rules } = await supabaseAdmin
        .from('reconciliation_rules')
        .select('*')
        .eq('tenant_id', tenantId);

    // 2. Fetch Pending Transactions
    const { data: transactions } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('tenant_id', tenantId)
        .is('ai_suggested_account_id', null) // Only ones we haven't tried yet
        .limit(20); // Batch size

    if (!transactions || transactions.length === 0) {
        console.log(`[AI] No transactions to process.`);
        return { processed: 0 };
    }

    console.log(`[AI] Found ${transactions.length} transactions to categorize.`);

    for (const txn of transactions) {
        // --- RULE BASED MATCHING ---
        const matchedRule = rules?.find(r =>
            (txn.payee_name && txn.payee_name.toLowerCase().includes(r.keyword.toLowerCase())) ||
            (txn.description && txn.description.toLowerCase().includes(r.keyword.toLowerCase()))
        );

        if (matchedRule) {
            console.log(`[AI] Rule Match: ${txn.payee_name} -> ${matchedRule.keyword}`);
            await supabaseAdmin
                .from('transactions')
                .update({
                    ai_suggested_account_id: matchedRule.target_account_id,
                    ai_confidence_score: 1.0,
                    ai_reasoning: `Matched Reconciliation Rule: "${matchedRule.keyword}"`,
                    status: 'pending'
                })
                .eq('id', txn.id);
            continue; // Skip AI for this one
        }
        // ---------------------------

        await categorizeTransaction(tenantId, txn);
    }

    return { processed: transactions.length };
}

async function categorizeTransaction(tenantId: string, txn: any) {
    try {
        // A. Generate Embedding for this transaction
        const searchText = `${txn.payee_name} ${txn.description} ${txn.amount}`;
        const embedding = await generateEmbedding(searchText);

        if (embedding.length === 0) return;

        // Save embedding first (it's useful for search even if we fail later)
        await supabaseAdmin
            .from('transactions')
            .update({ embedding })
            .eq('id', txn.id);

        // B. RAG 1: Find Similar Past Transactions (History)
        const { data: similarTxns } = await supabaseAdmin.rpc('match_transactions', {
            query_embedding: embedding,
            filter_tenant_id: tenantId,
            match_threshold: 0.8, // High similarity threshold
            match_count: 5
        });

        // C. RAG 2: Find Candidate Accounts (if we have no history, or just to verify)
        // We need an RPC for matching accounts too. If not exists, we'll fetch all.
        // For MVP, fetching all accounts is safer if count < 200.
        // Let's assume we fetch all for context, but concise.
        const { data: allAccounts } = await supabaseAdmin
            .from('chart_of_accounts')
            .select('id, name, classification, description')
            .eq('tenant_id', tenantId);

        // Filter out obvious bad targets (like "Uncategorized", "Opening Balance", etc.)
        const candidateAccounts = (allAccounts || []).filter(acc =>
            !UNCATEGORIZED_KEYWORDS.some(k => acc.name.includes(k))
        );

        // D. Construct LLM Prompt
        const historyContext = similarTxns?.map((t: any) =>
            `- ${t.payee_name} (${t.description}): Categorized to account ID ${t.assigned_account_id}`
        ).join('\n') || "No similar past transactions.";

        const accountsContext = candidateAccounts.map((a: any) =>
            `- ${a.name} (${a.classification}): ${a.description || ''} [ID: ${a.id}]`
        ).join('\n');

        const prompt = `
            You are an expert bookkeeper. Categorize the following transaction:
            
            Transaction:
            - Payee: ${txn.payee_name}
            - Description: ${txn.description}
            - Amount: ${txn.amount}
            - Date: ${txn.transaction_date}

            History of similar decisions:
            ${historyContext}

            Available Chart of Accounts:
            ${accountsContext}

            Instructions:
            1. Select the BEST account from the available list.
            2. If uncertain, suggest the most likely one but lower confidence score.
            3. Provide a brief reasoning.
            4. Output JSON: { "suggested_account_id": "UUID", "confidence": 0.0-1.0, "reasoning": "string" }
        `;

        // E. Call LLM
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4o-mini', // or gpt-3.5-turbo, using 4o-mini for speed/cost balance
            response_format: { type: "json_object" },
        });

        const resultStr = chatCompletion.choices[0].message.content;
        if (!resultStr) throw new Error("Empty AI response");

        const result = JSON.parse(resultStr);

        // F. Save Result
        await supabaseAdmin
            .from('transactions')
            .update({
                ai_suggested_account_id: result.suggested_account_id,
                ai_confidence_score: result.confidence,
                ai_reasoning: result.reasoning,
                status: 'pending' // Still pending approval
            })
            .eq('id', txn.id);

        console.log(`[AI] Categorized ${txn.payee_name} -> ${result.reasoning}`);

    } catch (error) {
        console.error(`[AI] Failed to categorize txn ${txn.id}:`, error);
    }

    // Rate limit safeguard: sleep 200ms
    await new Promise(r => setTimeout(r, 200));
}
