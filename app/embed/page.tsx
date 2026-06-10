'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CountdownTimer } from '@/components/countdown/CountdownTimer'
import { ThemeProvider, useTheme } from '@/components/ui/ThemeProvider'
import { SoundProvider } from '@/components/ui/SoundProvider'

function EmbedContent() {
  const params = useSearchParams()
  const theme = params.get('theme') as 'dark' | 'light' | null
  const { theme: currentTheme } = useTheme()

  useEffect(() => {
    // Apply theme from query param
    if (theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }

    // BroadcastChannel for same-origin sync
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel('wc26_countdown')
    } catch {
      // Not supported
    }

    // Listen for theme updates from parent via PostMessage
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'WC26_SET_THEME') {
        document.documentElement.classList.toggle('dark', e.data.theme === 'dark')
      }
    }
    window.addEventListener('message', onMessage)

    return () => {
      bc?.close()
      window.removeEventListener('message', onMessage)
    }
  }, [theme, currentTheme])

  return (
    <main
      className="flex items-center justify-center min-h-screen p-4"
      style={{ background: 'var(--bg)' }}
    >
      <CountdownTimer compact={true} />
    </main>
  )
}

export default function EmbedPage() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <Suspense>
          <EmbedContent />
        </Suspense>
      </SoundProvider>
    </ThemeProvider>
  )
}
