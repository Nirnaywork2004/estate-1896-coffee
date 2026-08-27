import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';
import { TableReservation, SeatingPreference } from '../types/reviews.types';
import { normalizeIndianPhone } from '../utils/phone';

const RESERVATIONS_STORAGE_KEY = 'estate1896_reservations_v1';

export interface CreateReservationInput {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestCount: number;
  reservationDate: string;
  reservationTime: string;
  seatingPreference: SeatingPreference;
  specialRequests?: string;
}

export const reservationsService = {
  /**
   * Get all reservations from local storage
   */
  getLocalReservations(): TableReservation[] {
    try {
      const saved = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to get local reservations:', e);
      return [];
    }
  },

  /**
   * Create a new table reservation
   */
  async createReservation(
    input: CreateReservationInput
  ): Promise<{ data: TableReservation | null; error: Error | null }> {
    const timestamp = Date.now();
    const reservationNumber = `RES-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${timestamp.toString().slice(-4)}`;
    const id = `res_${timestamp}`;

    const reservation: TableReservation = {
      id,
      reservationNumber,
      guestName: input.guestName.trim(),
      guestPhone: normalizeIndianPhone(input.guestPhone),
      guestEmail: input.guestEmail.trim(),
      guestCount: input.guestCount,
      reservationDate: input.reservationDate,
      reservationTime: input.reservationTime,
      seatingPreference: input.seatingPreference,
      specialRequests: input.specialRequests?.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Save locally
    try {
      const existing = this.getLocalReservations();
      localStorage.setItem(
        RESERVATIONS_STORAGE_KEY,
        JSON.stringify([reservation, ...existing])
      );
    } catch (e) {
      console.error('Failed to save reservation locally:', e);
    }

    // Sync with Supabase
    if (isSupabaseConfigured()) {
      try {
        const { error } = await (supabase.from('reservations') as any).insert({
          reservation_number: reservationNumber,
          guest_name: reservation.guestName,
          guest_phone: reservation.guestPhone,
          guest_email: reservation.guestEmail,
          guest_count: reservation.guestCount,
          reservation_date: reservation.reservationDate,
          reservation_time: reservation.reservationTime,
          seating_preference: reservation.seatingPreference,
          special_requests: reservation.specialRequests || null,
          status: 'confirmed',
        });

        if (error) {
          console.warn('Supabase reservation insert warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase reservation error:', err);
      }
    }

    return { data: reservation, error: null };
  },
};
