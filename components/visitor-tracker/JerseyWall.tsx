'use client'

import { motion } from 'framer-motion'
import { getTopCountries } from '@/lib/countries'
import type { VisitorData } from '@/lib/visitor-store'

interface Props {
  data: VisitorData
  userCountry: string | null
  onCountryClick?: (code: string) => void
}

export function JerseyWall({ data, userCountry, onCountryClick }: Props) {
  const top = getTopCountries(data.countries, 24)
  const maxCount = top[0]?.count ?? 1

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-sm font-semibold mb-4 text-center" style={{ color: 'var(--muted)' }}>
        Fan Jersey Wall — size = fan count
      </h3>
      <div className="flex flex-wrap justify-center gap-3 items-end">
        {top.map((country, i) => {
          const size = 40 + (country.count / maxCount) * 56 // 40–96px
          const isUser = country.code === userCountry

          return (
            <motion.button
              key={country.code}
              onClick={() => onCountryClick?.(country.code)}
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              className="flex flex-col items-center gap-1 cursor-pointer rounded-xl p-2"
              style={{
                width: size,
                background: isUser ? 'rgba(255,215,0,0.15)' : 'var(--card)',
                border: isUser ? '2px solid var(--color-fifa-gold)' : '1px solid var(--card-border)',
              }}
              aria-label={`${country.name}: ${country.count.toLocaleString()} fans`}
              title={`${country.name} — ${country.count.toLocaleString()} fans`}
            >
              <span style={{ fontSize: size * 0.5 }}>{country.flag}</span>
              <span
                className="text-xs font-semibold tabular-nums text-center leading-tight"
                style={{ color: isUser ? 'var(--color-fifa-gold)' : 'var(--muted)', fontSize: 9 }}
              >
                {(country.count / 1000).toFixed(1)}K
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
