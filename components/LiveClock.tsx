'use client'

import { useEffect, useState } from 'react'
import { DigitalClock } from './DigitalClock'

export function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <DigitalClock time={time} />
}
