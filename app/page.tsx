'use client'

import { useState } from 'react'
import { CountdownTimer } from '@/components/countdown/CountdownTimer'
import { FloatingElements } from '@/components/ui/FloatingElements'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SoundToggle } from '@/components/ui/SoundToggle'

export default function HomePage() {
  const [shareOpen, setShareOpen] = useState(false)
  const [trackerOpen, setTrackerOpen] = useState(false)

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Floating decorative elements */}
      <FloatingElements />

      {/* Header controls */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <SoundToggle />
        <ThemeToggle />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="fixed top-4 left-4 z-50 hidden sm:flex gap-3 text-xs" style={{ color: 'var(--muted)', opacity: 0.6 }}>
        <span><kbd>Space</kbd> celebrate</span>
        <span><kbd>S</kbd> share</span>
        <span><kbd>C</kbd> tracker</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-4 w-full max-w-5xl py-20">
        <CountdownTimer
          onShareOpen={() => setShareOpen(true)}
          onTrackerOpen={() => setTrackerOpen(true)}
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

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShareOpen(true)}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--color-fifa-gold)',
              color: 'var(--color-fifa-navy)',
            }}
          >
            Share the Countdown 🎉
          </button>
          <button
            onClick={() => setTrackerOpen(true)}
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

        {/* Placeholder panels (filled in Phase 3 & 4) */}
        {trackerOpen && (
          <div
            id="tracker"
            className="w-full rounded-2xl p-8 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
          >
            <p className="text-lg font-semibold" style={{ color: 'var(--color-fifa-gold)' }}>
              🌍 Global Fan Tracker
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
              Coming in Phase 3 — visitor maps, country leaderboards, and more!
            </p>
          </div>
        )}

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
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--fg)' }}>
                Share the Countdown
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                Sharing features coming in Phase 4!
              </p>
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
      </div>

      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(0,48,135,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(255,215,0,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
    </main>
  )
}
