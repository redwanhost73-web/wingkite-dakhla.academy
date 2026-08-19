'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MEDIA_PACK } from '@/lib/media-pack'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'

type Pack = {
  id: string
  price_eur: number
  title_fr: string
  title_en: string
  title_es: string
  title_ar: string
  short_fr: string
  short_en: string
  short_es: string
  short_ar: string
  desc_fr: string
  desc_en: string
  desc_es: string
  desc_ar: string
  cta_fr: string
  cta_en: string
  cta_es: string
  cta_ar: string
  available_on_fr: string
  available_on_en: string
  available_on_es: string
  available_on_ar: string
}

type Feat = {
  id?: string
  text_fr: string
  text_en: string
  text_es: string
  text_ar: string
  sort_order: number
}

const LANGS = ['fr', 'en', 'es', 'ar'] as const

export default function AdminMediaPackPage() {
  const [pack, setPack] = useState<Pack | null>(null)
  const [features, setFeatures] = useState<Feat[]>([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('media_packs').select('*').eq('id', 'default').maybeSingle()
      if (data) setPack(data as Pack)
      else {
        setPack({
          id: 'default',
          price_eur: MEDIA_PACK.priceEur,
          title_fr: MEDIA_PACK.title.fr,
          title_en: MEDIA_PACK.title.en,
          title_es: MEDIA_PACK.title.es,
          title_ar: MEDIA_PACK.title.ar,
          short_fr: MEDIA_PACK.short.fr,
          short_en: MEDIA_PACK.short.en,
          short_es: MEDIA_PACK.short.es,
          short_ar: MEDIA_PACK.short.ar,
          desc_fr: MEDIA_PACK.desc.fr,
          desc_en: MEDIA_PACK.desc.en,
          desc_es: MEDIA_PACK.desc.es,
          desc_ar: MEDIA_PACK.desc.ar,
          cta_fr: MEDIA_PACK.cta.fr,
          cta_en: MEDIA_PACK.cta.en,
          cta_es: MEDIA_PACK.cta.es,
          cta_ar: MEDIA_PACK.cta.ar,
          available_on_fr: MEDIA_PACK.availableOn.fr,
          available_on_en: MEDIA_PACK.availableOn.en,
          available_on_es: MEDIA_PACK.availableOn.es,
          available_on_ar: MEDIA_PACK.availableOn.ar,
        })
      }
      const { data: feats } = await supabase
        .from('media_pack_features')
        .select('*')
        .eq('pack_id', 'default')
        .order('sort_order')
      if (feats?.length) setFeatures(feats as Feat[])
      else {
        setFeatures(
          MEDIA_PACK.features.map((f, i) => ({
            text_fr: f.fr,
            text_en: f.en,
            text_es: f.es,
            text_ar: f.ar,
            sort_order: i + 1,
          })),
        )
      }
    }
    run()
  }, [])

  const save = async () => {
    if (!pack) return
    const supabase = createClient()
    if (!supabase) return
    setStatus('Saving…')
    const { error } = await supabase.from('media_packs').upsert(pack, { onConflict: 'id' })
    if (error) {
      setStatus(error.message)
      return
    }
    await supabase.from('media_pack_features').delete().eq('pack_id', 'default')
    const { error: fErr } = await supabase.from('media_pack_features').insert(
      features.map((f, i) => ({
        pack_id: 'default',
        text_fr: f.text_fr,
        text_en: f.text_en,
        text_es: f.text_es,
        text_ar: f.text_ar,
        sort_order: i + 1,
      })),
    )
    setStatus(fErr ? fErr.message : 'Media pack saved')
  }

  if (!pack) return <p className="p-8">Loading…</p>

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="Media pack"
        description="Photos, videos, montage — multilang + price."
        status={status}
        actions={
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-[#0B1F3B] px-5 py-2.5 text-sm font-bold text-white"
          >
            Save
          </button>
        }
      />
      <ContentSubnav />

      <label className="block rounded-2xl bg-white p-5 text-xs font-bold shadow-sm ring-1 ring-[#072A5A]/6">
        Price EUR
        <input
          type="number"
          value={pack.price_eur}
          onChange={(e) => setPack({ ...pack, price_eur: Number(e.target.value) })}
          className="mt-2 w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-sm font-normal"
        />
      </label>

      {(['title', 'short', 'desc', 'cta', 'available_on'] as const).map((field) => (
        <div key={field} className="rounded-[20px] border border-[#072A5A]/8 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A8AA3]">{field}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {LANGS.map((lang) => {
              const key = `${field}_${lang}` as keyof Pack
              return (
                <label key={lang} className="block text-[0.65rem] font-bold text-[#072A5A]">
                  {lang.toUpperCase()}
                  <textarea
                    value={String(pack[key] ?? '')}
                    onChange={(e) => setPack({ ...pack, [key]: e.target.value })}
                    rows={field === 'desc' || field === 'available_on' ? 3 : 2}
                    className="mt-1 w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-sm font-normal"
                  />
                </label>
              )
            })}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">Features</h2>
          <button
            type="button"
            onClick={() =>
              setFeatures((f) => [
                ...f,
                { text_fr: '', text_en: '', text_es: '', text_ar: '', sort_order: f.length + 1 },
              ])
            }
            className="text-xs font-bold text-[#0046A4]"
          >
            + Add feature
          </button>
        </div>
        {features.map((feat, i) => (
          <div key={i} className="rounded-[20px] border border-[#072A5A]/8 bg-white p-4">
            <div className="mb-2 flex justify-between">
              <span className="text-xs font-bold text-[#7A8AA3]">#{i + 1}</span>
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() => setFeatures((f) => f.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {LANGS.map((lang) => {
                const key = `text_${lang}` as keyof Feat
                return (
                  <input
                    key={lang}
                    placeholder={lang.toUpperCase()}
                    value={String(feat[key] ?? '')}
                    onChange={(e) =>
                      setFeatures((prev) =>
                        prev.map((f, j) => (j === i ? { ...f, [key]: e.target.value } : f)),
                      )
                    }
                    className="rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-sm"
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
