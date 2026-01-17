'use client'

import { useState, useEffect, useRef } from 'react'

export default function StopwatchEmbed() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Stopwatch</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold font-mono">{formatTime(time)}</div>
          </div>
          <div className="flex gap-2">
            {!isRunning ? (
              <>
                <button
                  onClick={() => setIsRunning(true)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Start
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false)
                    setTime(0)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Reset
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
