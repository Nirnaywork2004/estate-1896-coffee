import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ArrowRight, Flame, Scale, Gauge, Droplets, Sparkles, Sprout } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CraftStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ElementType;
  specs: { label: string; value: string }[];
}

const CRAFT_STEPS: CraftStep[] = [
  {
    number: '01',
    title: 'Terroir & Bean Selection',
    subtitle: 'Shade-Grown Heirloom Varietals',
    description:
      'Grown at 4,200ft elevation under dense silver-oak forest canopies in Baba Budan Giri and Coorg. Every coffee cherry is selectively hand-picked at peak ripeness (Brix 22°+).',
    image: '/images/craft-beans.jpg',
    icon: Sprout,
    specs: [
      { label: 'Altitude', value: '4,200 – 4,800 FT' },
      { label: 'Harvesting', value: '100% Selective Hand-Pick' },
      { label: 'Shade Canopy', value: 'Silver Oak & Fig Trees' },
    ],
  },
  {
    number: '02',
    title: 'Calibrated Micro-Roasting',
    subtitle: 'Small-Batch Drum Profiles',
    description:
      'Roasted in 12kg cast-iron drum roasters. We apply customized roast curves that preserve vibrant floral terroir while caramelizing raw cane sugars into rich dark cocoa and toasted hazelnut.',
    image: '/images/craft-extraction.jpg',
    icon: Flame,
    specs: [
      { label: 'Batch Size', value: '12 kg Micro-Batches' },
      { label: 'Development Ratio', value: '14.5% – 16.0%' },
      { label: 'Cooling Time', value: '< 90 Seconds Rapid Air' },
    ],
  },
  {
    number: '03',
    title: 'Micron-Level Grinding',
    subtitle: 'Titanium Flat Burr Precision',
    description:
      'Ground immediately prior to brewing on precision single-dose grinders. Particle distribution is calibrated throughout the day to account for atmospheric humidity and bar barometry.',
    image: '/images/craft-beans.jpg',
    icon: Scale,
    specs: [
      { label: 'Burr Geometry', value: '98mm Titanium Flat' },
      { label: 'Micron Accuracy', value: '± 12 µm Consistency' },
      { label: 'Retention', value: '< 0.1g Single Dose' },
    ],
  },
  {
    number: '04',
    title: '9-Bar Pressure Extraction',
    subtitle: 'Saturated Group Head Extraction',
    description:
      'Using PID-controlled boilers at exactly 93.5°C and 9 bars of steady hydraulic pressure. We achieve silky, tiger-striped crema with maximum soluble sweetness and balanced acidity.',
    image: '/images/craft-extraction.jpg',
    icon: Gauge,
    specs: [
      { label: 'Water Temp', value: '93.5°C PID Controlled' },
      { label: 'Pressure Profile', value: '1:2 Ratio in 28 Secs' },
      { label: 'Mineral Water', value: '130 TDS Calibrated' },
    ],
  },
  {
    number: '05',
    title: 'Microfoam & Latte Craft',
    subtitle: 'Textured Silk at 62°C',
    description:
      'Steamed to silky microfoam with imperceptible bubble structure. Served at precisely 60–62°C where milk sweetness peaks naturally without denaturing delicate milk proteins.',
    image: '/images/latte-art.jpg',
    icon: Droplets,
    specs: [
      { label: 'Temperature', value: '60°C – 62°C Peak Sweetness' },
      { label: 'Texture', value: 'Glossy Paint Microfoam' },
      { label: 'Options', value: 'Farm Dairy & Minor Figures Oat' },
    ],
  },
  {
    number: '06',
    title: 'The Final Pour & Ritual',
    subtitle: 'Pre-Warmed Ceramic Demitasse',
    description:
      'Served in custom double-walled ceramics that retain thermal stability from the first sip to the lingering spiced aftertaste.',
    image: '/images/hero-pour.jpg',
    icon: Sparkles,
    specs: [
      { label: 'Vessel', value: 'Studio Ceramic Stoneware' },
      { label: 'Aroma Peak', value: 'First 90 Seconds' },
      { label: 'Finish', value: 'Long Cocoa & Cardamom Spiced' },
    ],
  },
];

export const TheCraftSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentStep = CRAFT_STEPS[activeStepIndex];

  return (
    <section
      id="craft"
      aria-labelledby="the-craft-heading"
      className="relative py-24 sm:py-32 bg-roast-900/40 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-roast-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="copper" size="sm">02 · The Alchemy</Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                From Soil to Cup
              </span>
            </div>
            <h2
              id="the-craft-heading"
              className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
            >
              The Craft of Indian Specialty Coffee
            </h2>
          </div>

          <p className="text-sm text-cream-300 font-sans max-w-md">
            Six disciplined stages of precision, patience, and science behind every cup we brew.
          </p>
        </div>

        {/* Interactive Craft Journey Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 items-center">
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-5 space-y-3">
            {CRAFT_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-all duration-300 flex items-start gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-400 ${
                    isActive
                      ? 'bg-gradient-to-r from-roast-800/90 to-espresso-900/90 border-caramel-500/80 shadow-warm-md'
                      : 'bg-espresso-950/40 border-roast-800/80 hover:bg-roast-800/40 hover:border-roast-700'
                  }`}
                  aria-pressed={isActive}
                >
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                      isActive
                        ? 'bg-caramel-500 text-espresso-950 border-caramel-400 font-bold'
                        : 'bg-roast-900 text-copper-400 border-roast-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-copper-400">
                        STAGE {step.number}
                      </span>
                      {isActive && (
                        <span className="text-xs text-caramel-300 font-mono flex items-center gap-1">
                          Active Stage <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-serif text-base sm:text-lg font-semibold mt-0.5 transition-colors ${
                        isActive ? 'text-cream-50' : 'text-cream-300'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Stage Detail Showcase Card */}
          <div className="lg:col-span-7">
            <Card
              variant="elevated"
              className="p-6 sm:p-8 bg-gradient-to-b from-roast-800/90 via-espresso-900/95 to-espresso-950 border-roast-700 relative overflow-hidden shadow-warm-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.number}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  {/* Stage Image with Cinematic Overlay */}
                  <div className="relative rounded-lg overflow-hidden h-64 sm:h-72 border border-roast-700/80 shadow-warm-md">
                    <img
                      src={currentStep.image}
                      alt={currentStep.title}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="caramel" size="sm">
                        Stage {currentStep.number} of 06
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-xs uppercase font-mono tracking-widest text-caramel-300 font-semibold">
                        {currentStep.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Stage Description */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-cream-50 font-bold">
                      {currentStep.title}
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-cream-200/90 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>

                  {/* Technical Extraction Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-roast-800">
                    {currentStep.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-3 bg-espresso-950/70 border border-roast-800/80 rounded-md"
                      >
                        <p className="text-[10px] uppercase font-mono tracking-widest text-cream-400">
                          {spec.label}
                        </p>
                        <p className="font-mono text-xs sm:text-sm font-semibold text-copper-300 mt-0.5">
                          {spec.value}
                        </p>
                      </div>
                    ))}
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
