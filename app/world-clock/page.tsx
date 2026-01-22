'use client'

import { useState, useEffect } from 'react'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { DigitalClock } from '@/components/DigitalClock'
import { cities, City, getCityFullSlug } from '@/data/cities'
import { getAllCountries, getTimezonesForCountry, getTimezoneOffsetLabel } from '@/data/countries-timezones'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { formatInTimeZone } from 'date-fns-tz'
import { format } from 'date-fns'
import Link from 'next/link'

export default function WorldClockPage() {
  const [selectedCities, setSelectedCities] = useState<City[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [fontSize, setFontSize] = useState(128)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ citySlug: string; x: number; y: number } | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedTimezone, setSelectedTimezone] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const { is24Hour } = useTimeFormat()

  useEffect(() => {
    // Set page title
    document.title = 'World Clock - Online World Clock - TimeTravel'
    
    // Load saved font size
    const savedFontSize = localStorage.getItem('clock-font-size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10))
    }

    // Load saved cities
    const saved = localStorage.getItem('world-clock-cities')
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        // Check if it's the old format (array of slugs) or new format (array of city objects)
        if (Array.isArray(savedData) && savedData.length > 0) {
          if (typeof savedData[0] === 'string') {
            // Old format: array of slugs - migrate to new format
            const savedCities = savedData
              .map((slug: string) => cities.find((c) => c.slug === slug))
              .filter(Boolean) as City[]
            setSelectedCities(savedCities)
            // Save in new format
            localStorage.setItem('world-clock-cities', JSON.stringify(savedCities))
          } else {
            // New format: array of city objects
            setSelectedCities(savedData as City[])
          }
        }
      } catch (e) {
        console.error('Failed to load saved cities', e)
      }
    } else {
      // Default cities if none saved - matching the screenshot order
      const defaultCitySlugs = [
        'new-york', 'chicago', 'denver', 'los-angeles',
        'phoenix', 'anchorage', 'honolulu', 'toronto',
        'london', 'sydney', 'manila', 'singapore',
        'tokyo', 'beijing', 'berlin', 'mexico-city',
        'buenos-aires', 'dubai'
      ]
      const defaultCities = defaultCitySlugs
        .map((slug) => cities.find((c) => c.slug === slug))
        .filter(Boolean) as City[]
      setSelectedCities(defaultCities)
      localStorage.setItem('world-clock-cities', JSON.stringify(defaultCities))
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Close context menu on outside click
  useEffect(() => {
    if (contextMenu) {
      const handleClickOutside = () => {
        setContextMenu(null)
      }
      // Small delay to prevent immediate closure
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)
      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [contextMenu])

  const addCity = (city: City) => {
    if (!selectedCities.find((c) => c.slug === city.slug)) {
      const newCities = [...selectedCities, city]
      setSelectedCities(newCities)
      localStorage.setItem('world-clock-cities', JSON.stringify(newCities))
      setShowAddModal(false)
    }
  }

  const handleOpenAddModal = () => {
    setSelectedCountry('')
    setSelectedTimezone('')
    setTitle('')
    setShowAddModal(true)
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    const timezones = getTimezonesForCountry(country)
    if (timezones.length > 0) {
      const firstTimezone = timezones[0]
      setSelectedTimezone(`${firstTimezone.timezone}|${firstTimezone.city}`)
      setTitle(`${firstTimezone.city}, ${country}`)
    } else {
      setSelectedTimezone('')
      setTitle('')
    }
  }

  const handleTimezoneChange = (value: string) => {
    // Value format: "timezone|city" or just "timezone" for backward compatibility
    const [timezone, cityName] = value.includes('|') ? value.split('|') : [value, '']
    // Store the full value for dropdown matching
    setSelectedTimezone(value)
    if (selectedCountry) {
      const timezones = getTimezonesForCountry(selectedCountry)
      let tzData
      if (cityName) {
        // Find the specific city if provided
        tzData = timezones.find((tz) => tz.timezone === timezone && tz.city === cityName)
      } else {
        // Fallback to first match
        tzData = timezones.find((tz) => tz.timezone === timezone)
      }
      if (tzData) {
        setTitle(`${tzData.city}, ${selectedCountry}`)
      }
    }
  }

  const handleAddConfirm = () => {
    if (!selectedCountry || !selectedTimezone || !title) {
      console.warn('Missing required fields:', { selectedCountry, selectedTimezone, title })
      return
    }

    // Extract timezone from selectedTimezone (format: "timezone|city" or just "timezone")
    const [timezone] = selectedTimezone.includes('|') ? selectedTimezone.split('|') : [selectedTimezone]
    
    // Extract city name from title (format: "City, Country")
    const cityName = title.split(',')[0]?.trim() || title.trim()
    
    // Generate slug from city name and country
    const slug = `${cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${selectedCountry.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
    
    const newCity: City = {
      name: cityName,
      country: selectedCountry,
      timezone: timezone,
      slug: slug,
    }

    // Check if city already exists in selectedCities by name and country (not timezone, since multiple cities can share timezone)
    const exists = selectedCities.find((c) => c.name === cityName && c.country === selectedCountry)
    if (exists) {
      console.warn('City already exists:', newCity)
      // Still close the modal
      setShowAddModal(false)
      setSelectedCountry('')
      setSelectedTimezone('')
      setTitle('')
      return
    }

    // Add the new city
    const newCities = [...selectedCities, newCity]
    setSelectedCities(newCities)
    localStorage.setItem('world-clock-cities', JSON.stringify(newCities))
    
    // Close modal and reset form
    setShowAddModal(false)
    setSelectedCountry('')
    setSelectedTimezone('')
    setTitle('')
  }

  const removeCity = (slug: string) => {
    const newCities = selectedCities.filter((c) => c.slug !== slug)
    setSelectedCities(newCities)
    localStorage.setItem('world-clock-cities', JSON.stringify(newCities))
    setContextMenu(null)
  }

  const handleMenuClick = (e: React.MouseEvent, citySlug: string) => {
    e.preventDefault()
    e.stopPropagation()
    // Position menu near the button, not at cursor
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setContextMenu({ citySlug, x: rect.right - 150, y: rect.bottom + 5 })
  }

  const handleMoveToTop = (slug: string) => {
    const city = selectedCities.find((c) => c.slug === slug)
    if (city) {
      const newCities = [city, ...selectedCities.filter((c) => c.slug !== slug)]
      setSelectedCities(newCities)
      localStorage.setItem('world-clock-cities', JSON.stringify(newCities))
    }
    setContextMenu(null)
  }

  const handleMoveUp = (slug: string) => {
    const index = selectedCities.findIndex((c) => c.slug === slug)
    if (index > 0) {
      const newCities = [...selectedCities]
      ;[newCities[index - 1], newCities[index]] = [newCities[index], newCities[index - 1]]
      setSelectedCities(newCities)
      localStorage.setItem('world-clock-cities', JSON.stringify(newCities))
    }
    setContextMenu(null)
  }

  const handleMoveDown = (slug: string) => {
    const index = selectedCities.findIndex((c) => c.slug === slug)
    if (index < selectedCities.length - 1) {
      const newCities = [...selectedCities]
      ;[newCities[index], newCities[index + 1]] = [newCities[index + 1], newCities[index]]
      setSelectedCities(newCities)
      localStorage.setItem('world-clock-cities', JSON.stringify(newCities))
    }
    setContextMenu(null)
  }

  const handleEdit = (slug: string) => {
    const city = selectedCities.find((c) => c.slug === slug)
    if (city) {
      setEditingCity(city)
      setSelectedCountry(city.country)
      // Construct the dropdown value format: "timezone|city"
      setSelectedTimezone(`${city.timezone}|${city.name}`)
      setTitle(`${city.name}, ${city.country}`)
      setShowEditModal(true)
      setContextMenu(null)
    }
  }

  const handleEditConfirm = () => {
    if (!editingCity || !selectedCountry || !selectedTimezone || !title) {
      console.warn('Missing required fields for edit:', { editingCity, selectedCountry, selectedTimezone, title })
      return
    }

    // Extract timezone from selectedTimezone (format: "timezone|city" or just "timezone")
    const [timezone] = selectedTimezone.includes('|') ? selectedTimezone.split('|') : [selectedTimezone]
    
    // Extract city name from title (format: "City, Country")
    const cityName = title.split(',')[0]?.trim() || title.trim()
    
    // Generate new slug from city name and country
    const newSlug = `${cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${selectedCountry.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
    
    const updatedCity: City = {
      name: cityName,
      country: selectedCountry,
      timezone: timezone,
      slug: newSlug,
    }

    // Update the city in the list
    const newCities = selectedCities.map((c) => 
      c.slug === editingCity.slug ? updatedCity : c
    )
    setSelectedCities(newCities)
    localStorage.setItem('world-clock-cities', JSON.stringify(newCities))
    
    // Close modal and reset form
    setShowEditModal(false)
    setEditingCity(null)
    setSelectedCountry('')
    setSelectedTimezone('')
    setTitle('')
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

  const getTimeDifference = (city: City) => {
    const cityTime = new Date(formatInTimeZone(currentTime, city.timezone, 'yyyy-MM-dd HH:mm:ss'))
    const localTime = currentTime
    const diffMs = cityTime.getTime() - localTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours === 0) {
      return 'Today, 0 H'
    } else if (diffHours > 0) {
      return `Today, +${diffHours} H`
    } else {
      return `Yesterday, ${diffHours} H`
    }
  }

  const formatCityTime = (city: City) => {
    const timeFormat = is24Hour ? 'HH:mm:ss' : 'h:mm:ss'
    return formatInTimeZone(currentTime, city.timezone, timeFormat)
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
                        title: 'TimeTravel World Clock',
                        text: 'Check out this online world clock!',
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

              {/* Title and Clock Display */}
              <div className="text-center" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%'
              }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                  <h1 className="colored" style={{ fontSize: '32px', fontWeight: 400, marginBottom: '20px' }}>Time Now</h1>
                  <DigitalClock time={currentTime} fontSize={fontSize} dateFontSize={Math.round(fontSize * 0.25)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Banner */}
        <AdPlaceholder position="top" />

        {/* City Grid */}
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedCities.map((city) => {
                const cityTime = formatCityTime(city)
                const timeDiff = getTimeDifference(city)

                return (
                  <Link
                    key={city.slug}
                    href={`/time/${getCityFullSlug(city)}`}
                    className="panel panel-default relative block"
                    style={{
                      backgroundColor: '#111',
                      border: 'none',
                      padding: '20px',
                      minHeight: '180px',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    {/* City Name and Icons */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-white font-normal" style={{ fontSize: '16px' }}>
                        {city.name}{city.country !== 'United States' ? `, ${city.country}` : ''}
                        {city.name === 'Chicago' && ', Illinois'}
                        {city.name === 'Denver' && ', Colorado'}
                        {city.name === 'Los Angeles' && ', California'}
                        {city.name === 'Phoenix' && ', Arizona'}
                        {city.name === 'Anchorage' && ', Alaska'}
                        {city.name === 'Honolulu' && ', Hawaii'}
                      </h3>
                      <div className="flex gap-2">
                        <Link
                          href={`/time/${getCityFullSlug(city)}`}
                          className="icon ci-monitor text-[#9d9d9d] hover:text-[#0090dd]"
                          title="View city page"
                          style={{ cursor: 'pointer', fontSize: '18px' }}
                        ></Link>
                        <span
                          className="icon ci-menu3 text-[#9d9d9d] hover:text-[#0090dd]"
                          title="More options"
                          onClick={(e) => handleMenuClick(e, city.slug)}
                          style={{ cursor: 'pointer', fontSize: '18px' }}
                        ></span>
                      </div>
                    </div>

                    {/* City Time */}
                    <div className="colored digit font-digit mb-3" style={{
                      fontSize: '36px',
                      color: '#1976D2',
                      lineHeight: '1.2',
                      fontWeight: 'normal'
                    }}>
                      {cityTime}
                    </div>

                    {/* Time Difference */}
                    <div className="text-[#9d9d9d]" style={{ fontSize: '14px' }}>
                      {timeDiff}
                    </div>
                  </Link>
                )
              })}
              
              {/* Add City Button */}
              <button
                onClick={handleOpenAddModal}
                className="panel panel-default relative"
                style={{
                  backgroundColor: '#111',
                  border: '2px dashed #777',
                  padding: '20px',
                  minHeight: '180px',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9d9d9d'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0090dd'
                  e.currentTarget.style.backgroundColor = '#1a1a1a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#777'
                  e.currentTarget.style.backgroundColor = '#111'
                }}
              >
                <span style={{ fontSize: '48px', marginBottom: '10px' }}>+</span>
                <span style={{ fontSize: '16px', color: '#0090dd' }}>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Most Popular Time Zones and Cities */}
        <div className="row mb-4" style={{ marginTop: '40px' }}>
          <div className="col-md-12">
            <div className="panel panel-default" style={{ backgroundColor: '#111', border: 'none', padding: '20px' }}>
              <h2 className="text-white mb-4" style={{ fontSize: '21px', fontWeight: 400 }}>Most Popular Time Zones and Cities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Column 1 */}
                <div>
                  <Link href="/time/new-york-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>New York</Link>
                  <Link href="/time/philadelphia-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Philadelphia, Pennsylvania</Link>
                  <Link href="/time/chicago-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Chicago, Illinois</Link>
                  <Link href="/time/houston-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Houston, Texas</Link>
                  <Link href="/time/san-antonio-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>San Antonio, Texas</Link>
                  <Link href="/time/dallas-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Dallas, Texas</Link>
                  <Link href="/time/denver-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Denver, Colorado</Link>
                  <Link href="/time/los-angeles-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Los Angeles, California</Link>
                  <Link href="/time/san-diego-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>San Diego, California</Link>
                  <Link href="/time/san-jose-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>San Jose, California</Link>
                  <Link href="/time/phoenix-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Phoenix, Arizona</Link>
                  <Link href="/time/anchorage-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Anchorage, Alaska</Link>
                  <Link href="/time/adak-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Adak, Alaska</Link>
                  <Link href="/time/honolulu-united-states" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Honolulu, Hawaii</Link>
                  <Link href="/time/toronto-canada" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Toronto, Canada</Link>
                  <Link href="/time/montreal-canada" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Montreal, Canada</Link>
                </div>

                {/* Column 2 */}
                <div>
                  <Link href="/time/winnipeg-canada" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Winnipeg, Canada</Link>
                  <Link href="/time/calgary-canada" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Calgary, Canada</Link>
                  <Link href="/time/vancouver-canada" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Vancouver, Canada</Link>
                  <Link href="/time/london-united-kingdom" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>London, United Kingdom</Link>
                  <Link href="/time/dublin-ireland" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Dublin, Ireland</Link>
                  <Link href="/time/sydney-australia" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Sydney, Australia</Link>
                  <Link href="/time/melbourne-australia" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Melbourne, Australia</Link>
                  <Link href="/time/brisbane-australia" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Brisbane, Australia</Link>
                  <Link href="/time/perth-australia" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Perth, Australia</Link>
                  <Link href="/time/adelaide-australia" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Adelaide, Australia</Link>
                  <Link href="/time/wellington-new-zealand" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Wellington, New Zealand</Link>
                  <Link href="/time/manila-philippines" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Manila, Philippines</Link>
                  <Link href="/time/singapore-singapore" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Singapore, Singapore</Link>
                  <Link href="/time/tokyo-japan" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Tokyo, Japan</Link>
                  <Link href="/time/seoul-south-korea" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Seoul, Korea</Link>
                  <Link href="/time/taipei-taiwan" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Taipei, Taiwan</Link>
                </div>

                {/* Column 3 */}
                <div>
                  <Link href="/time/beijing-china" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Beijing, China</Link>
                  <Link href="/time/shanghai-china" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Shanghai, China</Link>
                  <Link href="/time/urumqi-china" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Urumqi, China</Link>
                  <Link href="/time/berlin-germany" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Berlin, Germany</Link>
                  <Link href="/time/paris-france" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Paris, France</Link>
                  <Link href="/time/copenhagen-denmark" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Copenhagen, Denmark</Link>
                  <Link href="/time/rome-italy" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Rome, Italy</Link>
                  <Link href="/time/madrid-spain" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Madrid, Spain</Link>
                  <Link href="/time/ceuta-spain" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Ceuta, Africa, Spain</Link>
                  <Link href="/time/canary-islands-spain" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Canary Islands, Spain</Link>
                  <Link href="/time/stockholm-sweden" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Stockholm, Sweden</Link>
                  <Link href="/time/lisbon-portugal" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Lisbon, Portugal</Link>
                  <Link href="/time/madeira-portugal" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Madeira, Portugal</Link>
                  <Link href="/time/azores-portugal" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Azores, Portugal</Link>
                  <Link href="/time/helsinki-finland" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Helsinki, Finland</Link>
                  <Link href="/time/athens-greece" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Athens, Greece</Link>
                </div>

                {/* Column 4 */}
                <div>
                  <Link href="/time/istanbul-turkey" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Istanbul, Turkey</Link>
                  <Link href="/time/warsaw-poland" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Warsaw, Poland</Link>
                  <Link href="/time/kiev-ukraine" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Kiev, Ukraine</Link>
                  <Link href="/time/moscow-russia" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Moscow, Russia</Link>
                  <Link href="/time/jerusalem-israel" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Jerusalem, Israel</Link>
                  <Link href="/time/new-delhi-india" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>New Delhi, India</Link>
                  <Link href="/time/kolkata-india" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Kolkata, India</Link>
                  <Link href="/time/noronha-brazil" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Noronha, Brazil</Link>
                  <Link href="/time/sao-paulo-brazil" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>São Paulo, Brazil</Link>
                  <Link href="/time/rio-de-janeiro-brazil" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Rio de Janeiro, Brazil</Link>
                  <Link href="/time/manaus-brazil" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Manaus, Brazil</Link>
                  <Link href="/time/rio-branco-brazil" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Rio Branco, Brazil</Link>
                  <Link href="/time/mexico-city-mexico" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Mexico City, Mexico</Link>
                  <Link href="/time/santiago-chile" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Santiago, Chile</Link>
                  <Link href="/time/buenos-aires-argentina" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Buenos Aires, Argentina</Link>
                  <Link href="/time/dubai-united-arab-emirates" className="block text-[#0090dd] hover:text-[#00a1f7] mb-2" style={{ textDecoration: 'none' }}>Dubai, United Arab Emirates</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to use the online clock */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="panel panel-default" style={{ backgroundColor: '#111', border: 'none', padding: '20px' }}>
              <h2 className="text-white mb-4" style={{ fontSize: '21px', fontWeight: 400 }}>How to use the online clock</h2>
              <div className="text-white space-y-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <p>
                  This website helps you find the current time and date in any city or country in the world. You can also view the time difference between different cities.
                </p>
                <p>
                  On the homepage, you can see the local time and a pre-installed list of major city clocks. You can modify this list by adding or removing cities. Click on a city title to open a separate page for that city&apos;s clock.
                </p>
                <p>
                  You can configure the appearance of the clock, including the text color, type, and size. These settings will be saved for your future use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="fixed z-50 bg-[#111] text-white border border-[#777]"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
              minWidth: '150px',
              borderRadius: 0,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
              <div className="py-1">
                <button
                  onClick={() => handleEdit(contextMenu.citySlug)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#525050] text-white"
                  style={{ borderRadius: 0 }}
                >
                  Edit
                </button>
                <div className="border-t border-[#666] my-1"></div>
                <button
                  onClick={() => handleMoveToTop(contextMenu.citySlug)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#525050] text-white"
                  style={{ borderRadius: 0 }}
                >
                  Move to Top
                </button>
                <div className="border-t border-[#666] my-1"></div>
                <button
                  onClick={() => handleMoveUp(contextMenu.citySlug)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#525050] text-white"
                  style={{ borderRadius: 0 }}
                >
                  Move Up
                </button>
                <div className="border-t border-[#666] my-1"></div>
                <button
                  onClick={() => handleMoveDown(contextMenu.citySlug)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#525050] text-white"
                  style={{ borderRadius: 0 }}
                >
                  Move Down
                </button>
                <div className="border-t border-[#666] my-1"></div>
                <button
                  onClick={() => removeCity(contextMenu.citySlug)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#525050] text-white"
                  style={{ borderRadius: 0 }}
                >
                  Delete
                </button>
              </div>
          </div>
        )}

        {/* Add City Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#555] text-white" style={{ borderRadius: 0, width: '90%', maxWidth: '720px' }}>
              <div className="flex justify-between items-center p-4 border-b border-[#777]">
                <h2 className="text-xl font-normal text-white">Add</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedCountry('')
                    setSelectedTimezone('')
                    setTitle('')
                  }}
                  className="text-[#9d9d9d] hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-white mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full dark:bg-[#1a1a1a] text-black dark:text-[#eee] p-2"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="">Select Country</option>
                    {getAllCountries().map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Time zone</label>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => handleTimezoneChange(e.target.value)}
                    disabled={!selectedCountry}
                    className="w-full dark:bg-[#1a1a1a] text-black dark:text-[#eee] p-2 disabled:bg-gray-300 dark:disabled:bg-[#2a2a2a] disabled:cursor-not-allowed"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="">Select Timezone</option>
                    {selectedCountry &&
                      (() => {
                        const timezones = getTimezonesForCountry(selectedCountry)
                        if (timezones.length === 0) {
                          console.warn(`No timezones found for country: ${selectedCountry}`)
                        }
                        return timezones.map((tz) => {
                          const offset = getTimezoneOffsetLabel(tz.timezone)
                          // Use timezone|city as value to uniquely identify each option
                          return (
                            <option key={`${tz.timezone}-${tz.city}`} value={`${tz.timezone}|${tz.city}`}>
                              {offset} {tz.city}
                            </option>
                          )
                        })
                      })()}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    readOnly
                    className="w-full dark:bg-[#1a1a1a] text-black dark:text-[#eee] p-2"
                    style={{ borderRadius: 0 }}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 border-t border-[#777]">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedCountry('')
                    setSelectedTimezone('')
                    setTitle('')
                  }}
                  className="px-4 py-2 dark:bg-[#1a1a1a] text-black dark:text-[#eee]"
                  style={{ borderRadius: 0 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddConfirm}
                  disabled={!selectedCountry || !selectedTimezone || !title}
                  className="px-4 py-2 bg-[#4aae71] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: 0 }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit City Modal */}
        {showEditModal && editingCity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#555] text-white" style={{ borderRadius: 0, width: '90%', maxWidth: '720px' }}>
              <div className="flex justify-between items-center p-4 border-b border-[#777]">
                <h2 className="text-xl font-normal text-white">Edit</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCity(null)
                    setSelectedCountry('')
                    setSelectedTimezone('')
                    setTitle('')
                  }}
                  className="text-[#9d9d9d] hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-white mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full dark:bg-[#1a1a1a] text-black dark:text-[#eee] p-2"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="">Select Country</option>
                    {getAllCountries().map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Time zone</label>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => handleTimezoneChange(e.target.value)}
                    disabled={!selectedCountry}
                    className="w-full dark:bg-[#1a1a1a] text-black dark:text-[#eee] p-2 disabled:bg-gray-300 dark:disabled:bg-[#2a2a2a] disabled:cursor-not-allowed"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="">Select Timezone</option>
                    {selectedCountry &&
                      (() => {
                        const timezones = getTimezonesForCountry(selectedCountry)
                        if (timezones.length === 0) {
                          console.warn(`No timezones found for country: ${selectedCountry}`)
                        }
                        return timezones.map((tz) => {
                          const offset = getTimezoneOffsetLabel(tz.timezone)
                          // Use timezone|city as value to uniquely identify each option
                          return (
                            <option key={`${tz.timezone}-${tz.city}`} value={`${tz.timezone}|${tz.city}`}>
                              {offset} {tz.city}
                            </option>
                          )
                        })
                      })()}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    readOnly
                    className="w-full dark:bg-[#1a1a1a] text-black dark:text-[#eee] p-2"
                    style={{ borderRadius: 0 }}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 border-t border-[#777]">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCity(null)
                    setSelectedCountry('')
                    setSelectedTimezone('')
                    setTitle('')
                  }}
                  className="px-4 py-2 dark:bg-[#1a1a1a] text-black dark:text-[#eee]"
                  style={{ borderRadius: 0 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditConfirm}
                  disabled={!selectedCountry || !selectedTimezone || !title}
                  className="px-4 py-2 bg-[#4aae71] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: 0 }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
