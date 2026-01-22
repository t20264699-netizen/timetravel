'use client'

import { useState, useRef } from 'react'
import { playAlarmSound } from '@/utils/audio'

interface EditTimerModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: (hours: number, minutes: number, seconds: number, sound: string, repeat: boolean) => void
}

export function EditTimerModal({ isOpen, onClose, onStart }: EditTimerModalProps) {
  const [timerType, setTimerType] = useState<'countdown' | 'countTill'>('countdown')
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [onZero, setOnZero] = useState<'stop' | 'restart' | 'stopwatch'>('stop')
  const [sound, setSound] = useState('Xylophone')
  const [repeat, setRepeat] = useState(true)
  const [title, setTitle] = useState('')
  const [showMessage, setShowMessage] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup audio when modal closes
  if (!isOpen) {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
    return null
  }

  const handleStart = () => {
    // Stop any playing sound before closing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
    onStart(hours, minutes, seconds, sound, repeat)
    onClose()
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      // Stop playing
      if (audioRef.current) {
        if (audioRef.current.pause) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
        audioRef.current = null
      }
      setIsPlaying(false)
    } else {
      // Start playing
      try {
        // Stop any existing audio first
        if (audioRef.current) {
          if (audioRef.current.pause) {
            audioRef.current.pause()
          }
          audioRef.current.currentTime = 0
        }
        
        // Try to play timer sound
        const { getSoundUrl } = require('@/utils/sounds')
        const audio = new Audio(getSoundUrl('Timer Clicking', 'timer'))
        audio.volume = 0.7
        audioRef.current = audio
        
        const playPromise = audio.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              // Reset button when sound finishes
              audio.onended = () => {
                setIsPlaying(false)
                audioRef.current = null
              }
            })
            .catch((error) => {
              // Fallback to beep if audio file doesn't exist
              console.warn('Failed to play sound file, using beep:', error)
              playBeepSound()
            })
        }
      } catch (error) {
        // Fallback to beep if audio creation fails
        console.warn('Failed to create audio, using beep:', error)
        playBeepSound()
      }
    }
  }

  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      setIsPlaying(true)
      // Reset button after beep finishes (0.5 seconds)
      setTimeout(() => {
        setIsPlaying(false)
      }, 500)
    } catch (error) {
      console.warn('Failed to play beep:', error)
      setIsPlaying(false)
    }
  }

  const handleTest = () => {
    // Test the sound by playing it
    handlePlayPause()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#484747] p-6 w-full max-w-md" style={{ borderRadius: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Timer</h2>
          <button
            onClick={onClose}
            className="text-[#9d9d9d] hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="countdown"
                  checked={timerType === 'countdown'}
                  onChange={(e) => setTimerType(e.target.value as 'countdown')}
                  className="mr-2"
                />
                <span className="text-white">Countdown</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="countTill"
                  checked={timerType === 'countTill'}
                  onChange={(e) => setTimerType(e.target.value as 'countTill')}
                  className="mr-2"
                />
                <span className="text-white">Count till (from) date and time</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Hours</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHours(Math.max(0, hours - 1))}
                  className="px-2 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                  style={{ borderRadius: 0 }}
                >
                  ←
                </button>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-2 py-2 bg-[#3d3c3c] text-white text-center"
                  style={{ borderRadius: 0 }}
                  min="0"
                />
                <button
                  onClick={() => setHours(hours + 1)}
                  className="px-2 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                  style={{ borderRadius: 0 }}
                >
                  →
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Minutes</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMinutes(Math.max(0, minutes - 1))}
                  className="px-2 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                  style={{ borderRadius: 0 }}
                >
                  ←
                </button>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-2 py-2 bg-[#3d3c3c] text-white text-center"
                  style={{ borderRadius: 0 }}
                  min="0"
                  max="59"
                />
                <button
                  onClick={() => setMinutes(Math.min(59, minutes + 1))}
                  className="px-2 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                  style={{ borderRadius: 0 }}
                >
                  →
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Seconds</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSeconds(Math.max(0, seconds - 1))}
                  className="px-2 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                  style={{ borderRadius: 0 }}
                >
                  ←
                </button>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-2 py-2 bg-[#3d3c3c] text-white text-center"
                  style={{ borderRadius: 0 }}
                  min="0"
                  max="59"
                />
                <button
                  onClick={() => setSeconds(Math.min(59, seconds + 1))}
                  className="px-2 py-1 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                  style={{ borderRadius: 0 }}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">On zero</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="stop"
                  checked={onZero === 'stop'}
                  onChange={(e) => setOnZero(e.target.value as 'stop')}
                  className="mr-2"
                />
                <span className="text-white">Stop timer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="restart"
                  checked={onZero === 'restart'}
                  onChange={(e) => setOnZero(e.target.value as 'restart')}
                  className="mr-2"
                />
                <span className="text-white">Restart timer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="stopwatch"
                  checked={onZero === 'stopwatch'}
                  onChange={(e) => setOnZero(e.target.value as 'stopwatch')}
                  className="mr-2"
                />
                <span className="text-white">Run as stopwatch</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Sound</label>
            <div className="flex items-center gap-2 relative">
              <select
                value={sound}
                onChange={(e) => setSound(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#3d3c3c] text-white"
                style={{ borderRadius: 0 }}
              >
                <option value="Xylophone">Xylophone</option>
                <option value="Bells">Bells</option>
                <option value="Beep">Beep</option>
              </select>
              <button
                onClick={handlePlayPause}
                className="px-3 py-2 bg-[#3d3c3c] text-white hover:bg-[#4a4949]"
                style={{ borderRadius: 0 }}
                title={isPlaying ? 'Stop sound' : 'Play sound'}
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
            <label htmlFor="repeat" className="text-white">Repeat sound</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#3d3c3c] text-white"
              style={{ borderRadius: 0 }}
              placeholder="Timer"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showMessage"
              checked={showMessage}
              onChange={(e) => setShowMessage(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showMessage" className="text-white">Show message</label>
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
