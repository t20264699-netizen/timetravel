'use client'

import { useState, useEffect, useRef } from 'react'
import { notFound } from 'next/navigation'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { useWakeLock } from '@/hooks/useWakeLock'
import { parse, isAfter, addYears } from 'date-fns'
import { holidays } from '@/data/holidays'
import Link from 'next/link'

interface PageProps {
    params: {
        holiday: string
    }
}

// Generate slug from holiday name (e.g., "Halloween" -> "halloween", "New Year" -> "new-year")
function getHolidaySlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Get holiday by slug
function getHolidayBySlug(slug: string) {
    return holidays.find(h => getHolidaySlug(h.name) === slug)
}

export default function HolidayTimerPage({ params }: PageProps) {
    const holiday = getHolidayBySlug(params.holiday)
    const [holidayTimeLeft, setHolidayTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [fontSize, setFontSize] = useState(128)
    const [isFullScreen, setIsFullScreen] = useState(false)

    useEffect(() => {
        if (!holiday) return

        // Set page title
        document.title = `${holiday.name} Countdown - Online Timer - TimeTravel`

        // Load saved font size
        const savedFontSize = localStorage.getItem('clock-font-size')
        if (savedFontSize) {
            setFontSize(parseInt(savedFontSize, 10))
        }

        // Update holiday countdown every second
        const updateHolidayCountdown = () => {
            let targetDate = parse(holiday.date, 'yyyy-MM-dd', new Date())
            const now = new Date()

            // If the holiday has passed this year, use next year
            if (isAfter(now, targetDate)) {
                targetDate = addYears(targetDate, 1)
            }

            const diffMs = targetDate.getTime() - now.getTime()
            if (diffMs <= 0) {
                setHolidayTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

            setHolidayTimeLeft({ days, hours, minutes, seconds })
        }

        updateHolidayCountdown()
        const interval = setInterval(updateHolidayCountdown, 1000)

        return () => clearInterval(interval)
    }, [holiday])

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    if (!holiday) {
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

    // Calculate target date for display
    let targetDate = parse(holiday.date, 'yyyy-MM-dd', new Date())
    const now = new Date()
    if (isAfter(now, targetDate)) {
        targetDate = addYears(targetDate, 1)
    }
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const dayOfWeek = daysOfWeek[targetDate.getDay()]
    const month = months[targetDate.getMonth()]
    const day = targetDate.getDate()
    const year = targetDate.getFullYear()

    return (
        <div className="bg-[#f0f0f0] dark:bg-black min-h-screen" style={{ backgroundColor: '#000' }}>
            <div className="main-content p-5">
                {/* Main Timer Panel */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="panel panel-default relative rounded" style={{
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
                                    id="btn-tool-share"
                                    onClick={() => {
                                        // Scroll to share section
                                        const shareSection = document.getElementById('share-section')
                                        if (shareSection) {
                                            shareSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                            return
                                        }
                                        
                                        if (navigator.share) {
                                            navigator.share({
                                                title: `${holiday.name} Countdown`,
                                                text: `Check out the ${holiday.name} countdown!`,
                                                url: window.location.href
                                            }).catch(() => {
                                              // Error sharing - silently fail
                                            })
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

                            {/* Timer Display - Center */}
                            <div className="text-center" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%'
                            }}>
                                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                                    {/* Holiday Title */}
                                    <div className="mb-4" style={{ marginBottom: '20px' }}>
                                        <div className="colored" style={{ fontSize: `${Math.round(fontSize * 0.25)}px`, fontFamily: 'sans-serif' }}>
                                            {holiday.name}
                                        </div>
                                    </div>

                                    {/* Holiday Countdown Display */}
                                    <span className="colored digit text-nowrap font-digit" style={{ fontSize: `${fontSize}px`, lineHeight: '1.1', fontWeight: 'normal', letterSpacing: '0.05em' }}>
                                        {holidayTimeLeft.days}<span className="colored font-digit-text text-rel-30" style={{ verticalAlign: 'text-bottom', display: 'inline-block' }}>days</span>&nbsp;{String(holidayTimeLeft.hours).padStart(2, '0')}:{String(holidayTimeLeft.minutes).padStart(2, '0')}:{String(holidayTimeLeft.seconds).padStart(2, '0')}
                                    </span>

                                    {/* Target Date */}
                                    <div className="colored digit-text text-center font-digit-text mt-4" style={{ fontSize: `${Math.round(fontSize * 0.25)}px`, letterSpacing: '-0.1em' }}>
                                        {dayOfWeek} - {month} {day}, {year}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AdPlaceholder position="top" />

            </div>
        </div>
    )
}
