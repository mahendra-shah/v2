"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface Widget {
  id: string
  x: number
  y: number
  w: number
  h: number
  component: string
}

interface DraggableGridProps {
  defaultWidgets: Widget[]
  renderWidget: (widget: Widget) => React.ReactNode
}

const STORAGE_KEY = "widget-positions"

export function DraggableGrid({ defaultWidgets, renderWidget }: DraggableGridProps) {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets)
  const [isResetting, setIsResetting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Load saved positions
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === defaultWidgets.length) {
          setWidgets(parsed)
        }
      } catch (e) {
        console.error("Failed to parse saved widget positions")
      }
    }
  }, [defaultWidgets])

  // Save positions
  useEffect(() => {
    if (!isResetting) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets))
    }
  }, [widgets, isResetting])

  // Listen for reset events
  useEffect(() => {
    const handleReset = () => resetLayout()
    window.addEventListener("reset-layout", handleReset)
    return () => window.removeEventListener("reset-layout", handleReset)
  }, [])

  const resetLayout = useCallback(() => {
    setIsResetting(true)
    setWidgets(defaultWidgets)
    localStorage.removeItem(STORAGE_KEY)

    setTimeout(() => {
      setIsResetting(false)
    }, 600)
  }, [defaultWidgets])

  const handleReorder = (newOrder: Widget[]) => {
    setWidgets(newOrder)
  }

  return (
    <div className="space-y-4">
      <Reorder.Group axis="y" values={widgets} onReorder={handleReorder} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {widgets.map((widget) => (
            <Reorder.Item
              key={widget.id}
              value={widget}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: isResetting
                    ? {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }
                    : {
                        duration: 0.3,
                      },
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "relative group rounded-2xl bg-card border border-border overflow-hidden",
                  isDragging && "cursor-grabbing",
                  widget.component === "stats" ? "min-h-[120px]" : "min-h-[300px]",
                )}
              >
                {/* Drag Handle */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/80 backdrop-blur-sm cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Drag</span>
                  </div>
                </div>

                {/* Widget Content */}
                <div className="p-4 h-full">{renderWidget(widget)}</div>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}
