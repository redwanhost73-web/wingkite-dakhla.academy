-- Gallery photos for the public /gallery page.
-- Run in Supabase SQL Editor after 006_stay_packages.sql.

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_es TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  caption_fr TEXT NOT NULL DEFAULT '',
  caption_en TEXT NOT NULL DEFAULT '',
  caption_es TEXT NOT NULL DEFAULT '',
  caption_ar TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'school'
    CHECK (category IN ('school', 'wingfoil', 'kitesurf', 'lagoon', 'camp', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gallery_items_sort_idx
  ON public.gallery_items (published, sort_order);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read gallery_items" ON public.gallery_items;
CREATE POLICY "Public read gallery_items"
  ON public.gallery_items FOR SELECT USING (published = true OR published IS NULL);

DROP POLICY IF EXISTS "Admin write gallery_items" ON public.gallery_items;
CREATE POLICY "Admin write gallery_items"
  ON public.gallery_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (SELECT 1 FROM public.admin_profiles a WHERE a.user_id = auth.uid())
  );

DROP TRIGGER IF EXISTS gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
