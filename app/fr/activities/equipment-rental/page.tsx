import { PageLayout } from '@/components/page-layout'
import { EquipmentRentalContent } from '@/components/equipment-rental-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Location de matériel Kitesurf & Wingfoil | Dakhla',
  description:
    'Location de matériel kitesurf et wingfoil à Dakhla — sets complets, ailes, planches. Demi-journée ou journée.',
}

export default async function EquipmentRentalPage() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <EquipmentRentalContent />
    </PageLayout>
  )
}
