"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Network, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ARCHITECTURES } from "@/lib/data/architectures"

const CATEGORY_COLORS: Record<string, string> = {
  Web: "#4285F4",
  Analytics: "#4285F4",
  "AI/ML": "#4285F4",
  Architecture: "#34A853",
  Serverless: "#FBBC05",
  Networking: "#34A853",
  DevOps: "#34A853",
}

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">アーキテクチャパターン</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Google Cloud を活用した代表的なシステムアーキテクチャをインタラクティブに解説します
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ARCHITECTURES.map((arch, i) => (
          <motion.div
            key={arch.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/architecture/${arch.id}`}>
              <Card className="border-border hover:shadow-md transition-all group cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[arch.category] ?? "#4285F4" }}
                    >
                      <Network size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[arch.category] ?? "#4285F4"}18`,
                            color: CATEGORY_COLORS[arch.category] ?? "#4285F4",
                          }}
                        >
                          {arch.category}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-gcp-blue transition-colors flex items-center gap-2">
                        {arch.name}
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {arch.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {arch.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Mini service list */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {arch.nodes.slice(1, 6).map((node) => (
                          <span
                            key={node.id}
                            className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium"
                          >
                            {node.label.replace("\n", " ")}
                          </span>
                        ))}
                        {arch.nodes.length > 6 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            +{arch.nodes.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
