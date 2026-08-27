-- ==============================================================================
-- ESTATE 1896 ARTISANAL CAFE — CUSTOMER ENGAGEMENT & CLICK TRACKING EVENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.customer_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT,
    order_number TEXT,
    event_type TEXT NOT NULL, -- 'whatsapp_tracking_click', 'phone_click', etc.
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customer_events_type ON public.customer_events(event_type);
CREATE INDEX IF NOT EXISTS idx_customer_events_order ON public.customer_events(order_number);

ALTER TABLE public.customer_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert customer events"
ON public.customer_events FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read customer events"
ON public.customer_events FOR SELECT
USING (true);
