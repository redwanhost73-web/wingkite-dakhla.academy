import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Profile, UserRole } from '@/lib/auth/roles'

export async function getServerProfile(): Promise<{
  user: { id: string; email?: string } | null
  profile: Profile | null
  supabase: Awaited<ReturnType<typeof createClient>> | null
  error: NextResponse | null
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      user: null,
      profile: null,
      supabase: null,
      error: NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 }),
    }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        user: null,
        profile: null,
        supabase,
        error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    return {
      user: { id: user.id, email: user.email },
      profile: (profile as Profile) || null,
      supabase,
      error: null,
    }
  } catch {
    return {
      user: null,
      profile: null,
      supabase: null,
      error: NextResponse.json({ error: 'Auth error' }, { status: 500 }),
    }
  }
}

export async function requireAdmin() {
  const result = await getServerProfile()
  if (result.error && result.error.status === 503) {
    return { error: result.error, supabase: null as null, user: null as null, profile: null as null }
  }
  if (!result.user || result.error?.status === 401) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      supabase: null as null,
      user: null as null,
      profile: null as null,
    }
  }

  const role = result.profile?.role
  if (role !== 'admin') {
    // Legacy fallback: admin_profiles table
    if (result.supabase) {
      const { data: legacy } = await result.supabase
        .from('admin_profiles')
        .select('user_id')
        .eq('user_id', result.user.id)
        .maybeSingle()
      if (legacy) {
        return {
          error: null,
          supabase: result.supabase,
          user: result.user,
          profile: result.profile,
        }
      }
    }
    return {
      error: NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 }),
      supabase: null as null,
      user: null as null,
      profile: null as null,
    }
  }

  return {
    error: null,
    supabase: result.supabase!,
    user: result.user,
    profile: result.profile,
  }
}

export async function requireRoles(allowed: UserRole[]) {
  const result = await getServerProfile()
  if (result.error && !result.user) return result
  if (!result.user) {
    return {
      ...result,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  const role = result.profile?.role
  if (!role || !allowed.includes(role)) {
    return {
      ...result,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }
  return { ...result, error: null }
}
