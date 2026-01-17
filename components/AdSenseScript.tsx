'use client'

import Script from 'next/script'

// AdSense Publisher ID
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-7226526773277258'

export function AdSenseScript() {
  if (!ADSENSE_PUBLISHER_ID) {
    return null
  }

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      onError={(e) => {
        console.error('AdSense script failed to load', e)
      }}
      onLoad={() => {
        // Script loaded successfully
        if (typeof window !== 'undefined') {
          console.log('AdSense script loaded successfully')
          // Initialize window.adsbygoogle array if it doesn't exist
          if (!(window as any).adsbygoogle) {
            ;(window as any).adsbygoogle = []
          }
        }
      }}
    />
  )
}
