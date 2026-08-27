import React from 'react';
import { MenuItem } from '../../types/menu.types';
import { formatINR } from '../../utils/currency';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onCustomize }) => {
  const { addToCart, items } = useCart();

  // Check how many of this item are currently in the cart
  const inCartCount = items
    .filter((cartItem) => cartItem.menuItem.id === item.id)
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const hasCustomization = Boolean(item.customization);

  const handleQuickAdd = () => {
    if (hasCustomization) {
      onCustomize(item);
    } else {
      addToCart(item, { extras: [] }, 1);
    }
  };

  return (
    <Card
      variant="interactive"
      className="group p-0 overflow-hidden bg-espresso-900/60 border-roast-800/80 hover:border-caramel-500/60 shadow-warm-sm flex flex-col justify-between transition-all duration-300 rounded-xl"
    >
      {/* Product Image Banner */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-roast-950">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/20 to-transparent" />

        {/* Top Badges: Indian Veg Indicator + Signature Pill */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {/* Standard Indian Veg Dot */}
            {item.isVeg && (
              <div
                className="w-4 h-4 bg-espresso-950/90 border border-emerald-500/80 flex items-center justify-center p-0.5 rounded-xs shadow-warm-sm"
                title="Vegetarian"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            )}
            {item.isSignature && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-caramel-500/90 text-espresso-950 font-mono text-[9px] uppercase tracking-wider font-bold shadow-warm-sm">
                <Sparkles className="w-2.5 h-2.5" />
                Signature
              </span>
            )}
          </div>

          {inCartCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-copper-500 text-cream-50 font-mono text-[10px] font-bold shadow-warm-sm animate-pulse">
              {inCartCount} in order
            </span>
          )}
        </div>

        {/* Price Tag Floating at Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <span className="font-mono text-sm font-bold bg-espresso-950/90 border border-roast-700 text-caramel-300 px-2.5 py-1 rounded-sm shadow-warm-sm">
            {formatINR(item.price)}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {item.originRegion && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400 font-semibold block truncate">
              {item.originRegion}
            </span>
          )}
          <h3 className="font-serif text-base sm:text-lg font-bold text-cream-100 group-hover:text-caramel-300 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="font-sans text-xs text-cream-300/90 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Flavor Notes Pills */}
        {item.flavorNotes && item.flavorNotes.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.flavorNotes.slice(0, 3).map((note) => (
              <span
                key={note}
                className="px-2 py-0.5 bg-espresso-950/80 border border-roast-800 text-[10px] font-sans text-cream-300 rounded"
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Card Actions */}
        <div className="pt-3 border-t border-roast-800/80 flex items-center justify-between gap-2">
          {hasCustomization ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center group-hover:border-caramel-500 group-hover:text-caramel-300 text-xs py-2"
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              onClick={() => onCustomize(item)}
            >
              Customize & Add
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center text-xs py-2"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleQuickAdd}
            >
              Add to Order
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
