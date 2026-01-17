'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// GA4 Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-JWHGV4V93V'

export function GA4Script() {
  useEffect(() => {
    // Check cookie consent
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'accepted' && GA_MEASUREMENT_ID) {
      // Initialize GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ; (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        })
      }
    }
  }, [])

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
          // Default to denied, update when consent is given
          gtag('consent', 'default', {
            analytics_storage: 'denied',
          });
        `}
      </Script>
    </>
  )
}
