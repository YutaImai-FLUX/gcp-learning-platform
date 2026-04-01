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

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function DungeonSelectPage() {
  const level = useGameStore((s) => s.level)
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Hero Header */}
      <motion.div variants={stagger.item}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#1565c0] text-white px-6 py-8 sm:px-8 sm:py-10">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl" />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Sword size={28} />
            </div>
            <div>
              <h1 className="font-display heading-display text-2xl sm:text-3xl">ダンジョン冒険</h1>
              <p className="text-white/50 text-sm mt-1">
                現在レベル: <span className="text-white font-bold">{level}</span>
              </p>
            </div>
          </div>
          <p className="relative text-white/60 text-sm leading-relaxed mt-4 max-w-lg">
            各GCP資格がダンジョンに変身！部屋を攻略してクイズバトルに挑み、ボスを倒して資格マスターを目指そう。
          </p>
        </div>
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
              variants={stagger.item}
            >
              {isUnlocked ? (
                <Link
                  href={`/dungeon/${certId}`}
                  className="group block rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-current"
                  style={{ color: theme.accentColor }}
                >
                  {/* Accent bar */}
                  <div className="h-1.5" style={{ backgroundColor: theme.accentColor }} />

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: theme.accentMuted }}
                      >
                        {theme.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-base text-foreground">
                            {dungeon.name}
                          </h3>
                          {isComplete ? (
                            <CheckCircle2 size={18} style={{ color: theme.accentColor }} />
                          ) : (
                            <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {cert.shortName} — {cert.level}
                        </p>
                        <p className="text-[10px] font-medium mt-1" style={{ color: theme.accentColor }}>
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
                <div className="relative rounded-xl border border-border bg-card overflow-hidden cursor-not-allowed">
                  <div className="h-1.5 bg-muted" />
                  <div className="p-4 sm:p-5 blur-[2px] opacity-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl">
                        {theme.icon}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-muted-foreground">{dungeon.name}</h3>
                        <p className="text-xs text-muted-foreground">{cert.shortName} — {cert.level}</p>
                      </div>
                    </div>
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                    <Lock size={24} className="text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      前のダンジョンをクリアしてアンロック
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Skill Tree */}
      <motion.div variants={stagger.item}>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm flex items-center gap-2">
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
      </motion.div>
    </motion.div>
  )
}
