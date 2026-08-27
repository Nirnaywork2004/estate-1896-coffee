import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';
import { CheckoutPayload, PlacedOrder } from '../types/order.types';
import { CartLineItem, SelectedCustomization } from '../types/menu.types';
import { MENU_ITEMS } from '../data/menuData';

const ORDER_HISTORY_STORAGE_KEY = 'estate1896_order_history_v1';

// UUID validation regex (standard 8-4-4-4-12 hex format)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Format cart customization options into structured database JSON
 */
function formatSelectedOptions(customization: SelectedCustomization) {
  const options: Array<{ type: string; name: string; price_modifier: number }> = [];

  if (customization.size) {
    options.push({
      type: 'size',
      name: customization.size,
      price_modifier: customization.sizePriceDelta || 0,
    });
  }

  if (customization.milk) {
    options.push({
      type: 'milk',
      name: customization.milk,
      price_modifier: customization.milkPriceDelta || 0,
    });
  }

  if (customization.sweetness) {
    options.push({
      type: 'sweetness',
      name: customization.sweetness,
      price_modifier: 0,
    });
  }

  if (customization.temperature) {
    options.push({
      type: 'temperature',
      name: customization.temperature,
      price_modifier: 0,
    });
  }

  if (customization.grind) {
    options.push({
      type: 'grind',
      name: customization.grind,
      price_modifier: 0,
    });
  }

  if (customization.extras && Array.isArray(customization.extras)) {
    customization.extras.forEach((extra) => {
      options.push({
        type: 'extras',
        name: extra.name,
        price_modifier: extra.price,
      });
    });
  }

  if (customization.specialInstructions) {
    options.push({
      type: 'instructions',
      name: customization.specialInstructions,
      price_modifier: 0,
    });
  }

  return options;
}

/**
 * Resolve a valid canonical product UUID for a cart line item
 * - Matches by ID, name, or slug against Supabase DB products.
 * - Matches against canonical MENU_ITEMS.
 * - Validates UUID format.
 */
function resolveProductId(
  line: CartLineItem,
  dbProducts: Array<{ id: string; name: string; slug?: string }>
): string | null {
  const itemId = line.menuItem.id;

  // 1. If DB products exist, find matching product in the DB
  if (dbProducts && dbProducts.length > 0) {
    const slugFromId = itemId.replace(/^prod-/, '');
    const matched = dbProducts.find(
      (p) =>
        p.id === itemId ||
        (p.slug && p.slug.toLowerCase() === slugFromId.toLowerCase()) ||
        p.name.toLowerCase() === line.menuItem.name.toLowerCase()
    );

    if (matched && UUID_REGEX.test(matched.id)) {
      return matched.id;
    }
  }

  // 2. If line.menuItem.id is already a valid UUID, use it directly
  if (UUID_REGEX.test(itemId)) {
    return itemId;
  }

  // 3. Match against canonical MENU_ITEMS by name or ID
  const canonical = MENU_ITEMS.find(
    (m) =>
      m.name.toLowerCase() === line.menuItem.name.toLowerCase() ||
      m.id === itemId
  );
  if (canonical && UUID_REGEX.test(canonical.id)) {
    return canonical.id;
  }

  return null;
}

export const ordersService = {
  /**
   * Save order locally to browser storage for instant guest history tracking
   */
  saveOrderToLocalHistory(order: PlacedOrder) {
    try {
      const existing = this.getLocalOrderHistory();
      const updated = [order, ...existing.filter((o) => o.id !== order.id)];
      localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save order to local history:', e);
    }
  },

  /**
   * Retrieve locally stored order history
   */
  getLocalOrderHistory(): PlacedOrder[] {
    try {
      const saved = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to retrieve local order history:', e);
      return [];
    }
  },

  /**
   * Create a transactional order in Supabase (orders + order_items) and local storage
   */
  async placeOrder(payload: CheckoutPayload): Promise<{ data: PlacedOrder | null; error: Error | null }> {
    const timestamp = Date.now();
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${timestamp.toString().slice(-4)}`;
    const orderId = `ord_${timestamp}_${Math.random().toString(36).slice(2, 7)}`;

    const estimatedTimeMinutes =
      payload.orderType === 'dine_in'
        ? 12
        : payload.orderType === 'takeaway'
        ? 15
        : payload.orderType === 'pickup'
        ? 20
        : 35; // Delivery

    const isOnlinePaid = (payload.paymentMethod === 'upi' || payload.paymentMethod === 'card') && !!payload.razorpayPaymentId;
    const paymentStatus = payload.paymentMethod === 'cash_on_pickup' ? 'pending' : (isOnlinePaid ? 'completed' : 'completed');

    const placedOrder: PlacedOrder = {
      id: orderId,
      orderNumber,
      orderType: payload.orderType,
      orderStatus: 'order_placed',
      paymentMethod: payload.paymentMethod,
      paymentStatus,
      customer: payload.customer,
      dineIn: payload.dineIn,
      pickup: payload.pickup,
      deliveryAddress: payload.deliveryAddress,
      items: payload.items,
      subtotal: payload.subtotal,
      tax: payload.tax,
      deliveryFee: payload.deliveryFee,
      discountAmount: payload.discountAmount,
      total: payload.total,
      estimatedTimeMinutes,
      createdAt: new Date().toISOString(),
      razorpayOrderId: payload.razorpayOrderId,
      razorpayPaymentId: payload.razorpayPaymentId,
    };

    // If Supabase is configured, sync order and all order items to PostgreSQL database
    if (isSupabaseConfigured()) {
      try {
        // Fetch existing products from DB to validate and map foreign keys
        let dbProducts: Array<{ id: string; name: string; slug?: string }> = [];
        try {
          const { data } = await (supabase.from('products') as any).select('id, name, slug');
          if (data && Array.isArray(data)) {
            dbProducts = data;
          }
        } catch (e) {
          console.warn('Could not fetch DB products for mapping:', e);
        }

        // STEP 1: Pre-validate all cart items with diagnostic logging
        for (const line of payload.items) {
          const resolvedId = resolveProductId(line, dbProducts);
          
          console.log({
            productName: line.menuItem.name,
            product_id: resolvedId,
            quantity: line.quantity,
            unit_price: line.unitPrice,
          });

          if (!resolvedId) {
            const errorMsg = `Product "${line.menuItem.name}" is missing a valid product_id.`;
            console.error(errorMsg);
            return { data: null, error: new Error(errorMsg) };
          }
          if (!line.quantity || line.quantity <= 0) {
            const errorMsg = `Product "${line.menuItem.name}" has an invalid quantity (${line.quantity}).`;
            console.error(errorMsg);
            return { data: null, error: new Error(errorMsg) };
          }
        }

        // STEP 2: Insert main order row into `orders`
        const notesArray = [
          payload.customer.notes,
          payload.razorpayPaymentId ? `Razorpay Payment ID: ${payload.razorpayPaymentId}` : null,
          payload.razorpayOrderId ? `Razorpay Order ID: ${payload.razorpayOrderId}` : null,
        ].filter(Boolean);

        const orderRecord: any = {
          order_number: orderNumber,
          customer_name: payload.customer.fullName,
          customer_phone: payload.customer.phone,
          customer_email: payload.customer.email || null,
          order_type: payload.orderType,
          table_number: payload.dineIn?.tableNumber || null,
          subtotal: payload.subtotal,
          delivery_fee: payload.deliveryFee,
          discount: payload.discountAmount,
          tax: payload.tax,
          total: payload.total,
          payment_method: payload.paymentMethod,
          payment_status: placedOrder.paymentStatus,
          order_status: 'order_placed',
          delivery_address: payload.deliveryAddress ? JSON.parse(JSON.stringify(payload.deliveryAddress)) : null,
          notes: notesArray.length > 0 ? notesArray.join(' | ') : null,
        };

        const { data: dbOrder, error: orderError } = await (supabase.from('orders') as any)
          .insert(orderRecord)
          .select('id, order_number')
          .single();

        if (orderError) {
          console.error('Supabase order insert error:', orderError.message);
          return { data: null, error: new Error(orderError.message) };
        }

        if (!dbOrder?.id) {
          return { data: null, error: new Error('Order creation failed: No order ID returned.') };
        }

        placedOrder.id = dbOrder.id;

        // STEP 3: Build and insert order_items rows
        const itemsPayload = payload.items.map((line) => {
          const resolvedId = resolveProductId(line, dbProducts)!;
          const selectedOptions = formatSelectedOptions(line.customization);
          const unitPrice = line.unitPrice;
          const quantity = line.quantity;
          const totalPrice = line.totalPrice || unitPrice * quantity;

          return {
            order_id: dbOrder.id,
            product_id: resolvedId,
            product_name: line.menuItem.name,
            quantity,
            unit_price: unitPrice,
            total_price: totalPrice,
            selected_options: selectedOptions,
          };
        });

        // STEP 4: Insert all items in a single batch
        const { error: itemsError } = await (supabase.from('order_items') as any).insert(itemsPayload);

        if (itemsError) {
          console.error('Supabase order_items insert error:', itemsError.message);
          return { data: null, error: new Error(`Order items could not be saved: ${itemsError.message}`) };
        }
      } catch (err) {
        console.error('Supabase order placement exception:', err);
        return { data: null, error: err as Error };
      }
    }

    // Always cache locally so the customer gets instant receipt & status tracking
    this.saveOrderToLocalHistory(placedOrder);

    return { data: placedOrder, error: null };
  },

  /**
   * Fetch active status for a given order number
   */
  async getOrderStatus(orderNumber: string): Promise<PlacedOrder | null> {
    const localOrders = this.getLocalOrderHistory();
    const found = localOrders.find((o) => o.orderNumber === orderNumber);
    if (found) return found;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from('orders') as any)
          .select('*, order_items(*)')
          .eq('order_number', orderNumber)
          .single();

        if (data && !error) {
          const mappedItems: CartLineItem[] =
            data.order_items && Array.isArray(data.order_items) && data.order_items.length > 0
              ? data.order_items.map((it: any) => ({
                  id: it.id,
                  menuItem: {
                    id: it.product_id || it.id,
                    name: it.product_name,
                    category: 'coffee',
                    categoryLabel: 'Coffee',
                    description: '',
                    price: Number(it.unit_price),
                    image: '/images/hero-pour.jpg',
                    isVeg: true,
                  },
                  quantity: it.quantity,
                  unitPrice: Number(it.unit_price),
                  totalPrice: Number(it.total_price),
                  customization: {
                    extras: [],
                  },
                }))
              : [];

          return {
            id: data.id,
            orderNumber: data.order_number,
            orderType: data.order_type as any,
            orderStatus: data.order_status as any,
            paymentMethod: data.payment_method as any,
            paymentStatus: data.payment_status as any,
            customer: {
              fullName: data.customer_name,
              phone: data.customer_phone,
              email: data.customer_email || '',
              notes: data.notes || undefined,
            },
            dineIn: data.table_number ? { tableNumber: data.table_number } : undefined,
            deliveryAddress: data.delivery_address as any,
            items: mappedItems,
            subtotal: Number(data.subtotal),
            tax: Number(data.tax),
            deliveryFee: Number(data.delivery_fee),
            discountAmount: Number(data.discount),
            total: Number(data.total),
            estimatedTimeMinutes: 20,
            createdAt: data.created_at,
          };
        }
      } catch (e) {
        console.error('Error fetching order status from Supabase:', e);
      }
    }

    return null;
  },
};
