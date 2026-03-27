"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Server,
  HardDrive,
  BarChart3,
  PlayCircle,
  Box,
  Radio,
  Brain,
  Zap,
  Bot,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const DEMOS = [
  {
    id: "gce",
    name: "Compute Engine",
    desc: "VMインスタンスを作成・管理するシミュレーター。マシンタイプ・OS・リージョンを選択して起動を体験。",
    icon: Server,
    color: "#4285F4",
    bg: "#e8f0fe",
    href: "/demos/gce",
    tags: ["Compute", "VM", "Infrastructure"],
  },
  {
    id: "gcs",
    name: "Cloud Storage",
    desc: "バケットの作成・ファイルのアップロード・管理をシミュレート。ストレージクラスの違いも体験。",
    icon: HardDrive,
    color: "#4285F4",
    bg: "#e8f0fe",
    href: "/demos/gcs",
    tags: ["Storage", "Object Storage"],
  },
  {
    id: "bigquery",
    name: "BigQuery",
    desc: "SQLエディタでクエリを実行し結果をテーブルとグラフで確認。ペタバイル規模分析を体験。",
    icon: BarChart3,
    color: "#4285F4",
    bg: "#e8f0fe",
    href: "/demos/bigquery",
    tags: ["Analytics", "SQL", "DWH"],
  },
  {
    id: "cloud-run",
    name: "Cloud Run",
    desc: "Dockerコンテナをサーバーレスでデプロイ。リビジョン管理・トラフィック分割を体験。",
    icon: PlayCircle,
    color: "#34A853",
    bg: "#e6f4ea",
    href: "/demos/cloud-run",
    tags: ["Serverless", "Container", "Deploy"],
  },
  {
    id: "gke",
    name: "GKE (Kubernetes Engine)",
    desc: "Kubernetesクラスター管理・Pod確認・kubectlコマンドをシミュレート。",
    icon: Box,
    color: "#4285F4",
    bg: "#e8f0fe",
    href: "/demos/gke",
    tags: ["Kubernetes", "Container", "Orchestration"],
  },
  {
    id: "pubsub",
    name: "Pub/Sub",
    desc: "トピック作成・メッセージのパブリッシュ・サブスクライバーへの配信をリアルタイムで可視化。",
    icon: Radio,
    color: "#FBBC05",
    bg: "#fef7e0",
    href: "/demos/pubsub",
    tags: ["Messaging", "Event-driven", "Async"],
  },
  {
    id: "vertex-ai",
    name: "Vertex AI",
    desc: "MLモデル一覧・エンドポイントへのデプロイ・予測リクエストの送信を体験。",
    icon: Brain,
    color: "#4285F4",
    bg: "#e8f0fe",
    href: "/demos/vertex-ai",
    tags: ["AI/ML", "Model Serving", "MLOps"],
  },
  {
    id: "cloud-functions",
    name: "Cloud Functions",
    desc: "コードエディタでNode.js関数を記述し、デプロイ・HTTPトリガーテストを体験。",
    icon: Zap,
    color: "#FBBC05",
    bg: "#fef7e0",
    href: "/demos/cloud-functions",
    tags: ["Serverless", "Functions", "Event-driven"],
  },
  {
    id: "adk",
    name: "Agent Development Kit (ADK)",
    desc: "GeminiベースのAIエージェントを構築し、マルチエージェントオーケストレーションを体験。ツール統合・並列実行を可視化。",
    icon: Bot,
    color: "#4285F4",
    bg: "#e8f0fe",
    href: "/demos/adk",
    tags: ["AI/ML", "Agents", "Gemini", "ADK"],
  },
]

export default function DemosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">インタラクティブデモ</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Google Cloud の主要サービスをシミュレーション形式で体験できます。実際の課金は発生しません。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMOS.map((demo, i) => {
          const Icon = demo.icon
          return (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={demo.href}>
                <Card className="border-border hover:shadow-md hover:border-opacity-50 transition-all group cursor-pointer h-full"
                  style={{ borderColor: `${demo.color}30` } as React.CSSProperties}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: demo.color }}
                      >
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-foreground group-hover:text-gcp-blue transition-colors">
                            {demo.name}
                          </h3>
                          <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{demo.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {demo.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
