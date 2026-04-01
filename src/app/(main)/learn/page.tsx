"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GraduationCap, Award, Code2, Building2, BarChart3, Brain, Clock, FileText, Network, Shield, BookOpen, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CERTIFICATIONS } from "@/lib/data/certifications"

const CERT_ICONS: Record<string, React.ElementType> = {
  cdl: Award,
  ace: Code2,
  pca: Building2,
  pde: BarChart3,
  pmle: Brain,
  pcne: Network,
  pcse: Shield,
  pcd: Code2,
}

const LEVEL_FILTERS = ["すべて", "Foundational", "Associate", "Professional"]

const LEVEL_ORDER = ["Foundational", "Associate", "Professional"] as const
const LEVEL_META: Record<string, { color: string; bgColor: string }> = {
  Foundational: { color: "#34A853", bgColor: "#e6f4ea" },
  Associate: { color: "#4285F4", bgColor: "#e8f0fe" },
  Professional: { color: "#EA4335", bgColor: "#fce8e6" },
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function LearnPage() {
  const [levelFilter, setLevelFilter] = useState<string>("すべて")

  const filteredCerts =
    levelFilter === "すべて"
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((c) => c.level === levelFilter)

  // Group by level for section headers
  const groupedByLevel = LEVEL_ORDER.map((level) => ({
    level,
    certs: filteredCerts.filter((c) => c.level === level),
  })).filter((g) => g.certs.length > 0)

  return (
    <motion.div
      className="space-y-8"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={stagger.item}>
        <h1 className="font-display heading-display text-2xl md:text-3xl text-foreground flex items-center gap-3">
          <GraduationCap className="text-gcp-yellow" size={28} />
          資格学習センター
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Google Cloud 認定資格の学習ガイド・練習問題・模擬試験を提供します
        </p>
      </motion.div>

      {/* Stats — large numbers */}
      <motion.div variants={stagger.item}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "総問題数", value: "100+", unit: "問", icon: FileText, color: "text-gcp-blue", bg: "bg-gcp-blue-light" },
            { label: "資格コース", value: String(CERTIFICATIONS.length), unit: "種", icon: GraduationCap, color: "text-gcp-yellow", bg: "bg-[#fef7e0]" },
            { label: "合格ライン", value: "70", unit: "%", icon: Award, color: "text-gcp-green", bg: "bg-[#e6f4ea]" },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${s.bg}`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
                    <span className="text-sm text-muted-foreground">{s.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Roadmap */}
      <motion.div variants={stagger.item}>
        <div className="bg-muted/30 rounded-xl p-4 border border-border">
          <h2 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ChevronRight size={15} className="text-primary" />
            推奨学習パス
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            {LEVEL_ORDER.map((level, idx) => {
              const meta = LEVEL_META[level]
              const certsAtLevel = CERTIFICATIONS.filter((c) => c.level === level)
              return (
                <div key={level} className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="rounded-xl p-3 border flex-1 min-w-0"
                    style={{ borderColor: meta.color, backgroundColor: meta.bgColor }}
                  >
                    <p className="text-xs font-bold mb-2" style={{ color: meta.color }}>
                      {level}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {certsAtLevel.map((cert) => (
                        <Badge
                          key={cert.id}
                          className="text-xs border-0"
                          style={{ backgroundColor: cert.color, color: "#fff" }}
                        >
                          {cert.shortName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {idx < LEVEL_ORDER.length - 1 && (
                    <ChevronRight size={20} className="text-muted-foreground shrink-0 hidden md:block" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Level filter tabs */}
      <motion.div variants={stagger.item} className="flex items-center gap-2 flex-wrap">
        {LEVEL_FILTERS.map((level) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              levelFilter === level
                ? "bg-primary text-white border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {level}
          </button>
        ))}
      </motion.div>

      {/* Certification cards — grouped by level */}
      {groupedByLevel.map((group) => {
        const meta = LEVEL_META[group.level]
        return (
          <motion.div key={group.level} variants={stagger.item} className="space-y-4">
            {/* Level section header */}
            {levelFilter === "すべて" && (
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <h2 className="font-display text-lg font-bold text-foreground">{group.level}</h2>
                <span className="text-xs text-muted-foreground">{group.certs.length}コース</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {group.certs.map((cert, i) => {
                const Icon = CERT_ICONS[cert.id] ?? Award
                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card className="border-border hover:shadow-md transition-all overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Color bar */}
                          <div
                            className="w-1.5 shrink-0 rounded-l-lg"
                            style={{ backgroundColor: cert.color }}
                          />

                          <div className="flex-1 p-5">
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                              <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0"
                                style={{ backgroundColor: cert.color }}
                              >
                                <Icon size={28} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge
                                        className="text-xs border-0"
                                        style={{ backgroundColor: cert.bgColor, color: cert.color }}
                                      >
                                        {cert.level}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">{cert.shortName}</Badge>
                                    </div>
                                    <h3 className="font-display font-bold text-foreground text-lg">{cert.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-xl">{cert.description}</p>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <Link href={`/learn/${cert.id}`}>
                                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                                        学習ガイド
                                      </Badge>
                                    </Link>
                                    <Link href={`/learn/${cert.id}/quiz?mode=practice`}>
                                      <Badge
                                        className="text-xs cursor-pointer text-white border-0"
                                        style={{ backgroundColor: cert.color }}
                                      >
                                        練習問題
                                      </Badge>
                                    </Link>
                                    <Link href={`/learn/${cert.id}/quiz?mode=exam`}>
                                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                                        模擬試験
                                      </Badge>
                                    </Link>
                                  </div>
                                </div>

                                {/* Exam info */}
                                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <Clock size={13} />
                                    <span>{cert.durationMinutes}分</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <FileText size={13} />
                                    <span>{cert.questionCount}問</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Award size={13} />
                                    <span>合格ライン: {cert.passingScore}%</span>
                                  </div>
                                  {cert.estimatedStudyHours && (
                                    <div className="flex items-center gap-1.5">
                                      <BookOpen size={13} />
                                      <span>目安: 約{cert.estimatedStudyHours}時間</span>
                                    </div>
                                  )}
                                </div>

                                {/* Prerequisites */}
                                {cert.prerequisites && cert.prerequisites.length > 0 && (
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                    <span>前提推奨:</span>
                                    {cert.prerequisites.map((p) => (
                                      <Badge key={p} variant="secondary" className="text-xs uppercase">{p}</Badge>
                                    ))}
                                  </div>
                                )}

                                {/* Domains — full width at bottom */}
                                <div className="mt-4 space-y-2">
                                  {cert.domains.map((domain) => (
                                    <div key={domain.name} className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground truncate flex-1 pr-2">{domain.name}</span>
                                        <span className="font-medium text-foreground shrink-0">{domain.percentage}%</span>
                                      </div>
                                      <Progress
                                        value={domain.percentage}
                                        className="h-1.5"
                                        style={{ "--progress-color": cert.color } as React.CSSProperties}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
