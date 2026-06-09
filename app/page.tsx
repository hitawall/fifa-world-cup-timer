import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SoundToggle } from '@/components/ui/SoundToggle'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header controls */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <SoundToggle />
        <ThemeToggle />
      </div>

      {/* Placeholder — replaced in Phase 2 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-fifa-gold)' }}>
          FIFA World Cup 2026
        </h1>
        <p className="text-lg" style={{ color: 'var(--muted)' }}>
          Countdown coming soon ⚽
        </p>
      </div>
    </main>
  )
}
