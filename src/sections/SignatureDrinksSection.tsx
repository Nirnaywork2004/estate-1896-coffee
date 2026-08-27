import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatINR } from '../utils/currency';
import { X, Info } from 'lucide-react';

interface SignatureDrink {
  id: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  price: number;
  image: string;
  tags: string[];
  ingredients: string[];
  pairing: string;
}

const SIGNATURE_DRINKS: SignatureDrink[] = [
  {
    id: 'jaggery-latte',
    name: 'Wild Jaggery & Cinnamon Smoked Latte',
    tagline: 'Raw Palm Jaggery · Ceylon Cinnamon · Oat Milk',
    description:
      'Double ristretto pulled over dark organic palm jaggery from Salem, infused with cold-pressed Ceylon cinnamon and velvety textured oat milk.',
    story:
      'Inspired by heirloom winter drinks of the Nilgiri hills. We melt unrefined palm jaggery directly under the 93.5°C espresso stream to caramelize the natural sugarcane molassics.',
    price: 280,
    image: '/images/signature-jaggery.jpg',
    tags: ['House Signature', 'Naturally Sweetened', 'Plant-Based Option'],
    ingredients: [
      'Estate Double Ristretto (Mysore AAA)',
      'Organic Palm Jaggery',
      'Ceylon Cinnamon Bark',
      'Minor Figures Oat Milk',
      'Whole Star Anise Garnish',
    ],
    pairing: 'Pairs ideally with Twice-Baked Almond Croissant',
  },
  {
    id: 'nitro-cascara',
    name: 'Nitro Cascara Botanical Tonic',
    tagline: 'Sun-Dried Cascara · Indian Tonic · Meyer Lemon',
    description:
      'Slow-steeped coffee cherry cascara from Wayanad estates charged with micro-nitrogen on tap, served over sparkling tonic and aromatic Meyer lemon twist.',
    story:
      'Cascara is the dried sun-cured skin of the coffee fruit. High in antioxidants with tasting notes reminiscent of dried hibiscus, rosehip, and sour tamarind.',
    price: 270,
    image: '/images/craft-extraction.jpg',
    tags: ['On Draught', 'Sparkling Craft', 'Refreshing Botanical'],
    ingredients: [
      'Wayanad Sun-Dried Cascara',
      'Craft Indian Botanical Tonic',
      'Meyer Lemon Peel Oils',
      'Pure Nitrogen Charge',
    ],
    pairing: 'Pairs with Citrus Tea Cake',
  },
  {
    id: 'cardamom-velvet',
    name: 'Cardamom Rose Velvet Cappuccino',
    tagline: 'Coorg Green Cardamom · Rose Mist · Farm Dairy',
    description:
      'Single-origin Arabica espresso infused with hand-crushed Coorg green cardamom, enveloped in dense velvet microfoam and a delicate organic rosewater mist.',
    story:
      'An homage to traditional South Indian hospitality. The cardamom warmth grounds the floral aromatics of light-roast Chikmagalur beans without masking their natural acidity.',
    price: 260,
    image: '/images/latte-art.jpg',
    tags: ['Aromatic Craft', 'Traditional Twist', 'Silk Foam'],
    ingredients: [
      'Chikmagalur Washed Arabica',
      'Fresh Coorg Cardamom Pods',
      'Kannauj Organic Rosewater Mist',
      'Farm Fresh Whole Milk (62°C)',
    ],
    pairing: 'Pairs with Pistachio Sourdough Twist',
  },
  {
    id: 'kyoto-cold-brew',
    name: 'Kyoto 24-Hour Reserve Cold Drip',
    tagline: 'Slow Ice Drip · Cacao Nibs · Blueberry Finish',
    description:
      'Single-origin microlot cold-extracted drop by drop over 24 hours through a glass tower. Ultra-silky, liqueur-like mouthfeel with natural blueberry notes.',
    story:
      'Zero heat extraction preserves delicate floral terpene oils that hot water vaporizes. Served chilled over hand-carved crystal ice spheres.',
    price: 290,
    image: '/images/coffee-spread.jpg',
    tags: ['24-Hour Extraction', 'Liqueur Body', 'Limited Batches'],
    ingredients: [
      'Chikmagalur Natural Anaerobic Lot',
      'Glacier Mineral Water',
      'Slow Ice Drip (1 drop / 1.5s)',
      'Single Crystal Ice Sphere',
    ],
    pairing: 'Pairs with Dark Chocolate & Sea Salt Tart',
  },
];

export const SignatureDrinksSection: React.FC = () => {
  const [selectedDrink, setSelectedDrink] = useState<SignatureDrink | null>(null);

  return (
    <section
      id="signature"
      aria-labelledby="signature-drinks-heading"
      className="relative py-24 sm:py-32 bg-roast-900/30 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-roast-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="copper" size="sm">04 · House Creations</Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                Botanicals & Terroir
              </span>
            </div>
            <h2
              id="signature-drinks-heading"
              className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
            >
              Artisanal Signature Creations
            </h2>
          </div>

          <p className="text-sm text-cream-300 font-sans max-w-md">
            Original concoctions fusing indigenous Indian spices, heirloom jaggery, and nitro drafts with single-origin beans.
          </p>
        </div>

        {/* Editorial Catalogue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
          {SIGNATURE_DRINKS.map((drink) => (
            <Card
              key={drink.id}
              variant="interactive"
              className="group p-0 overflow-hidden bg-espresso-950/80 border-roast-800 hover:border-caramel-500/60 shadow-warm-md flex flex-col justify-between"
            >
              {/* Drink Image with Ambient Gradient */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/30 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  {drink.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-espresso-950/90 border border-roast-700 text-[10px] uppercase font-mono tracking-wider text-caramel-300 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="font-mono text-base font-bold bg-espresso-950/90 border border-caramel-500/40 text-caramel-300 px-3 py-1 rounded-sm shadow-warm-sm">
                    {formatINR(drink.price)}
                  </span>
                </div>
              </div>

              {/* Drink Editorial Details */}
              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-copper-400 font-semibold block">
                    {drink.tagline}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-50 group-hover:text-caramel-300 transition-colors">
                    {drink.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-cream-300 leading-relaxed">
                    {drink.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-roast-900 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedDrink(drink)}
                    className="text-xs text-caramel-400 hover:text-caramel-300 font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer focus-visible:outline-none"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Read Craft Origin
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:border-caramel-400 group-hover:bg-caramel-500 group-hover:text-espresso-950 group-hover:border-caramel-500 font-semibold"
                    onClick={() => {
                      const target = document.getElementById('craft-transition');
                      target?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Order Signature
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* Craft Story Modal / Drawer */}
      <AnimatePresence>
        {selectedDrink && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedDrink.name}
            className="fixed inset-0 z-50 bg-espresso-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-gradient-to-b from-roast-800 to-espresso-950 border border-roast-700 rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-warm-lg relative"
            >
              <button
                type="button"
                onClick={() => setSelectedDrink(null)}
                className="absolute top-4 right-4 p-2 text-cream-300 hover:text-caramel-300 hover:bg-roast-700 rounded-full transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400">
                  Estate Signature Story
                </span>
                <h3 className="font-serif text-2xl font-bold text-cream-50">
                  {selectedDrink.name}
                </h3>
                <span className="font-mono text-base text-caramel-400 font-bold">
                  {formatINR(selectedDrink.price)}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-mono tracking-widest text-cream-400">The Alchemy</p>
                <p className="font-sans text-sm text-cream-200 leading-relaxed">
                  {selectedDrink.story}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-mono tracking-widest text-cream-400">Ingredients</p>
                <ul className="space-y-1 text-xs text-cream-300 font-sans">
                  {selectedDrink.ingredients.map((ing) => (
                    <li key={ing} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-caramel-400" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-espresso-950 rounded border border-roast-800 text-xs text-caramel-300 font-mono">
                {selectedDrink.pairing}
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => setSelectedDrink(null)}
              >
                Done
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
