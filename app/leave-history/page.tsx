"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { User, Building2, CheckCircle2, XCircle, Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function LeaveHistoryPage() {
  const [activeTab, setActiveTab] = useState("personal")

  const personalHistory = [
    { id: 1, type: "Casual Leave", startDate: "2024-12-05", endDate: "2024-12-06", status: "approved", days: 2 },
    { id: 2, type: "Wellness Leave", startDate: "2024-11-20", endDate: "2024-11-20", status: "approved", days: 1 },
    { id: 3, type: "Festival Leave", startDate: "2024-11-14", endDate: "2024-11-14", status: "rejected", days: 1 },
    { id: 4, type: "Casual Leave", startDate: "2024-10-25", endDate: "2024-10-25", status: "pending", days: 0.5 },
  ]

  const orgHistory = [
    { id: 1, name: "John Doe", type: "Casual Leave", date: "2024-12-10", status: "approved" },
    { id: 2, name: "Jane Smith", type: "Wellness Leave", date: "2024-12-09", status: "pending" },
    { id: 3, name: "Mike Johnson", type: "Festival Leave", date: "2024-12-08", status: "approved" },
    { id: 4, name: "Sarah Wilson", type: "Casual Leave", date: "2024-12-07", status: "rejected" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        variant="outline"
        className={cn(
          "capitalize",
          status === "approved" && "bg-green-500/10 text-green-600 border-green-500/20",
          status === "rejected" && "bg-red-500/10 text-red-600 border-red-500/20",
          status === "pending" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        )}
      >
        {getStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </Badge>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leave History</h1>
          <p className="text-muted-foreground mt-1">View personal and organization leave records</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="personal" className="flex items-center gap-2 h-10">
              <User className="w-4 h-4" />
              Personal History
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2 h-10">
              <Building2 className="w-4 h-4" />
              Organization
            </TabsTrigger>
          </TabsList>

          {/* Personal History Tab */}
          <TabsContent value="personal" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Leave History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead className="text-center">Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {personalHistory.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell className="font-medium">{leave.type}</TableCell>
                          <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">{leave.days}</TableCell>
                          <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organization" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Organization Leave Records</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Employee</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.name}</TableCell>
                          <TableCell>{record.type}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
