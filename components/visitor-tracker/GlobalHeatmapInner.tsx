'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'

import { getCountry } from '@/lib/countries'
import type { VisitorData } from '@/lib/visitor-store'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Logarithmic scale: low=light blue, high=deep navy
function getColor(count: number, max: number): string {
  if (!count) return '#1e293b'
  const pct = Math.log(count + 1) / Math.log(max + 1)
  // Interpolate from #1e3a5f (low) to #003087 (high) blended with intensity
  const r = Math.round(30 + pct * (0 - 30))
  const g = Math.round(58 + pct * (48 - 58))
  const b = Math.round(95 + pct * (135 - 95))
  return `rgb(${r},${g},${b})`
}

interface Tooltip {
  name: string
  count: number
  flag: string
  x: number
  y: number
}

interface Props {
  data: VisitorData
  userCountry: string | null
  onCountryClick?: (code: string) => void
}

export function GlobalHeatmapInner({ data, userCountry, onCountryClick }: Props) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const maxCount = Math.max(...Object.values(data.countries))

  return (
    <div className="relative w-full" style={{ maxHeight: 400 }}>
      <ComposableMap
        projectionConfig={{ scale: 130 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name: string = geo.properties?.name ?? ''
                const countryEntry = Object.entries(data.countries).find(([code]) => {
                  const info = getCountry(code)
                  return info?.name === name || code === geo.properties?.iso_a2
                })
                const [code, count] = countryEntry ?? [null, 0]
                const info = code ? getCountry(code) : null
                const isUser = code === userCountry

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isUser ? '#FFD700' : getColor(count, maxCount)}
                    stroke="#0A0F1E"
                    strokeWidth={0.3}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: isUser ? '#FFE94D' : '#4d7cc7', outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e) => {
                      setTooltip({
                        name,
                        count,
                        flag: info?.flag ?? '🏳️',
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => code && onCountryClick?.(code)}
                    aria-label={`${name}: ${count.toLocaleString()} fans`}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg text-sm shadow-xl"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 40,
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--fg)',
          }}
        >
          <span className="mr-1">{tooltip.flag}</span>
          <strong>{tooltip.name}</strong>
          <span className="ml-2" style={{ color: 'var(--color-fifa-gold)' }}>
            {tooltip.count.toLocaleString()}
          </span>
          <span style={{ color: 'var(--muted)' }}> fans</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 justify-center">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Fewer</span>
        <div
          className="h-2 w-32 rounded-full"
          style={{ background: 'linear-gradient(90deg, #1e3a5f, #003087)' }}
        />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>More fans</span>
        <span className="ml-2 text-xs" style={{ color: 'var(--color-fifa-gold)' }}>■ Your country</span>
      </div>
    </div>
  )
}
