import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from './supabase-admin';

export type UserRole = 'platform_admin' | 'tenant_admin' | 'tenant_user' | 'tenant_client';

export interface UserProfile {
    id: string;
    full_name: string;
    email: string; // Add email to profiles if not there, or fetch from Clerk
    role: UserRole;
    tenant_id: string;
}

export async function getCurrentUserRole(): Promise<UserProfile | null> {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = getSupabaseAdmin();

    // Fetch profile from Supabase
    // Note: 'email' might not be in user_profiles yet based on schema, 
    // but useful to have. For now finding by ID is key.
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return profile as UserProfile;
}

export async function isPlatformAdmin(): Promise<boolean> {
    const profile = await getCurrentUserRole();
    return profile?.role === 'platform_admin';
}

export async function checkRole(allowedRoles: UserRole[]): Promise<boolean> {
    const profile = await getCurrentUserRole();
    if (!profile) return false;
    return allowedRoles.includes(profile.role);
}
