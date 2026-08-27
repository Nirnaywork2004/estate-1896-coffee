import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';
import { Category } from '../types/product.types';
import { MOCK_CATEGORIES } from '../data/mockCategories';

export const categoriesService = {
  /**
   * Fetch all active categories sorted by sort_order
   */
  async getActiveCategories(): Promise<{ data: Category[]; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: MOCK_CATEGORIES, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch categories error, falling back to mock data:', error.message);
        return { data: MOCK_CATEGORIES, error: null };
      }

      const formatted: Category[] = ((data as any[]) || []).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || undefined,
        imageUrl: c.image_url || undefined,
        sortOrder: c.sort_order,
        isActive: c.is_active,
      }));

      return { data: formatted.length > 0 ? formatted : MOCK_CATEGORIES, error: null };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: MOCK_CATEGORIES, error };
    }
  },
};
