'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { AdminPageHeader, CONTENT_ITEMS } from '@/components/admin/admin-ui'

export default function AdminContentPage() {
  const media = CONTENT_ITEMS.filter((i) => i.group === 'media')
  const sections = CONTENT_ITEMS.filter((i) => i.group === 'sections')

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Content"
        description="Images and structured sections. For day-to-day copy edits, use Edit site instead."
        backHref="/admin"
        backLabel="Dashboard"
      />

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A8AA3]">Media</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {media.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6 transition hover:ring-[#0046A4]/35"
            >
              <item.icon className="h-5 w-5 text-[#0046A4]" />
              <p className="mt-4 flex items-center gap-1 font-heading text-base font-bold text-[#072A5A]">
                {item.title}
                <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </p>
              <p className="mt-1 text-sm text-[#7A8AA3]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A8AA3]">Sections</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6 transition hover:ring-[#0046A4]/35"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0046A4]/8 text-[#0046A4]">
                <item.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-bold text-[#072A5A]">{item.title}</p>
                <p className="mt-0.5 text-sm text-[#7A8AA3]">{item.desc}</p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#7A8AA3] opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
