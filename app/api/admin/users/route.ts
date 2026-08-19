import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { recordAdminNotification } from '@/lib/admin/notify'
import { isUserRole, validateEmail, validatePassword, type AdminUserRow } from '@/lib/admin/users'
import type { UserRole } from '@/lib/auth/roles'
import { normalizeRole, roleLabel } from '@/lib/auth/roles'

async function listAuthUsers(service: NonNullable<ReturnType<typeof createServiceClient>>) {
  type AuthUser = Awaited<ReturnType<typeof service.auth.admin.listUsers>>['data']['users'][number]
  const all: AuthUser[] = []
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    all.push(...data.users)
    if (data.users.length < 200) break
  }
  return all
}

export async function GET() {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  try {
    const [{ data: profiles, error: profileError }, authUsers] = await Promise.all([
      service.from('profiles').select('*').order('created_at', { ascending: false }),
      listAuthUsers(service),
    ])

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    const authById = new Map(authUsers.map((u) => [u.id, u]))
    const profileIds = new Set((profiles || []).map((p) => p.id as string))

    const rows: AdminUserRow[] = (profiles || []).map((p) => {
      const auth = authById.get(p.id as string)
      return {
        id: p.id as string,
        email: (p.email as string | null) || auth?.email || null,
        full_name: (p.full_name as string) || '',
        phone: (p.phone as string) || '',
        company_name: (p.company_name as string) || '',
        role: p.role as UserRole,
        avatar_url: (p.avatar_url as string) || '',
        created_at: (p.created_at as string) || auth?.created_at || null,
        updated_at: (p.updated_at as string) || null,
        email_confirmed: Boolean(auth?.email_confirmed_at),
        last_sign_in_at: auth?.last_sign_in_at || null,
        banned: Boolean(auth?.banned_until),
        is_self: p.id === admin.user!.id,
      }
    })

    // Auth users without a profile row yet
    for (const auth of authUsers) {
      if (profileIds.has(auth.id)) continue
      rows.push({
        id: auth.id,
        email: auth.email || null,
        full_name: (auth.user_metadata?.full_name as string) || '',
        phone: (auth.user_metadata?.phone as string) || '',
        company_name: (auth.user_metadata?.company_name as string) || '',
        role: 'tourist',
        avatar_url: '',
        created_at: auth.created_at || null,
        updated_at: null,
        email_confirmed: Boolean(auth.email_confirmed_at),
        last_sign_in_at: auth.last_sign_in_at || null,
        banned: Boolean(auth.banned_until),
        is_self: auth.id === admin.user.id,
      })
    }

    rows.sort((a, b) => {
      const at = a.created_at ? Date.parse(a.created_at) : 0
      const bt = b.created_at ? Date.parse(b.created_at) : 0
      return bt - at
    })

    return NextResponse.json({ users: rows, me: admin.user.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list users'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const full_name = String(body.full_name || '').trim()
  const phone = String(body.phone || '').trim()
  const company_name = String(body.company_name || '').trim()
  const role = isUserRole(body.role) ? normalizeRole(String(body.role)) : 'tourist'

  const emailError = validateEmail(email)
  if (emailError) return NextResponse.json({ error: emailError }, { status: 400 })
  const passwordError = validatePassword(password)
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 })

  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone, company_name, role },
  })

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message || 'Could not create user' },
      { status: 400 },
    )
  }

  const { error: profileError } = await service.from('profiles').upsert(
    {
      id: created.user.id,
      email,
      full_name,
      phone,
      company_name,
      role,
    },
    { onConflict: 'id' },
  )

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  await recordAdminNotification(service, {
    type: 'user.created',
    title: 'User created',
    body: `${email} · ${roleLabel(role)}`,
    actorId: admin.user.id,
    actorEmail: admin.user.email,
    meta: { user_id: created.user.id, email, role },
  })

  return NextResponse.json({ ok: true, id: created.user.id })
}
