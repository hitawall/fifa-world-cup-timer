'use client'

import { motion } from 'framer-motion'
import { getCountry } from '@/lib/countries'
import type { VisitorData } from '@/lib/visitor-store'
import { useMemo } from 'react'

interface Props {
  data: VisitorData
  userCountry: string | null
}

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Silhouette person SVG path
const PERSON_PATH = 'M8,4a2,2,0,1,0,2-2A2,2,0,0,0,8,4ZM7,6v5h2V8h2V6Z'

export function StadiumCrowd({ data, userCountry }: Props) {
  const MAX_DISPLAY = 200
  const COLS = 20

  const topCountries = useMemo(() => {
    return Object.entries(data.countries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
  }, [data.countries])

  const crowd = useMemo(() => {
    const rand = mulberry32(99)
    return Array.from({ length: MAX_DISPLAY }, (_, i) => {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      const countryIdx = Math.floor(rand() * Math.min(topCountries.length, 8))
      const [code] = topCountries[countryIdx] ?? ['XX']
      const info = getCountry(code)
      const isUser = code === userCountry
      return { id: i, col, row, code, flag: info?.flag ?? '🏳️', isUser, delay: rand() * 0.5 }
    })
  }, [topCountries, userCountry])

  const ratio = Math.min(1, data.total / 500_000)
  const filledCount = Math.floor(ratio * MAX_DISPLAY)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <span className="text-2xl font-bold" style={{ color: 'var(--color-fifa-gold)' }}>
          {data.total.toLocaleString()}
        </span>
        <span className="text-sm ml-2" style={{ color: 'var(--muted)' }}>fans in the stadium</span>
      </div>

      {/* Stadium arc */}
      <div
        className="relative rounded-t-full overflow-hidden p-4"
        style={{
          background: 'linear-gradient(180deg, var(--color-fifa-navy) 0%, var(--card) 100%)',
          border: '2px solid var(--card-border)',
          minHeight: 160,
        }}
      >
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {crowd.map((person, i) => (
            <motion.div
              key={person.id}
              title={person.flag}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                i < filledCount
                  ? { opacity: person.isUser ? 1 : 0.7, scale: 1 }
                  : { opacity: 0.1, scale: 0.6 }
              }
              transition={{ delay: person.delay, duration: 0.3 }}
              className="flex items-center justify-center text-sm leading-none"
              aria-hidden="true"
            >
              {i < filledCount ? (
                <span
                  style={{
                    filter: person.isUser ? 'drop-shadow(0 0 4px #FFD700)' : undefined,
                    fontSize: person.isUser ? '1.1em' : '0.85em',
                  }}
                >
                  {person.flag}
                </span>
              ) : (
                <svg viewBox="0 0 16 12" className="w-3 h-3 opacity-20" fill="currentColor">
                  <path d={PERSON_PATH} />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
        Stadium fills as more fans join the countdown
      </p>
    </div>
  )
}
