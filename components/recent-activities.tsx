"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Frontend Development",
    project: "E-commerce Dashboard",
    time: "2 hours ago",
    status: "completed",
    initials: "FD",
  },
  {
    id: 2,
    title: "API Integration",
    project: "Mobile App Backend",
    time: "4 hours ago",
    status: "in-progress",
    initials: "AI",
  },
  {
    id: 3,
    title: "Code Review",
    project: "Auth Service",
    time: "Yesterday",
    status: "completed",
    initials: "CR",
  },
  {
    id: 4,
    title: "Database Optimization",
    project: "Analytics Platform",
    time: "Yesterday",
    status: "pending",
    initials: "DO",
  },
  {
    id: 5,
    title: "UI/UX Design Review",
    project: "Customer Portal",
    time: "2 days ago",
    status: "completed",
    initials: "UD",
  },
]

export function RecentActivities() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <Avatar className="w-10 h-10 bg-primary/10">
              <AvatarFallback className="text-xs font-medium text-primary">{activity.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.project}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={
                  activity.status === "completed"
                    ? "default"
                    : activity.status === "in-progress"
                      ? "secondary"
                      : "outline"
                }
                className="text-[10px]"
              >
                {activity.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {activity.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                {activity.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                {activity.status}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
