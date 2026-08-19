import type { UserRole } from '@/lib/auth/roles'
import { USER_ROLES } from '@/lib/auth/roles'

export type AdminUserRow = {
  id: string
  email: string | null
  full_name: string
  phone: string
  company_name: string
  role: UserRole
  avatar_url: string
  created_at: string | null
  updated_at: string | null
  email_confirmed: boolean
  last_sign_in_at: string | null
  banned: boolean
  is_self: boolean
}

export type CreateUserInput = {
  email: string
  password: string
  full_name?: string
  phone?: string
  company_name?: string
  role?: UserRole
}

export type UpdateUserInput = {
  email?: string
  full_name?: string
  phone?: string
  company_name?: string
  role?: UserRole
  avatar_url?: string
}

export function isUserRole(value: unknown): value is UserRole {
  if (value === 'client') return true // treat as valid input → normalize to student in API
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value)
}

export function validatePassword(password: string): string | null {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number.'
  }
  return null
}

export function validateEmail(email: string): string | null {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Enter a valid email address.'
  }
  return null
}
