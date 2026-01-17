// Wake Lock API type definitions
interface WakeLockSentinel extends EventTarget {
  readonly released: boolean
  readonly type: 'screen'
  release(): Promise<void>
}

interface WakeLock {
  request(type: 'screen'): Promise<WakeLockSentinel>
}

interface Navigator {
  wakeLock?: WakeLock
}

interface Window {
  adsbygoogle?: any[]
  gtag?: (...args: any[]) => void
  dataLayer?: any[]
}
