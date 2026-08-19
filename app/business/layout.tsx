import type { ReactNode } from 'react'
import { DashboardShell } from '@/components/auth/dashboard-shell'

export const metadata = {
  title: 'Business dashboard',
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/business', label: 'Overview' },
  { href: '/business/leads', label: 'Leads' },
  { href: '/fr/contact', label: 'Contact school' },
]

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell title="Business" allowedRoles={['business', 'admin']} nav={NAV}>
      {children}
    </DashboardShell>
  )
}
