'use client'

import { useCallback, useEffect, useState } from 'react'
import { fireConfetti, CONFETTI_PRESETS } from '@/lib/confetti'
import { useSoundPlayer } from '@/hooks/useSound'

const KEY_COUNT = 'wc26_celebration_count'
const KEY_STREAK_DATE = 'wc26_streak_date'
const KEY_STREAK_COUNT = 'wc26_streak_count'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function useCelebration() {
  const [count, setCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const { play } = useSoundPlayer()

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(KEY_COUNT) ?? '0', 10)
    setCount(stored)

    const lastDate = localStorage.getItem(KEY_STREAK_DATE)
    const storedStreak = parseInt(localStorage.getItem(KEY_STREAK_COUNT) ?? '0', 10)
    const today = todayKey()
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    if (lastDate === today) {
      setStreak(storedStreak)
    } else if (lastDate === yesterday) {
      const newStreak = storedStreak + 1
      setStreak(newStreak)
      localStorage.setItem(KEY_STREAK_COUNT, String(newStreak))
      localStorage.setItem(KEY_STREAK_DATE, today)
    } else {
      setStreak(1)
      localStorage.setItem(KEY_STREAK_COUNT, '1')
      localStorage.setItem(KEY_STREAK_DATE, today)
    }
  }, [])

  const celebrate = useCallback(async () => {
    await fireConfetti(CONFETTI_PRESETS.click)
    play('crowd-cheer', 0.2)

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 30, 50])
    }

    setCount((prev) => {
      const next = prev + 1
      localStorage.setItem(KEY_COUNT, String(next))
      return next
    })
  }, [play])

  return { celebrate, count, streak }
}
