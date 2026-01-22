'use client'

import { useState, useEffect, useRef } from 'react'
import { playAlarmSound } from '@/utils/audio'

export default function TimerEmbed() {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            playAlarmSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
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
  }, [isRunning])

  const handleStart = () => {
    if (timeLeft === 0) {
      const totalSeconds = minutes * 60 + seconds
      if (totalSeconds === 0) return
      setTimeLeft(totalSeconds)
    }
    setIsRunning(true)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(0)
  }

  const displayMinutes = Math.floor(timeLeft / 60)
  const displaySeconds = timeLeft % 60

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Timer</h2>
        <div className="dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold font-mono">
              {String(displayMinutes).padStart(2, '0')}:
              {String(displaySeconds).padStart(2, '0')}
            </div>
          </div>
          {!isRunning && timeLeft === 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                min="0"
                max="99"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                placeholder="Min"
                className="px-4 py-2 border rounded-lg text-center"
              />
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                placeholder="Sec"
                className="px-4 py-2 border rounded-lg text-center"
              />
            </div>
          )}
          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Start
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg"
              >
                Pause
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
