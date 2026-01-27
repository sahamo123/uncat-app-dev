import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { transactionId, action, accountId, reasoning } = await req.json();

        // 1. Validate Tenant Ownership (Security)
        // Find tenant owned by this user
        const { data: tenant } = await supabaseAdmin
            .from('tenants')
            .select('id')
            .eq('owner_id', userId)
            .single();

        if (!tenant) return new NextResponse("Tenant not found", { status: 404 });

        // 2. Perform Action
        if (action === 'approve') {
            // For "approve", we take the AI suggestion (which is already in the DB columns?)
            // Actually, the UI might send the accountId explicitly to be safe, or we use the suggested one.
            // Let's assume the UI sends the final approved accountId.

            if (!accountId) return new NextResponse("Account ID required", { status: 400 });

            const { error } = await supabaseAdmin
                .from('transactions')
                .update({
                    assigned_account_id: accountId,
                    status: 'approved',
                    // We could also clear the AI columns or keep them for history
                    updated_at: new Date().toISOString()
                })
                .eq('id', transactionId)
                .eq('tenant_id', tenant.id); // Extra safety

            if (error) throw error;
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("[REVIEW_ERROR]", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
