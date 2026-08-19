'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_PRICING } from '@/lib/site-config'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'

type Row = {
  id: string
  hours: string
  semi_eur: number
  semi_mad: number
  priv_eur: number
  priv_mad: number
  is_extra: boolean
  sort_order: number
}

export default function AdminPricingPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('site_pricing').select('*').order('sort_order')
      if (data?.length) {
        setRows(data as Row[])
        return
      }
      setRows(
        DEFAULT_PRICING.map((r, i) => ({
          id: `row_${r.hours.replace('+', 'extra_')}`,
          hours: r.hours,
          semi_eur: r.semiEur,
          semi_mad: r.semiMad,
          priv_eur: r.privEur,
          priv_mad: r.privMad,
          is_extra: Boolean(r.extra),
          sort_order: i + 1,
        })),
      )
    }
    run()
  }, [])

  const saveAll = async () => {
    const supabase = createClient()
    if (!supabase) return
    setStatus('Saving…')
    const { error } = await supabase.from('site_pricing').upsert(rows, { onConflict: 'id' })
    setStatus(error ? error.message : 'Pricing saved')
  }

  const update = (id: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Pricing"
        description="EUR / MAD for private & semi-private lessons."
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

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-[#072A5A]/6">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[#0B1F3B] text-white">
            <tr>
              <th className="px-3 py-3">Hours</th>
              <th className="px-3 py-3">Semi €</th>
              <th className="px-3 py-3">Semi MAD</th>
              <th className="px-3 py-3">Priv €</th>
              <th className="px-3 py-3">Priv MAD</th>
              <th className="px-3 py-3">Extra</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#072A5A]/8">
                <td className="px-3 py-2">
                  <input
                    value={row.hours}
                    onChange={(e) => update(row.id, { hours: e.target.value })}
                    className="w-20 rounded-lg border border-[#072A5A]/12 px-2 py-1"
                  />
                </td>
                {(['semi_eur', 'semi_mad', 'priv_eur', 'priv_mad'] as const).map((field) => (
                  <td key={field} className="px-3 py-2">
                    <input
                      type="number"
                      value={row[field]}
                      onChange={(e) => update(row.id, { [field]: Number(e.target.value) })}
                      className="w-24 rounded-lg border border-[#072A5A]/12 px-2 py-1"
                    />
                  </td>
                ))}
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={row.is_extra}
                    onChange={(e) => update(row.id, { is_extra: e.target.checked })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
