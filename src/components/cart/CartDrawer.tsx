import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { Button } from '../ui/Button';
import { X, Plus, Minus, Trash2, ShoppingBag, Send, ArrowRight } from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalItemsCount,
    subtotal,
    gst,
    deliveryFee,
    total,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // WhatsApp order link preview
  const whatsappUrl = generateWhatsAppOrderUrl({
    storePhone: '9845018960',
    customerName: 'Café Guest',
    orderType: 'takeaway',
    items: items.map((line) => {
      const selectedOptionsSummary = [
        line.customization.size ? { type: 'size', name: line.customization.size, priceModifier: line.customization.sizePriceDelta || 0 } : null,
        line.customization.milk ? { type: 'milk', name: line.customization.milk, priceModifier: line.customization.milkPriceDelta || 0 } : null,
        line.customization.temperature ? { type: 'temp', name: line.customization.temperature, priceModifier: 0 } : null,
        ...line.customization.extras.map((e) => ({ type: 'extra', name: e.name, priceModifier: e.price })),
      ].filter(Boolean) as any[];

      return {
        productId: line.menuItem.id,
        productName: line.menuItem.name,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
        selectedOptions: selectedOptionsSummary,
        itemTotal: line.totalPrice,
      };
    }),
    subtotal,
    total,
    specialNotes: 'Direct web cart order from Estate 1896',
  });

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your Order Cart"
          className="fixed inset-0 z-50 overflow-hidden flex justify-end"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-espresso-950/80 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative z-10 w-full max-w-md bg-gradient-to-b from-roast-900 via-espresso-950 to-espresso-950 border-l border-roast-700/80 shadow-warm-lg flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-5 border-b border-roast-800 flex items-center justify-between bg-espresso-950/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-roast-800 border border-caramel-500/30 flex items-center justify-center text-caramel-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-cream-50">Your Coffee Order</h3>
                  <span className="text-[11px] font-mono text-copper-300">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in order
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className={cn(
                  'p-2 rounded-full text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors',
                  FOCUS_RING_CLASSES
                )}
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-roast-900 border border-roast-800 flex items-center justify-center text-caramel-400/50">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-lg text-cream-100 font-semibold">Your order is empty</p>
                    <p className="text-xs text-cream-400 font-sans max-w-xs">
                      Explore our single-origin coffees, handcrafted bakes, and house specialties.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCartOpen(false)}
                    className="hover:border-caramel-400"
                  >
                    Browse Menu
                  </Button>
                </div>
              ) : (
                items.map((line) => (
                  <div
                    key={line.id}
                    className="p-4 rounded-xl bg-espresso-900/80 border border-roast-800 space-y-3 shadow-warm-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-cream-100 truncate">
                          {line.menuItem.name}
                        </h4>
                        <span className="font-mono text-xs text-caramel-400 font-semibold">
                          {formatINR(line.unitPrice)} each
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(line.id)}
                        className="text-cream-400 hover:text-red-400 p-1 transition-colors"
                        aria-label={`Remove ${line.menuItem.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details List */}
                    <div className="text-[11px] font-sans text-cream-300 space-y-0.5 bg-espresso-950/60 p-2.5 rounded-lg border border-roast-800/80">
                      {line.customization.size && (
                        <p className="text-cream-200 font-mono">
                          <span className="text-cream-400">Size:</span> {line.customization.size}
                        </p>
                      )}
                      {line.customization.temperature && (
                        <p>
                          <span className="text-cream-400">Temp:</span> {line.customization.temperature}
                        </p>
                      )}
                      {line.customization.milk && (
                        <p>
                          <span className="text-cream-400">Milk:</span> {line.customization.milk}
                        </p>
                      )}
                      {line.customization.sweetness && (
                        <p>
                          <span className="text-cream-400">Sweetness:</span> {line.customization.sweetness}
                        </p>
                      )}
                      {line.customization.extras.length > 0 && (
                        <p className="text-copper-300">
                          <span className="text-cream-400">Extras:</span> {line.customization.extras.map((e) => e.name).join(', ')}
                        </p>
                      )}
                      {line.customization.specialInstructions && (
                        <p className="italic text-cream-400">
                          Note: "{line.customization.specialInstructions}"
                        </p>
                      )}
                    </div>

                    {/* Quantity controls & Line Total */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 bg-roast-900 border border-roast-700 rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-cream-100 min-w-[16px] text-center">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-cream-100">
                        {formatINR(line.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Activation */}
            {items.length > 0 && (
              <div className="p-5 border-t border-roast-800 bg-espresso-950/95 space-y-3.5">
                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-cream-300">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-cream-400">
                    <span>GST (5% — 2.5% CGST + 2.5% SGST)</span>
                    <span>{formatINR(gst.tax, { showDecimals: true })}</span>
                  </div>
                  <div className="flex justify-between text-cream-400">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE (Above ₹500)' : formatINR(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-cream-50 text-sm font-bold pt-2 border-t border-roast-800">
                    <span>Estimated Total</span>
                    <span className="text-caramel-300">{formatINR(total, { showDecimals: true })}</span>
                  </div>
                </div>

                {/* Primary Proceed To Checkout Button */}
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-between font-bold text-xs shadow-warm-lg bg-caramel-500 hover:bg-caramel-400 text-espresso-950"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleProceedToCheckout}
                >
                  <span>Proceed to Checkout</span>
                  <span className="font-mono">{formatINR(total, { showDecimals: true })}</span>
                </Button>

                {/* WhatsApp Quick Order Fast-Track */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 rounded py-2 text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Order via WhatsApp (+91)</span>
                </a>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-center text-[11px] text-cream-500 hover:text-red-400 font-mono transition-colors cursor-pointer"
                >
                  Clear Order
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
