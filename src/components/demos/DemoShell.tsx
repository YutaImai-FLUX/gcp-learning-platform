"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getDemoContext } from "@/lib/data/cross-references"
import { RelatedContentSection } from "@/components/shared/RelatedContent"
import { useGameStore } from "@/lib/stores/useGameStore"

interface DemoShellProps {
  title: string
  description: string
  service: string
  color: string
  demoId?: string
  children: React.ReactNode
}

export function DemoShell({ title, description, service, color, demoId, children }: DemoShellProps) {
  const ctx = demoId ? getDemoContext(demoId) : undefined
  const trackDemo = useGameStore((s) => s.trackDemoInteraction)

  useEffect(() => {
    if (demoId) trackDemo(demoId)
  }, [demoId, trackDemo])

  return (
    <div className="space-y-4">
      {/* Back nav */}
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} />
        デモ一覧へ戻る
      </Link>

      {/* Header bar (GCP Console style) */}
      <div className="rounded-xl overflow-hidden border border-border shadow-sm">
        <div
          className="px-5 py-3 flex items-center gap-3"
          style={{ backgroundColor: color }}
        >
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white/30" />
            <span className="w-3 h-3 rounded-full bg-white/30" />
            <span className="w-3 h-3 rounded-full bg-white/30" />
          </div>
          <span className="text-white text-sm font-medium opacity-80">Google Cloud Console</span>
          <span className="text-white/50 text-sm">›</span>
          <span className="text-white text-sm font-medium">{service}</span>
        </div>

        <div className="bg-white dark:bg-[#292a2d] px-5 py-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 shrink-0 text-xs">
              <Info size={11} className="mr-1" />
              シミュレーション
            </Badge>
          </div>
        </div>

        {/* Demo content */}
        <div className="bg-white dark:bg-[#292a2d] p-5">
          {children}
        </div>
      </div>

      {/* Related content (auto-populated from cross-reference registry) */}
      {ctx && (
        <RelatedContentSection
          certIds={ctx.certIds}
          archIds={ctx.archIds}
          productIds={ctx.productIds}
          title="関連する学習コンテンツ"
        />
      )}
    </div>
  )
}
