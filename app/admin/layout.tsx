import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'

export const metadata = {
  title: 'Admin | Wing Kite Dakhla',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
