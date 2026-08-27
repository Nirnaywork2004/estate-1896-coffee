import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlacedOrder } from '../../types/order.types';
import { ordersService } from '../../services/orders.service';
import { analyticsService } from '../../services/analytics.service';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  Clock,
  Coffee,
  RotateCcw,
  Send,
  Phone,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROASTERY_PHONE = '+917407004397';
const ROASTERY_WA_NUMBER = '917407004397';

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    if (isOpen) {
      const history = ordersService.getLocalOrderHistory();
      setOrders(history);
    }
  }, [isOpen]);

  // Re-order past order items
  const handleReorder = (order: PlacedOrder) => {
    order.items.forEach((line) => {
      addToCart(line.menuItem, line.customization, line.quantity);
    });
    onClose();
    setIsCartOpen(true);
  };

  const handleWhatsAppClick = (order: PlacedOrder) => {
    analyticsService.trackWhatsAppClick(order.orderNumber, order.id);
  };

  const handlePhoneClick = (order?: PlacedOrder) => {
    analyticsService.trackPhoneClick(order?.orderNumber, order?.id);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-history-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-roast-900 via-espresso-900 to-espresso-950 border border-roast-700/90 rounded-2xl shadow-warm-lg flex flex-col overflow-hidden max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-roast-800 flex items-center justify-between bg-espresso-950/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="copper" size="sm">
                <Clock className="w-3 h-3" />
                Customer Portal
              </Badge>
              <span className="text-[10px] font-mono text-cream-400">
                {orders.length} past {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>
            <h3 id="order-history-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
              Your Roastery Order History
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-2 rounded-full text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors',
              FOCUS_RING_CLASSES
            )}
            aria-label="Close order history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-roast-900 border border-roast-800 flex items-center justify-center text-caramel-400 mx-auto">
                <Coffee className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-cream-100">No Past Orders Found</h4>
                <p className="text-xs text-cream-400 font-sans max-w-xs mx-auto">
                  Your placed orders and live brewing status will appear here after checkout.
                </p>
              </div>
            </div>
          ) : (
            orders.map((order) => {
              const waUrl = `https://wa.me/${ROASTERY_WA_NUMBER}?text=${encodeURIComponent(
                `Hi, I want to track my order ${order.orderNumber}.`
              )}`;

              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-xl bg-espresso-950/80 border border-roast-800 space-y-4 shadow-warm-sm"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-roast-800/80">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-caramel-300">
                          {order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono uppercase">
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cream-400 block">
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <span className="font-mono text-sm font-bold text-cream-50">
                      {formatINR(order.total, { showDecimals: true })}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs font-sans">
                    {order.items.map((line) => (
                      <div key={line.id} className="flex justify-between text-cream-200">
                        <span>
                          {line.menuItem.name} <span className="font-mono text-copper-400">x{line.quantity}</span>
                        </span>
                        <span className="font-mono text-cream-300">{formatINR(line.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-roast-900">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={() => handleReorder(order)}
                    >
                      Re-Order
                    </Button>

                    <div className="flex items-center gap-3">
                      {/* Phone Dialer Button */}
                      <a
                        href={`tel:${ROASTERY_PHONE}`}
                        onClick={() => handlePhoneClick(order)}
                        className="inline-flex items-center gap-1 text-xs text-copper-300 hover:text-caramel-300 font-mono transition-colors"
                        title="Call Café (+91 74070 04397)"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>

                      {/* Dynamic WhatsApp Tracking Link */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleWhatsAppClick(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-xs text-emerald-300 hover:text-emerald-200 font-mono transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Track on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-roast-800 bg-espresso-950 flex justify-between items-center text-xs font-mono text-cream-400">
          <a
            href={`tel:${ROASTERY_PHONE}`}
            onClick={() => handlePhoneClick()}
            className="flex items-center gap-1.5 text-copper-300 hover:text-caramel-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Support: +91 74070 04397</span>
          </a>

          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-cream-300">
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
