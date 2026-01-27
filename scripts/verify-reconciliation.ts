import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const categorizePath = '../lib/ai/categorize';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyReconciliation() {
    console.log("🧪 Starting Reconciliation Rule Verification...");

    // 1. Setup Tenant
    const { data: tenant } = await supabase
        .from('tenants')
        .insert({ business_name: 'Rule Test Corp', industry: 'Retail' })
        .select('id').single();
    if (!tenant) throw new Error("Tenant creation failed");

    // 2. Setup Accounts
    const { data: stripeAcct } = await supabase.from('chart_of_accounts').insert({
        tenant_id: tenant.id,
        qbo_id: '101',
        name: 'Stripe Clearing',
        classification: 'Asset',
        description: 'Undeposited funds from Stripe'
    }).select('id').single();
    if (!stripeAcct) throw new Error("Account creation failed");

    // 3. Create Rule
    console.log("📏 Creating Rule: 'Stripe' -> 'Stripe Clearing'");
    await supabase.from('reconciliation_rules').insert({
        tenant_id: tenant.id,
        keyword: 'Stripe',
        target_account_id: stripeAcct.id,
        match_type: 'transfer'
    });

    // 4. Create Transaction
    const { data: txn } = await supabase.from('transactions').insert({
        tenant_id: tenant.id,
        qbo_id: `rule_txn_${Date.now()}`,
        payee_name: 'Stripe Payments',
        description: 'Weekly Payout',
        amount: 1500.00,
        status: 'pending'
    }).select('id').single();
    if (!txn) throw new Error("Transaction creation failed");

    // 5. Run Logic
    console.log("🤖 Running Logic...");
    const { processUncategorizedTransactions } = await import(categorizePath);
    await processUncategorizedTransactions(tenant.id);

    // 6. Verify
    const { data: result } = await supabase
        .from('transactions')
        .select('ai_suggested_account_id, ai_reasoning, ai_confidence_score')
        .eq('id', txn.id)
        .single();
    if (!result) throw new Error("Result fetching failed");

    console.log("\n📊 Result:");
    console.log(`   - Suggested ID: ${result.ai_suggested_account_id}`);
    console.log(`   - Reasoning: ${result.ai_reasoning}`);
    console.log(`   - Confidence: ${result.ai_confidence_score}`);

    if (result.ai_suggested_account_id === stripeAcct.id && result.ai_confidence_score === 1) {
        console.log("\n✅ Rule Verification Passed!");
    } else {
        console.error("\n❌ Rule Verification Failed!");
        process.exit(1);
    }

    // Cleanup
    await supabase.from('reconciliation_rules').delete().eq('tenant_id', tenant.id);
    await supabase.from('transactions').delete().eq('tenant_id', tenant.id);
    await supabase.from('chart_of_accounts').delete().eq('tenant_id', tenant.id);
    await supabase.from('tenants').delete().eq('id', tenant.id);
}

verifyReconciliation();
