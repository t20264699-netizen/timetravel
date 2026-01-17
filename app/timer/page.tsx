'use client'

import { useState, useEffect, useRef } from 'react'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { EditTimerModal } from '@/components/EditTimerModal'
import { useWakeLock } from '@/hooks/useWakeLock'
import { playAlarmSound } from '@/utils/audio'
import { differenceInDays, parse, isAfter, addYears } from 'date-fns'
import { holidays } from '@/data/holidays'
import Link from 'next/link'

// Holidays list component
function HolidaysList() {
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000 * 60 * 60) // Update every hour
    return () => clearInterval(interval)
  }, [])


  const getDaysRemaining = (holidayDate: string) => {
    let targetDate = parse(holidayDate, 'yyyy-MM-dd', new Date())
    // If the holiday has passed this year, use next year
    if (isAfter(currentDate, targetDate)) {
      targetDate = addYears(targetDate, 1)
    }
    return differenceInDays(targetDate, currentDate)
  }

  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date())
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  // Generate URL slug from seconds (e.g., 20 -> "20-seconds", 60 -> "1-minute")
  const generateTimerSlug = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}-${seconds === 1 ? 'second' : 'seconds'}`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return `${minutes}-${minutes === 1 ? 'minute' : 'minutes'}`
    } else {
      const hours = Math.floor(seconds / 3600)
      return `${hours}-${hours === 1 ? 'hour' : 'hours'}`
    }
  }

  const getHolidayUrl = (holiday: { name: string; date: string }): string | null => {
    let targetDate = parse(holiday.date, 'yyyy-MM-dd', new Date())
    if (isAfter(currentDate, targetDate)) {
      targetDate = addYears(targetDate, 1)
    }
    const diffMs = targetDate.getTime() - currentDate.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    if (diffSeconds > 0) {
      return `/set-timer-for-${generateTimerSlug(diffSeconds)}`
    }
    return null
  }

  // Generate slug from holiday name (e.g., "Halloween" -> "halloween", "New Year" -> "new-year")
  const getHolidaySlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  return (
    <div>
      {holidays.map((holiday, index) => {
        const daysRemaining = getDaysRemaining(holiday.date)
        const holidaySlug = getHolidaySlug(holiday.name)
        return (
          <Link
            key={index}
            href={`/timer/${holidaySlug}`}
            className="flex justify-between items-center py-2 hover:bg-[#f0f0f0] dark:hover:bg-[#1a1a1a] cursor-pointer block"
            style={{ borderRadius: 0, textDecoration: 'none' }}
          >
            <span className="colored">{holiday.name}</span>
            <span className="text-[#555] dark:text-[#eee]">
              {formatDate(holiday.date)}, {daysRemaining} days
            </span>
          </Link>
        )
      })}
    </div>
  )
}

// Preset timers organized by columns (2 columns for timer page)
const presetTimersColumn1 = [ // Minutes
  { label: '1 Minute Timer', seconds: 60 },
  { label: '3 Minute Timer', seconds: 180 },
  { label: '5 Minute Timer', seconds: 300 },
  { label: '10 Minute Timer', seconds: 600 },
  { label: '15 Minute Timer', seconds: 900 },
  { label: '20 Minute Timer', seconds: 1200 },
  { label: '30 Minute Timer', seconds: 1800 },
  { label: '40 Minute Timer', seconds: 2400 },
  { label: '45 Minute Timer', seconds: 2700 },
  { label: '60 Minute Timer', seconds: 3600 },
]

const presetTimersColumn2 = [ // Seconds and Hours
  { label: '10 Second Timer', seconds: 10 },
  { label: '20 Second Timer', seconds: 20 },
  { label: '30 Second Timer', seconds: 30 },
  { label: '45 Second Timer', seconds: 45 },
  { label: '60 Second Timer', seconds: 60 },
  { label: '90 Second Timer', seconds: 90 },
  { label: '1 Hour Timer', seconds: 3600 },
  { label: '2 Hour Timer', seconds: 7200 },
  { label: '4 Hour Timer', seconds: 14400 },
  { label: '8 Hour Timer', seconds: 28800 },
]

// Timer Complete Dialog Component
function TimerCompleteDialog({ 
  isOpen, 
  onClose, 
  onRestart, 
  timerDuration 
}: { 
  isOpen: boolean
  onClose: () => void
  onRestart: () => void
  timerDuration: number
}) {
  if (!isOpen) return null

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#484747] w-full" style={{ borderRadius: 0, maxWidth: '500px' }}>
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">Timer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="text-center p-6">
            <div className="i-circle text-danger mb-4" style={{ pointerEvents: 'none' }}>
              <span className="icon ci-timer"></span>
            </div>
            <h3 className="text-white text-4xl font-bold mb-2">{formatTime(timerDuration)}</h3>
          </div>
        </div>
        <div className="border-t border-gray-600 p-4 flex gap-2 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-[#388E3C] text-white hover:bg-[#4aae71]"
            style={{ borderRadius: 0 }}
          >
            Restart
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#EF6262] text-white hover:bg-[#f17979]"
            style={{ borderRadius: 0 }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TimerPage() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [timerDuration, setTimerDuration] = useState(0) // Store original timer duration
  const [timerTitle, setTimerTitle] = useState('') // Store timer title/label
  const [selectedHoliday, setSelectedHoliday] = useState<{ name: string; date: string } | null>(null)
  const [holidayTimeLeft, setHolidayTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [recentlyUsed, setRecentlyUsed] = useState<Array<{ label: string; seconds: number }>>([])
  const [fontSize, setFontSize] = useState(128)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useWakeLock(isRunning)

  useEffect(() => {
    // Set page title - will be updated when timer is selected
    if (timerTitle) {
      document.title = `${timerTitle} - Online Timer - Countdown`
    } else {
      document.title = 'Timer - Online Timer - Countdown'
    }
  }, [timerTitle])

  useEffect(() => {
    
    const saved = localStorage.getItem('timer-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        setRecentlyUsed(settings.recentlyUsed || [])
      } catch (e) {
        console.error('Failed to load timer settings', e)
      }
    }

    // Load saved font size
    const savedFontSize = localStorage.getItem('clock-font-size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10))
    }
  }, [])

  // Update holiday countdown every second
  useEffect(() => {
    if (!selectedHoliday) return
    
    const updateHolidayCountdown = () => {
      let targetDate = parse(selectedHoliday.date, 'yyyy-MM-dd', new Date())
      const now = new Date()
      
      // If the holiday has passed this year, use next year
      if (isAfter(now, targetDate)) {
        targetDate = addYears(targetDate, 1)
      }
      
      const diffMs = targetDate.getTime() - now.getTime()
      if (diffMs <= 0) {
        setHolidayTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
      
      setHolidayTimeLeft({ days, hours, minutes, seconds })
    }
    
    updateHolidayCountdown()
    const interval = setInterval(updateHolidayCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [selectedHoliday])

  useEffect(() => {
    if (isRunning && !isPaused && !selectedHoliday) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            playAlarmSound()
            setShowCompleteDialog(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, selectedHoliday])

  const saveRecentlyUsed = (timer: { label: string; seconds: number }) => {
    const updated = recentlyUsed.filter(t => t.label !== timer.label)
    updated.unshift(timer)
    const newRecentlyUsed = updated.slice(0, 10)
    setRecentlyUsed(newRecentlyUsed)
    localStorage.setItem('timer-settings', JSON.stringify({ recentlyUsed: newRecentlyUsed }))
  }

  const handleStart = (hours: number, minutes: number, seconds: number) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    if (totalSeconds === 0) return
    setTimeLeft(totalSeconds)
    setTimerDuration(totalSeconds) // Store original duration
    // Generate title based on time
    let title = ''
    if (hours > 0) {
      title = `${hours} Hour${hours > 1 ? 's' : ''} Timer`
    } else if (minutes > 0) {
      title = `${minutes} Minute${minutes > 1 ? 's' : ''} Timer`
    } else if (seconds > 0) {
      title = `${seconds} Second${seconds > 1 ? 's' : ''} Timer`
    }
    setTimerTitle(title)
    setIsRunning(true)
    setIsPaused(false)
    saveRecentlyUsed({ label: `${hours}h ${minutes}m ${seconds}s`, seconds: totalSeconds })
  }

  // Generate URL slug from seconds (e.g., 20 -> "20-seconds", 60 -> "1-minute")
  const generateTimerSlug = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}-${seconds === 1 ? 'second' : 'seconds'}`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return `${minutes}-${minutes === 1 ? 'minute' : 'minutes'}`
    } else {
      const hours = Math.floor(seconds / 3600)
      return `${hours}-${hours === 1 ? 'hour' : 'hours'}`
    }
  }

  const handlePresetClick = (timer: { label: string; seconds: number }) => {
    setTimeLeft(timer.seconds)
    setTimerDuration(timer.seconds) // Store original duration
    setTimerTitle(timer.label) // Use the preset timer label
    setIsRunning(false) // Don't start automatically
    setIsPaused(false)
    saveRecentlyUsed(timer)
  }

  const handleHolidayClick = (seconds: number, holidayName?: string, holidayDate?: string) => {
    console.log('handleHolidayClick called:', { seconds, holidayName, holidayDate })
    if (holidayName && holidayDate) {
      // Set up holiday countdown
      console.log('Setting up holiday countdown for:', holidayName)
      setSelectedHoliday({ name: holidayName, date: holidayDate })
      setTimerTitle(holidayName)
      setIsRunning(false)
      setIsPaused(false)
      setTimeLeft(0)
    } else {
      // Regular timer
      setSelectedHoliday(null)
      setTimeLeft(seconds)
      setTimerDuration(seconds)
      if (holidayName) {
        setTimerTitle(`${holidayName} Timer`)
      } else {
        // Calculate title from seconds
        const days = Math.floor(seconds / 86400)
        const hours = Math.floor((seconds % 86400) / 3600)
        if (days > 0) {
          setTimerTitle(`${days} Day${days > 1 ? 's' : ''} Timer`)
        } else if (hours > 0) {
          setTimerTitle(`${hours} Hour${hours > 1 ? 's' : ''} Timer`)
        } else {
          const minutes = Math.floor((seconds % 3600) / 60)
          setTimerTitle(`${minutes} Minute${minutes > 1 ? 's' : ''} Timer`)
        }
      }
      setIsRunning(false) // Don't start automatically
      setIsPaused(false)
    }
  }

  const handleRestart = () => {
    setTimeLeft(timerDuration)
    setIsRunning(true)
    setIsPaused(false)
    setShowCompleteDialog(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(0)
    setTimerTitle('') // Clear title on reset
    setSelectedHoliday(null) // Clear holiday selection
  }

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleFontDecrease = () => {
    if (fontSize > 64) {
      const newSize = fontSize - 8
      setFontSize(newSize)
      localStorage.setItem('clock-font-size', newSize.toString())
    }
  }

  const handleFontIncrease = () => {
    if (fontSize < 200) {
      const newSize = fontSize + 8
      setFontSize(newSize)
      localStorage.setItem('clock-font-size', newSize.toString())
    }
  }

  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullScreen(!isFullScreen)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleDeleteItem = (index: number) => {
    const updated = recentlyUsed.filter((_, i) => i !== index)
    setRecentlyUsed(updated)
    localStorage.setItem('timer-settings', JSON.stringify({ recentlyUsed: updated }))
  }

  const handleClearAll = () => {
    setRecentlyUsed([])
    setIsEditMode(false)
    localStorage.setItem('timer-settings', JSON.stringify({ recentlyUsed: [] }))
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <div className="bg-[#f0f0f0] dark:bg-black min-h-screen">
      <div className="main-content p-5">
        {/* Main Timer Panel */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default relative rounded" style={{
              height: '714px',
              marginBottom: '22px',
              backgroundColor: '#000',
              border: 'none'
            }}>
              {/* Panel Tools */}
              <div className="panel-tools" id="pnl-tools" style={{ margin: '15px' }}>
                <span
                  className="icon ci-share"
                  title="Share"
                  id="btn-tool-share"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'TimeTravel Timer',
                        text: 'Check out this online timer!',
                        url: window.location.href
                      }).catch(err => console.log('Error sharing:', err))
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copied to clipboard!')
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                ></span>
                <span
                  className="icon ci-less"
                  title="Decrease Font Size"
                  id="btn-font-minus"
                  onClick={handleFontDecrease}
                  style={{ cursor: 'pointer' }}
                ></span>
                <span
                  className={`icon ci-plus2 ${fontSize >= 200 ? 'disabled' : ''}`}
                  title="Increase Font Size"
                  id="btn-font-plus"
                  onClick={handleFontIncrease}
                  style={{ cursor: fontSize >= 200 ? 'not-allowed' : 'pointer' }}
                ></span>
                <span
                  className="icon ci-expand1"
                  title="Full Screen"
                  id="btn-full-screen"
                  onClick={handleFullScreen}
                  style={{ cursor: 'pointer', display: isFullScreen ? 'none' : 'inline-block' }}
                ></span>
                <span
                  className="icon ci-collapse"
                  title="Exit Full Screen"
                  id="btn-full-screen-exit"
                  onClick={handleFullScreen}
                  style={{ cursor: 'pointer', display: isFullScreen ? 'inline-block' : 'none' }}
                ></span>
              </div>

              {/* Timer Display - Center */}
              <div className="text-center" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%'
              }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                  {/* Timer Title */}
                  {timerTitle && (
                    <div className="mb-4" style={{ marginBottom: '20px' }}>
                      <div className="text-[#0090dd]" style={{ fontSize: `${Math.round(fontSize * 0.25)}px`, fontFamily: 'sans-serif' }}>
                        {timerTitle}
                      </div>
                    </div>
                  )}
                  {/* Holiday Countdown Display */}
                  {selectedHoliday ? (
                    <>
                      <div className="colored digit text-nowrap font-digit" style={{ fontSize: `${fontSize}px`, lineHeight: '1.1', fontWeight: 'normal', letterSpacing: '0.05em' }}>
                        {holidayTimeLeft.days} <span style={{ fontSize: `${Math.round(fontSize * 0.3)}px` }}>DAYS</span> {String(holidayTimeLeft.hours).padStart(2, '0')}:{String(holidayTimeLeft.minutes).padStart(2, '0')}:{String(holidayTimeLeft.seconds).padStart(2, '0')}
                      </div>
                      {(() => {
                        let targetDate = parse(selectedHoliday.date, 'yyyy-MM-dd', new Date())
                        const now = new Date()
                        if (isAfter(now, targetDate)) {
                          targetDate = addYears(targetDate, 1)
                        }
                        const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
                        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
                        const dayOfWeek = daysOfWeek[targetDate.getDay()]
                        const month = months[targetDate.getMonth()]
                        const day = targetDate.getDate()
                        const year = targetDate.getFullYear()
                        return (
                          <div className="colored digit-text text-center font-digit-text mt-4" style={{ fontSize: `${Math.round(fontSize * 0.25)}px`, letterSpacing: '-0.1em' }}>
                            {dayOfWeek} - {month} {day}, {year}
                          </div>
                        )
                      })()}
                    </>
                  ) : (
                    <>
                      <div className="colored digit text-nowrap font-digit" style={{ fontSize: `${fontSize}px`, lineHeight: '1.1', fontWeight: 'normal', letterSpacing: '0.05em' }}>
                        {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
                      </div>
                      
                      {/* Timer Status */}
                      {isRunning && timeLeft === 0 && (
                        <div className="text-[#EF6262] mt-4" style={{ fontSize: '32px' }}>
                          Time's Up!
                        </div>
                      )}
                    </>
                  )}

                  {/* Action Buttons - Only show for regular timers, not holidays */}
                  {!selectedHoliday && (
                    <div className="flex gap-3 justify-center px-4" style={{ marginTop: '60px' }}>
                    {timeLeft === 0 ? (
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-[#4aae71] text-white hover:bg-[#59b87e]"
                        style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                      >
                        Set Timer
                      </button>
                    ) : !isRunning ? (
                      <>
                        <button
                          onClick={() => setIsRunning(true)}
                          className="bg-[#4aae71] text-white hover:bg-[#59b87e]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Start
                        </button>
                        <button
                          onClick={handleReset}
                          className="bg-[#EF6262] text-white hover:bg-[#f17979]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Reset
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsPaused(!isPaused)}
                          className="bg-[#0090dd] text-white hover:bg-[#00a1f7]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          onClick={handleReset}
                          className="bg-[#EF6262] text-white hover:bg-[#f17979]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Reset
                        </button>
                      </>
                    )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdPlaceholder position="top" />

        {/* Preset Timers and Recently Used */}
        <div className="row" id="pnl-links">
          <div className="col-lg-6 mb-4">
            <div className="panel panel-default bg-white dark:bg-[#111] border border-[#ddd] dark:border-transparent rounded">
              <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ fontSize: '21px', fontWeight: 400, position: 'relative' }}>
                Set the timer for the specified time
              </div>
              <div className="panel-body">
                <div className="grid grid-cols-2 gap-4">
                  {/* Column 1: Minutes */}
                  <div>
                    {presetTimersColumn1.map((timer) => (
                      <div key={timer.label} className="mb-2">
                        <a
                          href={`/set-timer-for-${generateTimerSlug(timer.seconds)}`}
                          className="text-[#0090dd] dark:text-[#0090dd] hover:underline"
                          style={{ textDecoration: 'none' }}
                        >
                          {timer.label}
                        </a>
                      </div>
                    ))}
                  </div>
                  {/* Column 2: Seconds and Hours */}
                  <div>
                    {presetTimersColumn2.map((timer) => (
                      <div key={timer.label} className="mb-2">
                        <a
                          href={`/set-timer-for-${generateTimerSlug(timer.seconds)}`}
                          className="text-[#0090dd] dark:text-[#0090dd] hover:underline"
                          style={{ textDecoration: 'none' }}
                        >
                          {timer.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="panel panel-default bg-white dark:bg-[#111] border border-[#ddd] dark:border-transparent rounded">
              <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ fontSize: '21px', fontWeight: 400, position: 'relative' }}>
                <div className="tools" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
                  {recentlyUsed.length > 0 && (
                    <span
                      className={`icon ${isEditMode ? 'ci-check' : 'ci-edit'}`}
                      id="btn-edit-history"
                      onClick={toggleEditMode}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  )}
                </div>
                {isEditMode && recentlyUsed.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    style={{
                      position: 'absolute',
                      right: '50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#0090dd',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Clear all
                  </button>
                )}
                Recently used
              </div>
              <div className="panel-body">
                {recentlyUsed.length === 0 ? (
                  <p className="text-[#777] dark:text-[#9d9d9d] text-sm">No recent timers</p>
                ) : (
                  <table className="table table-history" style={{ width: '100%', marginBottom: 0 }}>
                    <tbody>
                      {recentlyUsed.slice(0, 10).map((timer, index) => {
                        const hours = Math.floor(timer.seconds / 3600)
                        const minutes = Math.floor((timer.seconds % 3600) / 60)
                        const secs = timer.seconds % 60
                        const time24 = hours > 0 
                          ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
                          : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
                        return (
                          <tr key={index}>
                            <td>
                              <a
                                href={isEditMode ? '#' : `/set-timer-for-${generateTimerSlug(timer.seconds)}`}
                                onClick={(e) => {
                                  if (isEditMode) {
                                    e.preventDefault()
                                  }
                                }}
                                style={{
                                  color: '#0090dd',
                                  textDecoration: 'none',
                                  cursor: isEditMode ? 'default' : 'pointer'
                                }}
                              >
                                {timer.label}
                              </a>
                            </td>
                            {isEditMode && (
                              <>
                                <td style={{ textAlign: 'right', color: '#eee' }}>{time24}</td>
                                <td style={{ textAlign: 'right', width: '30px' }}>
                                  <span
                                    className="icon"
                                    onClick={() => handleDeleteItem(index)}
                                    style={{
                                      cursor: 'pointer',
                                      color: '#eee',
                                      fontSize: '18px',
                                      display: 'inline-block',
                                      width: '24px',
                                      height: '24px',
                                      lineHeight: '24px',
                                      textAlign: 'center',
                                      fontFamily: 'clockicons'
                                    }}
                                  >
                                    ×
                                  </span>
                                </td>
                              </>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How to use and Holidays sections */}
        <div className="row mb-4">
          <div className="col-lg-6 mb-4">
            <div className="panel panel-default bg-white dark:bg-[#111] mb-6">
              <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ fontSize: '21px', fontWeight: 400, position: 'relative' }}>
                How to use the online timer
              </div>
              <div className="panel-body p-4">
                <p className="mb-3 text-[#555] dark:text-[#eee]">
                  Set the hour, minute, and second, or alternatively, set a specific date and time to count days, hours, minutes, and seconds until (or from) an event. The alert and a pre-selected sound will be played at the set time.
                </p>
                <p className="mb-3 text-[#555] dark:text-[#eee]">
                  When setting the timer, you can click the "Test" button to preview the alert and check the sound volume.
                </p>
                <p className="mb-3 text-[#555] dark:text-[#eee]">
                  The "Reset" button starts the timer from its initial value, and the "Stop" ("Start") button is used to stop or start the timer.
                </p>
                <p className="mb-3 text-[#555] dark:text-[#eee]">
                  You can add links to online timers with different settings to your browser's Favorites, which will set the timer to the predefined time upon opening.
                </p>
                <p className="mb-0 text-[#555] dark:text-[#eee]">
                  The holiday list (on the right) can be used to launch countdown timers for listed holidays, or you can create new timers for your own events and share them with friends.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="panel panel-default bg-white dark:bg-[#111] mb-6">
              <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ fontSize: '21px', fontWeight: 400, position: 'relative' }}>
                Holidays
              </div>
              <div className="panel-body p-4">
                <HolidaysList />
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditTimerModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onStart={handleStart}
      />

      <TimerCompleteDialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        onRestart={handleRestart}
        timerDuration={timerDuration}
      />

    </div>
  )
}
