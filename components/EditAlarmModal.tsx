'use client'

import { useState, useEffect, useRef } from 'react'
import { playAlarmSound } from '@/utils/audio'
import { getAvailableSounds } from '@/utils/sounds'

interface EditAlarmModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: (time: string, sound: string, title: string, repeat: boolean) => void
  initialTime?: string
  initialTitle?: string
  initialSound?: string
  initialLoop?: boolean
}

export function EditAlarmModal({ 
  isOpen, 
  onClose, 
  onStart, 
  initialTime = '12:00',
  initialTitle = 'Alarm',
  initialSound = 'Clock Chimes',
  initialLoop = false
}: EditAlarmModalProps) {
  const [hours, setHours] = useState(initialTime.split(':')[0] || '12')
  const [minutes, setMinutes] = useState(initialTime.split(':')[1] || '00')
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM')
  const [sound, setSound] = useState(initialSound)
  const [title, setTitle] = useState(initialTitle)
  const [repeat, setRepeat] = useState(initialLoop)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const availableSounds = getAvailableSounds('alarm')

  // Update state when props change
  useEffect(() => {
    if (initialTime) {
      const [h, m] = initialTime.split(':')
      const hourNum = parseInt(h || '12', 10)
      setHours(hourNum > 12 ? (hourNum - 12).toString() : (hourNum === 0 ? '12' : hourNum.toString()))
      setMinutes(m || '00')
      setAmpm(hourNum >= 12 ? 'PM' : 'AM')
    }
    if (initialTitle) setTitle(initialTitle)
    if (initialSound) setSound(initialSound)
    setRepeat(initialLoop)
  }, [initialTime, initialTitle, initialSound, initialLoop])

  // Cleanup audio on unmount or when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
        setIsPlaying(false)
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
        setIsPlaying(false)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleStart = () => {
    const hour24 = ampm === 'PM' && parseInt(hours) !== 12 
      ? (parseInt(hours) + 12).toString() 
      : ampm === 'AM' && parseInt(hours) === 12 
      ? '00' 
      : hours.padStart(2, '0')
    const time = `${hour24}:${minutes.padStart(2, '0')}`
    onStart(time, sound, title, repeat)
    onClose()
  }

  const handleTest = () => {
    if (isPlaying && audioRef.current) {
      // Stop currently playing audio
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
      setIsPlaying(false)
    } else {
      // Play the selected sound
      const audio = playAlarmSound(sound, 'alarm', repeat)
      if (audio) {
        audioRef.current = audio
        setIsPlaying(true)
        
        audio.onended = () => {
          audioRef.current = null
          setIsPlaying(false)
        }
        
        audio.onpause = () => {
          setIsPlaying(false)
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#484747] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Alarm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hours</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const h = parseInt(hours) - 1
                  setHours(h < 1 ? '12' : h.toString())
                }}
                className="px-3 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                style={{ borderRadius: 0 }}
              >
                ←
              </button>
              <input
                type="text"
                value={hours}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
                    setHours(val)
                  }
                }}
                className="w-20 px-3 py-2 bg-[#3d3c3c] text-white text-center"
                style={{ borderRadius: 0 }}
              />
              <button
                onClick={() => {
                  const h = parseInt(hours) + 1
                  setHours(h > 12 ? '1' : h.toString())
                }}
                className="px-3 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                style={{ borderRadius: 0 }}
              >
                →
              </button>
              <select
                value={ampm}
                onChange={(e) => setAmpm(e.target.value as 'AM' | 'PM')}
                className="px-3 py-2 bg-[#3d3c3c] dark:bg-[#1a1a1a] text-white dark:text-[#eee] border border-[#777]"
                style={{ borderRadius: 0 }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Minutes</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const m = parseInt(minutes) - 1
                  setMinutes(m < 0 ? '59' : m.toString().padStart(2, '0'))
                }}
                className="px-3 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                style={{ borderRadius: 0 }}
              >
                ←
              </button>
              <input
                type="text"
                value={minutes}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                    setMinutes(val.padStart(2, '0'))
                  }
                }}
                className="w-20 px-3 py-2 bg-[#3d3c3c] text-white text-center"
                style={{ borderRadius: 0 }}
              />
              <button
                onClick={() => {
                  const m = parseInt(minutes) + 1
                  setMinutes(m > 59 ? '00' : m.toString().padStart(2, '0'))
                }}
                className="px-3 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                style={{ borderRadius: 0 }}
              >
                →
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sound</label>
            <div className="flex items-center gap-2">
              <select
                value={sound}
                onChange={(e) => setSound(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#3d3c3c] text-white"
                style={{ borderRadius: 0 }}
              >
                {availableSounds.map((soundName) => (
                  <option key={soundName} value={soundName}>
                    {soundName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleTest}
                className="px-3 py-2 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                style={{ borderRadius: 0 }}
                title={isPlaying ? 'Stop' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="repeat"
              checked={repeat}
              onChange={(e) => setRepeat(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="repeat" className="text-gray-300">Repeat sound</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#3d3c3c] text-white"
              placeholder="Alarm"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleTest}
              className="flex-1 px-4 py-2 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
              style={{ borderRadius: 0 }}
            >
              Test
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
              style={{ borderRadius: 0 }}
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex-1 px-4 py-2 bg-success text-white hover:bg-success-hover"
              style={{ borderRadius: 0 }}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
