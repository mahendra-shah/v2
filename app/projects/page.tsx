"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, MoreHorizontal, FolderKanban, Users, Calendar, Edit, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  name: string
  department: string
  status: "Active" | "Inactive" | "Completed"
  members: number
  createdAt: string
}

export default function ProjectsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: "", department: "", status: "Active" })

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Web Development",
      department: "Engineering",
      status: "Active",
      members: 8,
      createdAt: "2024-01-15",
    },
    { id: "2", name: "Mobile App", department: "Engineering", status: "Active", members: 5, createdAt: "2024-02-20" },
    {
      id: "3",
      name: "API Integration",
      department: "Engineering",
      status: "Active",
      members: 3,
      createdAt: "2024-03-10",
    },
    { id: "4", name: "UI/UX Design", department: "Design", status: "Active", members: 4, createdAt: "2024-01-05" },
    { id: "5", name: "Documentation", department: "Operations", status: "Active", members: 2, createdAt: "2024-04-01" },
    { id: "6", name: "Testing & QA", department: "Engineering", status: "Active", members: 4, createdAt: "2024-02-15" },
    {
      id: "7",
      name: "Legacy Migration",
      department: "Engineering",
      status: "Completed",
      members: 6,
      createdAt: "2023-06-01",
    },
  ])

  const departments = ["Engineering", "Design", "Operations", "Marketing", "HR"]

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddProject = () => {
    if (!newProject.name || !newProject.department) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      department: newProject.department,
      status: newProject.status as "Active" | "Inactive" | "Completed",
      members: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setProjects((prev) => [project, ...prev])
    setNewProject({ name: "", department: "", status: "Active" })
    setIsAddDialogOpen(false)

    toast({
      title: "Project Created",
      description: `${project.name} has been added successfully`,
    })
  }

  const toggleProjectStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p)),
    )
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    toast({
      title: "Project Deleted",
      description: "The project has been removed",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "Inactive":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "Completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      default:
        return ""
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Project Management</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your projects</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Project Name *</Label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select
                    value={newProject.department}
                    onValueChange={(value) => setNewProject((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) => setNewProject((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: projects.length, icon: FolderKanban },
            { label: "Active", value: projects.filter((p) => p.status === "Active").length, icon: CheckCircle },
            { label: "Team Members", value: projects.reduce((acc, p) => acc + p.members, 0), icon: Users },
            { label: "Departments", value: [...new Set(projects.map((p) => p.department))].length, icon: Calendar },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FolderKanban className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{project.department}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleProjectStatus(project.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteProject(project.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.members}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <Badge variant="outline" className={cn(getStatusColor(project.status))}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <FolderKanban className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-1">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new project</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
