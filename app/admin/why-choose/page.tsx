'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buildSeedPayload } from '@/lib/cms/seed-data'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'

type Item = {
  id: string
  icon: string
  title_fr: string
  title_en: string
  title_es: string
  title_ar: string
  desc_fr: string
  desc_en: string
  desc_es: string
  desc_ar: string
  sort_order: number
  published: boolean
}

const LANGS = ['fr', 'en', 'es', 'ar'] as const

export default function AdminWhyChoosePage() {
  const [items, setItems] = useState<Item[]>([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('why_choose_items').select('*').order('sort_order')
      if (data?.length) setItems(data as Item[])
      else setItems(buildSeedPayload().whyChoose as Item[])
    }
    run()
  }, [])

  const saveAll = async () => {
    const supabase = createClient()
    if (!supabase) return
    setStatus('Saving…')
    const { error } = await supabase.from('why_choose_items').upsert(items, { onConflict: 'id' })
    setStatus(error ? error.message : 'Saved')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Why choose us"
        description="Home page reason cards (icon + multilang)."
        status={status}
        actions={
          <button
            type="button"
            onClick={saveAll}
            className="rounded-full bg-[#0B1F3B] px-5 py-2.5 text-sm font-bold text-white"
          >
            Save all
          </button>
        }
      />
      <ContentSubnav />

      <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#0B1F3B] px-2.5 py-1 text-[0.65rem] font-bold text-white">
              {item.id}
            </span>
            <label className="text-xs font-bold">
              Icon{' '}
              <input
                value={item.icon}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((it, i) => (i === idx ? { ...it, icon: e.target.value } : it)),
                  )
                }
                className="ml-1 rounded-lg border border-[#072A5A]/12 px-2 py-1 font-normal"
              />
            </label>
            <label className="flex items-center gap-1 text-xs font-bold">
              <input
                type="checkbox"
                checked={item.published}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((it, i) => (i === idx ? { ...it, published: e.target.checked } : it)),
                  )
                }
              />
              Published
            </label>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {LANGS.map((lang) => (
              <div key={lang} className="space-y-2">
                <input
                  placeholder={`Title ${lang.toUpperCase()}`}
                  value={item[`title_${lang}` as keyof Item] as string}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, [`title_${lang}`]: e.target.value } : it,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-sm"
                />
                <textarea
                  placeholder={`Desc ${lang.toUpperCase()}`}
                  value={item[`desc_${lang}` as keyof Item] as string}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, [`desc_${lang}`]: e.target.value } : it,
                      ),
                    )
                  }
                  rows={2}
                  className="w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
