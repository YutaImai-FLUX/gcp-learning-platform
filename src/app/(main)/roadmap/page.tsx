"use client"

import { motion } from "framer-motion"
import { Map, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillTree } from "@/components/game/SkillTree"
import { useGameStore } from "@/lib/stores/useGameStore"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { detectWeakDomains } from "@/lib/game/weakness-detector"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function RoadmapPage() {
  const quizHistory = useGameStore((s) => s.quizHistory)
  const profile = useGameStore((s) => s.profile)
  const certProgress = useGameStore((s) => s.certProgress)

  const weakDomains = detectWeakDomains(quizHistory)
  const targetCerts = profile?.targetCerts ?? []

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger.item}>
        <h1 className="font-display heading-display text-2xl md:text-3xl mb-1.5 flex items-center gap-3">
          <Map size={28} className="text-primary" />
          資格ロードマップ
        </h1>
        <p className="text-sm text-muted-foreground">
          CDL → ACE → Professional の学習パスを可視化
        </p>
      </motion.div>

      <motion.div variants={stagger.item}>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <GraduationCap size={14} className="text-gcp-green" />
              スキルツリー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkillTree />
          </CardContent>
        </Card>
      </motion.div>

      {targetCerts.length > 0 && (
        <motion.div variants={stagger.item}>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm">目標資格の進捗</CardTitle>
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
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: cert.color }}
                    >
                      {cert.shortName.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-bold text-foreground">{cert.shortName}</div>
                      <div className="text-xs text-muted-foreground">
                        {sectionCount} セクション完了 · 最高スコア {quizScore}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {weakDomains.length > 0 && (
        <motion.div variants={stagger.item}>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm text-destructive">弱点ドメイン</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weakDomains.slice(0, 5).map((w) => (
                <div key={`${w.certId}-${w.domain}`} className="flex items-center justify-between p-2.5 rounded-lg bg-destructive/5 text-xs">
                  <span className="text-foreground">
                    <span className="font-bold">{w.certId.toUpperCase()}</span>: {w.domain}
                  </span>
                  <span className="font-display text-destructive font-bold">{w.accuracy}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
