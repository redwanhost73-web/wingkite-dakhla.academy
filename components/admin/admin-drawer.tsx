'use client'

import type { ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type AdminDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  /** Wider panel for forms with phone / wizard. */
  size?: 'md' | 'lg'
}

/** Right-side admin panel — preferred over centered modals for CRUD forms. */
export function AdminDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = 'lg',
}: AdminDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          'gap-0 border-[#072A5A]/10 bg-[#F6F1E8] p-0 text-[#072A5A]',
          'w-full max-w-none sm:max-w-md',
          size === 'lg' && 'sm:max-w-lg',
          className,
        )}
      >
        <SheetHeader className="shrink-0 space-y-1 border-b border-[#072A5A]/8 bg-white px-5 py-4 text-left">
          <SheetTitle className="font-heading text-xl font-bold text-[#072A5A]">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-sm text-[#3D4F6F]">{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
