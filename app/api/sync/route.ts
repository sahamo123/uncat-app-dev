import { NextResponse } from 'next/server';
import { performSync } from '@/lib/qbo-sync';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Init DB to find tenant from user
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
        // 1. Find Tenant for this User (assuming owner for now)
        // In future, this should use user_profiles or organization context
        const { data: tenant, error: tenantError } = await supabaseAdmin
            .from('tenants')
            .select('id')
            .eq('owner_id', userId)
            .single();

        if (tenantError || !tenant) {
            return new NextResponse("No tenant found for this user", { status: 404 });
        }

        // 2. Trigger Sync
        const result = await performSync(tenant.id);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("[SYNC_ERROR]", error);
        return new NextResponse(`Sync Failed: ${error.message}`, { status: 500 });
    }
}
