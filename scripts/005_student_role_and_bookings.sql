-- Rename client → student; add student bookings for profile page.
-- Run in Supabase SQL Editor after 003/004.

-- 1) Migrate role values
UPDATE public.profiles
SET role = 'student'
WHERE role = 'client';

-- 2) Replace CHECK constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('tourist', 'student', 'business', 'admin'));

-- 3) Signup trigger: allow student (never admin via signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested TEXT := COALESCE(NEW.raw_user_meta_data->>'role', 'tourist');
  safe_role TEXT;
BEGIN
  IF requested IN ('tourist', 'student', 'business', 'client') THEN
    -- Accept legacy 'client' metadata as student
    safe_role := CASE WHEN requested = 'client' THEN 'student' ELSE requested END;
  ELSE
    safe_role := 'tourist';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, phone, company_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    safe_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

COMMENT ON TABLE public.profiles IS
  'Roles: tourist/student (public site + /profile), business (/business), admin (/admin).';

-- 4) Student/tourist bookings (managed on /profile/bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'confirmed', 'cancelled', 'completed')),
  activity TEXT NOT NULL DEFAULT '',
  preferred_date DATE,
  people INT DEFAULT 1,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_created_idx ON public.bookings(created_at DESC);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own bookings" ON public.bookings;
CREATE POLICY "Users read own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_site_admin());

DROP POLICY IF EXISTS "Users insert own bookings" ON public.bookings;
CREATE POLICY "Users insert own bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own bookings" ON public.bookings;
CREATE POLICY "Users update own bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_site_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_site_admin());

DROP POLICY IF EXISTS "Users delete own bookings" ON public.bookings;
CREATE POLICY "Users delete own bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.is_site_admin());

DROP TRIGGER IF EXISTS bookings_set_updated_at ON public.bookings;
CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

NOTIFY pgrst, 'reload schema';
