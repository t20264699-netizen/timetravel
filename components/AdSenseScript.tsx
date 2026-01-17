'use client'

import Script from 'next/script'

// AdSense Publisher ID
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-7226526773277258'

export function AdSenseScript() {
  if (!ADSENSE_PUBLISHER_ID) {
    return null
  }

  return (
    <>
      {/* AdSense script in head for verification */}
      <Script
        id="adsbygoogle-init"
        strategy="beforeInteractive"
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
