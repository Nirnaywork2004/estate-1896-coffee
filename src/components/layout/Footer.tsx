import React from 'react';
import { Container } from '../ui/Container';
import { Coffee, MapPin, Phone, Clock, Send, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-espresso-950 text-cream-100 border-t border-roast-800/80 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-caramel-500/5 rounded-full blur-[140px] pointer-events-none" />

      <Container size="xl" className="relative z-10 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-roast-800/80">
          {/* Col 1: Brand & Narrative (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-roast-800 border border-caramel-500/40 flex items-center justify-center text-caramel-400">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-cinematic text-cream-50 uppercase">
                  ESTATE 1896
                </span>
                <span className="text-[10px] uppercase tracking-superwide text-copper-400 font-mono -mt-1">
                  Artisanal Coffee Roastery
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-cream-300 leading-relaxed max-w-sm">
              Born in the mist-laden hills of the Western Ghats. Roasted in small cast-iron batches and brewed with meticulous craft at our flagship Indiranagar heritage villa.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-copper-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Indiranagar Roastery Active Today</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-caramel-400 font-semibold">
              The Journey
            </h4>
            <ul className="space-y-2 text-xs font-sans text-cream-300">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('craft-transition')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  The Philosophy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('the-craft')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  The 6-Stage Craft
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('collection')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Bean Personalities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('signature')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Signature Creations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('bakery')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Sourdough Bakehouse
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hospitality Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-caramel-400 font-semibold">
              Hospitality
            </h4>
            <ul className="space-y-2 text-xs font-sans text-cream-300">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('menu')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Full Café Menu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('tasting-wall')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Tasting Notes Wall
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('reviews')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Patron Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('reservations')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Table Reservations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('location')}
                  className={cn('hover:text-caramel-300 transition-colors', FOCUS_RING_CLASSES)}
                >
                  Sanctuary Location
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Roastery Details & WhatsApp (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-caramel-400 font-semibold">
              Visit The Roastery
            </h4>

            <div className="space-y-2 text-xs text-cream-300 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-copper-400 shrink-0 mt-0.5" />
                <span>1896 Heritage Villa, 100 Feet Road (Near Metro Pillar 42), Indiranagar, Bengaluru 560038</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-copper-400 shrink-0" />
                <span>Daily 07:00 AM — 11:30 PM · Valet Available</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-copper-400 shrink-0" />
                <span className="font-mono">+91 74070 04397</span>
              </div>
            </div>

            <a
              href="https://wa.me/917407004397?text=Hello%20Estate%201896%20Roastery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp (+91)</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright & Terroir Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream-400">
          <p>© {currentYear} Estate 1896 Artisanal Coffee Roastery. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-copper-300">
            <span>Brewed with</span>
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>in Bengaluru, Karnataka</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
