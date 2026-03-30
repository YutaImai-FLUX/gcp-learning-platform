"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, PlayCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { GCP_PRODUCTS, PRODUCT_CATEGORIES, CATEGORY_COLORS, getGcpProductIconPath } from "@/lib/data/products"

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = GCP_PRODUCTS.filter((p) => {
    const matchCat = category === "All" || p.category === category
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">GCP製品カタログ</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Google Cloud Platform の全製品を カテゴリ別に探索できます
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="製品を検索..."
            className="pl-9 bg-white dark:bg-card"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === cat
                ? "bg-gcp-blue text-white shadow-sm"
                : "bg-white dark:bg-card border border-border text-muted-foreground hover:border-gcp-blue/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} 製品
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link href={`/products/${product.id}`}>
              <Card className="h-full border-border hover:shadow-md hover:border-gcp-blue/30 transition-all group cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${product.color}12` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getGcpProductIconPath(product)}
                        alt={product.name}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[product.category]}18`,
                          color: CATEGORY_COLORS[product.category],
                        }}
                      >
                        {product.category}
                      </Badge>
                      {product.hasDemo && (
                        <Badge className="text-xs bg-gcp-green/10 text-gcp-green border-0">
                          <PlayCircle size={10} className="mr-1" />
                          デモ
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-gcp-blue transition-colors mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground font-mono">{product.pricingExample}</p>
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
