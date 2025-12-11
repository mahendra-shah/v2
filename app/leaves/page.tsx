"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { motion } from "framer-motion"
import { Calendar, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LeavesPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const [formData, setFormData] = useState({
    leaveType: "",
    reason: "",
    startDate: today,
    endDate: today,
    durationType: "",
    halfDayStatus: "",
  })

  const leaveTypes = ["Casual Leave", "Wellness Leave", "Festival Leave", "Compensatory Leave", "Special Leave"]

  const leaveBalance = [
    { type: "Casual Leave", allotted: 12, balance: 8, booked: 3, pending: 1 },
    { type: "Wellness Leave", allotted: 6, balance: 4, booked: 2, pending: 0 },
    { type: "Festival Leave", allotted: 3, balance: 3, booked: 0, pending: 0 },
    { type: "Compensatory Leave", allotted: 5, balance: 5, booked: 0, pending: 0 },
  ]

  const selectedLeaveBalance = leaveBalance.find((l) => l.type === formData.leaveType)

  const handleSubmit = async () => {
    if (!formData.leaveType || !formData.reason || !formData.durationType) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.durationType === "half-day" && !formData.halfDayStatus) {
      toast({
        title: "Half Day Status Required",
        description: "Please select first half or second half",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been sent for approval",
    })

    setFormData({
      leaveType: "",
      reason: "",
      startDate: today,
      endDate: today,
      durationType: "",
      halfDayStatus: "",
    })
    setIsSubmitting(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leave Application</h1>
          <p className="text-muted-foreground mt-1">Apply for leaves and track your balance</p>
        </div>

        {/* Leave Balance Accordion */}
        <Accordion type="single" collapsible defaultValue="balance" className="w-full">
          <AccordionItem value="balance" className="border border-border rounded-2xl overflow-hidden bg-card">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-lg">Leave Balance</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="font-semibold">Leave Type</TableHead>
                      <TableHead className="font-semibold text-center">Allotted</TableHead>
                      <TableHead className="font-semibold text-center">Balance</TableHead>
                      <TableHead className="font-semibold text-center">Booked</TableHead>
                      <TableHead className="font-semibold text-center">Pending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveBalance.map((leave) => (
                      <TableRow key={leave.type}>
                        <TableCell className="font-medium">{leave.type}</TableCell>
                        <TableCell className="text-center">{leave.allotted}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={leave.balance > 3 ? "default" : "destructive"} className="min-w-[2rem]">
                            {leave.balance}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{leave.booked}</TableCell>
                        <TableCell className="text-center">
                          {leave.pending > 0 ? (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                              {leave.pending}
                            </Badge>
                          ) : (
                            "0"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Leave Application Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              New Leave Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label>Leave Type *</Label>
                <Select
                  value={formData.leaveType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, leaveType: value }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLeaveBalance && (
                  <p className="text-sm text-primary">You have {selectedLeaveBalance.balance} leaves available</p>
                )}
              </div>

              {/* Duration Type */}
              <div className="space-y-2">
                <Label>Duration Type *</Label>
                <Select
                  value={formData.durationType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, durationType: value, halfDayStatus: "" }))
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-day">Full Day</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="bg-background"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="bg-background"
                  disabled={formData.durationType === "half-day"}
                />
              </div>
            </div>

            {/* Half Day Options */}
            {formData.durationType === "half-day" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label>Half Day Status *</Label>
                <RadioGroup
                  value={formData.halfDayStatus}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, halfDayStatus: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="first-half" id="first-half" />
                    <Label htmlFor="first-half" className="cursor-pointer">
                      First Half
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="second-half" id="second-half" />
                    <Label htmlFor="second-half" className="cursor-pointer">
                      Second Half
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label>Reason for Leave *</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Please provide a reason for your leave request..."
                className="bg-background min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">Minimum 25 characters required for certain leave types</p>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-12 px-8">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Submit Request</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
