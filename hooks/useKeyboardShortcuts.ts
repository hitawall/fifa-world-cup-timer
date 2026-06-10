'use client'

import { useEffect } from 'react'

interface ShortcutHandlers {
  onSpace?: () => void
  onS?: () => void
  onT?: () => void
  onC?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire inside inputs/textareas
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          handlers.onSpace?.()
          break
        case 's':
        case 'S':
          handlers.onS?.()
          break
        case 't':
        case 'T':
          handlers.onT?.()
          break
        case 'c':
        case 'C':
          handlers.onC?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
