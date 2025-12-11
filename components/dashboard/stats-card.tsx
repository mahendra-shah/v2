"use client"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  suffix?: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function StatsCard({ title, value, suffix, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <Card className="bg-card border-border h-full">
      <CardContent className="p-4 flex items-center gap-4 h-full">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground truncate">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
          {trend && <p className={cn("text-xs mt-0.5", trendUp ? "text-chart-2" : "text-muted-foreground")}>{trend}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
