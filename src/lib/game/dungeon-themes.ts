import type { DungeonTheme } from "@/lib/types/dungeon"

export interface ThemeConfig {
  name: string
  nameJa: string
  bgGradient: string
  tileColor: string
  tileBorder: string
  pathColor: string
  accentColor: string
  textColor: string
  fontClass: string
  ambientEmoji: string[]
  bgPattern: string
  roomColors: {
    locked: string
    available: string
    active: string
    cleared: string
  }
}

export const DUNGEON_THEMES: Record<DungeonTheme, ThemeConfig> = {
  forest: {
    name: "Enchanted Forest",
    nameJa: "魔法の森",
    bgGradient: "from-green-900 via-green-800 to-emerald-900",
    tileColor: "#1a3a1a",
    tileBorder: "#2d5a27",
    pathColor: "#6b8f63",
    accentColor: "#34A853",
    textColor: "#c8e6c9",
    fontClass: "font-pixel",
    ambientEmoji: ["🌿", "🍄", "🦎"],
    bgPattern: "radial-gradient(circle at 20% 30%, rgba(52,168,83,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(52,168,83,0.04) 0%, transparent 40%)",
    roomColors: {
      locked: "#2a332a",
      available: "#1b5e20",
      active: "#2e7d32",
      cleared: "#2d5a27",
    },
  },
  tech: {
    name: "Tech Laboratory",
    nameJa: "テックラボ",
    bgGradient: "from-slate-900 via-blue-900 to-slate-800",
    tileColor: "#111827",
    tileBorder: "#1e3a5f",
    pathColor: "#4285F4",
    accentColor: "#4285F4",
    textColor: "#bbdefb",
    fontClass: "font-pixel",
    ambientEmoji: ["⚡", "🔧", "💡"],
    bgPattern: "linear-gradient(rgba(66,133,244,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(66,133,244,0.03) 1px, transparent 1px)",
    roomColors: {
      locked: "#1a2332",
      available: "#1565c0",
      active: "#1976d2",
      cleared: "#1e3a5f",
    },
  },
  castle: {
    name: "Architecture Castle",
    nameJa: "建築城砦",
    bgGradient: "from-red-950 via-stone-900 to-red-900",
    tileColor: "#2a1515",
    tileBorder: "#4a2020",
    pathColor: "#ef9a9a",
    accentColor: "#EA4335",
    textColor: "#ffcdd2",
    fontClass: "font-pixel",
    ambientEmoji: ["🏰", "⚔️", "🛡"],
    bgPattern: "repeating-linear-gradient(90deg, rgba(234,67,53,0.03) 0px, rgba(234,67,53,0.03) 40px, transparent 40px, transparent 80px)",
    roomColors: {
      locked: "#2a1a1a",
      available: "#b71c1c",
      active: "#c62828",
      cleared: "#4a2020",
    },
  },
  volcano: {
    name: "Data Volcano",
    nameJa: "データ火山",
    bgGradient: "from-orange-950 via-red-900 to-yellow-900",
    tileColor: "#2a1800",
    tileBorder: "#4a2800",
    pathColor: "#ffb74d",
    accentColor: "#FBBC05",
    textColor: "#fff9c4",
    fontClass: "font-pixel",
    ambientEmoji: ["🔥", "🌋", "💎"],
    bgPattern: "radial-gradient(circle at 50% 100%, rgba(251,188,5,0.08) 0%, transparent 60%)",
    roomColors: {
      locked: "#2a2010",
      available: "#e65100",
      active: "#f57f17",
      cleared: "#4a2800",
    },
  },
  ice: {
    name: "ML Ice Lab",
    nameJa: "ML氷結研究所",
    bgGradient: "from-cyan-950 via-teal-900 to-cyan-900",
    tileColor: "#0a2828",
    tileBorder: "#0d3b3b",
    pathColor: "#80cbc4",
    accentColor: "#00897b",
    textColor: "#b2dfdb",
    fontClass: "font-pixel",
    ambientEmoji: ["❄️", "🧊", "💠"],
    bgPattern: "repeating-linear-gradient(135deg, rgba(0,137,123,0.03) 0px, transparent 2px, transparent 20px)",
    roomColors: {
      locked: "#1a2a2a",
      available: "#00695c",
      active: "#00796b",
      cleared: "#0d3b3b",
    },
  },
  ocean: {
    name: "Network Ocean",
    nameJa: "ネットワーク深海",
    bgGradient: "from-blue-950 via-cyan-900 to-blue-900",
    tileColor: "#061a30",
    tileBorder: "#0a2a4a",
    pathColor: "#4dd0e1",
    accentColor: "#0097A7",
    textColor: "#b2ebf2",
    fontClass: "font-pixel",
    ambientEmoji: ["🐚", "🐠", "🫧"],
    bgPattern: "repeating-linear-gradient(0deg, rgba(0,151,167,0.02) 0px, transparent 2px, transparent 30px)",
    roomColors: {
      locked: "#0a1a2a",
      available: "#00838f",
      active: "#0097a7",
      cleared: "#0a2a4a",
    },
  },
  cave: {
    name: "Security Cave",
    nameJa: "セキュリティ洞窟",
    bgGradient: "from-red-950 via-gray-900 to-red-950",
    tileColor: "#1a0e0e",
    tileBorder: "#2a1a1a",
    pathColor: "#ef9a9a",
    accentColor: "#C62828",
    textColor: "#ffcdd2",
    fontClass: "font-pixel",
    ambientEmoji: ["🦇", "🔒", "💀"],
    bgPattern: "radial-gradient(circle at 30% 20%, rgba(198,40,40,0.06) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(198,40,40,0.04) 0%, transparent 40%)",
    roomColors: {
      locked: "#1a1212",
      available: "#b71c1c",
      active: "#c62828",
      cleared: "#2a1a1a",
    },
  },
  sky: {
    name: "Developer Sky City",
    nameJa: "天空都市",
    bgGradient: "from-purple-950 via-indigo-900 to-purple-900",
    tileColor: "#1a0e30",
    tileBorder: "#2a1a4a",
    pathColor: "#ce93d8",
    accentColor: "#7B1FA2",
    textColor: "#e1bee7",
    fontClass: "font-pixel",
    ambientEmoji: ["☁️", "⭐", "🌙"],
    bgPattern: "radial-gradient(circle at 20% 50%, rgba(123,31,162,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(123,31,162,0.04) 0%, transparent 30%)",
    roomColors: {
      locked: "#1a1222",
      available: "#6a1b9a",
      active: "#7b1fa2",
      cleared: "#2a1a4a",
    },
  },
  cyber: {
    name: "Cyber Domain",
    nameJa: "サイバー空間",
    bgGradient: "from-gray-950 via-green-950 to-gray-900",
    tileColor: "#0a120a",
    tileBorder: "#0a1a0a",
    pathColor: "#00e676",
    accentColor: "#00e676",
    textColor: "#b9f6ca",
    fontClass: "font-pixel",
    ambientEmoji: ["💻", "🔮", "📡"],
    bgPattern: "linear-gradient(rgba(0,230,118,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.02) 1px, transparent 1px)",
    roomColors: {
      locked: "#121a12",
      available: "#1b5e20",
      active: "#2e7d32",
      cleared: "#0a1a0a",
    },
  },
}
