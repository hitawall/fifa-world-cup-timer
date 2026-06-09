'use client'

import { getTopCountries } from '@/lib/countries'
import type { VisitorData } from '@/lib/visitor-store'

interface Props {
  data: VisitorData
  userCountry: string | null
  onCountryClick?: (code: string) => void
}

export function SoccerBallOrbit({ data, userCountry, onCountryClick }: Props) {
  const top = getTopCountries(data.countries, 16)
  const maxCount = top[0]?.count ?? 1

  return (
    <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center" style={{ height: 420 }}>
      {/* Central ball */}
      <div
        className="absolute z-10 flex items-center justify-center rounded-full text-4xl select-none"
        style={{
          width: 72,
          height: 72,
          background: 'var(--color-fifa-navy)',
          border: '3px solid var(--color-fifa-gold)',
          boxShadow: '0 0 24px rgba(255,215,0,0.4)',
        }}
        aria-hidden="true"
      >
        ⚽
      </div>

      {/* Orbiting flags */}
      {top.map((country, i) => {
        // More visitors = larger radius = more prominent
        const radius = 60 + (country.count / maxCount) * 100
        const duration = 15 + (1 - country.count / maxCount) * 20 // faster for top countries
        const isUser = country.code === userCountry
        const angle = (360 / top.length) * i // initial angle offset

        return (
          <div
            key={country.code}
            className="absolute"
            style={{
              width: radius * 2,
              height: radius * 2,
              animation: `orbit-${i} ${duration}s linear infinite`,
            }}
          >
            <style>{`
              @keyframes orbit-${i} {
                from { transform: rotate(${angle}deg); }
                to   { transform: rotate(${angle + 360}deg); }
              }
            `}</style>
            <button
              onClick={() => onCountryClick?.(country.code)}
              className="absolute flex flex-col items-center gap-0.5"
              style={{
                top: -20,
                left: '50%',
                transform: `translateX(-50%) rotate(-${angle}deg)`,
                animation: `counter-orbit-${i} ${duration}s linear infinite`,
              }}
              title={`${country.name}: ${country.count.toLocaleString()}`}
              aria-label={`${country.name}: ${country.count.toLocaleString()} fans`}
            >
              <style>{`
                @keyframes counter-orbit-${i} {
                  from { transform: translateX(-50%) rotate(${-angle}deg); }
                  to   { transform: translateX(-50%) rotate(${-(angle + 360)}deg); }
                }
              `}</style>
              <span
                className="text-2xl leading-none"
                style={{
                  filter: isUser ? 'drop-shadow(0 0 6px #FFD700)' : undefined,
                  fontSize: isUser ? 28 : 22,
                }}
              >
                {country.flag}
              </span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: isUser ? 'var(--color-fifa-gold)' : 'var(--muted)', fontSize: 8 }}
              >
                {(country.count / 1000).toFixed(0)}K
              </span>
            </button>
          </div>
        )
      })}

      {/* Total count */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center"
        style={{ color: 'var(--muted)' }}
      >
        <span className="text-xs">
          {data.total.toLocaleString()} fans orbiting the World Cup
        </span>
      </div>
    </div>
  )
}
