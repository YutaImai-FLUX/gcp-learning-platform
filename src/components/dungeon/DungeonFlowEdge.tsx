"use client"

import { memo } from "react"
import { getSmoothStepPath } from "@xyflow/react"
import type { EdgeProps } from "@xyflow/react"

interface DungeonEdgeData {
  isCleared: boolean
  isActive: boolean
  accentColor: string
}

/** Minimal smooth-step edge with status-based styling */
export const DungeonFlowEdge = memo(function DungeonFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps & { data?: DungeonEdgeData }) {
  const isCleared = data?.isCleared ?? false
  const isActive = data?.isActive ?? false
  const accentColor = data?.accentColor ?? "#888"

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  })

  const strokeColor = isCleared ? accentColor : isActive ? "var(--muted-foreground)" : "var(--border)"
  const strokeWidth = isCleared ? 2 : 1.5
  const opacity = isCleared ? 0.6 : isActive ? 0.4 : 0.15

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
        strokeDasharray={isCleared ? undefined : isActive ? "6 4" : "3 6"}
      />
      {/* Subtle animated dot on active edges */}
      {isActive && !isCleared && (
        <circle r={2} fill="var(--muted-foreground)" opacity={0.5}>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </g>
  )
})
