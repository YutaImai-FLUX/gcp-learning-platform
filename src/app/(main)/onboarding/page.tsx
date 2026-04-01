"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { useGameStore } from "@/lib/stores/useGameStore"
import type { CertificationId } from "@/lib/types/quiz"

type Experience = "none" | "beginner" | "intermediate" | "advanced"

const EXPERIENCES: Array<{ value: Experience; label: string; desc: string }> = [
  { value: "none", label: "未経験", desc: "クラウドやGCPは初めて" },
  { value: "beginner", label: "初心者", desc: "基本的な概念は知っている" },
  { value: "intermediate", label: "中級者", desc: "GCPを業務で使用している" },
  { value: "advanced", label: "上級者", desc: "GCPの設計・運用経験が豊富" },
]

const STUDY_TIMES = [15, 30, 45, 60, 90]
const STEP_TITLES = ["プロフィール", "目標資格", "学習プラン"]

export default function OnboardingPage() {
  const router = useRouter()
  const setProfile = useGameStore((s) => s.setProfile)

  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [experience, setExperience] = useState<Experience>("none")
  const [targetCerts, setTargetCerts] = useState<CertificationId[]>([])
  const [dailyMinutes, setDailyMinutes] = useState(30)

  const handleComplete = () => {
    setProfile({
      displayName: name || "学習者",
      gcpExperience: experience,
      targetCerts,
      dailyStudyMinutes: dailyMinutes,
      createdAt: Date.now(),
    })
    router.push("/")
  }

  const toggleCert = (id: CertificationId) => {
    setTargetCerts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const steps = [
    <div key="step0" className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">ニックネーム</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="あなたの名前"
          className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">GCPの経験レベル</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCES.map((exp) => (
            <button
              key={exp.value}
              onClick={() => setExperience(exp.value)}
              className={`p-3 rounded-xl border text-left transition-all ${
                experience === exp.value
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="text-sm font-bold text-foreground">{exp.label}</div>
              <div className="text-xs text-muted-foreground">{exp.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>,

    <div key="step1" className="space-y-4">
      <label className="text-sm font-medium text-foreground block">目標資格を選択（複数可）</label>
      <div className="grid grid-cols-1 gap-2">
        {CERTIFICATIONS.map((cert) => (
          <button
            key={cert.id}
            onClick={() => toggleCert(cert.id as CertificationId)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              targetCerts.includes(cert.id as CertificationId)
                ? "border-primary bg-accent"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: cert.color }}
            >
              {cert.shortName.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">{cert.shortName}</div>
              <div className="text-xs text-muted-foreground">{cert.level}</div>
            </div>
            {targetCerts.includes(cert.id as CertificationId) && (
              <span className="text-primary text-xs font-bold">選択中</span>
            )}
          </button>
        ))}
      </div>
    </div>,

    <div key="step2" className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">1日の学習時間</label>
        <div className="flex flex-wrap gap-2">
          {STUDY_TIMES.map((min) => (
            <button
              key={min}
              onClick={() => setDailyMinutes(min)}
              className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                dailyMinutes === min
                  ? "border-primary bg-primary text-white"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="font-display text-lg font-bold">{min}</span>
              <span className="text-xs ml-0.5">分</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-muted/50 p-5 space-y-3">
        <p className="font-display font-bold text-foreground">あなたの学習プラン</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">経験</span>
            <span className="font-medium text-foreground">{EXPERIENCES.find((e) => e.value === experience)?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">目標</span>
            <span className="font-medium text-foreground">{targetCerts.length > 0 ? targetCerts.map((c) => c.toUpperCase()).join(", ") : "未選択"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">学習時間</span>
            <span className="font-display font-bold text-foreground">{dailyMinutes}分/日</span>
          </div>
        </div>
      </div>
    </div>,
  ]

  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="flex justify-center gap-1 mb-4">
          <span className="w-3 h-3 rounded-full bg-gcp-blue" />
          <span className="w-3 h-3 rounded-full bg-gcp-red" />
          <span className="w-3 h-3 rounded-full bg-gcp-yellow" />
          <span className="w-3 h-3 rounded-full bg-gcp-green" />
        </div>
        <h1 className="font-display heading-display text-2xl">GCP Learning へようこそ</h1>
        <p className="text-sm text-muted-foreground mt-1.5">あなたに合った学習プランを作成します</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex justify-center items-center gap-1">
        {STEP_TITLES.map((title, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[10px] ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {title}
              </span>
            </div>
            {i < STEP_TITLES.length - 1 && (
              <div className={`w-12 h-0.5 rounded-full mb-4 ${i < step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
          <ChevronLeft size={14} className="mr-1" /> 戻る
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)}>
            次へ <ChevronRight size={14} className="ml-1" />
          </Button>
        ) : (
          <Button onClick={handleComplete} className="bg-gcp-green hover:bg-gcp-green/90 text-white">
            <Rocket size={14} className="mr-1.5" /> 学習を開始
          </Button>
        )}
      </div>
    </div>
  )
}
