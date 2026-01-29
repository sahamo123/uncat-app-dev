import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(_req: Request) {
    const supabaseAdmin = getSupabaseAdmin();
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Get Tenant & Existing Customer ID
        const { data: tenant } = await supabaseAdmin
            .from('tenants')
            .select(`
                id, 
                tenant_subscriptions(stripe_customer_id)
            `)
            .eq('owner_id', userId)
            .single();

        if (!tenant) return new NextResponse("Tenant not found", { status: 404 });

        let customerId = tenant.tenant_subscriptions?.[0]?.stripe_customer_id;

        // 2. Create Customer if needed
        if (!customerId) {
            const customer = await getStripe().customers.create({
                email: user.emailAddresses[0].emailAddress,
                metadata: {
                    tenantId: tenant.id,
                    userId: userId
                }
            });
            customerId = customer.id;

            // Save to DB (init subscription record)
            await supabaseAdmin
                .from('tenant_subscriptions')
                .upsert({
                    tenant_id: tenant.id,
                    stripe_customer_id: customerId,
                    status: 'incomplete', // Will be updated by webhook
                    updated_at: new Date().toISOString()
                }, { onConflict: 'tenant_id' });
        }

        // 3. Create Checkout Session
        const session = await getStripe().checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID_PRO,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
            subscription_data: {
                metadata: {
                    tenantId: tenant.id
                }
            }
        });

        if (!session.url) throw new Error("Failed to create checkout session");

        return NextResponse.redirect(session.url);

    } catch (error: any) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse(`Checkout Error: ${error.message}`, { status: 500 });
    }
}
