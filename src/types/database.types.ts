export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderType = 'dine_in' | 'takeaway' | 'pickup' | 'delivery';
export type PaymentMethod = 'upi' | 'card' | 'cash_on_pickup';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type OrderStatus =
  | 'order_placed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';
export type OptionType = 'size' | 'milk' | 'extras' | 'grind' | 'brewing_method';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          default_address: Json | null;
          role: 'customer' | 'staff' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          default_address?: Json | null;
          role?: 'customer' | 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          default_address?: Json | null;
          role?: 'customer' | 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          roast_level: string | null;
          origin_region: string | null;
          flavor_notes: string[];
          image_url: string | null;
          price: number;
          is_available: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          roast_level?: string | null;
          origin_region?: string | null;
          flavor_notes?: string[];
          image_url?: string | null;
          price: number;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          roast_level?: string | null;
          origin_region?: string | null;
          flavor_notes?: string[];
          image_url?: string | null;
          price?: number;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_options: {
        Row: {
          id: string;
          product_id: string | null;
          option_type: OptionType;
          option_name: string;
          price_modifier: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          option_type: OptionType;
          option_name: string;
          price_modifier?: number;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          option_type?: OptionType;
          option_name?: string;
          price_modifier?: number;
          is_available?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          order_type: OrderType;
          table_number: string | null;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          tax: number;
          total: number;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          order_status: OrderStatus;
          delivery_address: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          order_type?: OrderType;
          table_number?: string | null;
          subtotal: number;
          delivery_fee?: number;
          discount?: number;
          tax?: number;
          total: number;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          delivery_address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          order_type?: OrderType;
          table_number?: string | null;
          subtotal?: number;
          delivery_fee?: number;
          discount?: number;
          tax?: number;
          total?: number;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          delivery_address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          selected_options: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          selected_options?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          selected_options?: Json;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string | null;
          user_id: string | null;
          author_name: string;
          rating: number;
          title: string | null;
          comment: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          user_id?: string | null;
          author_name: string;
          rating: number;
          title?: string | null;
          comment: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          user_id?: string | null;
          author_name?: string;
          rating?: number;
          title?: string | null;
          comment?: string;
          is_published?: boolean;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          is_public: boolean;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          is_public?: boolean;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          is_public?: boolean;
          description?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
