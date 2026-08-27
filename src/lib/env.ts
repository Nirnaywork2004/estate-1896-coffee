/**
 * Safe Environment Variable Accessor
 */

export const env = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://cjsgvltczthumqqvukal.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  DEFAULT_CURRENCY: import.meta.env.VITE_DEFAULT_CURRENCY || 'INR',
  DEFAULT_COUNTRY_CODE: import.meta.env.VITE_DEFAULT_COUNTRY_CODE || '+91',
  STORE_NAME: import.meta.env.VITE_STORE_NAME || 'Estate 1896 Artisanal Coffee',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    env.SUPABASE_URL &&
    env.SUPABASE_PUBLISHABLE_KEY &&
    !env.SUPABASE_PUBLISHABLE_KEY.includes('placeholder_key')
  );
}
