import { redirect } from 'next/navigation'

export default function AccountBookingsRedirect() {
  redirect('/profile/bookings')
}
