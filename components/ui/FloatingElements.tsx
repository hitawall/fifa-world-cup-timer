'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ELEMENTS = ['⚽', '🏆', '🥅', '⚽', '🌍', '⚽', '⭐', '⚽', '🔥', '⚽']

export function FloatingElements() {
  const shouldReduceMotion = useReducedMotion()

  const elements = useMemo(() => {
    const rand = mulberry32(42)
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: ELEMENTS[i % ELEMENTS.length],
      x: rand() * 100,
      y: rand() * 100,
      size: 16 + rand() * 24,
      duration: 8 + rand() * 14,
      yDrift: 30 + rand() * 40,
      delay: rand() * 5,
    }))
  }, [])

  if (shouldReduceMotion) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ opacity: 0.12, zIndex: 0 }}
    >
      {elements.map((el) => (
        <motion.div
          key={el.id}
          style={{
            position: 'absolute',
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: el.size,
            userSelect: 'none',
          }}
          animate={{
            y: [0, -el.yDrift, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  )
}
