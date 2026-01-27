import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import TransactionReview from './transaction-review';

// Initialize Admin Client (for fetching safe data)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getReviewData(userId: string) {
    // 1. Get Tenant
    const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('id')
        .eq('owner_id', userId)
        .single();

    if (!tenant) return { transactions: [], accounts: [] };

    // 2. Get Pending Transactions + Joined Account Name
    const { data: transactions } = await supabaseAdmin
        .from('transactions')
        .select(`
            *,
            chart_of_accounts!ai_suggested_account_id(name)
        `)
        .eq('tenant_id', tenant.id)
        .eq('status', 'pending')
        .not('ai_suggested_account_id', 'is', null)
        .order('transaction_date', { ascending: false });

    // Format for client
    const formattedTransactions = transactions?.map((t: any) => ({
        ...t,
        suggested_account_name: t.chart_of_accounts?.name
    })) || [];

    // 3. Get All Accounts (for potential dropdown edit - strictly read only for now in MVP)
    const { data: accounts } = await supabaseAdmin
        .from('chart_of_accounts')
        .select('id, name')
        .eq('tenant_id', tenant.id)
        .order('name');

    return { transactions: formattedTransactions, accounts: accounts || [] };
}

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const { transactions, accounts } = await getReviewData(userId);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Transaction Review</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Review AI suggestions for your uncategorized transactions.
                    </p>
                </header>

                <main>
                    <TransactionReview transactions={transactions} accounts={accounts} />
                </main>
            </div>
        </div>
    );
}
