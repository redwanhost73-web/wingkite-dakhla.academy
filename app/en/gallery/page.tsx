import { PageLayout } from '@/components/page-layout'
import { GalleryContent } from '@/components/gallery-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Gallery | Wing Kite Dakhla Academy',
  description:
    'Photos of wingfoil and kitesurf lessons, lagoon sessions, and school life at Wing Kite Dakhla Academy in Morocco.',
}

export default async function GalleryPageEn() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <GalleryContent />
    </PageLayout>
  )
}
