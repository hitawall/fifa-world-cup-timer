'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface DigitProps {
  value: number
  size?: 'lg' | 'xl'
  glowing?: boolean
}

export function Digit({ value, size = 'xl', glowing = false }: DigitProps) {
  const shouldReduceMotion = useReducedMotion()
  const display = String(value).padStart(1, '0')

  const variants = shouldReduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { rotateX: -90, opacity: 0 },
        center: { rotateX: 0, opacity: 1 },
        exit: { rotateX: 90, opacity: 0 },
      }

  const sizeClasses = size === 'xl'
    ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
    : 'text-4xl sm:text-5xl md:text-6xl'

  return (
    <div
      className="digit-perspective relative inline-block w-[0.6em] overflow-hidden"
      style={{
        filter: glowing
          ? 'drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FFD700aa)'
          : undefined,
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={display}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className={`${sizeClasses} font-bold tabular-nums leading-none block text-center`}
          style={{ color: 'var(--color-fifa-gold)' }}
          aria-hidden="true"
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
