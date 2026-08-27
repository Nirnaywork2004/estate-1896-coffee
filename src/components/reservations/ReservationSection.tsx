import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SeatingPreference, TableReservation } from '../../types/reviews.types';
import { reservationsService } from '../../services/reservations.service';
import { isValidIndianMobile, normalizeIndianPhone } from '../../utils/phone';
import {
  Calendar,
  Clock,
  Users,
  Utensils,
  CheckCircle2,
  Sparkles,
  Send,
  Coffee,
  Sun,
  Trees,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

const TIME_SLOTS = [
  { time: '08:30 AM', period: 'Morning Brew' },
  { time: '10:00 AM', period: 'Morning Brew' },
  { time: '11:30 AM', period: 'Morning Brew' },
  { time: '01:30 PM', period: 'Afternoon Pour' },
  { time: '03:00 PM', period: 'Afternoon Pour' },
  { time: '04:30 PM', period: 'Afternoon Pour' },
  { time: '06:00 PM', period: 'Evening Sanctuary' },
  { time: '07:30 PM', period: 'Evening Sanctuary' },
  { time: '09:00 PM', period: 'Evening Sanctuary' },
];

const SEATING_OPTIONS: { id: SeatingPreference; title: string; desc: string; icon: React.ElementType }[] = [
  {
    id: 'indoor_villa',
    title: 'Heritage Villa Hall',
    desc: 'Restored teakwood tables with gentle ambient jazz',
    icon: Coffee,
  },
  {
    id: 'garden_patio',
    title: 'Courtyard Garden',
    desc: 'Open-air seating under ficus trees and night lanterns',
    icon: Trees,
  },
  {
    id: 'brew_bar',
    title: 'Slow Brew Counter',
    desc: 'Bar stool front-row view of single-origin extractions',
    icon: Sparkles,
  },
  {
    id: 'window_nook',
    title: 'Sunlit Reading Nook',
    desc: 'Quiet corner with natural light, perfect for thinkers',
    icon: Sun,
  },
];

export const ReservationSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [seatingPreference, setSeatingPreference] = useState<SeatingPreference>('indoor_villa');

  // Contact State
  const [guestName, setGuestName] = useState<string>('Aarav Sharma');
  const [guestPhone, setGuestPhone] = useState<string>('9845018960');
  const [guestEmail, setGuestEmail] = useState<string>('aarav.sharma@example.com');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDateShortcut = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!guestName.trim()) newErrors.guestName = 'Name is required.';
    if (!isValidIndianMobile(guestPhone)) {
      newErrors.guestPhone = 'Please enter a valid 10-digit Indian mobile number (+91).';
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      newErrors.guestEmail = 'Valid email is required.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await reservationsService.createReservation({
        guestName,
        guestPhone: normalizeIndianPhone(guestPhone),
        guestEmail,
        guestCount,
        reservationDate: selectedDate,
        reservationTime: selectedTime,
        seatingPreference,
        specialRequests,
      });

      if (error || !data) {
        throw new Error(error?.message || 'Failed to create reservation');
      }

      setConfirmedReservation(data);
    } catch (err) {
      console.error('Reservation creation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="reservations"
      aria-labelledby="reservation-heading"
      className="relative py-24 sm:py-32 bg-espresso-950 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Context & Atmosphere Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="caramel" size="sm">
                  <Calendar className="w-3 h-3 text-caramel-400" />
                  Table Booking
                </Badge>
                <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                  Indiranagar Villa
                </span>
              </div>
              <h2
                id="reservation-heading"
                className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
              >
                Reserve Your Roastery Sanctuary
              </h2>
              <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed">
                Whether you seek a quiet morning table for coffee and reflection or a slow brew bar experience with our master roaster, we hold your space with care.
              </p>
            </div>

            {/* Villa Reservation Perks Card */}
            <div className="p-5 rounded-xl bg-roast-900/40 border border-roast-800 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-copper-300 font-semibold block">
                Hospitality Standards
              </span>
              <ul className="space-y-2 text-xs text-cream-300 font-sans">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel-400" />
                  <span>Complimentary palate-cleansing mineral water with all reservations.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel-400" />
                  <span>Tables held for 15 minutes past reservation time.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel-400" />
                  <span>No minimum spend; laptop-friendly quiet zones available.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Reservation Wizard */}
          <div className="lg:col-span-7">
            <Card
              variant="elevated"
              className="p-6 sm:p-8 bg-gradient-to-b from-roast-900 via-espresso-900 to-espresso-950 border-roast-700 rounded-2xl shadow-warm-lg space-y-6"
            >
              <form onSubmit={handleReserve} className="space-y-6">
                {/* 1. Date Selection */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-caramel-400" />
                      1. Select Date
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDateShortcut(0)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer',
                        selectedDate === new Date().toISOString().slice(0, 10)
                          ? 'bg-caramel-500 text-espresso-950 border-caramel-400 font-bold'
                          : 'bg-roast-900 text-cream-300 border-roast-700 hover:border-roast-600'
                      )}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDateShortcut(1)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer',
                        selectedDate ===
                          new Date(Date.now() + 86400000).toISOString().slice(0, 10)
                          ? 'bg-caramel-500 text-espresso-950 border-caramel-400 font-bold'
                          : 'bg-roast-900 text-cream-300 border-roast-700 hover:border-roast-600'
                      )}
                    >
                      Tomorrow
                    </button>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="p-1.5 px-3 bg-roast-900 border border-roast-700 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-caramel-500"
                    />
                  </div>
                </div>

                {/* 2. Time Slot Chips */}
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-copper-400" />
                    2. Select Time Slot
                  </span>

                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTime(slot.time)}
                          className={cn(
                            'p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center',
                            FOCUS_RING_CLASSES,
                            isSelected
                              ? 'bg-caramel-500/20 border-caramel-500 text-cream-50 font-bold shadow-warm-sm'
                              : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                          )}
                        >
                          <span className="font-mono text-xs">{slot.time}</span>
                          <span className="text-[9px] font-sans text-cream-400">{slot.period}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Number of Guests */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-caramel-400" />
                      3. Party Size
                    </span>
                    <span className="text-caramel-300 font-bold">{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {[1, 2, 3, 4, 5, 6, 8].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setGuestCount(count)}
                        className={cn(
                          'w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer shrink-0',
                          guestCount === count
                            ? 'bg-caramel-500 text-espresso-950 border-caramel-400 shadow-warm-sm'
                            : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                        )}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Seating Preference */}
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-copper-400" />
                    4. Seating Atmosphere
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SEATING_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = seatingPreference === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSeatingPreference(opt.id)}
                          className={cn(
                            'p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-3',
                            FOCUS_RING_CLASSES,
                            isSelected
                              ? 'bg-copper-500/15 border-copper-500 text-cream-50 shadow-warm-sm'
                              : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                          )}
                        >
                          <div
                            className={cn(
                              'w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5',
                              isSelected ? 'bg-copper-500 text-cream-50' : 'bg-roast-800 text-copper-400'
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-serif text-xs font-bold">{opt.title}</p>
                            <p className="text-[10px] font-sans text-cream-400 mt-0.5 leading-tight">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Contact Details */}
                <div className="space-y-3 pt-2 border-t border-roast-800">
                  <span className="text-xs font-mono uppercase tracking-wider text-caramel-400 font-semibold block">
                    5. Guest Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Full Name *"
                        className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs font-sans text-cream-100 focus:outline-none focus:border-caramel-500"
                      />
                      {errors.guestName && (
                        <p className="text-[10px] text-red-400 mt-1">{errors.guestName}</p>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-copper-400 font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98450 18960 *"
                        className="w-full pl-11 pr-3 p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-caramel-500"
                      />
                      {errors.guestPhone && (
                        <p className="text-[10px] text-red-400 mt-1">{errors.guestPhone}</p>
                      )}
                    </div>
                  </div>

                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Email Address (for calendar invite) *"
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs font-sans text-cream-100 focus:outline-none focus:border-caramel-500"
                  />

                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Special requests, dietary preferences, or celebration notes..."
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs font-sans text-cream-200 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full justify-center font-bold text-xs shadow-warm-lg bg-caramel-500 hover:bg-caramel-400 text-espresso-950"
                >
                  Confirm Table Reservation
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>

      {/* Reservation Confirmation Modal */}
      <AnimatePresence>
        {confirmedReservation && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Reservation Confirmed"
            className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-gradient-to-b from-roast-900 via-espresso-900 to-espresso-950 border border-roast-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-warm-lg text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1">
                <Badge variant="caramel" size="sm">
                  <Sparkles className="w-3 h-3 text-caramel-400" />
                  Reservation Confirmed
                </Badge>
                <h3 className="font-serif text-2xl font-bold text-cream-50 pt-1">
                  We look forward to hosting you, {confirmedReservation.guestName}!
                </h3>
                <p className="text-xs text-cream-400 font-mono">
                  Reservation Code:{' '}
                  <span className="text-caramel-300 font-bold">
                    {confirmedReservation.reservationNumber}
                  </span>
                </p>
              </div>

              {/* Reservation Details Box */}
              <div className="p-4 bg-espresso-950 rounded-xl border border-roast-800 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between text-cream-300">
                  <span className="text-cream-400">Date:</span>
                  <span>{confirmedReservation.reservationDate}</span>
                </div>
                <div className="flex justify-between text-cream-300">
                  <span className="text-cream-400">Time:</span>
                  <span>{confirmedReservation.reservationTime}</span>
                </div>
                <div className="flex justify-between text-cream-300">
                  <span className="text-cream-400">Party Size:</span>
                  <span>{confirmedReservation.guestCount} Guests</span>
                </div>
                <div className="flex justify-between text-cream-300">
                  <span className="text-cream-400">Atmosphere:</span>
                  <span className="capitalize">{confirmedReservation.seatingPreference.replace('_', ' ')}</span>
                </div>
              </div>

              {/* WhatsApp Sync Button */}
              <a
                href={`https://wa.me/917407004397?text=${encodeURIComponent(
                  `*RESERVATION INQUIRY — ESTATE 1896*\nCode: ${confirmedReservation.reservationNumber}\nGuest: ${confirmedReservation.guestName}\nDate: ${confirmedReservation.reservationDate} at ${confirmedReservation.reservationTime}\nGuests: ${confirmedReservation.guestCount}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 rounded-lg p-2.5 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save to WhatsApp (+91)</span>
              </a>

              <Button
                variant="primary"
                size="md"
                className="w-full justify-center text-xs font-bold"
                onClick={() => setConfirmedReservation(null)}
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
