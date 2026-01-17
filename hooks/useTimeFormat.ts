'use client'

import { useState, useEffect } from 'react'

export function useTimeFormat() {
  const [is24Hour, setIs24Hour] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('time-format')
    if (saved) {
      setIs24Hour(saved === '24')
    } else {
      // Set default to 12-hour format if nothing saved
      setIs24Hour(false)
      localStorage.setItem('time-format', '12')
    }
  }, [])

  const toggleFormat = () => {
    const newFormat = !is24Hour
    setIs24Hour(newFormat)
    localStorage.setItem('time-format', newFormat ? '24' : '12')
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('time-format-changed', { detail: { is24Hour: newFormat } }))
  }

  return { is24Hour, toggleFormat }
}
