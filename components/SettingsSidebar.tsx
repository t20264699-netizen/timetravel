'use client'

import { useState, useEffect } from 'react'
import { useTimeFormat } from '@/hooks/useTimeFormat'

// Color template: #FF9500 #eee #d32f2f #388E3C #1976D2
const COLOR_TEMPLATE = {
  0: '#eee',      // White/Light gray
  1: '#FF9500',   // Orange
  2: '#d32f2f',   // Red
  3: '#388E3C',   // Green
  4: '#1976D2',   // Blue (default)
}

interface SettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const { is24Hour, toggleFormat } = useTimeFormat()
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_TEMPLATE[4])
  const [showDate, setShowDate] = useState(true)
  const [animatingColor, setAnimatingColor] = useState<string | null>(null)

  useEffect(() => {
    // Load saved settings from localStorage
    const savedColor = localStorage.getItem('digit-color')
    if (savedColor && Object.values(COLOR_TEMPLATE).includes(savedColor)) {
      setSelectedColor(savedColor)
      // Apply saved color to CSS variable
      document.documentElement.style.setProperty('--digit-color', savedColor)
    } else {
      // Set default if none saved
      const defaultColor = COLOR_TEMPLATE[4]
      setSelectedColor(defaultColor)
      localStorage.setItem('digit-color', defaultColor)
      document.documentElement.style.setProperty('--digit-color', defaultColor)
    }

    const savedShowDate = localStorage.getItem('show-date')
    if (savedShowDate !== null) {
      setShowDate(savedShowDate === 'true')
    } else {
      // Set default if none saved
      setShowDate(true)
      localStorage.setItem('show-date', 'true')
    }

  }, [])

  const handleColorSelect = (color: string) => {
    setAnimatingColor(color)
    setTimeout(() => {
      setSelectedColor(color)
      localStorage.setItem('digit-color', color)
      document.documentElement.style.setProperty('--digit-color', color)
      window.dispatchEvent(new CustomEvent('color-changed', { detail: { color } }))
      setAnimatingColor(null)
    }, 200)
  }

  const handleShowDateToggle = () => {
    const newValue = !showDate
    setShowDate(newValue)
    localStorage.setItem('show-date', newValue.toString())
    window.dispatchEvent(new CustomEvent('show-date-changed', { detail: { showDate: newValue } }))
  }

  const handleOK = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 settings-overlay"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      />
      
      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-80 bg-[#484747] dark:bg-[#484747] z-50 shadow-lg settings-sidebar"
        style={{ 
          borderLeft: '1px solid #383737',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          visibility: isOpen ? 'visible' : 'hidden'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#383737]">
          <h2 className="text-white text-xl" style={{ fontSize: '21px', fontWeight: 400, textDecoration: 'none' }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-[#9d9d9d] hover:text-white text-2xl"
            style={{ cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* 12 hours (am/pm) Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-white" style={{ fontSize: '14px' }}>12 hours (am/pm)</span>
            <button
              onClick={toggleFormat}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                !is24Hour ? 'bg-[#388E3C]' : 'bg-[#555]'
              }`}
              style={{ borderRadius: '9999px' }}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  !is24Hour ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Show Date Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-white" style={{ fontSize: '14px' }}>Show Date</span>
            <button
              onClick={handleShowDateToggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showDate ? 'bg-[#388E3C]' : 'bg-[#555]'
              }`}
              style={{ borderRadius: '9999px' }}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showDate ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Colors Section */}
          <div>
            <h3 className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 400 }}>Colors</h3>
            <div className="flex gap-3">
              {Object.entries(COLOR_TEMPLATE).map(([key, color]) => {
                const isSelected = selectedColor === color
                
                return (
                  <button
                    key={key}
                    onClick={() => handleColorSelect(color)}
                    className="relative rounded-full transition-all"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: isSelected ? 'transparent' : color,
                      borderRadius: '50%',
                      border: isSelected ? `2px solid ${color}` : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      transform: animatingColor === color ? 'scale(1.3)' : 'scale(1)',
                      transition: 'transform 0.2s ease-in-out, border 0.2s ease-in-out, background-color 0.2s ease-in-out'
                    }}
                    title={`Color ${key === '0' ? 'White' : key === '1' ? 'Orange' : key === '2' ? 'Red' : key === '3' ? 'Green' : 'Blue'}`}
                  >
                    {isSelected && (
                      <span
                        style={{ 
                          fontSize: '12px', 
                          lineHeight: '1', 
                          fontWeight: 'bold',
                          color: color
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* OK Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#383737]">
          <button
            onClick={handleOK}
            className="w-full py-2 text-white"
            style={{
              backgroundColor: '#1976D2',
              borderRadius: 0,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  )
}
