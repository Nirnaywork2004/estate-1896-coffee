import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';
import { Product, ProductOption } from '../types/product.types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export const productsService = {
  /**
   * Fetch all available products with optional category filtering
   */
  async getProducts(categoryId?: string): Promise<{ data: Product[]; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const filtered = categoryId
        ? MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId)
        : MOCK_PRODUCTS;
      return { data: filtered, error: null };
    }

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_options (*)
        `)
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase fetch products error, using fallback:', error.message);
        const filtered = categoryId
          ? MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId)
          : MOCK_PRODUCTS;
        return { data: filtered, error: null };
      }

      const products: Product[] = (data || []).map((p: any) => {
        const options: ProductOption[] = (p.product_options || [])
          .filter((opt: any) => opt.is_available)
          .map((opt: any) => ({
            id: opt.id,
            productId: opt.product_id,
            type: opt.option_type,
            name: opt.option_name,
            priceModifier: Number(opt.price_modifier),
            isAvailable: opt.is_available,
          }));

        return {
          id: p.id,
          categoryId: p.category_id,
          categoryName: p.categories?.name,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          roastLevel: p.roast_level || undefined,
          originRegion: p.origin_region || undefined,
          flavorNotes: p.flavor_notes || [],
          imageUrl: p.image_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000',
          price: Number(p.price),
          isAvailable: p.is_available,
          isFeatured: p.is_featured,
          sortOrder: p.sort_order,
          options,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        };
      });

      return {
        data: products.length > 0 ? products : MOCK_PRODUCTS,
        error: null,
      };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: MOCK_PRODUCTS, error };
    }
  },

  /**
   * Fetch featured products for the spotlight section
   */
  async getFeaturedProducts(): Promise<{ data: Product[]; error: Error | null }> {
    const { data, error } = await this.getProducts();
    const featured = data.filter((p) => p.isFeatured);
    return { data: featured.length > 0 ? featured : data.slice(0, 3), error };
  },

  /**
   * Fetch single product by slug
   */
  async getProductBySlug(slug: string): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.getProducts();
    const found = data.find((p) => p.slug === slug) || null;
    return { data: found, error };
  },
};
