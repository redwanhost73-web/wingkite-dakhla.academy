import { redirect } from 'next/navigation'

/** Legacy admin login → unified auth */
export default function AdminLoginRedirect() {
  redirect('/auth/login')
}
