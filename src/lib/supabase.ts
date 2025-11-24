import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Skip validation during build (when NEXT_PHASE is 'phase-production-build')
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      (process.env.NODE_ENV === 'production' && !process.env.VERCEL);

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isBuildTime) {
      // Return a dummy client during build to avoid errors
      supabaseInstance = createClient('https://dummy.supabase.co', 'dummy-key-for-build');
      return supabaseInstance;
    }
    throw new Error('Missing Supabase environment variables');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

  // Skip validation during build
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      (process.env.NODE_ENV === 'production' && !process.env.VERCEL);

  if (!supabaseUrl || !serviceRoleKey) {
    if (isBuildTime) {
      // Return a dummy client during build to avoid errors
      supabaseAdminInstance = createClient('https://dummy.supabase.co', 'dummy-key-for-build');
      return supabaseAdminInstance;
    }
    throw new Error('Missing Supabase environment variables');
  }

  supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey);
  return supabaseAdminInstance;
}

// Export proxies that lazily initialize Supabase clients only when accessed
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabase();
    const value = instance[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabaseAdmin();
    const value = instance[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

