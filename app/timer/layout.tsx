import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://timetravel-is48.vercel.app'

export const metadata: Metadata = {
  title: 'Timer',
  description: 'Free online countdown timer. Set custom timers for cooking, workouts, meetings, and more. Works offline as PWA. No download required.',
  keywords: ['timer', 'countdown timer', 'online timer', 'stopwatch timer', 'cooking timer', 'workout timer', 'free timer'],
  openGraph: {
    title: 'Timer - TimeTravel',
    description: 'Free online countdown timer. Set custom timers for cooking, workouts, meetings, and more.',
    url: `${siteUrl}/timer`,
    type: 'website',
  },
  twitter: {
    title: 'Timer - TimeTravel',
    description: 'Free online countdown timer. Set custom timers for cooking, workouts, meetings, and more.',
  },
  alternates: {
    canonical: `${siteUrl}/timer`,
  },
}

export default function TimerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
