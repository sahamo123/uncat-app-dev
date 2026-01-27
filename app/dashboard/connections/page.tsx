import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle2, XCircle, RefreshCw, Link2Off, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import SyncButton from './sync-button';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getConnectionStatus(userId: string) {
    const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select(`
            id, 
            business_name,
            qbo_realm_id,
            qbo_connections (
                updated_at,
                access_token_expires_at
            )
        `)
        .eq('owner_id', userId)
        .single();

    if (!tenant) return null;

    const connection = tenant.qbo_connections?.[0]; // One-to-many in DB but usually 1:1 logic
    const isConnected = !!connection;

    return {
        tenantId: tenant.id,
        businessName: tenant.business_name,
        realmId: tenant.qbo_realm_id,
        isConnected,
        lastSynced: connection?.updated_at,
    };
}

export default async function ConnectionsPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const status = await getConnectionStatus(userId);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Connections</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your integrations with external services.
                </p>
            </div>

            <div className="grid gap-6">
                {/* QuickBooks Card */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#2CA01C] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                qb
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">QuickBooks Online</h2>
                                <p className="text-sm text-muted-foreground">
                                    Sync transactions and chart of accounts.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {status?.isConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-200 dark:border-green-800">
                                    <CheckCircle2 className="w-3 h-3" /> Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-xs font-medium border">
                                    <XCircle className="w-3 h-3" /> Disconnected
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        {status?.isConnected ? (
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-muted/50 rounded-lg border">
                                        <span className="block text-muted-foreground text-xs mb-1">Business Name</span>
                                        <span className="font-medium">{status.businessName}</span>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border">
                                        <span className="block text-muted-foreground text-xs mb-1">Company ID (Realm)</span>
                                        <span className="font-mono text-xs">{status.realmId}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {/* Sync Actions */}
                                    <SyncButton />

                                    <button disabled className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
                                        <Link2Off className="w-4 h-4" /> Disconnect
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    Last synced: {status.lastSynced ? new Date(status.lastSynced).toLocaleString() : 'Never'}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-muted-foreground mb-4 max-w-lg">
                                    Connect your QuickBooks Online account to automatically import transactions and use AI categorization. Use Sandbox credentials for testing.
                                </p>
                                <a
                                    href="/api/qbo/connect"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2CA01C] hover:bg-[#238016] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                                >
                                    <ExternalLink className="w-4 h-4" /> Connect to QuickBooks
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
