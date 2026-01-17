import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { CookieConsent } from '@/components/CookieConsent'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { GA4Script } from '@/components/GA4Script'
import { AdSenseScript } from '@/components/AdSenseScript'
import { Footer } from '@/components/Footer'
import { ShareSection } from '@/components/ShareSection'

export const metadata: Metadata = {
  title: 'Online Clock - Alarm Clock, Timer, Stopwatch & World Clock - TimeTravel',
  description: 'Free online alarm clock, countdown timer, stopwatch, and world clock. Set alarms, track time, and view times across multiple cities. Works offline as PWA.',
  keywords: 'online clock, alarm clock, timer, stopwatch, world clock, time zone, countdown',
  authors: [{ name: 'TimeTravel' }],
  openGraph: {
    title: 'TimeTravel - Online Clock & Timer Tools',
    description: 'Free online alarm clock, timer, stopwatch, and world clock',
    type: 'website',
    locale: 'en_US',
    siteName: 'TimeTravel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeTravel - Online Clock & Timer Tools',
    description: 'Free online alarm clock, timer, stopwatch, and world clock',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TimeTravel',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-black dark:bg-black">
        <GA4Script />
        <AdSenseScript />
        <ThemeProvider>
          <Sidebar />
          <TopBar />
          <main className="ml-0 md:ml-[100px] mt-16 min-h-screen">
            {children}
          </main>
          <div className="ml-0 md:ml-[100px] px-4 py-4">
            <ShareSection />
          </div>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
