'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Milestone } from '@/lib/countdown'
import { fireConfetti, CONFETTI_PRESETS } from '@/lib/confetti'
import { useSoundPlayer } from '@/hooks/useSound'

interface MilestoneAlertProps {
  milestone: Milestone
}

const MILESTONE_CONFIG: Record<
  NonNullable<Milestone>,
  { emoji: string; title: string; subtitle: string; duration: number }
> = {
  '24h': {
    emoji: '⏰',
    title: '24 Hours to Go!',
    subtitle: 'The World Cup is tomorrow. Get ready.',
    duration: 5000,
  },
  '1h': {
    emoji: '🔥',
    title: 'ONE HOUR LEFT!',
    subtitle: 'The stadium is roaring. The moment is near.',
    duration: 6000,
  },
  '10min': {
    emoji: '🎉',
    title: '10 MINUTES!',
    subtitle: "This is it. The world is watching.",
    duration: 8000,
  },
  '1min': {
    emoji: '⚡',
    title: 'ONE MINUTE!',
    subtitle: 'Hold your breath...',
    duration: 10000,
  },
  kickoff: {
    emoji: '⚽',
    title: "IT'S KICKOFF!",
    subtitle: 'FIFA World Cup 2026 has begun!',
    duration: 15000,
  },
}

export function MilestoneAlert({ milestone }: MilestoneAlertProps) {
  const [visible, setVisible] = useState(false)
  const [activeMilestone, setActiveMilestone] = useState<Milestone>(null)
  const prevRef = useRef<Milestone>(null)
  const shouldReduceMotion = useReducedMotion()
  const { play } = useSoundPlayer()
  const strobeRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (milestone === prevRef.current) return
    prevRef.current = milestone
    if (!milestone || milestone === 'kickoff' && !visible) {
      // kickoff handled separately below
    }
    if (!milestone) return

    setActiveMilestone(milestone)
    setVisible(true)

    const config = MILESTONE_CONFIG[milestone]
    const timer = setTimeout(() => setVisible(false), config.duration)

    if (milestone === '1h') {
      play('crowd-cheer', 0.4)
    } else if (milestone === '10min') {
      fireConfetti(CONFETTI_PRESETS.milestone10min)
      play('victory-horn', 0.7)
    } else if (milestone === '1min') {
      play('crowd-cheer', 0.8)
      // Strobe effect — rapid background color flash
      if (!shouldReduceMotion) {
        let toggle = false
        let count = 0
        strobeRef.current = setInterval(() => {
          document.documentElement.style.setProperty(
            '--strobe-bg',
            toggle ? 'rgba(0,48,135,0.15)' : 'rgba(255,215,0,0.15)'
          )
          toggle = !toggle
          if (++count >= 30) {
            clearInterval(strobeRef.current!)
            document.documentElement.style.removeProperty('--strobe-bg')
          }
        }, 100)
      }
    } else if (milestone === 'kickoff') {
      fireConfetti(CONFETTI_PRESETS.kickoff)
      play('victory-horn', 1.0)
      setTimeout(() => play('crowd-cheer', 0.8), 1000)
    }

    return () => clearTimeout(timer)
  }, [milestone, play, shouldReduceMotion, visible])

  useEffect(() => {
    return () => {
      if (strobeRef.current) clearInterval(strobeRef.current)
      document.documentElement.style.removeProperty('--strobe-bg')
    }
  }, [])

  const config = activeMilestone ? MILESTONE_CONFIG[activeMilestone] : null

  return (
    <AnimatePresence>
      {visible && config && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={
            activeMilestone === '24h'
              ? {
                  opacity: 1,
                  scale: [1, 1.04, 1, 1.04, 1, 1.04, 1],
                  boxShadow: [
                    '0 0 0px #FFD700',
                    '0 0 30px #FFD700',
                    '0 0 0px #FFD700',
                    '0 0 30px #FFD700',
                    '0 0 0px #FFD700',
                    '0 0 30px #FFD700',
                    '0 0 0px #FFD700',
                  ],
                  transition: { duration: 1.8, times: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1] },
                }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-6 py-4 text-center shadow-2xl backdrop-blur-sm"
          style={{
            background:
              activeMilestone === 'kickoff'
                ? 'linear-gradient(135deg, #003087, #FFD700)'
                : 'var(--card)',
            border: '2px solid var(--color-fifa-gold)',
            maxWidth: 'min(90vw, 400px)',
          }}
        >
          <div className="text-4xl mb-1">{config.emoji}</div>
          <div
            className="text-xl font-bold"
            style={{ color: activeMilestone === 'kickoff' ? '#fff' : 'var(--color-fifa-gold)' }}
          >
            {config.title}
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {config.subtitle}
          </div>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-3 text-lg opacity-50 hover:opacity-100"
            aria-label="Dismiss"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
