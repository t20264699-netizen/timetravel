'use client'

import { useState, useEffect } from 'react'
import { City } from '@/data/cities'
import { formatInTimeZone } from 'date-fns-tz'
import { useTimeFormat } from '@/hooks/useTimeFormat'

interface CityClockProps {
  city: City
}

export function CityClock({ city }: CityClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { is24Hour } = useTimeFormat()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const timeFormat = is24Hour ? 'HH:mm:ss' : 'h:mm:ss a'
  const dateFormat = 'EEEE, MMMM d, yyyy'

  const cityTime = formatInTimeZone(currentTime, city.timezone, timeFormat)
  const cityDate = formatInTimeZone(currentTime, city.timezone, dateFormat)

  return (
    <div className="dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
      <div className="text-8xl font-bold font-mono mb-4">{cityTime}</div>
      <div className="text-2xl text-gray-600 dark:text-gray-400 mb-2">{cityDate}</div>
      <div className="text-lg text-gray-500 dark:text-gray-500">
        {city.timezone}
      </div>
    </div>
  )
}
