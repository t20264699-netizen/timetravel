'use client'

import { useState, useEffect, useRef } from 'react'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { useWakeLock } from '@/hooks/useWakeLock'

interface Lap {
  id: number
  lapTime: number
  totalTime: number
}

export default function StopwatchPage() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const [lastLapTime, setLastLapTime] = useState(0)
  const [fontSize, setFontSize] = useState(128)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useWakeLock(isRunning)

  useEffect(() => {
    // Set page title
    document.title = 'Stopwatch - Online Stopwatch - TimeTravel'

    // Load saved font size
    const savedFontSize = localStorage.getItem('clock-font-size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10))
    }

    // Load saved stopwatch state
    const savedState = localStorage.getItem('stopwatch-state')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        if (state.time !== undefined) {
          setTime(state.time)
        }
        if (state.laps && Array.isArray(state.laps)) {
          setLaps(state.laps)
        }
        if (state.lastLapTime !== undefined) {
          setLastLapTime(state.lastLapTime)
        }
        // If it was running, pause it on load (since we can't accurately calculate elapsed time)
        // User can resume manually
        if (state.isRunning) {
          setIsRunning(false)
        }
      } catch (e) {
        console.error('Failed to load stopwatch state', e)
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10)
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
  }, [isRunning, time])

  // Save stopwatch state to localStorage whenever time, laps, lastLapTime, or isRunning changes
  // Only save after initial state has been loaded
  useEffect(() => {
    if (!isInitialized) return

    const state = {
      time,
      laps,
      lastLapTime,
      isRunning
    }

    if (isRunning) {
      // When running, save less frequently (every 500ms) to avoid excessive writes
      const timeoutId = setTimeout(() => {
        localStorage.setItem('stopwatch-state', JSON.stringify(state))
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      // When stopped, save immediately
      localStorage.setItem('stopwatch-state', JSON.stringify(state))
    }
  }, [time, laps, lastLapTime, isRunning, isInitialized])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleLap = () => {
    const currentLapTime = time - lastLapTime
    setLaps((prev) => [
      { id: Date.now(), lapTime: currentLapTime, totalTime: time },
      ...prev,
    ])
    setLastLapTime(time)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
    setLastLapTime(0)
    // Clear from localStorage
    localStorage.removeItem('stopwatch-state')
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const centiseconds = Math.floor((ms % 1000) / 10)

    // Return main time and centiseconds separately for different sizing
    if (hours > 0) {
      return {
        main: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        centiseconds: `.${String(centiseconds).padStart(2, '0')}`
      }
    }
    return {
      main: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      centiseconds: `.${String(centiseconds).padStart(2, '0')}`
    }
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
    <div className="bg-[#f0f0f0] dark:bg-black min-h-screen" style={{ backgroundColor: '#000' }}>
      <div className="main-content p-5">
        {/* Main Stopwatch Panel */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default relative rounded" style={{
              height: '550px',
              marginBottom: '0',
              backgroundColor: '#000',
              border: 'none',
              overflow: 'hidden'
            }}>
              {/* Panel Tools */}
              <div className="panel-tools" id="pnl-tools" style={{ margin: '15px' }}>
                <span
                  className="icon ci-share"
                  title="Share"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'TimeTravel Stopwatch',
                        text: 'Check out this online stopwatch!',
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

              {/* Stopwatch Display - Center */}
              <div className="text-center" style={{
                position: 'absolute',
                top: '57%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                zIndex: 10,
                pointerEvents: 'none'
              }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center', pointerEvents: 'auto' }}>
                  <div className="colored digit text-nowrap font-digit" style={{ fontSize: `${fontSize}px`, lineHeight: '1.1', fontWeight: 'normal', letterSpacing: '0.05em' }}>
                    {formatTime(time).main}
                    <span className="colored" style={{ fontSize: `${Math.round(fontSize * 0.5)}px`, marginLeft: '-0.1em', display: 'inline-block' }}>
                      {formatTime(time).centiseconds}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center" style={{ marginTop: '40px' }}>
                    {!isRunning ? (
                      <>
                        <button
                          onClick={handleStart}
                          className="bg-[#4aae71] text-white hover:bg-[#59b87e]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Start
                        </button>
                        <button
                          onClick={handleReset}
                          disabled={time === 0}
                          className="bg-[#EF6262] text-white hover:bg-[#f17979] disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Reset
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleLap}
                          className="bg-[#0090dd] text-white hover:bg-[#00a1f7]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Lap
                        </button>
                        <button
                          onClick={handleStop}
                          className="bg-[#EF6262] text-white hover:bg-[#f17979]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Stop
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laps Table - Outside panel, in normal flow, minimal spacing */}
        {laps.length > 0 && (
          <div className="row" style={{ marginTop: '-20px', marginBottom: '22px' }}>
            <div className="col-md-12">
              <div className="panel panel-default" style={{ backgroundColor: '#000', border: 'none', padding: '20px' }}>
                <div className="colored text-center">
                  <table 
                    id="tbl-laps" 
                    className="table-laps" 
                    style={{ 
                      fontSize: '21px', 
                      margin: '0 auto', 
                      width: '380px',
                      borderCollapse: 'collapse',
                      whiteSpace: 'nowrap',
                      tableLayout: 'fixed'
                    }}
                  >
                    <colgroup>
                      <col style={{ width: '80px' }} />
                      <col style={{ width: '150px' }} />
                      <col style={{ width: '150px' }} />
                    </colgroup>
                    <thead>
                      <tr className="digit-text font-digit-text">
                        <th style={{ padding: '4px 8px', textAlign: 'center', width: '80px' }}>LAP</th>
                        <th style={{ padding: '4px 8px', textAlign: 'center', width: '150px' }}>TIME</th>
                        <th style={{ padding: '4px 8px', textAlign: 'center', width: '150px' }}>TOTAL TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laps
                        .slice()
                        .sort((a, b) => b.id - a.id)
                        .map((lap, index) => {
                          const lapTimeFormatted = formatTime(lap.lapTime)
                          const totalTimeFormatted = formatTime(lap.totalTime)
                          const sortedLaps = laps.slice().sort((a, b) => b.id - a.id)
                          const lapNumber = sortedLaps.length - index
                          return (
                            <tr key={lap.id} className="digit font-digit">
                              <td style={{ padding: '4px 8px', textAlign: 'center', width: '80px' }}>{lapNumber}</td>
                              <td style={{ padding: '4px 8px', textAlign: 'center', width: '150px' }}>
                                {lapTimeFormatted.main}{lapTimeFormatted.centiseconds}
                              </td>
                              <td style={{ padding: '4px 8px', textAlign: 'center', width: '150px' }}>
                                {totalTimeFormatted.main}{totalTimeFormatted.centiseconds}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ads Section */}
        <AdPlaceholder position="top" />

      </div>
    </div>
  )
}
