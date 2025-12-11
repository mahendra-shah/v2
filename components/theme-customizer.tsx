"use client"

import { useState, useEffect } from "react"
import { X, Check, RotateCcw } from "lucide-react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"

interface ThemeCustomizerProps {
  open: boolean
  onClose: () => void
}

const colorPalettes = [
  {
    name: "Warm Sand",
    primary: "45 30% 45%",
    secondary: "45 20% 90%",
    background: "45 30% 96%",
    foreground: "45 10% 10%",
    card: "45 30% 98%",
    accent: "45 25% 88%",
    muted: "45 20% 92%",
  },
  {
    name: "Ocean Blue",
    primary: "210 80% 50%",
    secondary: "210 30% 90%",
    background: "210 30% 98%",
    foreground: "210 10% 10%",
    card: "0 0% 100%",
    accent: "210 25% 92%",
    muted: "210 20% 94%",
  },
  {
    name: "Forest Green",
    primary: "150 60% 35%",
    secondary: "150 25% 88%",
    background: "150 20% 97%",
    foreground: "150 10% 10%",
    card: "0 0% 100%",
    accent: "150 20% 90%",
    muted: "150 15% 93%",
  },
  {
    name: "Royal Purple",
    primary: "270 60% 50%",
    secondary: "270 25% 90%",
    background: "270 20% 98%",
    foreground: "270 10% 10%",
    card: "0 0% 100%",
    accent: "270 20% 92%",
    muted: "270 15% 94%",
  },
  {
    name: "Coral Sunset",
    primary: "15 80% 55%",
    secondary: "15 30% 90%",
    background: "30 30% 97%",
    foreground: "15 10% 10%",
    card: "30 40% 99%",
    accent: "15 25% 90%",
    muted: "30 20% 93%",
  },
  {
    name: "Midnight",
    primary: "220 70% 55%",
    secondary: "220 20% 20%",
    background: "220 25% 8%",
    foreground: "220 10% 95%",
    card: "220 25% 12%",
    accent: "220 20% 18%",
    muted: "220 15% 15%",
  },
]

const defaultPalette = colorPalettes[0]

export function ThemeCustomizer({ open, onClose }: ThemeCustomizerProps) {
  const [selectedPalette, setSelectedPalette] = useState(defaultPalette)

  useEffect(() => {
    const saved = localStorage.getItem("color-palette")
    if (saved) {
      const palette = colorPalettes.find((p) => p.name === saved)
      if (palette) {
        setSelectedPalette(palette)
        applyPalette(palette)
      }
    }
  }, [])

  const applyPalette = (palette: (typeof colorPalettes)[0]) => {
    const root = document.documentElement
    root.style.setProperty("--primary", palette.primary)
    root.style.setProperty("--secondary", palette.secondary)
    root.style.setProperty("--background", palette.background)
    root.style.setProperty("--foreground", palette.foreground)
    root.style.setProperty("--card", palette.card)
    root.style.setProperty("--card-foreground", palette.foreground)
    root.style.setProperty("--accent", palette.accent)
    root.style.setProperty("--accent-foreground", palette.foreground)
    root.style.setProperty("--muted", palette.muted)
    root.style.setProperty("--muted-foreground", `${palette.foreground.split(" ")[0]} 10% 45%`)
  }

  const handleSelectPalette = (palette: (typeof colorPalettes)[0]) => {
    setSelectedPalette(palette)
    applyPalette(palette)
    localStorage.setItem("color-palette", palette.name)
  }

  const handleReset = () => {
    setSelectedPalette(defaultPalette)
    applyPalette(defaultPalette)
    localStorage.removeItem("color-palette")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Theme Customizer</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-4 block">Color Palettes</Label>
            <div className="grid grid-cols-2 gap-3">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => handleSelectPalette(palette)}
                  className={cn(
                    "relative p-3 rounded-xl border-2 transition-all duration-200 text-left",
                    selectedPalette.name === palette.name
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${palette.primary})` }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${palette.secondary})` }} />
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: `hsl(${palette.background})` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{palette.name}</span>
                  {selectedPalette.name === palette.name && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  )
}
