import { PageLayout } from '@/components/page-layout'
import { PricingContent } from '@/components/pricing-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Precios Clases Wingfoil Dakhla | Tarifas Alquiler',
  description: 'Precios clases wingfoil Dakhla - Clases de wingfoil para principiantes, coaching avanzado y alquiler de material en la laguna de Dakhla, Marruecos.',
}

export default async function PricingPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <PricingContent />
    </PageLayout>
  )
}
