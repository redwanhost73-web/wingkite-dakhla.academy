import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'دروس وينج فويل الداخلة | Wing Kite Academy',
  description:
    'دروس وينج فويل في الداخلة — مبتدئ ومتوسط، معدات مشمولة، مدربون معتمدون. أسعار خاص وشبه خاص على البحيرة.',
}

export default async function WingfoilActivityPage() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <ActivityCourseContent sport="wingfoil" />
    </PageLayout>
  )
}
