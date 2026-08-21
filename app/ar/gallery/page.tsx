import { PageLayout } from '@/components/page-layout'
import { GalleryContent } from '@/components/gallery-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'المعرض | Wing Kite Dakhla Academy',
  description:
    'صور دروس الوينج فويل والكايت سيرف وجلسات البحيرة وحياة المدرسة في أكاديمية وينج كايت الداخلة بالمغرب.',
}

export default async function GalleryPageAr() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <GalleryContent />
    </PageLayout>
  )
}
