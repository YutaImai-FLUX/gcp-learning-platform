"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, PlayCircle, CheckCircle, Tag, Link2, ExternalLink,
  Target, Lightbulb, ArrowLeftRight, ShieldCheck, GraduationCap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProductById, GCP_PRODUCTS, CATEGORY_COLORS, getGcpProductIconPath } from "@/lib/data/products"
import { getCertsForProduct, getArchsForProduct, getDemosForProduct } from "@/lib/data/cross-references"
import { RelatedCerts, RelatedArchitectures, RelatedDemos } from "@/components/shared/RelatedContent"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">製品が見つかりませんでした</p>
        <Link href="/products">
          <Button variant="outline">製品一覧に戻る</Button>
        </Link>
      </div>
    )
  }

  const relatedProducts = product.relatedProducts
    .map((rid) => GCP_PRODUCTS.find((p) => p.id === rid))
    .filter(Boolean)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        製品カタログへ戻る
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 p-6 bg-white dark:bg-card rounded-2xl border border-border">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${product.color}12` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getGcpProductIconPath(product)}
            alt={product.name}
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              style={{
                backgroundColor: `${CATEGORY_COLORS[product.category]}18`,
                color: CATEGORY_COLORS[product.category],
              }}
            >
              {product.category}
            </Badge>
            {product.hasDemo && (
              <Badge className="bg-gcp-green/10 text-gcp-green border-0">
                <PlayCircle size={11} className="mr-1" />
                デモあり
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <p className="text-muted-foreground mt-2 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {product.hasDemo && product.demoPath && (
            <Link href={product.demoPath}>
              <Button className="bg-gcp-blue hover:bg-gcp-blue-dark text-white w-full">
                <PlayCircle size={16} className="mr-2" />
                デモを試す
              </Button>
            </Link>
          )}
          {product.docUrl && (
            <a href={product.docUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                <ExternalLink size={14} className="mr-2" />
                公式ドキュメント
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* 5 Insights */}
      {product.insight && (
        <div className="space-y-4">
          {[
            { icon: Target, label: "製品の目的", text: product.insight.purpose, color: "#4285F4" },
            { icon: Lightbulb, label: "利用シーンとアーキテクチャ例", text: product.insight.useCasesDetail, color: "#34A853" },
            { icon: ArrowLeftRight, label: "類似・競合サービスとの使い分け", text: product.insight.comparison, color: "#FBBC05" },
            { icon: ShieldCheck, label: "設計・運用のベストプラクティスと注意点", text: product.insight.bestPractices, color: "#EA4335" },
            { icon: GraduationCap, label: "資格試験での頻出ポイント", text: product.insight.examTips, color: "#7B1FA2" },
          ].map(({ icon: Icon, label, text, color }) => (
            <Card key={label} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon size={16} style={{ color }} />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/85 leading-relaxed">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Features */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-gcp-green" />
              主要機能
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {product.keyFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-gcp-green mt-0.5 shrink-0">✓</span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag size={16} className="text-gcp-blue" />
              ユースケース
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {product.useCases.map((uc) => (
                <Badge key={uc} variant="secondary" className="text-xs">
                  {uc}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">料金例</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm text-foreground bg-muted px-4 py-3 rounded-lg">
            {product.pricingExample}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            ※ 実際の料金は使用量・リージョン等によって異なります。公式ドキュメントでご確認ください。
          </p>
        </CardContent>
      </Card>

      {/* Related Certs, Architectures, Demos */}
      {(() => {
        const certIds = getCertsForProduct(product.id)
        const archIds = getArchsForProduct(product.id)
        const demoIds = getDemosForProduct(product.id)
        return (certIds.length > 0 || archIds.length > 0 || demoIds.length > 0) ? (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">学習・実践リソース</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoIds.length > 0 && <RelatedDemos demoIds={demoIds} title="デモで体験する" />}
              {certIds.length > 0 && <RelatedCerts certIds={certIds} title="この製品が出題される資格" />}
              {archIds.length > 0 && <RelatedArchitectures archIds={archIds} title="使用されるアーキテクチャ" />}
            </CardContent>
          </Card>
        ) : null
      })()}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link2 size={16} className="text-muted-foreground" />
              関連製品
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rel) => rel && (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-border hover:border-gcp-blue/40 hover:bg-gcp-blue-light/20 transition-all"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${rel.color}12` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getGcpProductIconPath(rel)}
                      alt={rel.name}
                      width={18}
                      height={18}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground leading-tight">{rel.name}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
