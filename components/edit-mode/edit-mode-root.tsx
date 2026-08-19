'use client'

import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { EditModeProvider, useEditMode } from '@/components/edit-mode/edit-mode-provider'
import { EditModeToolbar } from '@/components/edit-mode/edit-mode-toolbar'
import { EditInspector, EditModeClickAway } from '@/components/edit-mode/edit-inspector'

function EditModeChrome() {
  const { isAdmin, adminReady } = useEditMode()
  if (!adminReady || !isAdmin) return null
  return (
    <>
      <EditModeToolbar />
      <EditInspector />
      <EditModeClickAway />
      <Toaster position="top-center" richColors />
    </>
  )
}

/** Mount on public page tree only — zero chrome for non-admins. */
export function EditModeRoot({ children }: { children: ReactNode }) {
  return (
    <EditModeProvider>
      {children}
      <EditModeChrome />
    </EditModeProvider>
  )
}
