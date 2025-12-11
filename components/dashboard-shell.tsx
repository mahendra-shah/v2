"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { ThemeCustomizer } from "./theme-customizer"
import { RobotChatbot } from "./robot-chatbot"
import { DragProvider } from "./drag-provider"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved) setSidebarCollapsed(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed))
    }
  }, [sidebarCollapsed, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <DragProvider>
      <div className="min-h-screen bg-background">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={cn("transition-all duration-300 ease-in-out", sidebarCollapsed ? "ml-20" : "ml-72")}>
          <TopBar onThemeClick={() => setShowThemeCustomizer(true)} />
          <main className="p-6 pb-24">{children}</main>
        </div>

        <ThemeCustomizer open={showThemeCustomizer} onClose={() => setShowThemeCustomizer(false)} />
        <RobotChatbot />
      </div>
    </DragProvider>
  )
}
