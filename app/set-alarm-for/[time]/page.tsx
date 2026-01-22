'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
          <div className="text-center">
            <div className="i-circle text-danger" style={{ pointerEvents: 'none' }}>
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

export default function SetAlarmForPage() {
  const params = useParams()
  const router = useRouter()
  const [alarmTime, setAlarmTime] = useState('')
  const [alarmTitle, setAlarmTitle] = useState('Alarm')
  const [isActive, setIsActive] = useState(false)
  const [alarmSound, setAlarmSound] = useState('Bells')
  const [alarmLoop, setAlarmLoop] = useState(false)
  const [timeUntilAlarm, setTimeUntilAlarm] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [fontSize, setFontSize] = useState(128)
  const [currentUrl, setCurrentUrl] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  // Load page-specific alarm settings from localStorage on mount
  useEffect(() => {
    // Set page title based on time parameter
    if (params?.time) {
      const timeStr = params.time as string
      const match = timeStr.match(/(\d+)-(\d+)-(am|pm)/i)
      if (match) {
        const [, hours, minutes, period] = match
        const hourNum = parseInt(hours, 10)
        const displayTime = `${hourNum}:${minutes.padStart(2, '0')} ${period.toUpperCase()}`
        document.title = `Set Alarm for ${displayTime} - Online Alarm Clock - TimeTravel`
      } else {
        document.title = 'Set Alarm - Online Alarm Clock - TimeTravel'
      }
    } else {
      document.title = 'Set Alarm - Online Alarm Clock - vClock'
    }
    
    // Get page-specific key based on URL parameter
    const pageKey = params?.time ? `alarm-settings-${params.time}` : null
    let hasActiveAlarm = false
    
    if (pageKey) {
      const saved = localStorage.getItem(pageKey)
      if (saved) {
        try {
          const savedSettings = JSON.parse(saved)
          // If there's an active alarm for this page, restore it
          if (savedSettings.isActive && savedSettings.time) {
            setAlarmTime(savedSettings.time)
            setAlarmTitle(savedSettings.title || 'Alarm')
            setAlarmSound(savedSettings.sound || 'Bells')
            setAlarmLoop(savedSettings.loop || false)
            setIsActive(true)
            hasActiveAlarm = true
            // Update URL hash to reflect active alarm
            updateUrlHash(
              savedSettings.time,
              savedSettings.title || 'Alarm',
              true,
              savedSettings.sound || 'Bells',
              savedSettings.loop || false
            )
          }
        } catch (e) {
          console.error('Failed to load alarm settings', e)
        }
      }
    }

    // Only parse URL params if no active alarm in localStorage
    if (!hasActiveAlarm && params?.time) {
      const timeStr = params.time as string
      // Parse format like "4-30-am" or "4-30-pm"
      const match = timeStr.match(/(\d+)-(\d+)-(am|pm)/i)
      if (match) {
        const [, hours, minutes, period] = match
        const hourNum = parseInt(hours, 10)
        const hour24 = period.toUpperCase() === 'PM' && hourNum !== 12
          ? (hourNum + 12).toString().padStart(2, '0')
          : period.toUpperCase() === 'AM' && hourNum === 12
            ? '00'
            : hourNum.toString().padStart(2, '0')
        const time24 = `${hour24}:${minutes.padStart(2, '0')}`
        setAlarmTime(time24)
        setAlarmTitle(`Alarm ${hourNum}:${minutes.padStart(2, '0')} ${period.toUpperCase()}`)
        setIsActive(false) // URL params don't auto-activate
      }
    }
  }, [params])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const savedFontSize = localStorage.getItem('clock-font-size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10))
    }
    
    // Set current URL
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  // Calculate time until alarm
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

      // If alarm time has passed today, set for tomorrow
      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1)
      }

      const diff = alarmDate.getTime() - now.getTime()
      const totalSeconds = Math.floor(diff / 1000)
      const hoursUntil = Math.floor(totalSeconds / 3600)
      const minutesUntil = Math.floor((totalSeconds % 3600) / 60)
      const secondsUntil = totalSeconds % 60

      setTimeUntilAlarm(
        `${hoursUntil.toString().padStart(2, '0')}:${minutesUntil.toString().padStart(2, '0')}:${secondsUntil.toString().padStart(2, '0')}`
      )
    }

    calculateTimeUntil()
    const interval = setInterval(calculateTimeUntil, 1000)
    return () => clearInterval(interval)
  }, [isActive, alarmTime, currentTime])

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

  // Save settings to page-specific localStorage
  const saveSettings = (time: string, title: string, sound: string, loop: boolean, active: boolean) => {
    const pageKey = params?.time ? `alarm-settings-${params.time}` : null
    if (!pageKey) return
    
    const settingsToSave = {
      time: time,
      title: title,
      sound: sound,
      loop: loop,
      isActive: active,
      recentlyUsed: [],
    }
    
    localStorage.setItem(pageKey, JSON.stringify(settingsToSave))
    updateUrlHash(time, title, active, sound, loop)
  }

  const handleSetAlarm = (time: string, sound: string, title: string, repeat: boolean) => {
    setAlarmTime(time)
    setAlarmTitle(title)
    setAlarmSound(sound)
    setAlarmLoop(repeat)
    setIsActive(true)
    saveSettings(time, title, sound, repeat, true)
    updateUrlHash(time, title, true, sound, repeat)
  }

  const handleSetAlarmDirectly = () => {
    // Set alarm directly without opening modal
    handleSetAlarm(alarmTime, 'Bells', alarmTitle, false)
  }

  const handleTest = () => {
    playAlarmSound()
    setShowTestDialog(true)
  }

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
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Share popup function
  const sharePopup = (platform: string) => {
    if (typeof window === 'undefined') return
    
    const url = encodeURIComponent(currentUrl)
    const title = encodeURIComponent(`Set Alarm for ${displayTime}`)
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`
        break
      case 'blogger':
        shareUrl = `https://www.blogger.com/blog-this.g?u=${url}&n=${title}`
        break
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`
        break
      case 'tumblr':
        shareUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=${title}`
        break
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'livejournal':
        shareUrl = `https://www.livejournal.com/update.bml?subject=${title}&event=${url}`
        break
      default:
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, 'share', 'width=600,height=400,resizable=yes,scrollbars=yes')
    }
  }

  const [showEmbedModal, setShowEmbedModal] = useState(false)

  if (!alarmTime) {
    return <div className="bg-black min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  const [hours, minutes] = alarmTime.split(':').map(Number)
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`

  return (
    <div className="bg-[#f0f0f0] dark:bg-black min-h-screen" style={{ backgroundColor: '#000' }}>
      <div className="main-content p-5">
        {/* Main Clock Panel */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default relative rounded" style={{
              height: '714px',
              marginBottom: '22px',
              backgroundColor: '#000',
              border: 'none',
              position: 'relative'
            }}>
              {/* Panel Tools */}
              <div className="panel-tools" id="pnl-tools" style={{ margin: '15px' }}>
                <span
                  className="icon ci-share"
                  title="Share"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'TimeTravel',
                        text: 'Check out this online alarm!',
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
                  style={{ cursor: 'pointer' }}
                ></span>
              </div>

              {/* Clock Display - Center */}
              <div className="text-center" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%'
              }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                  {/* Alarm Status Message - Just above time */}
                  {!isActive && (
                    <div style={{ marginBottom: '20px' }}>
                      <div className="text-[#0090dd]" style={{ fontSize: `${Math.round(fontSize * 0.25)}px` }}>Set Alarm for {displayTime}</div>
                    </div>
                  )}
                  <DigitalClock time={currentTime} fontSize={fontSize} dateFontSize={Math.round(fontSize * 0.25)} />
                  
                  {/* Alarm Info Panel - Just below date and time */}
                  {isActive && alarmTime && (
                    <div className="row" style={{ display: 'block', marginTop: '60px' }} id="row-alarm">
                      <div className="col-md-12">
                        <div className="panel panel-default">
                          <div className="colored panel-body text-center">
                            <div style={{ paddingBottom: '15px' }}>
                              <h1 id="lbl-alarm-title" className="main-title" style={{ fontSize: '32px' }}>
                                {alarmTitle}
                              </h1>
                              <div style={{ padding: '5px', fontSize: '43px' }} id="pnl-alarm-time">
                                <span className="icon ci-alarm"></span>{' '}
                                <span id="lbl-alarm-time" className="digit font-digit">
                                  {alarmTime ? format(new Date(`2000-01-01T${alarmTime}:00`), 'h:mm') : ''}
                                </span>
                              </div>
                              {timeUntilAlarm && (
                                <div id="pnl-alarm-timer" style={{ fontSize: '21px' }}>
                                  <span className="icon ci-timer"></span>{' '}
                                  <span id="lbl-alarm-timer" className="digit font-digit">
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
                                // Save the inactive state to localStorage
                                saveSettings(alarmTime, alarmTitle, alarmSound, alarmLoop, false)
                                updateUrlHash(alarmTime, alarmTitle, false, alarmSound, alarmLoop)
                              }}
                            >
                              Stop Alarm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons - Close to date */}
                  {!isActive && (
                    <div className="flex gap-3 justify-center px-4" style={{ marginTop: '60px' }}>
                      <button
                        onClick={handleTest}
                        className="dark:bg-[#1a1a1a] text-gray-800 dark:text-[#eee] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] border border-gray-300 dark:border-[#777]"
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
                        onClick={handleSetAlarmDirectly}
                        className="bg-[#4aae71] text-white hover:bg-[#59b87e]"
                        style={{ borderRadius: 0, minWidth: '100px', padding: '8px 16px', fontSize: '14px' }}
                      >
                        Set Alarm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditAlarmModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onStart={handleSetAlarm}
        initialTime={alarmTime}
        initialTitle={alarmTitle}
        initialSound="Bells"
        initialLoop={false}
      />

      <TestAlarmDialog
        isOpen={showTestDialog}
        onClose={() => setShowTestDialog(false)}
        alarmTime={alarmTime}
      />

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#484747] w-full" style={{ borderRadius: 0, maxWidth: '600px' }}>
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <h2 className="text-xl font-bold text-white">Embed</h2>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <p className="text-white mb-3">Copy and paste this code into your website:</p>
              <textarea
                readOnly
                value={`<iframe src="${currentUrl}" width="600" height="400" frameborder="0"></iframe>`}
                className="w-full p-3 bg-[#333] text-white border border-gray-600"
                rows={3}
                style={{ borderRadius: '0' }}
                onClick={(e) => {
                  (e.target as HTMLTextAreaElement).select()
                  navigator.clipboard.writeText((e.target as HTMLTextAreaElement).value)
                  alert('Embed code copied to clipboard!')
                }}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    const embedCode = `<iframe src="${currentUrl}" width="600" height="400" frameborder="0"></iframe>`
                    navigator.clipboard.writeText(embedCode)
                    alert('Embed code copied to clipboard!')
                  }}
                  className="px-6 py-2 bg-[#0090dd] text-white hover:bg-[#00a1f7]"
                  style={{ borderRadius: '0' }}
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdPlaceholder position="top" />

      {/* Bottom Sections */}
      <div className="main-content p-5">
        {/* Set the alarm for the specified time section */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default dark:bg-[#111] mb-6">
          <div className="panel-heading bg-[#f8f8f8] dark:bg-[#111] text-[#555] dark:text-[#eee] font-medium" style={{ fontSize: '21px', fontWeight: 400, position: 'relative' }}>
            Set the alarm for the specified time
          </div>
          <div className="panel-body p-4">
            {/* Row 1: One-minute increments around the page time */}
            <div className="flex flex-wrap gap-2 mb-4 pb-5 border-b border-[#ddd] dark:border-[#777]">
              {Array.from({ length: 12 }, (_, i) => {
                const baseHour = hours
                const baseMin = minutes
                const minOffset = i - 5 // -5 to +6 minutes around page time
                let totalMins = baseHour * 60 + baseMin + minOffset
                // Handle negative minutes
                while (totalMins < 0) totalMins += 24 * 60
                const h = Math.floor(totalMins / 60) % 24
                const m = totalMins % 60
                const period = h >= 12 ? 'PM' : 'AM'
                const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
                const timeStr = `${h12}:${m.toString().padStart(2, '0')} ${period}`
                const urlSlug = `${h12}-${m.toString().padStart(2, '0')}-${period.toLowerCase()}`
                return (
                  <a
                    key={i}
                    href={`/set-alarm-for/${urlSlug}`}
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
                      fontSize: '14px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      textAlign: 'center'
                    }}
                  >
                    {timeStr}
                  </a>
                )
              })}
            </div>

            {/* Row 2: Five-minute increments */}
            <div className="flex flex-wrap gap-2 mb-4 pb-5 border-b border-[#ddd] dark:border-[#777]">
              {Array.from({ length: 12 }, (_, i) => {
                const baseHour = hours
                const baseMin = Math.floor(minutes / 5) * 5
                const minOffset = (i - 5) * 5 // -25 to +30 minutes in 5-min steps
                let totalMins = baseHour * 60 + baseMin + minOffset
                // Handle negative minutes
                while (totalMins < 0) totalMins += 24 * 60
                const h = Math.floor(totalMins / 60) % 24
                const m = totalMins % 60
                const period = h >= 12 ? 'PM' : 'AM'
                const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
                const timeStr = `${h12}:${m.toString().padStart(2, '0')} ${period}`
                const urlSlug = `${h12}-${m.toString().padStart(2, '0')}-${period.toLowerCase()}`
                return (
                  <a
                    key={i}
                    href={`/set-alarm-for/${urlSlug}`}
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
                      fontSize: '14px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      textAlign: 'center'
                    }}
                  >
                    {timeStr}
                  </a>
                )
              })}
            </div>

            {/* Row 3: Hourly AM times */}
            <div className="flex flex-wrap gap-2 mb-3">
              {Array.from({ length: 12 }, (_, i) => {
                const h = i
                const period = 'AM'
                const h12 = h === 0 ? 12 : h
                const timeStr = `${h12}:00 ${period}`
                const urlSlug = `${h12}-00-${period.toLowerCase()}`
                return (
                  <a
                    key={i}
                    href={`/set-alarm-for/${urlSlug}`}
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
                      fontSize: '14px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      textAlign: 'center'
                    }}
                  >
                    {timeStr}
                  </a>
                )
              })}
            </div>

            {/* Row 4: Hourly PM times */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const h = i + 12
                const period = 'PM'
                const h12 = h === 12 ? 12 : h - 12
                const timeStr = `${h12}:00 ${period}`
                const urlSlug = `${h12}-00-${period.toLowerCase()}`
                return (
                  <a
                    key={i}
                    href={`/set-alarm-for/${urlSlug}`}
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
                      fontSize: '14px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      textAlign: 'center'
                    }}
                  >
                    {timeStr}
                  </a>
                )
              })}
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Wake me up at [time] section */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default dark:bg-[#111] mb-6">
          <div className="panel-body p-4">
            <h2 className="text-2xl mb-4 pb-4 text-[#555] dark:text-[#eee] border-b border-[#ddd] dark:border-[#777]" style={{ fontWeight: 400 }}>Wake me up at {displayTime}</h2>
            <p className="mb-3 text-[#555] dark:text-[#eee]">
              Set the alarm for {displayTime}. Set my alarm for {displayTime}. This free alarm clock will wake you up in time.
            </p>
            <p className="mb-3 text-[#555] dark:text-[#eee]">
              Set the hour and minute for the online alarm clock. The alarm message will appear, and the preselected sound will be played at the set time.
            </p>
            <p className="mb-3 text-[#555] dark:text-[#eee]">
              When setting the alarm, you can click the &quot;Test&quot; button to preview the alert and check the sound volume.
            </p>
          </div>
            </div>
          </div>
        </div>

        {/* URL and Social Sharing section */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default dark:bg-[#111] mb-6">
          <div className="panel-body p-4">
            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="bg-gray-200 dark:bg-[#333] p-3 rounded mb-2" style={{ width: '100%', position: 'relative' }}>
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="w-full bg-transparent text-[#555] dark:text-[#eee] border-none outline-none cursor-pointer text-center"
                  style={{ textAlign: 'center' }}
                  onClick={(e) => {
                    (e.target as HTMLInputElement).select()
                    navigator.clipboard.writeText(currentUrl).then(() => {
                      setLinkCopied(true)
                      setTimeout(() => {
                        setLinkCopied(false)
                      }, 2000)
                    })
                  }}
                />
              </div>
              {linkCopied && (
                <div className="flex items-center gap-2 mb-2" style={{ height: '24px' }}>
                  <span className="icon ci-check text-[#4aae71]" style={{ fontSize: '16px' }}></span>
                  <span className="text-[#4aae71] text-sm">Copied</span>
                </div>
              )}
              <ul className="list-none flex items-center gap-2 flex-wrap p-0 m-0" style={{ display: 'flex', justifyContent: 'center' }}>
                <li>
                  <button
                    onClick={() => sharePopup('facebook')}
                    className="btn-share"
                    title="Share to Facebook. Opens in a new window."
                  >
                    <span className="share-icon share-icon-facebook"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('twitter')}
                    className="btn-share"
                    title="Share to Twitter. Opens in a new window."
                  >
                    <span className="share-icon share-icon-twitter"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('whatsapp')}
                    className="btn-share"
                    title="Share to WhatsApp. Opens in a new window."
                  >
                    <span className="share-icon share-icon-whatsapp"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('blogger')}
                    className="btn-share"
                    title="Share to Blogger. Opens in a new window."
                  >
                    <span className="share-icon share-icon-blogger"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('reddit')}
                    className="btn-share"
                    title="Share to reddit. Opens in a new window."
                  >
                    <span className="share-icon share-icon-reddit"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('tumblr')}
                    className="btn-share"
                    title="Share to Tumblr. Opens in a new window."
                  >
                    <span className="share-icon share-icon-tumblr"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('pinterest')}
                    className="btn-share"
                    title="Share to Pinterest. Opens in a new window."
                  >
                    <span className="share-icon share-icon-pinterest"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('linkedin')}
                    className="btn-share"
                    title="Share to LinkedIn. Opens in a new window."
                  >
                    <span className="share-icon share-icon-linkedin"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => sharePopup('livejournal')}
                    className="btn-share"
                    title="Share to LiveJournal. Opens in a new window."
                  >
                    <span className="share-icon share-icon-livejournal"></span>
                  </button>
                </li>
                <li className="hidden-xs">
                  <button
                    onClick={() => setShowEmbedModal(true)}
                    className="btn btn-primary btn-embed"
                    style={{ borderRadius: '0' }}
                  >
                    Embed
                  </button>
                </li>
              </ul>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
