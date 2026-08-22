import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Cours Wingfoil Dakhla | École Wing & Kite Academy',
  description:
    'Cours de wingfoil à Dakhla — débutant et intermédiaire, matériel inclus, moniteurs certifiés. Tarifs privé et semi-privé sur le lagon.',
}

export default async function WingfoilActivityPage() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <ActivityCourseContent sport="wingfoil" />
    </PageLayout>
  )
}
