'use client'

import { useState } from 'react'
import { Eye, EyeOff, ImageIcon, Loader2, Pencil, Send, Trash2 } from 'lucide-react'
import { useEditMode } from '@/components/edit-mode/edit-mode-provider'
import { ImageSlotBrowser } from '@/components/edit-mode/image-slot-browser'
import { cn } from '@/lib/utils'

export function EditModeToolbar() {
  const {
    isAdmin,
    adminReady,
    enabled,
    setEnabled,
    draftCount,
    discardAll,
    publish,
    publishing,
  } = useEditMode()
  const [libraryOpen, setLibraryOpen] = useState(false)

  if (!adminReady || !isAdmin) return null

  return (
    <>
      <div
        data-edit-chrome
        className="pointer-events-none fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 justify-center px-4"
      >
        <div
          className={cn(
            'pointer-events-auto flex items-center gap-2 rounded-full border px-2 py-2 shadow-[0_20px_50px_rgba(11,31,59,0.35)] backdrop-blur-md',
            enabled
              ? 'border-[#0046A4]/40 bg-[#0B1F3B] text-white'
              : 'border-white/20 bg-[#0B1F3B]/90 text-white',
          )}
        >
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold transition-colors',
              enabled ? 'bg-[#0046A4] text-white' : 'bg-white/10 hover:bg-white/15',
            )}
          >
            {enabled ? <EyeOff className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            {enabled ? 'Exit edit mode' : 'Edit website'}
          </button>

          {enabled && (
            <>
              <span className="hidden h-5 w-px bg-white/20 sm:block" />
              <button
                type="button"
                onClick={() => setLibraryOpen(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-white/90 hover:bg-white/10"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Images</span>
              </button>
              <span className="hidden px-2 text-[0.7rem] font-semibold text-white/70 sm:inline">
                {draftCount} draft{draftCount === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                disabled={!draftCount || publishing}
                onClick={discardAll}
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-white/80 hover:bg-white/10 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Discard</span>
              </button>
              <button
                type="button"
                disabled={!draftCount || publishing}
                onClick={() => publish()}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-bold text-[#0B1F3B] hover:bg-white/90 disabled:opacity-40"
              >
                {publishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Publish
              </button>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-200">
                <Eye className="h-3 w-3" />
                Live preview
              </span>
            </>
          )}
        </div>
      </div>
      <ImageSlotBrowser open={libraryOpen} onClose={() => setLibraryOpen(false)} />
    </>
  )
}
