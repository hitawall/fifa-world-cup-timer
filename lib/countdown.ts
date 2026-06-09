import { differenceInSeconds } from 'date-fns'

export const KICKOFF_UTC = new Date('2026-06-12T20:00:00.000Z')
export const WC2022_FINAL_UTC = new Date('2022-12-18T00:00:00.000Z')

export type Milestone = '24h' | '1h' | '10min' | '1min' | 'kickoff' | null

export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  milestone: Milestone
  isKickoff: boolean
}

export function getMilestone(secondsRemaining: number): Milestone {
  if (secondsRemaining <= 0) return 'kickoff'
  if (secondsRemaining <= 60) return '1min'
  if (secondsRemaining <= 600) return '10min'
  if (secondsRemaining <= 3600) return '1h'
  if (secondsRemaining <= 86400) return '24h'
  return null
}

export function getCountdownState(now: Date = new Date()): CountdownState {
  const totalSeconds = Math.max(0, differenceInSeconds(KICKOFF_UTC, now))

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    milestone: getMilestone(totalSeconds),
    isKickoff: totalSeconds === 0,
  }
}

export function getProgressPercent(now: Date = new Date()): number {
  const totalRange = differenceInSeconds(KICKOFF_UTC, WC2022_FINAL_UTC)
  const elapsed = differenceInSeconds(now, WC2022_FINAL_UTC)
  return Math.min(100, Math.max(0, (elapsed / totalRange) * 100))
}
