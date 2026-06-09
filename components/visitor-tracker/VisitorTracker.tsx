'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useVisitorData } from '@/hooks/useVisitorData'
import { CountryLeaderboard } from './CountryLeaderboard'
import { StadiumCrowd } from './StadiumCrowd'
import { JerseyWall } from './JerseyWall'
import { SoccerBallOrbit } from './SoccerBallOrbit'
import { GlobalHeatmap } from './GlobalHeatmap'
import { CountryStats } from './CountryStats'
import { getCountry, COUNTRIES } from '@/lib/countries'

type ViewMode = 'leaderboard' | 'stadium' | 'heatmap' | 'jersey' | 'orbit'

const MODES: { id: ViewMode; label: string; emoji: string }[] = [
  { id: 'leaderboard', label: 'Leaderboard', emoji: '🏆' },
  { id: 'stadium', label: 'Stadium', emoji: '🏟️' },
  { id: 'heatmap', label: 'Heatmap', emoji: '🗺️' },
  { id: 'jersey', label: 'Jerseys', emoji: '👕' },
  { id: 'orbit', label: 'Orbit', emoji: '🪐' },
]

export function VisitorTracker() {
  const [mode, setMode] = useState<ViewMode>('leaderboard')
  const [selected, setSelected] = useState<string | null>(null)
  const { country: userCountry, loading, setManually } = useGeolocation()
  const data = useVisitorData(userCountry)

  const [showCountryPicker, setShowCountryPicker] = useState(false)

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
            🌍 Global Fan Tracker
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            <span className="font-bold" style={{ color: 'var(--color-fifa-gold)' }}>
              {data.total.toLocaleString()}
            </span>{' '}
            fans counting down from{' '}
            <span className="font-bold" style={{ color: 'var(--color-fifa-gold)' }}>
              {Object.keys(data.countries).length}
            </span>{' '}
            countries
          </p>
        </div>

        {/* Your country */}
        <button
          onClick={() => setShowCountryPicker(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--fg)',
          }}
        >
          {loading ? (
            <span style={{ color: 'var(--muted)' }}>Detecting location...</span>
          ) : userCountry ? (
            <>
              <span className="text-xl">{getCountry(userCountry)?.flag ?? '🏳️'}</span>
              <span>{getCountry(userCountry)?.name ?? userCountry}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>← you</span>
            </>
          ) : (
            <span style={{ color: 'var(--muted)' }}>Set your country</span>
          )}
        </button>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            style={{
              background: mode === m.id ? 'var(--color-fifa-gold)' : 'var(--card)',
              color: mode === m.id ? 'var(--color-fifa-navy)' : 'var(--fg)',
              border: `1px solid ${mode === m.id ? 'var(--color-fifa-gold)' : 'var(--card-border)'}`,
            }}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main view + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Active view */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl p-4 sm:p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
          >
            {mode === 'leaderboard' && (
              <CountryLeaderboard data={data} userCountry={userCountry} onCountryClick={setSelected} />
            )}
            {mode === 'stadium' && (
              <StadiumCrowd data={data} userCountry={userCountry} />
            )}
            {mode === 'heatmap' && (
              <GlobalHeatmap data={data} userCountry={userCountry} onCountryClick={setSelected} />
            )}
            {mode === 'jersey' && (
              <JerseyWall data={data} userCountry={userCountry} onCountryClick={setSelected} />
            )}
            {mode === 'orbit' && (
              <SoccerBallOrbit data={data} userCountry={userCountry} onCountryClick={setSelected} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Country stats sidebar */}
        <div className="space-y-3">
          {(selected || userCountry) && (
            <CountryStats
              data={data}
              userCountry={userCountry}
              selectedCountry={selected}
              onClose={selected ? () => setSelected(null) : undefined}
            />
          )}

          {/* Fun stats */}
          <div
            className="rounded-2xl p-4 space-y-2 text-sm"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
          >
            <h3 className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Global Stats
            </h3>
            {[
              { label: 'Total fans', value: data.total.toLocaleString() },
              { label: 'Countries', value: Object.keys(data.countries).length },
              {
                label: 'Top country',
                value: (() => {
                  const top = Object.entries(data.countries).sort(([, a], [, b]) => b - a)[0]
                  const info = top ? getCountry(top[0]) : null
                  return info ? `${info.flag} ${info.name}` : '—'
                })(),
              },
              {
                label: 'Most celebrated',
                value: (() => {
                  const top = Object.entries(data.celebrationsByCountry).sort(([, a], [, b]) => b - a)[0]
                  const info = top ? getCountry(top[0]) : null
                  return info ? `${info.flag} ${info.name}` : '—'
                })(),
              },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span style={{ color: 'var(--muted)' }}>{stat.label}</span>
                <span className="font-semibold" style={{ color: 'var(--fg)' }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Country picker modal */}
      <AnimatePresence>
        {showCountryPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowCountryPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-2xl p-4 w-full max-w-sm max-h-[70vh] overflow-y-auto"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>
                Select Your Country
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {COUNTRIES.slice(0, 40).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setManually(c.code)
                      setShowCountryPicker(false)
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-left transition-all hover:scale-[1.02]"
                    style={{
                      background: c.code === userCountry ? 'rgba(255,215,0,0.15)' : 'var(--bg)',
                      border: `1px solid ${c.code === userCountry ? 'var(--color-fifa-gold)' : 'var(--card-border)'}`,
                      color: 'var(--fg)',
                    }}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
