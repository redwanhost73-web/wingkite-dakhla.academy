import { PageLayout } from '@/components/page-layout'
import { GalleryContent } from '@/components/gallery-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Galería | Wing Kite Dakhla Academy',
  description:
    'Fotos de clases de wingfoil y kitesurf, sesiones en la laguna y vida en la escuela Wing Kite Dakhla Academy en Marruecos.',
}

export default async function GalleryPageEs() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <GalleryContent />
    </PageLayout>
  )
}
