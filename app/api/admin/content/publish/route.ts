import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { siteImagePage } from '@/lib/edit-mode/image-slots'
import {
  parseActivityImageKey,
  parsePackCoverKey,
} from '@/lib/cms/content-lists'
import type { ContentDraft, PricingListItem } from '@/lib/edit-mode/types'
import { recordAdminNotification } from '@/lib/admin/notify'

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  let body: { changes?: ContentDraft[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const changes = Array.isArray(body.changes) ? body.changes : []
  if (!changes.length) {
    return NextResponse.json({ error: 'No changes' }, { status: 400 })
  }

  const results: Record<string, string> = {}

  for (const change of changes) {
    if (change.type === 'text') {
      const { error } = await service.from('site_texts').upsert(
        {
          key: change.key,
          value_fr: change.values.fr,
          value_en: change.values.en,
          value_es: change.values.es,
          value_ar: change.values.ar,
          section: change.key.split('.')[0] || 'site',
          label: change.label || change.key,
        },
        { onConflict: 'key' },
      )
      results[`text:${change.key}`] = error ? error.message : 'ok'
    } else if (change.type === 'image') {
      const row: Record<string, string> = {
        key: change.key,
        url: change.url,
        label: change.label || change.key,
        page: siteImagePage(change.key),
      }
      if (change.alts) {
        row.alt_fr = change.alts.fr || ''
        row.alt_en = change.alts.en || ''
        row.alt_es = change.alts.es || ''
        row.alt_ar = change.alts.ar || ''
      }
      const { error } = await service.from('site_images').upsert(row, { onConflict: 'key' })
      results[`image:${change.key}`] = error ? error.message : 'ok'

      // Dual-write: keep activities / pack tables in sync when editing on-site
      const packId = parsePackCoverKey(change.key)
      if (packId) {
        const { data: packRow, error: packErr } = await service
          .from('stay_packages')
          .update({ image_url: change.url, updated_at: new Date().toISOString() })
          .eq('id', packId)
          .select('id')
        if (packErr) {
          results[`packCover:${packId}`] = packErr.message
        } else if (!packRow?.length) {
          results[`packCover:${packId}`] =
            'stay_packages row not found (run seed defaults in /admin)'
        } else {
          results[`packCover:${packId}`] = 'ok'
        }
      }
      const activityImg = parseActivityImageKey(change.key)
      if (activityImg) {
        results[`activityMedia:${change.key}`] = await upsertActivityMediaAtIndex(
          service,
          activityImg.activityId,
          activityImg.index,
          change.url,
        )
      }
    } else if (change.type === 'list' && change.key === 'pricing') {
      results[`list:pricing`] = await publishPricingList(service, change.items)
    }
  }

  const failed = Object.entries(results).filter(([, v]) => v !== 'ok')
  if (failed.length) {
    return NextResponse.json(
      { error: 'Some changes failed', results },
      { status: 207 },
    )
  }

  await recordAdminNotification(service, {
    type: 'content.published',
    title: 'Content published',
    body: `${changes.length} change${changes.length === 1 ? '' : 's'} from Edit Mode`,
    actorId: admin.user.id,
    actorEmail: admin.user.email,
    meta: { count: changes.length, href: '/admin/content' },
  })

  return NextResponse.json({ ok: true, results, publishedBy: admin.user.email })
}

async function upsertActivityMediaAtIndex(
  service: NonNullable<ReturnType<typeof createServiceClient>>,
  activityId: string,
  index: number,
  url: string,
): Promise<string> {
  const sortOrder = index + 1
  const { data: existing } = await service
    .from('activity_media')
    .select('id')
    .eq('activity_id', activityId)
    .eq('sort_order', sortOrder)
    .maybeSingle()

  if (existing?.id) {
    const { error } = await service
      .from('activity_media')
      .update({ url, media_type: 'image' })
      .eq('id', existing.id)
    return error ? error.message : 'ok'
  }

  const { error } = await service.from('activity_media').insert({
    activity_id: activityId,
    media_type: 'image',
    url,
    sort_order: sortOrder,
  })
  return error ? error.message : 'ok'
}

async function publishPricingList(
  service: NonNullable<ReturnType<typeof createServiceClient>>,
  items: PricingListItem[],
): Promise<string> {
  const { data: existing, error: readError } = await service.from('site_pricing').select('id')
  if (readError) return readError.message

  const keep = new Set(items.map((i) => i.id))
  const toDelete = (existing || [])
    .map((r: { id: string }) => r.id)
    .filter((id: string) => !keep.has(id))

  if (toDelete.length) {
    const { error } = await service.from('site_pricing').delete().in('id', toDelete)
    if (error) return error.message
  }

  const rows = items.map((item, index) => ({
    id: item.id,
    hours: item.hours,
    semi_eur: item.semiEur,
    semi_mad: item.semiMad,
    priv_eur: item.privEur,
    priv_mad: item.privMad,
    is_extra: Boolean(item.extra),
    sort_order: index + 1,
  }))

  const { error } = await service.from('site_pricing').upsert(rows, { onConflict: 'id' })
  return error ? error.message : 'ok'
}
