'use client'

import { useSound } from './SoundProvider'

export function SoundToggle() {
  const { muted, toggle } = useSound()

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      className="rounded-full p-2 text-xl transition-transform hover:scale-110 active:scale-95"
      title={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
