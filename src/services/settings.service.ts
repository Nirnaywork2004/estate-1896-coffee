import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';
import { STORE_CONFIG } from '../data/storeConfig';

export const settingsService = {
  /**
   * Fetch public store settings (hours, UPI config, contact)
   */
  async getPublicSettings(): Promise<{ data: any; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: STORE_CONFIG, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('key, value')
        .eq('is_public', true);

      if (error || !data || data.length === 0) {
        return { data: STORE_CONFIG, error: null };
      }

      const settingsMap: Record<string, any> = {};
      ((data as any[]) || []).forEach((row) => {
        settingsMap[row.key] = row.value;
      });

      return { data: settingsMap, error: null };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: STORE_CONFIG, error };
    }
  },
};
