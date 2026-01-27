import { NextResponse } from 'next/server';
import { getQBOClient } from '@/lib/quickbooks';
import { createClient } from '@supabase/supabase-js';

// Initialize Admin Supabase Client to bypass RLS for token storage
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state'); // This is the userId
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');

    if (!state || !code || !realmId) {
        return new NextResponse("Missing required parameters", { status: 400 });
    }

    try {
        const oauthClient = getQBOClient();

        // Exchange code for tokens
        // functionality of intuit-oauth createToken expects the full URL
        const authResponse = await oauthClient.createToken(req.url);
        const token = authResponse.getJson();

        // 1. Get or Create Tenant for this User
        // In a real app, the user would select which client they are connecting.
        // For now, we will find the first tenant owned by this user or create "My QBO Business"
        let tenantId: string;

        const { data: existingTenants } = await supabaseAdmin
            .from('tenants')
            .select('id')
            .eq('owner_id', state)
            .limit(1);

        if (existingTenants && existingTenants.length > 0) {
            tenantId = existingTenants[0].id;
        } else {
            const { data: newTenant, error: createError } = await supabaseAdmin
                .from('tenants')
                .insert({
                    owner_id: state,
                    business_name: 'My QBO Business', // Placeholder, will update from QBO later
                    qbo_realm_id: realmId
                })
                .select()
                .single();

            if (createError) throw createError;
            tenantId = newTenant.id;
        }

        // 2. Save tokens to qbo_connections
        // Upsert to handle re-connections
        const { error: connectionError } = await supabaseAdmin
            .from('qbo_connections')
            .upsert({
                tenant_id: tenantId,
                realm_id: realmId,
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                access_token_expires_at: new Date(Date.now() + (token.expires_in * 1000)).toISOString(),
                refresh_token_expires_at: new Date(Date.now() + (token.x_refresh_token_expires_in * 1000)).toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'tenant_id' });

        if (connectionError) throw connectionError;

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?qbo_connected=true`);

    } catch (error: any) {
        console.error("[QBO_CALLBACK_ERROR]", error);
        return new NextResponse(`Callback Error: ${error.message || error}`, { status: 500 });
    }
}
