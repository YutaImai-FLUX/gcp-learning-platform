"use client"

import type { ThemeConfig } from "@/lib/game/dungeon-themes"

interface DungeonPathLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  theme: ThemeConfig
  isCleared: boolean
  isActive: boolean
}

export function DungeonPathLine({ x1, y1, x2, y2, theme, isCleared, isActive }: DungeonPathLineProps) {
  // Compute bezier curve control points for smooth S-curve
  const midY = (y1 + y2) / 2
  const pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`

  const strokeColor = isCleared ? theme.accentColor : isActive ? theme.pathColor : theme.tileBorder
  const strokeW = isCleared ? 3 : isActive ? 2 : 1.5
  const opacity = isCleared ? 0.7 : isActive ? 0.5 : 0.2

  return (
    <g>
      {/* Glow behind cleared paths */}
      {isCleared && (
        <path
          d={pathD}
          stroke={theme.accentColor}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          opacity={0.1}
        />
      )}

      {/* Main path */}
      <path
        d={pathD}
        stroke={strokeColor}
        strokeWidth={strokeW}
        fill="none"
        strokeDasharray={isCleared ? undefined : isActive ? "8 5" : "4 6"}
        strokeLinecap="round"
        opacity={opacity}
      />

      {/* Animated dot on active/cleared paths */}
      {(isCleared || isActive) && (
        <circle r={isCleared ? 3 : 2} fill={strokeColor} opacity={0.8}>
          <animateMotion dur={isCleared ? "2.5s" : "3.5s"} repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </g>
  )
}
