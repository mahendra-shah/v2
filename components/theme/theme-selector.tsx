"use client"

import { motion } from "framer-motion"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme } from "./theme-provider"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
          <Palette className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground mb-3">Choose Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-colors",
                  theme === t.id ? "border-primary bg-primary/5" : "border-transparent hover:border-border",
                )}
              >
                <div
                  className="w-8 h-8 rounded-lg border border-border shadow-sm"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-xs text-muted-foreground">{t.name}</span>
                {theme === t.id && (
                  <motion.div
                    layoutId="theme-check"
                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
