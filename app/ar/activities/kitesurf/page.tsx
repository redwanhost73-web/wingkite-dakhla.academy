import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'دروس كايت سيرف الداخلة | Wing Kite Academy',
  description:
    'دروس كايت سيرف في الداخلة — مبتدئ ومتوسط، معدات مشمولة، مدربون IKO. أسعار خاص وشبه خاص على البحيرة.',
}

export default async function KitesurfActivityPage() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <ActivityCourseContent sport="kitesurf" />
    </PageLayout>
  )
}
