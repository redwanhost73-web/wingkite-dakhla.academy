'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Pencil,
  Layers,
  Users,
  Settings,
  ChevronRight,
  Database,
} from 'lucide-react'
import { refreshNotificationsEvent } from '@/components/admin/notification-center'

const QUICK = [
  {
    href: '/en',
    title: 'Edit on the website',
    desc: 'Click any text or image, then Publish',
    icon: Pencil,
    external: true,
    accent: true,
  },
  {
    href: '/admin/content',
    title: 'Content',
    desc: 'Images, galleries, pricing, texts',
    icon: Layers,
  },
  {
    href: '/admin/users',
    title: 'Users',
    desc: 'Roles and accounts',
    icon: Users,
  },
  {
    href: '/admin/settings',
    title: 'Settings',
    desc: 'Contact info, seed, setup',
    icon: Settings,
  },
]

export default function AdminDashboardPage() {
  const [seedMsg, setSeedMsg] = useState<string | null>(null)
  const [seedErr, setSeedErr] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [showSeed, setShowSeed] = useState(false)

  const seed = async () => {
    setSeeding(true)
    setSeedMsg(null)
    setSeedErr(null)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Seed failed')
      setSeedMsg(JSON.stringify(json.results, null, 2))
      refreshNotificationsEvent()
    } catch (e) {
      setSeedErr(e instanceof Error ? e.message : 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#072A5A]">Dashboard</h1>
        <p className="mt-2 text-sm text-[#5A6B85]">
          Edit copy on the live site, or manage structured content here.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {QUICK.map((item) => {
          const card = (
            <div
              className={
                item.accent
                  ? 'group flex h-full flex-col rounded-2xl bg-[#0046A4] p-5 text-white shadow-sm transition hover:bg-[#0057D1]'
                  : 'group flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6 transition hover:ring-[#0046A4]/30'
              }
            >
              <item.icon
                className={item.accent ? 'h-5 w-5 text-white/90' : 'h-5 w-5 text-[#0046A4]'}
              />
              <p
                className={
                  item.accent
                    ? 'mt-4 flex items-center gap-1 font-heading text-lg font-bold'
                    : 'mt-4 flex items-center gap-1 font-heading text-lg font-bold text-[#072A5A]'
                }
              >
                {item.title}
                <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </p>
              <p className={item.accent ? 'mt-1 text-sm text-white/75' : 'mt-1 text-sm text-[#7A8AA3]'}>
                {item.desc}
              </p>
            </div>
          )

          if (item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="block">
                {card}
              </a>
            )
          }

          return (
            <Link key={item.href} href={item.href} className="block">
              {card}
            </Link>
          )
        })}
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => setShowSeed((v) => !v)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A8AA3] hover:text-[#072A5A]"
        >
          <Database className="h-3.5 w-3.5" />
          {showSeed ? 'Hide setup' : 'First-time setup (seed)'}
        </button>

        {showSeed && (
          <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6">
            <p className="text-sm text-[#5A6B85]">
              Run <code className="rounded bg-[#EEF2F7] px-1.5 py-0.5 text-xs">scripts/006_stay_packages.sql</code>{' '}
              once, then seed defaults into Supabase.
            </p>
            <button
              type="button"
              onClick={seed}
              disabled={seeding}
              className="mt-4 rounded-full bg-[#0B1F3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0046A4] disabled:opacity-60"
            >
              {seeding ? 'Seeding…' : 'Seed defaults'}
            </button>
            {seedMsg && (
              <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-[#EEF2F7] p-3 text-xs text-[#072A5A]">
                <CheckCircle2 className="mb-1 inline h-3.5 w-3.5 text-green-600" /> {seedMsg}
              </pre>
            )}
            {seedErr && (
              <p className="mt-3 flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {seedErr}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
