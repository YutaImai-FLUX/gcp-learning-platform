"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/stores/useGameStore"
import { SKILL_TREE_NODES, SKILL_TREE_EDGES } from "@/lib/game/skill-tree-config"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { DUNGEON_MAPS } from "@/lib/game/dungeon-config"
import { Lock, CheckCircle } from "lucide-react"

/**
 * Horizontal (left-to-right) skill tree.
 * Original config: x = horizontal column, y = vertical level (top-to-bottom).
 * For LTR layout: col = y (becomes X), row = x (becomes Y).
 */
const CELL_W = 180
const CELL_H = 100
const NODE_W = 130
const NODE_H = 60

export function SkillTree() {
  const router = useRouter()
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const certProgress = useGameStore((s) => s.certProgress)

  const nodeStatuses = useMemo(() => {
    const statuses: Record<string, "locked" | "available" | "in_progress" | "complete"> = {}

    for (const node of SKILL_TREE_NODES) {
      if (node.id === "start") {
        statuses[node.id] = "complete"
        continue
      }

      if (node.certId) {
        const bossId = `${node.certId}-boss`
        if (dungeonProgress[bossId]?.cleared) {
          statuses[node.id] = "complete"
          continue
        }
        if (certProgress[node.certId] || dungeonProgress[`${node.certId}-start`]?.cleared) {
          statuses[node.id] = "in_progress"
          continue
        }
      }

      const allReqsMet = node.requires.every(
        (req) => statuses[req] === "complete" || statuses[req] === "in_progress"
      )
      statuses[node.id] = allReqsMet ? "available" : "locked"
    }

    return statuses
  }, [dungeonProgress, certProgress])

  const certProgressPct = useMemo(() => {
    const pcts: Record<string, number> = {}
    for (const node of SKILL_TREE_NODES) {
      if (!node.certId) continue
      const dungeon = DUNGEON_MAPS[node.certId]
      if (!dungeon) continue
      const cleared = dungeon.rooms.filter((r) => dungeonProgress[r.id]?.cleared).length
      pcts[node.certId] = Math.round((cleared / dungeon.rooms.length) * 100)
    }
    return pcts
  }, [dungeonProgress])

  // LTR layout: original y → X (column/level), original x → Y (row/spread)
  const maxCol = Math.max(...SKILL_TREE_NODES.map((n) => n.y)) + 1
  const maxRow = Math.max(...SKILL_TREE_NODES.map((n) => n.x)) + 1
  const svgW = maxCol * CELL_W + 40
  const svgH = maxRow * CELL_H + 40

  /** Convert node grid position to SVG center coordinates (LTR) */
  function nodeCenter(node: { x: number; y: number }) {
    return {
      cx: node.y * CELL_W + 20 + CELL_W / 2,  // y → horizontal
      cy: node.x * CELL_H + 20 + CELL_H / 2,  // x → vertical
    }
  }

  return (
    <div className="overflow-x-auto py-2 scrollbar-thin">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto">
        {/* Edges */}
        {SKILL_TREE_EDGES.map((edge) => {
          const from = SKILL_TREE_NODES.find((n) => n.id === edge.from)
          const to = SKILL_TREE_NODES.find((n) => n.id === edge.to)
          if (!from || !to) return null

          const fromStatus = nodeStatuses[from.id]
          const toStatus = nodeStatuses[to.id]
          const isActive = fromStatus === "complete" || toStatus === "in_progress" || toStatus === "complete"

          const { cx: x1, cy: y1 } = nodeCenter(from)
          const { cx: x2, cy: y2 } = nodeCenter(to)
          const midX = (x1 + x2) / 2

          return (
            <g key={`${edge.from}-${edge.to}`}>
              {isActive && (
                <path
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  stroke={(() => {
                    const cert = to.certId ? CERTIFICATIONS.find((c) => c.id === to.certId) : null
                    return cert?.color ?? "var(--primary)"
                  })()}
                  strokeWidth={8}
                  fill="none"
                  opacity={0.08}
                  strokeLinecap="round"
                />
              )}
              <path
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                stroke={isActive ? (() => {
                  const cert = to.certId ? CERTIFICATIONS.find((c) => c.id === to.certId) : null
                  return cert?.color ?? "var(--primary)"
                })() : "var(--border)"}
                strokeWidth={isActive ? 2.5 : 1.5}
                fill="none"
                strokeDasharray={isActive ? undefined : "4 3"}
                strokeLinecap="round"
                opacity={isActive ? 0.7 : 0.3}
              />
            </g>
          )
        })}

        {/* Nodes */}
        {SKILL_TREE_NODES.map((node) => {
          const { cx, cy } = nodeCenter(node)
          const status = nodeStatuses[node.id]
          const cert = node.certId ? CERTIFICATIONS.find((c) => c.id === node.certId) : null
          const pct = node.certId ? (certProgressPct[node.certId] ?? 0) : 0
          const nodeColor = cert?.color ?? "var(--primary)"
          const isStart = node.id === "start"

          let fill = "var(--muted)"
          let stroke = "var(--border)"
          let textFill = "var(--muted-foreground)"
          let opacity = 0.4

          if (status === "complete") {
            fill = nodeColor
            stroke = nodeColor
            textFill = "#fff"
            opacity = 1
          } else if (status === "in_progress") {
            fill = "var(--background)"
            stroke = nodeColor
            textFill = nodeColor
            opacity = 1
          } else if (status === "available") {
            fill = "var(--background)"
            stroke = "var(--border)"
            textFill = "var(--foreground)"
            opacity = 0.85
          }

          const rx = cx - NODE_W / 2
          const ry = cy - NODE_H / 2

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity }}
              transition={{ delay: node.y * 0.1 + node.x * 0.02 }}
              style={{ cursor: status !== "locked" && node.certId ? "pointer" : "default" }}
            >
              <g
                onClick={node.certId && status !== "locked" ? () => router.push(`/dungeon/${node.certId}`) : undefined}
                role={node.certId && status !== "locked" ? "button" : undefined}
              >
                {/* Outer glow for in_progress */}
                {status === "in_progress" && (
                  <motion.rect
                    x={rx - 3}
                    y={ry - 3}
                    width={NODE_W + 6}
                    height={NODE_H + 6}
                    rx={16}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth={1.5}
                    opacity={0.3}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}

                {/* Node body */}
                <rect
                  x={rx}
                  y={ry}
                  width={NODE_W}
                  height={NODE_H}
                  rx={isStart ? NODE_H / 2 : 14}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={status === "in_progress" ? 2.5 : 2}
                />

                {/* Progress bar (in_progress) */}
                {status === "in_progress" && pct > 0 && (
                  <>
                    <rect
                      x={rx + 10}
                      y={ry + NODE_H - 14}
                      width={NODE_W - 20}
                      height={5}
                      rx={2.5}
                      fill={nodeColor + "30"}
                    />
                    <rect
                      x={rx + 10}
                      y={ry + NODE_H - 14}
                      width={Math.max(5, (NODE_W - 20) * (pct / 100))}
                      height={5}
                      rx={2.5}
                      fill={nodeColor}
                    />
                  </>
                )}

                {/* Cert abbreviation */}
                <text
                  x={cx}
                  y={cy - (status === "in_progress" && pct > 0 ? 5 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isStart ? 12 : 15}
                  fontWeight={800}
                  fill={textFill}
                  letterSpacing={1}
                >
                  {node.label}
                </text>

                {/* Status icons */}
                {status === "complete" && (
                  <foreignObject x={rx + NODE_W - 18} y={ry - 5} width={20} height={20}>
                    <CheckCircle size={18} color="#fff" />
                  </foreignObject>
                )}
                {status === "locked" && (
                  <foreignObject x={cx - 8} y={ry + NODE_H - 18} width={16} height={16}>
                    <Lock size={14} color="#888" />
                  </foreignObject>
                )}
              </g>

              {/* Label below node */}
              <text
                x={cx}
                y={cy + NODE_H / 2 + 15}
                textAnchor="middle"
                fontSize={10}
                fill="var(--muted-foreground)"
                opacity={status === "locked" ? 0.3 : 0.8}
                fontWeight={500}
              >
                {node.labelJa.length > 22 ? node.labelJa.slice(0, 21) + "…" : node.labelJa}
              </text>

              {/* Level label */}
              {cert && (
                <text
                  x={cx}
                  y={cy + NODE_H / 2 + 28}
                  textAnchor="middle"
                  fontSize={8}
                  fill="var(--muted-foreground)"
                  opacity={0.5}
                >
                  {cert.level}
                </text>
              )}
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
