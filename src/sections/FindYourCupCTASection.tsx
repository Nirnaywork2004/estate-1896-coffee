import React from 'react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

export const FindYourCupCTASection: React.FC = () => {
  return (
    <section
      id="menu-cta"
      aria-labelledby="find-your-cup-heading"
      className="relative py-28 sm:py-36 lg:py-40 bg-gradient-to-b from-espresso-950 via-roast-900/80 to-espresso-950 text-cream-100 border-t border-roast-800/80 overflow-hidden text-center"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-caramel-500/10 rounded-full blur-[140px] pointer-events-none" />

      <Container size="xl" className="relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-copper-400/60" aria-hidden="true" />
            <Badge variant="caramel" size="sm">
              <Sparkles className="w-3 h-3 text-caramel-400" />
              07 · INVITATION
            </Badge>
            <span className="w-8 h-[1px] bg-copper-400/60" aria-hidden="true" />
          </div>

          {/* Headline */}
          <h2
            id="find-your-cup-heading"
            className="font-serif text-fluid-display font-bold text-cream-50 tracking-tight leading-[1.08]"
          >
            Find Your Cup.{' '}
            <span className="italic font-normal text-caramel-300 block sm:inline mt-2 sm:mt-0">
              Crafted for Your Palate.
            </span>
          </h2>

          {/* Supporting Text */}
          <p className="font-sans text-fluid-body-lg text-cream-200/90 leading-relaxed max-w-xl mx-auto text-balance">
            Whether you crave the wine-like acidity of a light-roast Araku pour-over or the bold, spiced molasses of a dark-roasted Monsooned Malabar, your coffee ritual awaits.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              className="group w-full sm:w-auto"
              rightIcon={
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              }
              onClick={() => {
                const target = document.getElementById('collection');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Full Coffee Catalogue
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto hover:border-caramel-400"
              leftIcon={<MapPin className="w-4 h-4 text-copper-400" />}
              onClick={() => {
                const target = document.getElementById('story');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Visit Our Indiranagar Roastery
            </Button>
          </div>

          {/* Footer Sub-Note */}
          <div className="pt-10 border-t border-roast-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Baristas Brewing Today · Indiranagar Villa</span>
            </div>
            <span>ESTATE 1896 · INDIAN SPECIALTY ROASTERS</span>
          </div>
        </div>
      </Container>
    </section>
  );
};
