'use client'

import { useEffect, useState } from 'react'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
    // Update GA4 consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      })
    }
  }

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#484747] border-t border-[#383737] shadow-lg p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-white">
              We use cookies to improve your experience and analyze site traffic. 
              By continuing, you agree to our use of cookies.{' '}
              <a href="/privacy" className="text-primary hover:text-primary-hover underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={rejectCookies}
              className="px-4 py-2 text-sm font-medium text-[#9d9d9d] hover:text-white hover:bg-[#525050] rounded-md transition-colors"
            >
              Reject
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-hover rounded-md transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
