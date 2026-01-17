'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getCityByFullSlug, getCityFullSlug } from '@/data/cities'
import { formatInTimeZone } from 'date-fns-tz'
import { format } from 'date-fns'
import { DigitalClock } from '@/components/DigitalClock'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import Link from 'next/link'

interface PageProps {
  params: {
    city: string
  }
}

export default function CityTimePage({ params }: PageProps) {
  const city = getCityByFullSlug(params.city)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [fontSize, setFontSize] = useState(128)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { is24Hour } = useTimeFormat()

  useEffect(() => {
    if (!city) return

    // Set page title
    document.title = `${city.name} Time - Current Local Time in ${city.name}, ${city.country} | TimeTravel`

    // Load saved font size
    const savedFontSize = localStorage.getItem('clock-font-size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10))
    }

    // Load saved color from localStorage and set CSS variable
    const savedColor = localStorage.getItem('digit-color')
    if (savedColor) {
      document.documentElement.style.setProperty('--digit-color', savedColor)
    } else {
      // Set default color if none saved
      document.documentElement.style.setProperty('--digit-color', '#1976D2')
    }

    // Listen for color changes
    const handleColorChange = () => {
      const color = localStorage.getItem('digit-color') || '#1976D2'
      document.documentElement.style.setProperty('--digit-color', color)
    }
    window.addEventListener('color-changed', handleColorChange)

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
      window.removeEventListener('color-changed', handleColorChange)
    }
  }, [city])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (!city) {
    notFound()
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

  const cityTime = formatInTimeZone(currentTime, city.timezone, is24Hour ? 'HH:mm:ss' : 'h:mm:ss a')
  const localTime = currentTime
  const cityTimeDate = new Date(formatInTimeZone(currentTime, city.timezone, 'yyyy-MM-dd HH:mm:ss'))
  const diffMs = cityTimeDate.getTime() - localTime.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  let timeOffset = ''
  if (diffHours === 0) {
    timeOffset = 'Today, 0 H'
  } else if (diffHours > 0) {
    timeOffset = `Today, +${diffHours} H`
  } else {
    timeOffset = `Yesterday, ${diffHours} H`
  }

  // Get timezone offset
  const timezoneOffset = formatInTimeZone(currentTime, city.timezone, 'xxx') // e.g., "-05:00"
  const offsetHours = Math.floor(Math.abs(parseInt(timezoneOffset.split(':')[0])))
  const offsetSign = timezoneOffset.startsWith('-') ? '-' : '+'
  const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:00`

  // EST/EDT detection (simplified)
  const isDST = cityTimeDate.getTimezoneOffset() < new Date(currentTime.getFullYear(), 0, 1).getTimezoneOffset()
  const standardOffset = offsetSign === '-' ? offsetHours : offsetHours
  const daylightOffset = standardOffset + 1

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const sharePopup = (platform: string) => {
    const url = encodeURIComponent(currentUrl)
    const title = encodeURIComponent(`Current time in ${city.name}, ${city.country}`)
    const text = encodeURIComponent(`Check out the current time in ${city.name}!`)

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      blogger: `https://www.blogger.com/blog-this.g?u=${url}&n=${title}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${title}`,
      tumblr: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=${title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      livejournal: `https://www.livejournal.com/update.bml?subject=${title}&event=${url}`,
    }

    const shareUrl = shareUrls[platform]
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const copyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(currentUrl)
      // Show copied message
      const button = document.getElementById('copy-url-btn')
      if (button) {
        const originalText = button.textContent
        button.textContent = 'Copied!'
        button.style.color = '#0090dd'
        setTimeout(() => {
          button.textContent = originalText
          button.style.color = ''
        }, 2000)
      }
    }
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="main-content p-5">
        {/* Main Clock Panel */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default relative" style={{
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
                        title: `Current time in ${city.name}, ${city.country}`,
                        text: `Check out the current time in ${city.name}!`,
                        url: currentUrl
                      }).catch(err => console.log('Error sharing:', err))
                    } else {
                      navigator.clipboard.writeText(currentUrl)
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

              {/* City Name and Clock Display */}
              <div className="text-center" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%'
              }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                  <h1 className="colored" style={{ fontSize: '24px', fontWeight: 400, marginBottom: '20px' }}>{city.name}</h1>
                  <DigitalClock 
                    time={cityTimeDate} 
                    fontSize={fontSize} 
                    dateFontSize={Math.round(fontSize * 0.25)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="row">
          <div className="col-md-12">
            {/* Current Time Information */}
            <div className="panel panel-default mb-4" style={{ backgroundColor: '#111', border: 'none', padding: '20px' }}>
              <h2 className="colored mb-4" style={{ fontSize: '24px', fontWeight: 400 }}>
                Current time in {city.name}, {city.country}
              </h2>
              <div className="text-[#9d9d9d] mb-3" style={{ fontSize: '14px' }}>
                <div className="mb-2">Local Clock Offset: {timeOffset}</div>
                <div className="mb-2">Time zone: (UTC/GMT {offsetString}) {city.timezone}</div>
                <div className="mb-2">Standard Time Zone: {city.timezone.includes('New_York') ? 'Eastern Standard Time (EST) = UTC-5' : 
                  city.timezone.includes('Los_Angeles') ? 'Pacific Standard Time (PST) = UTC-8' :
                  city.timezone.includes('Chicago') ? 'Central Standard Time (CST) = UTC-6' :
                  city.timezone.includes('Denver') ? 'Mountain Standard Time (MST) = UTC-7' :
                  'Standard Time'}
                </div>
                <div className="mb-4">
                  Daylight Saving Time Zone: {city.timezone.includes('New_York') ? 'Eastern Daylight Time (EDT) = UTC-4' :
                  city.timezone.includes('Los_Angeles') ? 'Pacific Daylight Time (PDT) = UTC-7' :
                  city.timezone.includes('Chicago') ? 'Central Daylight Time (CDT) = UTC-5' :
                  city.timezone.includes('Denver') ? 'Mountain Daylight Time (MDT) = UTC-6' :
                  'Daylight Time'}
                </div>
                <p className="text-white mb-2" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {city.name === 'New York' && 'New York is a state in the Northeastern United States. New York is the 27th-most extensive, fourth-most populous, and seventh-most densely populated U.S. state. New York is bordered by New Jersey and Pennsylvania to the south, and by Connecticut, Massachusetts, and Vermont to the east. The state has a maritime border with Rhode Island, east of Long Island, as well as an international border with the Canadian provinces of Quebec to the north and Ontario to the northwest.'}
                  {city.name !== 'New York' && `Information about ${city.name}, ${city.country}.`}
                </p>
                <a 
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(city.name === 'New York' ? 'New_York_(state)' : city.name === 'Mexico City' ? 'Mexico_City' : city.name === 'São Paulo' ? 'São_Paulo' : city.name.replace(/\s+/g, '_'))}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0090dd] hover:underline"
                  style={{ fontSize: '14px' }}
                >
                  From Wikipedia
                </a>
              </div>
            </div>

            {/* What time is it section */}
            <div className="panel panel-default mb-4" style={{ backgroundColor: '#111', border: 'none', padding: '20px' }}>
              <h3 className="text-white mb-4" style={{ fontSize: '20px', fontWeight: 400 }}>
                What time is it in {city.name} right now?
              </h3>
              <div className="text-[#9d9d9d]" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <p className="mb-3">
                  This website allows you to find out the current time and date in any country and city in the world. You can also view the time difference between your location and that of another city.
                </p>
                <p className="mb-3">
                  The homepage displays the clock with your computer&apos;s time and date, and a list with the clock for the major cities in the world. You can modify this list as you wish. For instance, you can add or remove cities from the list, change their order, or select another city from the list to view its clock on the homepage.
                </p>
                <p>
                  You can configure the clock&apos;s appearance (text color, type, and size). These settings will be saved; they will be used when you open the website the next time.
                </p>
              </div>
            </div>

            {/* URL and Social Sharing */}
            <div className="panel panel-default mb-4" style={{ backgroundColor: '#111', border: 'none', padding: '20px' }}>
              <div className="mb-4">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  onClick={copyUrl}
                  className="w-full p-2 bg-[#1a1a1a] border border-[#777] text-white text-center"
                  style={{ borderRadius: 0, fontSize: '14px', cursor: 'pointer' }}
                />
                <button
                  id="copy-url-btn"
                  onClick={copyUrl}
                  className="mt-2 text-[#9d9d9d] hover:text-[#0090dd] text-sm"
                  style={{ display: 'block', margin: '4px auto 0' }}
                >
                  Click to copy
                </button>
              </div>
              
              <div className="panel-share">
                <ul className="flex flex-wrap gap-2 justify-center items-center list-none p-0 m-0">
                  <li>
                    <button onClick={() => sharePopup('facebook')} className="btn-share" title="Share to Facebook">
                      <span className="share-icon share-icon-facebook"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('twitter')} className="btn-share" title="Share to Twitter">
                      <span className="share-icon share-icon-twitter"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('whatsapp')} className="btn-share" title="Share to WhatsApp">
                      <span className="share-icon share-icon-whatsapp"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('blogger')} className="btn-share" title="Share to Blogger">
                      <span className="share-icon share-icon-blogger"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('reddit')} className="btn-share" title="Share to Reddit">
                      <span className="share-icon share-icon-reddit"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('tumblr')} className="btn-share" title="Share to Tumblr">
                      <span className="share-icon share-icon-tumblr"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('pinterest')} className="btn-share" title="Share to Pinterest">
                      <span className="share-icon share-icon-pinterest"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('linkedin')} className="btn-share" title="Share to LinkedIn">
                      <span className="share-icon share-icon-linkedin"></span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => sharePopup('livejournal')} className="btn-share" title="Share to LiveJournal">
                      <span className="share-icon share-icon-livejournal"></span>
                    </button>
                  </li>
                  <li>
                    <button className="btn btn-primary btn-embed" style={{ borderRadius: 0, padding: '6px 12px', fontSize: '14px' }}>
                      Embed
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Ad Section */}
            <AdPlaceholder position="top" />
          </div>
        </div>
      </div>
    </div>
  )
}
