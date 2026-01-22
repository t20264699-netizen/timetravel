'use client'

import { useEffect } from 'react'

interface StructuredDataProps {
  type: 'WebSite' | 'WebApplication' | 'Organization'
  data?: Record<string, any>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://timetravel-is48.vercel.app'

    let structuredData: any = {}

    if (type === 'WebSite') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TimeTravel',
        url: siteUrl,
        description: 'Free online alarm clock, countdown timer, stopwatch, and world clock. Set alarms, track time, and view times across multiple cities.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        ...data,
      }
    } else if (type === 'WebApplication') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'TimeTravel',
        url: siteUrl,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: 'Free online alarm clock, countdown timer, stopwatch, and world clock. Works offline as PWA.',
        ...data,
      }
    } else if (type === 'Organization') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TimeTravel',
        url: siteUrl,
        logo: `${siteUrl}/icon-512.png`,
        ...data,
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = `structured-data-${type}`
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById(`structured-data-${type}`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [type, data])

  return null
}
