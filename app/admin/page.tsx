"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FileText, Users, Calendar, DollarSign, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("logs")

  const dailyLogs = [
    { id: 1, name: "John Doe", date: "2024-12-11", hours: 8.5, projects: 3 },
    { id: 2, name: "Jane Smith", date: "2024-12-11", hours: 7, projects: 2 },
    { id: 3, name: "Mike Johnson", date: "2024-12-11", hours: 6.5, projects: 2 },
    { id: 4, name: "Sarah Wilson", date: "2024-12-10", hours: 8, projects: 4 },
  ]

  const employees = [
    { id: 1, name: "John Doe", email: "john@navgurukul.org", dept: "Engineering", role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@navgurukul.org", dept: "Design", role: "Designer" },
    { id: 3, name: "Mike Johnson", email: "mike@navgurukul.org", dept: "Engineering", role: "Developer" },
  ]

  const leaveRequests = [
    { id: 1, name: "John Doe", type: "Casual Leave", dates: "Dec 15-16", status: "pending" },
    { id: 2, name: "Jane Smith", type: "Wellness Leave", dates: "Dec 20", status: "pending" },
  ]

  const tabs = [
    { id: "logs", label: "Daily Logs", icon: FileText },
    { id: "employees", label: "Employees", icon: Users },
    { id: "leaves", label: "Leave Management", icon: Calendar },
    { id: "payroll", label: "Payable Days", icon: DollarSign },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage employees, logs, and leave requests</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Employees", value: "45", icon: Users, color: "bg-primary/10 text-primary" },
            { label: "Today's Logs", value: "38", icon: FileText, color: "bg-chart-2/20 text-chart-2" },
            { label: "Pending Leaves", value: "7", icon: Calendar, color: "bg-yellow-500/20 text-yellow-600" },
            { label: "This Month", value: "892h", icon: DollarSign, color: "bg-chart-4/20 text-chart-4" },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-12 p-1 bg-secondary/50 w-full justify-start overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 h-10 px-4">
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Daily Logs */}
          <TabsContent value="logs" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recent Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Employee</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Hours</TableHead>
                        <TableHead className="text-center">Projects</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.name}</TableCell>
                          <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">{log.hours}h</TableCell>
                          <TableCell className="text-center">{log.projects}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees */}
          <TabsContent value="employees" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Employee Management</CardTitle>
                  <Button size="sm">Add Employee</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell>{emp.email}</TableCell>
                          <TableCell>{emp.dept}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{emp.role}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Management */}
          <TabsContent value="leaves" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <Card key={request.id} className="bg-secondary/30 border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.type} - {request.dates}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll */}
          <TabsContent value="payroll" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Payable Days Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Payroll data will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
