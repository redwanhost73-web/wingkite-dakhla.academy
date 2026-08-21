import type { SupabaseClient } from '@supabase/supabase-js'

export type AdminNotificationType =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.password'
  | 'user.role'
  | 'content.published'
  | 'content.seeded'
  | 'gallery.added'
  | 'gallery.updated'
  | 'gallery.deleted'
  | 'system'

export type AdminNotification = {
  id: string
  type: AdminNotificationType | string
  title: string
  body: string
  actor_id: string | null
  actor_email: string | null
  meta: Record<string, unknown>
  read_at: string | null
  created_at: string
}

export function hrefForNotification(n: Pick<AdminNotification, 'type' | 'meta'>): string | null {
  const metaHref = n.meta?.href
  if (typeof metaHref === 'string' && metaHref.startsWith('/')) return metaHref

  if (typeof n.type === 'string' && n.type.startsWith('user.')) return '/admin/users'
  if (n.type === 'content.published' || n.type === 'content.seeded') return '/admin/content'
  if (typeof n.type === 'string' && n.type.startsWith('gallery.')) return '/admin/gallery'
  return null
}

export async function recordAdminNotification(
  service: SupabaseClient,
  input: {
    type: AdminNotificationType
    title: string
    body?: string
    actorId?: string | null
    actorEmail?: string | null
    meta?: Record<string, unknown>
  },
) {
  const meta = { ...input.meta }
  if (!meta.href) {
    const href = hrefForNotification({ type: input.type, meta })
    if (href) meta.href = href
  }

  const { error } = await service.from('admin_notifications').insert({
    type: input.type,
    title: input.title,
    body: input.body || '',
    actor_id: input.actorId || null,
    actor_email: input.actorEmail || null,
    meta,
  })
  // Table may not exist until 004 is applied — fail soft
  if (error) {
    console.warn('[admin_notifications]', error.message)
    return false
  }
  return true
}

export function isNotificationsTableMissing(error: { code?: string; message?: string } | null) {
  if (!error) return false
  const msg = (error.message || '').toLowerCase()
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    msg.includes('schema cache') ||
    msg.includes('does not exist') ||
    msg.includes('admin_notifications')
  )
}
