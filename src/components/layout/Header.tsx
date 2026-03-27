"use client"

import { useState, useEffect } from "react"
import { Search, Moon, Sun, Bell, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState("")

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

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-white dark:bg-[#292a2d] border-b border-border z-30 flex items-center px-6 gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="GCPサービスを検索..."
          className="pl-9 h-9 bg-muted border-0 focus-visible:ring-1 text-sm"
        />
      </div>

      <div className="flex-1" />

      {/* Project selector (mock) */}
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
  )
}
