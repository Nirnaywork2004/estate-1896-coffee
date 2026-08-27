import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';

/**
 * Supabase Auth Service Architecture
 * Ready for future Email/Password and Magic Link authentication.
 * Browsing and cart usage remain completely open to guest visitors.
 */
export const authService = {
  /**
   * Get current authenticated user session
   */
  async getSession() {
    if (!isSupabaseConfigured()) return { session: null, error: null };
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  /**
   * Get current user
   */
  async getUser() {
    if (!isSupabaseConfigured()) return { user: null, error: null };
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },

  /**
   * Prepare for future Magic Link (Passwordless OTP / Email link)
   */
  async signInWithOtp(email: string, redirectTo?: string) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured yet.') };
    }
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || window.location.origin,
      },
    });
  },

  /**
   * Prepare for future Email & Password sign-in
   */
  async signInWithPassword(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured yet.') };
    }
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  /**
   * Prepare for future User sign-up
   */
  async signUp(email: string, password: string, fullName?: string, phone?: string) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured yet.') };
    }
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });
  },

  /**
   * Sign out
   */
  async signOut() {
    if (!isSupabaseConfigured()) return { error: null };
    return await supabase.auth.signOut();
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};
