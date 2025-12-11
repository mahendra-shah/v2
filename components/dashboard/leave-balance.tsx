"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"

export function LeaveBalance() {
  const leaves = [
    { type: "Casual", used: 4, total: 12, color: "bg-chart-1" },
    { type: "Wellness", used: 2, total: 6, color: "bg-chart-2" },
    { type: "Festival", used: 0, total: 3, color: "bg-chart-4" },
  ]

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Leave Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaves.map((leave) => (
          <div key={leave.type} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{leave.type}</span>
              <span className="text-xs text-muted-foreground">
                {leave.total - leave.used} / {leave.total} left
              </span>
            </div>
            <Progress value={(leave.used / leave.total) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
