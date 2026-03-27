"use client"

import { memo } from "react"
import type { NodeProps } from "@xyflow/react"

export type LayerNodeData = {
  label: string
  color: string
}

function LayerNodeComponent({ data, width, height }: NodeProps) {
  const { label, color } = data as unknown as LayerNodeData
  const w = (width ?? 200) as number
  const h = (height ?? 100) as number

  return (
    <div
      className="rounded-2xl border-2 border-dashed relative"
      style={{
        width: w,
        height: h,
        borderColor: `${color}40`,
        backgroundColor: `${color}06`,
      }}
    >
      {/* Layer label */}
      <div
        className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
        style={{
          backgroundColor: `${color}15`,
          color: color,
          border: `1px solid ${color}30`,
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default memo(LayerNodeComponent)
