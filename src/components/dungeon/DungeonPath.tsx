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

/**
 * Minecraft redstone-style path:
 * - Stepped/angular path (no smooth curves)
 * - Cleared: bright redstone glow with particles
 * - Active: dim redstone, pulsing
 * - Locked: dark, barely visible
 */
export function DungeonPathLine({ x1, y1, x2, y2, theme, isCleared, isActive }: DungeonPathLineProps) {
  // Angular stepped path: go down half, move horizontal, then go down rest
  const midY = (y1 + y2) / 2
  const pathD = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`

  const strokeColor = isCleared ? theme.accentColor : isActive ? theme.pathColor : theme.tileBorder
  const strokeW = isCleared ? 4 : isActive ? 3 : 2
  const opacity = isCleared ? 0.8 : isActive ? 0.5 : 0.15

  // Pixel-art step size for the redstone dust dots
  const dotSize = isCleared ? 4 : 3

  return (
    <g>
      {/* Glow behind cleared paths (redstone glow) */}
      {isCleared && (
        <path
          d={pathD}
          stroke={theme.accentColor}
          strokeWidth={12}
          fill="none"
          strokeLinejoin="miter"
          opacity={0.12}
        />
      )}

      {/* Main path — sharp corners (miter join) for MC angular feel */}
      <path
        d={pathD}
        stroke={strokeColor}
        strokeWidth={strokeW}
        fill="none"
        strokeDasharray={isCleared ? undefined : isActive ? "8 6" : "4 8"}
        strokeLinejoin="miter"
        opacity={opacity}
      />

      {/* Animated redstone particle on active/cleared paths */}
      {(isCleared || isActive) && (
        <rect
          width={dotSize}
          height={dotSize}
          x={-dotSize / 2}
          y={-dotSize / 2}
          fill={isCleared ? theme.accentColor : strokeColor}
          opacity={0.9}
        >
          <animateMotion
            dur={isCleared ? "2s" : "3s"}
            repeatCount="indefinite"
            path={pathD}
          />
        </rect>
      )}

      {/* Extra particle for cleared paths */}
      {isCleared && (
        <rect
          width={3}
          height={3}
          x={-1.5}
          y={-1.5}
          fill="#fff"
          opacity={0.6}
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={pathD}
            begin="1s"
          />
        </rect>
      )}
    </g>
  )
}
