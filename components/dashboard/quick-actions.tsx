"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-2">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button onClick={() => router.push("/activity-tracker")} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Activity</span>
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button variant="outline" onClick={() => router.push("/leaves")} className="gap-2">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Apply Leave</span>
        </Button>
      </motion.div>
    </div>
  )
}
