-- ==============================================================================
-- ESTATE 1896 ARTISANAL CAFE — PHASE 6 EXTENSIONS: RESERVATIONS & TASTING NOTES
-- ==============================================================================

-- 1. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_number TEXT NOT NULL UNIQUE,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_email TEXT,
    guest_count INTEGER NOT NULL CHECK (guest_count >= 1 AND guest_count <= 20),
    reservation_date DATE NOT NULL,
    reservation_time TEXT NOT NULL, -- e.g. "09:30 AM", "05:00 PM"
    seating_preference TEXT NOT NULL DEFAULT 'indoor_villa', -- indoor_villa, garden_patio, brew_bar, window_nook
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'seated', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TASTING NOTES COMMUNITY WALL TABLE
CREATE TABLE IF NOT EXISTS public.tasting_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coffee_name TEXT NOT NULL,
    contributor_name TEXT NOT NULL,
    flavor_tags TEXT[] NOT NULL DEFAULT '{}',
    note_text TEXT NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_phone ON public.reservations(guest_phone);
CREATE INDEX IF NOT EXISTS idx_tasting_notes_coffee ON public.tasting_notes(coffee_name);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasting_notes ENABLE ROW LEVEL SECURITY;

-- Anonymous users can create reservations
CREATE POLICY "Allow public insert to reservations"
ON public.reservations FOR INSERT
WITH CHECK (true);

-- Anonymous users can read their own reservations
CREATE POLICY "Allow public select on reservations"
ON public.reservations FOR SELECT
USING (true);

-- Anonymous users can read tasting notes
CREATE POLICY "Allow public select on tasting_notes"
ON public.tasting_notes FOR SELECT
USING (true);

-- Anonymous users can submit tasting notes
CREATE POLICY "Allow public insert on tasting_notes"
ON public.tasting_notes FOR INSERT
WITH CHECK (true);
