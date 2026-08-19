'use client'

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { hrefForNotification, type AdminNotification } from '@/lib/admin/notify'

function relativeTime(iso: string) {
  const diff = Date.now() - Date.parse(iso)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

type Props = {
  /** light = top admin header; dark = sidebar (legacy) */
  variant?: 'light' | 'dark'
}

export function NotificationCenter({ variant = 'light' }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AdminNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [setupRequired, setSetupRequired] = useState(false)
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (silent = true) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notifications', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load notifications')
      setItems(data.notifications || [])
      setUnread(data.unread || 0)
      setSetupRequired(Boolean(data.setupRequired))
    } catch (err) {
      if (!silent) {
        toast.error(err instanceof Error ? err.message : 'Notifications unavailable')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const safeRequest = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const res = await fetch(input, init)
        return res
      } catch (err) {
        // Some browser extensions patch window.fetch and may throw.
        toast.error(err instanceof Error ? err.message : 'Network request failed')
        return null
      }
    },
    [],
  )

  useEffect(() => {
    load(true)
    const id = window.setInterval(() => load(true), 30000)
    const onRefresh = () => load(true)
    window.addEventListener('admin:notifications-refresh', onRefresh)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('admin:notifications-refresh', onRefresh)
    }
  }, [load])

  useEffect(() => {
    if (open) load(false)
  }, [open, load])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const markAllRead = async () => {
    if (!unread) return
    const prev = items
    setItems((list) => list.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
    setUnread(0)

    const res = await safeRequest('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mark_all: true }),
    })
    if (!res) {
      setItems(prev)
      setUnread(prev.filter((n) => !n.read_at).length)
      return
    }
    if (!res.ok) {
      setItems(prev)
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Could not mark as read')
      load(true)
      return
    }
    toast.success('All marked as read')
  }

  const markOneRead = async (id: string) => {
    const target = items.find((n) => n.id === id)
    if (!target || target.read_at) return

    setItems((list) =>
      list.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
    )
    setUnread((u) => Math.max(0, u - 1))

    const res = await safeRequest('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    })
    if (!res) {
      load(true)
      return
    }
    if (!res.ok) load(true)
  }

  const removeOne = async (id: string, e?: MouseEvent) => {
    e?.stopPropagation()
    const prev = items
    const removed = items.find((n) => n.id === id)
    setItems((list) => list.filter((n) => n.id !== id))
    if (removed && !removed.read_at) setUnread((u) => Math.max(0, u - 1))

    const res = await safeRequest(`/api/admin/notifications?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (!res) {
      setItems(prev)
      setUnread(prev.filter((n) => !n.read_at).length)
      return
    }
    if (!res.ok) {
      setItems(prev)
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Could not delete')
      load(true)
      return
    }
  }

  const clearAll = async () => {
    if (!items.length) return
    const prev = items
    setItems([])
    setUnread(0)

    const res = await safeRequest('/api/admin/notifications?all=1', { method: 'DELETE' })
    if (!res) {
      setItems(prev)
      setUnread(prev.filter((n) => !n.read_at).length)
      return
    }
    if (!res.ok) {
      setItems(prev)
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Could not clear')
      load(true)
      return
    }
    toast.success('Notifications cleared')
  }

  const openItem = async (n: AdminNotification) => {
    markOneRead(n.id)
    const href = hrefForNotification(n)
    setOpen(false)
    if (href) router.push(href)
  }

  const isLight = variant === 'light'

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative rounded-full p-2 transition-colors',
          isLight
            ? 'text-[#3D4F6F] hover:bg-[#072A5A]/6 hover:text-[#072A5A]'
            : 'text-white/70 hover:bg-white/10 hover:text-white',
          open && (isLight ? 'bg-[#072A5A]/8 text-[#072A5A]' : 'bg-white/15 text-white'),
        )}
        aria-label={unread ? `${unread} unread notifications` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C9A66B] px-1 text-[0.6rem] font-bold text-[#0B1F3B]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#072A5A]/10 bg-white text-[#072A5A] shadow-[0_20px_50px_rgba(11,31,59,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-[#072A5A]/8 px-4 py-3">
              <div>
                <p className="text-sm font-bold">Notifications</p>
                <p className="text-[0.65rem] text-[#7A8AA3]">
                  {setupRequired
                    ? 'Setup required'
                    : loading && !items.length
                      ? 'Loading…'
                      : unread
                        ? `${unread} unread`
                        : 'All caught up'}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={!unread || setupRequired}
                  className="rounded-lg p-1.5 text-[#0046A4] hover:bg-[#DCEEFF] disabled:opacity-35"
                  title="Mark all read"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={!items.length || setupRequired}
                  className="rounded-lg p-1.5 text-[#7A8AA3] hover:bg-red-50 hover:text-red-600 disabled:opacity-35"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-[#7A8AA3] hover:bg-[#EEF2F7]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {setupRequired ? (
                <div className="space-y-2 px-4 py-6 text-sm text-[#3D4F6F]">
                  <p>Enable the notification centre in Supabase:</p>
                  <code className="block rounded-lg bg-[#EEF2F7] px-2 py-1.5 text-xs">
                    scripts/004_admin_notifications.sql
                  </code>
                </div>
              ) : loading && items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[#7A8AA3]">Loading…</p>
              ) : items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[#7A8AA3]">No notifications yet.</p>
              ) : (
                <ul>
                  {items.map((n) => {
                    const href = hrefForNotification(n)
                    return (
                      <li key={n.id} className="border-b border-[#072A5A]/6 last:border-0">
                        <button
                          type="button"
                          onClick={() => openItem(n)}
                          className={cn(
                            'flex w-full items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-[#EEF2F7]',
                            !n.read_at && 'bg-[#0046A4]/5',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                              n.read_at ? 'bg-transparent' : 'bg-[#0046A4]',
                            )}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-snug">{n.title}</p>
                            {n.body && (
                              <p className="mt-0.5 line-clamp-2 text-xs text-[#3D4F6F]">{n.body}</p>
                            )}
                            <p className="mt-1 text-[0.65rem] text-[#7A8AA3]">
                              {relativeTime(n.created_at)}
                              {n.actor_email ? ` · ${n.actor_email}` : ''}
                              {href ? ' · Open' : ''}
                            </p>
                          </div>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => removeOne(n.id, e)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                removeOne(n.id)
                              }
                            }}
                            className="shrink-0 rounded-lg p-1 text-[#7A8AA3] hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/** Call after user CRUD so the bell refreshes without waiting for the poll. */
export function refreshNotificationsEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin:notifications-refresh'))
  }
}
