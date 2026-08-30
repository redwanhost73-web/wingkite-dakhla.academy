import { PageLayout } from '@/components/page-layout'
import { AccommodationContent } from '@/components/accommodation-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'الإقامة في الداخلة — فنادق ومخيمات | Wing Kite Academy',
  description:
    'فنادق ومخيمات شريكة في الداخلة — أنواع غرف داخلة كامب: كوخ بإطلالة بحر، ديلوكس، ستاندرد وجناح.',
}

export default async function AccommodationPage() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <AccommodationContent />
    </PageLayout>
  )
}
