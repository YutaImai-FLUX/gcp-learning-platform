"use client"

import Link from "next/link"
import { AlertTriangle, BookOpen, ArrowRight } from "lucide-react"
import type { CertificationId } from "@/lib/types/quiz"
import { useGameStore } from "@/lib/stores/useGameStore"
import { detectWeakDomains } from "@/lib/game/weakness-detector"

interface WeakDomainAlertProps {
  certId: CertificationId
}

export function WeakDomainAlert({ certId }: WeakDomainAlertProps) {
  const quizHistory = useGameStore((s) => s.quizHistory)
  const weakDomains = detectWeakDomains(quizHistory, certId)

  if (weakDomains.length === 0) return null

  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-3">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
        <AlertTriangle size={16} />
        <span className="text-sm font-bold">弱点ドメインを検出</span>
      </div>
      <div className="space-y-2">
        {weakDomains.slice(0, 3).map((w) => (
          <div
            key={`${w.certId}:${w.domain}`}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <BookOpen size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-foreground truncate">{w.domain}</span>
              <span className="text-muted-foreground shrink-0">
                正答率 {w.accuracy}% ({w.correct}/{w.total})
              </span>
            </div>
            <Link
              href={`/learn/${w.certId}`}
              className="flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline shrink-0 font-medium"
            >
              学習 <ArrowRight size={10} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
