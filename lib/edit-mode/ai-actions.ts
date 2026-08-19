import type {
  EditAiActionId,
  EditAiActionResult,
  EditAiProvider,
  EditAiActionRequest,
} from '@/lib/edit-mode/types'

/** Catalog of AI actions — UI reads this; providers register at runtime. */
export const EDIT_AI_ACTIONS: {
  id: EditAiActionId
  label: string
  description: string
  appliesTo: Array<'text' | 'image'>
}[] = [
  {
    id: 'translate',
    label: 'Translate',
    description: 'Fill FR / EN / ES / AR from the language you just edited',
    appliesTo: ['text'],
  },
  {
    id: 'recommend',
    label: 'Magic recommend',
    description: 'Contextual suggestions for the selected section or page',
    appliesTo: ['text', 'image'],
  },
]

const providers = new Map<string, EditAiProvider>()

export function registerEditAiProvider(provider: EditAiProvider) {
  providers.set(provider.id, provider)
}

export function getEditAiProviders() {
  return [...providers.values()]
}

export function getDefaultEditAiProvider() {
  return (
    providers.get('deepseek') ||
    (providers.values().next().value as EditAiProvider | undefined)
  )
}

/** Browser provider — calls admin API; DeepSeek key stays on the server. */
registerEditAiProvider({
  id: 'deepseek',
  label: 'DeepSeek',
  async run(req: EditAiActionRequest): Promise<EditAiActionResult> {
    try {
      const res = await fetch('/api/admin/edit-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      const data = (await res.json()) as EditAiActionResult
      if (!res.ok && !data.error) {
        return { ok: false, error: `AI request failed (${res.status})` }
      }
      return data
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'AI request failed',
      }
    }
  },
})
