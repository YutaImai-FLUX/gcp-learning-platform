"use client"

import { useMemo } from "react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { useGameStore } from "@/lib/stores/useGameStore"
import type { CertificationId } from "@/lib/types/quiz"
import { CERTIFICATIONS } from "@/lib/data/certifications"

interface DomainRadarProps {
  certId: CertificationId
}

export function DomainRadar({ certId }: DomainRadarProps) {
  const certProgress = useGameStore((s) => s.certProgress[certId])
  const cert = CERTIFICATIONS.find((c) => c.id === certId)

  const data = useMemo(() => {
    if (!cert) return []
    return cert.domains.map((domain) => {
      const scores = certProgress?.domainScores[domain.name]
      const accuracy = scores && scores.total > 0
        ? Math.round((scores.correct / scores.total) * 100)
        : 0
      // Shorten long domain names
      const shortName = domain.name.length > 12
        ? domain.name.slice(0, 10) + "…"
        : domain.name
      return { domain: shortName, score: accuracy, fullMark: 100 }
    })
  }, [cert, certProgress])

  if (!cert || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-muted-foreground">
        クイズを解くとドメイン別スコアが表示されます
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid strokeDasharray="3 3" stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
        />
        <Radar
          dataKey="score"
          stroke={cert.color}
          fill={cert.color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
