"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TimerBarProps {
  durationSeconds: number
  isRunning: boolean
  onTimeUp: () => void
  color?: string
}

export function TimerBar({ durationSeconds, isRunning, onTimeUp, color = "#4285F4" }: TimerBarProps) {
  const [remaining, setRemaining] = useState(durationSeconds)

  useEffect(() => {
    setRemaining(durationSeconds)
  }, [durationSeconds])

  useEffect(() => {
    if (!isRunning || remaining <= 0) return
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, remaining, onTimeUp])

  const pct = (remaining / durationSeconds) * 100
  const isLow = remaining <= 10
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isLow ? "#EA4335" : color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className={`text-xs font-mono font-bold tabular-nums ${isLow ? "text-red-500" : "text-muted-foreground"}`}>
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  )
}
