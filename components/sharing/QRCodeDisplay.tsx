'use client'

import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
}

export function QRCodeDisplay({ url }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  const download = () => {
    if (!svgRef.current) return

    // Serialize SVG → Blob → download
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'wc26-countdown-qr.svg'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="p-3 rounded-xl"
        style={{ background: '#fff' }}
      >
        <QRCodeSVG
          ref={svgRef}
          value={url}
          size={160}
          fgColor="#003087"
          bgColor="#ffffff"
          level="M"
        />
      </div>
      <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
        Scan to open the countdown
      </p>
      <button
        onClick={download}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
        style={{
          background: 'var(--color-fifa-navy)',
          color: 'var(--color-fifa-gold)',
          border: '1px solid var(--color-fifa-gold)',
        }}
      >
        Download QR Code
      </button>
    </div>
  )
}
