import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, SelectedCustomization, CartLineItem } from '../types/menu.types';
import { calculateGST } from '../utils/currency';

interface CartContextType {
  items: CartLineItem[];
  totalItemsCount: number;
  subtotal: number;
  gst: {
    subtotal: number;
    gstRatePercent: number;
    cgst: number;
    sgst: number;
    tax: number;
    total: number;
  };
  deliveryFee: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  addToCart: (menuItem: MenuItem, customization: SelectedCustomization, quantity?: number) => void;
  updateQuantity: (lineItemId: string, delta: number) => void;
  removeFromCart: (lineItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'estate1896_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartLineItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  // Generate deterministic line item ID for grouping identical customizations
  const generateLineId = (menuItem: MenuItem, customization: SelectedCustomization): string => {
    const extrasKey = customization.extras
      .map((e) => e.id)
      .sort()
      .join(',');
    return `${menuItem.id}__${customization.size || ''}__${customization.milk || ''}__${customization.sweetness || ''}__${customization.temperature || ''}__${customization.grind || ''}__${extrasKey}`;
  };

  // Add Item to Cart
  const addToCart = (menuItem: MenuItem, customization: SelectedCustomization, quantity: number = 1) => {
    const lineId = generateLineId(menuItem, customization);

    // Calculate unit price based on customizations
    const sizeDelta = customization.sizePriceDelta || 0;
    const milkDelta = customization.milkPriceDelta || 0;
    const extrasTotal = customization.extras.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = menuItem.price + sizeDelta + milkDelta + extrasTotal;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === lineId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
        return updated;
      } else {
        const newItem: CartLineItem = {
          id: lineId,
          menuItem,
          quantity,
          customization,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  // Update item quantity
  const updateQuantity = (lineItemId: string, delta: number) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === lineItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartLineItem => item !== null);
    });
  };

  // Remove item
  const removeFromCart = (lineItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== lineItemId));
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const gst = calculateGST(subtotal, 5.0);
  const deliveryFee = subtotal > 0 && subtotal < 500 ? 50 : 0;
  const total = subtotal > 0 ? gst.total + deliveryFee : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        gst,
        deliveryFee,
        total,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isHistoryOpen,
        setIsHistoryOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
