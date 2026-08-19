-- Stay packages (offer packs) + ensure activity tables usable from admin/seed.
-- Run after 000_bootstrap / 002_cms_schema.

CREATE TABLE IF NOT EXISTS public.stay_packages (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('wingfoil', 'kitesurf')),
  image_url TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  badge_fr TEXT NOT NULL DEFAULT '',
  badge_en TEXT NOT NULL DEFAULT '',
  badge_es TEXT NOT NULL DEFAULT '',
  badge_ar TEXT NOT NULL DEFAULT '',
  desc_fr TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  desc_es TEXT NOT NULL DEFAULT '',
  desc_ar TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  perks JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.stay_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read stay_packages" ON public.stay_packages;
CREATE POLICY "Public read stay_packages"
  ON public.stay_packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write stay_packages" ON public.stay_packages;
CREATE POLICY "Admin write stay_packages"
  ON public.stay_packages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  );

-- Activity media is writable by admins (bootstrap may already have public read)
DROP POLICY IF EXISTS "Admin write activities" ON public.activities;
CREATE POLICY "Admin write activities"
  ON public.activities FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin write activity_media" ON public.activity_media;
CREATE POLICY "Admin write activity_media"
  ON public.activity_media FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Public read activities" ON public.activities;
CREATE POLICY "Public read activities"
  ON public.activities FOR SELECT USING (published = true OR published IS NULL);

DROP POLICY IF EXISTS "Public read activity_media" ON public.activity_media;
CREATE POLICY "Public read activity_media"
  ON public.activity_media FOR SELECT USING (true);
