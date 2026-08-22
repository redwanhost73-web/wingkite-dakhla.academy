import { PageLayout } from '@/components/page-layout'
import { ActivityCourseContent } from '@/components/activity-course-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Clases de Wingfoil Dakhla | Wing Kite Academy',
  description:
    'Clases de wingfoil en Dakhla — principiante e intermedio, material incluido, monitores certificados. Tarifas privado y semi-privado en la laguna.',
}

export default async function WingfoilActivityPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <ActivityCourseContent sport="wingfoil" />
    </PageLayout>
  )
}
