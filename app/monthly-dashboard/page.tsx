"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock, CalendarIcon, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Activity {
  projectName: string
  hours: number
  description: string
}

interface Leave {
  type: string
  status: "approved" | "pending" | "rejected"
  duration: string
  reason: string
}

interface DayData {
  activities: Activity[]
  leaves: Leave[]
}

export default function MonthlyDashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<{ date: string; data: DayData } | null>(null)

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()

  const monthName = selectedDate.toLocaleString("default", { month: "long", year: "numeric" })

  const daysInMonth = useMemo(() => {
    const count = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(year, month, i + 1)
      return date.toISOString().split("T")[0]
    })
  }, [year, month])

  const firstDayOfMonth = new Date(year, month, 1).getDay()

  // Mock data generator
  const getDayData = (date: string): DayData => {
    const dayNum = Number.parseInt(date.split("-")[2])
    const hasActivity = dayNum % 2 === 0 || dayNum % 3 === 0
    const hasLeave = dayNum === 15 || dayNum === 20

    return {
      activities: hasActivity
        ? [
            { projectName: "Web Development", hours: 4, description: "Frontend implementation" },
            { projectName: "API Integration", hours: 2.5, description: "REST API endpoints" },
          ]
        : [],
      leaves: hasLeave
        ? [
            {
              type: "Casual Leave",
              status: dayNum === 15 ? "approved" : "pending",
              duration: "Full Day",
              reason: "Personal work",
            },
          ]
        : [],
    }
  }

  const navigateMonth = (direction: number) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Calculate cycle summary
  const cycleSummary = useMemo(() => {
    let totalHours = 0
    let activeDays = 0

    daysInMonth.forEach((date) => {
      const data = getDayData(date)
      const dayHours = data.activities.reduce((sum, a) => sum + a.hours, 0)
      if (dayHours > 0) {
        totalHours += dayHours
        activeDays++
      }
    })

    return { totalHours, activeDays }
  }, [daysInMonth])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Monthly Dashboard</h1>
            <p className="text-muted-foreground mt-1">View your activity calendar</p>
          </div>

          {/* Cycle Summary */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Hours</p>
                  <p className="text-xl font-bold text-foreground">{cycleSummary.totalHours}h</p>
                </div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-chart-2/20 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Days</p>
                  <p className="text-xl font-bold text-foreground">{cycleSummary.activeDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{monthName}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekdays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for alignment */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {daysInMonth.map((date) => {
                const data = getDayData(date)
                const totalHours = data.activities.reduce((sum, a) => sum + a.hours, 0)
                const hasData = data.activities.length > 0 || data.leaves.length > 0
                const isToday = date === new Date().toISOString().split("T")[0]
                const dayNum = Number.parseInt(date.split("-")[2])

                return (
                  <motion.button
                    key={date}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => hasData && setSelectedDay({ date, data })}
                    className={cn(
                      "aspect-square p-1 sm:p-2 rounded-xl border transition-all text-left flex flex-col",
                      isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      hasData
                        ? "bg-secondary/50 border-border hover:bg-secondary cursor-pointer"
                        : "bg-background border-transparent",
                      data.leaves.length > 0 &&
                        data.leaves[0].status === "approved" &&
                        "bg-green-500/10 border-green-500/20",
                      data.leaves.length > 0 &&
                        data.leaves[0].status === "pending" &&
                        "bg-yellow-500/10 border-yellow-500/20",
                    )}
                  >
                    <span
                      className={cn("text-xs sm:text-sm font-medium", isToday ? "text-primary" : "text-foreground")}
                    >
                      {dayNum}
                    </span>

                    {hasData && (
                      <div className="flex-1 flex flex-col justify-end gap-1 mt-1">
                        {totalHours > 0 && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 w-fit hidden sm:flex">
                            {totalHours}h
                          </Badge>
                        )}
                        {data.leaves.length > 0 && (
                          <Badge
                            variant={data.leaves[0].status === "approved" ? "default" : "outline"}
                            className={cn(
                              "text-[10px] px-1 py-0 h-4 w-fit hidden sm:flex",
                              data.leaves[0].status === "pending" &&
                                "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
                            )}
                          >
                            {data.leaves[0].status === "pending" ? "Pending" : "Leave"}
                          </Badge>
                        )}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Details Dialog */}
        <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>
                  {selectedDay &&
                    new Date(selectedDay.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </span>
              </DialogTitle>
            </DialogHeader>

            {selectedDay && (
              <div className="space-y-6">
                {/* Activities */}
                {selectedDay.data.activities.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Activities
                    </h4>
                    {selectedDay.data.activities.map((activity, idx) => (
                      <Card key={idx} className="bg-secondary/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{activity.projectName}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            <Badge>{activity.hours}h</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Leaves */}
                {selectedDay.data.leaves.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Leaves
                    </h4>
                    {selectedDay.data.leaves.map((leave, idx) => (
                      <Card
                        key={idx}
                        className={cn(
                          "border",
                          leave.status === "approved" && "bg-green-500/10 border-green-500/20",
                          leave.status === "pending" && "bg-yellow-500/10 border-yellow-500/20",
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{leave.type}</p>
                              <p className="text-sm text-muted-foreground">{leave.reason}</p>
                            </div>
                            <Badge variant={leave.status === "approved" ? "default" : "outline"}>{leave.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
