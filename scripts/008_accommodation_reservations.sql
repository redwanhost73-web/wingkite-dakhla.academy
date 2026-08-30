-- Accommodation reservation requests (public form → admin inbox).
-- Run in Supabase SQL Editor after prior scripts.

CREATE TABLE IF NOT EXISTS public.accommodation_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id TEXT NOT NULL,
  hotel_name TEXT NOT NULL DEFAULT '',
  room_id TEXT NOT NULL,
  room_name TEXT NOT NULL DEFAULT '',
  meal_plan TEXT NOT NULL DEFAULT 'bb'
    CHECK (meal_plan IN ('bb', 'hb', 'fb')),
  guests INT NOT NULL DEFAULT 1 CHECK (guests >= 1 AND guests <= 20),
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  nights INT NOT NULL DEFAULT 1 CHECK (nights >= 1),
  price_per_night NUMERIC(10, 2),
  total_estimate NUMERIC(10, 2),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  notes TEXT NOT NULL DEFAULT '',
  locale TEXT DEFAULT 'fr',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT accommodation_reservations_dates_chk CHECK (departure_date > arrival_date)
);

CREATE INDEX IF NOT EXISTS accommodation_reservations_created_idx
  ON public.accommodation_reservations(created_at DESC);
CREATE INDEX IF NOT EXISTS accommodation_reservations_status_idx
  ON public.accommodation_reservations(status);

ALTER TABLE public.accommodation_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone submit accommodation reservation"
  ON public.accommodation_reservations;
CREATE POLICY "Anyone submit accommodation reservation"
  ON public.accommodation_reservations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage accommodation reservations"
  ON public.accommodation_reservations;
CREATE POLICY "Admin manage accommodation reservations"
  ON public.accommodation_reservations
  FOR ALL TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

DROP TRIGGER IF EXISTS accommodation_reservations_set_updated_at
  ON public.accommodation_reservations;
CREATE TRIGGER accommodation_reservations_set_updated_at
  BEFORE UPDATE ON public.accommodation_reservations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

NOTIFY pgrst, 'reload schema';
