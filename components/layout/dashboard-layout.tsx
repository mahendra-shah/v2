"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Activity,
  Calendar,
  CalendarDays,
  History,
  Gift,
  Settings,
  Shield,
  FolderKanban,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Zap,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeSelector } from "@/components/theme/theme-selector"
import { RobotChatbot } from "@/components/chatbot/robot-chatbot"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Activity, label: "Activity Tracker", href: "/activity-tracker" },
  { icon: Calendar, label: "Leave Application", href: "/leaves" },
  { icon: Gift, label: "Comp-Off", href: "/comp-off" },
  { icon: CalendarDays, label: "Monthly Dashboard", href: "/monthly-dashboard" },
  { icon: History, label: "Leave History", href: "/leave-history" },
]

const adminItems: NavItem[] = [
  { icon: Shield, label: "Admin Panel", href: "/admin", adminOnly: true },
  { icon: FolderKanban, label: "Projects", href: "/projects", adminOnly: true },
  { icon: Settings, label: "Access Control", href: "/access-control", adminOnly: true },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Handle layout reset
  const handleResetLayout = () => {
    localStorage.removeItem("widget-positions")
    window.dispatchEvent(new CustomEvent("reset-layout"))
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href

    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push(item.href)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
      </motion.button>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-background" />
        </div>
        {!isSidebarCollapsed && <span className="text-xl font-bold text-foreground tracking-tight">Core</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {isAdmin && (
          <>
            <div className="my-4 border-t border-border" />
            <p
              className={cn(
                "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                isSidebarCollapsed && "sr-only",
              )}
            >
              Admin
            </p>
            {adminItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl bg-secondary/50",
            isSidebarCollapsed && "justify-center",
          )}
        >
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "email@example.com"}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          className={cn("w-full mt-2 text-muted-foreground hover:text-foreground", isSidebarCollapsed && "px-0")}
        >
          <LogOut className="w-4 h-4" />
          {!isSidebarCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40"
      >
        <SidebarContent />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-background border border-border shadow-sm"
        >
          <ChevronLeft className={cn("w-3 h-3 transition-transform", isSidebarCollapsed && "rotate-180")} />
        </Button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[280px] bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
            >
              <SidebarContent />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute right-3 top-5"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[260px]",
        )}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-foreground hidden sm:block">
                {navItems.find((item) => item.href === pathname)?.label ||
                  adminItems.find((item) => item.href === pathname)?.label ||
                  "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleResetLayout}
                className="rounded-xl bg-transparent"
                title="Reset Layout"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <ThemeSelector />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* 3D Robot Chatbot */}
      <RobotChatbot />
    </div>
  )
}
