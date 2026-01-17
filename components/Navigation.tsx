'use client'

import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const defaultAlarmHash = '#time=07%3A00&title=Alarm%25207%253A00%2520AM&enabled=0&sound=childhood&loop=0'

// Generate hash from alarm settings
const generateAlarmHash = (settings: any) => {
  if (!settings || !settings.time) return defaultAlarmHash

  const params = new URLSearchParams()
  params.set('time', settings.time)
  if (settings.title) params.set('title', encodeURIComponent(settings.title))
  params.set('enabled', settings.isActive ? '1' : '0')
  if (settings.sound) params.set('sound', settings.sound)
  params.set('loop', settings.loop ? '1' : '0')

  return `#${params.toString()}`
}

export function Navigation() {
  const { theme, toggleTheme } = useTheme()
  const { is24Hour, toggleFormat } = useTimeFormat()
  const pathname = usePathname()
  const [alarmHash, setAlarmHash] = useState(defaultAlarmHash)

  useEffect(() => {
    // Load alarm settings from localStorage
    const loadAlarmHash = () => {
      if (typeof window === 'undefined') return

      const saved = localStorage.getItem('alarm-settings-main')
      if (saved) {
        try {
          const settings = JSON.parse(saved)
          const hash = generateAlarmHash(settings)
          setAlarmHash(hash)
        } catch (e) {
          // Use default if parsing fails
          setAlarmHash(defaultAlarmHash)
        }
      }
    }

    loadAlarmHash()

    // Listen for storage changes (when alarm is updated on another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'alarm-settings-main') {
        loadAlarmHash()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events (when alarm is updated on same page)
    const handleAlarmUpdate = () => {
      loadAlarmHash()
    }

    window.addEventListener('alarm-updated', handleAlarmUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('alarm-updated', handleAlarmUpdate)
    }
  }, [])

  const navLinks = [
    { href: '/alarm', label: 'Home', isAlarm: true },
    { href: '/alarm', label: 'Alarm', isAlarm: true },
    { href: '/timer', label: 'Timer', isAlarm: false },
    { href: '/stopwatch', label: 'Stopwatch', isAlarm: false },
    { href: '/world-clock', label: 'World Clock', isAlarm: false },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#484747] border-b border-[#383737] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={`/alarm${alarmHash}`} className="text-xl font-bold text-primary">
            TimeTravel
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              {navLinks.map((link) => {
                // Generate href for alarm items, use original for others
                const href = link.isAlarm ? `${link.href}${alarmHash}` : link.href

                // Check if active - for alarm links, check if pathname is /alarm
                const isActive = pathname === link.href ||
                  (link.href === '/alarm' && pathname === '/alarm')
                return (
                  <Link
                    key={link.href}
                    href={href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                      ? 'bg-[#525050] text-white'
                      : 'text-[#9d9d9d] hover:text-white hover:bg-[#525050]'
                      }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <button
              onClick={toggleFormat}
              className="px-3 py-2 text-sm font-medium rounded-md text-[#9d9d9d] hover:text-white hover:bg-[#525050] transition-colors"
              aria-label="Toggle time format"
              title={is24Hour ? 'Switch to 12-hour' : 'Switch to 24-hour'}
            >
              {is24Hour ? '24h' : '12h'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-[#9d9d9d] hover:text-white hover:bg-[#525050] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
