import { createClient } from '@supabase/supabase-js';

let supabaseAdminInstance: any = null;

export const getSupabaseAdmin = () => {
    if (supabaseAdminInstance) return supabaseAdminInstance;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        // We log a warning instead of throwing during build time if possible,
        // but since we only call this inside functions (runtime), 
        // it should only throw if keys are really missing at runtime.
        throw new Error('Supabase URL or Service Role Key is missing.');
    }

    supabaseAdminInstance = createClient(url, key);
    return supabaseAdminInstance;
};
