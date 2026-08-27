import React from 'react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Quote } from 'lucide-react';

export const MoreThanCoffeeSection: React.FC = () => {
  return (
    <section
      id="craft-transition"
      aria-labelledby="more-than-coffee-heading"
      className="relative py-28 sm:py-36 lg:py-44 bg-espresso-950 text-cream-100 overflow-hidden border-t border-roast-800/80"
    >
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-caramel-500/5 rounded-full blur-[140px] pointer-events-none" />

      <Container size="xl" className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-copper-400/60" aria-hidden="true" />
            <Badge variant="copper" size="sm">
              <Sparkles className="w-3 h-3 text-caramel-400" />
              01 · THE PHILOSOPHY
            </Badge>
            <span className="w-8 h-[1px] bg-copper-400/60" aria-hidden="true" />
          </div>

          {/* Main Statement */}
          <h2
            id="more-than-coffee-heading"
            className="font-serif text-fluid-display font-bold text-cream-50 tracking-tight leading-[1.08] text-balance"
          >
            More than coffee.{' '}
            <span className="italic font-normal text-caramel-300 block sm:inline mt-2 sm:mt-0">
              A ritual, a craft, a place to pause.
            </span>
          </h2>

          {/* Editorial Narrative */}
          <p className="font-sans text-fluid-body-lg text-cream-200/90 leading-relaxed max-w-2xl mx-auto text-balance">
            At Estate 1896, we believe the finest coffee begins long before the kettle boils. It is born in the mist-laden hills of the Western Ghats, nurtured by biodiverse shade canopies, and transformed through meticulous small-batch roasting into a sensory sanctuary.
          </p>

          {/* Editorial Pull-Quote Card */}
          <div className="pt-6 sm:pt-8 max-w-2xl mx-auto">
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-b from-roast-900/70 to-espresso-900/90 border border-roast-700/80 shadow-warm-lg relative">
              <Quote className="w-8 h-8 text-caramel-400/30 absolute top-4 left-4 -translate-y-2 pointer-events-none" />
              <p className="font-serif text-lg sm:text-xl italic text-cream-100 leading-relaxed">
                “We do not rush the pour. We calibrate each morning’s grind to the humidity of the air and the temper of the beans.”
              </p>
              <div className="mt-4 pt-4 border-t border-roast-800 flex items-center justify-center gap-2 text-xs uppercase font-mono tracking-widest text-copper-300">
                <span>The Master Roaster</span>
                <span className="text-roast-600">·</span>
                <span>Estate 1896 Heritage Villa</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
