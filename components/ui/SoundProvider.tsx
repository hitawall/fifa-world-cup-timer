'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface SoundContextValue {
  muted: boolean
  toggle: () => void
}

const SoundContext = createContext<SoundContextValue>({ muted: false, toggle: () => {} })

export function useSound() {
  return useContext(SoundContext)
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('wc26_muted')
    if (stored === 'true') setMuted(true)
  }, [])

  const toggle = () => {
    setMuted((prev) => {
      const next = !prev
      localStorage.setItem('wc26_muted', String(next))
      return next
    })
  }

  return <SoundContext.Provider value={{ muted, toggle }}>{children}</SoundContext.Provider>
}

export { SoundContext }
