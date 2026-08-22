import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Kitesurf Lessons Dakhla | Wing Kite Academy',
  description:
    'Kitesurf lessons in Dakhla — beginner and intermediate, gear included, IKO coaches. Private and semi-private rates on the lagoon.',
}

export default async function KitesurfActivityPage() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <ActivityCourseContent sport="kitesurf" />
    </PageLayout>
  )
}
