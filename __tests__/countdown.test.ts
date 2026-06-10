import { getMilestone, getCountdownState, getProgressPercent, KICKOFF_UTC } from '@/lib/countdown'

describe('getMilestone', () => {
  it('returns kickoff at 0 seconds', () => {
    expect(getMilestone(0)).toBe('kickoff')
  })
  it('returns kickoff for negative seconds', () => {
    expect(getMilestone(-1)).toBe('kickoff')
  })
  it('returns 1min at exactly 60 seconds', () => {
    expect(getMilestone(60)).toBe('1min')
  })
  it('returns 1min at 1 second', () => {
    expect(getMilestone(1)).toBe('1min')
  })
  it('returns 10min at exactly 600 seconds', () => {
    expect(getMilestone(600)).toBe('10min')
  })
  it('returns 10min at 61 seconds', () => {
    expect(getMilestone(61)).toBe('10min')
  })
  it('returns 1h at exactly 3600 seconds', () => {
    expect(getMilestone(3600)).toBe('1h')
  })
  it('returns 1h at 601 seconds', () => {
    expect(getMilestone(601)).toBe('1h')
  })
  it('returns 24h at exactly 86400 seconds', () => {
    expect(getMilestone(86400)).toBe('24h')
  })
  it('returns 24h at 3601 seconds', () => {
    expect(getMilestone(3601)).toBe('24h')
  })
  it('returns null beyond 24h', () => {
    expect(getMilestone(86401)).toBeNull()
    expect(getMilestone(172800)).toBeNull()
  })
})

describe('getCountdownState', () => {
  it('returns all zeros at kickoff', () => {
    const state = getCountdownState(KICKOFF_UTC)
    expect(state.totalSeconds).toBe(0)
    expect(state.days).toBe(0)
    expect(state.hours).toBe(0)
    expect(state.minutes).toBe(0)
    expect(state.seconds).toBe(0)
    expect(state.isKickoff).toBe(true)
    expect(state.milestone).toBe('kickoff')
  })

  it('correctly decomposes 90061 seconds (1d 1h 1m 1s)', () => {
    const now = new Date(KICKOFF_UTC.getTime() - 90061 * 1000)
    const state = getCountdownState(now)
    expect(state.days).toBe(1)
    expect(state.hours).toBe(1)
    expect(state.minutes).toBe(1)
    expect(state.seconds).toBe(1)
    expect(state.totalSeconds).toBe(90061)
  })

  it('does not go negative past kickoff', () => {
    const after = new Date(KICKOFF_UTC.getTime() + 5000)
    const state = getCountdownState(after)
    expect(state.totalSeconds).toBe(0)
    expect(state.isKickoff).toBe(true)
  })
})

describe('getProgressPercent', () => {
  it('returns 0 at the 2022 WC final date', () => {
    const start = new Date('2022-12-18T00:00:00.000Z')
    expect(getProgressPercent(start)).toBe(0)
  })

  it('returns 100 at kickoff', () => {
    expect(getProgressPercent(KICKOFF_UTC)).toBe(100)
  })

  it('returns a value between 0 and 100 for mid-point dates', () => {
    const mid = new Date('2024-09-15T00:00:00.000Z')
    const pct = getProgressPercent(mid)
    expect(pct).toBeGreaterThan(0)
    expect(pct).toBeLessThan(100)
  })
})
