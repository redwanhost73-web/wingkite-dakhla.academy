import { PageLayout } from '@/components/page-layout'
import { EquipmentRentalContent } from '@/components/equipment-rental-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'تأجير معدات كايت سيرف ووينج فويل | الداخلة',
  description:
    'تأجير معدات كايت سيرف ووينج فويل في الداخلة — أطقم كاملة، أجنحة، ألواح. نصف يوم أو يوم كامل.',
}

export default async function EquipmentRentalPage() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <EquipmentRentalContent />
    </PageLayout>
  )
}
