-- BOOTSTRAP: run once in Supabase → SQL Editor → New query → Run
-- Project: fjoumrtwmgamwhaazxca.supabase.co

-- Wing Kite Dakhla Academy — CMS schema (Supabase Free)
-- Run in Supabase SQL Editor. Safe to re-run (IF NOT EXISTS / ON CONFLICT).
-- Public site: anon SELECT. Admin: authenticated users in admin_profiles.

-- ── Helpers ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Admin profiles (link Auth users → CMS access) ────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read own profile" ON public.admin_profiles;
CREATE POLICY "Admins read own profile" ON public.admin_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_site_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO authenticated, anon;

-- ── Site settings (singleton id = 1) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  school_name TEXT NOT NULL DEFAULT 'Wing Kite Dakhla Academy',
  phone TEXT DEFAULT '+212766910203',
  whatsapp TEXT DEFAULT '212766910203',
  email_public TEXT DEFAULT 'wingkitedakhla@gmail.com',
  email_booking TEXT DEFAULT 'contact@wingkitedakhla.com',
  address_fr TEXT DEFAULT 'Lagon de Dakhla, Maroc',
  address_en TEXT DEFAULT 'Dakhla Lagoon, Morocco',
  address_es TEXT DEFAULT 'Laguna de Dakhla, Marruecos',
  address_ar TEXT DEFAULT 'بحيرة الداخلة، المغرب',
  hours_fr TEXT DEFAULT 'Tous les jours: 8h - 18h',
  hours_en TEXT DEFAULT 'Every day: 8am - 6pm',
  hours_es TEXT DEFAULT 'Todos los días: 8h - 18h',
  hours_ar TEXT DEFAULT 'كل يوم: 8ص - 6م',
  lat DOUBLE PRECISION DEFAULT 23.914896,
  lng DOUBLE PRECISION DEFAULT -15.774543,
  google_maps_url TEXT,
  google_review_url TEXT DEFAULT 'https://g.page/r/CYv3UKOLHTcQEBM/review',
  facebook_url TEXT DEFAULT 'https://facebook.com/wingkitedakhla',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/wing_kite_dakhla_academy',
  youtube_url TEXT DEFAULT 'https://youtube.com/@wingkitedakhla',
  logo_url TEXT DEFAULT '/Logo/Logo.png',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ── Images (keyed slots) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_images (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL DEFAULT 'home',
  alt_fr TEXT DEFAULT '',
  alt_en TEXT DEFAULT '',
  alt_es TEXT DEFAULT '',
  alt_ar TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Pricing rows ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_pricing (
  id TEXT PRIMARY KEY,
  hours TEXT NOT NULL,
  semi_eur INTEGER NOT NULL DEFAULT 0,
  semi_mad INTEGER NOT NULL DEFAULT 0,
  priv_eur INTEGER NOT NULL DEFAULT 0,
  priv_mad INTEGER NOT NULL DEFAULT 0,
  is_extra BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Editable texts ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_texts (
  key TEXT PRIMARY KEY,
  value_fr TEXT NOT NULL DEFAULT '',
  value_en TEXT NOT NULL DEFAULT '',
  value_es TEXT NOT NULL DEFAULT '',
  value_ar TEXT NOT NULL DEFAULT '',
  section TEXT NOT NULL DEFAULT 'general',
  label TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Media pack ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_packs (
  id TEXT PRIMARY KEY DEFAULT 'default',
  price_eur INTEGER NOT NULL DEFAULT 60,
  title_fr TEXT NOT NULL DEFAULT 'Media pack',
  title_en TEXT NOT NULL DEFAULT 'Media pack',
  title_es TEXT NOT NULL DEFAULT 'Media pack',
  title_ar TEXT NOT NULL DEFAULT 'Media pack',
  short_fr TEXT NOT NULL DEFAULT 'Option · Media pack 60€',
  short_en TEXT NOT NULL DEFAULT 'Option · Media pack €60',
  short_es TEXT NOT NULL DEFAULT 'Opción · Media pack 60€',
  short_ar TEXT NOT NULL DEFAULT 'خيار · Media pack 60€',
  desc_fr TEXT NOT NULL DEFAULT 'Photos, vidéos et montage vidéo de votre session.',
  desc_en TEXT NOT NULL DEFAULT 'Photos, videos and video editing of your session.',
  desc_es TEXT NOT NULL DEFAULT 'Fotos, videos y montaje de video de tu sesión.',
  desc_ar TEXT NOT NULL DEFAULT 'صور وفيديوهات ومونتاج فيديو لجلستك.',
  cta_fr TEXT NOT NULL DEFAULT 'Réserver le Media pack',
  cta_en TEXT NOT NULL DEFAULT 'Book the Media pack',
  cta_es TEXT NOT NULL DEFAULT 'Reservar el Media pack',
  cta_ar TEXT NOT NULL DEFAULT 'احجز Media pack',
  available_on_fr TEXT NOT NULL DEFAULT 'Disponible avec tous les cours',
  available_on_en TEXT NOT NULL DEFAULT 'Available with every course',
  available_on_es TEXT NOT NULL DEFAULT 'Disponible con todos los cursos',
  available_on_ar TEXT NOT NULL DEFAULT 'متاح مع جميع الدروس',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.media_packs (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.media_pack_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id TEXT NOT NULL REFERENCES public.media_packs(id) ON DELETE CASCADE,
  text_fr TEXT NOT NULL DEFAULT '',
  text_en TEXT NOT NULL DEFAULT '',
  text_es TEXT NOT NULL DEFAULT '',
  text_ar TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ── Why choose us ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.why_choose_items (
  id TEXT PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT 'Star',
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_es TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  desc_fr TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  desc_es TEXT NOT NULL DEFAULT '',
  desc_ar TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Pricing extras ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pricing_extras (
  key TEXT PRIMARY KEY,
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_es TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  desc_fr TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  desc_es TEXT NOT NULL DEFAULT '',
  desc_ar TEXT NOT NULL DEFAULT '',
  badge TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Course inclusions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_inclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_fr TEXT NOT NULL DEFAULT '',
  text_en TEXT NOT NULL DEFAULT '',
  text_es TEXT NOT NULL DEFAULT '',
  text_ar TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ── Activities ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  badge_tone TEXT NOT NULL DEFAULT 'brand',
  layout_class TEXT DEFAULT '',
  min_height TEXT DEFAULT '',
  is_large BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  badge_fr TEXT NOT NULL DEFAULT '',
  badge_en TEXT NOT NULL DEFAULT '',
  badge_es TEXT NOT NULL DEFAULT '',
  badge_ar TEXT NOT NULL DEFAULT '',
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_es TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  desc_fr TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  desc_es TEXT NOT NULL DEFAULT '',
  desc_ar TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id TEXT NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  poster_url TEXT,
  alt_fr TEXT DEFAULT '',
  alt_en TEXT DEFAULT '',
  alt_es TEXT DEFAULT '',
  alt_ar TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ── Reviews ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  date_label TEXT DEFAULT '',
  text_fr TEXT NOT NULL DEFAULT '',
  text_en TEXT NOT NULL DEFAULT '',
  text_es TEXT NOT NULL DEFAULT '',
  text_ar TEXT NOT NULL DEFAULT '',
  avatar_letter TEXT DEFAULT '',
  color TEXT DEFAULT '#0046A4',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Contact submissions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  locale TEXT DEFAULT 'fr',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS ──────────────────────────────────────────────────────────────────
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'site_settings', 'site_images', 'site_pricing', 'site_texts',
    'media_packs', 'media_pack_features', 'why_choose_items',
    'pricing_extras', 'course_inclusions', 'activities', 'activity_media',
    'reviews', 'contact_submissions'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- Public read (except contact_submissions + admin_profiles)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'site_settings', 'site_images', 'site_pricing', 'site_texts',
    'media_packs', 'media_pack_features', 'why_choose_items',
    'pricing_extras', 'course_inclusions', 'activities', 'activity_media',
    'reviews'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public read %s" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Public read %s" ON public.%I FOR SELECT TO anon, authenticated USING (true)',
      t, t
    );
    EXECUTE format('DROP POLICY IF EXISTS "Admin write %s" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Admin write %s" ON public.%I FOR ALL TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin())',
      t, t
    );
  END LOOP;
END $$;

-- Contact: anyone insert, only admin read/update
DROP POLICY IF EXISTS "Anyone submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone submit contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage contact" ON public.contact_submissions;
CREATE POLICY "Admin manage contact" ON public.contact_submissions
  FOR ALL TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

-- Drop legacy world-writable policies from 001 if present
DROP POLICY IF EXISTS "Allow public write access to images" ON public.site_images;
DROP POLICY IF EXISTS "Allow public update access to images" ON public.site_images;
DROP POLICY IF EXISTS "Allow public delete access to images" ON public.site_images;
DROP POLICY IF EXISTS "Allow public write access to pricing" ON public.site_pricing;
DROP POLICY IF EXISTS "Allow public update access to pricing" ON public.site_pricing;
DROP POLICY IF EXISTS "Allow public delete access to pricing" ON public.site_pricing;

-- ── Migrate old site_images.id → key if needed ───────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_images' AND column_name = 'id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_images' AND column_name = 'key'
  ) THEN
    ALTER TABLE public.site_images RENAME COLUMN id TO key;
  END IF;
END $$;

-- ── Setup note ───────────────────────────────────────────────────────────
-- 1) Create a user in Authentication → Users
-- 2) Promote to admin:
--    INSERT INTO public.admin_profiles (user_id, role, email)
--    VALUES ('YOUR-USER-UUID', 'admin', 'you@email.com');
-- 3) Open /admin/login and sign in
-- 4) Use “Seed defaults” in the admin dashboard

-- ========== AUTH ROLES ==========

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

-- ========== PROMOTE EXISTING ADMIN ==========

INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '194d30a3-7c77-48c9-bf09-10f98c195919',
  'redwanhost73@gmail.com',
  'Admin',
  'admin'
)
ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name);

INSERT INTO public.admin_profiles (user_id, email, role)
VALUES (
  '194d30a3-7c77-48c9-bf09-10f98c195919',
  'redwanhost73@gmail.com',
  'admin'
)
ON CONFLICT (user_id) DO UPDATE
  SET role = 'admin', email = EXCLUDED.email;

-- Admin notification centre
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_notifications_created_idx
  ON public.admin_notifications (created_at DESC);

CREATE INDEX IF NOT EXISTS admin_notifications_unread_idx
  ON public.admin_notifications (created_at DESC)
  WHERE read_at IS NULL;

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read notifications" ON public.admin_notifications;
CREATE POLICY "Admins read notifications" ON public.admin_notifications
  FOR SELECT TO authenticated
  USING (public.is_site_admin());

DROP POLICY IF EXISTS "Admins update notifications" ON public.admin_notifications;
CREATE POLICY "Admins update notifications" ON public.admin_notifications
  FOR UPDATE TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

DROP POLICY IF EXISTS "Admins insert notifications" ON public.admin_notifications;
CREATE POLICY "Admins insert notifications" ON public.admin_notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.is_site_admin());

DROP POLICY IF EXISTS "Admins delete notifications" ON public.admin_notifications;
CREATE POLICY "Admins delete notifications" ON public.admin_notifications
  FOR DELETE TO authenticated
  USING (public.is_site_admin());

-- Refresh PostgREST so the API sees new tables immediately
NOTIFY pgrst, 'reload schema';
