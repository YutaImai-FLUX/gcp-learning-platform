"use client"

import Link from "next/link"
import {
  PlayCircle, GraduationCap, Network, Package,
  ArrowRight, Shield, Globe, BarChart3, Brain,
  Server, HardDrive, Box, Radio, Zap, Bot,
  Key, Building2, FileSearch,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DEMO_DISPLAY_NAMES, demoIdToPath } from "@/lib/data/cross-references"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { ARCHITECTURES } from "@/lib/data/architectures"
import { GCP_PRODUCTS } from "@/lib/data/products"

const DEMO_ICONS: Record<string, React.ElementType> = {
  "gce": Server, "gcs": HardDrive, "bigquery": BarChart3,
  "cloud-run": PlayCircle, "cloud-functions": Zap, "gke": Box,
  "pubsub": Radio, "vertex-ai": Brain, "adk": Bot,
  "iam": Shield, "vpc-firewall": Globe, "service-accounts": Key,
  "org-policy": Building2, "audit-logs": FileSearch,
}

const DEMO_COLORS: Record<string, string> = {
  "gce": "#4285F4", "gcs": "#4285F4", "bigquery": "#4285F4",
  "cloud-run": "#34A853", "cloud-functions": "#FBBC05", "gke": "#4285F4",
  "pubsub": "#FBBC05", "vertex-ai": "#4285F4", "adk": "#4285F4",
  "iam": "#EA4335", "vpc-firewall": "#34A853", "service-accounts": "#EA4335",
  "org-policy": "#FBBC05", "audit-logs": "#4285F4",
}

/** 関連デモリンク */
export function RelatedDemos({ demoIds, title = "関連デモ" }: { demoIds: string[]; title?: string }) {
  if (demoIds.length === 0) return null
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
        <PlayCircle size={15} className="text-gcp-blue" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {demoIds.map((id) => {
          const Icon = DEMO_ICONS[id] || PlayCircle
          const color = DEMO_COLORS[id] || "#4285F4"
          return (
            <Link
              key={id}
              href={demoIdToPath(id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:shadow-md hover:-translate-y-0.5 transition-all text-xs font-medium bg-white dark:bg-[#1e1f2e]"
            >
              <Icon size={13} style={{ color }} />
              <span>{DEMO_DISPLAY_NAMES[id] || id}</span>
              <ArrowRight size={11} className="text-muted-foreground" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/** 関連資格リンク */
export function RelatedCerts({ certIds, title = "関連する資格" }: { certIds: string[]; title?: string }) {
  if (certIds.length === 0) return null
  const certs = certIds.map((id) => CERTIFICATIONS.find((c) => c.id === id)).filter(Boolean)
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
        <GraduationCap size={15} className="text-gcp-green" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {certs.map((cert) => (
          <Link
            key={cert!.id}
            href={`/learn/${cert!.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:shadow-md hover:-translate-y-0.5 transition-all text-xs font-medium bg-white dark:bg-[#1e1f2e]"
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cert!.color }} />
            <span>{cert!.shortName}</span>
            <Badge variant="secondary" className="text-[9px] px-1 py-0">{cert!.level}</Badge>
            <ArrowRight size={11} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}

/** 関連アーキテクチャリンク */
export function RelatedArchitectures({ archIds, title = "関連アーキテクチャ" }: { archIds: string[]; title?: string }) {
  if (archIds.length === 0) return null
  const archs = archIds.map((id) => ARCHITECTURES.find((a) => a.id === id)).filter(Boolean)
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
        <Network size={15} className="text-gcp-blue" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {archs.map((arch) => (
          <Link
            key={arch!.id}
            href={`/architecture/${arch!.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:shadow-md hover:-translate-y-0.5 transition-all text-xs font-medium bg-white dark:bg-[#1e1f2e]"
          >
            <Network size={13} className="text-gcp-blue" />
            <span>{arch!.name}</span>
            <ArrowRight size={11} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}

/** 関連製品リンク */
export function RelatedProducts({ productIds, title = "関連する製品" }: { productIds: string[]; title?: string }) {
  if (productIds.length === 0) return null
  const products = productIds.map((id) => GCP_PRODUCTS.find((p) => p.id === id)).filter(Boolean)
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
        <Package size={15} className="text-muted-foreground" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {products.map((prod) => (
          <Link
            key={prod!.id}
            href={`/products/${prod!.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:shadow-md hover:-translate-y-0.5 transition-all text-xs font-medium bg-white dark:bg-[#1e1f2e]"
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: prod!.color }} />
            <span>{prod!.name}</span>
            <ArrowRight size={11} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}

/** 全関連コンテンツをまとめて表示（デモページ下部等に使用） */
export function RelatedContentSection({
  demoIds, certIds, archIds, productIds,
  title = "関連コンテンツ",
}: {
  demoIds?: string[]
  certIds?: string[]
  archIds?: string[]
  productIds?: string[]
  title?: string
}) {
  const hasContent = (demoIds?.length || 0) + (certIds?.length || 0) + (archIds?.length || 0) + (productIds?.length || 0) > 0
  if (!hasContent) return null

  return (
    <div className="mt-6 pt-5 border-t border-border space-y-4">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      {demoIds && demoIds.length > 0 && <RelatedDemos demoIds={demoIds} title="デモで体験する" />}
      {certIds && certIds.length > 0 && <RelatedCerts certIds={certIds} title="この分野の資格" />}
      {archIds && archIds.length > 0 && <RelatedArchitectures archIds={archIds} title="実務アーキテクチャ例" />}
      {productIds && productIds.length > 0 && <RelatedProducts productIds={productIds} title="使用されるGCP製品" />}
    </div>
  )
}
