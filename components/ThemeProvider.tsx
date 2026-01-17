'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always apply dark theme
    document.documentElement.classList.add('dark')
    document.documentElement.classList.add('dark-theme')
  }, [])

  return <>{children}</>
}
