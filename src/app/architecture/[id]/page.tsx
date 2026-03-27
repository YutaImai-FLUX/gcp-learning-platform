"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getArchById } from "@/lib/data/architectures"

export default function ArchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const arch = getArchById(id)

  if (!arch) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">アーキテクチャが見つかりませんでした</p>
        <Link href="/architecture">
          <Button variant="outline">一覧に戻る</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        href="/architecture"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        アーキテクチャ一覧へ戻る
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{arch.name}</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed max-w-2xl">{arch.description}</p>
      </div>

      {/* Architecture Diagram */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">アーキテクチャ図</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#f8f9ff] dark:bg-[#1a1b2e] rounded-xl overflow-hidden">
            <svg
              viewBox="0 0 700 420"
              className="w-full"
              style={{ maxHeight: 420 }}
            >
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e8eaf6" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="700" height="420" fill="url(#grid)" />

              {/* Draw edges */}
              {arch.edges.map((edge, i) => {
                const from = arch.nodes.find((n) => n.id === edge.from)
                const to = arch.nodes.find((n) => n.id === edge.to)
                if (!from || !to) return null
                const x1 = from.x + 50
                const y1 = from.y + 30
                const x2 = to.x + 50
                const y2 = to.y + 30
                const mx = (x1 + x2) / 2
                const my = (y1 + y2) / 2
                return (
                  <g key={i}>
                    <path
                      d={`M ${x1} ${y1} Q ${mx} ${y1} ${x2} ${y2}`}
                      fill="none"
                      stroke={edge.dashed ? "#94a3b8" : "#4285F4"}
                      strokeWidth={edge.dashed ? 1.5 : 2}
                      strokeDasharray={edge.dashed ? "5,4" : undefined}
                      markerEnd="url(#arrow)"
                      opacity={0.7}
                    />
                    {edge.label && (
                      <text x={mx} y={my - 6} textAnchor="middle" fontSize="9" fill="#64748b">
                        {edge.label}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Arrow marker */}
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M 0 0 L 0 6 L 9 3 z" fill="#4285F4" />
                </marker>
              </defs>

              {/* Draw nodes */}
              {arch.nodes.map((node) => {
                const lines = node.label.split("\n")
                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    {/* Node box */}
                    <rect
                      x="0" y="0" width="100" height="56"
                      rx="10" ry="10"
                      fill="white"
                      stroke={node.color}
                      strokeWidth="2"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    />
                    {/* Color accent top bar */}
                    <rect x="0" y="0" width="100" height="8" rx="10" ry="10" fill={node.color} />
                    <rect x="0" y="4" width="100" height="4" fill={node.color} />
                    {/* Text */}
                    {lines.map((line, li) => (
                      <text
                        key={li}
                        x="50" y={24 + li * 14}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={li === 0 ? "600" : "400"}
                        fill={li === 0 ? "#202124" : "#5f6368"}
                        fontFamily="sans-serif"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gcp-blue" />
              <span>データフロー</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gray-400 border-dashed" style={{ borderTop: "2px dashed #94a3b8", background: "none" }} />
              <span>非同期・オプション接続</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle size={15} className="text-gcp-green" />
              使用するGCPサービス ({arch.nodes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {arch.nodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border"
                  style={{
                    backgroundColor: `${node.color}12`,
                    borderColor: `${node.color}30`,
                    color: node.color,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                  {node.label.replace("\n", " ")}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap size={15} className="text-gcp-yellow" />
                主なユースケース
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {arch.useCases.map((uc) => (
                  <li key={uc} className="flex items-center gap-2 text-sm">
                    <span className="text-gcp-blue">▸</span>
                    {uc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">このアーキテクチャのメリット</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {arch.benefits.map((b) => (
                  <Badge key={b} variant="secondary" className="text-xs">
                    {b}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
