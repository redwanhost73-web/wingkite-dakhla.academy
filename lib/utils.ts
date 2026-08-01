import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Our fluid type scale is declared as `@utility text-*` in globals.css. Without
// registering it here, tailwind-merge reads `text-card-title` as a text *colour*
// and silently drops any `text-white` sitting next to it.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display',
        'text-display-sm',
        'text-section',
        'text-card-title',
        'text-body-lg',
        'text-small',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
