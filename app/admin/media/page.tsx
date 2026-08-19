import { redirect } from 'next/navigation'

/** Legacy path — content hub lives at /admin/content */
export default function AdminMediaRedirect() {
  redirect('/admin/content')
}
