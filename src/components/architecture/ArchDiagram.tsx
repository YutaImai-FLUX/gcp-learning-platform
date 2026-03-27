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

const NODE_WIDTH = 170
const NODE_HEIGHT = 60
const LAYER_PAD_X = 30
const LAYER_PAD_Y = 40
const LAYER_TOP_PAD = 32

const nodeTypes = {
  gcpNode: GcpNode,
  layerNode: LayerNode,
}

function getLayoutedElements(arch: Architecture) {
  // --- 1. dagre layout for actual service nodes ---
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: "LR",
    ranksep: 90,
    nodesep: 45,
    marginx: 60,
    marginy: 60,
  })

  for (const node of arch.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }
  for (const edge of arch.edges) {
    g.setEdge(edge.from, edge.to)
  }
  dagre.layout(g)

  // Build a map of nodeId -> dagre position
  const posMap = new Map<string, { x: number; y: number }>()
  for (const node of arch.nodes) {
    const pos = g.node(node.id)
    posMap.set(node.id, {
      x: pos.x - NODE_WIDTH / 2,
      y: pos.y - NODE_HEIGHT / 2,
    })
  }

  // --- 2. Compute layer bounding boxes ---
  const layerNodes: Node[] = []
  const serviceNodes: Node[] = []

  if (arch.layers && arch.layers.length > 0) {
    for (const layer of arch.layers) {
      const memberPositions = layer.nodeIds
        .map((nid) => posMap.get(nid))
        .filter((p): p is { x: number; y: number } => !!p)

      if (memberPositions.length === 0) continue

      const minX = Math.min(...memberPositions.map((p) => p.x)) - LAYER_PAD_X
      const minY = Math.min(...memberPositions.map((p) => p.y)) - LAYER_TOP_PAD
      const maxX = Math.max(...memberPositions.map((p) => p.x + NODE_WIDTH)) + LAYER_PAD_X
      const maxY = Math.max(...memberPositions.map((p) => p.y + NODE_HEIGHT)) + LAYER_PAD_Y

      layerNodes.push({
        id: layer.id,
        type: "layerNode",
        position: { x: minX, y: minY },
        data: { label: layer.label, color: layer.color },
        style: { width: maxX - minX, height: maxY - minY },
        selectable: false,
        draggable: false,
        connectable: false,
        zIndex: -1,
      })
    }
  }

  // --- 3. Build service nodes (absolute positions, no parentId for simplicity) ---
  for (const n of arch.nodes) {
    const pos = posMap.get(n.id)!
    serviceNodes.push({
      id: n.id,
      type: "gcpNode",
      position: { x: pos.x, y: pos.y },
      data: {
        label: n.label,
        service: n.service,
        color: n.color,
        icon: n.icon,
      },
      zIndex: 1,
    })
  }

  // --- 4. Build edges ---
  const edges: Edge[] = arch.edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.from,
    target: e.to,
    type: "smoothstep",
    animated: !e.dashed,
    label: e.label || undefined,
    labelStyle: { fontSize: 10, fill: "#64748b", fontWeight: 500 },
    labelBgStyle: { fill: "white", fillOpacity: 0.85 },
    labelBgPadding: [4, 2] as [number, number],
    style: {
      stroke: e.dashed ? "#94a3b8" : "#4285F4",
      strokeWidth: e.dashed ? 1.5 : 2,
      strokeDasharray: e.dashed ? "6 4" : undefined,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: e.dashed ? "#94a3b8" : "#4285F4",
    },
    zIndex: 2,
  }))

  return { nodes: [...layerNodes, ...serviceNodes], edges }
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
    <div className="w-full h-[520px] rounded-xl overflow-hidden border border-border bg-[#fafbff] dark:bg-[#13141f]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
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
