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
    tileColor: "#2d5a27",
    tileBorder: "#3a7a32",
    pathColor: "#6b8f63",
    accentColor: "#34A853",
    textColor: "#c8e6c9",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#4a5a46",
      available: "#34A853",
      active: "#66bb6a",
      cleared: "#a5d6a7",
    },
  },
  tech: {
    name: "Tech Laboratory",
    nameJa: "テックラボ",
    bgGradient: "from-slate-900 via-blue-900 to-slate-800",
    tileColor: "#1a2744",
    tileBorder: "#2a4070",
    pathColor: "#4285F4",
    accentColor: "#4285F4",
    textColor: "#bbdefb",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#37474f",
      available: "#4285F4",
      active: "#64b5f6",
      cleared: "#90caf9",
    },
  },
  castle: {
    name: "Architecture Castle",
    nameJa: "建築城砦",
    bgGradient: "from-red-950 via-stone-900 to-red-900",
    tileColor: "#4a2020",
    tileBorder: "#6d3030",
    pathColor: "#ef9a9a",
    accentColor: "#EA4335",
    textColor: "#ffcdd2",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#5d4037",
      available: "#EA4335",
      active: "#ef5350",
      cleared: "#ef9a9a",
    },
  },
  volcano: {
    name: "Data Volcano",
    nameJa: "データ火山",
    bgGradient: "from-orange-950 via-red-900 to-yellow-900",
    tileColor: "#4a2800",
    tileBorder: "#6d3d00",
    pathColor: "#ffb74d",
    accentColor: "#FBBC05",
    textColor: "#fff9c4",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#5d4037",
      available: "#FBBC05",
      active: "#fdd835",
      cleared: "#fff59d",
    },
  },
  ice: {
    name: "ML Ice Lab",
    nameJa: "ML氷結研究所",
    bgGradient: "from-cyan-950 via-teal-900 to-cyan-900",
    tileColor: "#0d3b3b",
    tileBorder: "#1a5555",
    pathColor: "#80cbc4",
    accentColor: "#00897b",
    textColor: "#b2dfdb",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#37474f",
      available: "#00897b",
      active: "#26a69a",
      cleared: "#80cbc4",
    },
  },
  ocean: {
    name: "Network Ocean",
    nameJa: "ネットワーク深海",
    bgGradient: "from-blue-950 via-cyan-900 to-blue-900",
    tileColor: "#0a2a4a",
    tileBorder: "#0d4070",
    pathColor: "#4dd0e1",
    accentColor: "#0097A7",
    textColor: "#b2ebf2",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#37474f",
      available: "#0097A7",
      active: "#00bcd4",
      cleared: "#80deea",
    },
  },
  cave: {
    name: "Security Cave",
    nameJa: "セキュリティ暗号洞窟",
    bgGradient: "from-red-950 via-gray-900 to-red-950",
    tileColor: "#2a1a1a",
    tileBorder: "#4a2020",
    pathColor: "#ef9a9a",
    accentColor: "#C62828",
    textColor: "#ffcdd2",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#424242",
      available: "#C62828",
      active: "#e53935",
      cleared: "#ef9a9a",
    },
  },
  sky: {
    name: "Developer Sky City",
    nameJa: "デベロッパー天空都市",
    bgGradient: "from-purple-950 via-indigo-900 to-purple-900",
    tileColor: "#2a1a4a",
    tileBorder: "#3d2070",
    pathColor: "#ce93d8",
    accentColor: "#7B1FA2",
    textColor: "#e1bee7",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#424242",
      available: "#7B1FA2",
      active: "#9c27b0",
      cleared: "#ce93d8",
    },
  },
  cyber: {
    name: "Cyber Domain",
    nameJa: "サイバー空間",
    bgGradient: "from-gray-950 via-green-950 to-gray-900",
    tileColor: "#0a1a0a",
    tileBorder: "#1a3a1a",
    pathColor: "#00e676",
    accentColor: "#00e676",
    textColor: "#b9f6ca",
    fontClass: "font-pixel",
    roomColors: {
      locked: "#424242",
      available: "#00e676",
      active: "#69f0ae",
      cleared: "#b9f6ca",
    },
  },
}
