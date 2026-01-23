'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

// GA4 Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-JWHGV4V93V'

export function GA4Script() {
  const [loadGA, setLoadGA] = useState(false)

  useEffect(() => {
    // Check cookie consent - only load GA4 if consent is given
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent')
      if (consent === 'accepted' && GA_MEASUREMENT_ID) {
        setLoadGA(true)
        // Initialize GA4 consent
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ; (window as any).gtag('consent', 'update', {
            analytics_storage: 'granted',
          })
        }
      }
    }

    // Check immediately
    checkConsent()

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        checkConsent()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events from CookieConsent component
    const handleConsentUpdate = () => {
      checkConsent()
    }
    window.addEventListener('cookie-consent-updated', handleConsentUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate)
    }
  }, [])

  if (!GA_MEASUREMENT_ID || !loadGA) {
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
          gtag('consent', 'update', {
            analytics_storage: 'granted',
          });
        `}
      </Script>
    </>
  )
}
