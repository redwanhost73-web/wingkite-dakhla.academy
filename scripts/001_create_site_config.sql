-- Site Configuration Tables for Admin Control Panel
-- No authentication required - public access for site config

-- Site Images Table
CREATE TABLE IF NOT EXISTS public.site_images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  page TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Table  
CREATE TABLE IF NOT EXISTS public.site_pricing (
  id TEXT PRIMARY KEY,
  hours TEXT NOT NULL,
  semi_eur INTEGER NOT NULL,
  semi_mad INTEGER NOT NULL,
  priv_eur INTEGER NOT NULL,
  priv_mad INTEGER NOT NULL,
  is_extra BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but allow public read access (no auth required for reading)
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pricing ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read site config (public website needs this)
CREATE POLICY "Allow public read access to images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access to pricing" ON public.site_pricing FOR SELECT USING (true);

-- Allow anyone to insert/update/delete (admin panel - protected by password in app)
CREATE POLICY "Allow public write access to images" ON public.site_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to images" ON public.site_images FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to images" ON public.site_images FOR DELETE USING (true);

CREATE POLICY "Allow public write access to pricing" ON public.site_pricing FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to pricing" ON public.site_pricing FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to pricing" ON public.site_pricing FOR DELETE USING (true);

-- Insert default images
INSERT INTO public.site_images (id, url, label, page) VALUES
  ('homeHero', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5339-w81lYn7nf4BLQp7C0ZQcETIIxJiaG6.jpg', 'Hero Principal', 'home'),
  ('homeWing1', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07e6d850-397a-4a50-b73f-03889f4d6808.JPG-cQfrOgTyoNYORSDs65CrrKNVAHZgbf.jpeg', 'Wingfoil Card', 'home'),
  ('homeKite1', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0889-swlEKdPIQDbLaagOos7jJgudmvV1g7.jpg', 'Kitesurf Card', 'home'),
  ('homeAction', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca577150-7f3e-4303-8332-33ff3a8f5339.JPG-hEVCP8iIohmq5ONaJ8048CKcJEFEve.jpeg', 'Coaching Card', 'home'),
  ('homeSunset', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1936-eN0eozzW3oVm4Wafhmm5fM0ANlcdIt.jpg', 'Sunset Background', 'home'),
  ('aboutHero', '/images/hero-foil.jpg', 'Hero A propos', 'about'),
  ('aboutStory', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca577150-7f3e-4303-8332-33ff3a8f5339.JPG-hEVCP8iIohmq5ONaJ8048CKcJEFEve.jpeg', 'Photo Coach', 'about'),
  ('aboutTeam', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0915-z0gvWeNmW8vsHgyGZhnoGgGa65dLYV.jpg', 'Photo Equipe', 'about'),
  ('aboutLocation', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8044E789-98B4-47B7-BEBF-3C42CFFE279F-gP3fvRzzgbPm1DEkndcCFHd2y91Mcg.jpg', 'Photo Lagon', 'about')
ON CONFLICT (id) DO NOTHING;

-- Insert default pricing
INSERT INTO public.site_pricing (id, hours, semi_eur, semi_mad, priv_eur, priv_mad, is_extra, sort_order) VALUES
  ('row_2h', '2h', 70, 770, 100, 1100, false, 1),
  ('row_4h', '4h', 140, 1540, 190, 2090, false, 2),
  ('row_6h', '6h', 200, 2200, 280, 3080, false, 3),
  ('row_8h', '8h', 265, 2915, 370, 4070, false, 4),
  ('row_10h', '10h', 330, 3630, 455, 5005, false, 5),
  ('row_12h', '12h', 400, 4400, 540, 5540, false, 6),
  ('row_extra', '+2h', 60, 660, 90, 990, true, 7)
ON CONFLICT (id) DO NOTHING;
