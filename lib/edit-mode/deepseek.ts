/**
 * Server-only DeepSeek chat client (OpenAI-compatible).
 * Never import this into client components.
 */

export type DeepseekMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export function isDeepseekConfigured() {
  return Boolean(process.env.DEEPSEEK_API_KEY?.trim())
}

export async function deepseekChat(params: {
  messages: DeepseekMessage[]
  temperature?: number
}): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim()
  if (!apiKey) {
    return { ok: false, error: 'DEEPSEEK_API_KEY is not set' }
  }

  const base = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '')
  const url = `${base}/chat/completions`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: params.messages,
        temperature: params.temperature ?? 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    const data = (await res.json()) as {
      error?: { message?: string }
      choices?: Array<{ message?: { content?: string } }>
    }

    if (!res.ok) {
      return {
        ok: false,
        error: data.error?.message || `DeepSeek HTTP ${res.status}`,
      }
    }

    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) {
      return { ok: false, error: 'Empty response from DeepSeek' }
    }

    return { ok: true, content }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'DeepSeek request failed',
    }
  }
}
