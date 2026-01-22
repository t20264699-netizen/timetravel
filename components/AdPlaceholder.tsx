'use client'

import { useEffect, useRef, useState } from 'react'

interface AdPlaceholderProps {
  position: 'top' | 'bottom' | 'sidebar'
  className?: string
  adSlot?: string
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
}

// AdSense Publisher ID
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-7226526773277258'

// Ad slot IDs for different positions
const AD_SLOTS = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || '8791318607',
  bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || '8791318607',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
}

export function AdPlaceholder({ 
  position, 
  className = '',
  adSlot,
  adFormat = 'auto'
}: AdPlaceholderProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [adInitialized, setAdInitialized] = useState(false)

  useEffect(() => {
    if (!adRef.current || adInitialized || !ADSENSE_PUBLISHER_ID) {
      return
    }

    let observer: IntersectionObserver | null = null
    let timeout: NodeJS.Timeout | null = null

    // Wait for AdSense script to load
    const checkAndInitAd = () => {
      if (typeof window === 'undefined') return

      const adsbygoogle = (window as any).adsbygoogle
      if (!adsbygoogle) {
        // Script not loaded yet, try again
        setTimeout(checkAndInitAd, 100)
        return
      }

      // Find the ins element inside our container
      const insElement = adRef.current?.querySelector('ins.adsbygoogle') as HTMLElement & { adsbygoogle?: boolean }
      
      if (!insElement) {
        return
      }

      // Check if already initialized
      if (insElement.adsbygoogle) {
        setAdInitialized(true)
        return
      }

      // Initialize ad function
      const initAd = () => {
        if (insElement.adsbygoogle || adInitialized) {
          return
        }
        try {
          // Push ad to AdSense
          ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
          insElement.adsbygoogle = true
          setAdInitialized(true)
          console.log(`AdSense ad initialized for position: ${position}, slot: ${adSlot || AD_SLOTS[position]}`)
        } catch (e) {
          console.error('AdSense initialization error:', e)
        }
      }

      // Use IntersectionObserver to lazy load ads
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !adInitialized && insElement && !insElement.adsbygoogle) {
              initAd()
              if (observer) {
                observer.disconnect()
                observer = null
              }
            }
          })
        },
        { rootMargin: '50px' }
      )

      observer.observe(insElement)

      // Fallback: initialize after a delay if still not visible
      timeout = setTimeout(() => {
        if (!adInitialized && insElement && !insElement.adsbygoogle) {
          try {
            ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
            insElement.adsbygoogle = true
            setAdInitialized(true)
            console.log(`AdSense ad initialized (fallback) for position: ${position}`)
          } catch (e) {
            console.error('AdSense initialization error (fallback):', e)
          }
          if (observer) {
            observer.disconnect()
            observer = null
          }
        }
      }, 2000)
    }

    // Start checking for script
    checkAndInitAd()

    return () => {
      if (observer) {
        observer.disconnect()
      }
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [adInitialized, position, adSlot])

  const adStyles = {
    top: 'w-full min-h-[100px] md:min-h-[90px]',
    bottom: 'w-full min-h-[100px] md:min-h-[90px]',
    sidebar: 'w-full min-h-[250px]',
  }

  const slotId = adSlot || AD_SLOTS[position]

  // If no AdSense ID is configured, show placeholder
  if (!ADSENSE_PUBLISHER_ID) {
    return (
      <div
        className={`${adStyles[position]} ${className} bg-[#383737] rounded-lg flex items-center justify-center border-2 border-dashed border-[#484747]`}
      >
        <div className="text-center text-[#9d9d9d] text-sm">
          <div className="text-xs mb-1">Advertisement</div>
          <div className="text-xs">AdSense Placeholder</div>
          <div className="text-xs mt-1">320x100</div>
          <div className="text-xs mt-2 text-[#777]">Configure NEXT_PUBLIC_ADSENSE_PUBLISHER_ID</div>
        </div>
      </div>
    )
  }

  if (!slotId) {
    return (
      <div
        className={`${adStyles[position]} ${className} bg-[#383737] rounded-lg flex items-center justify-center border-2 border-dashed border-[#484747]`}
      >
        <div className="text-center text-[#9d9d9d] text-sm">
          <div className="text-xs mb-1">Advertisement</div>
          <div className="text-xs">No ad slot configured for {position}</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={adRef} className={`${className} flex justify-center items-center my-2`}>
      <ins
        className={`adsbygoogle ${adStyles[position]}`}
        style={{ 
          display: 'block', 
          textAlign: 'center',
          minHeight: position === 'sidebar' ? '250px' : '100px',
          width: '100%',
          maxWidth: position === 'sidebar' ? '300px' : '100%',
        }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}
