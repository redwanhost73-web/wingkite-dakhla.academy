import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/supabase/admin'

export { isSupabaseConfigured }

export async function getSessionUser(): Promise<User | null> {
  const supabase = createClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function isAdminUser(userId?: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  const uid = userId || (await getSessionUser())?.id
  if (!uid) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', uid)
    .maybeSingle()
  if (profile?.role === 'admin') return true

  const { data } = await supabase
    .from('admin_profiles')
    .select('user_id')
    .eq('user_id', uid)
    .maybeSingle()
  return Boolean(data)
}
