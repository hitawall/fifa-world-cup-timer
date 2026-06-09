import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { SoundProvider } from '@/components/ui/SoundProvider'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wc26timer.com'
  ),
  title: 'FIFA World Cup 2026 Countdown',
  description:
    'Join thousands of fans counting down to the greatest show on Earth. FIFA World Cup 2026 — USA, Canada & Mexico.',
  keywords: ['FIFA', 'World Cup', '2026', 'countdown', 'soccer', 'football'],
  openGraph: {
    title: 'FIFA World Cup 2026 Countdown',
    description: 'The World Cup is almost here. Watch the countdown live.',
    url: 'https://wc26timer.com',
    siteName: 'WC26 Countdown',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'FIFA World Cup 2026 Countdown' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA World Cup 2026 Countdown',
    description: 'The World Cup is almost here. Watch the countdown live.',
    images: ['/api/og'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WC26 Timer',
  },
}

export const viewport: Viewport = {
  themeColor: '#003087',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <SoundProvider>{children}</SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
