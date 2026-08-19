import { NextResponse } from 'next/server'

/**
 * Best-effort country from edge/geo headers (Vercel, Cloudflare).
 * Used by PhoneInput auto-detect. Falls back client-side to locale/timezone.
 */
export async function GET(request: Request) {
  const headers = request.headers
  const raw = (
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    headers.get('x-geo-country') ||
    ''
  )
    .trim()
    .toUpperCase()

  const country = raw && raw !== 'XX' && /^[A-Z]{2}$/.test(raw) ? raw : null

  return NextResponse.json(
    { country },
    {
      headers: {
        'Cache-Control': 'private, max-age=300',
      },
    },
  )
}
