'use client'

import { useState, useEffect } from 'react'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { DigitalClock } from '@/components/DigitalClock'
import { EditAlarmModal } from '@/components/EditAlarmModal'
import { playAlarmSound } from '@/utils/audio'
import { format } from 'date-fns'

// Test Alarm Dialog Component
function TestAlarmDialog({ isOpen, onClose, alarmTime }: { isOpen: boolean; onClose: () => void; alarmTime: string }) {
  if (!isOpen) return null

  const [hours, minutes] = alarmTime.split(':').map(Number)
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#484747] w-full" style={{ borderRadius: 0, maxWidth: '500px' }}>
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">Alarm</h2>
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
              <span className="icon ci-alarm"></span>
            </div>
            <h3 id="lbl-dialog-alarm-title" className="text-white text-xl mb-2">Alarm</h3>
            <h3 id="lbl-dialog-alarm-time" className="text-white text-4xl font-bold">{formattedTime}</h3>
            <p id="lbl-overdue"></p>
          </div>
        </div>
        <div className="border-t border-gray-600 p-4 text-center">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-[#EF6262] text-white"
            style={{ borderRadius: 0 }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

const presetTimes = [
  '4:00 AM', '4:30 AM', '5:00 AM', '5:15 AM', '5:30 AM', '5:45 AM',
  '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM', '7:00 AM', '7:15 AM',
  '7:30 AM', '7:45 AM', '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
]

export default function AlarmPage() {
  const [alarmTime, setAlarmTime] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showEditModal, setShowEditModal] = useState(false)
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([])
  const [fontSize, setFontSize] = useState(128) // Default font size in px
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [alarmTitle, setAlarmTitle] = useState('Alarm')
  const [alarmSound, setAlarmSound] = useState('Bells')
  const [alarmLoop, setAlarmLoop] = useState(false)
  const [timeUntilAlarm, setTimeUntilAlarm] = useState('')
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [hasHashParams, setHasHashParams] = useState(false)

  // Parse hash parameters from URL
  const parseHashParams = () => {
    if (typeof window === 'undefined') return null

    const hash = window.location.hash.substring(1) // Remove #
    if (!hash) return null

    const params = new URLSearchParams(hash)
    const time = params.get('time')
    // Only return params if time is present (valid alarm hash)
    if (!time) return null

    return {
      time: time,
      title: params.get('title') ? decodeURIComponent(params.get('title')!) : '',
      enabled: params.get('enabled') === '1',
      sound: params.get('sound') || '',
      loop: params.get('loop') === '1',
    }
  }

  // Update URL hash with current alarm settings
  const updateUrlHash = (time: string, title: string, enabled: boolean, sound: string, loop: boolean) => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (time) params.set('time', time)
    if (title) params.set('title', encodeURIComponent(title))
    params.set('enabled', enabled ? '1' : '0')
    if (sound) params.set('sound', sound)
    params.set('loop', loop ? '1' : '0')

    window.location.hash = params.toString()
  }

  useEffect(() => {
    // Set page title
    document.title = 'Alarm Clock - Online Alarm Clock - TimeTravel'
    // Scroll to top on page load to ensure panel tools are visible
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Load page-specific alarm settings (main alarm page)
    const saved = localStorage.getItem('alarm-settings-main')
    let savedSettings = null
    if (saved) {
      try {
        savedSettings = JSON.parse(saved)
        setRecentlyUsed(savedSettings.recentlyUsed || [])
      } catch (e) {
        console.error('Failed to load alarm settings', e)
      }
    }

    // Also load recently used from general settings (shared across pages)
    const generalSaved = localStorage.getItem('alarm-settings')
    if (generalSaved) {
      try {
        const generalSettings = JSON.parse(generalSaved)
        setRecentlyUsed(generalSettings.recentlyUsed || [])
      } catch (e) {
        // Ignore
      }
    }

    // Parse hash parameters first (they take priority)
    const hashParams = parseHashParams()
    if (hashParams && hashParams.time) {
      setHasHashParams(true)
      // Hash params override localStorage
      setAlarmTime(hashParams.time)
      setIsActive(hashParams.enabled)
      if (hashParams.title) setAlarmTitle(hashParams.title)
      if (hashParams.sound) setAlarmSound(hashParams.sound)
      setAlarmLoop(hashParams.loop)

      // Save hash params to page-specific localStorage (even if enabled=0)
      const settingsToSave = {
        time: hashParams.time,
        title: hashParams.title || 'Alarm',
        sound: hashParams.sound || 'Bells',
        loop: hashParams.loop || false,
        isActive: hashParams.enabled || false,
        recentlyUsed: savedSettings?.recentlyUsed || [],
      }
      localStorage.setItem('alarm-settings-main', JSON.stringify(settingsToSave))

      // Update URL hash to reflect current state
      updateUrlHash(
        hashParams.time,
        settingsToSave.title,
        hashParams.enabled,
        settingsToSave.sound,
        hashParams.loop
      )
    } else {
      setHasHashParams(false)
      // No hash params - restore from localStorage (even if not active)
      if (savedSettings && savedSettings.time) {
        setAlarmTime(savedSettings.time)
        setAlarmTitle(savedSettings.title || 'Alarm')
        setAlarmSound(savedSettings.sound || 'Bells')
        setAlarmLoop(savedSettings.loop || false)
        setIsActive(savedSettings.isActive || false)
        // Update URL hash to reflect localStorage state (so it persists in URL)
        updateUrlHash(
          savedSettings.time,
          savedSettings.title || 'Alarm',
          savedSettings.isActive || false,
          savedSettings.sound || 'Bells',
          savedSettings.loop || false
        )
      }
      // Don't clear alarm if no saved settings - just leave it empty
      // (This allows the user to set a new alarm)
    }

    // Load saved font size
    const savedFontSize = localStorage.getItem('clock-font-size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10))
    }
  }, [])

  // Watch for hash changes and update alarm state accordingly
  useEffect(() => {
    const handleHashChange = () => {
      const hashParams = parseHashParams()
      if (hashParams && hashParams.time) {
        // Hash params changed - update state and save to localStorage
        setAlarmTime(hashParams.time)
        setIsActive(hashParams.enabled)
        if (hashParams.title) setAlarmTitle(hashParams.title)
        if (hashParams.sound) setAlarmSound(hashParams.sound)
        setAlarmLoop(hashParams.loop)

        const saved = localStorage.getItem('alarm-settings-main')
        let savedSettings = null
        if (saved) {
          try {
            savedSettings = JSON.parse(saved)
          } catch (e) {
            // Ignore
          }
        }

        const settingsToSave = {
          time: hashParams.time,
          title: hashParams.title || 'Alarm',
          sound: hashParams.sound || 'Bells',
          loop: hashParams.loop || false,
          isActive: hashParams.enabled || false,
          recentlyUsed: savedSettings?.recentlyUsed || [],
        }
        localStorage.setItem('alarm-settings-main', JSON.stringify(settingsToSave))
      } else {
        // Hash removed - restore from localStorage
        const saved = localStorage.getItem('alarm-settings-main')
        if (saved) {
          try {
            const savedSettings = JSON.parse(saved)
            if (savedSettings.time) {
              setAlarmTime(savedSettings.time)
              setAlarmTitle(savedSettings.title || 'Alarm')
              setAlarmSound(savedSettings.sound || 'Bells')
              setAlarmLoop(savedSettings.loop || false)
              setIsActive(savedSettings.isActive || false)
              // Update URL hash to reflect localStorage state
              updateUrlHash(
                savedSettings.time,
                savedSettings.title || 'Alarm',
                savedSettings.isActive || false,
                savedSettings.sound || 'Bells',
                savedSettings.loop || false
              )
            }
          } catch (e) {
            // Ignore
          }
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isActive || !alarmTime) {
      setTimeUntilAlarm('')
      return
    }

    const calculateTimeUntil = () => {
      const now = new Date()
      const [hours, minutes] = alarmTime.split(':').map(Number)
      const alarmDate = new Date()
      alarmDate.setHours(hours, minutes, 0, 0)

      if (alarmDate < now) {
        alarmDate.setDate(alarmDate.getDate() + 1)
      }

      const diff = alarmDate.getTime() - now.getTime()
      if (diff <= 0) {
        playAlarmSound()
        setIsActive(false)
        setTimeUntilAlarm('')
        return
      }

      const hoursUntil = Math.floor(diff / (1000 * 60 * 60))
      const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secondsUntil = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilAlarm(
        `${hoursUntil.toString().padStart(2, '0')}:${minutesUntil.toString().padStart(2, '0')}:${secondsUntil.toString().padStart(2, '0')}`
      )
    }

    calculateTimeUntil()
    const interval = setInterval(calculateTimeUntil, 1000)
    return () => clearInterval(interval)
  }, [isActive, alarmTime, currentTime])

  const handleFontDecrease = () => {
    const newSize = Math.max(60, fontSize - 10)
    setFontSize(newSize)
    localStorage.setItem('clock-font-size', newSize.toString())
  }

  const handleFontIncrease = () => {
    const newSize = Math.min(200, fontSize + 10)
    setFontSize(newSize)
    localStorage.setItem('clock-font-size', newSize.toString())
  }

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true)
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false)
      })
    }
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  const saveSettings = (time?: string, title?: string, sound?: string, loop?: boolean, active?: boolean) => {
    const timeToSave = time || alarmTime
    if (!timeToSave) return

    const match = timeToSave.match(/(\d{1,2}):(\d{2})/)
    if (!match) return

    const [, hours, minutes] = match
    const hourNum = parseInt(hours, 10)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum

    const titleToSave = title || alarmTitle
    const soundToSave = sound || alarmSound
    const loopToSave = loop !== undefined ? loop : alarmLoop
    const activeToSave = active !== undefined ? active : isActive

    // Only add to recently used when alarm is being activated (active=true)
    let newRecentlyUsed = [...recentlyUsed]
    if (activeToSave) {
      // Format: Use title if it contains time format, otherwise use "Alarm HH:MM AM/PM"
      const timeStr = `${hour12}:${minutes} ${period}`
      // Check if title already contains the time format
      const titleHasTime = titleToSave && titleToSave.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
      const formattedTime = titleHasTime ? titleToSave : (titleToSave ? `${titleToSave} ${timeStr}` : `Alarm ${timeStr}`)

      // Remove any existing entry with the same time
      const updated = newRecentlyUsed.filter(t => {
        const tMatch = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (!tMatch) return true
        const [, tHours, tMinutes, tPeriod] = tMatch
        return !(tHours === hour12.toString() && tMinutes === minutes && tPeriod.toUpperCase() === period)
      })
      updated.unshift(formattedTime)
      newRecentlyUsed = updated.slice(0, 10)
    }

    const settingsToSave = {
      time: timeToSave,
      title: titleToSave,
      sound: soundToSave,
      loop: loopToSave,
      isActive: activeToSave,
      recentlyUsed: newRecentlyUsed,
    }

    // Save to page-specific localStorage
    localStorage.setItem('alarm-settings-main', JSON.stringify(settingsToSave))
    // Also update general settings for recently used (shared)
    const generalSettings = {
      recentlyUsed: newRecentlyUsed,
    }
    localStorage.setItem('alarm-settings', JSON.stringify(generalSettings))
    setRecentlyUsed(newRecentlyUsed)

    // Always update URL hash to reflect current alarm settings
    updateUrlHash(timeToSave, titleToSave, activeToSave, soundToSave, loopToSave)

    // Dispatch custom event to notify sidebar of alarm update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('alarm-updated'))
    }
  }

  const handleSetAlarm = (time: string, sound: string, title: string, repeat: boolean) => {
    setAlarmTime(time)
    setAlarmTitle(title)
    setAlarmSound(sound)
    setAlarmLoop(repeat)
    setIsActive(true)
    // Save settings will update localStorage and URL hash with active=true
    saveSettings(time, title, sound, repeat, true)
  }

  const handlePresetClick = (preset: string) => {
    const [time, period] = preset.split(' ')
    const [hours, minutes] = time.split(':')
    // Navigate to /set-alarm-for-[time]/ route
    const urlSlug = `${hours}-${minutes}-${period.toLowerCase()}`
    window.location.href = `/set-alarm-for/${urlSlug}`
  }

  const handleRecentlyUsedClick = (timeStr: string) => {
    if (isEditMode) return // Don't navigate when in edit mode

    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (match) {
      const [, hours, minutes, period] = match
      const hour24 = period.toUpperCase() === 'PM' && parseInt(hours) !== 12
        ? (parseInt(hours) + 12).toString()
        : period.toUpperCase() === 'AM' && parseInt(hours) === 12
          ? '00'
          : hours.padStart(2, '0')
      const time24 = `${hour24}:${minutes}`
      setAlarmTime(time24)
      setAlarmTitle(timeStr)
      // Update URL hash instead of setting alarm active
      updateUrlHash(time24, timeStr, false, alarmSound, alarmLoop)
    }
  }

  const handleDeleteItem = (index: number) => {
    const updated = recentlyUsed.filter((_, i) => i !== index)
    setRecentlyUsed(updated)
    // Update localStorage
    const saved = localStorage.getItem('alarm-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        settings.recentlyUsed = updated
        localStorage.setItem('alarm-settings', JSON.stringify(settings))
      } catch (e) {
        console.error('Failed to update alarm settings', e)
      }
    }
  }

  const handleClearAll = () => {
    setRecentlyUsed([])
    setIsEditMode(false)
    // Update localStorage
    const saved = localStorage.getItem('alarm-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        settings.recentlyUsed = []
        localStorage.setItem('alarm-settings', JSON.stringify(settings))
      } catch (e) {
        console.error('Failed to update alarm settings', e)
      }
    }
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <div className="bg-[#f0f0f0] dark:bg-black min-h-screen" style={{ backgroundColor: '#000' }}>
      <div className="main-content" style={{ padding: '20px' }}>
        {/* Main Clock Panel */}
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default relative rounded" style={{
              height: '550px',
              marginBottom: '10px',
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
                        title: 'TimeTravel',
                        text: 'Check out this online clock!',
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

              {/* Clock Display - Center */}
              <div className="text-center" style={{
                position: 'absolute',
                top: '64%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%'
              }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                  {/* Alarm Status Message - Just above time */}
                  {!isActive && alarmTime && !hasHashParams && (
                    <div style={{ marginBottom: '20px' }}>
                      <div className="text-[#0090dd]" style={{ fontSize: `${Math.round(fontSize * 0.25)}px` }}>Set Alarm for {format(new Date(`2000-01-01T${alarmTime}:00`), 'h:mm a')}</div>
                    </div>
                  )}
                  <DigitalClock time={currentTime} fontSize={fontSize} dateFontSize={Math.round(fontSize * 0.25)} />

                  {/* Action Buttons - Inside centered container, below time */}
                  {!isActive && alarmTime && (
                    <div className="flex gap-3 justify-center px-4" style={{ marginTop: '40px' }}>
                      {/* Only show "Set Alarm" button if hash params are present (enabled=0) */}
                      {hasHashParams ? (
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="bg-[#4aae71] text-white hover:bg-[#59b87e]"
                          style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                        >
                          Set Alarm
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              playAlarmSound()
                              setShowTestDialog(true)
                            }}
                            className="dark:bg-[#1a1a1a] text-gray-800 dark:text-[#eee] dark:hover:bg-[#2a2a2a] border border-gray-300 dark:border-[#777]"
                            style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                          >
                            Test
                          </button>
                          <button
                            onClick={() => setShowEditModal(true)}
                            className="bg-[#0090dd] text-white hover:bg-[#00a1f7]"
                            style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowEditModal(true)}
                            className="bg-[#4aae71] text-white hover:bg-[#59b87e]"
                            style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                          >
                            Set Alarm
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {!isActive && !alarmTime && (
                    <div className="flex justify-center" style={{ marginTop: '40px' }}>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="px-6 py-3 bg-[#4aae71] text-white hover:bg-[#59b87e]"
                        style={{ borderRadius: 0, minWidth: '120px' }}
                      >
                        Set Alarm
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Alarm Info Panel - Outside centered container to avoid affecting centering */}
              {isActive && alarmTime && (
                <div className="row" style={{ display: 'block', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 40px)' }} id="row-alarm">
                  <div className="col-md-12">
                    <div className="panel panel-default">
                      <div className="colored panel-body text-center">
                        <div style={{ paddingBottom: '15px' }}>
                          <h1 id="lbl-alarm-title" className="main-title colored" style={{ fontSize: '32px' }}>
                            {alarmTitle}
                          </h1>
                          <div className="colored" style={{ padding: '5px', fontSize: '43px' }} id="pnl-alarm-time">
                            <span className="icon ci-alarm"></span>{' '}
                            <span id="lbl-alarm-time" className="digit font-digit colored">
                              {alarmTime ? format(new Date(`2000-01-01T${alarmTime}:00`), 'h:mm') : ''}
                            </span>
                          </div>
                          {timeUntilAlarm && (
                            <div className="colored" id="pnl-alarm-timer" style={{ fontSize: '21px' }}>
                              <span className="icon ci-timer"></span>{' '}
                              <span id="lbl-alarm-timer" className="digit font-digit colored">
                                {timeUntilAlarm}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-space btn-danger"
                          style={{ display: 'inline-block' }}
                          id="btn-stop-alarm"
                          onClick={() => {
                            setIsActive(false)
                            // Save the inactive state using saveSettings (which updates hash)
                            saveSettings(undefined, undefined, undefined, undefined, false)
                          }}
                        >
                          Stop Alarm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <AdPlaceholder position="top" />

        {/* Preset Times and Recently Used */}
        <div className="row" id="pnl-links" style={{ marginTop: '0' }}>
          <div className="col-lg-6 mb-4">
            <div className="panel panel-default dark:bg-[#111] border border-[#ddd] dark:border-transparent rounded">
              <div className="panel-heading dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium">
                Set the alarm for the specified time
              </div>
              <div className="panel-body">
                <div className="flex flex-wrap gap-2">
                  {presetTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handlePresetClick(time)}
                      className="btn btn-space btn-classic btn-primary"
                      style={{
                        width: '90px',
                        padding: '8px 16px',
                        backgroundColor: '#0090dd',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0',
                        cursor: 'pointer',
                        marginRight: '5px',
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="panel panel-default dark:bg-[#111] border border-[#ddd] dark:border-transparent rounded">
              <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ position: 'relative' }}>
                <div className="tools" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
                  <span
                    className={`icon ${isEditMode ? 'ci-check' : 'ci-edit'}`}
                    id="btn-edit-history"
                    onClick={toggleEditMode}
                    style={{ cursor: 'pointer', color: isEditMode ? '#0090dd' : 'inherit' }}
                    title={isEditMode ? 'Done' : 'Edit'}
                  ></span>
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
                      fontSize: '14px',
                      padding: '4px 8px'
                    }}
                  >
                    Clear all
                  </button>
                )}
                Recently used
              </div>
              <div className="panel-body">
                {recentlyUsed.length === 0 ? (
                  <p className="text-[#777] dark:text-[#9d9d9d] text-sm">No recent alarms</p>
                ) : (
                  <table className="table table-history" style={{ width: '100%', marginBottom: 0 }}>
                    <tbody>
                      {recentlyUsed.slice(0, 10).map((item, index) => {
                        const match = item.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
                        let time24 = ''
                        if (match) {
                          const [, hours, minutes, period] = match
                          const hour24 = period.toUpperCase() === 'PM' && parseInt(hours) !== 12
                            ? (parseInt(hours) + 12).toString()
                            : period.toUpperCase() === 'AM' && parseInt(hours) === 12
                              ? '00'
                              : hours.padStart(2, '0')
                          time24 = `${hour24}:${minutes}`
                        }
                        return (
                          <tr key={index}>
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleRecentlyUsedClick(item)
                                }}
                                style={{
                                  color: '#0090dd',
                                  textDecoration: 'none',
                                  cursor: isEditMode ? 'default' : 'pointer'
                                }}
                              >
                                {item}
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
                                      borderRadius: '50%',
                                      backgroundColor: '#0090dd'
                                    }}
                                    title="Delete"
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

        {/* How to use section */}
        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="panel panel-default dark:bg-[#111] border border-[#ddd] dark:border-transparent rounded">
              <div className="panel-heading dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium">
                How to use the online alarm clock
              </div>
              <div className="panel-body text-[#555] dark:text-[#eee]">
                <p style={{ marginBottom: '15px' }}>
                  Set the hour and minute for the online alarm clock. The alarm message will appear,
                  and the preselected sound will be played at the set time.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  When setting the alarm, you can click the &quot;Test&quot; button to preview the alert and
                  check the sound volume.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  You can configure the alarm clock appearance (text color, type, and size), and these
                  settings will be saved; they will be used when you open your web browser next time.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  The online alarm clock will not work if you close your browser or shut down your
                  computer, but it can work without an internet connection.
                </p>
                <p style={{ marginBottom: '0' }}>
                  You can add links to online alarm clocks with different time settings to your
                  browser&apos;s Favorites. Opening such a link will set the alarm clock to the predefined
                  time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditAlarmModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onStart={handleSetAlarm}
        initialTime={alarmTime || '07:00'}
        initialTitle={alarmTitle || 'Alarm 7:00 AM'}
        initialSound={alarmSound || 'childhood'}
        initialLoop={alarmLoop}
      />

      <TestAlarmDialog
        isOpen={showTestDialog}
        onClose={() => setShowTestDialog(false)}
        alarmTime={alarmTime || '07:00'}
      />


    </div>
  )
}
