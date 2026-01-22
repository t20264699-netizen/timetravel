import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://timetravel-is48.vercel.app'

export const metadata: Metadata = {
  title: 'World Clock',
  description: 'Free world clock showing time in multiple cities and timezones. Compare times across different locations. Works offline as PWA.',
  keywords: ['world clock', 'time zones', 'international time', 'time converter', 'multiple timezones', 'global clock'],
  openGraph: {
    title: 'World Clock - TimeTravel',
    description: 'Free world clock showing time in multiple cities and timezones. Compare times across different locations.',
    url: `${siteUrl}/world-clock`,
    type: 'website',
  },
  twitter: {
    title: 'World Clock - TimeTravel',
    description: 'Free world clock showing time in multiple cities and timezones. Compare times across different locations.',
  },
  alternates: {
    canonical: `${siteUrl}/world-clock`,
  },
}

export default function WorldClockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
