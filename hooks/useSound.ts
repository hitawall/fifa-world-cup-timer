'use client'

import { useCallback, useRef } from 'react'
import { useSound as useSoundContext } from '@/components/ui/SoundProvider'

type SoundName = 'crowd-cheer' | 'victory-horn'

let sharedCtx: AudioContext | null = null

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    sharedCtx ??= new AudioContext()
    return sharedCtx
  } catch {
    return null
  }
}

function synthesizeCrowdCheer(ctx: AudioContext, volume: number) {
  const duration = 1.5
  const sr = ctx.sampleRate
  const bufferSize = Math.floor(sr * duration)
  const buffer = ctx.createBuffer(1, bufferSize, sr)
  const data = buffer.getChannelData(0)

  // Pink noise (Voss algorithm approximation)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0
  for (let i = 0; i < bufferSize; i++) {
    const w = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + w * 0.0555179
    b1 = 0.99332 * b1 + w * 0.0750759
    b2 = 0.96900 * b2 + w * 0.1538520
    b3 = 0.86650 * b3 + w * 0.3104856
    b4 = 0.55000 * b4 + w * 0.5329522
    data[i] = (b0 + b1 + b2 + b3 + b4 + w * 0.0556) / 4.5
  }

  const src = ctx.createBufferSource()
  src.buffer = buffer

  // Bandpass filter — crowd voice range ~500–3kHz
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1200
  bp.Q.value = 0.4

  // Second filter — add presence
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 400

  const gain = ctx.createGain()
  const t = ctx.currentTime
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.12)
  gain.gain.setValueAtTime(volume, t + 0.9)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)

  src.connect(bp)
  bp.connect(hp)
  hp.connect(gain)
  gain.connect(ctx.destination)
  src.start()
}

function synthesizeVictoryHorn(ctx: AudioContext, volume: number) {
  // C major chord spread: C4 E4 G4 C5
  const notes = [261.63, 329.63, 392.0, 523.25]
  const duration = 1.4

  notes.forEach((freq) => {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = freq
    osc.detune.value = (Math.random() - 0.5) * 8 // slight detuning for warmth

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 2400
    lp.Q.value = 0.7

    const gain = ctx.createGain()
    const t = ctx.currentTime
    const perNote = (volume * 0.7) / notes.length
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(perNote, t + 0.06)
    gain.gain.setValueAtTime(perNote, t + 0.8)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)

    osc.connect(lp)
    lp.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + duration)
  })
}

export function useSoundPlayer() {
  const { muted } = useSoundContext()

  const play = useCallback(
    (name: SoundName, volume = 0.5) => {
      if (muted) return
      const ctx = getAudioCtx()
      if (!ctx) return

      // Resume if suspended (browser autoplay policy)
      const resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve()
      resume.then(() => {
        if (name === 'crowd-cheer') synthesizeCrowdCheer(ctx, volume)
        else if (name === 'victory-horn') synthesizeVictoryHorn(ctx, volume)
      })
    },
    [muted]
  )

  return { play }
}
