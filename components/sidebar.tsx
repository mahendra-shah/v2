"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  History,
  BarChart3,
  Gift,
  FolderKanban,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/activity-tracker", icon: ClipboardList, label: "Activity Tracker" },
  { href: "/leaves", icon: Calendar, label: "Leave Request" },
  { href: "/leave-history", icon: History, label: "Leave History" },
  { href: "/monthly-dashboard", icon: BarChart3, label: "Monthly Report" },
  { href: "/comp-off", icon: Gift, label: "Comp Off" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin", icon: Shield, label: "Admin Panel" },
  { href: "/access-control", icon: Settings, label: "Access Control" },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "w-20" : "w-72",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">D</span>
              </div>
              <span className="font-semibold text-foreground text-lg">DailyTrack</span>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const NavLink = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  collapsed && "justify-center px-3",
                )}
              >
                <item.icon className={cn("shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5")} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return NavLink
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-muted/50", collapsed && "justify-center p-2")}>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@company.com</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3 top-20 w-6 h-6 rounded-full shadow-md bg-background"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      </aside>
    </TooltipProvider>
  )
}
