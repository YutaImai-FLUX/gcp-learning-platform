"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getArchById } from "@/lib/data/architectures"
import ArchDiagram from "@/components/architecture/ArchDiagram"

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
    <div className="space-y-6 max-w-6xl">
      <Link
        href="/architecture"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        アーキテクチャ一覧へ戻る
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-foreground">{arch.name}</h1>
          <Badge variant="secondary">{arch.category}</Badge>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">{arch.description}</p>
      </div>

      {/* Architecture Diagram — React Flow */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">アーキテクチャ図</CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-gcp-blue rounded" />
                <span>データフロー</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 rounded" style={{ borderTop: "2px dashed #94a3b8" }} />
                <span>非同期 / オプション</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ArchDiagram architecture={arch} />
        </CardContent>
      </Card>

      {/* Details grid */}
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
