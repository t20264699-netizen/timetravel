import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://timetravel-is48.vercel.app'

export const metadata: Metadata = {
  title: 'Stopwatch',
  description: 'Free online stopwatch with lap timer. Track time accurately with lap history. Works offline as PWA. No download required.',
  keywords: ['stopwatch', 'lap timer', 'online stopwatch', 'timer stopwatch', 'sports timer', 'free stopwatch'],
  openGraph: {
    title: 'Stopwatch - TimeTravel',
    description: 'Free online stopwatch with lap timer. Track time accurately with lap history.',
    url: `${siteUrl}/stopwatch`,
    type: 'website',
  },
  twitter: {
    title: 'Stopwatch - TimeTravel',
    description: 'Free online stopwatch with lap timer. Track time accurately with lap history.',
  },
  alternates: {
    canonical: `${siteUrl}/stopwatch`,
  },
}

export default function StopwatchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
