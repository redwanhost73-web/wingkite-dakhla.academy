'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/lib/auth/roles'
import { roleLabel } from '@/lib/auth/roles'
import { cn } from '@/lib/utils'

type NavItem = { href: string; label: string }

export function DashboardShell({
  children,
  allowedRoles,
  title,
  nav,
  homeHref = '/fr',
}: {
  children: ReactNode
  allowedRoles: UserRole[]
  title: string
  nav: NavItem[]
  homeHref?: string
}) {
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

      const p = (row as Profile) || null
      if (!p || !allowedRoles.includes(p.role)) {
        // legacy admin_profiles bridge
        if (allowedRoles.includes('admin')) {
          const { data: legacy } = await supabase
            .from('admin_profiles')
            .select('user_id')
            .eq('user_id', data.user.id)
            .maybeSingle()
          if (legacy) {
            setProfile({
              id: data.user.id,
              email: data.user.email ?? null,
              full_name: '',
              phone: '',
              company_name: '',
              role: 'admin',
              avatar_url: '',
            })
            setReady(true)
            return
          }
        }
        router.replace('/auth/login?error=forbidden')
        return
      }
      setProfile(p)
      setReady(true)
    })
  }, [allowedRoles, pathname, router])

  const logout = async () => {
    const supabase = createClient()
    await supabase?.auth.signOut()
    router.replace('/auth/login')
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F1E8] text-[#072A5A]">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F6F1E8] text-[#072A5A]">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-[#072A5A]/10 bg-[#0B1F3B] text-white">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/45">
            {title}
          </p>
          <p className="mt-1 truncate text-xs text-white/70">
            {profile?.full_name || profile?.email}
          </p>
          <p className="mt-1 text-[0.65rem] font-semibold text-[#C9A66B]">
            {profile ? roleLabel(profile.role) : ''}
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href={homeHref}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/8 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Website
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/8 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 sm:p-8">{children}</main>
    </div>
  )
}
