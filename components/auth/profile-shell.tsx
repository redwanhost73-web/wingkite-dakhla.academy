'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, CalendarDays, LogOut, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  isPublicAccountRole,
  roleLabel,
  type Profile,
} from '@/lib/auth/roles'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/profile', label: 'Profile', icon: UserRound },
  { href: '/profile/bookings', label: 'Bookings', icon: CalendarDays },
]

export function ProfileShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      router.replace('/auth/login')
      return
    }

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`)
        return
      }

      const { data: row } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      const p = row as Profile | null
      if (!p || !isPublicAccountRole(p.role)) {
        // Business/admin belong in their own apps
        if (p?.role === 'admin') router.replace('/admin')
        else if (p?.role === 'business') router.replace('/business')
        else router.replace('/auth/login?error=forbidden')
        return
      }

      setProfile(p)
      setReady(true)
    })
  }, [pathname, router])

  const logout = async () => {
    const supabase = createClient()
    await supabase?.auth.signOut()
    router.replace('/fr')
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F6F1E8] text-[#072A5A]">
        Loading profile…
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#F6F1E8] text-[#072A5A]">
      <header className="border-b border-[#072A5A]/8 bg-[#0B1F3B] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/fr" className="flex items-center gap-3">
            <Image
              src="/Logo/Logo.png"
              alt="Wing Kite Dakhla"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/45">
                My profile
              </p>
              <p className="truncate text-sm font-semibold">
                {profile?.full_name || profile?.email || 'Account'}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-bold sm:inline">
              {profile ? roleLabel(profile.role) : ''}
            </span>
            <Link
              href="/fr"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Website
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/15"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-4 pb-3 sm:px-6">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  active ? 'bg-white text-[#072A5A]' : 'text-white/70 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
