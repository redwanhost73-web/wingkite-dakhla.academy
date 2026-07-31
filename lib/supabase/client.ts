import { createBrowserClient } from '@supabase/ssr'

// Returns null when Supabase is not configured. Callers must handle that case:
// createBrowserClient throws if the URL/key are missing, which would take down
// the whole client tree.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null

  return createBrowserClient(url, anonKey)
}
