"use client"

import { memo } from "react"
import { getBezierPath } from "@xyflow/react"
import type { EdgeProps } from "@xyflow/react"

interface DungeonEdgeData {
  isCleared: boolean
  isActive: boolean
  accentColor: string
}

/** Bezier edge for vertical winding path with status-based styling */
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

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.4,
  })

  const strokeColor = isCleared ? accentColor : isActive ? accentColor + "60" : "var(--border)"
  const strokeWidth = isCleared ? 2.5 : isActive ? 2 : 1.5
  const opacity = isCleared ? 0.7 : isActive ? 0.5 : 0.2

  return (
    <g>
      {/* Glow layer for cleared paths */}
      {isCleared && (
        <path
          d={edgePath}
          stroke={accentColor}
          strokeWidth={8}
          fill="none"
          opacity={0.08}
          strokeLinecap="round"
        />
      )}

      {/* Main path */}
      <path
        id={id}
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
        strokeDasharray={isCleared ? undefined : isActive ? "8 4" : "3 6"}
        strokeLinecap="round"
      />

      {/* Animated dot on active edges */}
      {isActive && !isCleared && (
        <circle r={2.5} fill={accentColor} opacity={0.6}>
          <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {/* Subtle particle on cleared edges */}
      {isCleared && (
        <circle r={1.5} fill={accentColor} opacity={0.4}>
          <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </g>
  )
})
