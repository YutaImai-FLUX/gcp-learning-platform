"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  Award,
  Clock,
  FileText,
  CheckCircle,
  Tag,
  Play,
  Lightbulb,
  CreditCard,
  RefreshCw,
  Info,
  Target,
  GraduationCap,
  FlaskConical,
  ClipboardCheck,
  Globe,
  CalendarDays,
  Terminal,
  ChevronRight,
  RotateCcw,
  Zap,
  HelpCircle,
  ListChecks,
  ChevronLeft,
  AlertTriangle,
  Code2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getCertById } from "@/lib/data/certifications"
import { getQuestionsByCert } from "@/lib/data/quiz-questions"
import { getLabsByCert, type HandsOnLab, type LabStep } from "@/lib/data/labs"
import { getModulesByCert } from "@/lib/data/study-modules"
import { getInfographicsByCert } from "@/lib/data/infographics"
import TroubleshootStep, { type TroubleshootStepData } from "@/components/learn/TroubleshootStep"
import CodeEditStep, { type CodeEditStepData } from "@/components/learn/CodeEditStep"
import ModuleReader from "@/components/learn/ModuleReader"
import InfographicViewer from "@/components/infographics/InfographicViewer"
import type { StudyModule } from "@/lib/types/study-module"
import type { Infographic } from "@/lib/types/infographic"
import { getDemosForCert, serviceNameToProductId, PRODUCT_TO_DEMO } from "@/lib/data/cross-references"
import { RelatedDemos, RelatedArchitectures } from "@/components/shared/RelatedContent"
import { DEMO_CONTEXTS } from "@/lib/data/cross-references"
import { useGameStore } from "@/lib/stores/useGameStore"

type TabKey = "overview" | "exam" | "plan" | "resources" | "labs" | "modules" | "security"

type StepState = "pending" | "active" | "done"

function LabRunner({
  lab,
  certColor,
  onBack,
}: {
  lab: HandsOnLab
  certColor: string
  onBack: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStates, setStepStates] = useState<StepState[]>(
    lab.steps.map((_, i) => (i === 0 ? "active" : "pending"))
  )
  const [commandRunning, setCommandRunning] = useState(false)
  const [commandDone, setCommandDone] = useState(false)
  const [choiceSelected, setChoiceSelected] = useState<number | null>(null)
  const [labCompleted, setLabCompleted] = useState(false)

  const step: LabStep = lab.steps[currentStep]
  const progress = Math.round(((stepStates.filter((s) => s === "done").length) / lab.steps.length) * 100)

  function advanceStep() {
    const next = currentStep + 1
    if (next >= lab.steps.length) {
      setLabCompleted(true)
      useGameStore.getState().completeLab(lab.certId, lab.id)
      return
    }
    useGameStore.getState().completeLabStep(lab.certId, `${lab.id}-step-${currentStep}`)
    const updated = [...stepStates]
    updated[currentStep] = "done"
    updated[next] = "active"
    setStepStates(updated)
    setCurrentStep(next)
    setCommandRunning(false)
    setCommandDone(false)
    setChoiceSelected(null)
  }

  function runCommand() {
    setCommandRunning(true)
    setTimeout(() => {
      setCommandRunning(false)
      setCommandDone(true)
    }, 1800)
  }

  function reset() {
    setCurrentStep(0)
    setStepStates(lab.steps.map((_, i) => (i === 0 ? "active" : "pending")))
    setCommandRunning(false)
    setCommandDone(false)
    setChoiceSelected(null)
    setLabCompleted(false)
  }

  function canAdvance(): boolean {
    if (step.type === "command") return commandDone
    if (step.type === "choice") return choiceSelected !== null
    if (step.type === "troubleshoot") return false
    if (step.type === "code_edit") return false
    return true
  }

  const stepTypeIcon = (type: LabStep["type"]) => {
    switch (type) {
      case "command": return Terminal
      case "choice": return HelpCircle
      case "task": return ListChecks
      case "troubleshoot": return AlertTriangle
      case "code_edit": return Code2
      default: return Info
    }
  }

  if (labCompleted) {
    return (
      <div className="space-y-5">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft size={15} /> ラボ一覧に戻る
        </button>
        <div className="rounded-2xl p-8 text-center" style={{ background: `linear-gradient(135deg, ${certColor}20, ${certColor}08)`, border: `1px solid ${certColor}30` }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: certColor }}>
            <Award size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">ラボ完了！</h2>
          <p className="text-muted-foreground text-sm mb-4">{lab.title}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {lab.objectives.map((obj, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${certColor}15`, color: certColor }}>
                <CheckCircle size={11} />
                {obj}
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw size={14} className="mr-1.5" /> もう一度
            </Button>
            <Button size="sm" onClick={onBack} style={{ backgroundColor: certColor }} className="text-white">
              <ChevronLeft size={14} className="mr-1.5" /> 他のラボへ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground shrink-0">
          <ChevronLeft size={15} /> 戻る
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{lab.title}</h3>
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">{currentStep + 1} / {lab.steps.length}</Badge>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <Progress value={progress} className="h-1.5" style={{ "--progress-color": certColor } as React.CSSProperties} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{stepStates.filter((s) => s === "done").length} 完了</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Step list (mini breadcrumb) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {lab.steps.map((s, i) => {
          const Icon = stepTypeIcon(s.type)
          const state = stepStates[i]
          return (
            <div
              key={s.id}
              className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-colors ${
                state === "done"
                  ? "bg-green-100 text-green-600"
                  : state === "active"
                  ? "text-white"
                  : "bg-muted text-muted-foreground"
              }`}
              style={state === "active" ? { backgroundColor: certColor } : undefined}
              title={s.title}
            >
              {state === "done" ? <CheckCircle size={13} /> : <Icon size={13} />}
            </div>
          )
        })}
      </div>

      {/* Active step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border">
            <CardContent className="p-5 space-y-4">
              {/* Step header */}
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${certColor}18` }}
                >
                  {(() => {
                    const Icon = stepTypeIcon(step.type)
                    return <Icon size={16} style={{ color: certColor }} />
                  })()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.type === "command" ? "コマンド実行" : step.type === "choice" ? "理解度チェック" : step.type === "task" ? "実践タスク" : step.type === "troubleshoot" ? "トラブルシュート" : step.type === "code_edit" ? "コード編集" : "解説"}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {step.content}
              </div>

              {/* Command block */}
              {step.type === "command" && step.command && (
                <div className="space-y-2">
                  <div className="terminal-bg rounded-lg p-3 font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                    <span className="text-green-600 mr-2">$</span>
                    {step.command}
                  </div>
                  {!commandDone ? (
                    <Button
                      size="sm"
                      disabled={commandRunning}
                      onClick={runCommand}
                      style={{ backgroundColor: certColor }}
                      className="text-white text-xs h-8"
                    >
                      {commandRunning ? (
                        <><RotateCcw size={12} className="mr-1.5 animate-spin" /> 実行中...</>
                      ) : (
                        <><Play size={12} className="mr-1.5" /> 実行シミュレーション</>
                      )}
                    </Button>
                  ) : (
                    <div className="terminal-bg rounded-lg p-3 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap overflow-x-auto border border-green-900/30">
                      <div className="text-green-500 text-xs mb-1.5 flex items-center gap-1.5">
                        <CheckCircle size={11} /> Output:
                      </div>
                      {step.output}
                    </div>
                  )}
                </div>
              )}

              {/* Choice */}
              {step.type === "choice" && step.choices && (
                <div className="space-y-2">
                  {step.choices.map((choice, i) => (
                    <button
                      key={i}
                      disabled={choiceSelected !== null}
                      onClick={() => setChoiceSelected(i)}
                      className={`w-full text-left text-sm px-3 py-2.5 rounded-lg border transition-all ${
                        choiceSelected === null
                          ? "border-border hover:border-current hover:bg-muted"
                          : choiceSelected === i
                          ? i === step.correctChoice
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700"
                            : "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-600"
                          : i === step.correctChoice
                          ? "border-green-400 bg-green-50 dark:bg-green-950/20 text-green-700"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <span className="font-medium mr-2">{["A", "B", "C", "D"][i]}.</span>
                      {choice}
                    </button>
                  ))}
                  {choiceSelected !== null && step.choiceExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 leading-relaxed"
                    >
                      <strong>解説: </strong>{step.choiceExplanation}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Troubleshoot step */}
              {step.type === "troubleshoot" && (
                <TroubleshootStep
                  step={step as TroubleshootStepData}
                  certColor={certColor}
                  onAdvance={advanceStep}
                />
              )}

              {/* Code edit step */}
              {step.type === "code_edit" && (
                <CodeEditStep
                  step={step as CodeEditStepData}
                  certColor={certColor}
                  onAdvance={advanceStep}
                />
              )}

              {/* Next button — hidden for step types that manage their own advance */}
              {step.type !== "troubleshoot" && step.type !== "code_edit" && (
                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    disabled={!canAdvance()}
                    onClick={advanceStep}
                    style={canAdvance() ? { backgroundColor: certColor } : undefined}
                    className={canAdvance() ? "text-white" : ""}
                  >
                    {currentStep === lab.steps.length - 1 ? (
                      <><Award size={14} className="mr-1.5" /> ラボを完了</>
                    ) : (
                      <>次へ <ChevronRight size={14} className="ml-1" /></>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function CertDetailPage() {
  const { cert: certId } = useParams<{ cert: string }>()
  const cert = getCertById(certId)
  const questions = getQuestionsByCert(certId)
  const labs = getLabsByCert(certId)

  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [resourceFilter, setResourceFilter] = useState<string>("すべて")
  const [selectedLab, setSelectedLab] = useState<HandsOnLab | null>(null)
  const [selectedModule, setSelectedModule] = useState<StudyModule | null>(null)
  const [completedSectionIds, setCompletedSectionIds] = useState<string[]>([])
  const [selectedInfographic, setSelectedInfographic] = useState<Infographic | null>(null)

  const modules = getModulesByCert(certId as import("@/lib/types/quiz").CertificationId)
  const infographics = getInfographicsByCert(certId)

  if (!cert) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">資格情報が見つかりませんでした</p>
        <Link href="/learn"><Button variant="outline">学習センターへ戻る</Button></Link>
      </div>
    )
  }

  const easyCount = questions.filter((q) => q.difficulty === "easy").length
  const mediumCount = questions.filter((q) => q.difficulty === "medium").length
  const hardCount = questions.filter((q) => q.difficulty === "hard").length

  const resourceTypes = ["すべて", "course", "lab", "practice", "book", "doc"]

  const filteredResources = cert.officialResources?.filter(
    (r) => resourceFilter === "すべて" || r.type === resourceFilter
  ) ?? []

  function getTypeIcon(type: string) {
    switch (type) {
      case "course": return GraduationCap
      case "lab": return FlaskConical
      case "practice": return ClipboardCheck
      case "book": return BookOpen
      case "doc": return FileText
      case "video": return Play
      default: return FileText
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "course": return "コース"
      case "lab": return "ハンズオン"
      case "practice": return "問題集"
      case "book": return "書籍"
      case "doc": return "ドキュメント"
      case "video": return "動画"
      default: return type
    }
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "概要" },
    { key: "exam", label: "試験詳細" },
    { key: "plan", label: "学習プラン" },
    { key: "resources", label: "教材リソース" },
    { key: "labs", label: "ハンズオン演習" },
    { key: "modules", label: "学習モジュール" },
    { key: "security", label: "セキュリティ図解" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={15} />
        学習センターへ戻る
      </Link>

      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${cert.color} 0%, ${cert.color}cc 100%)` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white/20 text-white border-0">{cert.level}</Badge>
              <Badge className="bg-white/20 text-white border-0">{cert.shortName}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{cert.name}</h1>
            <p className="text-white/80 mt-2 max-w-xl">{cert.description}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
              <div className="flex items-center gap-1.5"><Clock size={14} />{cert.durationMinutes}分</div>
              <div className="flex items-center gap-1.5"><FileText size={14} />{cert.questionCount}問</div>
              <div className="flex items-center gap-1.5"><Award size={14} />合格ライン{cert.passingScore}%</div>
              {cert.estimatedStudyHours && (
                <div className="flex items-center gap-1.5"><BookOpen size={14} />約{cert.estimatedStudyHours}時間</div>
              )}
            </div>
            {cert.prerequisites && cert.prerequisites.length > 0 && (
              <p className="text-white/70 text-xs mt-2 flex items-center gap-1.5">
                <span>推奨前提資格:</span>
                {cert.prerequisites.map((p) => (
                  <span key={p} className="font-bold uppercase">{p}</span>
                ))}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Link href={`/learn/${certId}/quiz?mode=practice`}>
              <Button className="w-full bg-white text-gray-800 hover:bg-white/90" size="sm">
                <Play size={14} className="mr-1.5" />練習モード
              </Button>
            </Link>
            <Link href={`/learn/${certId}/quiz?mode=exam`}>
              <Button className="w-full bg-white/20 text-white hover:bg-white/30 border-white/30" variant="outline" size="sm">
                <Award size={14} className="mr-1.5" />模擬試験
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-0 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-current"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={
                activeTab === tab.key
                  ? { borderColor: cert.color, color: cert.color }
                  : undefined
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: 概要 */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Domains */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen size={15} style={{ color: cert.color }} />
                  試験ドメイン・出題割合
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cert.domains.map((domain) => (
                  <div key={domain.name} className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-foreground leading-tight">{domain.name}</span>
                      <span className="text-xs font-bold shrink-0" style={{ color: cert.color }}>{domain.percentage}%</span>
                    </div>
                    <Progress value={domain.percentage} className="h-2" />
                    <div className="flex flex-wrap gap-1">
                      {domain.topics.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study guide + Key services */}
            <div className="space-y-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle size={15} className="text-gcp-green" />
                    学習ガイド
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {cert.studyGuide.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                          style={{ backgroundColor: cert.color }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-foreground leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Key services - clickable links */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag size={15} className="text-gcp-blue" />
                    重要サービス
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cert.keyServices.map((svc) => {
                      const productId = serviceNameToProductId(svc)
                      const demoPath = productId ? PRODUCT_TO_DEMO[productId] : undefined
                      return productId ? (
                        <Link key={svc} href={`/products/${productId}`}>
                          <Badge
                            className="text-xs border-0 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: `${cert.color}18`, color: cert.color }}
                          >
                            {svc}
                            {demoPath && <Play size={9} className="ml-1" />}
                          </Badge>
                        </Link>
                      ) : (
                        <Badge
                          key={svc}
                          className="text-xs border-0"
                          style={{ backgroundColor: `${cert.color}18`, color: cert.color }}
                        >
                          {svc}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Related demos & architectures for this cert */}
              {(() => {
                const demoIds = getDemosForCert(cert.id)
                const archIds = Array.from(new Set(
                  DEMO_CONTEXTS.filter((d) => d.certIds.includes(cert.id)).flatMap((d) => d.archIds)
                ))
                return (demoIds.length > 0 || archIds.length > 0) ? (
                  <Card className="border-border border-l-4" style={{ borderLeftColor: cert.color }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">ハンズオンで体験する</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {demoIds.length > 0 && <RelatedDemos demoIds={demoIds} title="関連デモ" />}
                      {archIds.length > 0 && <RelatedArchitectures archIds={archIds} title="出題されるアーキテクチャパターン" />}
                    </CardContent>
                  </Card>
                ) : null
              })()}
            </div>
          </div>

          {/* Exam Tips */}
          {cert.examTips && cert.examTips.length > 0 && (
            <Card className="border-border border-l-4" style={{ borderLeftColor: cert.color }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb size={15} style={{ color: cert.color }} />
                  試験対策のポイント
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {cert.examTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-gcp-yellow mt-0.5 shrink-0">▸</span>
                      <span className="text-foreground leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Question preview */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-sm">練習問題 ({questions.length}問)</CardTitle>
                  <div className="flex items-center gap-1.5">
                    <Badge className="text-xs border-0 bg-[#e6f4ea] text-gcp-green">易{easyCount}</Badge>
                    <Badge className="text-xs border-0 bg-[#fef7e0] text-[#FBBC05]">中{mediumCount}</Badge>
                    <Badge className="text-xs border-0 bg-[#fce8e6] text-gcp-red">難{hardCount}</Badge>
                  </div>
                </div>
                <Link href={`/learn/${certId}/quiz?mode=practice`}>
                  <Button size="sm" style={{ backgroundColor: cert.color }} className="text-white h-8 text-xs">
                    全問を解く <ArrowLeft size={12} className="ml-1 rotate-180" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {questions.slice(0, 3).map((q, i) => (
                  <div key={q.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: cert.color }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-relaxed">{q.question}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">{q.difficulty}</Badge>
                          <Badge variant="secondary" className="text-xs truncate max-w-[200px]">{q.domain}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: 試験詳細 */}
      {activeTab === "exam" && (
        <div className="space-y-6">
          {cert.examInfo ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left: 受験情報 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CreditCard size={15} />
                      受験情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    <div className="flex items-start justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">受験料</span>
                      <span className="text-sm font-semibold text-foreground">{cert.examInfo.cost}</span>
                    </div>
                    <div className="flex items-start justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">出題形式</span>
                      <span className="text-sm font-semibold text-foreground">{cert.examInfo.format}</span>
                    </div>
                    <div className="flex items-start justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">受験方法</span>
                      <span className="text-sm font-semibold text-foreground">{cert.examInfo.delivery}</span>
                    </div>
                    <div className="flex items-start justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">有効期限</span>
                      <span className="text-sm font-semibold text-foreground">{cert.examInfo.validity}</span>
                    </div>
                    <div className="flex items-start justify-between py-2">
                      <span className="text-sm text-muted-foreground">対応言語</span>
                      <span className="text-sm font-semibold text-foreground">{cert.examInfo.languages.join("・")}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: 再受験ポリシー */}
                <Card className="border-l-4" style={{ borderLeftColor: "#FBBC05" }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <RefreshCw size={15} className="text-gcp-yellow" />
                      再受験ポリシー
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground leading-relaxed">{cert.examInfo.retakePolicy}</p>
                  </CardContent>
                </Card>
              </div>

              {/* 試験当日の注意事項 */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-sm space-y-2">
                <p className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Info size={14} /> 試験当日の注意事項
                </p>
                <ul className="space-y-1 text-blue-600 dark:text-blue-400 text-sm ml-4 list-disc">
                  <li>政府発行のIDを2種類持参（または撮影）してください</li>
                  <li>オンライン受験の場合、静かな個室・ウェブカメラ・マイクが必要です</li>
                  <li>試験開始15分前までにチェックインしてください</li>
                  <li>メモ用紙・電子機器・ノートは使用不可です</li>
                  <li>{cert.examInfo.note}</li>
                </ul>
              </div>

              {/* 試験登録の流れ */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CalendarDays size={15} style={{ color: cert.color }} />
                    試験登録の流れ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {[
                      "Google Cloud Certification ページにアクセス",
                      "Google アカウントでログイン",
                      "希望の試験と日時・場所を選択",
                      "受験料を支払い予約完了",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                          style={{ backgroundColor: cert.color }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-foreground leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <CreditCard size={32} className="opacity-40" />
              <p className="text-sm">試験詳細情報は準備中です</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: 学習プラン */}
      {activeTab === "plan" && (
        <div className="space-y-5">
          {cert.weeklyStudyPlan && cert.weeklyStudyPlan.length > 0 ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border">
                <CalendarDays size={16} style={{ color: cert.color }} />
                <p className="text-sm font-medium text-foreground">
                  推定学習時間: 約{cert.estimatedStudyHours}時間 / {cert.weeklyStudyPlan.length}週間プラン
                </p>
              </div>

              <div className="space-y-3">
                {cert.weeklyStudyPlan.map((plan) => (
                  <div key={plan.week} className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                    {/* Week number circle */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm"
                      style={{ backgroundColor: cert.color }}
                    >
                      W{plan.week}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm text-foreground">{plan.theme}</h4>
                        <Badge variant="secondary" className="text-xs shrink-0">Week {plan.week}</Badge>
                      </div>
                      {/* Topics as chips */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {plan.topics.map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-0.5 bg-background border border-border rounded-full text-muted-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      {/* Goal */}
                      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <Target size={11} className="mt-0.5 shrink-0" style={{ color: cert.color }} />
                        <span><strong className="text-foreground">目標:</strong> {plan.goal}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <CalendarDays size={32} className="opacity-40" />
              <p className="text-sm">学習プランは準備中です</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: ハンズオン演習 */}
      {activeTab === "labs" && (
        <div className="space-y-5">
          {selectedLab ? (
            <LabRunner
              lab={selectedLab}
              certColor={cert.color}
              onBack={() => setSelectedLab(null)}
            />
          ) : labs.length > 0 ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border">
                <Zap size={16} style={{ color: cert.color }} />
                <p className="text-sm font-medium text-foreground">
                  {labs.length}個のハンズオンラボで実践スキルを習得
                </p>
              </div>
              <div className="space-y-3">
                {labs.map((lab) => (
                  <Card
                    key={lab.id}
                    className="border-border hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedLab(lab)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cert.color}18` }}
                        >
                          <Terminal size={22} style={{ color: cert.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge
                              className="text-xs border-0"
                              style={{ backgroundColor: `${cert.color}18`, color: cert.color }}
                            >
                              {lab.service}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-xs border-0 ${
                                lab.difficulty === "easy"
                                  ? "bg-green-100 text-green-700"
                                  : lab.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {lab.difficulty === "easy" ? "初級" : lab.difficulty === "medium" ? "中級" : "上級"}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-gcp-blue transition-colors flex items-center gap-2">
                            {lab.title}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{lab.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock size={11} />{lab.estimatedMinutes}分</span>
                            <span className="flex items-center gap-1"><ListChecks size={11} />{lab.steps.length}ステップ</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Terminal size={32} className="opacity-40" />
              <p className="text-sm">ハンズオンラボは準備中です</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: 教材リソース */}
      {activeTab === "resources" && (
        <div className="space-y-5">
          {cert.officialResources && cert.officialResources.length > 0 ? (
            <>
              {/* Type filter */}
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setResourceFilter(type)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors font-medium ${
                      resourceFilter === type
                        ? "border-transparent text-white"
                        : "border-border text-muted-foreground hover:text-foreground bg-transparent"
                    }`}
                    style={
                      resourceFilter === type
                        ? { backgroundColor: cert.color }
                        : undefined
                    }
                  >
                    {type === "すべて" ? "すべて" : getTypeLabel(type)}
                  </button>
                ))}
              </div>

              {/* Resources list */}
              <div className="space-y-3">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource, i) => {
                    const TypeIcon = getTypeIcon(resource.type)
                    return (
                      <Card key={i} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${cert.color}15` }}
                            >
                              <TypeIcon size={18} style={{ color: cert.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-foreground leading-tight">{resource.name}</h4>
                                <div className="flex gap-1 shrink-0">
                                  {resource.isFree ? (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0 text-xs">無料</Badge>
                                  ) : (
                                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-0 text-xs">有料</Badge>
                                  )}
                                  <Badge variant="secondary" className="text-xs">{getTypeLabel(resource.type)}</Badge>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {resource.provider}{resource.duration ? ` · ${resource.duration}` : ""}
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                    <Globe size={28} className="opacity-40" />
                    <p className="text-sm">該当するリソースがありません</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <BookOpen size={32} className="opacity-40" />
              <p className="text-sm">教材リソースは準備中です</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: 学習モジュール */}
      {activeTab === "modules" && (
        <div className="space-y-5">
          {selectedModule ? (
            <ModuleReader
              module={selectedModule}
              certColor={cert.color}
              completedSectionIds={completedSectionIds}
              onSectionComplete={(sectionId) => {
                setCompletedSectionIds((prev) =>
                  prev.includes(sectionId) ? prev : [...prev, sectionId]
                )
                useGameStore.getState().completeModuleSection(cert.id, sectionId)
              }}
              onClose={() => setSelectedModule(null)}
            />
          ) : modules.length > 0 ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border">
                <BookOpen size={16} style={{ color: cert.color }} />
                <p className="text-sm font-medium text-foreground">
                  {modules.length}つの学習モジュールで試験ドメインを体系的に習得
                </p>
              </div>
              <div className="space-y-3">
                {modules.map((mod) => {
                  const completedInModule = mod.sections.filter((s) =>
                    completedSectionIds.includes(s.id)
                  ).length
                  const totalSections = mod.sections.length
                  const pct = Math.round((completedInModule / totalSections) * 100)
                  return (
                    <Card
                      key={mod.id}
                      className="border-border hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => setSelectedModule(mod)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cert.color}18` }}
                          >
                            <BookOpen size={22} style={{ color: cert.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Badge
                                className="text-xs border-0"
                                style={{ backgroundColor: `${cert.color}18`, color: cert.color }}
                              >
                                {mod.domainName}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={`text-xs border-0 ${
                                  mod.difficulty === "beginner"
                                    ? "bg-green-100 text-green-700"
                                    : mod.difficulty === "intermediate"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {mod.difficulty === "beginner" ? "初級" : mod.difficulty === "intermediate" ? "中級" : "上級"}
                              </Badge>
                            </div>
                            <h4 className="font-bold text-sm text-foreground group-hover:text-gcp-blue transition-colors flex items-center gap-2">
                              {mod.title}
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mod.description}</p>
                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock size={11} />{mod.estimatedMinutes}分</span>
                              <span className="flex items-center gap-1"><ListChecks size={11} />{totalSections}セクション</span>
                            </div>
                            {completedInModule > 0 && (
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{completedInModule}/{totalSections} 完了</span>
                                  <span>{pct}%</span>
                                </div>
                                <Progress value={pct} className="h-1.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <BookOpen size={32} className="opacity-40" />
              <p className="text-sm">この資格の学習モジュールは準備中です</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: セキュリティ図解 */}
      {activeTab === "security" && (
        <div className="space-y-5">
          {selectedInfographic ? (
            <div className="space-y-3">
              <button
                onClick={() => setSelectedInfographic(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft size={15} /> 図解一覧に戻る
              </button>
              <InfographicViewer
                infographic={selectedInfographic}
                certColor={cert.color}
              />
            </div>
          ) : infographics.length > 0 ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border">
                <Zap size={16} style={{ color: cert.color }} />
                <p className="text-sm font-medium text-foreground">
                  {infographics.length}つのインタラクティブ図解でセキュリティ概念を視覚的に学習
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infographics.map((ig) => (
                  <Card
                    key={ig.id}
                    className="border-border hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedInfographic(ig)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cert.color}18` }}
                        >
                          <FileText size={18} style={{ color: cert.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-foreground group-hover:text-gcp-blue transition-colors flex items-center gap-2">
                            {ig.title}
                            <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ig.description}</p>
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {ig.simulationSteps && (
                              <Badge variant="secondary" className="text-xs">
                                シミュレーション {ig.simulationSteps.length}ステップ
                              </Badge>
                            )}
                            {ig.variants && (
                              <Badge variant="secondary" className="text-xs">
                                {ig.variants.length}モード切替
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <FileText size={32} className="opacity-40" />
              <p className="text-sm">この資格のセキュリティ図解は準備中です</p>
              <p className="text-xs">PCSE・PCA・PCNE・ACEのページでご覧いただけます</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
