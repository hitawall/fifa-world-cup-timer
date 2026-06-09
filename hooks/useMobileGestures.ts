'use client'

import { useCallback, useEffect, useRef } from 'react'

interface MobileGestureHandlers {
  onShake?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onLongPress?: () => void
}

const SHAKE_THRESHOLD = 15
const LONG_PRESS_DURATION = 600

export function useMobileGestures(
  ref: React.RefObject<HTMLElement | null>,
  handlers: MobileGestureHandlers
) {
  const lastShakeRef = useRef(0)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Shake detection via DeviceMotion
  useEffect(() => {
    let permissionGranted = false

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return
      const total = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0)
      const now = Date.now()
      if (total > SHAKE_THRESHOLD && now - lastShakeRef.current > 1000) {
        lastShakeRef.current = now
        handlers.onShake?.()
      }
    }

    async function requestPermission() {
      // iOS 13+ requires explicit permission for DeviceMotionEvent
      const dme = DeviceMotionEvent as unknown as {
        requestPermission?: () => Promise<string>
      }
      if (typeof dme.requestPermission === 'function') {
        try {
          const result = await dme.requestPermission()
          permissionGranted = result === 'granted'
        } catch {
          return
        }
      } else {
        permissionGranted = true
      }

      if (permissionGranted) {
        window.addEventListener('devicemotion', handleMotion)
      }
    }

    // Request permission on first user tap
    const onFirstTap = () => {
      requestPermission()
      window.removeEventListener('click', onFirstTap)
    }
    window.addEventListener('click', onFirstTap, { once: true })

    return () => {
      window.removeEventListener('devicemotion', handleMotion)
      window.removeEventListener('click', onFirstTap)
    }
  }, [handlers])

  // Swipe + long-press on the ref element
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }

      longPressTimerRef.current = setTimeout(() => {
        handlers.onLongPress?.()
      }, LONG_PRESS_DURATION)
    },
    [handlers]
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      if (!touchStartRef.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStartRef.current.x
      const dy = touch.clientY - touchStartRef.current.y

      if (Math.abs(dx) > 60 && Math.abs(dy) < 50) {
        if (dx < 0) {
          handlers.onSwipeLeft?.()
        } else {
          handlers.onSwipeRight?.()
        }
      }
      touchStartRef.current = null
    },
    [handlers]
  )

  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('touchmove', handleTouchMove)
    }
  }, [ref, handleTouchStart, handleTouchEnd, handleTouchMove])
}
