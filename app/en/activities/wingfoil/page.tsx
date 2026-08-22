import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Wingfoil Lessons Dakhla | Wing Kite Academy',
  description:
    'Wingfoil lessons in Dakhla — beginner and intermediate, gear included, certified coaches. Private and semi-private rates on the lagoon.',
}

export default async function WingfoilActivityPage() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <ActivityCourseContent sport="wingfoil" />
    </PageLayout>
  )
}
