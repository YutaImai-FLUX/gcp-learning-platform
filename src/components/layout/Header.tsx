"use client"

import { useState, useEffect } from "react"
import { Search, Moon, Sun, Command, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebarStore } from "@/lib/stores/useSidebarStore"
import { CommandPalette } from "@/components/search/CommandPalette"

export function Header() {
  const [dark, setDark] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const collapsed = useSidebarStore((s) => s.collapsed)

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setEmail(d.email))
      .catch(() => {})
  }, [])

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
      <header className={`fixed top-0 right-0 h-14 bg-white/80 dark:bg-[#1c1f26]/80 backdrop-blur-xl border-b border-border z-30 flex items-center px-3 sm:px-6 gap-2 sm:gap-4 transition-[left] duration-200 ${collapsed ? "left-16" : "left-64"}`}>
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

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setDark(!dark)}
            title={dark ? "ライトモード" : "ダークモード"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          {email && (
            <div className="flex items-center gap-2 ml-2">
              <User size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {email}
              </span>
            </div>
          )}
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
