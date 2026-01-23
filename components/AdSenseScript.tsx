'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

// AdSense Publisher ID
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-7226526773277258'

export function AdSenseScript() {
  const [loadAdSense, setLoadAdSense] = useState(false)

  useEffect(() => {
    // Check cookie consent - only load AdSense if consent is given
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent')
      if (consent === 'accepted' && ADSENSE_PUBLISHER_ID) {
        setLoadAdSense(true)
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

  if (!ADSENSE_PUBLISHER_ID || !loadAdSense) {
    return null
  }

  return (
    <>
      {/* AdSense script in head for verification */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      />
      {/* Initialize adsbygoogle array */}
      <Script
        id="adsbygoogle-init-array"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && !window.adsbygoogle) {
              window.adsbygoogle = [];
            }
          `,
        }}
      />
    </>
  )
}
