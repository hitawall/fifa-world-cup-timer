'use client'

import { useRef, useState, useEffect } from 'react'
import { CountdownTimer } from '@/components/countdown/CountdownTimer'
import { VisitorTracker } from '@/components/visitor-tracker/VisitorTracker'
import { ShareModal } from '@/components/sharing/ShareModal'
import { FloatingElements } from '@/components/ui/FloatingElements'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SoundToggle } from '@/components/ui/SoundToggle'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useVisitorData } from '@/hooks/useVisitorData'
import { trackReferral } from '@/lib/share'

export default function HomePage() {
  const [shareOpen, setShareOpen] = useState(false)
  const trackerRef = useRef<HTMLDivElement>(null)

  const { country: userCountry } = useGeolocation()
  const data = useVisitorData(userCountry)

  useEffect(() => {
    trackReferral()
  }, [])

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const visitorsFromCountry = userCountry ? data.countries[userCountry] : undefined

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingElements />

      {/* Header controls */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <SoundToggle />
        <ThemeToggle />
      </div>

      {/* Keyboard shortcuts hint */}
      <div
        className="fixed top-4 left-4 z-50 hidden sm:flex gap-3 text-xs"
        style={{ color: 'var(--muted)', opacity: 0.6 }}
      >
        <span>
          <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: 'var(--card-border)' }}>Space</kbd> celebrate
        </span>
        <span>
          <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: 'var(--card-border)' }}>S</kbd> share
        </span>
        <span>
          <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: 'var(--card-border)' }}>C</kbd> tracker
        </span>
      </div>

      {/* Hero / Countdown section */}
      <section
        id="countdown-hero"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 gap-10"
      >
        <CountdownTimer
          onShareOpen={() => setShareOpen(true)}
          onTrackerOpen={scrollToTracker}
        />

        {/* Quick fact badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: '🇺🇸🇨🇦🇲🇽', text: 'USA · Canada · Mexico' },
            { icon: '🏟️', text: '80 Matches' },
            { icon: '🌍', text: '32 Teams' },
            { icon: '⚽', text: 'June 12 – July 19, 2026' },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                color: 'var(--fg)',
              }}
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShareOpen(true)}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{
              background: 'var(--color-fifa-gold)',
              color: 'var(--color-fifa-navy)',
            }}
          >
            Share the Countdown 🎉
          </button>
          <button
            onClick={scrollToTracker}
            className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: 'var(--color-fifa-gold)',
              color: 'var(--color-fifa-gold)',
              background: 'transparent',
            }}
          >
            Global Fan Tracker 🌍
          </button>
        </div>

        {/* Scroll arrow */}
        <button
          onClick={scrollToTracker}
          className="animate-bounce mt-4"
          aria-label="Scroll to global fan tracker"
          style={{ color: 'var(--muted)', opacity: 0.6 }}
        >
          ↓
        </button>
      </section>

      {/* Visitor Tracker section */}
      <section
        ref={trackerRef}
        className="relative z-10 px-4 py-16"
        style={{ borderTop: '1px solid var(--card-border)' }}
        id="tracker"
        aria-label="Global Fan Tracker"
      >
        <div className="max-w-5xl mx-auto">
          <VisitorTracker />
        </div>
      </section>

      {/* Share modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        userCountry={userCountry}
        visitorsFromCountry={visitorsFromCountry}
        totalVisitors={data.total}
      />

      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(0,48,135,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(255,215,0,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
    </main>
  )
}
