import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Clases de Kitesurf Dakhla | Wing Kite Academy',
  description:
    'Clases de kitesurf en Dakhla — principiante e intermedio, material incluido, monitores IKO. Tarifas privado y semi-privado en la laguna.',
}

export default async function KitesurfActivityPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <ActivityCourseContent sport="kitesurf" />
    </PageLayout>
  )
}
