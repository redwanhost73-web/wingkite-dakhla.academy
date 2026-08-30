'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  PanelLeftClose,
  PanelLeft,
  Layers,
  Pencil,
  ExternalLink,
  BedDouble,
} from 'lucide-react'
import { Toaster } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { NotificationCenter } from '@/components/admin/notification-center'
import { cn } from '@/lib/utils'

/** Content sub-routes highlight the Content nav item */
const CONTENT_PREFIXES = [
  '/admin/content',
  '/admin/media',
  '/admin/images',
  '/admin/activities',
  '/admin/gallery',
  '/admin/packs',
  '/admin/pricing',
  '/admin/media-pack',
  '/admin/why-choose',
  '/admin/texts',
]

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  match?: (pathname: string) => boolean
}

const PRIMARY: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    match: (p) => p === '/admin',
  },
  {
    href: '/en',
    label: 'Edit site',
    icon: Pencil,
  },
]

const MANAGE: NavItem[] = [
  {
    href: '/admin/content',
    label: 'Content',
    icon: Layers,
    match: (p) => CONTENT_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + '/')),
  },
  {
    href: '/admin/reservations',
    label: 'Reservations',
    icon: BedDouble,
    match: (p) => p.startsWith('/admin/reservations'),
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    match: (p) => p.startsWith('/admin/users'),
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    match: (p) => p.startsWith('/admin/settings'),
  },
]

function NavLink({
  item,
  pathname,
  collapsed,
  external,
}: {
  item: NavItem
  pathname: string
  collapsed: boolean
  external?: boolean
}) {
  const active = item.match ? item.match(pathname) : pathname === item.href
  const className = cn(
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    collapsed && 'justify-center px-2',
    active
      ? 'bg-white text-[#0B1F3B] shadow-sm'
      : 'text-white/70 hover:bg-white/10 hover:text-white',
  )

  if (external) {
    return (
      <a href={item.href} title={item.label} className={className} target="_blank" rel="noreferrer">
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && <ExternalLink className="ml-auto h-3 w-3 opacity-50" />}
      </a>
    )
  }

  return (
    <Link href={item.href} title={item.label} className={className}>
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [configured, setConfigured] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const isLogin = pathname === '/admin/login'

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem('admin-sidebar-collapsed') === '1')
    } catch {
      // ignore
    }
  }, [])

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }

  useEffect(() => {
    if (isLogin) {
      setReady(true)
      return
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      setConfigured(false)
      setReady(true)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setConfigured(false)
      setReady(true)
      return
    }

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace('/auth/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, role, full_name')
        .eq('id', data.user.id)
        .maybeSingle()

      let isAdmin = profile?.role === 'admin'
      if (!isAdmin) {
        const { data: legacy } = await supabase
          .from('admin_profiles')
          .select('user_id, email')
          .eq('user_id', data.user.id)
          .maybeSingle()
        isAdmin = Boolean(legacy)
        if (legacy) {
          setEmail(legacy.email || data.user.email || null)
          setReady(true)
          return
        }
      }

      if (!isAdmin) {
        await supabase.auth.signOut()
        router.replace('/auth/login?error=not_admin')
        return
      }

      setEmail(profile?.email || profile?.full_name || data.user.email || null)
      setReady(true)
    })
  }, [router, isLogin])

  const logout = async () => {
    const supabase = createClient()
    await supabase?.auth.signOut()
    router.replace('/auth/login')
  }

  useEffect(() => {
    if (isLogin) return
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevHtmlHeight = html.style.height
    const prevBodyHeight = body.style.height
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.height = '100%'
    body.style.height = '100%'
    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      html.style.height = prevHtmlHeight
      body.style.height = prevBodyHeight
    }
  }, [isLogin])

  if (isLogin) {
    return <>{children}</>
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF2F7] text-[#072A5A]">
        <div className="h-8 w-8 animate-pulse rounded-full bg-[#0046A4]/30" />
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 bg-[#EEF2F7] px-6 text-[#072A5A]">
        <h1 className="font-heading text-2xl font-bold">Supabase not configured</h1>
        <p className="text-sm text-[#3D4F6F]">
          Add your project URL and anon key to <code className="rounded bg-white px-1.5 py-0.5">.env</code>,
          then run the SQL scripts in <code className="rounded bg-white px-1.5 py-0.5">scripts/</code>.
        </p>
        <Link href="/fr" className="text-sm font-semibold text-[#0046A4] underline">
          ← Back to site
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-[#EEF2F7] text-[#072A5A]">
      <aside
        className={cn(
          'flex h-full shrink-0 flex-col bg-[#0B1F3B] text-white transition-[width] duration-300 ease-out',
          collapsed ? 'w-[4.25rem]' : 'w-60',
        )}
      >
        <div className="shrink-0 px-3 py-5">
          <div className={cn('flex items-center gap-2', collapsed ? 'flex-col' : 'justify-between')}>
            {!collapsed ? (
              <div className="min-w-0 pl-1">
                <p className="font-heading text-base font-bold tracking-tight text-white">WKDA</p>
                <p className="truncate text-[11px] text-white/45">{email}</p>
              </div>
            ) : (
              <p className="font-heading text-sm font-bold text-white">W</p>
            )}
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-white/55 hover:bg-white/10 hover:text-white"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-2 pb-3">
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                Start
              </p>
            )}
            {PRIMARY.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
                external={item.href === '/en'}
              />
            ))}
          </div>

          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                Manage
              </p>
            )}
            {MANAGE.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
            ))}
          </div>
        </nav>

        <div className="shrink-0 space-y-1 border-t border-white/10 p-2">
          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-white/10 hover:text-white',
              collapsed && 'justify-center px-2',
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && 'Sign out'}
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#072A5A]/8 bg-white/80 px-6 backdrop-blur-md sm:px-8">
          <p className="text-sm font-semibold text-[#072A5A]/80">Admin</p>
          <div className="flex items-center gap-1 sm:gap-3">
            <NotificationCenter variant="light" />
            <a
              href="/en"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-[#0046A4] hover:bg-[#0046A4]/8"
            >
              Open website <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-6 sm:p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
