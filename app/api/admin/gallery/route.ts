import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { recordAdminNotification } from '@/lib/admin/notify'
import { mapGalleryRow, type GalleryCategory } from '@/lib/gallery'

const CATEGORIES = new Set([
  'school',
  'wingfoil',
  'kitesurf',
  'lagoon',
  'camp',
  'other',
])

function normalizeItem(raw: Record<string, unknown>) {
  const url = String(raw.url || '').trim()
  if (!url) return null
  const category = String(raw.category || 'school') as GalleryCategory
  return {
    id: raw.id ? String(raw.id) : undefined,
    url,
    title_en: String(raw.title_en || raw.titleEn || ''),
    title_fr: String(raw.title_fr || raw.titleFr || raw.title_en || raw.titleEn || ''),
    title_es: String(raw.title_es || raw.titleEs || raw.title_en || raw.titleEn || ''),
    title_ar: String(raw.title_ar || raw.titleAr || raw.title_en || raw.titleEn || ''),
    caption_en: String(raw.caption_en || raw.captionEn || ''),
    caption_fr: String(raw.caption_fr || raw.captionFr || raw.caption_en || ''),
    caption_es: String(raw.caption_es || raw.captionEs || raw.caption_en || ''),
    caption_ar: String(raw.caption_ar || raw.captionAr || raw.caption_en || ''),
    category: CATEGORIES.has(category) ? category : 'school',
    sort_order: Number(raw.sort_order ?? raw.sortOrder ?? 0),
    published: raw.published !== false,
  }
}

/** List all gallery rows (including unpublished) for admin. */
export async function GET() {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  const { data, error } = await service
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    items: (data || []).map((row) => mapGalleryRow(row as Record<string, unknown>)),
  })
}

/**
 * Upsert one item, or replace the whole gallery when `items` array is sent.
 * Body shapes:
 * - { item: {...} } upsert single
 * - { items: [...] } full sync (delete missing, upsert rest)
 */
export async function POST(request: Request) {
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
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Full sync
  if (Array.isArray(body.items)) {
    const normalized = body.items
      .map((row) => normalizeItem((row || {}) as Record<string, unknown>))
      .filter(Boolean) as NonNullable<ReturnType<typeof normalizeItem>>[]

    const { data: existing, error: listErr } = await service.from('gallery_items').select('id')
    if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 })

    const keep = new Set(normalized.map((r) => r.id).filter(Boolean) as string[])
    const toDelete = (existing || [])
      .map((r: { id: string }) => r.id)
      .filter((id: string) => !keep.has(id))

    if (toDelete.length) {
      const { error: delErr } = await service.from('gallery_items').delete().in('id', toDelete)
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
    }

    const saved = []
    for (let i = 0; i < normalized.length; i++) {
      const row = { ...normalized[i], sort_order: i + 1 }
      const { id, ...payload } = row
      if (id) {
        const { data, error } = await service
          .from('gallery_items')
          .update(payload)
          .eq('id', id)
          .select('*')
          .single()
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        saved.push(mapGalleryRow(data as Record<string, unknown>))
      } else {
        const { data, error } = await service
          .from('gallery_items')
          .insert(payload)
          .select('*')
          .single()
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        saved.push(mapGalleryRow(data as Record<string, unknown>))
      }
    }

    await recordAdminNotification(service, {
      type: 'gallery.updated',
      title: 'Gallery updated',
      body: `${saved.length} photo(s) saved${toDelete.length ? `, ${toDelete.length} removed` : ''}.`,
      actorId: admin.user.id,
      actorEmail: admin.user.email,
      meta: { href: '/admin/gallery', count: saved.length, deleted: toDelete.length },
    })

    return NextResponse.json({ items: saved })
  }

  // Single upsert
  const item = normalizeItem((body.item || body) as Record<string, unknown>)
  if (!item) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  if (!item.sort_order) {
    const { count } = await service
      .from('gallery_items')
      .select('*', { count: 'exact', head: true })
    item.sort_order = (count || 0) + 1
  }

  const { id, ...payload } = item
  let saved
  if (id) {
    const { data, error } = await service
      .from('gallery_items')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    saved = mapGalleryRow(data as Record<string, unknown>)
  } else {
    const { data, error } = await service
      .from('gallery_items')
      .insert(payload)
      .select('*')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    saved = mapGalleryRow(data as Record<string, unknown>)
  }

  await recordAdminNotification(service, {
    type: id ? 'gallery.updated' : 'gallery.added',
    title: id ? 'Gallery photo updated' : 'Gallery photo added',
    body: saved.title.en || saved.url,
    actorId: admin.user.id,
    actorEmail: admin.user.email,
    meta: { href: '/admin/gallery', id: saved.id },
  })

  return NextResponse.json({ item: saved })
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { data: existing } = await service
    .from('gallery_items')
    .select('id,url,title_en')
    .eq('id', id)
    .maybeSingle()

  const { error } = await service.from('gallery_items').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await recordAdminNotification(service, {
    type: 'gallery.deleted',
    title: 'Gallery photo deleted',
    body: existing?.title_en || existing?.url || id,
    actorId: admin.user.id,
    actorEmail: admin.user.email,
    meta: { href: '/admin/gallery', id },
  })

  return NextResponse.json({ ok: true })
}
