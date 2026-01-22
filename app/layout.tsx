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
import { StructuredData } from '@/components/StructuredData'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://timetravel-is48.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TimeTravel - Online Clock, Alarm, Timer, Stopwatch & World Clock',
    template: '%s | TimeTravel'
  },
  description: 'Free online alarm clock, countdown timer, stopwatch, and world clock. Set alarms, track time, and view times across multiple cities. Works offline as PWA. No download required.',
  keywords: ['online clock', 'alarm clock', 'timer', 'stopwatch', 'world clock', 'time zone', 'countdown timer', 'digital clock', 'free clock', 'PWA clock'],
  authors: [{ name: 'TimeTravel' }],
  creator: 'TimeTravel',
  publisher: 'TimeTravel',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TimeTravel',
    title: 'TimeTravel - Online Clock & Timer Tools',
    description: 'Free online alarm clock, timer, stopwatch, and world clock. Set alarms, track time, and view times across multiple cities.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'TimeTravel Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeTravel - Online Clock & Timer Tools',
    description: 'Free online alarm clock, timer, stopwatch, and world clock',
    images: ['/icon-512.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TimeTravel',
  },
  verification: {
    // Add Google Search Console verification if available
    // google: 'your-verification-code',
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
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#000' }}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.style.backgroundColor = '#000';
                document.body.style.backgroundColor = '#000';
              })();
            `,
          }}
        />
      </head>
      <body className="bg-black dark:bg-black" style={{ backgroundColor: '#000' }}>
        <StructuredData type="WebSite" />
        <StructuredData type="WebApplication" />
        <StructuredData type="Organization" />
        <GA4Script />
        <AdSenseScript />
        <ThemeProvider>
          <Sidebar />
          <TopBar />
          <main className="ml-0 md:ml-[100px] mt-16 min-h-screen" style={{ backgroundColor: '#000' }}>
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
