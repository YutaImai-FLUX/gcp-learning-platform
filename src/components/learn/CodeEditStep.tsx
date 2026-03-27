"use client"

import { useState } from "react"
import { CheckCircle, XCircle, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CodeBlank {
  id: string
  placeholder: string
  correctValue: string
  hint?: string
}

export interface CodeEditStepData {
  id: number
  type: "code_edit"
  title: string
  content: string
  commandTemplate: string
  blanks: CodeBlank[]
  explanation: string
}

interface Props {
  step: CodeEditStepData
  certColor: string
  onAdvance: () => void
}

function parseTemplate(
  template: string
): Array<{ type: "text"; value: string } | { type: "blank"; id: string }> {
  const parts: Array<{ type: "text"; value: string } | { type: "blank"; id: string }> = []
  const regex = /___([^_]+)___/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: template.slice(lastIndex, match.index) })
    }
    parts.push({ type: "blank", id: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < template.length) {
    parts.push({ type: "text", value: template.slice(lastIndex) })
  }

  return parts
}

export default function CodeEditStep({ step, certColor, onAdvance }: Props) {
  const blankMap = new Map(step.blanks.map((b) => [b.id, b]))
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(step.blanks.map((b) => [b.id, ""]))
  )
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [hintShown, setHintShown] = useState<string | null>(null)
  const parts = parseTemplate(step.commandTemplate)

  const allCorrect = checked && step.blanks.every((b) => results[b.id] === true)

  function handleCheck() {
    const newResults: Record<string, boolean> = {}
    for (const blank of step.blanks) {
      newResults[blank.id] =
        (values[blank.id] ?? "").trim().toLowerCase() ===
        blank.correctValue.trim().toLowerCase()
    }
    setResults(newResults)
    setChecked(true)
  }

  function handleRetry() {
    setChecked(false)
    setResults({})
  }

  return (
    <div className="space-y-4">
      {/* Content */}
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{step.content}</p>

      {/* Command display */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          コマンドを完成させてください
        </p>
        <div className="terminal-bg rounded-lg p-3 overflow-x-auto">
          <div className="font-mono text-xs text-green-400 leading-relaxed flex flex-wrap items-center gap-y-1">
            <span className="text-green-600 mr-2">$</span>
            {parts.map((part, pi) => {
              if (part.type === "text") {
                return (
                  <span key={pi} className="whitespace-pre">
                    {part.value}
                  </span>
                )
              }

              const blank = blankMap.get(part.id)
              if (!blank) return null

              const isChecked = checked
              const isCorrect = results[part.id] === true
              const isWrong = checked && results[part.id] === false
              const showHint = hintShown === part.id

              let borderStyle = `1px solid ${certColor}60`
              if (isChecked && isCorrect) borderStyle = "1px solid #34A853"
              if (isWrong) borderStyle = "1px solid #EA4335"

              const inputWidth = Math.max(blank.placeholder.length, (values[part.id] || "").length, 4)

              return (
                <span key={pi} className="relative inline-flex items-center gap-1">
                  <span className="relative inline-flex items-center">
                    <input
                      type="text"
                      value={values[part.id] ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [part.id]: e.target.value }))
                      }
                      placeholder={blank.placeholder}
                      disabled={isChecked && isCorrect}
                      className="font-mono text-xs bg-transparent text-yellow-300 placeholder-green-700 focus:outline-none px-1 py-0.5 rounded"
                      style={{
                        border: borderStyle,
                        width: `${inputWidth + 2}ch`,
                        minWidth: "4ch",
                      }}
                    />
                    {isChecked && isCorrect && (
                      <CheckCircle
                        size={11}
                        className="text-green-500 absolute -right-4"
                      />
                    )}
                    {isWrong && (
                      <XCircle
                        size={11}
                        className="text-red-500 absolute -right-4"
                      />
                    )}
                  </span>
                  {blank.hint && (
                    <button
                      type="button"
                      onMouseEnter={() => setHintShown(part.id)}
                      onMouseLeave={() => setHintShown(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <HelpCircle size={11} />
                    </button>
                  )}
                  {showHint && blank.hint && (
                    <span className="absolute bottom-full left-0 mb-1 z-20 bg-popover border border-border rounded px-2 py-1 text-xs text-popover-foreground whitespace-nowrap shadow-md">
                      {blank.hint}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Wrong answers revealed */}
      {checked && !allCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1.5"
        >
          {step.blanks
            .filter((b) => results[b.id] === false)
            .map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 text-xs rounded px-2.5 py-1.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              >
                <XCircle size={11} className="shrink-0" />
                <span>
                  <code className="font-mono">{b.id}</code> の正解:{" "}
                  <code className="font-mono font-bold">{b.correctValue}</code>
                </span>
              </div>
            ))}
        </motion.div>
      )}

      {/* Success message */}
      {allCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3.5 bg-green-50 dark:bg-green-950/20 border border-green-300 dark:border-green-800"
        >
          <div className="flex items-start gap-2">
            <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-green-700 dark:text-green-400">
                すべて正解！
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                {step.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-1">
        {!checked ? (
          <Button
            size="sm"
            onClick={handleCheck}
            disabled={step.blanks.some((b) => !(values[b.id] ?? "").trim())}
            style={{ backgroundColor: certColor }}
            className="text-white"
          >
            検証する
          </Button>
        ) : allCorrect ? (
          <Button
            size="sm"
            onClick={onAdvance}
            style={{ backgroundColor: certColor }}
            className="text-white"
          >
            次へ <ChevronRight size={14} className="ml-1" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRetry}>
              やり直す
            </Button>
            <Button
              size="sm"
              onClick={handleCheck}
              disabled={step.blanks.some((b) => !(values[b.id] ?? "").trim())}
              style={{ backgroundColor: certColor }}
              className="text-white"
            >
              再検証
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
