import { NextResponse } from 'next/server'

/** Deprecated public upload — use authenticated /api/admin/upload instead. */
export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/admin/upload (admin auth required).' },
    { status: 410 },
  )
}
