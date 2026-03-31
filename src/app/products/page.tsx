"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, PlayCircle, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { GCP_PRODUCTS, PRODUCT_CATEGORIES, CATEGORY_COLORS, getGcpProductIconPath } from "@/lib/data/products"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = useMemo(() =>
    GCP_PRODUCTS.filter((p) => {
      const matchCat = category === "All" || p.category === category
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    }), [search, category])

  // Group by category when "All" is selected
  const groupedByCategory = useMemo(() => {
    if (category !== "All") return [{ category, products: filtered }]
    const categories = Array.from(new Set(filtered.map((p) => p.category)))
    return categories.map((cat) => ({
      category: cat,
      products: filtered.filter((p) => p.category === cat),
    }))
  }, [filtered, category])

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={stagger.item}>
        <h1 className="font-display heading-display text-2xl md:text-3xl text-foreground flex items-center gap-3">
          <Package size={28} className="text-primary" />
          GCP製品カタログ
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Google Cloud Platform の全製品をカテゴリ別に探索できます
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div variants={stagger.item}>
        <div className="relative max-w-lg">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="製品名やキーワードで検索..."
            className="pl-10 h-11 bg-card border-border text-sm"
          />
        </div>
      </motion.div>

      {/* Category tabs */}
      <motion.div variants={stagger.item} className="flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isActive = category === cat
          const color = cat !== "All" ? CATEGORY_COLORS[cat] : undefined
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isActive
                  ? "text-white shadow-sm border-transparent"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
              style={isActive ? { backgroundColor: color ?? "var(--primary)", borderColor: color ?? "var(--primary)" } : undefined}
            >
              {cat}
            </button>
          )
        })}
      </motion.div>

      {/* Count */}
      <motion.div variants={stagger.item}>
        <p className="text-sm text-muted-foreground">
          <span className="font-display font-bold text-foreground">{filtered.length}</span> 製品
        </p>
      </motion.div>

      {/* Products grouped by category */}
      {groupedByCategory.map((group) => {
        const catColor = CATEGORY_COLORS[group.category] ?? "var(--primary)"
        return (
          <motion.div key={group.category} variants={stagger.item} className="space-y-4">
            {/* Category section header */}
            {category === "All" && (
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-5 rounded-full"
                  style={{ backgroundColor: catColor }}
                />
                <h2 className="font-display text-base font-bold text-foreground">{group.category}</h2>
                <span className="text-xs text-muted-foreground">{group.products.length}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={stagger.item}
                >
                  <Link href={`/products/${product.id}`}>
                    <Card className="h-full border-border hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
                      style={{ borderTopColor: catColor, borderTopWidth: 2 }}
                    >
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
                            {product.hasDemo && (
                              <Badge className="text-xs bg-gcp-green/10 text-gcp-green border-0">
                                <PlayCircle size={10} className="mr-1" />
                                デモ
                              </Badge>
                            )}
                          </div>
                        </div>
                        <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
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
          </motion.div>
        )
      })}
    </motion.div>
  )
}
