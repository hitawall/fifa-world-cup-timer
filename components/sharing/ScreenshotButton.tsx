'use client'

import { useState } from 'react'

interface Props {
  targetId?: string
}

export function ScreenshotButton({ targetId = 'countdown-hero' }: Props) {
  const [loading, setLoading] = useState(false)

  const capture = async () => {
    setLoading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const el = document.getElementById(targetId) ?? document.body

      // Instagram Story dimensions (1080x1920 — capture at scale then resize)
      const canvas = await html2canvas(el, {
        backgroundColor: '#0A0F1E',
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Create story canvas
      const story = document.createElement('canvas')
      story.width = 1080
      story.height = 1920
      const ctx = story.getContext('2d')!
      ctx.fillStyle = '#0A0F1E'
      ctx.fillRect(0, 0, 1080, 1920)

      // Center the captured element
      const scale = Math.min(1080 / canvas.width, 1400 / canvas.height)
      const w = canvas.width * scale
      const h = canvas.height * scale
      const x = (1080 - w) / 2
      const y = (1920 - h) / 2 - 80
      ctx.drawImage(canvas, x, y, w, h)

      // Add branding text
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 48px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('FIFA World Cup 2026', 540, y + h + 80)
      ctx.fillStyle = '#94a3b8'
      ctx.font = '32px system-ui, sans-serif'
      ctx.fillText('wc26timer.com', 540, y + h + 140)

      const link = document.createElement('a')
      link.download = 'wc26-countdown.png'
      link.href = story.toDataURL('image/png')
      link.click()
    } catch {
      // html2canvas can fail for various reasons
      alert('Screenshot failed. Try a different browser.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={capture}
      disabled={loading}
      className="w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] disabled:opacity-50"
      style={{
        background: 'var(--card)',
        color: 'var(--fg)',
        border: '1px solid var(--card-border)',
      }}
    >
      {loading ? '📸 Capturing...' : '📸 Download as Image (Stories)'}
    </button>
  )
}
