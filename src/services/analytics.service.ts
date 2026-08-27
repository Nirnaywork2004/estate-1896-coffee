import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';

const EVENTS_STORAGE_KEY = 'estate1896_customer_events_v1';

export type CustomerEventType = 'whatsapp_tracking_click' | 'phone_click' | 'reorder_click';

export interface CustomerEventPayload {
  orderId?: string;
  orderNumber?: string;
  eventType: CustomerEventType;
  metadata?: Record<string, any>;
}

export interface CustomerEventRecord extends CustomerEventPayload {
  id: string;
  timestamp: string;
}

export const analyticsService = {
  /**
   * Get all tracked local events
   */
  getLocalEvents(): CustomerEventRecord[] {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to get local analytics events:', e);
      return [];
    }
  },

  /**
   * Track a customer click event (WhatsApp tracking, Phone dialer, etc.)
   */
  async trackEvent(payload: CustomerEventPayload): Promise<CustomerEventRecord> {
    const timestamp = new Date().toISOString();
    const eventRecord: CustomerEventRecord = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...payload,
      timestamp,
    };

    // Save locally
    try {
      const existing = this.getLocalEvents();
      localStorage.setItem(
        EVENTS_STORAGE_KEY,
        JSON.stringify([eventRecord, ...existing.slice(0, 100)])
      );
    } catch (e) {
      console.error('Failed to cache event locally:', e);
    }

    // Sync to Supabase customer_events table
    if (isSupabaseConfigured()) {
      try {
        await (supabase.from('customer_events') as any).insert({
          order_id: payload.orderId || null,
          order_number: payload.orderNumber || null,
          event_type: payload.eventType,
          metadata: payload.metadata || {},
          created_at: timestamp,
        });
      } catch (err) {
        console.warn('Supabase event tracking warning:', err);
      }
    }

    return eventRecord;
  },

  /**
   * Specific helper for WhatsApp Tracking Click
   */
  async trackWhatsAppClick(orderNumber: string, orderId?: string) {
    return this.trackEvent({
      orderId,
      orderNumber,
      eventType: 'whatsapp_tracking_click',
      metadata: { channel: 'whatsapp', action: 'order_tracking' },
    });
  },

  /**
   * Specific helper for Phone Call Click
   */
  async trackPhoneClick(orderNumber?: string, orderId?: string) {
    return this.trackEvent({
      orderId,
      orderNumber,
      eventType: 'phone_click',
      metadata: { channel: 'phone', action: 'dialer_opened' },
    });
  },
};
