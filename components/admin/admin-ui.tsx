'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ImageIcon,
  LayoutGrid,
  Package,
  BadgeEuro,
  Clapperboard,
  Star,
  Type,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const CONTENT_ITEMS: Array<{
  href: string
  title: string
  desc: string
  icon: LucideIcon
  group: 'media' | 'sections'
}> = [
  {
    href: '/admin/images',
    title: 'Page images',
    desc: 'Heroes and section backgrounds',
    icon: ImageIcon,
    group: 'media',
  },
  {
    href: '/admin/activities',
    title: 'Activities',
    desc: 'Home gallery photos',
    icon: LayoutGrid,
    group: 'media',
  },
  {
    href: '/admin/packs',
    title: 'Stay packs',
    desc: 'Package cover images',
    icon: Package,
    group: 'media',
  },
  {
    href: '/admin/pricing',
    title: 'Pricing',
    desc: 'Lesson rate table',
    icon: BadgeEuro,
    group: 'sections',
  },
  {
    href: '/admin/media-pack',
    title: 'Media pack',
    desc: 'Photos + video add-on',
    icon: Clapperboard,
    group: 'sections',
  },
  {
    href: '/admin/why-choose',
    title: 'Why choose us',
    desc: 'Home reasons list',
    icon: Star,
    group: 'sections',
  },
  {
    href: '/admin/texts',
    title: 'Texts',
    desc: 'All multilang strings',
    icon: Type,
    group: 'sections',
  },
]

export function AdminPageHeader({
  title,
  description,
  backHref = '/admin/content',
  backLabel = 'Content',
  status,
  actions,
}: {
  title: string
  description?: string
  backHref?: string | null
  backLabel?: string
  status?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0046A4] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#072A5A]">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-[#5A6B85]">{description}</p>}
          {status ? <p className="mt-2 text-xs font-semibold text-[#0046A4]">{status}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}

export function ContentSubnav() {
  const pathname = usePathname()
  return (
    <div className="mb-6 flex flex-wrap gap-1.5">
      {CONTENT_ITEMS.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
              active
                ? 'bg-[#0B1F3B] text-white'
                : 'bg-white text-[#3D4F6F] ring-1 ring-[#072A5A]/10 hover:bg-[#0B1F3B]/5',
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}
