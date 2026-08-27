import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { formatINR } from '../utils/currency';
import { MapPin, Check, SlidersHorizontal } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CoffeePersonality {
  id: string;
  name: string;
  archetype: string;
  category: string;
  origin: string;
  elevation: string;
  roast: string;
  notes: string[];
  price: number;
  description: string;
  profile: {
    acidity: number; // 1-5
    body: number; // 1-5
    sweetness: number; // 1-5
    intensity: number; // 1-5
  };
}

const COFFEE_COLLECTION: CoffeePersonality[] = [
  {
    id: 'pour-over',
    name: 'Chikmagalur Heritage Washed V60',
    archetype: 'The Meditative',
    category: 'Pour-Over',
    origin: 'Baba Budan Giri, Karnataka',
    elevation: '4,200 FT',
    roast: 'Light-Medium',
    notes: ['Wild Honey', 'Jasmine Florals', 'Meyer Lemon', 'Sweet Peach'],
    price: 240,
    description:
      'A crystal-clear, hand-poured brew that unfolds in stages. Delicate citrus brightness transitions into lingering wildflower honey sweetness.',
    profile: { acidity: 4, body: 2, sweetness: 5, intensity: 3 },
  },
  {
    id: 'cortado',
    name: 'Monsooned Malabar Cortado',
    archetype: 'The Spiced Heritage',
    category: 'Espresso & Milk',
    origin: 'Malabar Coast, Kerala',
    elevation: 'Sea Level Monsooned',
    roast: 'Medium-Dark',
    notes: ['Baker’s Chocolate', 'Toasted Walnut', 'Cardamom Smoke', 'Earthiness'],
    price: 210,
    description:
      'Exposed to oceanic monsoon winds for 16 weeks to swell and mellow the beans. Ultra-low acidity with dense cocoa and warm baking spices.',
    profile: { acidity: 1, body: 5, sweetness: 3, intensity: 5 },
  },
  {
    id: 'flat-white',
    name: 'Shevaroy Hills Flat White',
    archetype: 'The Velveteen',
    category: 'Espresso & Milk',
    origin: 'Yercaud, Tamil Nadu',
    elevation: '4,600 FT',
    roast: 'Medium',
    notes: ['Caramelized Sugar', 'Almond Butter', 'Milk Chocolate'],
    price: 230,
    description:
      'Double espresso paired with dense microfoam at 62°C. A harmonious union of natural milk sugars and nutty espresso depth.',
    profile: { acidity: 2, body: 4, sweetness: 4, intensity: 4 },
  },
  {
    id: 'cold-brew',
    name: 'Kyoto 24-Hour Slow Drip',
    archetype: 'The Midnight Alchemist',
    category: 'Cold Craft',
    origin: 'Chikmagalur Micro-Lot',
    elevation: '4,400 FT',
    roast: 'Medium',
    notes: ['Blueberry Compote', 'Cacao Nibs', 'Maple Syrup', 'Bourbon Oak'],
    price: 250,
    description:
      'Extracted drop by drop over 24 hours. Liqueur-like mouthfeel with pronounced blueberry vibrancy and zero bitterness.',
    profile: { acidity: 2, body: 4, sweetness: 4, intensity: 4 },
  },
  {
    id: 'espresso',
    name: 'Mysore AAA Double Ristretto',
    archetype: 'The Purist',
    category: 'Pure Espresso',
    origin: 'Coorg, Karnataka',
    elevation: '3,800 FT',
    roast: 'Dark Roast',
    notes: ['Black Molasses', 'Toasted Hazelnut', 'Dark Cacao'],
    price: 180,
    description:
      'A short, concentrated 1:1.5 brew ratio for espresso purists. Heavy golden crema with lingering dark chocolate intensity.',
    profile: { acidity: 1, body: 5, sweetness: 2, intensity: 5 },
  },
];

export const CoffeeCollectionSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('pour-over');
  const prefersReducedMotion = useReducedMotion();
  const activeItem = COFFEE_COLLECTION.find((c) => c.id === selectedId) || COFFEE_COLLECTION[0];

  return (
    <section
      id="collection"
      aria-labelledby="collection-heading"
      className="relative py-24 sm:py-32 bg-espresso-950 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-copper-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="caramel" size="sm">03 · The Collection</Badge>
            <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
              Personalities of the Bean
            </span>
          </div>

          <h2
            id="collection-heading"
            className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
          >
            Every Cup Has a Character
          </h2>

          <p className="font-sans text-fluid-body text-cream-300 max-w-xl mx-auto">
            From the bright and floral to the heavy and smoky, explore single-origin profiles crafted for different moments of your day.
          </p>
        </div>

        {/* Collection Grid Arrangement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Interactive Personality List */}
          <div className="lg:col-span-5 space-y-3">
            {COFFEE_COLLECTION.map((coffee) => {
              const isSelected = coffee.id === selectedId;
              return (
                <button
                  key={coffee.id}
                  type="button"
                  onClick={() => setSelectedId(coffee.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel-400 ${
                    isSelected
                      ? 'bg-gradient-to-r from-roast-800/90 to-espresso-900/90 border-caramel-500 shadow-warm-md'
                      : 'bg-espresso-900/40 border-roast-800 hover:bg-roast-800/40 hover:border-roast-700'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400 font-semibold">
                        {coffee.archetype}
                      </span>
                      <span className="text-roast-600">·</span>
                      <span className="text-[10px] text-cream-400 font-mono">{coffee.category}</span>
                    </div>
                    <h3
                      className={`font-serif text-base sm:text-lg font-semibold truncate mt-0.5 ${
                        isSelected ? 'text-cream-50' : 'text-cream-300'
                      }`}
                    >
                      {coffee.name}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm font-bold text-caramel-400">
                      {formatINR(coffee.price)}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-caramel-500 text-espresso-950 flex items-center justify-center ml-auto mt-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Personality Profile Card & Spread Visual */}
          <div className="lg:col-span-7">
            <Card
              variant="elevated"
              className="p-6 sm:p-8 bg-gradient-to-b from-roast-800/90 via-espresso-900/95 to-espresso-950 border-roast-700/90 shadow-warm-lg space-y-6"
            >
              {/* Collection Overhead Flatlay Visual Banner */}
              <div className="relative rounded-lg overflow-hidden h-52 sm:h-64 border border-roast-700/80 shadow-warm-md">
                <img
                  src="/images/coffee-spread.jpg"
                  alt="Artisanal specialty coffee collection flatlay on dark slate"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge variant="copper" size="sm">
                    {activeItem.archetype}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-cream-200 font-mono">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-caramel-400" />
                    {activeItem.origin}
                  </span>
                  <span className="text-copper-300 font-semibold">{activeItem.elevation}</span>
                </div>
              </div>

              {/* Personality Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
                        {activeItem.name}
                      </h3>
                      <span className="font-mono text-lg font-bold text-caramel-400 shrink-0">
                        {formatINR(activeItem.price)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed font-sans">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Flavor Notes Pill Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cream-400 font-semibold">
                      Tasting Notes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.notes.map((note) => (
                        <span
                          key={note}
                          className="px-2.5 py-1 rounded bg-roast-800 border border-roast-700 text-cream-200 text-xs font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sensory Profile Breakdown Gauges */}
                  <div className="space-y-3 pt-4 border-t border-roast-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-mono tracking-widest text-copper-300 font-semibold flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Sensory Calibration
                      </span>
                      <span className="text-[10px] font-mono text-cream-400">
                        Roast: {activeItem.roast}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {Object.entries(activeItem.profile).map(([key, val]) => (
                        <div key={key} className="p-2.5 bg-espresso-950/80 rounded border border-roast-800/90 space-y-1.5">
                          <div className="flex justify-between text-[10px] uppercase font-mono text-cream-400">
                            <span>{key}</span>
                            <span className="text-caramel-300 font-bold">{val}/5</span>
                          </div>
                          <div className="h-1.5 w-full bg-roast-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-caramel-500 rounded-full transition-all duration-500"
                              style={{ width: `${(val / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};
