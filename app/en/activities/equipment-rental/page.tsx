import { PageLayout } from '@/components/page-layout'
import { EquipmentRentalContent } from '@/components/equipment-rental-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Kitesurf & Wingfoil Equipment Rental | Dakhla',
  description:
    'Rent kitesurf and wingfoil gear in Dakhla — full sets, wings, boards. Half-day or full day.',
}

export default async function EquipmentRentalPage() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <EquipmentRentalContent />
    </PageLayout>
  )
}
