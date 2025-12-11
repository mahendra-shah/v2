"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

interface Position {
  x: number
  y: number
}

interface DragContextType {
  positions: Record<string, Position>
  updatePosition: (id: string, position: Position) => void
  resetPositions: () => void
  isResetting: boolean
}

const DragContext = createContext<DragContextType | null>(null)

export function useDrag() {
  const context = useContext(DragContext)
  if (!context) {
    throw new Error("useDrag must be used within a DragProvider")
  }
  return context
}

interface DragProviderProps {
  children: React.ReactNode
}

export function DragProvider({ children }: DragProviderProps) {
  const [positions, setPositions] = useState<Record<string, Position>>({})
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("widget-positions")
    if (saved) {
      setPositions(JSON.parse(saved))
    }
  }, [])

  const updatePosition = useCallback((id: string, position: Position) => {
    setPositions((prev) => {
      const updated = { ...prev, [id]: position }
      localStorage.setItem("widget-positions", JSON.stringify(updated))
      return updated
    })
  }, [])

  const resetPositions = useCallback(() => {
    setIsResetting(true)
    setTimeout(() => {
      setPositions({})
      localStorage.removeItem("widget-positions")
      setTimeout(() => setIsResetting(false), 500)
    }, 50)
  }, [])

  return (
    <DragContext.Provider value={{ positions, updatePosition, resetPositions, isResetting }}>
      {children}
    </DragContext.Provider>
  )
}
