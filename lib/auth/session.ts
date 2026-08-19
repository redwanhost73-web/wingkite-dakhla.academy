import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/lib/auth/roles'

export async function fetchMyProfile(): Promise<Profile | null> {
  const supabase = createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (!data) {
    return {
      id: user.id,
      email: user.email ?? null,
      full_name: '',
      phone: '',
      company_name: '',
      role: 'tourist',
      avatar_url: '',
    }
  }
  return data as Profile
}

export async function requireRoleClient(allowed: UserRole[]): Promise<{
  profile: Profile | null
  redirectTo: string | null
}> {
  const profile = await fetchMyProfile()
  if (!profile) return { profile: null, redirectTo: '/auth/login' }
  if (!allowed.includes(profile.role)) {
    return { profile, redirectTo: '/auth/login?error=forbidden' }
  }
  return { profile, redirectTo: null }
}
