import type { DungeonTheme } from "@/lib/types/dungeon"

/**
 * Minimal theme config for React Flow dungeon map.
 * Design: neutral dark base + single accent color per certification.
 * All themes share the same structural colors (card/border/muted from CSS vars).
 */
export interface ThemeConfig {
  name: string
  nameJa: string
  /** Single accent color per cert theme */
  accentColor: string
  /** Lighter tint of accent for backgrounds */
  accentMuted: string
  /** Icon emoji for the cert */
  icon: string
}

export const DUNGEON_THEMES: Record<DungeonTheme, ThemeConfig> = {
  forest: {
    name: "Cloud Foundations",
    nameJa: "Cloud基礎",
    accentColor: "#34A853",
    accentMuted: "#34A85320",
    icon: "🌿",
  },
  tech: {
    name: "Infrastructure",
    nameJa: "インフラ",
    accentColor: "#4285F4",
    accentMuted: "#4285F420",
    icon: "⚡",
  },
  castle: {
    name: "Architecture",
    nameJa: "アーキテクト",
    accentColor: "#EA4335",
    accentMuted: "#EA433520",
    icon: "🏛",
  },
  volcano: {
    name: "Data Engineering",
    nameJa: "データ",
    accentColor: "#FBBC05",
    accentMuted: "#FBBC0520",
    icon: "🔥",
  },
  ice: {
    name: "Machine Learning",
    nameJa: "ML",
    accentColor: "#00897b",
    accentMuted: "#00897b20",
    icon: "🧊",
  },
  ocean: {
    name: "Networking",
    nameJa: "ネットワーク",
    accentColor: "#0097A7",
    accentMuted: "#0097A720",
    icon: "🌊",
  },
  cave: {
    name: "Security",
    nameJa: "セキュリティ",
    accentColor: "#C62828",
    accentMuted: "#C6282820",
    icon: "🔒",
  },
  sky: {
    name: "Developer",
    nameJa: "デベロッパー",
    accentColor: "#7B1FA2",
    accentMuted: "#7B1FA220",
    icon: "☁️",
  },
  cyber: {
    name: "DevOps",
    nameJa: "DevOps",
    accentColor: "#2E7D32",
    accentMuted: "#2E7D3220",
    icon: "💻",
  },
}
