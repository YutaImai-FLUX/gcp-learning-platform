"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sword, Lock, CheckCircle2, ArrowRight, GitBranch } from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DUNGEON_MAPS } from "@/lib/game/dungeon-config"
import { DUNGEON_THEMES } from "@/lib/game/dungeon-themes"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import type { CertificationId } from "@/lib/types/quiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillTree } from "@/components/game/SkillTree"

const CERT_ORDER: CertificationId[] = ["cdl", "ace", "pca", "pde", "pmle", "pcne", "pcse", "pcd"]

export default function DungeonSelectPage() {
  const level = useGameStore((s) => s.level)
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sword size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">ダンジョン冒険</h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              現在レベル: <span className="text-primary font-bold">{level}</span>
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          各GCP資格がダンジョンに変身！部屋を攻略してクイズバトルに挑み、ボスを倒して資格マスターを目指そう。
        </p>
      </motion.div>

      {/* Dungeon grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CERT_ORDER.map((certId, idx) => {
          const dungeon = DUNGEON_MAPS[certId]
          const theme = DUNGEON_THEMES[dungeon.theme]
          const cert = CERTIFICATIONS.find((c) => c.id === certId)
          if (!cert) return null

          const clearedRooms = dungeon.rooms.filter((r) => dungeonProgress[r.id]?.cleared).length
          const totalRooms = dungeon.rooms.length
          const progressPct = Math.round((clearedRooms / totalRooms) * 100)
          const isComplete = clearedRooms === totalRooms

          const prevCertId = idx > 0 ? CERT_ORDER[idx - 1] : null
          const prevBossId = prevCertId ? `${prevCertId}-boss` : null
          const isUnlocked = idx === 0 || (prevBossId ? dungeonProgress[prevBossId]?.cleared : false)

          return (
            <motion.div
              key={certId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {isUnlocked ? (
                <Link
                  href={`/dungeon/${certId}`}
                  className="group block rounded-lg border border-border bg-card overflow-hidden transition-all hover:shadow-md hover:border-current"
                  style={{ color: theme.accentColor }}
                >
                  {/* Accent bar */}
                  <div className="h-1" style={{ backgroundColor: theme.accentColor }} />

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: theme.accentMuted }}
                      >
                        {theme.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-foreground">
                            {dungeon.name}
                          </h3>
                          {isComplete ? (
                            <CheckCircle2 size={18} style={{ color: theme.accentColor }} />
                          ) : (
                            <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {cert.shortName} — {cert.level}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: theme.accentColor }}>
                          {theme.name}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPct}%`,
                            backgroundColor: theme.accentColor,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                        {clearedRooms}/{totalRooms}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-lg border border-border bg-card overflow-hidden opacity-40 cursor-not-allowed">
                  <div className="h-1 bg-muted" />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Lock size={18} className="text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-muted-foreground">{dungeon.name}</h3>
                        <p className="text-xs text-muted-foreground">{cert.shortName} — {cert.level}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      前のダンジョンのボスを倒すとアンロック
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Skill Tree */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GitBranch size={14} className="text-primary" />
            資格スキルツリー
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            資格をクリックしてダンジョンへ。上位資格は前提資格の攻略後にアンロック。
          </p>
        </CardHeader>
        <CardContent>
          <SkillTree />
        </CardContent>
      </Card>
    </div>
  )
}
