import React from 'react';
import { Search, X, Sparkles, Leaf } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MenuSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dietaryFilter: 'all' | 'veg' | 'vegan' | 'signature';
  onDietaryFilterChange: (filter: 'all' | 'veg' | 'vegan' | 'signature') => void;
}

export const MenuSearch: React.FC<MenuSearchProps> = ({
  searchQuery,
  onSearchChange,
  dietaryFilter,
  onDietaryFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search pour-overs, croissants, matcha..."
          className="w-full pl-10 pr-10 py-2.5 bg-espresso-900/80 border border-roast-700/80 rounded-full text-cream-100 placeholder:text-cream-400 text-xs sm:text-sm font-sans focus:outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500 transition-all shadow-warm-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-cream-100 p-1"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dietary Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => onDietaryFilterChange('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer shrink-0',
            dietaryFilter === 'all'
              ? 'bg-roast-700 text-cream-50 border-roast-600 font-semibold'
              : 'bg-espresso-950/60 text-cream-400 border-roast-800 hover:text-cream-200'
          )}
        >
          All Items
        </button>

        <button
          type="button"
          onClick={() => onDietaryFilterChange('veg')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer shrink-0',
            dietaryFilter === 'veg'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 font-semibold'
              : 'bg-espresso-950/60 text-cream-400 border-roast-800 hover:text-emerald-400'
          )}
        >
          {/* Standard Indian Vegetarian Green Dot Icon */}
          <span className="w-2.5 h-2.5 border border-emerald-400 flex items-center justify-center p-0.5 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>
          <span>Vegetarian</span>
        </button>

        <button
          type="button"
          onClick={() => onDietaryFilterChange('vegan')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer shrink-0',
            dietaryFilter === 'vegan'
              ? 'bg-amber-950/80 text-amber-300 border-amber-700 font-semibold'
              : 'bg-espresso-950/60 text-cream-400 border-roast-800 hover:text-amber-300'
          )}
        >
          <Leaf className="w-3 h-3 text-amber-400" />
          <span>Vegan</span>
        </button>

        <button
          type="button"
          onClick={() => onDietaryFilterChange('signature')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer shrink-0',
            dietaryFilter === 'signature'
              ? 'bg-copper-950/80 text-copper-300 border-copper-700 font-semibold'
              : 'bg-espresso-950/60 text-cream-400 border-roast-800 hover:text-copper-300'
          )}
        >
          <Sparkles className="w-3 h-3 text-caramel-400" />
          <span>Signatures</span>
        </button>
      </div>
    </div>
  );
};
