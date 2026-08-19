import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { buildSeedPayload } from '@/lib/cms/seed-data'
import { createServiceClient } from '@/lib/supabase/admin'
import { recordAdminNotification } from '@/lib/admin/notify'

export async function POST() {
  const admin = await requireAdmin()
  if (admin.error || !admin.supabase || !admin.user) return admin.error!

  const supabase = admin.supabase
  const seed = buildSeedPayload()

  const results: Record<string, string> = {}

  const upsert = async (table: string, rows: unknown[], onConflict?: string) => {
    if (!rows.length) {
      results[table] = 'skipped'
      return
    }
    const q = onConflict
      ? supabase.from(table).upsert(rows, { onConflict })
      : supabase.from(table).upsert(rows)
    const { error: err } = await q
    results[table] = err ? err.message : `ok (${rows.length})`
  }

  await upsert('site_images', seed.images, 'key')
  await upsert('site_pricing', seed.pricing, 'id')
  await upsert('media_packs', [seed.mediaPack], 'id')
  await upsert('site_texts', seed.texts, 'key')
  await upsert('why_choose_items', seed.whyChoose, 'id')
  await upsert('pricing_extras', seed.extras, 'key')
  await upsert('activities', seed.activities, 'id')
  await upsert('stay_packages', seed.stayPackages, 'id')

  await supabase.from('media_pack_features').delete().eq('pack_id', 'default')
  {
    const { error: err } = await supabase.from('media_pack_features').insert(seed.mediaPackFeatures)
    results.media_pack_features = err ? err.message : `ok (${seed.mediaPackFeatures.length})`
  }

  await supabase.from('course_inclusions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  {
    const { error: err } = await supabase.from('course_inclusions').insert(seed.inclusions)
    results.course_inclusions = err ? err.message : `ok (${seed.inclusions.length})`
  }

  await supabase.from('activity_media').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  {
    const { error: err } = await supabase.from('activity_media').insert(seed.activityMedia)
    results.activity_media = err ? err.message : `ok (${seed.activityMedia.length})`
  }

  const service = createServiceClient()
  if (service) {
    await recordAdminNotification(service, {
      type: 'content.seeded',
      title: 'CMS seeded',
      body: 'Default images, pricing, activities and packs synced to Supabase',
      actorId: admin.user.id,
      actorEmail: admin.user.email,
      meta: { href: '/admin/content' },
    })
  }

  return NextResponse.json({ ok: true, results })
}
