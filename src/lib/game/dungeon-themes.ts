import type { DungeonTheme } from "@/lib/types/dungeon"

export interface ThemeConfig {
  name: string
  nameJa: string
  /** MC biome name for flavor */
  biome: string
  bgGradient: string
  tileColor: string
  tileBorder: string
  /** 3D bevel highlight (top-left edge) */
  bevelLight: string
  /** 3D bevel shadow (bottom-right edge) */
  bevelDark: string
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

/**
 * Minecraft-biome-inspired dungeon themes.
 *
 * Design principles:
 * - No rounded corners — everything is blocky/pixelated
 * - 3D bevel on all panels (bevelLight top-left, bevelDark bottom-right)
 * - Dark UI chrome with colored accents
 * - Biome-specific color grading (grass, water, fog tones)
 * - Inventory-slot gray (#8B8B8B) as base neutral
 */
export const DUNGEON_THEMES: Record<DungeonTheme, ThemeConfig> = {
  // ── Plains / Forest  ─────────────────────────────────
  forest: {
    name: "Plains Biome",
    nameJa: "草原バイオーム",
    biome: "plains",
    bgGradient: "from-green-950 via-green-900 to-emerald-950",
    tileColor: "#2D2B1E",         // dirt-brown background
    tileBorder: "#4A4630",        // darker dirt edge
    bevelLight: "#5C5840",
    bevelDark: "#1A1810",
    pathColor: "#91BD59",         // MC plains grass
    accentColor: "#91BD59",
    textColor: "#D4E6B0",
    fontClass: "font-pixel",
    ambientEmoji: ["🌿", "🌱", "🐑"],
    bgPattern: "repeating-conic-gradient(#2D2B1E 0% 25%, #333022 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#1A1810",          // deep dark dirt
      available: "#4E6B28",       // grass-block green
      active: "#5C8030",
      cleared: "#33302A",         // faded dirt
    },
  },

  // ── Deep Dark (Sculk) ────────────────────────────────
  tech: {
    name: "Deep Dark",
    nameJa: "ディープダーク",
    biome: "deep_dark",
    bgGradient: "from-slate-950 via-cyan-950 to-slate-950",
    tileColor: "#0C1D26",         // sculk dark teal
    tileBorder: "#1A3040",
    bevelLight: "#1E4050",
    bevelDark: "#060E14",
    pathColor: "#09404F",         // sculk vein
    accentColor: "#00BCD4",       // sculk sensor cyan glow
    textColor: "#B2EBF2",
    fontClass: "font-pixel",
    ambientEmoji: ["💠", "🔮", "🕯"],
    bgPattern: "repeating-conic-gradient(#0C1D26 0% 25%, #0E2230 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#060E14",
      available: "#0D4854",
      active: "#0E5666",
      cleared: "#0A2028",
    },
  },

  // ── Badlands (Mesa) ──────────────────────────────────
  castle: {
    name: "Badlands",
    nameJa: "荒野バイオーム",
    biome: "badlands",
    bgGradient: "from-orange-950 via-red-950 to-orange-950",
    tileColor: "#6B3A2A",         // terracotta brown-red
    tileBorder: "#8B4A30",
    bevelLight: "#9E5A3C",
    bevelDark: "#3A1E14",
    pathColor: "#C67A50",         // orange terracotta
    accentColor: "#E07040",       // terracotta accent
    textColor: "#FFDAC1",
    fontClass: "font-pixel",
    ambientEmoji: ["🏜", "🌵", "💀"],
    bgPattern: "repeating-conic-gradient(#6B3A2A 0% 25%, #704030 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#3A1E14",
      available: "#A04828",
      active: "#B85530",
      cleared: "#5A3020",
    },
  },

  // ── Nether Wastes ────────────────────────────────────
  volcano: {
    name: "Nether Wastes",
    nameJa: "ネザー荒地",
    biome: "nether_wastes",
    bgGradient: "from-red-950 via-red-900 to-orange-950",
    tileColor: "#3A1515",         // netherrack dark
    tileBorder: "#6F3535",
    bevelLight: "#8B4545",
    bevelDark: "#1E0A0A",
    pathColor: "#FF6600",         // lava glow
    accentColor: "#FF6600",
    textColor: "#FFCCAA",
    fontClass: "font-pixel",
    ambientEmoji: ["🔥", "🌋", "👹"],
    bgPattern: "repeating-conic-gradient(#3A1515 0% 25%, #401818 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#1E0A0A",
      available: "#8B2500",
      active: "#A03000",
      cleared: "#4A1A1A",
    },
  },

  // ── Ice Spikes ───────────────────────────────────────
  ice: {
    name: "Ice Spikes",
    nameJa: "氷樹バイオーム",
    biome: "ice_spikes",
    bgGradient: "from-cyan-950 via-blue-950 to-cyan-950",
    tileColor: "#1A2A3A",         // packed ice dark
    tileBorder: "#2A4050",
    bevelLight: "#3A5868",
    bevelDark: "#0E1820",
    pathColor: "#91BDFF",         // ice blue
    accentColor: "#64B5F6",       // blue ice glow
    textColor: "#D0E8FF",
    fontClass: "font-pixel",
    ambientEmoji: ["❄️", "🧊", "⛄"],
    bgPattern: "repeating-conic-gradient(#1A2A3A 0% 25%, #1E3040 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#0E1820",
      available: "#2A5070",
      active: "#306080",
      cleared: "#1A2838",
    },
  },

  // ── Deep Ocean ───────────────────────────────────────
  ocean: {
    name: "Deep Ocean",
    nameJa: "深海バイオーム",
    biome: "deep_ocean",
    bgGradient: "from-blue-950 via-blue-900 to-cyan-950",
    tileColor: "#0A1830",         // deep ocean dark
    tileBorder: "#142A4A",
    bevelLight: "#1E3A5A",
    bevelDark: "#050C18",
    pathColor: "#4DD0E1",         // prismarine
    accentColor: "#26A69A",       // prismarine accent
    textColor: "#B2DFDB",
    fontClass: "font-pixel",
    ambientEmoji: ["🐠", "🫧", "🐙"],
    bgPattern: "repeating-conic-gradient(#0A1830 0% 25%, #0C1E38 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#050C18",
      available: "#0D4F5F",
      active: "#0E6070",
      cleared: "#0A2030",
    },
  },

  // ── Crimson Forest (Nether) ──────────────────────────
  cave: {
    name: "Crimson Forest",
    nameJa: "真紅の森",
    biome: "crimson_forest",
    bgGradient: "from-red-950 via-rose-950 to-red-950",
    tileColor: "#2A0E0E",         // crimson nylium dark
    tileBorder: "#4A1818",
    bevelLight: "#6A2020",
    bevelDark: "#140808",
    pathColor: "#BD3030",         // crimson nylium
    accentColor: "#EF5350",       // bright crimson
    textColor: "#FFCDD2",
    fontClass: "font-pixel",
    ambientEmoji: ["🍄", "🦇", "🔴"],
    bgPattern: "repeating-conic-gradient(#2A0E0E 0% 25%, #301212 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#140808",
      available: "#8B1A1A",
      active: "#A02020",
      cleared: "#3A1010",
    },
  },

  // ── The End ──────────────────────────────────────────
  sky: {
    name: "The End",
    nameJa: "ジ・エンド",
    biome: "the_end",
    bgGradient: "from-purple-950 via-gray-950 to-purple-950",
    tileColor: "#1A0E30",         // end void purple
    tileBorder: "#2A1A4A",
    bevelLight: "#3A2860",
    bevelDark: "#0E0618",
    pathColor: "#CE93D8",         // end gateway beam
    accentColor: "#AB47BC",       // ender purple
    textColor: "#E1BEE7",
    fontClass: "font-pixel",
    ambientEmoji: ["🐉", "⭐", "🔮"],
    bgPattern: "repeating-conic-gradient(#1A0E30 0% 25%, #1E1238 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#0E0618",
      available: "#5E2880",
      active: "#6E3090",
      cleared: "#201638",
    },
  },

  // ── Warped Forest (Nether) ───────────────────────────
  cyber: {
    name: "Warped Forest",
    nameJa: "歪んだ森",
    biome: "warped_forest",
    bgGradient: "from-teal-950 via-cyan-950 to-teal-950",
    tileColor: "#0A1A18",         // warped nylium dark
    tileBorder: "#143830",
    bevelLight: "#1E5048",
    bevelDark: "#040E0C",
    pathColor: "#2BFFDA",         // warped particle
    accentColor: "#00E676",       // warped glow
    textColor: "#A7FFEB",
    fontClass: "font-pixel",
    ambientEmoji: ["🍄", "💚", "👾"],
    bgPattern: "repeating-conic-gradient(#0A1A18 0% 25%, #0E201E 0% 50%) 0 0 / 8px 8px",
    roomColors: {
      locked: "#040E0C",
      available: "#0D5040",
      active: "#0E6050",
      cleared: "#0A2820",
    },
  },
}
