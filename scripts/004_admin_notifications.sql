-- Admin notification centre (run in Supabase SQL Editor after 003_auth_roles.sql)

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

COMMENT ON TABLE public.admin_notifications IS
  'In-app admin notification centre for user CRUD and CMS events.';

NOTIFY pgrst, 'reload schema';
