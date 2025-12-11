"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"

const leaveTypes = [
  { type: "Casual Leave", used: 5, total: 12, color: "bg-blue-500" },
  { type: "Sick Leave", used: 2, total: 10, color: "bg-green-500" },
  { type: "Earned Leave", used: 8, total: 15, color: "bg-amber-500" },
  { type: "Comp Off", used: 1, total: 4, color: "bg-purple-500" },
]

export function LeaveBalanceCard() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Leave Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {leaveTypes.map((leave) => {
          const percentage = (leave.used / leave.total) * 100
          const remaining = leave.total - leave.used

          return (
            <div key={leave.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{leave.type}</span>
                <span className="text-muted-foreground">
                  {remaining} / {leave.total} remaining
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Available</span>
            <span className="text-2xl font-bold">25 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
