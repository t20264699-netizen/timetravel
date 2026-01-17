'use client'

import { useEffect, useRef } from 'react'

export function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!active) {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
      return
    }

    // Request wake lock to prevent screen sleep
    if ('wakeLock' in navigator) {
      navigator.wakeLock
        .request('screen')
        .then((wakeLock) => {
          wakeLockRef.current = wakeLock
          wakeLock.addEventListener('release', () => {
            wakeLockRef.current = null
          })
        })
        .catch(() => {
          // Wake lock not supported or failed
        })
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
    }
  }, [active])

  return wakeLockRef.current
}
