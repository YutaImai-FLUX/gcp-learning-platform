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
import type { Architecture } from "@/lib/data/architectures"

import "@xyflow/react/dist/style.css"

const NODE_WIDTH = 170
const NODE_HEIGHT = 60

const nodeTypes = { gcpNode: GcpNode }

function getLayoutedElements(arch: Architecture) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: "LR",
    ranksep: 80,
    nodesep: 40,
    marginx: 40,
    marginy: 40,
  })

  for (const node of arch.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }

  for (const edge of arch.edges) {
    g.setEdge(edge.from, edge.to)
  }

  dagre.layout(g)

  const nodes: Node[] = arch.nodes.map((n) => {
    const pos = g.node(n.id)
    return {
      id: n.id,
      type: "gcpNode",
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
      data: {
        label: n.label,
        service: n.service,
        color: n.color,
        icon: n.icon,
      },
    }
  })

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
  }))

  return { nodes, edges }
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
    const color = (node.data as { color?: string })?.color
    return color || "#4285F4"
  }, [])

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-border bg-[#fafbff] dark:bg-[#13141f]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
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
