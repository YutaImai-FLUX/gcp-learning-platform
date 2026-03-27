"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, X, Play, StepForward, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type {
  Infographic,
  InfographicNode,
  InfographicEdge,
  SimulationStep,
  InfographicVariant,
} from "@/lib/types/infographic"

// ─── helpers ────────────────────────────────────────────────────────────────


function hexagonPoints(x: number, y: number, w: number, h: number): string {
  const cx = x + w / 2
  const cy = y + h / 2
  const rx = w / 2
  const ry = h / 2
  const pts = [
    [cx, cy - ry],
    [cx + rx, cy - ry / 2],
    [cx + rx, cy + ry / 2],
    [cx, cy + ry],
    [cx - rx, cy + ry / 2],
    [cx - rx, cy - ry / 2],
  ]
  return pts.map((p) => p.join(",")).join(" ")
}

function diamondPoints(x: number, y: number, w: number, h: number): string {
  const cx = x + w / 2
  const cy = y + h / 2
  return [
    [cx, y],
    [x + w, cy],
    [cx, y + h],
    [x, cy],
  ]
    .map((p) => p.join(","))
    .join(" ")
}


// Shorten path so arrowhead sits at edge of target node (approx)
function getEdgeEndpoints(
  from: InfographicNode,
  to: InfographicNode
): { x1: number; y1: number; x2: number; y2: number } {
  const x1 = from.x + from.width / 2
  const y1 = from.y + from.height / 2
  const rawX2 = to.x + to.width / 2
  const rawY2 = to.y + to.height / 2

  // Shorten the endpoint to the border of the target rect
  const dx = rawX2 - x1
  const dy = rawY2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const ux = dx / len
  const uy = dy / len

  // Approximate border offset: half-diagonal of target
  const offset = Math.min(to.width / 2, to.height / 2) + 2
  const x2 = rawX2 - ux * offset
  const y2 = rawY2 - uy * offset

  return { x1, y1, x2, y2 }
}

// ─── SVG node shapes ─────────────────────────────────────────────────────────

interface NodeShapeProps {
  node: InfographicNode
  opacity: number
  isSelected: boolean
  isHighlighted: boolean
  certColor: string
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function NodeShape({
  node,
  opacity,
  isSelected,
  isHighlighted,
  certColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: NodeShapeProps) {
  const { x, y, width: w, height: h, shape, fill, stroke, textColor, label, sublabel } = node
  const highlightStroke = isSelected ? certColor : isHighlighted ? certColor : stroke ?? "transparent"
  const strokeW = isSelected ? 3 : isHighlighted ? 2.5 : 1.5
  const cursor = node.clickable ? "pointer" : "default"

  const sharedProps = {
    fill,
    stroke: highlightStroke,
    strokeWidth: strokeW,
    opacity,
    style: { cursor, filter: isHighlighted ? "drop-shadow(0 0 6px rgba(0,0,0,0.25))" : undefined },
    onClick,
    onMouseEnter,
    onMouseLeave,
  }

  const lines = label.split("\n")
  const hasSubLabel = !!sublabel
  const labelY = hasSubLabel ? y + h / 2 - 7 : y + h / 2
  const subY = y + h / 2 + 10

  const textEl = (
    <>
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={labelY + i * 13}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={w > 130 ? 11 : 10}
          fontWeight={600}
          fill={textColor}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {line}
        </text>
      ))}
      {hasSubLabel && (
        <text
          x={x + w / 2}
          y={subY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={9}
          fontWeight={400}
          fill={textColor}
          opacity={0.8}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {sublabel}
        </text>
      )}
    </>
  )

  let shapeEl: React.ReactNode

  if (shape === "rect") {
    shapeEl = <rect x={x} y={y} width={w} height={h} {...sharedProps} />
  } else if (shape === "rounded_rect") {
    shapeEl = <rect x={x} y={y} width={w} height={h} rx={8} ry={8} {...sharedProps} />
  } else if (shape === "circle") {
    const r = Math.min(w, h) / 2
    shapeEl = <circle cx={x + w / 2} cy={y + h / 2} r={r} {...sharedProps} />
  } else if (shape === "diamond") {
    shapeEl = <polygon points={diamondPoints(x, y, w, h)} {...sharedProps} />
  } else if (shape === "hexagon") {
    shapeEl = <polygon points={hexagonPoints(x, y, w, h)} {...sharedProps} />
  } else {
    shapeEl = <rect x={x} y={y} width={w} height={h} rx={8} ry={8} {...sharedProps} />
  }

  // Selection ring
  const ring = isSelected ? (
    <rect
      x={x - 4}
      y={y - 4}
      width={w + 8}
      height={h + 8}
      rx={12}
      ry={12}
      fill="none"
      stroke={certColor}
      strokeWidth={2}
      strokeDasharray="4 3"
      opacity={0.7}
      style={{ pointerEvents: "none" }}
    />
  ) : null

  return (
    <g>
      {ring}
      {shapeEl}
      {textEl}
    </g>
  )
}

// ─── SVG edge ────────────────────────────────────────────────────────────────

interface EdgeRendererProps {
  edge: InfographicEdge
  fromNode: InfographicNode
  toNode: InfographicNode
  isHighlighted: boolean
  certColor: string
  markerId: string
  markerBlockedId: string
}

function EdgeRenderer({
  edge,
  fromNode,
  toNode,
  isHighlighted,
  certColor,
  markerId,
  markerBlockedId,
}: EdgeRendererProps) {
  const { x1, y1, x2, y2 } = getEdgeEndpoints(fromNode, toNode)
  const mx = (x1 + x2) / 2
  const pathD = `M ${x1} ${y1} Q ${mx} ${y1} ${x2} ${y2}`

  const isBlocked = edge.color === "#ea4335"
  const strokeColor = isHighlighted ? certColor : isBlocked ? "#ea4335" : (edge.color ?? "#94a3b8")
  const isDashed = edge.style === "dashed"
  const hasArrow = edge.style === "arrow" || edge.style === "double_arrow"
  const strokeW = isHighlighted ? 2.5 : 1.5

  const animClass =
    edge.animated && !isDashed ? "infographic-edge-animated" : undefined

  const mid = {
    x: mx,
    y: (y1 + y2) / 2 - 8,
  }

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeW}
        strokeDasharray={isDashed ? "6 4" : undefined}
        markerEnd={hasArrow ? `url(#${isBlocked ? markerBlockedId : markerId})` : undefined}
        opacity={isHighlighted ? 1 : 0.6}
        className={animClass}
      />
      {edge.label && (
        <text
          x={edge.labelX ?? mid.x}
          y={edge.labelY ?? mid.y}
          textAnchor="middle"
          fontSize={9}
          fill={strokeColor}
          opacity={0.9}
          style={{ userSelect: "none" }}
        >
          {edge.label}
        </text>
      )}
    </g>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  node: InfographicNode
  certColor: string
  onClose: () => void
}

function DetailPanel({ node, certColor, onClose }: DetailPanelProps) {
  const lines = (node.detailContent ?? "").split("\n")

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full"
    >
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-xl"
        style={{ backgroundColor: certColor + "18", borderBottom: `2px solid ${certColor}30` }}
      >
        <h3 className="font-semibold text-sm text-foreground leading-tight">{node.detailTitle ?? node.label}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
          aria-label="閉じる"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
        {lines.map((line, i) => {
          if (line === "") return <div key={i} className="h-1.5" />
          if (line.startsWith("- ") || line.startsWith("• ")) {
            return (
              <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                <span className="mt-0.5 shrink-0" style={{ color: certColor }}>▸</span>
                <span>{line.slice(2)}</span>
              </div>
            )
          }
          const isBold = line.endsWith(":") || /^[A-Z]/.test(line) && line.length < 60
          return (
            <p key={i} className={`text-xs leading-relaxed ${isBold ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              {line}
            </p>
          )
        })}
      </div>

      {node.relatedServices && node.relatedServices.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">関連サービス</p>
          <div className="flex flex-wrap gap-1.5">
            {node.relatedServices.map((svc) => (
              <span
                key={svc}
                className="px-2 py-0.5 text-xs rounded-full font-medium"
                style={{ backgroundColor: certColor + "15", color: certColor, border: `1px solid ${certColor}30` }}
              >
                {svc}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface InfographicViewerProps {
  infographic: Infographic
  certColor: string
}

export default function InfographicViewer({ infographic, certColor }: InfographicViewerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    infographic.variants?.[0]?.id ?? null
  )
  const [simStep, setSimStep] = useState<number>(-1)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const activeVariant: InfographicVariant | undefined =
    infographic.variants?.find((v) => v.id === selectedVariant)

  const activeSimStep: SimulationStep | undefined =
    simStep >= 0 ? infographic.simulationSteps?.[simStep] : undefined

  const selectedNode = selectedNodeId
    ? infographic.nodes.find((n) => n.id === selectedNodeId)
    : null

  // ── node state resolution ──
  const resolveNodeOpacity = useCallback(
    (nodeId: string): number => {
      if (activeSimStep) {
        if (activeSimStep.highlightedNodeIds.includes(nodeId)) return 1
        if (activeSimStep.blockedNodeIds?.includes(nodeId)) return 0.25
        return 0.3
      }
      if (activeVariant) {
        if (activeVariant.dimmedNodeIds?.includes(nodeId)) return 0.3
        if (activeVariant.highlightedNodeIds?.includes(nodeId)) return 1
      }
      return hoveredNodeId === nodeId ? 1 : 0.95
    },
    [activeSimStep, activeVariant, hoveredNodeId]
  )

  const resolveNodeFill = useCallback(
    (nodeId: string, defaultFill: string): string => {
      if (activeVariant?.overrideNodeFills?.[nodeId]) {
        return activeVariant.overrideNodeFills[nodeId]
      }
      return defaultFill
    },
    [activeVariant]
  )

  const isNodeHighlighted = useCallback(
    (nodeId: string): boolean => {
      if (activeSimStep) return activeSimStep.highlightedNodeIds.includes(nodeId)
      if (activeVariant?.highlightedNodeIds) return activeVariant.highlightedNodeIds.includes(nodeId)
      return false
    },
    [activeSimStep, activeVariant]
  )

  const isEdgeHighlighted = useCallback(
    (edgeId: string): boolean => {
      if (activeSimStep) return activeSimStep.highlightedEdgeIds.includes(edgeId)
      return false
    },
    [activeSimStep]
  )

  // ── simulation controls ──
  const totalSteps = infographic.simulationSteps?.length ?? 0

  const handleSimNext = () => {
    setSimStep((s) => Math.min(s + 1, totalSteps - 1))
    setSelectedNodeId(null)
  }
  const handleSimPrev = () => setSimStep((s) => Math.max(s - 1, -1))
  const handleSimReset = () => setSimStep(-1)
  const handleSimStart = () => setSimStep(0)

  const markerId = `arrow-${infographic.id}`
  const markerBlockedId = `arrow-blocked-${infographic.id}`

  return (
    <div className="flex flex-col gap-4">
      {/* Variant selector */}
      {infographic.variants && infographic.variants.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground font-medium">表示モード:</span>
          {infographic.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVariant(v.id)
                setSimStep(-1)
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedVariant === v.id
                  ? "font-semibold"
                  : "text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              }`}
              style={
                selectedVariant === v.id
                  ? { backgroundColor: certColor + "18", borderColor: certColor + "60", color: certColor }
                  : {}
              }
            >
              {v.label}
            </button>
          ))}
          {activeVariant && (
            <span className="text-xs text-muted-foreground ml-1">— {activeVariant.description}</span>
          )}
        </div>
      )}

      {/* Main content: SVG + Detail panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* SVG diagram */}
        <div
          className="flex-1 min-w-0 bg-[#f8f9ff] dark:bg-[#1a1b2e] rounded-xl overflow-hidden"
          style={{ minHeight: 300 }}
        >
          <style>{`
            @keyframes dashflow {
              to { stroke-dashoffset: -20; }
            }
            .infographic-edge-animated {
              stroke-dasharray: 6 4;
              animation: dashflow 0.8s linear infinite;
            }
          `}</style>

          <svg
            viewBox={`0 0 ${infographic.svgWidth} ${infographic.svgHeight}`}
            className="w-full"
            style={{ maxHeight: infographic.svgHeight }}
          >
            <defs>
              {/* Grid */}
              <pattern id={`grid-${infographic.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e8eaf6" strokeWidth="0.5" />
              </pattern>
              {/* Arrow marker (default) */}
              <marker
                id={markerId}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 0 6 L 9 3 z" fill={certColor} />
              </marker>
              {/* Arrow marker (blocked/red) */}
              <marker
                id={markerBlockedId}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 0 6 L 9 3 z" fill="#ea4335" />
              </marker>
            </defs>

            {/* Grid background */}
            <rect
              width={infographic.svgWidth}
              height={infographic.svgHeight}
              fill={`url(#grid-${infographic.id})`}
            />

            {/* Render edges (behind nodes) */}
            {infographic.edges.map((edge) => {
              const fromNode = infographic.nodes.find((n) => n.id === edge.from)
              const toNode = infographic.nodes.find((n) => n.id === edge.to)
              if (!fromNode || !toNode) return null
              return (
                <EdgeRenderer
                  key={edge.id}
                  edge={edge}
                  fromNode={fromNode}
                  toNode={toNode}
                  isHighlighted={isEdgeHighlighted(edge.id)}
                  certColor={certColor}
                  markerId={markerId}
                  markerBlockedId={markerBlockedId}
                />
              )
            })}

            {/* Render nodes */}
            {infographic.nodes.map((node) => {
              const opacity = resolveNodeOpacity(node.id)
              const fill = resolveNodeFill(node.id, node.fill)
              const nodeWithFill = { ...node, fill }
              return (
                <NodeShape
                  key={node.id}
                  node={nodeWithFill}
                  opacity={opacity}
                  isSelected={selectedNodeId === node.id}
                  isHighlighted={isNodeHighlighted(node.id)}
                  certColor={certColor}
                  onClick={() => {
                    if (!node.clickable) return
                    setSelectedNodeId((prev) => (prev === node.id ? null : node.id))
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                />
              )
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 border border-border rounded-xl overflow-hidden bg-background shadow-sm"
              style={{ minHeight: 200, maxHeight: infographic.svgHeight }}
            >
              <DetailPanel
                node={selectedNode}
                certColor={certColor}
                onClose={() => setSelectedNodeId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile detail panel (below SVG on small screens) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key={`mobile-${selectedNode.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border border-border rounded-xl overflow-hidden bg-background shadow-sm"
          >
            <DetailPanel
              node={selectedNode}
              certColor={certColor}
              onClose={() => setSelectedNodeId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation player */}
      {infographic.simulationSteps && infographic.simulationSteps.length > 0 && (
        <div
          className="rounded-xl border p-4 space-y-3"
          style={{ borderColor: certColor + "30", backgroundColor: certColor + "06" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground">
              シミュレーション
              {simStep >= 0 && (
                <span className="text-muted-foreground font-normal ml-1">
                  ステップ {simStep + 1} / {totalSteps}
                </span>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              {simStep === -1 ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs gap-1"
                  onClick={handleSimStart}
                  style={{ borderColor: certColor + "50", color: certColor }}
                >
                  <Play size={11} />
                  開始
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={handleSimPrev}
                    disabled={simStep === 0}
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={handleSimNext}
                    disabled={simStep === totalSteps - 1}
                    style={
                      simStep < totalSteps - 1
                        ? { borderColor: certColor + "50", color: certColor }
                        : {}
                    }
                  >
                    <StepForward size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-muted-foreground"
                    onClick={handleSimReset}
                  >
                    <RotateCcw size={13} />
                  </Button>
                </>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeSimStep ? (
              <motion.div
                key={activeSimStep.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-1"
              >
                <p className="text-sm font-medium text-foreground">{activeSimStep.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeSimStep.description}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground"
              >
                「開始」を押してステップごとに図を確認できます
              </motion.p>
            )}
          </AnimatePresence>

          {/* Step indicators */}
          {simStep >= 0 && (
            <div className="flex gap-1.5">
              {infographic.simulationSteps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => setSimStep(i)}
                  className="flex-1 h-1.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: i <= simStep ? certColor : certColor + "25",
                  }}
                  aria-label={`ステップ ${i + 1}: ${step.label}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
