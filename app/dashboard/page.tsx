import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import TransactionReview from './transaction-review';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getDashboardData(userId: string) {
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Get Tenant
    const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('id, name')
        .eq('owner_id', userId)
        .single();

    if (!tenant) return null;

    // 2. Parallel Data Fetching
    const [transactionsRes, accountsRes, qboRes] = await Promise.all([
        // Get Pending Transactions
        supabaseAdmin
            .from('transactions')
            .select('*, chart_of_accounts!ai_suggested_account_id(name)')
            .eq('tenant_id', tenant.id)
            .eq('status', 'pending')
            .not('ai_suggested_account_id', 'is', null)
            .order('transaction_date', { ascending: false })
            .limit(5), // Just show top 5 in widget

        // Get Accounts
        supabaseAdmin
            .from('chart_of_accounts')
            .select('id, name')
            .eq('tenant_id', tenant.id)
            .order('name'),

        // Check QBO Connection
        supabaseAdmin
            .from('qbo_connections')
            .select('status, last_synced_at')
            .eq('tenant_id', tenant.id)
            .single()
    ]);

    // Format Transactions
    const formattedTransactions = transactionsRes.data?.map((t: any) => ({
        ...t,
        suggested_account_name: t.chart_of_accounts?.name
    })) || [];

    return {
        tenantName: tenant.name,
        transactions: formattedTransactions,
        pendingCount: transactionsRes.data?.length || 0, // In real app, do a separate count query
        accounts: accountsRes.data || [],
        qboStatus: qboRes.data
    };
}

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const data = await getDashboardData(userId);

    // Onboarding State
    if (!data || !data.qboStatus) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-6">
                <Card className="border-2 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Welcome to {data?.tenantName || 'Uncat App'}</h2>
                        <p className="text-muted-foreground max-w-md mb-8">
                            Let's get your books on autopilot. Connect QuickBooks to start the AI categorization engine.
                        </p>
                        <Link href="/dashboard/connections">
                            <Button size="lg" className="gap-2">
                                Connect QuickBooks <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.pendingCount}</div>
                        <p className="text-xs text-muted-foreground">Transactions needing attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categorized</CardTitle>
                        <Sparkles className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,204</div>
                        <p className="text-xs text-muted-foreground">+180 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Receipts processed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sync Health</CardTitle>
                        <div className={`h-2.5 w-2.5 rounded-full ${data.qboStatus.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{data.qboStatus.status}</div>
                        <p className="text-xs text-muted-foreground">Last: {new Date(data.qboStatus.last_synced_at).toLocaleTimeString()}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Feed - Uncat Engine */}
                <Card className="col-span-4 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Uncat Arcade
                        </CardTitle>
                        <CardDescription>
                            Top priority transactions to review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <TransactionReview transactions={data.transactions} accounts={data.accounts} />
                        {data.transactions.length > 0 && (
                            <div className="mt-4 text-center">
                                <Link href="/dashboard/transactions">
                                    <Button variant="ghost" className="text-xs">View All Pending</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Side Widgets */}
                <div className="col-span-3 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Health</CardTitle>
                            <CardDescription>Estimated for this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                                    <p className="text-xl font-bold text-foreground">$12,450</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span>Profit Margin</span>
                                    <span className="font-semibold text-green-600">72%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[72%]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center">
                                        <div className="ml-auto text-xs text-muted-foreground">2m ago</div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Synced with QuickBooks</p>
                                            <p className="text-xs text-muted-foreground">
                                                Imported 12 new transactions.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
