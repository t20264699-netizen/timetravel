'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to alarm page with default hash parameters
    // Using exact format: time=07%3A00&title=Alarm%25207%253A00%2520AM&enabled=0&sound=childhood&loop=0
    const defaultTime = '07:00'
    const defaultTitle = 'Alarm 7:00 AM'
    const params = new URLSearchParams()
    params.set('time', defaultTime)
    // Encode title once - URLSearchParams will encode it again, resulting in double encoding
    params.set('title', encodeURIComponent(defaultTitle))
    params.set('enabled', '0')
    params.set('sound', 'childhood')
    params.set('loop', '0')
    // URLSearchParams.toString() will encode the already-encoded title value, resulting in double encoding
    router.replace(`/alarm#${params.toString()}`)
  }, [router])

  return null
}
