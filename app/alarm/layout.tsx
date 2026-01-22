import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://timetravel-is48.vercel.app'

export const metadata: Metadata = {
  title: 'Alarm Clock',
  description: 'Free online alarm clock. Set alarms with custom sounds, repeat options, and test before setting. Works offline as PWA. No download required.',
  keywords: ['alarm clock', 'online alarm', 'set alarm', 'alarm timer', 'wake up alarm', 'free alarm clock'],
  openGraph: {
    title: 'Alarm Clock - TimeTravel',
    description: 'Free online alarm clock. Set alarms with custom sounds and repeat options.',
    url: `${siteUrl}/alarm`,
    type: 'website',
  },
  twitter: {
    title: 'Alarm Clock - TimeTravel',
    description: 'Free online alarm clock. Set alarms with custom sounds and repeat options.',
  },
  alternates: {
    canonical: `${siteUrl}/alarm`,
  },
}

export default function AlarmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
