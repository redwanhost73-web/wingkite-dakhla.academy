/**
 * One-shot: create/promote an admin user via service role.
 * Usage:
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... node scripts/create-admin.mjs
 * Never commit real passwords. Reads URL + service key from .env
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile(name) {
  try {
    const raw = readFileSync(resolve(process.cwd(), name), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const i = trimmed.indexOf('=')
      if (i < 0) continue
      const key = trimmed.slice(0, i).trim()
      let val = trimmed.slice(i + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (!(key in process.env)) process.env[key] = val
    }
  } catch {
    // optional
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const email = process.env.SEED_ADMIN_EMAIL?.trim()
const password = process.env.SEED_ADMIN_PASSWORD
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!email || !password) {
  console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD')
  process.exit(1)
}
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function findUserByEmail(target) {
  // Paginate lightly — fine for small projects
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase())
    if (hit) return hit
    if (data.users.length < 200) break
  }
  return null
}

async function main() {
  let user = await findUserByEmail(email)

  if (user) {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: { ...(user.user_metadata || {}), role: 'admin' },
    })
    if (error) throw error
    user = data.user
    console.log('Updated existing auth user:', user.id)
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin', full_name: 'Admin' },
    })
    if (error) throw error
    user = data.user
    console.log('Created auth user:', user.id)
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email,
      full_name: 'Admin',
      role: 'admin',
    },
    { onConflict: 'id' },
  )

  if (profileError) {
    console.error('profiles upsert failed (run scripts/003_auth_roles.sql first?):', profileError.message)
  } else {
    console.log('profiles.role set to admin')
  }

  // Legacy bridge used by some guards
  const { error: legacyError } = await supabase.from('admin_profiles').upsert(
    { user_id: user.id, email, role: 'admin' },
    { onConflict: 'user_id' },
  )
  if (legacyError) {
    console.warn('admin_profiles upsert skipped:', legacyError.message)
  } else {
    console.log('admin_profiles row ready')
  }

  console.log('Done. Sign in at /auth/login with', email)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
