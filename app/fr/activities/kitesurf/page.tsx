import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Cours Kitesurf Dakhla | École Wing & Kite Academy',
  description:
    'Cours de kitesurf à Dakhla — débutant et intermédiaire, matériel inclus, moniteurs IKO. Tarifs privé et semi-privé sur le lagon.',
}

export default async function KitesurfActivityPage() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <ActivityCourseContent sport="kitesurf" />
    </PageLayout>
  )
}
