import { GCP_PRODUCTS } from "@/lib/data/products"
import { CERTIFICATIONS } from "@/lib/data/certifications"

export interface SearchItem {
  id: string
  title: string
  subtitle: string
  href: string
  category: "product" | "demo" | "cert" | "page"
}

const PAGES: SearchItem[] = [
  { id: "page-home", title: "ダッシュボード", subtitle: "ホーム", href: "/", category: "page" },
  { id: "page-products", title: "製品カタログ", subtitle: "GCPサービス一覧", href: "/products", category: "page" },
  { id: "page-demos", title: "インタラクティブデモ", subtitle: "ハンズオン体験", href: "/demos", category: "page" },
  { id: "page-arch", title: "アーキテクチャ図", subtitle: "システム構成図", href: "/architecture", category: "page" },
  { id: "page-proposal", title: "提案シミュレーター", subtitle: "提案書作成", href: "/proposal", category: "page" },
  { id: "page-learn", title: "資格学習センター", subtitle: "資格試験対策", href: "/learn", category: "page" },
  { id: "page-dungeon", title: "ダンジョン冒険", subtitle: "RPG学習", href: "/dungeon", category: "page" },
  { id: "page-flashcards", title: "フラッシュカード", subtitle: "用語暗記", href: "/flashcards", category: "page" },
  { id: "page-updates", title: "最新アップデート", subtitle: "GCPニュース", href: "/updates", category: "page" },
]

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [...PAGES]

  // Products
  for (const p of GCP_PRODUCTS) {
    items.push({
      id: `product-${p.id}`,
      title: p.name,
      subtitle: `${p.category} — 製品`,
      href: `/products/${p.id}`,
      category: "product",
    })
    if (p.hasDemo) {
      items.push({
        id: `demo-${p.id}`,
        title: `${p.name} デモ`,
        subtitle: `${p.category} — インタラクティブデモ`,
        href: `/demos/${p.id}`,
        category: "demo",
      })
    }
  }

  // Certs
  for (const c of CERTIFICATIONS) {
    items.push({
      id: `cert-${c.id}`,
      title: `${c.shortName} — ${c.name}`,
      subtitle: `${c.level} — 資格学習`,
      href: `/learn/${c.id}`,
      category: "cert",
    })
  }

  return items
}

export const SEARCH_INDEX: SearchItem[] = buildIndex()

export function searchItems(query: string): SearchItem[] {
  if (!query.trim()) return []
  const lower = query.toLowerCase()
  return SEARCH_INDEX
    .filter((item) =>
      item.title.toLowerCase().includes(lower) ||
      item.subtitle.toLowerCase().includes(lower)
    )
    .slice(0, 10)
}
