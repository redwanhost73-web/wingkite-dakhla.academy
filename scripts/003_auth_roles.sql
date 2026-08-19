-- Auth roles: tourist | client | business | admin
-- Run in Supabase SQL Editor after 002_cms_schema.sql

-- ── Profiles (all authenticated users) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  company_name TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'tourist'
    CHECK (role IN ('tourist', 'client', 'business', 'admin')),
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Migrate legacy admin_profiles → profiles (admin role)
INSERT INTO public.profiles (id, email, role)
SELECT user_id, email, 'admin'
FROM public.admin_profiles
ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      email = COALESCE(EXCLUDED.email, public.profiles.email);

-- Replace admin check to use profiles
CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated, anon;

-- Auto-create profile on signup (role from metadata; never allow admin via signup)
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
  IF requested IN ('tourist', 'client', 'business') THEN
    safe_role := requested;
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS profiles
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_site_admin());

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
CREATE POLICY "Admin manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

-- Keep admin_profiles in sync optionally (legacy admin CMS)
CREATE OR REPLACE FUNCTION public.sync_admin_profiles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    INSERT INTO public.admin_profiles (user_id, role, email)
    VALUES (NEW.id, 'admin', NEW.email)
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email, role = 'admin';
  ELSE
    DELETE FROM public.admin_profiles WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_profiles();

COMMENT ON TABLE public.profiles IS
  'User roles: tourist/client (optional account), business (signup), admin (assigned only).';
