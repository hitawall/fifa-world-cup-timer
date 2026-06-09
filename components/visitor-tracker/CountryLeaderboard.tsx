'use client'

import { motion } from 'framer-motion'
import { getTopCountries } from '@/lib/countries'
import type { VisitorData } from '@/lib/visitor-store'

interface Props {
  data: VisitorData
  userCountry: string | null
  onCountryClick?: (code: string) => void
}

export function CountryLeaderboard({ data, userCountry, onCountryClick }: Props) {
  const top = getTopCountries(data.countries, 12)
  const maxCount = top[0]?.count ?? 1

  return (
    <div className="w-full space-y-2 max-w-2xl mx-auto">
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted)' }}>
        Top Countries by Fans
      </h3>
      {top.map((country, i) => {
        const pct = (country.count / maxCount) * 100
        const isUser = country.code === userCountry

        return (
          <button
            key={country.code}
            onClick={() => onCountryClick?.(country.code)}
            className="w-full text-left group"
            aria-label={`${country.name}: ${country.count.toLocaleString()} fans. ${isUser ? 'Your country.' : ''}`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="w-5 text-xs text-right" style={{ color: 'var(--muted)' }}>
                #{i + 1}
              </span>
              <span className="text-lg leading-none">{country.flag}</span>
              <span
                className="text-sm font-medium flex-1"
                style={{ color: isUser ? 'var(--color-fifa-gold)' : 'var(--fg)' }}
              >
                {country.name}
                {isUser && <span className="ml-1 text-xs">← you</span>}
              </span>
              <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--fg)' }}>
                {country.count.toLocaleString()}
              </span>
            </div>
            <div
              className="ml-8 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--card-border)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isUser
                    ? 'var(--color-fifa-gold)'
                    : 'linear-gradient(90deg, var(--color-fifa-navy), #4d7cc7)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
