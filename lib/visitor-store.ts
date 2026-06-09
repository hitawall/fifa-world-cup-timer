import { COUNTRIES } from './countries'

const LAUNCH_EPOCH = new Date('2026-06-10T00:00:00Z').getTime()
const GROWTH_RATE_PER_HOUR = 0.018
const KEY_ADDITIONS = 'wc26_visitor_additions'
const KEY_VISITED = 'wc26_visited'
const KEY_CELEBRATIONS = 'wc26_celebration_counts'

// Deterministic PRNG — same seed always returns same sequence
function mulberry32(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stringHash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

// Deterministic noise: same country + hour always gives same value
function getHourlyNoise(countryCode: string, hourSlot: number): number {
  const rand = mulberry32(stringHash(countryCode + hourSlot))
  return rand() * 0.04 - 0.02 // ±2%
}

export function getSimulatedCount(seed: number, countryCode: string, now: Date): number {
  const hoursElapsed = (now.getTime() - LAUNCH_EPOCH) / 3_600_000
  const hourSlot = Math.floor(hoursElapsed)
  const noise = getHourlyNoise(countryCode, hourSlot)
  return Math.floor(seed * (1 + hoursElapsed * GROWTH_RATE_PER_HOUR) * (1 + noise))
}

export interface VisitorData {
  countries: Record<string, number>
  total: number
  userCountry: string | null
  celebrationsByCountry: Record<string, number>
}

// Stable server-side snapshot (hour-floored, no fine growth) to prevent hydration mismatch
export function getServerSnapshot(): VisitorData {
  const now = new Date()
  const hourAligned = new Date(Math.floor(now.getTime() / 3_600_000) * 3_600_000)
  return buildSnapshot(hourAligned, null)
}

function buildSnapshot(now: Date, userCountry: string | null): VisitorData {
  const countries: Record<string, number> = {}
  for (const c of COUNTRIES) {
    if (c.seed > 0) {
      countries[c.code] = getSimulatedCount(c.seed, c.code, now)
    }
  }

  // Merge localStorage user additions (client-side only)
  if (typeof window !== 'undefined') {
    try {
      const additions = JSON.parse(localStorage.getItem(KEY_ADDITIONS) ?? '{}') as Record<string, number>
      for (const [code, count] of Object.entries(additions)) {
        countries[code] = (countries[code] ?? 0) + count
      }
    } catch {
      // localStorage unavailable
    }
  }

  const total = Object.values(countries).reduce((sum, n) => sum + n, 0)

  let celebrationsByCountry: Record<string, number> = {}
  if (typeof window !== 'undefined') {
    try {
      celebrationsByCountry = JSON.parse(localStorage.getItem(KEY_CELEBRATIONS) ?? '{}')
    } catch {
      // ignore
    }
  }

  return { countries, total, userCountry, celebrationsByCountry }
}

export function getClientSnapshot(userCountry: string | null): VisitorData {
  return buildSnapshot(new Date(), userCountry)
}

// Record that this user visited (one-time increment)
export function recordVisit(countryCode: string): void {
  if (typeof window === 'undefined') return
  const visited = localStorage.getItem(KEY_VISITED)
  if (visited) return // already recorded this session on this device

  localStorage.setItem(KEY_VISITED, '1')

  try {
    const additions = JSON.parse(localStorage.getItem(KEY_ADDITIONS) ?? '{}') as Record<string, number>
    additions[countryCode] = (additions[countryCode] ?? 0) + 1
    localStorage.setItem(KEY_ADDITIONS, JSON.stringify(additions))
  } catch {
    // ignore
  }
}

export function recordCelebration(countryCode: string): void {
  if (typeof window === 'undefined') return
  try {
    const counts = JSON.parse(localStorage.getItem(KEY_CELEBRATIONS) ?? '{}') as Record<string, number>
    counts[countryCode] = (counts[countryCode] ?? 0) + 1
    localStorage.setItem(KEY_CELEBRATIONS, JSON.stringify(counts))
  } catch {
    // ignore
  }
}
