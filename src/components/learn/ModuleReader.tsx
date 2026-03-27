"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Info,
  AlertTriangle,
  Lightbulb,
  XCircle,
  Code,
  RotateCcw,
} from "lucide-react"
import {
  type StudyModule,
  type ContentBlock,
  type DecisionTreeNode,
} from "@/lib/types/study-module"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Props {
  module: StudyModule
  certColor: string
  completedSectionIds: string[]
  onSectionComplete: (sectionId: string) => void
  onClose: () => void
}

function renderContentBlock(
  block: ContentBlock,
  certColor: string,
  treeNodeId: string,
  treeHistory: string[],
  onTreeNavigate: (nodeId: string) => void,
  onTreeBack: () => void,
  blockIdx: number
) {
  switch (block.type) {
    case "text":
      return (
        <div
          key={blockIdx}
          className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap leading-relaxed"
        >
          {block.markdown}
        </div>
      )

    case "concept_card": {
      return (
        <Card key={blockIdx} className="overflow-hidden border-border">
          <CardHeader className="py-3 px-4" style={{ backgroundColor: certColor }}>
            <CardTitle className="text-white text-base font-bold">{block.term}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm leading-relaxed">{block.definition}</p>
            {block.useCases.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  ユースケース
                </p>
                <ul className="space-y-1">
                  {block.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: certColor }} />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {block.characteristics.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  特徴
                </p>
                <ul className="space-y-1">
                  {block.characteristics.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {block.examRelevance && (
              <div className="rounded-lg p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                  試験での出題傾向
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
                  {block.examRelevance}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )
    }

    case "comparison_table": {
      return (
        <div key={blockIdx} className="space-y-2">
          {block.title && (
            <p className="text-sm font-semibold">{block.title}</p>
          )}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: certColor }}>
                  {block.headers.map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-3 py-2 text-white font-semibold text-xs whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={`border-t border-border ${row.highlight ? "bg-muted/50" : ""}`}
                  >
                    <td className="px-3 py-2 font-medium text-xs sticky left-0 bg-background z-10 whitespace-nowrap border-r border-border">
                      {row.label}
                    </td>
                    {row.values.map((v, vi) => (
                      <td key={vi} className="px-3 py-2 text-xs text-muted-foreground">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.footnote && (
            <p className="text-xs text-muted-foreground">{block.footnote}</p>
          )}
        </div>
      )
    }

    case "decision_tree": {
      const nodeMap = new Map<string, DecisionTreeNode>(
        block.nodes.map((n) => [n.id, n])
      )
      const currentNode = nodeMap.get(treeNodeId) ?? nodeMap.get(block.rootId)!
      const isRoot = treeNodeId === block.rootId || treeHistory.length === 0
      const isLeaf = !currentNode.question

      return (
        <div key={blockIdx} className="space-y-3">
          {block.title && (
            <p className="text-sm font-semibold">{block.title}</p>
          )}
          <div className="rounded-lg border border-border p-4 space-y-3">
            {/* History breadcrumb */}
            {treeHistory.length > 0 && (
              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                {treeHistory.map((hId, hi) => {
                  const hNode = nodeMap.get(hId)
                  return hNode ? (
                    <span key={hi} className="flex items-center gap-1">
                      <span className="truncate max-w-[120px]">{hNode.question ?? hNode.answer}</span>
                      {hi < treeHistory.length - 1 && <ChevronRight size={10} />}
                    </span>
                  ) : null
                })}
              </div>
            )}

            {/* Current node */}
            <div
              className="rounded-lg p-3 text-center text-sm font-medium border-2"
              style={{ borderColor: certColor, backgroundColor: `${certColor}10` }}
            >
              {isLeaf ? (
                <div className="space-y-2">
                  <Badge style={{ backgroundColor: certColor }} className="text-white text-xs">
                    推奨
                  </Badge>
                  <p className="font-bold">{currentNode.answer}</p>
                  {currentNode.explanation && (
                    <p className="text-xs text-muted-foreground font-normal leading-relaxed">
                      {currentNode.explanation}
                    </p>
                  )}
                </div>
              ) : (
                <p>{currentNode.question}</p>
              )}
            </div>

            {/* Yes/No buttons */}
            {!isLeaf && (
              <div className="flex gap-2">
                {currentNode.yesId && (
                  <Button
                    size="sm"
                    className="flex-1 text-white"
                    style={{ backgroundColor: "#34A853" }}
                    onClick={() => onTreeNavigate(currentNode.yesId!)}
                  >
                    はい
                  </Button>
                )}
                {currentNode.noId && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onTreeNavigate(currentNode.noId!)}
                  >
                    いいえ
                  </Button>
                )}
              </div>
            )}

            {/* Back / Reset */}
            <div className="flex gap-2">
              {!isRoot && (
                <button
                  onClick={onTreeBack}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft size={12} /> 戻る
                </button>
              )}
              {!isRoot && (
                <button
                  onClick={() => onTreeNavigate(block.rootId)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-auto"
                >
                  <RotateCcw size={11} /> 最初から
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    case "key_point": {
      const levelStyles: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
        info: {
          bg: "bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-400",
          text: "text-blue-700 dark:text-blue-300",
          icon: <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />,
        },
        warning: {
          bg: "bg-yellow-50 dark:bg-yellow-950/20",
          border: "border-yellow-400",
          text: "text-yellow-700 dark:text-yellow-300",
          icon: <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />,
        },
        exam_tip: {
          bg: "bg-green-50 dark:bg-green-950/20",
          border: "border-green-500",
          text: "text-green-700 dark:text-green-300",
          icon: <Lightbulb size={14} className="text-green-500 shrink-0 mt-0.5" />,
        },
        common_mistake: {
          bg: "bg-red-50 dark:bg-red-950/20",
          border: "border-red-400",
          text: "text-red-700 dark:text-red-300",
          icon: <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />,
        },
      }
      const style = levelStyles[block.level] ?? levelStyles.info
      return (
        <div
          key={blockIdx}
          className={`rounded-lg p-3.5 border-l-4 ${style.bg} ${style.border}`}
        >
          <div className="flex items-start gap-2">
            {style.icon}
            <div className={`space-y-0.5 ${style.text}`}>
              <p className="text-xs font-bold">{block.title}</p>
              <p className="text-xs leading-relaxed">{block.content}</p>
            </div>
          </div>
        </div>
      )
    }

    case "code_example": {
      return (
        <div key={blockIdx} className="space-y-1.5">
          {(block.title || block.language) && (
            <div className="flex items-center gap-2">
              <Code size={13} className="text-muted-foreground" />
              {block.title && <span className="text-xs font-medium">{block.title}</span>}
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {block.language}
              </Badge>
            </div>
          )}
          <div className="terminal-bg rounded-lg p-3 overflow-x-auto">
            <pre className="font-mono text-xs text-green-400 leading-relaxed whitespace-pre">
              {block.code}
            </pre>
          </div>
          {block.explanation && (
            <p className="text-xs text-muted-foreground leading-relaxed">{block.explanation}</p>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

export default function ModuleReader({
  module,
  certColor,
  completedSectionIds,
  onSectionComplete,
  onClose,
}: Props) {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [treeNodeId, setTreeNodeId] = useState<string>("")
  const [treeHistory, setTreeHistory] = useState<string[]>([])

  const activeSection = module.sections[activeSectionIdx]
  const completedCount = completedSectionIds.length
  const totalSections = module.sections.length
  const progressPct = Math.round((completedCount / totalSections) * 100)
  const isLastSection = activeSectionIdx === totalSections - 1
  const isSectionDone = completedSectionIds.includes(activeSection.id)

  function handleTreeNavigate(nodeId: string) {
    setTreeHistory((prev) => [...prev, treeNodeId || ""])
    setTreeNodeId(nodeId)
  }

  function handleTreeBack() {
    setTreeHistory((prev) => {
      const next = [...prev]
      const prevId = next.pop() ?? ""
      setTreeNodeId(prevId)
      return next
    })
  }

  function goToSection(idx: number) {
    setActiveSectionIdx(idx)
    setTreeNodeId("")
    setTreeHistory([])
  }

  function handleNextSection() {
    if (!isSectionDone) {
      onSectionComplete(activeSection.id)
    }
    if (!isLastSection) {
      goToSection(activeSectionIdx + 1)
    }
  }

  // Get tree root for current section (first decision_tree block)
  const treeBlock = activeSection.blocks.find((b) => b.type === "decision_tree")
  const effectiveTreeNodeId =
    treeNodeId ||
    (treeBlock && treeBlock.type === "decision_tree" ? treeBlock.rootId : "")

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={15} /> モジュール一覧
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{module.title}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1 mb-4 shrink-0">
        <Progress
          value={progressPct}
          className="h-1.5"
          style={{ "--progress-color": certColor } as React.CSSProperties}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{completedCount} / {totalSections} セクション完了</span>
          <span>{progressPct}%</span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 space-y-1 overflow-y-auto">
          {module.sections.map((sec, idx) => {
            const done = completedSectionIds.includes(sec.id)
            const active = idx === activeSectionIdx
            return (
              <button
                key={sec.id}
                onClick={() => goToSection(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-start gap-2 ${
                  active
                    ? "font-semibold text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                style={active ? { backgroundColor: certColor } : undefined}
              >
                <span className="shrink-0 mt-0.5">
                  {done ? (
                    <CheckCircle size={12} className={active ? "text-white" : "text-green-500"} />
                  ) : (
                    <span
                      className="inline-block w-3 h-3 rounded-full border"
                      style={active ? { borderColor: "white" } : undefined}
                    />
                  )}
                </span>
                <span className="leading-snug">{sec.title}</span>
              </button>
            )
          })}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pb-4"
            >
              {/* Section header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">{activeSection.title}</h3>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {activeSectionIdx + 1} / {totalSections}
                </Badge>
              </div>

              {/* Content blocks */}
              {activeSection.blocks.map((block, bi) =>
                renderContentBlock(
                  block,
                  certColor,
                  block.type === "decision_tree" ? effectiveTreeNodeId : "",
                  block.type === "decision_tree" ? treeHistory : [],
                  handleTreeNavigate,
                  handleTreeBack,
                  bi
                )
              )}

              {/* Next section button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={activeSectionIdx === 0}
                  onClick={() => goToSection(activeSectionIdx - 1)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={14} /> 前へ
                </button>
                <Button
                  size="sm"
                  onClick={handleNextSection}
                  style={{ backgroundColor: certColor }}
                  className="text-white"
                >
                  {isLastSection ? (
                    <>
                      <CheckCircle size={14} className="mr-1.5" /> 完了
                    </>
                  ) : (
                    <>
                      次のセクションへ <ChevronRight size={14} className="ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
