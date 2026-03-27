"use client"

import { useMemo, useCallback } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react"
import dagre from "@dagrejs/dagre"
import GcpNode from "./GcpNode"
import LayerNode from "./LayerNode"
import type { Architecture } from "@/lib/data/architectures"

import "@xyflow/react/dist/style.css"

const NODE_W = 170
const NODE_H = 64
const LAYER_PAD = 28
const LAYER_LABEL_H = 28

const nodeTypes = {
  gcpNode: GcpNode,
  layerNode: LayerNode,
}

/* ─── Build a nodeId → layerId lookup ─── */
function buildLayerMap(arch: Architecture): Map<string, string> {
  const m = new Map<string, string>()
  for (const layer of arch.layers ?? []) {
    for (const nid of layer.nodeIds) m.set(nid, layer.id)
  }
  return m
}

/* ─── Layout using dagre compound graph ─── */
function getLayoutedElements(arch: Architecture) {
  const layers = arch.layers ?? []
  const layerMap = buildLayerMap(arch)

  // 1. Create compound graph
  const g = new dagre.graphlib.Graph({ compound: true })
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: "LR",
    ranksep: 70,
    nodesep: 30,
    marginx: 30,
    marginy: 30,
  })

  // 2. Add layer (group) nodes
  for (const layer of layers) {
    g.setNode(layer.id, {})
  }

  // 3. Add service nodes, set parent to layer
  for (const node of arch.nodes) {
    g.setNode(node.id, { width: NODE_W, height: NODE_H })
    const parentLayer = layerMap.get(node.id)
    if (parentLayer) {
      g.setParent(node.id, parentLayer)
    }
  }

  // 4. Add edges
  for (const edge of arch.edges) {
    g.setEdge(edge.from, edge.to)
  }

  dagre.layout(g)

  // 5. Build layer bounding boxes from positioned children
  const layerBounds = new Map<string, { minX: number; minY: number; maxX: number; maxY: number }>()
  for (const node of arch.nodes) {
    const lid = layerMap.get(node.id)
    if (!lid) continue
    const pos = g.node(node.id)
    const nx = pos.x - NODE_W / 2
    const ny = pos.y - NODE_H / 2
    const cur = layerBounds.get(lid)
    if (!cur) {
      layerBounds.set(lid, { minX: nx, minY: ny, maxX: nx + NODE_W, maxY: ny + NODE_H })
    } else {
      cur.minX = Math.min(cur.minX, nx)
      cur.minY = Math.min(cur.minY, ny)
      cur.maxX = Math.max(cur.maxX, nx + NODE_W)
      cur.maxY = Math.max(cur.maxY, ny + NODE_H)
    }
  }

  // 6. Build React Flow nodes — layers first (z-index -1), then service nodes
  const rfNodes: Node[] = []

  for (const layer of layers) {
    const bounds = layerBounds.get(layer.id)
    if (!bounds) continue
    const x = bounds.minX - LAYER_PAD
    const y = bounds.minY - LAYER_PAD - LAYER_LABEL_H
    const w = bounds.maxX - bounds.minX + LAYER_PAD * 2
    const h = bounds.maxY - bounds.minY + LAYER_PAD * 2 + LAYER_LABEL_H

    rfNodes.push({
      id: layer.id,
      type: "layerNode",
      position: { x, y },
      data: { label: layer.label, color: layer.color },
      style: { width: w, height: h },
      selectable: false,
      draggable: false,
      connectable: false,
      zIndex: -1,
    })
  }

  for (const n of arch.nodes) {
    const pos = g.node(n.id)
    rfNodes.push({
      id: n.id,
      type: "gcpNode",
      position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
      data: { label: n.label, service: n.service, color: n.color, icon: n.icon },
      zIndex: 1,
    })
  }

  // 7. Build edges
  const rfEdges: Edge[] = arch.edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.from,
    target: e.to,
    type: "smoothstep",
    animated: !e.dashed,
    label: e.label || undefined,
    labelStyle: { fontSize: 10, fill: "#64748b", fontWeight: 500 },
    labelBgStyle: { fill: "white", fillOpacity: 0.9 },
    labelBgPadding: [4, 2] as [number, number],
    style: {
      stroke: e.dashed ? "#94a3b8" : "#4285F4",
      strokeWidth: e.dashed ? 1.5 : 2,
      strokeDasharray: e.dashed ? "6 4" : undefined,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 14,
      height: 14,
      color: e.dashed ? "#94a3b8" : "#4285F4",
    },
    zIndex: 2,
  }))

  return { nodes: rfNodes, edges: rfEdges }
}

interface Props {
  architecture: Architecture
}

export default function ArchDiagram({ architecture }: Props) {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(architecture),
    [architecture]
  )

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes)
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges)

  const miniMapNodeColor = useCallback((node: Node) => {
    if (node.type === "layerNode") return "transparent"
    const color = (node.data as { color?: string })?.color
    return color || "#4285F4"
  }, [])

  return (
    <div className="w-full h-[540px] rounded-xl overflow-hidden border border-border bg-[#fafbff] dark:bg-[#13141f]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.25}
        maxZoom={2}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#c8ccd4" />
        <Controls
          showInteractive={false}
          className="!bg-white dark:!bg-[#1e1f2e] !border-border !shadow-md !rounded-lg"
        />
        <MiniMap
          nodeColor={miniMapNodeColor}
          maskColor="rgba(0,0,0,0.08)"
          className="!bg-white dark:!bg-[#1e1f2e] !border-border !rounded-lg !shadow-md"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  )
}
