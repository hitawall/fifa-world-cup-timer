'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { getCountry, getTopCountries } from '@/lib/countries'
import type { VisitorData } from '@/lib/visitor-store'

interface Props {
  data: VisitorData
  userCountry: string | null
  selectedCountry?: string | null
  onClose?: () => void
}

export function CountryStats({ data, userCountry, selectedCountry, onClose }: Props) {
  const code = selectedCountry ?? userCountry
  if (!code) return null

  const info = getCountry(code)
  const count = data.countries[code] ?? 0
  const top = getTopCountries(data.countries, 200)
  const rank = top.findIndex((c) => c.code === code) + 1
  const celebrations = data.celebrationsByCountry[code] ?? 0
  const isUser = code === userCountry

  const kickoffLocal = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date('2026-06-12T20:00:00.000Z'))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="rounded-2xl p-4 space-y-3"
        style={{
          background: 'var(--card)',
          border: isUser ? '1px solid var(--color-fifa-gold)' : '1px solid var(--card-border)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{info?.flag ?? '🏳️'}</span>
            <div>
              <div className="font-bold" style={{ color: 'var(--fg)' }}>
                {info?.name ?? code}
              </div>
              {isUser && (
                <div className="text-xs" style={{ color: 'var(--color-fifa-gold)' }}>
                  Your Country
                </div>
              )}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-lg opacity-50 hover:opacity-100 p-1"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Fans', value: count.toLocaleString() },
            { label: 'Global Rank', value: rank > 0 ? `#${rank}` : 'N/A' },
            { label: 'Celebrations', value: celebrations.toLocaleString() },
            {
              label: '% of Total',
              value: data.total > 0 ? `${((count / data.total) * 100).toFixed(1)}%` : '0%',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-2.5 text-center"
              style={{ background: 'var(--bg)' }}
            >
              <div className="text-lg font-bold" style={{ color: 'var(--color-fifa-gold)' }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Kickoff time in user's timezone */}
        {isUser && (
          <div
            className="rounded-xl p-3 text-sm"
            style={{ background: 'rgba(0,48,135,0.2)', border: '1px solid rgba(0,48,135,0.4)' }}
          >
            <div style={{ color: 'var(--muted)' }}>Kickoff in your timezone</div>
            <div className="font-semibold mt-0.5" style={{ color: 'var(--fg)' }}>
              {kickoffLocal}
            </div>
          </div>
        )}

        {info?.isWC2026Team && (
          <div
            className="text-xs text-center py-1 rounded-full"
            style={{
              background: 'rgba(255,215,0,0.15)',
              color: 'var(--color-fifa-gold)',
              border: '1px solid rgba(255,215,0,0.3)',
            }}
          >
            ⚽ FIFA World Cup 2026 Team
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
