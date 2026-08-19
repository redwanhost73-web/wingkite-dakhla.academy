'use client'

import { USER_ROLES, roleLabel, type UserRole } from '@/lib/auth/roles'
import { cn } from '@/lib/utils'

/** Instant role picker — plain buttons (no Radix Tabs lag). */
export function RolePicker({
  value,
  onChange,
  className,
}: {
  value: UserRole
  onChange: (role: UserRole) => void
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#7A8AA3]">Role</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {USER_ROLES.map((role) => {
          const active = value === role
          return (
            <button
              key={role}
              type="button"
              onClick={() => onChange(role)}
              className={cn(
                'rounded-xl border px-2 py-2.5 text-center text-xs font-bold transition-colors',
                active
                  ? 'border-[#0B1F3B] bg-[#0B1F3B] text-white'
                  : 'border-[#072A5A]/12 bg-white text-[#3D4F6F] hover:border-[#0046A4]/35 hover:bg-[#FAF8F3]',
              )}
            >
              {roleLabel(role)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
