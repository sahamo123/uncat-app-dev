import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { CreditCard, Check, Zap, Server } from 'lucide-react';
import { redirect } from 'next/navigation';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getSubscription(userId: string) {
    // 1. Get Tenant
    const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('id')
        .eq('owner_id', userId)
        .single();

    if (!tenant) return null;

    // 2. Get Subscription
    const { data: sub } = await supabaseAdmin
        .from('tenant_subscriptions')
        .select('*')
        .eq('tenant_id', tenant.id)
        .single();

    return sub;
}

export default async function BillingPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const subscription = await getSubscription(userId);
    const isPro = subscription?.status === 'active' && subscription?.tier_name === 'Pro';

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your subscription and view usage limits.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Current Plan Card */}
                <div className="bg-card border rounded-xl p-8 shadow-sm relative overflow-hidden">
                    {isPro && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                            ACTIVE
                        </div>
                    )}
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" /> Current Plan
                    </h2>

                    <div className="mb-6">
                        <div className="text-4xl font-extrabold tracking-tight">
                            {isPro ? 'Pro Plan' : 'Free Tier'}
                        </div>
                        <div className="text-muted-foreground mt-1 font-medium">
                            {isPro ? '$50/month' : '$0/month'}
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        {isPro ? (
                            <>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="p-0.5 bg-green-100 text-green-700 rounded-full"><Check className="w-3 h-3" /></div>
                                    Unlimited AI Categorization
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="p-0.5 bg-green-100 text-green-700 rounded-full"><Check className="w-3 h-3" /></div>
                                    Advanced Reconciliation
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="p-0.5 bg-green-100 text-green-700 rounded-full"><Check className="w-3 h-3" /></div>
                                    Priority Support
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="p-0.5 bg-secondary text-secondary-foreground rounded-full"><Check className="w-3 h-3" /></div>
                                    Basic AI Categorization
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="p-0.5 bg-secondary text-secondary-foreground rounded-full"><Check className="w-3 h-3" /></div>
                                    Up to 50 transactions/mo
                                </div>
                            </>
                        )}
                    </div>

                    <form action={isPro ? '/api/stripe/portal' : '/api/stripe/checkout'} method="POST">
                        <button className={`w-full py-2.5 rounded-lg font-medium transition-colors shadow-sm ${isPro
                                ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            }`}>
                            {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
                        </button>
                    </form>
                </div>

                {/* Usage Stats */}
                <div className="space-y-6">
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" /> AI Credits Usage
                        </h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-bold">
                                {subscription?.usage_ai_credits || 0}
                            </span>
                            <span className="text-sm text-muted-foreground mb-1">/ {isPro ? 'Unlimited' : '100'}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${Math.min(((subscription?.usage_ai_credits || 0) / (isPro ? 10000 : 100)) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Credits reset on the 1st of every month.
                        </p>
                    </div>

                    <div className="bg-muted/30 border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center h-48">
                        <Server className="w-8 h-8 text-muted-foreground/50 mb-3" />
                        <p className="text-sm font-medium">Storage Usage</p>
                        <p className="text-xs text-muted-foreground">Coming soon in Q3</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
