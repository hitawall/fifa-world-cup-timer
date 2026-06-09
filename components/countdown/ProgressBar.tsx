'use client'

import { motion } from 'framer-motion'
import { getProgressPercent } from '@/lib/countdown'
import { useEffect, useState } from 'react'

export function ProgressBar() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    setPct(getProgressPercent())
    const id = setInterval(() => setPct(getProgressPercent()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
        <span>2022 WC Final</span>
        <span>{pct.toFixed(1)}% to kickoff</span>
        <span>2026 Kickoff</span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--card-border)' }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct.toFixed(1)}% of the way to FIFA World Cup 2026 kickoff`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--color-fifa-navy), var(--color-fifa-gold))' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
