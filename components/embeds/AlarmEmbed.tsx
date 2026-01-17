'use client'

import { useState, useEffect } from 'react'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { playAlarmSound } from '@/utils/audio'
import { format } from 'date-fns'

export default function AlarmEmbed() {
  const [alarmTime, setAlarmTime] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { is24Hour } = useTimeFormat()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isActive || !alarmTime) return

    const now = new Date()
    const [hours, minutes] = alarmTime.split(':').map(Number)
    const alarmDate = new Date()
    alarmDate.setHours(hours, minutes, 0, 0)

    if (alarmDate < now) {
      alarmDate.setDate(alarmDate.getDate() + 1)
    }

    const checkAlarm = () => {
      const now = new Date()
      if (now.getHours() === alarmDate.getHours() && now.getMinutes() === alarmDate.getMinutes()) {
        playAlarmSound()
        setIsActive(false)
      }
    }

    const interval = setInterval(checkAlarm, 1000)
    return () => clearInterval(interval)
  }, [isActive, alarmTime])

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Alarm Clock</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold font-mono">
              {format(currentTime, is24Hour ? 'HH:mm:ss' : 'h:mm:ss a')}
            </div>
          </div>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            disabled={isActive}
          />
          <div className="flex gap-2">
            {!isActive ? (
              <button
                onClick={() => setIsActive(true)}
                disabled={!alarmTime}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Set Alarm
              </button>
            ) : (
              <button
                onClick={() => setIsActive(false)}
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
