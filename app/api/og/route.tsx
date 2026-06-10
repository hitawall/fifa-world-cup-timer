import { ImageResponse } from 'next/og'
import { getCountdownState } from '@/lib/countdown'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // Allow snapshot params so sharing captures current countdown
  const dParam = searchParams.get('d')
  const hParam = searchParams.get('h')
  const mParam = searchParams.get('m')
  const sParam = searchParams.get('s')

  let days: number, hours: number, minutes: number, seconds: number

  if (dParam !== null) {
    days = parseInt(dParam, 10)
    hours = parseInt(hParam ?? '0', 10)
    minutes = parseInt(mParam ?? '0', 10)
    seconds = parseInt(sParam ?? '0', 10)
  } else {
    const state = getCountdownState()
    ;({ days, hours, minutes, seconds } = state)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #003087 0%, #0A0F1E 60%, #1a1030 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          gap: '24px',
        }}
      >
        {/* Title */}
        <div style={{ color: '#FFD700', fontSize: 36, fontWeight: 700, letterSpacing: 2 }}>
          FIFA WORLD CUP 2026
        </div>

        {/* Countdown digits */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
          {[
            { value: days, label: 'DAYS' },
            { value: hours, label: 'HOURS' },
            { value: minutes, label: 'MINS' },
            { value: seconds, label: 'SECS' },
          ].map(({ value, label }, i) => (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <div
                style={{
                  color: '#FFD700',
                  fontSize: 96,
                  fontWeight: 900,
                  lineHeight: 1,
                  textShadow: '0 0 30px rgba(255,215,0,0.5)',
                  minWidth: 130,
                  textAlign: 'center',
                }}
              >
                {String(value).padStart(2, '0')}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 16, letterSpacing: 4, fontWeight: 600 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Separators */}

        {/* Tagline */}
        <div style={{ color: '#94a3b8', fontSize: 22 }}>
          ⚽  The Greatest Show on Earth — Count Down Now
        </div>

        {/* Host countries */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['🇺🇸 USA', '🇨🇦 Canada', '🇲🇽 Mexico'].map((c) => (
            <div
              key={c}
              style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '6px 16px',
                borderRadius: 20,
                color: '#ffffff',
                fontSize: 16,
              }}
            >
              {c}
            </div>
          ))}
        </div>

        {/* URL watermark */}
        <div style={{ position: 'absolute', bottom: 20, right: 24, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
          {(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fifa-world-cup-timer.vercel.app').replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
