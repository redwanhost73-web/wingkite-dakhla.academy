import { PageLayout } from '@/components/page-layout'
import { HomeContent } from '@/components/home-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Escuela Wingfoil Dakhla | Clases Wing Foil & Kitesurf Marruecos',
  description: 'Escuela wingfoil Dakhla - Aprende wingfoil en la laguna de Dakhla, Marruecos. Clases para principiantes, coaching y alquiler de material. El mejor campamento de wingfoil en Marruecos.',
  keywords: ['wing foil Dakhla', 'escuela wingfoil Dakhla', 'clases wingfoil Dakhla', 'kitesurf Dakhla'],
}

export default async function HomePage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <HomeContent />
    </PageLayout>
  )
}
