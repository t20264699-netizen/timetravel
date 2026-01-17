'use client'

import { useState, useEffect } from 'react'

// Color template: #FF9500 #eee #d32f2f #388E3C #1976D2
const COLOR_TEMPLATE = {
  0: '#eee',      // White/Light gray
  1: '#FF9500',   // Orange
  2: '#d32f2f',   // Red
  3: '#388E3C',   // Green
  4: '#1976D2',   // Blue (default)
}

interface ColorSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function ColorSettings({ isOpen, onClose }: ColorSettingsProps) {
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_TEMPLATE[4])

  useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem('digit-color')
    if (savedColor && Object.values(COLOR_TEMPLATE).includes(savedColor)) {
      setSelectedColor(savedColor)
      // Apply saved color on load
      document.documentElement.style.setProperty('--digit-color', savedColor)
    } else {
      // Set default color if none saved
      const defaultColor = COLOR_TEMPLATE[4]
      setSelectedColor(defaultColor)
      localStorage.setItem('digit-color', defaultColor)
      document.documentElement.style.setProperty('--digit-color', defaultColor)
    }
  }, [])

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    localStorage.setItem('digit-color', color)
    
    // Update CSS variable
    document.documentElement.style.setProperty('--digit-color', color)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('color-changed', { detail: { color } }))
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#555] dark:bg-[#555] p-6 rounded-none"
        style={{ maxWidth: '500px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-xl mb-4" style={{ fontSize: '21px', fontWeight: 400 }}>
          Color Settings
        </h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          {Object.entries(COLOR_TEMPLATE).map(([key, color]) => (
            <button
              key={key}
              onClick={() => handleColorSelect(color)}
              className={`w-16 h-16 rounded-none border-2 transition-all ${
                selectedColor === color
                  ? 'border-white scale-110'
                  : 'border-[#777] hover:border-[#999]'
              }`}
              style={{
                backgroundColor: color,
                borderRadius: 0,
              }}
              title={`Color ${key === '0' ? 'White' : key === '1' ? 'Orange' : key === '2' ? 'Red' : key === '3' ? 'Green' : 'Blue'}`}
            >
              {selectedColor === color && (
                <span className="text-white text-2xl">✓</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-[#777] hover:bg-[#888] text-white px-4 py-2"
            style={{ borderRadius: 0 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
