"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Briefcase } from "lucide-react"

export function RecentActivities() {
  const activities = [
    { project: "Web Development", hours: 3, task: "Frontend implementation", time: "2h ago" },
    { project: "API Integration", hours: 2, task: "REST endpoints", time: "4h ago" },
    { project: "Documentation", hours: 1.5, task: "API docs update", time: "6h ago" },
    { project: "Testing", hours: 1, task: "Unit tests", time: "Yesterday" },
  ]

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">{activity.project}</span>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {activity.hours}h
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{activity.task}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
