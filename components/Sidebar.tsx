'use client'

import Link from 'next/link'
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

const navItems = [
  { href: '/alarm', label: 'Alarm\u00A0Clock', iconClass: 'ci-alarm', isAlarm: true },
  { href: '/timer', label: 'Timer', iconClass: 'ci-timer', isAlarm: false },
  { href: '/stopwatch', label: 'Stopwatch', iconClass: 'ci-stopwatch', isAlarm: false },
  { href: '/world-clock', label: 'Time', iconClass: 'ci-clock', isAlarm: false },
]

export function Sidebar() {
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

  useEffect(() => {
    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('.am-left-sidebar')
      const target = e.target as HTMLElement
      if (sidebar && !sidebar.contains(target) && !target.closest('header')) {
        if (window.innerWidth <= 767) {
          document.body.classList.remove('sidebar-open')
        }
      }
    }

    if (window.innerWidth <= 767) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="am-left-sidebar">
      <div className="am-scroller nano">
        <div className="content nano-content" style={{ marginRight: 0 }}>
          <div className="am-logo"></div>
          <ul className="sidebar-elements">
            {navItems.map((item) => {
              // Generate href for alarm items, use original for others
              const href = item.isAlarm ? `${item.href}${alarmHash}` : item.href

              // Check if active - be very specific to avoid cross-matching
              let isActive = false
              if (item.href === '/alarm') {
                isActive = pathname === '/alarm' || pathname.startsWith('/alarm')
              } else if (item.href === '/timer') {
                // Match /timer or paths starting with /timer/ (holiday pages)
                isActive = pathname === '/timer' || pathname?.startsWith('/timer/')
              } else if (item.href === '/stopwatch') {
                isActive = pathname === '/stopwatch'
              } else if (item.href === '/world-clock') {
                // Only match /world-clock or paths starting with /time (but not /timer or /timer/)
                isActive = pathname === '/world-clock' || (pathname?.startsWith('/time') && !pathname.startsWith('/timer'))
              }

              return (
                <li key={item.href} className={isActive ? 'active' : 'parent'}>
                  <Link href={href} id={item.isAlarm ? 'link-alarm' : item.href === '/timer' ? 'link-timer' : undefined}>
                    <i className={`icon ${item.iconClass}`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="nano-pane" style={{ display: 'none' }}>
          <div className="nano-slider" style={{ height: '865px', transform: 'translate(0px, 0px)' }}></div>
        </div>
      </div>
    </div>
  )
}
