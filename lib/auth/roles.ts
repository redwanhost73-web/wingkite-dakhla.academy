export const USER_ROLES = ['tourist', 'student', 'business', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const SIGNUP_ROLES = ['tourist', 'student', 'business'] as const
export type SignupRole = (typeof SIGNUP_ROLES)[number]

/** Learners who browse the public site + manage a personal profile (not a CMS dashboard). */
export const PUBLIC_ACCOUNT_ROLES = ['tourist', 'student'] as const
export type PublicAccountRole = (typeof PUBLIC_ACCOUNT_ROLES)[number]

export type Profile = {
  id: string
  email: string | null
  full_name: string
  phone: string
  company_name: string
  role: UserRole
  avatar_url: string
  created_at?: string
}

export function normalizeRole(role: string | null | undefined): UserRole {
  if (role === 'client') return 'student' // legacy
  if (role && (USER_ROLES as readonly string[]).includes(role)) return role as UserRole
  return 'tourist'
}

export function isPublicAccountRole(role: string | null | undefined): role is PublicAccountRole {
  const r = normalizeRole(role)
  return r === 'tourist' || r === 'student'
}

export function postLoginPath(role: UserRole | string): string {
  switch (normalizeRole(role)) {
    case 'admin':
      return '/admin'
    case 'business':
      return '/business'
    case 'student':
    case 'tourist':
      return '/profile'
    default:
      return '/fr'
  }
}

/** @deprecated use postLoginPath */
export function dashboardPath(role: UserRole): string {
  return postLoginPath(role)
}

export function roleLabel(role: UserRole | string): string {
  switch (normalizeRole(role)) {
    case 'admin':
      return 'Admin'
    case 'business':
      return 'Business'
    case 'student':
      return 'Student'
    case 'tourist':
      return 'Tourist'
  }
}
