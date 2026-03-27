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
      className="rounded-2xl relative pointer-events-none"
      style={{
        width: w,
        height: h,
        border: `1.5px solid ${color}30`,
        backgroundColor: `${color}05`,
        boxShadow: `inset 0 0 0 1px ${color}08`,
      }}
    >
      {/* Layer label pill */}
      <div
        className="absolute -top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em] leading-none whitespace-nowrap"
        style={{
          backgroundColor: `${color}12`,
          color: color,
          border: `1px solid ${color}25`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </div>
    </div>
  )
}

export default memo(LayerNodeComponent)
