import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { isNotificationsTableMissing } from '@/lib/admin/notify'

export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit') || 40), 100)

  const { data, error } = await service
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    if (isNotificationsTableMissing(error)) {
      return NextResponse.json({
        notifications: [],
        unread: 0,
        setupRequired: true,
        hint: 'Run scripts/004_admin_notifications.sql in Supabase SQL Editor.',
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const notifications = data || []
  const unread = notifications.filter((n) => !n.read_at).length
  return NextResponse.json({ notifications, unread, setupRequired: false })
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const now = new Date().toISOString()

  if (body.mark_all === true) {
    const { error } = await service
      .from('admin_notifications')
      .update({ read_at: now })
      .is('read_at', null)
    if (error) {
      if (isNotificationsTableMissing(error)) {
        return NextResponse.json({ error: 'Notifications table missing', setupRequired: true }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((id) => typeof id === 'string') : []
  if (!ids.length) {
    return NextResponse.json({ error: 'Provide ids or mark_all' }, { status: 400 })
  }

  const { error } = await service
    .from('admin_notifications')
    .update({ read_at: now })
    .in('id', ids)
  if (error) {
    if (isNotificationsTableMissing(error)) {
      return NextResponse.json({ error: 'Notifications table missing', setupRequired: true }, { status: 503 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const clearAll = searchParams.get('all') === '1'
  const id = searchParams.get('id')

  if (clearAll) {
    const { error } = await service
      .from('admin_notifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) {
      if (isNotificationsTableMissing(error)) {
        return NextResponse.json({ error: 'Notifications table missing', setupRequired: true }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  if (!id) return NextResponse.json({ error: 'Missing id or all=1' }, { status: 400 })

  const { error } = await service.from('admin_notifications').delete().eq('id', id)
  if (error) {
    if (isNotificationsTableMissing(error)) {
      return NextResponse.json({ error: 'Notifications table missing', setupRequired: true }, { status: 503 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
