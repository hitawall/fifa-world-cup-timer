export interface ConfettiPreset {
  particleCount: number
  spread: number
  colors: string[]
  origin: { x: number; y: number }
  scalar?: number
  gravity?: number
}

export const FIFA_COLORS = ['#003087', '#FFD700', '#FFFFFF', '#00A651']

export const CONFETTI_PRESETS = {
  click: {
    particleCount: 60,
    spread: 60,
    colors: FIFA_COLORS,
    origin: { x: 0.5, y: 0.6 },
    scalar: 0.9,
  },
  milestone10min: [
    {
      particleCount: 120,
      spread: 70,
      colors: FIFA_COLORS,
      origin: { x: 0.25, y: 0.6 },
    },
    {
      particleCount: 120,
      spread: 70,
      colors: FIFA_COLORS,
      origin: { x: 0.75, y: 0.6 },
    },
  ],
  kickoff: [
    {
      particleCount: 200,
      spread: 90,
      colors: FIFA_COLORS,
      origin: { x: 0.2, y: 0.5 },
      gravity: 0.8,
    },
    {
      particleCount: 200,
      spread: 90,
      colors: FIFA_COLORS,
      origin: { x: 0.8, y: 0.5 },
      gravity: 0.8,
    },
    {
      particleCount: 150,
      spread: 60,
      colors: FIFA_COLORS,
      origin: { x: 0.5, y: 0.4 },
      scalar: 1.2,
    },
  ],
} satisfies Record<string, ConfettiPreset | ConfettiPreset[]>

export async function fireConfetti(preset: ConfettiPreset | ConfettiPreset[]) {
  const confetti = (await import('canvas-confetti')).default
  const presets = Array.isArray(preset) ? preset : [preset]
  presets.forEach((p, i) => {
    setTimeout(() => confetti(p), i * 150)
  })
}
