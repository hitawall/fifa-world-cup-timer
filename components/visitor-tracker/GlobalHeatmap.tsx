'use client'

import { memo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { VisitorData } from '@/lib/visitor-store'

// Dynamic import to defer 230KB TopoJSON world map
const HeatmapInner = dynamic(() => import('./GlobalHeatmapInner').then((m) => m.GlobalHeatmapInner), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64" style={{ color: 'var(--muted)' }}>
      Loading world map...
    </div>
  ),
})

interface Props {
  data: VisitorData
  userCountry: string | null
  onCountryClick?: (code: string) => void
}

export const GlobalHeatmap = memo(function GlobalHeatmap({ data, userCountry, onCountryClick }: Props) {
  return (
    <Suspense fallback={<div style={{ color: 'var(--muted)' }}>Loading map...</div>}>
      <HeatmapInner data={data} userCountry={userCountry} onCountryClick={onCountryClick} />
    </Suspense>
  )
})
