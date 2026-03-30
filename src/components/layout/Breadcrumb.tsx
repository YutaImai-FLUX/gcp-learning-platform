"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const ROUTE_LABELS: Record<string, string> = {
  "": "ダッシュボード",
  "products": "製品カタログ",
  "demos": "インタラクティブデモ",
  "architecture": "アーキテクチャ図",
  "proposal": "提案シミュレーター",
  "learn": "資格学習センター",
  "dungeon": "ダンジョン冒険",
  "flashcards": "フラッシュカード",
  "updates": "最新アップデート",
  "quiz": "クイズ",
  "new": "新規作成",
}

export function Breadcrumb() {
  const pathname = usePathname()
  if (pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)
  const crumbs = segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] ?? decodeURIComponent(seg).toUpperCase(),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }))

  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
      <Link href="/" className="hover:text-foreground transition-colors">
        <Home size={12} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight size={10} />
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
