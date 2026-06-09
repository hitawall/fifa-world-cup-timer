'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useSound as useSoundContext } from '@/components/ui/SoundProvider'

type SoundName = 'crowd-cheer' | 'victory-horn'

interface HowlInstance {
  play: () => number
  volume: (v?: number) => number | HowlInstance
  unload: () => void
}

export function useSoundPlayer() {
  const { muted } = useSoundContext()
  const howls = useRef<Map<SoundName, HowlInstance>>(new Map())

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { Howl } = await import('howler')
        if (cancelled) return

        const sounds: [SoundName, string][] = [
          ['crowd-cheer', '/sounds/crowd-cheer.mp3'],
          ['victory-horn', '/sounds/victory-horn.mp3'],
        ]

        for (const [name, src] of sounds) {
          if (!howls.current.has(name)) {
            howls.current.set(name, new Howl({ src: [src], preload: true, volume: 0.5 }))
          }
        }
      } catch {
        // Howler load failure is non-fatal
      }
    }

    load()
    return () => {
      cancelled = true
      howls.current.forEach((h) => h.unload())
      howls.current.clear()
    }
  }, [])

  const play = useCallback(
    (name: SoundName, volume = 0.5) => {
      if (muted) return
      const howl = howls.current.get(name)
      if (howl) {
        howl.volume(volume)
        howl.play()
      }
    },
    [muted]
  )

  return { play }
}
