'use client'

import dynamic from 'next/dynamic'

const WhatsAppBubble = dynamic(
  () => import('./whatsapp-bubble').then((m) => m.WhatsAppBubble),
  { ssr: false },
)

export function WhatsAppBubbleLazy() {
  return <WhatsAppBubble />
}
