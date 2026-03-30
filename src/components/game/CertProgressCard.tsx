"use client"

import Link from "next/link"
import { ArrowRight, GraduationCap } from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"
import type { CertificationId } from "@/lib/types/quiz"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { Badge } from "@/components/ui/badge"

export function CertProgressCards() {
  const certProgress = useGameStore((s) => s.certProgress)
  const startedCerts = Object.keys(certProgress) as CertificationId[]

  if (startedCerts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <GraduationCap size={24} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">まだ資格学習を開始していません</p>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs text-gcp-blue hover:underline mt-2"
        >
          資格学習を始める <ArrowRight size={11} />
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {startedCerts.map((certId) => {
        const cert = CERTIFICATIONS.find((c) => c.id === certId)
        const cp = certProgress[certId]
        if (!cert || !cp) return null

        const totalSections = cert.domains.length * 4 // estimate
        const sectionProgress = Math.min(
          Math.round((cp.completedModuleSectionIds.length / Math.max(totalSections, 1)) * 100),
          100
        )

        return (
          <Link
            key={certId}
            href={`/learn/${certId}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-gcp-blue/40 hover:shadow-sm transition-all bg-white dark:bg-[#292a2d]"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: cert.color }}
            >
              {cert.shortName.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-foreground truncate">{cert.shortName}</p>
                <Badge variant="secondary" className="text-[9px] px-1 py-0">{cert.level}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${sectionProgress}%`, backgroundColor: cert.color }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{sectionProgress}%</span>
              </div>
              {cp.quizHighScore > 0 && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  最高スコア: {cp.quizHighScore}%
                </p>
              )}
            </div>
            <ArrowRight size={12} className="text-muted-foreground shrink-0" />
          </Link>
        )
      })}
    </div>
  )
}
