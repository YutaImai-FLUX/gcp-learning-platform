"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/stores/useGameStore"
import { SKILL_TREE_NODES, SKILL_TREE_EDGES } from "@/lib/game/skill-tree-config"
import { CERTIFICATIONS } from "@/lib/data/certifications"

const CELL_W = 100
const CELL_H = 80
const NODE_R = 24

export function SkillTree() {
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const certProgress = useGameStore((s) => s.certProgress)

  const nodeStatuses = useMemo(() => {
    const statuses: Record<string, "locked" | "available" | "in_progress" | "complete"> = {}

    for (const node of SKILL_TREE_NODES) {
      if (node.id === "start") {
        statuses[node.id] = "complete"
        continue
      }

      // Check if boss room cleared for this cert
      if (node.certId) {
        const bossId = `${node.certId}-boss`
        if (dungeonProgress[bossId]?.cleared) {
          statuses[node.id] = "complete"
          continue
        }
        // Check if any progress exists
        if (certProgress[node.certId] || dungeonProgress[`${node.certId}-start`]?.cleared) {
          statuses[node.id] = "in_progress"
          continue
        }
      }

      // Check requirements
      const allReqsMet = node.requires.every(
        (req) => statuses[req] === "complete" || statuses[req] === "in_progress"
      )
      statuses[node.id] = allReqsMet ? "available" : "locked"
    }

    return statuses
  }, [dungeonProgress, certProgress])

  const maxX = Math.max(...SKILL_TREE_NODES.map((n) => n.x)) + 1
  const maxY = Math.max(...SKILL_TREE_NODES.map((n) => n.y)) + 1
  const svgW = maxX * CELL_W + 40
  const svgH = maxY * CELL_H + 40

  return (
    <div className="overflow-x-auto">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto">
        {/* Edges */}
        {SKILL_TREE_EDGES.map((edge) => {
          const from = SKILL_TREE_NODES.find((n) => n.id === edge.from)
          const to = SKILL_TREE_NODES.find((n) => n.id === edge.to)
          if (!from || !to) return null

          const fromStatus = nodeStatuses[from.id]
          const toStatus = nodeStatuses[to.id]
          const isActive = fromStatus === "complete" || toStatus === "in_progress" || toStatus === "complete"

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x * CELL_W + 20 + CELL_W / 2}
              y1={from.y * CELL_H + 20 + CELL_H / 2}
              x2={to.x * CELL_W + 20 + CELL_W / 2}
              y2={to.y * CELL_H + 20 + CELL_H / 2}
              stroke={isActive ? "var(--primary)" : "var(--border)"}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeDasharray={isActive ? undefined : "4 3"}
            />
          )
        })}

        {/* Nodes */}
        {SKILL_TREE_NODES.map((node) => {
          const cx = node.x * CELL_W + 20 + CELL_W / 2
          const cy = node.y * CELL_H + 20 + CELL_H / 2
          const status = nodeStatuses[node.id]
          const cert = node.certId ? CERTIFICATIONS.find((c) => c.id === node.certId) : null

          let fill = "var(--muted)"
          let stroke = "var(--border)"
          let textFill = "var(--muted-foreground)"

          if (status === "complete") {
            fill = cert?.color ?? "var(--primary)"
            stroke = cert?.color ?? "var(--primary)"
            textFill = "#fff"
          } else if (status === "in_progress") {
            fill = "transparent"
            stroke = cert?.color ?? "var(--primary)"
            textFill = cert?.color ?? "var(--primary)"
          } else if (status === "available") {
            fill = "var(--background)"
            stroke = cert?.color ?? "var(--border)"
            textFill = "var(--foreground)"
          }

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: node.y * 0.1 }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={NODE_R}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                opacity={status === "locked" ? 0.4 : 1}
              />
              <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={node.type === "category" ? 9 : 11}
                fontWeight={700}
                fill={textFill}
                opacity={status === "locked" ? 0.4 : 1}
              >
                {node.label}
              </text>
              {/* Label below */}
              <text
                x={cx}
                y={cy + NODE_R + 12}
                textAnchor="middle"
                fontSize={8}
                fill="var(--muted-foreground)"
                opacity={status === "locked" ? 0.3 : 0.7}
              >
                {node.labelJa.length > 10 ? node.labelJa.slice(0, 9) + "…" : node.labelJa}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
