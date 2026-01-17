'use client'

import { useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always apply dark theme
    document.documentElement.classList.add('dark')
    document.documentElement.classList.add('dark-theme')
  }, [])

  return <>{children}</>
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const toggleTheme = () => {
    // Theme is always dark, but we keep the function for compatibility
    // No-op since we always use dark theme
  }

  return { theme, toggleTheme }
}
