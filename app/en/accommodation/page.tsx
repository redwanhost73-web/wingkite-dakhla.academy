import { PageLayout } from '@/components/page-layout'
import { AccommodationContent } from '@/components/accommodation-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Accommodation in Dakhla — Hotels & camps | Wing Kite Academy',
  description:
    'Partner hotels and camps in Dakhla — Dakhla Camp room types: sea-view bungalow, deluxe, standard and suite.',
}

export default async function AccommodationPage() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <AccommodationContent />
    </PageLayout>
  )
}
