import React from 'react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatINR } from '../utils/currency';
import { ArrowRight, Croissant, Wheat } from 'lucide-react';

interface BakeItem {
  name: string;
  category: string;
  description: string;
  price: number;
  highlight: string;
}

const BAKERY_ITEMS: BakeItem[] = [
  {
    name: 'Twice-Baked Almond Sourdough Croissant',
    category: 'Viennoiserie',
    description: '72-hour cold-fermented laminated sourdough dough filled with roasted almond frangipane and topped with toasted flakes.',
    price: 220,
    highlight: 'French Butter & Almonds',
  },
  {
    name: 'Dark Chocolate & Maldon Sea Salt Tart',
    category: 'Pâtisserie',
    description: '70% single-origin Idukki dark chocolate ganache in a crisp sablé crust, finished with flaky English sea salt.',
    price: 250,
    highlight: 'Single-Origin Cocoa',
  },
  {
    name: 'Pistachio & Wild Honey Sourdough Twist',
    category: 'Bakehouse',
    description: 'Braided brioche dough ribboned with Iranian pistachio cream and brushed with raw Western Ghats forest honey.',
    price: 210,
    highlight: 'Forest Wild Honey',
  },
  {
    name: 'Truffle Wild Mushroom Sourdough Toast',
    category: 'Savory Kitchen',
    description: 'Pan-roasted button & shiitake mushrooms deglazed in white wine, whipped herbed ricotta, black truffle oil on toasted sourdough.',
    price: 340,
    highlight: 'Artisanal Sourdough',
  },
];

export const BakesPreviewSection: React.FC = () => {
  return (
    <section
      id="bakery"
      aria-labelledby="bakes-heading"
      className="relative py-24 sm:py-32 bg-espresso-950 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Vignette of Fresh Bakes */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-roast-700/80 shadow-warm-lg group">
              <img
                src="/images/bakes-spread.jpg"
                alt="Freshly baked artisanal almond croissant, chocolate tart, and pistachio twist on rustic board"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge variant="caramel" size="sm">
                  <Wheat className="w-3 h-3 text-caramel-400" />
                  In-House Bakehouse
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-cream-200 font-mono">
                <span>72-Hour Sourdough Fermentation</span>
                <span className="text-copper-300 font-semibold">Baked Fresh at 06:30 AM</span>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-roast-900/60 border border-roast-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-caramel-500/10 border border-caramel-500/30 flex items-center justify-center text-caramel-400 shrink-0">
                <Croissant className="w-5 h-5" />
              </div>
              <p className="text-xs text-cream-300 font-sans leading-relaxed">
                Every pastry is calibrated to pair specifically with the acidity and body of our single-origin pour-overs and espresso roasts.
              </p>
            </div>
          </div>

          {/* Right Column: Narrative & Curated Items List */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="copper" size="sm">05 · The Bakehouse</Badge>
                <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                  Laminated & Fermented
                </span>
              </div>
              <h2
                id="bakes-heading"
                className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
              >
                Artisanal Bakes & Savory Kitchen
              </h2>
              <p className="text-sm text-cream-300 leading-relaxed font-sans">
                Crafted each dawn using pure cultured butter, stone-milled flours, and indigenous spices to accompany your coffee ritual.
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {BAKERY_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-lg bg-espresso-900/60 border border-roast-800/80 hover:border-roast-700 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-roast-600">·</span>
                      <span className="text-[10px] text-cream-400 font-mono">{item.highlight}</span>
                    </div>
                    <h3 className="font-serif text-base font-semibold text-cream-100">
                      {item.name}
                    </h3>
                    <p className="text-xs text-cream-400 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <span className="font-mono text-sm font-bold text-caramel-400 shrink-0">
                    {formatINR(item.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Clear CTA to Full Menu */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="group"
                rightIcon={
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                }
                onClick={() => {
                  const target = document.getElementById('menu-cta');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Full Kitchen Menu
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
