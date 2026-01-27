import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        // 1. Get Customer ID from DB
        const { data: sub } = await supabaseAdmin
            .from('tenant_subscriptions')
            .select('stripe_customer_id')
            .eq('tenant_id', (
                await supabaseAdmin
                    .from('tenants')
                    .select('id')
                    .eq('owner_id', userId)
                    .single()
            ).data?.id
            ) // Simplified nested query logic
            .single();

        if (!sub?.stripe_customer_id) {
            return new NextResponse("No subscription found", { status: 404 });
        }

        // 2. Create Portal Session
        const session = await stripe.billingPortal.sessions.create({
            customer: sub.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
        });

        return NextResponse.redirect(session.url);

    } catch (error: any) {
        console.error("[STRIPE_PORTAL]", error);
        return new NextResponse(`Portal Error: ${error.message}`, { status: 500 });
    }
}
