import React from 'react';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  MapPin,
  Clock,
  Phone,
  Flame,
  ExternalLink,
  Navigation,
  Calendar,
  Coffee,
} from 'lucide-react';

export const RoasteryLocationSection: React.FC = () => {
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=100+Feet+Road+Indiranagar+Bengaluru+Karnataka+560038';

  const scrollToReservations = () => {
    const target = document.getElementById('reservations');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="relative py-24 sm:py-32 bg-roast-900/40 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Location Narrative & Operational Details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="copper" size="sm">
                  <MapPin className="w-3 h-3 text-copper-400" />
                  The Sanctuary
                </Badge>
                <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                  Indiranagar, Bengaluru
                </span>
              </div>
              <h2
                id="location-heading"
                className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
              >
                Where Single-Origin Terroir Meets the City
              </h2>
              <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed">
                Situated in a quiet green pocket off 100 Feet Road, Estate 1896 is our flagship roasting laboratory and café. A place where coffee from the Western Ghats is freshly transformed each dawn.
              </p>
            </div>

            {/* Address & Operational Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card variant="default" className="p-5 bg-espresso-950/80 border-roast-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-caramel-400 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Villa Address</span>
                </div>
                <p className="font-serif text-sm font-semibold text-cream-100">
                  1896 Heritage Villa
                </p>
                <p className="text-xs text-cream-300 font-sans leading-relaxed">
                  100 Feet Road (Near Metro Pillar 42), Indiranagar, Bengaluru, Karnataka 560038
                </p>
              </Card>

              <Card variant="default" className="p-5 bg-espresso-950/80 border-roast-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-copper-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Roastery Hours</span>
                </div>
                <p className="font-serif text-sm font-semibold text-cream-100">
                  Open Every Day
                </p>
                <p className="text-xs text-cream-300 font-sans leading-relaxed">
                  07:00 AM — 11:30 PM <br />
                  <span className="text-copper-300 font-mono text-[11px]">Bakehouse fresh at 06:30 AM</span>
                </p>
              </Card>
            </div>

            {/* Live Roast & Cupping Schedule Banner */}
            <div className="p-5 rounded-xl bg-espresso-950 border border-roast-700/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-caramel-300 font-semibold">
                <Flame className="w-4 h-4 text-caramel-400" />
                <span>Live Roasting & Cupping Program</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div className="space-y-0.5">
                  <p className="font-semibold text-cream-100 font-mono">Tue & Sat · 08:00 AM — 11:00 AM</p>
                  <p className="text-cream-400 text-[11px]">Live cast-iron drum micro-roast sessions</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-cream-100 font-mono">Sundays · 10:30 AM</p>
                  <p className="text-cream-400 text-[11px]">Master Barista public sensory cupping (Free)</p>
                </div>
              </div>
            </div>

            {/* Contact & Map CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-xs transition-colors shadow-warm-md"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-xs hover:border-caramel-400"
                leftIcon={<Calendar className="w-3.5 h-3.5 text-copper-400" />}
                onClick={scrollToReservations}
              >
                Reserve a Table
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Styled Map Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-roast-700/90 shadow-warm-lg bg-espresso-950">
              {/* Map Canvas Visual Mockup with High Aesthetics */}
              <div className="relative h-80 sm:h-[420px] w-full bg-gradient-to-br from-espresso-950 via-roast-950 to-roast-900 overflow-hidden flex items-center justify-center p-6">
                {/* Stylized Grid Lines */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgba(200, 138, 74, 0.4) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Stylized Arterial Roads of Indiranagar */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 50 0 L 150 420"
                    stroke="#C88A4A"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                  <path
                    d="M 0 200 L 600 220"
                    stroke="#B86B43"
                    strokeWidth="4"
                  />
                  <path
                    d="M 280 0 L 320 420"
                    stroke="#F5EFEB"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                </svg>

                {/* Pulsing Pin for Estate 1896 Villa */}
                <div className="relative z-10 flex flex-col items-center space-y-2">
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-caramel-500/20 animate-ping absolute" />
                    <div className="w-12 h-12 rounded-full bg-caramel-500 text-espresso-950 flex items-center justify-center shadow-warm-lg font-bold">
                      <Coffee className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Pin Info Tooltip */}
                  <div className="p-3 bg-espresso-950/95 border border-caramel-500/80 rounded-xl shadow-warm-lg text-center space-y-0.5 backdrop-blur-md">
                    <p className="font-serif text-xs font-bold text-cream-50">
                      Estate 1896 Roastery
                    </p>
                    <p className="text-[10px] font-mono text-copper-300">
                      100ft Road · Indiranagar
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[9px] font-mono mt-1">
                      ● Open Now until 11:30 PM
                    </span>
                  </div>
                </div>

                {/* Nearby Landmarks Chips */}
                <div className="absolute top-4 left-4 p-2 rounded-lg bg-espresso-950/85 border border-roast-800 text-[10px] font-mono text-cream-300 backdrop-blur-sm">
                  Metro Pillar 42 · 120m
                </div>

                <div className="absolute bottom-4 right-4 p-2 rounded-lg bg-espresso-950/85 border border-roast-800 text-[10px] font-mono text-cream-300 backdrop-blur-sm">
                  100 Feet Rd & CMH Rd Junction
                </div>
              </div>

              {/* Bottom Card Strip */}
              <div className="p-4 bg-espresso-900 border-t border-roast-800 flex items-center justify-between text-xs font-mono text-cream-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-copper-400" />
                  +91 74070 04397
                </span>
                <span className="text-caramel-400">Valet Parking Available</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
