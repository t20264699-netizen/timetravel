'use client'

import { useState, useEffect } from 'react'
import { cities, City } from '@/data/cities'
import { formatInTimeZone } from 'date-fns-tz'
import { useTimeFormat } from '@/hooks/useTimeFormat'

export default function WorldClockEmbed() {
  const [selectedCities, setSelectedCities] = useState<City[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const { is24Hour } = useTimeFormat()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const addCity = (city: City) => {
    if (!selectedCities.find((c) => c.slug === city.slug)) {
      setSelectedCities([...selectedCities, city])
    }
  }

  const timeFormat = is24Hour ? 'HH:mm:ss' : 'h:mm:ss a'

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">World Clock</h2>
        <div className="mb-4">
          <select
            onChange={(e) => {
              const city = cities.find((c) => c.slug === e.target.value)
              if (city) addCity(city)
            }}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select a city...</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}, {city.country}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {selectedCities.map((city) => {
            const cityTime = formatInTimeZone(currentTime, city.timezone, timeFormat)
            return (
              <div
                key={city.slug}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{city.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {city.country}
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold">{cityTime}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
