"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Clock, Briefcase, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Contribution {
  id: string
  project: string
  hours: number
  task: string
}

export default function ActivityTrackerPage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [currentContribution, setCurrentContribution] = useState({
    project: "",
    hours: "",
    task: "",
  })
  const [blockers, setBlockers] = useState("")
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const projects = [
    "Web Development",
    "Mobile App",
    "API Integration",
    "Database Design",
    "Testing & QA",
    "Documentation",
    "Ad-hoc tasks",
    "Training",
    "Meetings",
  ]

  const totalHours = contributions.reduce((sum, c) => sum + c.hours, 0)
  const isAdHoc = currentContribution.project === "Ad-hoc tasks"
  const maxHours = isAdHoc ? 2 : 15

  const addContribution = () => {
    if (!currentContribution.project) {
      toast({
        title: "Project Required",
        description: "Please select a project",
        variant: "destructive",
      })
      return
    }

    if (!currentContribution.hours || Number.parseFloat(currentContribution.hours) <= 0) {
      toast({
        title: "Hours Required",
        description: "Please enter valid hours",
        variant: "destructive",
      })
      return
    }

    if (!currentContribution.task.trim()) {
      toast({
        title: "Task Required",
        description: "Please describe your task",
        variant: "destructive",
      })
      return
    }

    const newContribution: Contribution = {
      id: Date.now().toString(),
      project: currentContribution.project,
      hours: Number.parseFloat(currentContribution.hours),
      task: currentContribution.task,
    }

    setContributions((prev) => [...prev, newContribution])
    setCurrentContribution({ project: "", hours: "", task: "" })

    toast({
      title: "Activity Added",
      description: "Your contribution has been added to the list",
    })
  }

  const removeContribution = (id: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSubmit = async () => {
    if (contributions.length === 0) {
      toast({
        title: "No Activities",
        description: "Please add at least one contribution",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Success!",
      description: "Your activities have been submitted successfully",
    })

    setContributions([])
    setBlockers("")
    setIsSubmitting(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Activity Tracker</h1>
            <p className="text-muted-foreground mt-1">Log your daily work contributions</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto bg-card"
            />
          </div>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-foreground">{totalHours}h</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-chart-2/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activities</p>
                <p className="text-2xl font-bold text-foreground">{contributions.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-chart-4/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-foreground">
                  {contributions.length > 0 ? "Ready" : "Pending"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Contribution Form */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Contribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project</label>
                <Select
                  value={currentContribution.project}
                  onValueChange={(value) => setCurrentContribution((prev) => ({ ...prev, project: value }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Hours {isAdHoc && <span className="text-muted-foreground">(max 2)</span>}
                </label>
                <Input
                  type="number"
                  min="0"
                  max={maxHours}
                  step="0.5"
                  value={currentContribution.hours}
                  onChange={(e) => {
                    const value = Math.min(Number.parseFloat(e.target.value) || 0, maxHours)
                    setCurrentContribution((prev) => ({
                      ...prev,
                      hours: value.toString(),
                    }))
                  }}
                  placeholder="Enter hours"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2 sm:col-span-1">
                <label className="text-sm font-medium text-foreground">Task Description</label>
                <div className="flex gap-2">
                  <Input
                    value={currentContribution.task}
                    onChange={(e) => setCurrentContribution((prev) => ({ ...prev, task: e.target.value }))}
                    placeholder="Describe your work..."
                    className="bg-background flex-1"
                  />
                  <Button onClick={addContribution} className="shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contributions List */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Today's Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="popLayout">
              {contributions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contributions added yet</p>
                  <p className="text-sm">Start by adding your first activity above</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {contributions.map((contribution, index) => (
                    <motion.div
                      key={contribution.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{contribution.project}</span>
                          <Badge variant="secondary" className="text-xs">
                            {contribution.hours}h
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">{contribution.task}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeContribution(contribution.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Blockers */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Blockers (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="Describe any blockers you faced today..."
              className="bg-background min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={contributions.length === 0 || isSubmitting}
            className="h-12 px-8 text-base"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Activities</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
