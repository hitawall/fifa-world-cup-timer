'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Digit } from './Digit'

interface DigitGroupProps {
  value: number
  label: string
  size?: 'lg' | 'xl'
  compact?: boolean
  glowing?: boolean
  shaking?: boolean
}

export function DigitGroup({ value, label, size = 'xl', compact = false, glowing = false, shaking = false }: DigitGroupProps) {
  const shouldReduceMotion = useReducedMotion()
  const tens = Math.floor(value / 10)
  const ones = value % 10

  const shakeVariants = shouldReduceMotion
    ? {}
    : {
        animate: shaking
          ? {
              x: [0, -8, 8, -8, 8, -4, 4, 0],
              transition: { duration: 0.6, ease: 'easeInOut' },
            }
          : {},
      }

  return (
    <motion.div
      {...(shaking ? shakeVariants : {})}
      className={`flex flex-col items-center gap-1 ${compact ? 'gap-0' : ''}`}
    >
      <div
        className="flex items-center gap-0.5 group cursor-default"
        onMouseEnter={(e) => {
          if (shouldReduceMotion) return
          const el = e.currentTarget
          el.style.transform = 'scale(1.05) perspective(200px) rotateY(3deg)'
          el.style.transition = 'transform 0.2s ease'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform = ''
        }}
      >
        <Digit value={tens} size={size} glowing={glowing} />
        <Digit value={ones} size={size} glowing={glowing} />
      </div>
      <span
        className={`${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold tracking-[0.2em] uppercase`}
        style={{ color: 'var(--muted)' }}
      >
        {label}
      </span>
    </motion.div>
  )
}
