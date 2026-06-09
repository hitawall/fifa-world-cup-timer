import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export function GET(req: NextRequest) {
  // Vercel and Cloudflare both inject IP-based country headers
  const country =
    req.headers.get('x-vercel-ip-country') ??
    req.headers.get('cf-ipcountry') ??
    req.headers.get('x-country-code') ??
    null

  return NextResponse.json({ country })
}
