'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'
import { useCelebration } from '@/hooks/useCelebration'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useMobileGestures } from '@/hooks/useMobileGestures'
import { MilestoneAlert } from './MilestoneAlert'
import { DigitGroup } from './DigitGroup'
import { ProgressBar } from './ProgressBar'
import type { Milestone } from '@/lib/countdown'

interface CountdownTimerProps {
  compact?: boolean
  onShareOpen?: () => void
  onTrackerOpen?: () => void
}

const THEMES = ['default', 'festive', 'neon', 'minimal'] as const

export function CountdownTimer({ compact = false, onShareOpen, onTrackerOpen }: CountdownTimerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { days, hours, minutes, seconds, milestone } = useCountdown()
  const { celebrate, count, streak } = useCelebration()
  const themeIndexRef = useRef(0)

  const is24h = milestone === '24h'
  const is1h = milestone === '1h'

  function cycleTheme() {
    themeIndexRef.current = (themeIndexRef.current + 1) % THEMES.length
    // Theme cycling could update global CSS class — kept simple for now
  }

  useKeyboardShortcuts({
    onSpace: celebrate,
    onS: onShareOpen,
    onT: cycleTheme,
    onC: onTrackerOpen,
  })

  useMobileGestures(containerRef, {
    onShake: celebrate,
    onSwipeLeft: cycleTheme,
    onSwipeRight: cycleTheme,
    onLongPress: async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
      } catch {
        // clipboard not available
      }
    },
  })

  const kickoffTime = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date('2026-06-12T20:00:00.000Z'))

  return (
    <div ref={containerRef} className="relative w-full">
      <MilestoneAlert milestone={milestone as Milestone} />

      <div className="flex flex-col items-center gap-6 w-full">
        {/* Hero text */}
        {!compact && (
          <div className="text-center space-y-2">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold"
              style={{ color: 'var(--fg)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              FIFA World Cup 2026
            </motion.h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--muted)' }}>
              {kickoffTime} · MetLife Stadium, USA
            </p>
          </div>
        )}

        {/* Main countdown digits */}
        <button
          onClick={celebrate}
          className="group flex items-center gap-4 sm:gap-8 cursor-pointer rounded-2xl p-4 sm:p-6 transition-all hover:scale-[1.02]"
          aria-label="Click to celebrate — triggers confetti burst"
          style={{ background: 'transparent' }}
        >
          <output
            className="flex items-center gap-4 sm:gap-8"
            aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining until FIFA World Cup 2026 kickoff`}
          >
            <DigitGroup value={days} label="Days" size={compact ? 'lg' : 'xl'} glowing={is24h} shaking={is1h} />
            <Separator compact={compact} />
            <DigitGroup value={hours} label="Hours" size={compact ? 'lg' : 'xl'} glowing={is24h} shaking={is1h} />
            <Separator compact={compact} />
            <DigitGroup value={minutes} label="Minutes" size={compact ? 'lg' : 'xl'} glowing={is24h} shaking={is1h} />
            <Separator compact={compact} />
            <DigitGroup value={seconds} label="Seconds" size={compact ? 'lg' : 'xl'} glowing={is24h} shaking={is1h} />
          </output>
        </button>

        {/* Progress bar */}
        {!compact && <ProgressBar />}

        {/* Celebration stats */}
        {!compact && count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-0.5"
          >
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              You&apos;ve celebrated{' '}
              <span className="font-bold" style={{ color: 'var(--color-fifa-gold)' }}>
                {count}
              </span>{' '}
              {count === 1 ? 'time' : 'times'}!
              {streak > 1 && (
                <span className="ml-2">
                  🔥{' '}
                  <span style={{ color: 'var(--color-fifa-gold)' }}>
                    {streak}-day streak
                  </span>
                </span>
              )}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)', opacity: 0.6 }}>
              Press <kbd className="px-1 py-0.5 rounded text-xs border" style={{ borderColor: 'var(--card-border)' }}>Space</kbd> to celebrate
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function Separator({ compact }: { compact: boolean }) {
  return (
    <span
      className={`${compact ? 'text-4xl' : 'text-5xl sm:text-6xl md:text-7xl'} font-bold pb-6 select-none`}
      style={{ color: 'var(--color-fifa-gold)', opacity: 0.6 }}
      aria-hidden="true"
    >
      :
    </span>
  )
}
