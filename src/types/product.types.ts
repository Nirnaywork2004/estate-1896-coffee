import { Database, OptionType } from './database.types';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductOptionRow = Database['public']['Tables']['product_options']['Row'];
export type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type StoreSettingsRow = Database['public']['Tables']['store_settings']['Row'];

export interface ProductOption {
  id: string;
  productId?: string;
  type: OptionType;
  name: string;
  priceModifier: number; // in ₹ INR
  isAvailable: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  roastLevel?: string;
  originRegion?: string;
  flavorNotes: string[];
  imageUrl: string;
  price: number; // in ₹ INR
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  options?: ProductOption[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  productsCount?: number;
}
