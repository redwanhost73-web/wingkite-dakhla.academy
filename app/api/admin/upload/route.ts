import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Images (JPEG/PNG/WebP/GIF) or MP4/WebM video.' },
        { status: 400 },
      )
    }

    const max = file.type.startsWith('video/') ? 40 * 1024 * 1024 : 8 * 1024 * 1024
    if (file.size > max) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    const hasRwToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
    const hasOidc =
      Boolean(process.env.VERCEL_OIDC_TOKEN) && Boolean(process.env.BLOB_STORE_ID)

    if (!hasRwToken && !hasOidc) {
      return NextResponse.json(
        {
          error:
            'Blob auth missing. Add BLOB_STORE_ID + pull VERCEL_OIDC_TOKEN (vercel env pull), or set BLOB_READ_WRITE_TOKEN. You can still paste a public URL in admin.',
        },
        { status: 503 },
      )
    }

    const extension = file.name.split('.').pop() || 'bin'
    const filename = `cms/${Date.now()}.${extension}`

    const token = process.env.BLOB_READ_WRITE_TOKEN
    const oidcToken = process.env.VERCEL_OIDC_TOKEN
    const storeId = process.env.BLOB_STORE_ID
    let blob: Awaited<ReturnType<typeof put>> | null = null
    let lastError: unknown = null

    // Try RW token first.
    if (token) {
      try {
        blob = await put(filename, file, { access: 'public', token })
      } catch (err) {
        lastError = err
      }
    }

    // Fallback to OIDC + store if token path fails.
    if (!blob && oidcToken && storeId) {
      try {
        blob = await put(filename, file, {
          access: 'public',
          oidcToken,
          storeId,
        })
      } catch (err) {
        lastError = err
      }
    }

    if (!blob) {
      const reason = lastError instanceof Error ? lastError.message : 'Unknown blob auth error'
      return NextResponse.json(
        {
          error:
            `Blob auth failed. Verify token/store match in Vercel. Details: ${reason}`,
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error('Admin upload error:', err)
    const msg = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
