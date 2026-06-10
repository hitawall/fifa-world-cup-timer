'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeDisplay } from './QRCodeDisplay'
import { EmbedGenerator } from './EmbedGenerator'
import { ScreenshotButton } from './ScreenshotButton'
import {
  twitterShareUrl,
  facebookShareUrl,
  whatsappShareUrl,
  telegramShareUrl,
  redditShareUrl,
  linkedinShareUrl,
  generateUserId,
  buildReferralUrl,
  type ShareContext,
} from '@/lib/share'
import { useCountdown } from '@/hooks/useCountdown'

interface Props {
  isOpen: boolean
  onClose: () => void
  userCountry?: string | null
  visitorsFromCountry?: number
  totalVisitors?: number
}

type Tab = 'social' | 'embed' | 'qr'

const SOCIAL_BUTTONS = [
  { label: '𝕏 / Twitter', color: '#000000', fn: twitterShareUrl },
  { label: 'Facebook', color: '#1877F2', fn: facebookShareUrl },
  { label: 'WhatsApp', color: '#25D366', fn: whatsappShareUrl },
  { label: 'Telegram', color: '#0088CC', fn: telegramShareUrl },
  { label: 'LinkedIn', color: '#0A66C2', fn: linkedinShareUrl },
  { label: 'Reddit', color: '#FF4500', fn: redditShareUrl },
]

export function ShareModal({ isOpen, onClose, userCountry, visitorsFromCountry, totalVisitors }: Props) {
  const [tab, setTab] = useState<Tab>('social')
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { days } = useCountdown()

  const ctx: ShareContext = {
    daysLeft: days,
    countryCode: userCountry,
    visitorsFromCountry,
    totalVisitors,
  }

  const referralUrl = typeof window !== 'undefined' ? buildReferralUrl(generateUserId()) : ''
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://wc26timer.com'

  // Focus trap
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl || shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nativeShare = async () => {
    if (!navigator.share) return
    await navigator.share({
      title: 'FIFA World Cup 2026 Countdown',
      text: `Only ${days} days until the World Cup! ⚽🌍`,
      url: shareUrl,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Share countdown"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--card-border)' }}
            >
              <h2 className="font-bold text-lg" style={{ color: 'var(--fg)' }}>
                Share the Countdown 🎉
              </h2>
              <button
                ref={closeRef}
                onClick={onClose}
                className="text-2xl leading-none opacity-50 hover:opacity-100 p-1"
                aria-label="Close share dialog"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid var(--card-border)' }}>
              {(['social', 'embed', 'qr'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-3 text-sm font-medium capitalize transition-colors"
                  style={{
                    color: tab === t ? 'var(--color-fifa-gold)' : 'var(--muted)',
                    borderBottom: tab === t ? '2px solid var(--color-fifa-gold)' : '2px solid transparent',
                  }}
                >
                  {t === 'qr' ? 'QR Code' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {tab === 'social' && (
                <div className="space-y-3">
                  {/* Social buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {SOCIAL_BUTTONS.map((btn) => (
                      <a
                        key={btn.label}
                        href={btn.fn(ctx)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.03] active:scale-95 text-white"
                        style={{ background: btn.color }}
                      >
                        {btn.label}
                      </a>
                    ))}
                  </div>

                  {/* Native share */}
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      onClick={nativeShare}
                      className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{
                        background: 'var(--color-fifa-gold)',
                        color: 'var(--color-fifa-navy)',
                      }}
                    >
                      Share via Device 📲
                    </button>
                  )}

                  {/* Copy referral link */}
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={referralUrl || shareUrl}
                      className="flex-1 px-3 py-2 rounded-lg text-xs"
                      style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--fg)',
                      }}
                    />
                    <button
                      onClick={copyLink}
                      className="px-3 py-2 rounded-lg text-xs font-medium"
                      style={{
                        background: copied ? 'var(--color-fifa-gold)' : 'var(--card)',
                        color: copied ? 'var(--color-fifa-navy)' : 'var(--fg)',
                        border: '1px solid var(--card-border)',
                      }}
                    >
                      {copied ? '✓' : 'Copy'}
                    </button>
                  </div>

                  {/* Screenshot */}
                  <ScreenshotButton targetId="countdown-hero" />
                </div>
              )}

              {tab === 'embed' && <EmbedGenerator />}

              {tab === 'qr' && <QRCodeDisplay url={shareUrl} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
