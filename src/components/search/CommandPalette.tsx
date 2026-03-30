"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Package, PlayCircle, GraduationCap, FileText, ArrowRight } from "lucide-react"
import { searchItems, type SearchItem } from "@/lib/search/search-index"

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  product: Package,
  demo: PlayCircle,
  cert: GraduationCap,
  page: FileText,
}

const CATEGORY_LABELS: Record<string, string> = {
  product: "製品",
  demo: "デモ",
  cert: "資格",
  page: "ページ",
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchItem[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (open) {
      setQuery("")
      setResults([])
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setResults(searchItems(query))
    setActiveIndex(0)
  }, [query])

  const navigate = useCallback((href: string) => {
    router.push(href)
    onClose()
  }, [router, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && results[activeIndex]) {
      navigate(results[activeIndex].href)
    } else if (e.key === "Escape") {
      onClose()
    }
  }, [results, activeIndex, navigate, onClose])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        {/* Palette */}
        <motion.div
          className="relative w-full max-w-lg rounded-xl bg-card border border-border shadow-2xl overflow-hidden"
          initial={{ y: -20, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: -20, scale: 0.95 }}
        >
          {/* Input */}
          <div className="flex items-center gap-3 p-3 border-b border-border">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="検索... (製品、デモ、資格、ページ)"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                「{query}」に一致する結果はありません
              </div>
            )}

            {results.map((item, idx) => {
              const Icon = CATEGORY_ICONS[item.category] ?? FileText
              const isActive = idx === activeIndex

              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isActive ? "bg-gcp-blue-light/50 dark:bg-gcp-blue/10" : "hover:bg-muted"
                  }`}
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <Icon size={16} className="text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  {isActive && <ArrowRight size={12} className="text-gcp-blue shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          {!query && (
            <div className="p-3 border-t border-border text-[10px] text-muted-foreground flex gap-4">
              <span><kbd className="font-mono bg-muted px-1 rounded">↑↓</kbd> ナビゲーション</span>
              <span><kbd className="font-mono bg-muted px-1 rounded">Enter</kbd> 移動</span>
              <span><kbd className="font-mono bg-muted px-1 rounded">Esc</kbd> 閉じる</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
