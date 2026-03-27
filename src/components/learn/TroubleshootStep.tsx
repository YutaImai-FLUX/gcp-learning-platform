"use client"

import { useState } from "react"
import { Info, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export interface TroubleshootStepData {
  id: number
  type: "troubleshoot"
  title: string
  scenario: string
  errorLog: string
  choices: string[]
  correctChoice: number
  solution: string
  explanation: string
}

interface Props {
  step: TroubleshootStepData
  certColor: string
  onAdvance: () => void
}

export default function TroubleshootStep({ step, certColor, onAdvance }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const isCorrect = selected !== null && selected === step.correctChoice
  const isWrong = selected !== null && selected !== step.correctChoice

  return (
    <div className="space-y-4">
      {/* Scenario */}
      <div className="flex items-start gap-3 rounded-lg p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">シナリオ</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{step.scenario}</p>
        </div>
      </div>

      {/* Error log */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          エラーログ / 症状
        </p>
        <div className="terminal-bg rounded-lg p-3 max-h-48 overflow-y-auto">
          <pre className="font-mono text-xs text-red-400 leading-relaxed whitespace-pre-wrap">
            {step.errorLog}
          </pre>
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">原因を診断してください</p>
        {step.choices.map((choice, i) => {
          const isSelected = selected === i
          const isCorrectChoice = i === step.correctChoice
          let className =
            "w-full text-left text-sm px-3 py-2.5 rounded-lg border transition-all "

          if (selected === null) {
            className += "border-border hover:border-current hover:bg-muted"
          } else if (isSelected && isCorrect) {
            className += "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
          } else if (isSelected && isWrong) {
            className += "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
          } else if (!isSelected && isCorrectChoice && selected !== null) {
            className += "border-green-400 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
          } else {
            className += "border-border text-muted-foreground"
          }

          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => setSelected(i)}
              className={className}
            >
              <span className="font-medium mr-2">{["A", "B", "C", "D"][i]}.</span>
              {choice}
            </button>
          )
        })}
      </div>

      {/* Result */}
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {isCorrect ? (
            <div className="rounded-lg p-3.5 bg-green-50 dark:bg-green-950/20 border border-green-300 dark:border-green-800">
              <div className="flex items-start gap-2">
                <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400">正解！</p>
                  <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                    {step.solution}
                  </p>
                  {step.explanation && (
                    <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed mt-1">
                      <span className="font-semibold">修正方法: </span>
                      {step.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-800">
              <div className="flex items-start gap-2">
                <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-700 dark:text-red-400">不正解</p>
                  <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                    正しい答えは <strong>{["A", "B", "C", "D"][step.correctChoice]}</strong> です。
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed mt-1">
                    {step.solution}
                  </p>
                  {step.explanation && (
                    <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed mt-1">
                      <span className="font-semibold">修正方法: </span>
                      {step.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={onAdvance}
              style={{ backgroundColor: certColor }}
              className="text-white"
            >
              次へ <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
