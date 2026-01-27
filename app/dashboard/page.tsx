import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

    // 4. Check Connection Status
    const { count } = await supabaseAdmin
        .from('qbo_connections')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id);

    return {
        transactions: formattedTransactions,
        accounts: accounts || [],
        isConnected: (count || 0) > 0
    };
}

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const { transactions, accounts, isConnected } = await getReviewData(userId);

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto mt-10">
                <div className="bg-card border rounded-xl p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🔌</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Welcome to Uncat App</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                        Connect QuickBooks Online to start the AI categorization game.
                    </p>
                    <Link
                        href="/dashboard/connections"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                    >
                        Connect QuickBooks <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Review Transactions</h1>
                    <p className="text-muted-foreground mt-1">
                        AI has suggestions for <span className="font-semibold text-foreground">{transactions.length}</span> transactions.
                    </p>
                </div>
                <Link href="/dashboard/connections" className="text-sm font-medium text-primary hover:underline">
                    Manage Connections
                </Link>
            </header>

            <main>
                <TransactionReview transactions={transactions} accounts={accounts} />
            </main>
        </div>
    );
}
