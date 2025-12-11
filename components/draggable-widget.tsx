"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useDrag } from "./drag-provider"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"

interface DraggableWidgetProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function DraggableWidget({ id, children, className }: DraggableWidgetProps) {
  const { positions, updatePosition, isResetting } = useDrag()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 })
  const [hasCustomPosition, setHasCustomPosition] = useState(false)

  useEffect(() => {
    if (positions[id]) {
      setLocalPosition(positions[id])
      setHasCustomPosition(true)
    } else {
      setLocalPosition({ x: 0, y: 0 })
      setHasCustomPosition(false)
    }
  }, [positions, id])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current?.parentElement) return

      const parentRect = containerRef.current.parentElement.getBoundingClientRect()
      const newX = e.clientX - parentRect.left - dragOffset.x
      const newY = e.clientY - parentRect.top - dragOffset.y

      setLocalPosition({ x: newX, y: newY })
      setHasCustomPosition(true)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      updatePosition(id, localPosition)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, id, localPosition, updatePosition])

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative",
        hasCustomPosition && "absolute",
        isDragging && "z-50 cursor-grabbing",
        isResetting && "transition-all duration-500 ease-out",
        className,
      )}
      style={
        hasCustomPosition
          ? {
              left: localPosition.x,
              top: localPosition.y,
              transform: isResetting ? "translate(0, 0)" : undefined,
            }
          : undefined
      }
    >
      <div
        className={cn(
          "absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab p-1 rounded bg-muted/80",
          isDragging && "opacity-100",
        )}
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  )
}
