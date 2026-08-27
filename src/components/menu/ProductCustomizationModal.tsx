import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem, SelectedCustomization, ExtraOption, CoffeeSize, MilkType, SweetnessLevel, DrinkTemp } from '../../types/menu.types';
import { formatINR } from '../../utils/currency';
import { Button } from '../ui/Button';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

interface ProductCustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();

  // Initial Customization State
  const [selectedSize, setSelectedSize] = useState<CoffeeSize>('Small (240ml)');
  const [sizePriceDelta, setSizePriceDelta] = useState<number>(0);
  const [selectedMilk, setSelectedMilk] = useState<MilkType>('Regular Whole Dairy');
  const [milkPriceDelta, setMilkPriceDelta] = useState<number>(0);
  const [selectedSweetness, setSelectedSweetness] = useState<SweetnessLevel>('No Sugar');
  const [selectedTemp, setSelectedTemp] = useState<DrinkTemp>('Hot');
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Reset defaults whenever item changes
  useEffect(() => {
    if (item && item.customization) {
      const defaultSize = item.customization.sizes?.[0];
      setSelectedSize(defaultSize ? defaultSize.name : 'Small (240ml)');
      setSizePriceDelta(defaultSize ? defaultSize.priceDelta : 0);

      const defaultMilk = item.customization.milks?.[0];
      setSelectedMilk(defaultMilk ? defaultMilk.name : 'Regular Whole Dairy');
      setMilkPriceDelta(defaultMilk ? defaultMilk.priceDelta : 0);

      const defaultSweetness = item.customization.sweetnessLevels?.[0] || 'No Sugar';
      setSelectedSweetness(defaultSweetness);

      const defaultTemp = item.customization.temperatures?.[0] || 'Hot';
      setSelectedTemp(defaultTemp);

      setSelectedExtras([]);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [item]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!item) return null;

  // Toggle Extra option
  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  // Live Calculated Total Price
  const extrasTotal = selectedExtras.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = item.price + sizePriceDelta + milkPriceDelta + extrasTotal;
  const lineTotalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customization: SelectedCustomization = {
      size: selectedSize,
      sizePriceDelta,
      milk: selectedMilk,
      milkPriceDelta,
      sweetness: selectedSweetness,
      temperature: selectedTemp,
      extras: selectedExtras,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    addToCart(item, customization, quantity);
    onClose();
  };

  const customization = item.customization;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="customization-modal-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          {/* Backdrop Click */}
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

          {/* Modal Container (Bottom sheet on mobile, centered modal on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full sm:max-w-xl max-h-[90vh] bg-gradient-to-b from-roast-900 via-espresso-900 to-espresso-950 border border-roast-700/90 rounded-t-2xl sm:rounded-2xl shadow-warm-lg flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="relative p-5 sm:p-6 border-b border-roast-800 flex items-start justify-between gap-4 bg-espresso-950/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400 font-semibold">
                    Customization Calibration
                  </span>
                  {item.isVeg && (
                    <div className="w-3.5 h-3.5 border border-emerald-500/80 flex items-center justify-center p-0.5 rounded-xs" title="Vegetarian">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  )}
                </div>
                <h3 id="customization-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
                  {item.name}
                </h3>
                <p className="text-xs text-cream-300 font-sans">{item.description}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'p-2 rounded-full text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors shrink-0',
                  FOCUS_RING_CLASSES
                )}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Customization Options */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[58vh]">
              {/* 1. Size Selection */}
              {customization?.sizes && customization.sizes.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold">
                    <span>1. Select Size</span>
                    <span className="text-copper-400 text-[10px]">Required</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {customization.sizes.map((s) => {
                      const isSelected = selectedSize === s.name;
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            setSelectedSize(s.name);
                            setSizePriceDelta(s.priceDelta);
                          }}
                          className={cn(
                            'p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1',
                            FOCUS_RING_CLASSES,
                            isSelected
                              ? 'bg-caramel-500/20 border-caramel-500 text-cream-50 shadow-warm-sm font-semibold'
                              : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                          )}
                        >
                          <span className="text-xs">{s.name.split(' ')[0]}</span>
                          <span className="text-[10px] font-mono text-cream-400">{s.name.split(' ')[1] || ''}</span>
                          <span className="text-[10px] font-mono text-caramel-300 font-bold">
                            {s.priceDelta === 0 ? 'Standard' : `+${formatINR(s.priceDelta)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Temperature Selection */}
              {customization?.temperatures && customization.temperatures.length > 1 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                    2. Serving Temperature
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {customization.temperatures.map((temp) => {
                      const isSelected = selectedTemp === temp;
                      return (
                        <button
                          key={temp}
                          type="button"
                          onClick={() => setSelectedTemp(temp)}
                          className={cn(
                            'p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer',
                            FOCUS_RING_CLASSES,
                            isSelected
                              ? 'bg-caramel-500/20 border-caramel-500 text-cream-50 font-bold'
                              : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                          )}
                        >
                          {temp === 'Hot' ? '☕ Steamed Hot (62°C)' : '🧊 Iced on Crystal Spheres'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Milk Choice */}
              {customization?.milks && customization.milks.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                    3. Choice of Milk
                  </span>
                  <div className="space-y-1.5">
                    {customization.milks.map((m) => {
                      const isSelected = selectedMilk === m.name;
                      return (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => {
                            setSelectedMilk(m.name);
                            setMilkPriceDelta(m.priceDelta);
                          }}
                          className={cn(
                            'w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer',
                            FOCUS_RING_CLASSES,
                            isSelected
                              ? 'bg-caramel-500/15 border-caramel-500 text-cream-50 font-semibold'
                              : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                          )}
                        >
                          <span>{m.name}</span>
                          <span className="font-mono text-[11px] text-caramel-300">
                            {m.priceDelta === 0 ? '+₹0' : `+${formatINR(m.priceDelta)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Sweetness Level */}
              {customization?.sweetnessLevels && customization.sweetnessLevels.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                    4. Sweetness Level
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {customization.sweetnessLevels.map((lvl) => {
                      const isSelected = selectedSweetness === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSelectedSweetness(lvl)}
                          className={cn(
                            'p-2 rounded border text-[11px] font-mono text-center transition-all cursor-pointer',
                            FOCUS_RING_CLASSES,
                            isSelected
                              ? 'bg-caramel-500/20 border-caramel-500 text-cream-50 font-bold'
                              : 'bg-espresso-950/60 border-roast-800 text-cream-400 hover:border-roast-700'
                          )}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Extras / Modifiers */}
              {customization?.availableExtras && customization.availableExtras.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                    5. Elevate with Extras (Optional)
                  </span>
                  <div className="space-y-1.5">
                    {customization.availableExtras.map((extra) => {
                      const isChecked = selectedExtras.some((e) => e.id === extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra)}
                          className={cn(
                            'w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer',
                            FOCUS_RING_CLASSES,
                            isChecked
                              ? 'bg-copper-500/15 border-copper-500 text-cream-50 font-semibold'
                              : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                                isChecked ? 'bg-copper-500 border-copper-400 text-espresso-950' : 'border-roast-700'
                              )}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{extra.name}</span>
                          </div>
                          <span className="font-mono text-[11px] text-caramel-300">+{formatINR(extra.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Special Instructions */}
              <div className="space-y-2">
                <label htmlFor="special-instructions" className="text-xs font-mono uppercase tracking-wider text-cream-400 block">
                  Special Notes (Optional)
                </label>
                <textarea
                  id="special-instructions"
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., extra hot, oat milk on the side..."
                  className="w-full p-2.5 bg-espresso-950/80 border border-roast-800 rounded-lg text-xs font-sans text-cream-200 placeholder:text-cream-500 focus:outline-none focus:border-caramel-500"
                />
              </div>
            </div>

            {/* Modal Bottom Fixed Actions & Live Pricing */}
            <div className="p-4 sm:p-5 border-t border-roast-800 bg-espresso-950 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-roast-900 border border-roast-700 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded flex items-center justify-center text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-sm font-bold text-cream-100 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded flex items-center justify-center text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add To Cart CTA with Total Calculation */}
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto flex-1 justify-between gap-4 font-bold text-sm"
                onClick={handleAdd}
              >
                <span>Add to Order</span>
                <span className="font-mono">{formatINR(lineTotalPrice)}</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
