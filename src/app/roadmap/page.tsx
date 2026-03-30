"use client"

import { motion } from "framer-motion"
import { Map, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillTree } from "@/components/game/SkillTree"
import { useGameStore } from "@/lib/stores/useGameStore"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { detectWeakDomains } from "@/lib/game/weakness-detector"

export default function RoadmapPage() {
  const quizHistory = useGameStore((s) => s.quizHistory)
  const profile = useGameStore((s) => s.profile)
  const certProgress = useGameStore((s) => s.certProgress)

  const weakDomains = detectWeakDomains(quizHistory)
  const targetCerts = profile?.targetCerts ?? []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Map size={24} className="text-gcp-blue" />
          資格ロードマップ
        </h1>
        <p className="text-sm text-muted-foreground">
          CDL → ACE → Professional の学習パスを可視化
        </p>
      </motion.div>

      {/* Skill Tree */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap size={14} className="text-gcp-green" />
            スキルツリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkillTree />
        </CardContent>
      </Card>

      {/* Target certs progress */}
      {targetCerts.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">目標資格の進捗</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {targetCerts.map((certId) => {
              const cert = CERTIFICATIONS.find((c) => c.id === certId)
              const cp = certProgress[certId]
              if (!cert) return null

              const sectionCount = cp?.completedModuleSectionIds.length ?? 0
              const quizScore = cp?.quizHighScore ?? 0

              return (
                <div key={certId} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: cert.color }}
                  >
                    {cert.shortName.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground">{cert.shortName}</div>
                    <div className="text-xs text-muted-foreground">
                      {sectionCount} セクション完了 · 最高スコア {quizScore}%
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Weak domains */}
      {weakDomains.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-500">弱点ドメイン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weakDomains.slice(0, 5).map((w) => (
              <div key={`${w.certId}-${w.domain}`} className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-950/20 text-xs">
                <span className="text-foreground">
                  <span className="font-bold">{w.certId.toUpperCase()}</span>: {w.domain}
                </span>
                <span className="text-red-500 font-bold">{w.accuracy}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
