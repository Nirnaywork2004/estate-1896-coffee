import React from 'react';
import { MenuCategorySlug } from '../../types/menu.types';
import { Coffee, CupSoda, UtensilsCrossed, CakeSlice, Sparkles, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

interface CategoryTab {
  slug: MenuCategorySlug;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryTab[] = [
  { slug: 'all', label: 'All Offerings', icon: Layers },
  { slug: 'coffee', label: 'Specialty Coffee', icon: Coffee },
  { slug: 'non-coffee', label: 'Tea & Botanicals', icon: CupSoda },
  { slug: 'food', label: 'Sourdough & Kitchen', icon: UtensilsCrossed },
  { slug: 'desserts', label: 'Artisanal Pâtisserie', icon: CakeSlice },
  { slug: 'signatures', label: 'House Signatures', icon: Sparkles },
];

interface MenuCategoryTabsProps {
  activeCategory: MenuCategorySlug;
  onSelectCategory: (category: MenuCategorySlug) => void;
  categoryCounts: Record<MenuCategorySlug, number>;
}

export const MenuCategoryTabs: React.FC<MenuCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.slug;
          const count = categoryCounts[cat.slug] || 0;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={cn(
                'group flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 border cursor-pointer select-none',
                FOCUS_RING_CLASSES,
                isActive
                  ? 'bg-caramel-500 text-espresso-950 border-caramel-400 font-bold shadow-warm-md'
                  : 'bg-espresso-900/60 text-cream-300 border-roast-700/80 hover:bg-roast-800/80 hover:border-roast-600 hover:text-cream-50'
              )}
              aria-pressed={isActive}
            >
              <Icon
                className={cn(
                  'w-3.5 h-3.5 transition-transform group-hover:scale-110',
                  isActive ? 'text-espresso-950' : 'text-caramel-400'
                )}
              />
              <span>{cat.label}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                  isActive
                    ? 'bg-espresso-950/20 text-espresso-950 font-bold'
                    : 'bg-roast-800 text-cream-400'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
