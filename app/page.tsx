'use client'

import { useRef, useState } from 'react'
import { CountdownTimer } from '@/components/countdown/CountdownTimer'
import { VisitorTracker } from '@/components/visitor-tracker/VisitorTracker'
import { FloatingElements } from '@/components/ui/FloatingElements'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SoundToggle } from '@/components/ui/SoundToggle'

export default function HomePage() {
  const [shareOpen, setShareOpen] = useState(false)
  const trackerRef = useRef<HTMLDivElement>(null)

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 gap-10">
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

      {/* Share modal placeholder (filled in Phase 4) */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShareOpen(false)}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--fg)' }}>
              Share the Countdown
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Full sharing features coming in Phase 4!
            </p>
            <div className="flex gap-3 flex-wrap mb-4">
              {['🐦 Twitter', '📘 Facebook', '💬 WhatsApp', '📱 Share'].map((btn) => (
                <button
                  key={btn}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: 'var(--color-fifa-navy)',
                    color: 'var(--color-fifa-gold)',
                    border: '1px solid var(--color-fifa-gold)',
                  }}
                  onClick={() => {
                    const text = `Only ${Math.ceil((new Date('2026-06-12T20:00:00Z').getTime() - Date.now()) / 86400000)} days until the World Cup! ⚽🌍`
                    if (navigator.share && btn.includes('Share')) {
                      navigator.share({ text, url: window.location.href })
                    } else if (typeof window !== 'undefined') {
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
                    }
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShareOpen(false)}
              className="w-full py-2 rounded-lg font-semibold text-sm"
              style={{ background: 'var(--color-fifa-gold)', color: 'var(--color-fifa-navy)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
