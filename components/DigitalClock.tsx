'use client'

import { format } from 'date-fns'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { useEffect, useState } from 'react'

interface DigitalClockProps {
  time: Date
  showDate?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fontSize?: number
  dateFontSize?: number
}

// Color template: #FF9500 #eee #d32f2f #388E3C #1976D2
const COLOR_TEMPLATE = {
  0: '#eee',      // White/Light gray
  1: '#FF9500',   // Orange
  2: '#d32f2f',   // Red
  3: '#388E3C',   // Green
  4: '#1976D2',   // Blue (default)
}

export function DigitalClock({ time, showDate: propShowDate = true, size = 'lg', className = '', fontSize, dateFontSize }: DigitalClockProps) {
  const { is24Hour } = useTimeFormat()
  const [digitColor, setDigitColor] = useState<string>(COLOR_TEMPLATE[4])
  const [showDate, setShowDate] = useState(propShowDate)
  const [timeFormatState, setTimeFormatState] = useState(is24Hour)

  useEffect(() => {
    // Sync with hook state
    setTimeFormatState(is24Hour)
  }, [is24Hour])

  useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem('digit-color')
    if (savedColor && Object.values(COLOR_TEMPLATE).includes(savedColor)) {
      setDigitColor(savedColor)
    } else {
      // Set default if none saved
      const defaultColor = COLOR_TEMPLATE[4]
      setDigitColor(defaultColor)
    }

    // Load saved showDate from localStorage
    const savedShowDate = localStorage.getItem('show-date')
    if (savedShowDate !== null) {
      setShowDate(savedShowDate === 'true')
    } else {
      setShowDate(propShowDate)
    }

    // Listen for color changes from SettingsSidebar
    const handleColorChange = (event: CustomEvent) => {
      if (event.detail && event.detail.color) {
        setDigitColor(event.detail.color)
      }
    }

    // Listen for showDate changes from SettingsSidebar
    const handleShowDateChange = (event: CustomEvent) => {
      if (event.detail && event.detail.showDate !== undefined) {
        setShowDate(event.detail.showDate)
      }
    }

    // Listen for time format changes
    const handleTimeFormatChange = (event: CustomEvent) => {
      if (event.detail && event.detail.is24Hour !== undefined) {
        setTimeFormatState(event.detail.is24Hour)
      }
    }

    window.addEventListener('color-changed', handleColorChange as EventListener)
    window.addEventListener('show-date-changed', handleShowDateChange as EventListener)
    window.addEventListener('time-format-changed', handleTimeFormatChange as EventListener)
    return () => {
      window.removeEventListener('color-changed', handleColorChange as EventListener)
      window.removeEventListener('show-date-changed', handleShowDateChange as EventListener)
      window.removeEventListener('time-format-changed', handleTimeFormatChange as EventListener)
    }
  }, [propShowDate])

  const timeFormat = timeFormatState ? 'HH:mm:ss' : 'h:mm:ss a'
  const dateFormat = 'EEE - MMM d, yyyy'

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl',
  }

  // Split time and AM/PM for better styling
  const formattedTime = format(time, timeFormatState ? 'HH:mm:ss' : 'h:mm:ss')
  const period = timeFormatState ? '' : format(time, 'a')

  // Format date to match: "Tue  -  Jan 13, 2026" (with double spaces around dash)
  const formattedDate = format(time, dateFormat)
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .replace(/\s-\s/g, '  -  ') // Replace single spaces around dash with double spaces

  return (
    <div style={{ position: 'relative', width: '100%', textAlign: 'center', transition: 'none', animation: 'none', margin: '0', padding: '0' }}>
      {/* Time display matching: <div id="pnl-time"> */}
      <div
        id="pnl-time"
        style={{
          display: 'block',
          position: 'relative',
          width: 'auto',
          height: 'auto',
          margin: '0 auto',
          textAlign: 'center',
          transition: 'none',
          animation: 'none'
        }}
      >
        <span
          id="lbl-time"
          className="colored digit text-nowrap font-digit"
          style={{
            fontSize: fontSize ? `${fontSize}px` : (size === 'xl' ? '130px' : size === 'lg' ? '80px' : undefined),
            lineHeight: '1.1',
            fontWeight: 'normal',
            letterSpacing: '0.05em',
            transition: 'none',
            animation: 'none'
          }}
        >
          {formattedTime}
        </span>
        {period && (
          <span
            id="lbl-noon"
            className="colored digit text-nowrap font-digit"
            style={{
              fontSize: fontSize ? `${Math.round(fontSize * 0.77)}px` : (size === 'xl' ? '100px' : size === 'lg' ? '60px' : undefined),
              transition: 'none',
              animation: 'none'
            }}
          >
            &nbsp;{period}
          </span>
        )}
      </div>
      {/* Date display matching: <div id="lbl-date"> */}
      {showDate && (
        <div
          id="lbl-date"
          className="colored digit-text text-center font-digit-text"
          style={{
            display: 'block',
            position: 'relative',
            fontSize: dateFontSize ? `${dateFontSize}px` : (fontSize ? `${Math.round(fontSize * 0.25)}px` : '33px'),
            width: '100%',
            marginTop: '0px',
            marginBottom: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            fontWeight: 'normal',
            letterSpacing: '-0.1em',
            transition: 'none',
            animation: 'none'
          }}
        >
          {formattedDate}
        </div>
      )}
    </div>
  )
}
