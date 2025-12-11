"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Search, Shield, Users, UserCog, Crown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "project_manager" | "admin" | "super_admin"
  department: string
}

export default function AccessControlPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@navgurukul.org", role: "super_admin", department: "Engineering" },
    { id: "2", name: "Jane Smith", email: "jane@navgurukul.org", role: "admin", department: "Design" },
    { id: "3", name: "Mike Johnson", email: "mike@navgurukul.org", role: "project_manager", department: "Engineering" },
    { id: "4", name: "Sarah Wilson", email: "sarah@navgurukul.org", role: "user", department: "Operations" },
    { id: "5", name: "Alex Brown", email: "alex@navgurukul.org", role: "user", department: "Marketing" },
    { id: "6", name: "Emily Davis", email: "emily@navgurukul.org", role: "project_manager", department: "HR" },
  ])

  const roles = [
    { id: "user", label: "User", icon: Users, description: "Basic access" },
    { id: "project_manager", label: "Project Manager", icon: UserCog, description: "Manage projects" },
    { id: "admin", label: "Admin", icon: Shield, description: "Full admin access" },
    { id: "super_admin", label: "Super Admin", icon: Crown, description: "Complete control" },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))

    toast({
      title: "Role Updated",
      description: "User role has been successfully updated",
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      case "admin":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "project_manager":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const roleStats = roles.map((role) => ({
    ...role,
    count: users.filter((u) => u.role === role.id).length,
  }))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Access Control</h1>
          <p className="text-muted-foreground mt-1">Manage user roles and permissions</p>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {roleStats.map((role) => (
            <Card key={role.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <role.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{role.label}</p>
                  <p className="text-xl font-bold text-foreground">{role.count}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10 bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>User</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(getRoleBadgeColor(user.role))}>
                          {roles.find((r) => r.id === user.role)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as User["role"])}
                        >
                          <SelectTrigger className="w-[160px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex items-center gap-2">
                                  <role.icon className="w-3 h-3" />
                                  {role.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Info */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <role.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {getPermissions(role.id).map((perm, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-3 h-3 text-primary" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function getPermissions(role: string): string[] {
  switch (role) {
    case "super_admin":
      return ["All admin permissions", "Manage other admins", "System configuration", "Data export"]
    case "admin":
      return ["View all logs", "Manage employees", "Approve leaves", "Manage projects"]
    case "project_manager":
      return ["Manage assigned projects", "View team logs", "Request comp-off", "Team reports"]
    case "user":
      return ["Log activities", "Apply for leaves", "View own history", "Monthly dashboard"]
    default:
      return []
  }
}
