import { NextResponse } from 'next/server'
import { getServerSnapshot } from '@/lib/visitor-store'

// GET returns the server-side simulated snapshot
export function GET() {
  const data = getServerSnapshot()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=10, stale-while-revalidate=60' },
  })
}
