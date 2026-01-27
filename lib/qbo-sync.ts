import { createClient } from '@supabase/supabase-js';
import { getQBOClient } from './quickbooks';
import OAuthClient from 'intuit-oauth';

// Initialize Admin Supabase Client (Service Role)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QboConnection {
    realm_id: string;
    access_token: string;
    refresh_token: string;
    access_token_expires_at: string;
    refresh_token_expires_at: string;
}

export async function performSync(tenantId: string) {
    console.log(`[Sync] Starting sync for tenant: ${tenantId}`);

    try {
        // 1. Get Connection & Tokens
        const { data: connection, error: connError } = await supabaseAdmin
            .from('qbo_connections')
            .select('*')
            .eq('tenant_id', tenantId)
            .single();

        if (connError || !connection) {
            throw new Error(`No QBO connection found for tenant ${tenantId}`);
        }

        let { access_token, refresh_token, realm_id, access_token_expires_at, refresh_token_expires_at } = connection;

        // 2. Check Token Expiry & Refresh if needed
        const now = new Date();
        const expiresAt = new Date(access_token_expires_at);

        // Refresh if expired or expiring in next 5 mins
        if (now.getTime() + 5 * 60 * 1000 > expiresAt.getTime()) {
            console.log(`[Sync] Refreshing token for tenant: ${tenantId}`);
            const oauthClient = getQBOClient();

            // Set the current tokens on the client to refresh them
            // Note: intut-oauth client might handle this differently, standard flow:
            oauthClient.token.setToken({
                access_token,
                refresh_token,
                expires_in: 3600, // Approximate, not used for refresh logic usually
                x_refresh_token_expires_in: 8726400,
                realmId: realm_id
            });

            const authResponse = await oauthClient.refreshUsingToken(refresh_token);
            const newToken = authResponse.getJson();

            // Update DB
            const { error: updateError } = await supabaseAdmin
                .from('qbo_connections')
                .update({
                    access_token: newToken.access_token,
                    refresh_token: newToken.refresh_token,
                    access_token_expires_at: new Date(Date.now() + (newToken.expires_in * 1000)).toISOString(),
                    refresh_token_expires_at: new Date(Date.now() + (newToken.x_refresh_token_expires_in * 1000)).toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('tenant_id', tenantId);

            if (updateError) throw updateError;

            access_token = newToken.access_token;
            refresh_token = newToken.refresh_token;
        }

        // 3. Setup Client with Valid Token
        const client = getQBOClient();
        client.token.setToken({
            access_token,
            refresh_token,
            realmId: realm_id
        });

        // 4. Fetch & Sync Accounts
        console.log(`[Sync] Fetching accounts...`);
        const accounts = await fetchAllAccounts(client, realm_id);
        await saveAccounts(tenantId, accounts);

        // 5. Fetch & Sync Transactions (Last 30 Days)
        console.log(`[Sync] Fetching transactions...`);
        const transactions = await fetchRecentTransactions(client, realm_id);
        await saveTransactions(tenantId, transactions);

        // 6. Trigger AI Categorization
        console.log(`[Sync] Triggering AI Categorization...`);
        // We catch errors here so sync doesn't fail if AI fails
        try {
            // dynamic import to avoid circular dep issues if any, though likely fine as static
            const { processUncategorizedTransactions } = await import('./ai/categorize');
            await processUncategorizedTransactions(tenantId);
        } catch (aiError) {
            console.error("[Sync] AI Categorization failed:", aiError);
        }

        console.log(`[Sync] Completed successfully for tenant: ${tenantId}`);
        return { success: true, accounts: accounts.length, transactions: transactions.length };

    } catch (error: any) {
        console.error(`[Sync] Error for tenant ${tenantId}:`, error);
        throw error;
    }
}

// --- Helper Functions ---

async function fetchAllAccounts(client: any, realmId: string) {
    const response = await client.makeApiCall({
        url: `https://${process.env.QBO_ENVIRONMENT === 'production' ? 'quickbooks.api.intuit.com' : 'sandbox-quickbooks.api.intuit.com'}/v3/company/${realmId}/query?query=select * from Account MAXRESULTS 1000`
    });
    return response.json.QueryResponse.Account || [];
}

async function fetchRecentTransactions(client: any, realmId: string) {
    // Determine start date (30 days ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const dateStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // We fetch Expenses, Purchases, JournalEntries, Deposits
    // Note: This is simplified. In production, need pagination and multiple queries.
    const query = `select * from Purchase WHERE TxnDate > '${dateStr}' MAXRESULTS 1000`;

    const response = await client.makeApiCall({
        url: `https://${process.env.QBO_ENVIRONMENT === 'production' ? 'quickbooks.api.intuit.com' : 'sandbox-quickbooks.api.intuit.com'}/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`
    });

    return response.json.QueryResponse.Purchase || [];
}

async function saveAccounts(tenantId: string, accounts: any[]) {
    if (!accounts.length) return;

    const upsertData = accounts.map((acc: any) => ({
        tenant_id: tenantId,
        qbo_id: acc.Id,
        name: acc.Name,
        classification: acc.Classification,
        account_sub_type: acc.AccountSubType,
        description: acc.Description,
        // embedding: generateEmbedding(acc.Name) // TODO: Implement AI embedding generation later
    }));

    // Upsert chart_of_accounts
    const { error } = await supabaseAdmin
        .from('chart_of_accounts')
        .upsert(upsertData, { onConflict: 'tenant_id,qbo_id' });

    if (error) throw error;
}

async function saveTransactions(tenantId: string, transactions: any[]) {
    if (!transactions.length) return;

    const upsertData = transactions.map((txn: any) => {
        // Safe check for payee
        const payeeName = txn.EntityRef ? txn.EntityRef.name : (txn.AccountRef ? txn.AccountRef.name : 'Unknown');

        return {
            tenant_id: tenantId,
            qbo_id: txn.Id,
            transaction_date: txn.TxnDate,
            amount: txn.TotalAmt,
            description: txn.PrivateNote || txn.DocNumber || 'No description', // Fallbacks
            payee_name: payeeName,
            updated_at: new Date().toISOString()
        };
    });

    const { error } = await supabaseAdmin
        .from('transactions')
        .upsert(upsertData, {
            onConflict: 'tenant_id,qbo_id',
            ignoreDuplicates: false // We want to update amount/desc if changed in QBO
        });

    if (error) throw error;
}
