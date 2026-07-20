import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem('taallamgo-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(getInitialTheme())
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('taallamgo-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(current => current === 'dark' ? 'light' : 'dark')

  return { theme, toggleTheme }
}
