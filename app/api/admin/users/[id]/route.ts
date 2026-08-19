import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { recordAdminNotification } from '@/lib/admin/notify'
import { isUserRole, validateEmail } from '@/lib/admin/users'
import { normalizeRole, roleLabel } from '@/lib/auth/roles'

type Ctx = { params: Promise<{ id: string }> }

async function adminCount(service: NonNullable<ReturnType<typeof createServiceClient>>) {
  const { count } = await service
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')
  return count ?? 0
}

export async function PATCH(request: Request, ctx: Ctx) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const { id } = await ctx.params
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

  const { data: existing } = await service
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!existing) {
    return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
  }

  const patch: Record<string, unknown> = {}
  if (typeof body.full_name === 'string') patch.full_name = body.full_name.trim()
  if (typeof body.phone === 'string') patch.phone = body.phone.trim()
  if (typeof body.company_name === 'string') patch.company_name = body.company_name.trim()
  if (typeof body.avatar_url === 'string') patch.avatar_url = body.avatar_url.trim()

  let nextEmail: string | undefined
  if (typeof body.email === 'string') {
    nextEmail = body.email.trim().toLowerCase()
    const emailError = validateEmail(nextEmail)
    if (emailError) return NextResponse.json({ error: emailError }, { status: 400 })
    patch.email = nextEmail
  }

  let roleChanged = false
  if (body.role !== undefined) {
    if (!isUserRole(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    if (existing.role === 'admin' && body.role !== 'admin') {
      if (id === admin.user.id) {
        return NextResponse.json({ error: 'You cannot demote your own admin account.' }, { status: 400 })
      }
      const count = await adminCount(service)
      if (count <= 1) {
        return NextResponse.json(
          { error: 'Cannot demote the last remaining admin.' },
          { status: 400 },
        )
      }
    }
    patch.role = normalizeRole(String(body.role))
    roleChanged = existing.role !== patch.role
  }

  if (Object.keys(patch).length === 0 && !nextEmail) {
    return NextResponse.json({ error: 'No changes provided' }, { status: 400 })
  }

  if (nextEmail && nextEmail !== existing.email) {
    const { error: authError } = await service.auth.admin.updateUserById(id, {
      email: nextEmail,
      email_confirm: true,
    })
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }
  }

  const { error: updateError } = await service.from('profiles').update(patch).eq('id', id)
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const label = (patch.email as string) || (existing.email as string) || id
  await recordAdminNotification(service, {
    type: roleChanged ? 'user.role' : 'user.updated',
    title: roleChanged ? 'Role changed' : 'User updated',
    body: roleChanged
      ? `${label}: ${roleLabel(existing.role)} → ${roleLabel(patch.role as never)}`
      : `Updated ${label}`,
    actorId: admin.user.id,
    actorEmail: admin.user.email,
    meta: { user_id: id, patch },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  const { id } = await ctx.params
  if (id === admin.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })
  }

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Service role is not configured' }, { status: 503 })
  }

  const { data: existing } = await service
    .from('profiles')
    .select('email, role')
    .eq('id', id)
    .maybeSingle()

  if (existing?.role === 'admin') {
    const count = await adminCount(service)
    if (count <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last remaining admin.' },
        { status: 400 },
      )
    }
  }

  const { error } = await service.auth.admin.deleteUser(id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await recordAdminNotification(service, {
    type: 'user.deleted',
    title: 'User deleted',
    body: existing?.email || id,
    actorId: admin.user.id,
    actorEmail: admin.user.email,
    meta: { user_id: id, email: existing?.email },
  })

  return NextResponse.json({ ok: true })
}
