import type { ReactNode } from 'react'

export const metadata = {
  title: 'My account',
  robots: { index: false, follow: false },
}

/** Legacy /account routes redirect to /profile — no dashboard shell. */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return children
}
