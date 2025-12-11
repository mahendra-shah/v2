"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { motion } from "framer-motion"
import { Gift, Calendar, CheckCircle2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function CompOffPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const [formData, setFormData] = useState({
    employeeEmail: "",
    reason: "",
    startDate: today,
    endDate: today,
    durationType: "",
    halfDayStatus: "",
  })

  const employees = [
    "john.doe@navgurukul.org",
    "jane.smith@navgurukul.org",
    "mike.johnson@navgurukul.org",
    "sarah.wilson@navgurukul.org",
  ]

  const handleSubmit = async () => {
    if (!formData.employeeEmail || !formData.reason || !formData.durationType) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Comp-Off Request Submitted",
      description: "The compensatory leave request has been submitted",
    })

    setFormData({
      employeeEmail: "",
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Compensatory Request</h1>
          <p className="text-muted-foreground mt-1">Apply for compensatory leave for extra work</p>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">About Comp-Off</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Compensatory leave is granted for extra hours worked on holidays or weekends. This form allows managers
                to submit comp-off requests on behalf of team members.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              New Comp-Off Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label>Employee Email *</Label>
              <Select
                value={formData.employeeEmail}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, employeeEmail: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((email) => (
                    <SelectItem key={email} value={email}>
                      {email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label>Reason for Working *</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Describe the extra work performed..."
                className="bg-background min-h-[100px]"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>To Date *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Duration Type */}
            <div className="space-y-2">
              <Label>Duration Type *</Label>
              <Select
                value={formData.durationType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, durationType: value, halfDayStatus: "" }))}
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

            {/* Half Day Options */}
            {formData.durationType === "half-day" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <Label>Half Day Status *</Label>
                <RadioGroup
                  value={formData.halfDayStatus}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, halfDayStatus: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="first-half" id="first" />
                    <Label htmlFor="first" className="cursor-pointer">
                      First Half
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="second-half" id="second" />
                    <Label htmlFor="second" className="cursor-pointer">
                      Second Half
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
            )}

            {/* Raised By */}
            <div className="space-y-2">
              <Label>Raised By</Label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{user?.email || "demo@navgurukul.org"}</span>
              </div>
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
