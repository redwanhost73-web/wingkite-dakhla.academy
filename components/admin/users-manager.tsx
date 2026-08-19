'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  KeyRound,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  Check,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { AdminDrawer } from '@/components/admin/admin-drawer'
import { RolePicker } from '@/components/admin/role-picker'
import { refreshNotificationsEvent } from '@/components/admin/notification-center'
import { TextField } from '@/components/ui/form-field'
import { PasswordInput } from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { FormWizardNav, FormWizardSteps } from '@/components/ui/form-wizard'
import { USER_ROLES, roleLabel, type UserRole } from '@/lib/auth/roles'
import type { AdminUserRow } from '@/lib/admin/users'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { cn } from '@/lib/utils'

type FormState = {
  email: string
  password: string
  full_name: string
  phone: string
  company_name: string
  role: UserRole
}

const emptyForm: FormState = {
  email: '',
  password: '',
  full_name: '',
  phone: '',
  company_name: '',
  role: 'student',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function initials(name: string, email: string | null) {
  const base = (name || email || '?').trim()
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return base.slice(0, 2).toUpperCase()
}

function roleTriggerClass(role: UserRole) {
  switch (role) {
    case 'admin':
      return 'bg-[#0B1F3B] text-white hover:bg-[#16355A]'
    case 'business':
      return 'bg-[#0046A4]/12 text-[#0046A4] hover:bg-[#0046A4]/18'
    case 'student':
      return 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
    case 'tourist':
    default:
      return 'bg-[#F0EBE3] text-[#5A6A82] hover:bg-[#E8E0D4]'
  }
}

export function UsersManager() {
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [me, setMe] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [busy, setBusy] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [createStep, setCreateStep] = useState(0)
  const [editUser, setEditUser] = useState<AdminUserRow | null>(null)
  const [passwordUser, setPasswordUser] = useState<AdminUserRow | null>(null)
  const [deleteUser, setDeleteUser] = useState<AdminUserRow | null>(null)
  const [rolePending, setRolePending] = useState<{ user: AdminUserRow; role: UserRole } | null>(
    null,
  )

  const [form, setForm] = useState<FormState>(emptyForm)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load users')
      setUsers(data.users || [])
      setMe(data.me || null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const byRole = USER_ROLES.reduce(
      (acc, role) => {
        acc[role] = users.filter((u) => u.role === role).length
        return acc
      },
      {} as Record<UserRole, number>,
    )
    return { total: users.length, byRole }
  }, [users])

  const selfUser = useMemo(
    () => users.find((u) => u.is_self || u.id === me) || null,
    [users, me],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (!q) return true
      return [u.email, u.full_name, u.company_name, u.phone, u.role]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
    // Keep "you" at the top for easy self-management
    return [...list].sort((a, b) => {
      const aSelf = a.is_self || a.id === me ? 1 : 0
      const bSelf = b.is_self || b.id === me ? 1 : 0
      return bSelf - aSelf
    })
  }, [users, query, roleFilter, me])

  const openCreate = () => {
    setForm(emptyForm)
    setCreateStep(0)
    setCreateOpen(true)
  }

  const openEdit = (user: AdminUserRow) => {
    setForm({
      email: user.email || '',
      password: '',
      full_name: user.full_name || '',
      phone: user.phone || '',
      company_name: user.company_name || '',
      role: user.role,
    })
    setEditUser(user)
  }

  const openPassword = (user: AdminUserRow) => {
    setNewPassword('')
    setConfirmPassword('')
    setPasswordUser(user)
  }

  const createUser = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Create failed')
      toast.success('User created')
      setCreateOpen(false)
      refreshNotificationsEvent()
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          full_name: form.full_name,
          phone: form.phone,
          company_name: form.company_name,
          role: form.role,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      toast.success(editUser.is_self || editUser.id === me ? 'Your profile updated' : 'User updated')
      setEditUser(null)
      refreshNotificationsEvent()
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  const applyRoleChange = async () => {
    if (!rolePending) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/users/${rolePending.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: rolePending.role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Role update failed')
      toast.success(`Role → ${roleLabel(rolePending.role)}`)
      setRolePending(null)
      refreshNotificationsEvent()
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Role update failed')
    } finally {
      setBusy(false)
    }
  }

  const savePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (!passwordUser) return
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/users/${passwordUser.id}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Password update failed')
      toast.success(
        passwordUser.is_self || passwordUser.id === me
          ? 'Your password updated'
          : 'Password updated',
      )
      setPasswordUser(null)
      setNewPassword('')
      setConfirmPassword('')
      refreshNotificationsEvent()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Password update failed')
    } finally {
      setBusy(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteUser) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      toast.success('User deleted')
      setDeleteUser(null)
      refreshNotificationsEvent()
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <AdminPageHeader
        title="Users"
        description="Manage accounts — yours stays pinned at the top."
        backHref="/admin"
        backLabel="Dashboard"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#072A5A]/12 bg-white px-3.5 text-xs font-bold hover:bg-white/80"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0B1F3B] px-4 text-xs font-bold text-white hover:bg-[#0046A4]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add user
            </button>
          </div>
        }
      />

      {/* Your account — quick self management */}
      {selfUser && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#0046A4]/20 bg-gradient-to-r from-[#0B1F3B] to-[#0046A4] p-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
              {initials(selfUser.full_name, selfUser.email)}
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/55">
                Your account
              </p>
              <p className="font-semibold">{selfUser.full_name || 'Admin'}</p>
              <p className="text-xs text-white/70">{selfUser.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openEdit(selfUser)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-bold text-[#072A5A] hover:bg-white/90"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit profile
            </button>
            <button
              type="button"
              onClick={() => openPassword(selfUser)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 text-xs font-bold text-white hover:bg-white/15"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Change password
            </button>
          </div>
        </div>
      )}

      {/* Compact filter strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#072A5A]/8 bg-white p-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8AA3]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find by name or email…"
            className="h-10 w-full rounded-xl border border-[#072A5A]/10 bg-[#FAF8F3] pl-10 pr-3 text-sm outline-none focus:border-[#0046A4]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={cn(
              'h-8 rounded-full px-3 text-[0.7rem] font-bold transition-colors',
              roleFilter === 'all'
                ? 'bg-[#0B1F3B] text-white'
                : 'bg-[#F6F1E8] text-[#3D4F6F] hover:bg-[#EAE4DA]',
            )}
          >
            All {stats.total}
          </button>
          {USER_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter((r) => (r === role ? 'all' : role))}
              className={cn(
                'h-8 rounded-full px-3 text-[0.7rem] font-bold transition-colors',
                roleFilter === role
                  ? 'bg-[#0B1F3B] text-white'
                  : 'bg-[#F6F1E8] text-[#3D4F6F] hover:bg-[#EAE4DA]',
              )}
            >
              {roleLabel(role)} {stats.byRole[role]}
            </button>
          ))}
        </div>
      </div>

      {/* Compact table */}
      <div className="overflow-hidden rounded-2xl border border-[#072A5A]/8 bg-white shadow-[0_8px_24px_rgba(11,31,59,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#072A5A]/8 bg-[#FAF8F3] text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#7A8AA3]">
                <th className="px-4 py-2.5">Person</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Last active</th>
                <th className="px-4 py-2.5 text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[#7A8AA3]">
                    Loading users…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[#7A8AA3]">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isSelf = u.is_self || u.id === me
                  return (
                    <tr
                      key={u.id}
                      className={cn(
                        'border-t border-[#072A5A]/6 transition-colors hover:bg-[#FAF8F3]/80',
                        isSelf && 'bg-[#0046A4]/[0.04]',
                      )}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold',
                              isSelf
                                ? 'bg-[#0B1F3B] text-white'
                                : 'bg-[#E8EEF6] text-[#072A5A]',
                            )}
                          >
                            {initials(u.full_name, u.email)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-semibold text-[#072A5A]">
                                {u.full_name || 'Unnamed'}
                              </p>
                              {isSelf && (
                                <span className="shrink-0 rounded bg-[#C9A66B]/30 px-1.5 py-0.5 text-[0.6rem] font-bold text-[#072A5A]">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="truncate text-xs text-[#5A6A82]">{u.email || '—'}</p>
                            {(u.phone || u.company_name) && (
                              <p className="truncate text-[0.7rem] text-[#7A8AA3]">
                                {[u.phone, u.company_name].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            disabled={busy}
                            className={cn(
                              'inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[0.7rem] font-bold outline-none transition-colors',
                              'ring-0 focus-visible:ring-2 focus-visible:ring-[#0046A4]/25',
                              'disabled:opacity-50',
                              roleTriggerClass(u.role),
                            )}
                          >
                            {roleLabel(u.role)}
                            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuLabel className="text-[0.65rem] uppercase tracking-wider text-[#7A8AA3]">
                              Change role
                            </DropdownMenuLabel>
                            {USER_ROLES.map((r) => (
                              <DropdownMenuItem
                                key={r}
                                onClick={() => {
                                  if (r === u.role) return
                                  setRolePending({ user: u, role: r })
                                }}
                                className="flex items-center justify-between"
                              >
                                {roleLabel(r)}
                                {r === u.role && <Check className="h-3.5 w-3.5 text-[#0046A4]" />}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold',
                              u.email_confirmed
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800',
                            )}
                          >
                            {u.email_confirmed ? 'Confirmed' : 'Pending'}
                          </span>
                          {u.banned && (
                            <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[0.65rem] font-bold text-red-700">
                              Banned
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[#5A6A82]">
                        {formatDate(u.last_sign_in_at)}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0B1F3B] px-3 text-[0.7rem] font-bold text-white hover:bg-[#0046A4]"
                          >
                            <Pencil className="h-3 w-3" />
                            {isSelf ? 'Edit me' : 'Edit'}
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#072A5A]/10 text-[#072A5A] hover:bg-[#FAF8F3]">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => openPassword(u)}>
                                <KeyRound className="mr-2 h-4 w-4" />
                                {isSelf ? 'Change my password' : 'Reset password'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={isSelf}
                                onClick={() => !isSelf && setDeleteUser(u)}
                                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete user
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create — right drawer wizard */}
      <AdminDrawer
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o)
          if (!o) setCreateStep(0)
        }}
        title="Create user"
        description="Profile details first, then a temporary password."
      >
        <FormWizardSteps
          current={createStep}
          steps={[
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Password' },
          ]}
        />

        {createStep === 0 ? (
          <div className="mt-5 space-y-4">
            <RolePicker
              value={form.role}
              onChange={(role) => setForm((f) => ({ ...f, role }))}
            />
            <TextField
              label="Full name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Display name"
            />
            <TextField
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="user@email.com"
            />
            <PhoneInput
              label="Phone"
              value={form.phone}
              onChange={(phone) => setForm((f) => ({ ...f, phone }))}
              autoDetect={!form.phone}
              defaultCountry="MA"
            />
            <TextField
              label="Company"
              value={form.company_name}
              onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
              placeholder="Optional"
            />
            <FormWizardNav
              nextLabel="Continue"
              onNext={() => {
                if (!form.email.trim()) {
                  toast.error('Email is required')
                  return
                }
                setCreateStep(1)
              }}
            />
          </div>
        ) : (
          <form onSubmit={createUser} className="mt-5 space-y-4">
            <PasswordInput
              label="Temporary password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              showStrength
              hint="Min 8 characters, include a letter and a number. Share this once with the user."
            />
            <FormWizardNav
              onBack={() => setCreateStep(0)}
              nextLabel={busy ? 'Creating…' : 'Create user'}
              nextType="submit"
              loading={busy}
            />
          </form>
        )}
      </AdminDrawer>

      {/* Edit — right drawer */}
      <AdminDrawer
        open={Boolean(editUser)}
        onOpenChange={(o) => !o && setEditUser(null)}
        title={
          editUser && (editUser.is_self || editUser.id === me) ? 'Edit your profile' : 'Edit user'
        }
        description="Update profile details and role."
      >
        <form onSubmit={saveEdit} className="space-y-4">
          <RolePicker
            value={form.role}
            onChange={(role) => setForm((f) => ({ ...f, role }))}
          />
          <TextField
            label="Full name"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <PhoneInput
            label="Phone"
            value={form.phone}
            onChange={(phone) => setForm((f) => ({ ...f, phone }))}
            autoDetect={false}
            defaultCountry="MA"
          />
          <TextField
            label="Company"
            value={form.company_name}
            onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
          />
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditUser(null)}
              className="h-11 flex-1 rounded-full border border-[#072A5A]/15 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-11 flex-1 rounded-full bg-[#0B1F3B] text-sm font-bold text-white hover:bg-[#0046A4] disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </AdminDrawer>

      {/* Password — right drawer */}
      <AdminDrawer
        open={Boolean(passwordUser)}
        onOpenChange={(o) => {
          if (!o) {
            setPasswordUser(null)
            setNewPassword('')
            setConfirmPassword('')
          }
        }}
        title={
          passwordUser && (passwordUser.is_self || passwordUser.id === me)
            ? 'Change your password'
            : 'Reset password'
        }
        description={
          passwordUser && (passwordUser.is_self || passwordUser.id === me)
            ? 'Choose a new password for your admin account.'
            : `Set a new password for ${passwordUser?.email || 'this user'}.`
        }
        size="md"
      >
        <form onSubmit={savePassword} className="space-y-4">
          <PasswordInput
            label="New password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showStrength
            hint="Min 8 characters, include a letter and a number."
          />
          <PasswordInput
            label="Confirm password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPasswordUser(null)}
              className="h-11 flex-1 rounded-full border border-[#072A5A]/15 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-11 flex-1 rounded-full bg-[#0B1F3B] text-sm font-bold text-white hover:bg-[#0046A4] disabled:opacity-60"
            >
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDialog
        open={Boolean(deleteUser)}
        onOpenChange={(o) => !o && setDeleteUser(null)}
        title="Delete this user?"
        description={`Permanently remove ${deleteUser?.email || 'this account'} from Auth and profiles. This cannot be undone.`}
        confirmLabel="Delete user"
        tone="danger"
        loading={busy}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={Boolean(rolePending)}
        onOpenChange={(o) => !o && setRolePending(null)}
        title="Change user role?"
        description={
          rolePending
            ? `Set ${rolePending.user.email || 'this user'} from ${roleLabel(rolePending.user.role)} to ${roleLabel(rolePending.role)}.`
            : ''
        }
        confirmLabel="Change role"
        loading={busy}
        onConfirm={applyRoleChange}
      />
    </div>
  )
}
