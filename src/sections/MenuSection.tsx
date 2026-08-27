import React, { useState, useMemo } from 'react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { MenuCategoryTabs } from '../components/menu/MenuCategoryTabs';
import { MenuSearch } from '../components/menu/MenuSearch';
import { ProductCard } from '../components/menu/ProductCard';
import { ProductCustomizationModal } from '../components/menu/ProductCustomizationModal';
import { MENU_ITEMS } from '../data/menuData';
import { MenuItem, MenuCategorySlug } from '../types/menu.types';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import { ArrowRight, Sparkles, FilterX } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MenuCategorySlug>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'vegan' | 'signature'>('all');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<MenuCategorySlug, number> = {
      all: MENU_ITEMS.length,
      coffee: 0,
      'non-coffee': 0,
      food: 0,
      desserts: 0,
      signatures: 0,
    };

    MENU_ITEMS.forEach((item) => {
      if (item.category in counts) {
        counts[item.category]++;
      }
      if (item.isSignature) {
        counts.signatures++;
      }
    });

    return counts;
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // 1. Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'signatures') {
          if (!item.isSignature) return false;
        } else if (item.category !== activeCategory) {
          return false;
        }
      }

      // 2. Dietary filter
      if (dietaryFilter === 'veg' && !item.isVeg) return false;
      if (dietaryFilter === 'vegan' && !item.isVegan) return false;
      if (dietaryFilter === 'signature' && !item.isSignature) return false;

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTagline = item.tagline?.toLowerCase().includes(query) || false;
        const matchesNotes = item.flavorNotes?.some((n) => n.toLowerCase().includes(query)) || false;
        const matchesOrigin = item.originRegion?.toLowerCase().includes(query) || false;

        if (!matchesName && !matchesDesc && !matchesTagline && !matchesNotes && !matchesOrigin) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, dietaryFilter, searchQuery]);

  return (
    <section
      id="menu"
      aria-labelledby="menu-catalogue-heading"
      className="relative py-24 sm:py-32 bg-espresso-950 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-caramel-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="xl" className="space-y-10">
        {/* Menu Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-roast-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="caramel" size="sm">
                <Sparkles className="w-3 h-3 text-caramel-400" />
                The Full Menu
              </Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                Calibrated Daily
              </span>
            </div>
            <h2
              id="menu-catalogue-heading"
              className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
            >
              Artisanal Coffee & Kitchen Menu
            </h2>
          </div>

          <p className="text-sm text-cream-300 font-sans max-w-md">
            Single-origin micro-lots, botanical cold crafts, 72-hour sourdough pastries, and savory kitchen plates.
          </p>
        </div>

        {/* Filter Navigation & Search Bar */}
        <div className="space-y-4">
          <MenuCategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSearchQuery('');
            }}
            categoryCounts={categoryCounts}
          />

          <MenuSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dietaryFilter={dietaryFilter}
            onDietaryFilterChange={setDietaryFilter}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-dashed border-roast-800 rounded-2xl bg-espresso-900/30">
            <div className="w-12 h-12 rounded-full bg-roast-900 border border-roast-800 flex items-center justify-center text-cream-400 mx-auto">
              <FilterX className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-cream-100">No offerings match your search</h3>
              <p className="text-xs text-cream-400 font-sans max-w-sm mx-auto">
                Try clearing your search query or selecting another dietary category.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setActiveCategory('all');
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onCustomize={(itemToCustomize) => setCustomizingItem(itemToCustomize)}
              />
            ))}
          </div>
        )}

        {/* Floating Quick Order Cart Bar (Visible when cart has items) */}
        {totalItemsCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
            <div className="p-3 bg-gradient-to-r from-roast-800 via-espresso-900 to-roast-800 border border-caramel-500/80 rounded-full shadow-warm-lg flex items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3 pl-3">
                <div className="w-8 h-8 rounded-full bg-caramel-500 text-espresso-950 flex items-center justify-center font-bold text-xs">
                  {totalItemsCount}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cream-300">
                    Order Subtotal
                  </span>
                  <span className="font-mono text-sm font-bold text-caramel-300">
                    {formatINR(subtotal)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="rounded-full px-5 py-2 text-xs font-bold"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => setIsCartOpen(true)}
              >
                View Order
              </Button>
            </div>
          </div>
        )}

        {/* Customization Modal */}
        <ProductCustomizationModal
          item={customizingItem}
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
        />
      </Container>
    </section>
  );
};
