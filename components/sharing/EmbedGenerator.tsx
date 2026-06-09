'use client'

import { useState } from 'react'

type EmbedTheme = 'dark' | 'light'
type EmbedSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<EmbedSize, { width: number; height: number }> = {
  sm: { width: 300, height: 90 },
  md: { width: 420, height: 110 },
  lg: { width: 600, height: 130 },
}

export function EmbedGenerator() {
  const [theme, setTheme] = useState<EmbedTheme>('dark')
  const [size, setSize] = useState<EmbedSize>('md')
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wc26timer.com'
  const { width, height } = SIZE_MAP[size]
  const src = `${origin}/embed?theme=${theme}&size=${size}`

  const code = `<iframe\n  src="${src}"\n  width="${width}"\n  height="${height}"\n  frameborder="0"\n  allow="autoplay"\n  title="FIFA World Cup 2026 Countdown"\n></iframe>`

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            Theme
          </label>
          <div className="flex gap-2">
            {(['dark', 'light'] as EmbedTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="px-3 py-1 rounded-lg text-xs font-medium capitalize"
                style={{
                  background: theme === t ? 'var(--color-fifa-gold)' : 'var(--bg)',
                  color: theme === t ? 'var(--color-fifa-navy)' : 'var(--fg)',
                  border: `1px solid ${theme === t ? 'var(--color-fifa-gold)' : 'var(--card-border)'}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            Size
          </label>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as EmbedSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="px-3 py-1 rounded-lg text-xs font-medium uppercase"
                style={{
                  background: size === s ? 'var(--color-fifa-gold)' : 'var(--bg)',
                  color: size === s ? 'var(--color-fifa-navy)' : 'var(--fg)',
                  border: `1px solid ${size === s ? 'var(--color-fifa-gold)' : 'var(--card-border)'}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: '1px dashed var(--card-border)', padding: 8 }}
      >
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Preview:</p>
        <iframe
          src={src}
          width={width}
          height={height}
          frameBorder={0}
          title="FIFA World Cup 2026 Countdown preview"
          className="max-w-full"
        />
      </div>

      {/* Code */}
      <div className="relative">
        <pre
          className="text-xs rounded-lg p-3 overflow-x-auto"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--card-border)',
            color: 'var(--fg)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {code}
        </pre>
        <button
          onClick={copy}
          className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium"
          style={{
            background: copied ? 'var(--color-fifa-gold)' : 'var(--card)',
            color: copied ? 'var(--color-fifa-navy)' : 'var(--fg)',
            border: '1px solid var(--card-border)',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
