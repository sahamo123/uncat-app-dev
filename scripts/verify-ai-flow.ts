import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import the AI logic (we'll need to use dynamic import or tsx handling)
// relative path from scripts/ to lib/ai/categorize.ts
const categorizePath = '../lib/ai/categorize';

// Init Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
    console.log("🧪 Starting End-to-End Verification...");

    // 1. Create Test Tenant
    const cleanName = `Test Corp ${Date.now()}`;
    const { data: tenant, error: tErr } = await supabase
        .from('tenants')
        .insert({ business_name: cleanName, industry: 'Tech' })
        .select()
        .single();
    if (tErr) throw tErr;
    console.log(`✅ Created Tenant: ${tenant.id} (${cleanName})`);

    try {
        // 2. Create Chart of Accounts
        const { data: acct1 } = await supabase.from('chart_of_accounts').insert({
            tenant_id: tenant.id,
            qbo_id: '998',
            name: 'Uncategorized Expense',
            classification: 'Expense',
            description: 'Holding account for unknown expenses'
        }).select().single();

        const { data: acct2 } = await supabase.from('chart_of_accounts').insert({
            tenant_id: tenant.id,
            qbo_id: '999',
            name: 'Office Supplies',
            classification: 'Expense',
            description: 'Pens, paper, staples, etc.'
        }).select().single();
        console.log(`✅ Created Accounts: "${acct1.name}" & "${acct2.name}"`);

        // 3. Create "Uncategorized" Transaction
        const { data: txn, error: txErr } = await supabase.from('transactions').insert({
            tenant_id: tenant.id,
            qbo_id: `txn_${Date.now()}`,
            payee_name: 'Staples',
            description: 'Box of paper and pens',
            amount: 45.50,
            transaction_date: new Date().toISOString(),
            status: 'pending',
            assigned_account_id: null // Uncategorized
        }).select().single();
        if (txErr) throw txErr;
        console.log(`✅ Created Transaction: ${txn.payee_name} - $${txn.amount}`);

        // 4. Trigger AI Pipeline
        console.log("🤖 Triggering AI Pipeline...");

        // We need to import the function dynamically to work in this script context if possible
        // Or we just replicate the call if import is tricky. Ideally we invoke the real code.
        const { processUncategorizedTransactions } = await import(categorizePath);

        await processUncategorizedTransactions(tenant.id);

        // 5. Verify Result
        const { data: updatedTxn } = await supabase
            .from('transactions')
            .select(`
                *,
                chart_of_accounts!ai_suggested_account_id(name)
            `)
            .eq('id', txn.id)
            .single();

        if (updatedTxn.ai_suggested_account_id) {
            console.log(`\n✨ SUCCESS! AI Suggestion Generated:`);
            console.log(`   - Suggestion: ${updatedTxn.chart_of_accounts.name}`);
            console.log(`   - Reasoning: "${updatedTxn.ai_reasoning}"`);
            console.log(`   - Confidence: ${updatedTxn.ai_confidence_score}`);
        } else {
            console.error("\n❌ FAILED: No AI suggestion generated.");
            process.exit(1);
        }

        // 6. Simulate Approval
        console.log("\n👍 Simulating User Approval...");
        const { error: approveErr } = await supabase
            .from('transactions')
            .update({
                assigned_account_id: updatedTxn.ai_suggested_account_id,
                status: 'approved'
            })
            .eq('id', txn.id);

        if (approveErr) throw approveErr;

        const { data: finalTxn } = await supabase.from('transactions').select('status, assigned_account_id').eq('id', txn.id).single();
        if (!finalTxn) {
            console.error("❌ FAILED: Transaction not found after approval.");
            process.exit(1);
        }
        console.log(`✅ Transaction Status: ${finalTxn.status}`);
        console.log(`✅ Final Account ID: ${finalTxn.assigned_account_id}`);

        console.log("\n🚀 End-to-End Verification Passed!");

    } catch (err) {
        console.error("Test Failed:", err);
    } finally {
        // Cleanup
        console.log("\n🧹 Cleaning up test data...");
        await supabase.from('transactions').delete().eq('tenant_id', tenant.id);
        await supabase.from('chart_of_accounts').delete().eq('tenant_id', tenant.id);
        await supabase.from('tenants').delete().eq('id', tenant.id);
        console.log("Done.");
    }
}

runTest();
