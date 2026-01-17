'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { EditTimerModal } from '@/components/EditTimerModal'
import { useWakeLock } from '@/hooks/useWakeLock'
import { playAlarmSound } from '@/utils/audio'

// Preset timers organized by columns
const presetTimersColumn1 = [ // Minutes (4-18)
  { label: '4 Minute Timer', seconds: 240 },
  { label: '5 Minute Timer', seconds: 300 },
  { label: '6 Minute Timer', seconds: 360 },
  { label: '7 Minute Timer', seconds: 420 },
  { label: '8 Minute Timer', seconds: 480 },
  { label: '9 Minute Timer', seconds: 540 },
  { label: '10 Minute Timer', seconds: 600 },
  { label: '11 Minute Timer', seconds: 660 },
  { label: '12 Minute Timer', seconds: 720 },
  { label: '13 Minute Timer', seconds: 780 },
  { label: '14 Minute Timer', seconds: 840 },
  { label: '15 Minute Timer', seconds: 900 },
  { label: '16 Minute Timer', seconds: 960 },
  { label: '17 Minute Timer', seconds: 1020 },
  { label: '18 Minute Timer', seconds: 1080 },
]

const presetTimersColumn2 = [ // Seconds
  { label: '1 Second Timer', seconds: 1 },
  { label: '2 Second Timer', seconds: 2 },
  { label: '3 Second Timer', seconds: 3 },
  { label: '5 Second Timer', seconds: 5 },
  { label: '10 Second Timer', seconds: 10 },
  { label: '15 Second Timer', seconds: 15 },
  { label: '20 Second Timer', seconds: 20 },
  { label: '25 Second Timer', seconds: 25 },
  { label: '30 Second Timer', seconds: 30 },
  { label: '35 Second Timer', seconds: 35 },
  { label: '40 Second Timer', seconds: 40 },
  { label: '45 Second Timer', seconds: 45 },
  { label: '50 Second Timer', seconds: 50 },
  { label: '60 Second Timer', seconds: 60 },
  { label: '90 Second Timer', seconds: 90 },
]

const presetTimersColumn3 = [ // Minutes
  { label: '1 Minute Timer', seconds: 60 },
  { label: '2 Minute Timer', seconds: 120 },
  { label: '3 Minute Timer', seconds: 180 },
  { label: '5 Minute Timer', seconds: 300 },
  { label: '10 Minute Timer', seconds: 600 },
  { label: '15 Minute Timer', seconds: 900 },
  { label: '20 Minute Timer', seconds: 1200 },
  { label: '25 Minute Timer', seconds: 1500 },
  { label: '30 Minute Timer', seconds: 1800 },
  { label: '35 Minute Timer', seconds: 2100 },
  { label: '40 Minute Timer', seconds: 2400 },
  { label: '45 Minute Timer', seconds: 2700 },
  { label: '50 Minute Timer', seconds: 3000 },
  { label: '60 Minute Timer', seconds: 3600 },
  { label: '90 Minute Timer', seconds: 5400 },
]

const presetTimersColumn4 = [ // Hours
  { label: '1 Hour Timer', seconds: 3600 },
  { label: '2 Hour Timer', seconds: 7200 },
  { label: '3 Hour Timer', seconds: 10800 },
  { label: '4 Hour Timer', seconds: 14400 },
  { label: '5 Hour Timer', seconds: 18000 },
  { label: '6 Hour Timer', seconds: 21600 },
  { label: '7 Hour Timer', seconds: 25200 },
  { label: '8 Hour Timer', seconds: 28800 },
  { label: '9 Hour Timer', seconds: 32400 },
  { label: '10 Hour Timer', seconds: 36000 },
  { label: '12 Hour Timer', seconds: 43200 },
  { label: '18 Hour Timer', seconds: 64800 },
  { label: '24 Hour Timer', seconds: 86400 },
  { label: '48 Hour Timer', seconds: 172800 },
  { label: '72 Hour Timer', seconds: 259200 },
]

// Generate URL slug from seconds (e.g., 20 -> "20-seconds", 60 -> "1-minute")
function generateTimerSlug(seconds: number): string {
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

// Format timer duration for display (e.g., "2 Seconds", "3 Minutes", "1 Hour")
function formatTimerDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} Second${seconds === 1 ? '' : 's'}`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} Minute${minutes === 1 ? '' : 's'}`
  } else {
    const hours = Math.floor(seconds / 3600)
    return `${hours} Hour${hours === 1 ? '' : 's'}`
  }
}

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

export default function SetTimerForPage() {
  const params = useParams()
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [timerDuration, setTimerDuration] = useState(0)
  const [timerTitle, setTimerTitle] = useState('')
  const [fontSize, setFontSize] = useState(128)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useWakeLock(isRunning)

  // Parse time parameter (e.g., "15-minutes", "20-seconds", "2-hours")
  const parseTimeParam = (timeStr: string) => {
    const match = timeStr.match(/(\d+)-(second|minute|hour|seconds|minutes|hours)/i)
    if (!match) return null
    
    const [, value, unit] = match
    const num = parseInt(value, 10)
    const unitLower = unit.toLowerCase()
    
    if (unitLower.startsWith('second')) {
      return num
    } else if (unitLower.startsWith('minute')) {
      return num * 60
    } else if (unitLower.startsWith('hour')) {
      return num * 3600
    }
    return null
  }

  useEffect(() => {
    // Set page title
    if (params?.slug) {
      const timeStr = params.slug as string
      const seconds = parseTimeParam(timeStr)
      if (seconds) {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        
        let title = ''
        if (hours > 0) {
          title = `${hours} Hour${hours > 1 ? 's' : ''} Timer`
        } else if (minutes > 0) {
          title = `${minutes} Minute${minutes > 1 ? 's' : ''} Timer`
        } else if (secs > 0) {
          title = `${secs} Second${secs > 1 ? 's' : ''} Timer`
        }
        
        if (title) {
          document.title = `${title} - Online Timer - Countdown`
        }
      }
    }

    // Parse URL parameter and set timer
    if (params?.slug) {
      const timeStr = params.slug as string
      const seconds = parseTimeParam(timeStr)
      if (seconds) {
        setTimeLeft(seconds)
        setTimerDuration(seconds)
        
        // Generate title
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        
        let title = ''
        if (hours > 0) {
          title = `${hours} Hour${hours > 1 ? 's' : ''} Timer`
        } else if (minutes > 0) {
          title = `${minutes} Minute${minutes > 1 ? 's' : ''} Timer`
        } else if (secs > 0) {
          title = `${secs} Second${secs > 1 ? 's' : ''} Timer`
        }
        setTimerTitle(title)
      }
    }

    // Load saved font size
    const savedFontSize = localStorage.getItem('clock-font-size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10))
    }
  }, [params])

  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(() => {
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
      return () => clearInterval(interval)
    }
  }, [isRunning, isPaused])

  const handleStart = (hours: number, minutes: number, seconds: number, sound: string = 'Xylophone', repeat: boolean = true) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    if (totalSeconds === 0) return
    setTimeLeft(totalSeconds)
    setTimerDuration(totalSeconds)
    
    // Generate title
    let title = ''
    if (hours > 0) {
      title = `${hours} Hour${hours > 1 ? 's' : ''} Timer`
    } else if (minutes > 0) {
      title = `${minutes} Minute${minutes > 1 ? 's' : ''} Timer`
    } else if (seconds > 0) {
      title = `${seconds} Second${seconds > 1 ? 's' : ''} Timer`
    }
    setTimerTitle(title)
    setIsRunning(false) // Don't auto-start when editing
    setIsPaused(false)
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
    setTimerTitle('')
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
                  onClick={handleFontDecrease}
                  style={{ cursor: 'pointer' }}
                ></span>
                <span
                  className={`icon ci-plus2 ${fontSize >= 200 ? 'disabled' : ''}`}
                  title="Increase Font Size"
                  onClick={handleFontIncrease}
                  style={{ cursor: fontSize >= 200 ? 'not-allowed' : 'pointer' }}
                ></span>
                <span
                  className="icon ci-expand1"
                  title="Full Screen"
                  onClick={handleFullScreen}
                  style={{ cursor: 'pointer', display: isFullScreen ? 'none' : 'inline-block' }}
                ></span>
                <span
                  className="icon ci-collapse"
                  title="Exit Full Screen"
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
                  <div className="colored digit text-nowrap font-digit" style={{ fontSize: `${fontSize}px`, lineHeight: '1.1', fontWeight: 'normal', letterSpacing: '0.05em' }}>
                    {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
                  </div>

                  {/* Timer Status */}
                  {isRunning && timeLeft === 0 && (
                    <div className="text-[#EF6262] mt-4" style={{ fontSize: '32px' }}>
                      Time&apos;s Up!
                    </div>
                  )}

                  {/* Action Buttons */}
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
                          onClick={() => setShowEditModal(true)}
                          className="bg-[#0090dd] text-white hover:bg-[#00a1f7]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Edit
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
                          onClick={() => setShowEditModal(true)}
                          className="bg-[#0090dd] text-white hover:bg-[#00a1f7]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Edit
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdPlaceholder position="top" />

        {/* Set the timer for the specified time */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default bg-white dark:bg-[#111] border border-[#ddd] dark:border-transparent rounded">
              <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ fontSize: '21px', fontWeight: 400, position: 'relative' }}>
                Set the timer for the specified time
              </div>
              <div className="panel-body">
                <div className="grid grid-cols-4 gap-4">
                  {/* Column 1: Minutes (4-18) */}
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
                  {/* Column 2: Seconds */}
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
                  {/* Column 3: Minutes */}
                  <div>
                    {presetTimersColumn3.map((timer) => (
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
                  {/* Column 4: Hours */}
                  <div>
                    {presetTimersColumn4.map((timer) => (
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
        </div>

        {/* Countdown section */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default bg-white dark:bg-[#111] mb-6">
              <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ fontSize: '21px', fontWeight: 400, position: 'relative' }}>
                Countdown
              </div>
              <div className="panel-body p-4">
                {timerDuration > 0 ? (
                  <>
                    <p className="mb-3 text-[#555] dark:text-[#eee]">
                      Set timer for {formatTimerDuration(timerDuration)}. Wake me up in {formatTimerDuration(timerDuration)}. Set the alarm for {formatTimerDuration(timerDuration)} from now. It is a free and easy-to-use countdown timer.
                    </p>
                    <p className="mb-3 text-[#555] dark:text-[#eee]">
                      Set the hour, minute, and second for the online countdown timer, and start it. Alternatively, you can set the date and time to count till (or from) the event.
                    </p>
                    <p className="mb-0">
                      <a
                        href={`/set-timer-for-${generateTimerSlug(timerDuration)}`}
                        className="text-[#0090dd] dark:text-[#0090dd] hover:underline"
                        style={{ textDecoration: 'none' }}
                      >
                        Start {formatTimerDuration(timerDuration)} timer.
                      </a>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-3 text-[#555] dark:text-[#eee]">
                      Set timer for 3 Minutes. Wake me up in 3 Minutes. Set the alarm for 3 Minutes from now. It is a free and easy-to-use countdown timer.
                    </p>
                    <p className="mb-3 text-[#555] dark:text-[#eee]">
                      Set the hour, minute, and second for the online countdown timer, and start it. Alternatively, you can set the date and time to count till (or from) the event.
                    </p>
                    <p className="mb-0">
                      <a
                        href="/set-timer-for-3-minutes"
                        className="text-[#0090dd] dark:text-[#0090dd] hover:underline"
                        style={{ textDecoration: 'none' }}
                      >
                        Start 3 Minute timer.
                      </a>
                    </p>
                  </>
                )}
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
