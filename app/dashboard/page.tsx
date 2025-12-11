"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DraggableGrid } from "@/components/draggable/draggable-grid"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { LeaveBalance } from "@/components/dashboard/leave-balance"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ProjectOverview } from "@/components/dashboard/project-overview"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { useAuth } from "@/contexts/auth-context"
import { Clock, Activity, Calendar, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const statsData = [
    {
      id: "hours-today",
      title: "Hours Today",
      value: "6.5",
      suffix: "hrs",
      icon: Clock,
      trend: "+2.5 from yesterday",
      trendUp: true,
    },
    {
      id: "activities-week",
      title: "This Week",
      value: "32",
      suffix: "hrs",
      icon: Activity,
      trend: "85% of target",
      trendUp: true,
    },
    {
      id: "leave-balance",
      title: "Leave Balance",
      value: "12",
      suffix: "days",
      icon: Calendar,
      trend: "3 pending",
      trendUp: false,
    },
    {
      id: "productivity",
      title: "Productivity",
      value: "94",
      suffix: "%",
      icon: TrendingUp,
      trend: "+5% this month",
      trendUp: true,
    },
  ]

  const defaultWidgets = [
    { id: "stats", x: 0, y: 0, w: 4, h: 1, component: "stats" },
    { id: "chart", x: 0, y: 1, w: 3, h: 2, component: "chart" },
    { id: "calendar", x: 3, y: 1, w: 1, h: 2, component: "calendar" },
    { id: "activities", x: 0, y: 3, w: 2, h: 2, component: "activities" },
    { id: "leaves", x: 2, y: 3, w: 1, h: 2, component: "leaves" },
    { id: "projects", x: 3, y: 3, w: 1, h: 2, component: "projects" },
  ]

  const renderWidget = (widget: { component: string }) => {
    switch (widget.component) {
      case "stats":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {statsData.map((stat) => (
              <StatsCard key={stat.id} {...stat} />
            ))}
          </div>
        )
      case "chart":
        return <ActivityChart />
      case "calendar":
        return <CalendarWidget />
      case "activities":
        return <RecentActivities />
      case "leaves":
        return <LeaveBalance />
      case "projects":
        return <ProjectOverview />
      default:
        return null
    }
  }

  if (!mounted) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-muted-foreground mt-1">{currentDate}</p>
          </div>
          <QuickActions />
        </div>

        {/* Draggable Grid */}
        <DraggableGrid defaultWidgets={defaultWidgets} renderWidget={renderWidget} />
      </div>
    </DashboardLayout>
  )
}
