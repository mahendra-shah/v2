"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FolderKanban } from "lucide-react"

export function ProjectOverview() {
  const projects = [
    { name: "Web App", hours: 45, target: 60, progress: 75 },
    { name: "Mobile", hours: 20, target: 40, progress: 50 },
    { name: "API", hours: 15, target: 20, progress: 75 },
  ]

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FolderKanban className="w-5 h-5" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{project.name}</span>
              <span className="text-xs text-muted-foreground">
                {project.hours}h / {project.target}h
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
