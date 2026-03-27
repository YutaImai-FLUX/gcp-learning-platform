import type { CertificationId } from "./quiz"

export type InfographicType = "hierarchy" | "flow" | "matrix" | "layers" | "perimeter"

export interface InfographicNode {
  id: string
  label: string
  sublabel?: string
  x: number
  y: number
  width: number
  height: number
  shape: "rect" | "rounded_rect" | "circle" | "diamond" | "hexagon"
  fill: string
  stroke?: string
  textColor: string
  clickable: boolean
  detailTitle?: string
  detailContent?: string  // plain text or simple markdown
  relatedServices?: string[]
}

export interface InfographicEdge {
  id: string
  from: string
  to: string
  label?: string
  style: "solid" | "dashed" | "arrow" | "double_arrow"
  animated?: boolean
  color?: string
  labelX?: number
  labelY?: number
}

export interface SimulationStep {
  id: string
  label: string
  description: string
  highlightedNodeIds: string[]
  highlightedEdgeIds: string[]
  blockedNodeIds?: string[]
}

export interface InfographicVariant {
  id: string
  label: string
  description: string
  overrideNodeFills?: Record<string, string>  // nodeId -> fill color override
  highlightedNodeIds?: string[]
  dimmedNodeIds?: string[]
}

export interface Infographic {
  id: string
  title: string
  description: string
  type: InfographicType
  targetCertIds: CertificationId[]
  svgWidth: number
  svgHeight: number
  nodes: InfographicNode[]
  edges: InfographicEdge[]
  variants?: InfographicVariant[]
  simulationSteps?: SimulationStep[]
  relatedModuleIds?: string[]
}
