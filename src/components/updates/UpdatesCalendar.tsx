"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface UpdatesCalendarProps {
  /** Dates that have updates, in "YYYY-MM-DD" format */
  updateDates: string[]
  /** Currently selected date filter (null = no filter) */
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function UpdatesCalendar({ updateDates, selectedDate, onSelectDate }: UpdatesCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const updateDateSet = useMemo(() => new Set(updateDates), [updateDates])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  // Count updates in current view month
  const monthUpdateCount = useMemo(() => {
    let count = 0
    for (let d = 1; d <= daysInMonth; d++) {
      if (updateDateSet.has(formatDate(viewYear, viewMonth, d))) count++
    }
    return count
  }, [viewYear, viewMonth, daysInMonth, updateDateSet])

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft size={14} className="text-muted-foreground" />
        </button>
        <div className="text-center">
          <span className="font-display text-sm font-bold text-foreground">
            {viewYear}年{viewMonth + 1}月
          </span>
          {monthUpdateCount > 0 && (
            <span className="text-[10px] text-muted-foreground ml-1.5">
              ({monthUpdateCount}件)
            </span>
          )}
        </div>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`text-center text-[10px] font-medium py-1 ${
              i === 0 ? "text-destructive/60" : i === 6 ? "text-primary/60" : "text-muted-foreground"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = formatDate(viewYear, viewMonth, day)
          const hasUpdate = updateDateSet.has(dateStr)
          const isSelected = selectedDate === dateStr
          const isToday =
            viewYear === today.getFullYear() &&
            viewMonth === today.getMonth() &&
            day === today.getDate()
          const dayOfWeek = (firstDay + i) % 7

          return (
            <button
              key={day}
              onClick={() => {
                if (hasUpdate) {
                  onSelectDate(isSelected ? null : dateStr)
                }
              }}
              disabled={!hasUpdate}
              className={`
                relative h-8 flex flex-col items-center justify-center rounded-lg text-xs transition-all
                ${hasUpdate ? "cursor-pointer hover:bg-muted" : "cursor-default"}
                ${isSelected ? "bg-primary text-white hover:bg-primary/90" : ""}
                ${isToday && !isSelected ? "font-bold" : ""}
                ${!hasUpdate && !isToday ? "text-muted-foreground/40" : ""}
                ${dayOfWeek === 0 && !isSelected ? "text-destructive/70" : ""}
                ${dayOfWeek === 6 && !isSelected ? "text-primary/70" : ""}
              `}
            >
              <span>{day}</span>
              {/* Update indicator dot */}
              {hasUpdate && !isSelected && (
                <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
              {/* Today ring */}
              {isToday && !isSelected && (
                <div className="absolute inset-0.5 rounded-lg border border-primary/30" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date info */}
      {selectedDate && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {selectedDate} のアップデートを表示中
          </span>
          <button
            onClick={() => onSelectDate(null)}
            className="text-[10px] text-primary hover:underline"
          >
            解除
          </button>
        </div>
      )}
    </div>
  )
}
