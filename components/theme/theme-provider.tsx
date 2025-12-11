"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "cream" | "slate" | "forest" | "ocean" | "sunset" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: { id: Theme; name: string; color: string }[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themes: { id: Theme; name: string; color: string }[] = [
  { id: "cream", name: "Cream", color: "#f5f3ee" },
  { id: "slate", name: "Slate", color: "#f1f5f9" },
  { id: "forest", name: "Forest", color: "#f0fdf4" },
  { id: "ocean", name: "Ocean", color: "#f0f9ff" },
  { id: "sunset", name: "Sunset", color: "#fff7ed" },
  { id: "dark", name: "Dark", color: "#171717" },
]

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("cream")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && themes.find((t) => t.id === savedTheme)) {
      setThemeState(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  if (!mounted) {
    return null
  }

  return <ThemeContext.Provider value={{ theme, setTheme, themes }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
