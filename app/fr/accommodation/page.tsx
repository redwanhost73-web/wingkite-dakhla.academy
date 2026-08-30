import { PageLayout } from '@/components/page-layout'
import { AccommodationContent } from '@/components/accommodation-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Hébergement à Dakhla — Hôtels & camps | Wing Kite Academy',
  description:
    'Hôtels et camps partenaires à Dakhla — Dakhla Camp et types de chambres : bungalows vue mer, deluxe, standard et suite.',
}

export default async function AccommodationPage() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <AccommodationContent />
    </PageLayout>
  )
}
