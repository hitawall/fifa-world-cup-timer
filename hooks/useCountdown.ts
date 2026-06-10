'use client'

import { useEffect, useRef, useState } from 'react'
import { getCountdownState, type CountdownState, type Milestone } from '@/lib/countdown'

interface UseCountdownOptions {
  onMilestoneChange?: (milestone: Milestone) => void
}

export function useCountdown({ onMilestoneChange }: UseCountdownOptions = {}): CountdownState {
  const [state, setState] = useState<CountdownState>(() => getCountdownState())
  const prevMilestoneRef = useRef<Milestone>(state.milestone)
  const onMilestoneRef = useRef(onMilestoneChange)
  onMilestoneRef.current = onMilestoneChange

  useEffect(() => {
    const tick = () => {
      const next = getCountdownState()
      setState(next)

      if (next.milestone !== prevMilestoneRef.current) {
        prevMilestoneRef.current = next.milestone
        onMilestoneRef.current?.(next.milestone)
      }
    }

    const id = setInterval(tick, 1000)
    tick() // immediate first tick
    return () => clearInterval(id)
  }, [])

  return state
}
