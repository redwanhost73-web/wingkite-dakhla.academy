import { PageLayout } from '@/components/page-layout'
import { AccommodationContent } from '@/components/accommodation-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Alojamiento en Dakhla — Hoteles y camps | Wing Kite Academy',
  description:
    'Hoteles y camps partners en Dakhla — tipos de habitación en Dakhla Camp: bungalow vista mar, deluxe, standard y suite.',
}

export default async function AccommodationPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <AccommodationContent />
    </PageLayout>
  )
}
