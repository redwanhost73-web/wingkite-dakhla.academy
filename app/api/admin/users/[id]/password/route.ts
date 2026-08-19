import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { recordAdminNotification } from '@/lib/admin/notify'
import { validatePassword } from '@/lib/admin/users'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: Request, ctx: Ctx) {
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

  const password = String(body.password || '')
  const passwordError = validatePassword(password)
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 })

  const { data: profile } = await service
    .from('profiles')
    .select('email')
    .eq('id', id)
    .maybeSingle()

  const { error } = await service.auth.admin.updateUserById(id, { password })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await recordAdminNotification(service, {
    type: 'user.password',
    title: 'Password reset',
    body: `Password updated for ${profile?.email || id}`,
    actorId: admin.user.id,
    actorEmail: admin.user.email,
    meta: { user_id: id },
  })

  return NextResponse.json({ ok: true })
}
