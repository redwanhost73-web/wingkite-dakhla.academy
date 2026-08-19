'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'default' | 'danger'
  loading?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-[#072A5A]/10 bg-white sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-[#072A5A]">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[#3D4F6F]">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="rounded-full border-[#072A5A]/15"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className={cn(
              'rounded-full',
              tone === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#0B1F3B] text-white hover:bg-[#0046A4]',
            )}
            onClick={(e) => {
              e.preventDefault()
              void onConfirm()
            }}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
