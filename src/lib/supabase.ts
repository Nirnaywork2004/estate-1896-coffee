import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { env, isSupabaseConfigured } from './env';

/**
 * Dedicated Supabase Client Singleton
 * Initialized with strict typing from Database schema definitions.
 */

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY || 'dummy-key-for-initialization';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface SupabaseHealthStatus {
  isConfigured: boolean;
  url: string;
  projectId: string;
  isConnected: boolean;
  latencyMs?: number;
  errorMessage?: string;
}

/**
 * Health check function to verify connectivity with Supabase backend
 */
export async function checkSupabaseConnection(): Promise<SupabaseHealthStatus> {
  const isConfigured = isSupabaseConfigured();
  const projectId = supabaseUrl.replace('https://', '').split('.')[0] || 'cjsgvltczthumqqvukal';

  if (!isConfigured) {
    return {
      isConfigured: false,
      url: supabaseUrl,
      projectId,
      isConnected: false,
      errorMessage: 'Publishable API key is not set or using placeholder.',
    };
  }

  const startTime = performance.now();
  try {
    // Attempt a lightweight public select query to test connection
    const { error } = await supabase.from('categories').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      // If table doesn't exist yet, it's connected to Supabase but unmigrated
      if (error.code === '42P01') {
        return {
          isConfigured: true,
          url: supabaseUrl,
          projectId,
          isConnected: true,
          latencyMs,
          errorMessage: 'Database connected. Migration schema needs to be run in Supabase SQL editor.',
        };
      }
      return {
        isConfigured: true,
        url: supabaseUrl,
        projectId,
        isConnected: false,
        latencyMs,
        errorMessage: error.message,
      };
    }

    return {
      isConfigured: true,
      url: supabaseUrl,
      projectId,
      isConnected: true,
      latencyMs,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      isConfigured: true,
      url: supabaseUrl,
      projectId,
      isConnected: false,
      errorMessage: error.message || 'Unknown network error',
    };
  }
}
