import { PageLayout } from '@/components/page-layout'
import { GalleryContent } from '@/components/gallery-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Galerie | Wing Kite Dakhla Academy',
  description:
    'Photos de cours de wingfoil et kitesurf, sessions sur le lagon et vie à l’école Wing Kite Dakhla Academy au Maroc.',
}

export default async function GalleryPageFr() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <GalleryContent />
    </PageLayout>
  )
}
