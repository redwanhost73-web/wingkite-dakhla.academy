import { PageLayout } from '@/components/page-layout'
import { EquipmentRentalContent } from '@/components/equipment-rental-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Alquiler de material Kitesurf y Wingfoil | Dakhla',
  description:
    'Alquiler de material kitesurf y wingfoil en Dakhla — sets completos, alas, tablas. Media jornada o día.',
}

export default async function EquipmentRentalPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <EquipmentRentalContent />
    </PageLayout>
  )
}
