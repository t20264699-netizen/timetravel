'use client'

import { useState, useEffect } from 'react'
import { SettingsSidebar } from './SettingsSidebar'

export function TopBar() {
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Toggle body class for sidebar
    if (showSidebar) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }, [showSidebar])

  useEffect(() => {
    // Close sidebar when clicking overlay
    const handleOverlayClick = (e: MouseEvent) => {
      if (showSidebar && isMobile) {
        const target = e.target as HTMLElement
        // Check if clicking on the overlay (body's after pseudo-element area)
        if (!target.closest('.am-left-sidebar') && !target.closest('header')) {
          setShowSidebar(false)
        }
      }
    }
    
    if (showSidebar && isMobile) {
      document.addEventListener('click', handleOverlayClick)
      return () => document.removeEventListener('click', handleOverlayClick)
    }
  }, [showSidebar, isMobile])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#484747] border-b border-[#383737] z-30">
        <div className="flex items-center justify-between h-full px-4 gap-4">
          {/* Left side: Hamburger menu (mobile) and Site name */}
          <div className="flex items-center gap-4">
            {/* Hamburger menu for mobile - left side */}
            {isMobile && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-[#9d9d9d] hover:text-white transition-colors"
                title="Menu"
                aria-label="Menu"
                style={{ 
                  display: 'flex',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <span className="icon ci-menu3" style={{ fontSize: '24px' }}></span>
              </button>
            )}
            {/* Site name with special font */}
            <div 
              className="site-name"
              style={{
                fontFamily: '"Times New Roman", serif, Georgia',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: '0.05em',
                fontStyle: 'italic',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                userSelect: 'none'
              }}
            >
              TimeTravel
            </div>
          </div>
          {/* Settings icon - right side */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-[#9d9d9d] hover:text-white transition-colors settings-icon-btn"
              title="Settings"
              aria-label="Settings"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <span className="icon ci-config settings-icon"></span>
            </button>
          </div>
        </div>
      </header>
      <SettingsSidebar
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  )
}
