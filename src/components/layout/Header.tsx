"use client"

import { useState, useEffect } from "react"
import { Search, Moon, Sun, Bell, HelpCircle, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSidebarStore } from "@/lib/stores/useSidebarStore"
import { CommandPalette } from "@/components/search/CommandPalette"
import { useGameStore } from "@/lib/stores/useGameStore"

export function Header() {
  const [dark, setDark] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const collapsed = useSidebarStore((s) => s.collapsed)
  const level = useGameStore((s) => s.level)
  const streakDays = useGameStore((s) => s.streaks.currentStreak)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") setDark(true)
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark])

  // Global keyboard shortcut: Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className={`fixed top-0 right-0 h-14 bg-white dark:bg-[#292a2d] border-b border-border z-30 flex items-center px-6 gap-4 transition-[left] duration-200 ${collapsed ? "left-16" : "left-64"}`}>
        {/* Search trigger */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="relative flex-1 max-w-xl flex items-center gap-2 h-9 px-3 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
        >
          <Search size={16} />
          <span>検索...</span>
          <kbd className="ml-auto flex items-center gap-0.5 text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono">
            <Command size={10} />K
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Level & Streak badges */}
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary" className="font-bold">
            Lv.{level}
          </Badge>
          {streakDays > 0 && (
            <Badge variant="secondary" className="text-orange-500">
              {streakDays}日連続
            </Badge>
          )}
        </div>

        {/* Project selector */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">プロジェクト:</span>
          <Badge variant="secondary" className="font-mono text-xs">
            my-gcp-project
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9" title="通知">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" title="ヘルプ">
            <HelpCircle size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setDark(!dark)}
            title={dark ? "ライトモード" : "ダークモード"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gcp-blue flex items-center justify-center text-white text-xs font-bold ml-1">
            GC
          </div>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
