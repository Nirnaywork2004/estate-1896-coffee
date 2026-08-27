import React from 'react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { MapPin, Users, Flame, Coffee } from 'lucide-react';

export const CafeExperienceSection: React.FC = () => {
  return (
    <section
      id="story"
      aria-labelledby="cafe-experience-heading"
      className="relative py-24 sm:py-32 bg-roast-900/40 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="flex items-center gap-2">
            <Badge variant="copper" size="sm">06 · Sanctuary</Badge>
            <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
              The Roastery Villa
            </span>
          </div>

          <h2
            id="cafe-experience-heading"
            className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
          >
            A Space for Unhurried Moments
          </h2>

          <p className="font-sans text-fluid-body text-cream-300 leading-relaxed">
            Housed in a restored mid-century heritage villa on Indiranagar’s 100 Feet Road, Estate 1896 was designed as an antidote to hurried modern life.
          </p>
        </div>

        {/* Cinematic Roastery Visual Showcase */}
        <div className="relative rounded-2xl overflow-hidden border border-roast-700/80 shadow-warm-lg mb-12 group">
          <img
            src="/images/cafe-interior.jpg"
            alt="Warm ambient evening atmosphere inside Estate 1896 roastery café in Indiranagar Bengaluru"
            className="w-full h-80 sm:h-[480px] lg:h-[540px] object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/40 to-transparent" />

          {/* Overlay details */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-widest text-caramel-300 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-copper-400" />
                Indiranagar, Bengaluru
              </span>
              <p className="font-serif text-xl sm:text-2xl text-cream-50 font-bold">
                The Heritage Roastery & Brew Bar
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono text-cream-200">
              <span className="px-3 py-1.5 rounded-full bg-espresso-950/90 border border-roast-700 backdrop-blur-sm">
                Open Daily: 07:00 AM — 11:30 PM
              </span>
              <span className="px-3 py-1.5 rounded-full bg-espresso-950/90 border border-caramel-500/50 text-caramel-300 backdrop-blur-sm">
                Live Roasts: Tue & Sat Mornings
              </span>
            </div>
          </div>
        </div>

        {/* 3 Atmosphere Vignettes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="p-6 space-y-3 bg-espresso-950/60 border-roast-800">
            <div className="w-9 h-9 rounded-md bg-roast-800 border border-roast-700 flex items-center justify-center text-caramel-400">
              <Coffee className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-cream-100">
              The Slow Brew Bar
            </h3>
            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed font-sans">
              Pull up a stool at the solid brass and teakwood counter. Watch baristas calibrate V60s, Aeropresses, and siphon brews to exact mineral and temperature ratios.
            </p>
          </Card>

          <Card variant="default" className="p-6 space-y-3 bg-espresso-950/60 border-roast-800">
            <div className="w-9 h-9 rounded-md bg-roast-800 border border-roast-700 flex items-center justify-center text-copper-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-cream-100">
              Community & Conversation
            </h3>
            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed font-sans">
              Long reclaimed timber tables, natural daylight filtered through ficus trees, and no hurried turnarounds. A true third-space for thinkers and makers.
            </p>
          </Card>

          <Card variant="default" className="p-6 space-y-3 bg-espresso-950/60 border-roast-800">
            <div className="w-9 h-9 rounded-md bg-roast-800 border border-roast-700 flex items-center justify-center text-caramel-400">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-cream-100">
              On-Site Micro-Roastery
            </h3>
            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed font-sans">
              Experience the intoxicating aromas of green coffee beans transitioning through Maillard reactions during live roast sessions every week.
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
};
