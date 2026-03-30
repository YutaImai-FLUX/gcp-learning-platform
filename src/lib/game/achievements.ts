import type { AchievementDef, GameState } from "@/lib/stores/types"

function totalModuleSections(state: GameState): number {
  return Object.values(state.certProgress).reduce(
    (sum, cp) => sum + (cp?.completedModuleSectionIds.length ?? 0), 0
  )
}

function totalLabsCompleted(state: GameState): number {
  return Object.values(state.certProgress).reduce(
    (sum, cp) => sum + (cp?.completedLabIds.length ?? 0), 0
  )
}

function totalDemosUsed(state: GameState): number {
  return Object.keys(state.demoCompletions).length
}

function uniqueQuizCerts(state: GameState): number {
  return new Set(state.quizHistory.map((q) => q.certId)).size
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ─── Milestone ───
  {
    id: "first-quiz",
    nameJa: "初めての挑戦",
    descriptionJa: "初めてクイズに回答した",
    icon: "Zap",
    category: "milestone",
    xpReward: 20,
    condition: (s) => s.quizHistory.length >= 1,
  },
  {
    id: "first-module",
    nameJa: "学習の第一歩",
    descriptionJa: "初めてモジュールセクションを完了した",
    icon: "BookOpen",
    category: "milestone",
    xpReward: 20,
    condition: (s) => totalModuleSections(s) >= 1,
  },
  {
    id: "first-lab",
    nameJa: "ハンズオンデビュー",
    descriptionJa: "初めてラボを完了した",
    icon: "FlaskConical",
    category: "milestone",
    xpReward: 20,
    condition: (s) => totalLabsCompleted(s) >= 1,
  },
  {
    id: "first-demo",
    nameJa: "体験開始",
    descriptionJa: "初めてデモを操作した",
    icon: "PlayCircle",
    category: "milestone",
    xpReward: 20,
    condition: (s) => totalDemosUsed(s) >= 1,
  },
  {
    id: "level-5",
    nameJa: "見習い冒険者",
    descriptionJa: "レベル5に到達した",
    icon: "Star",
    category: "milestone",
    xpReward: 50,
    condition: (s) => s.level >= 5,
  },
  {
    id: "level-10",
    nameJa: "CDLへの道",
    descriptionJa: "レベル10に到達。CDL受験の準備完了！",
    icon: "Award",
    category: "milestone",
    xpReward: 100,
    condition: (s) => s.level >= 10,
  },
  {
    id: "level-20",
    nameJa: "ACEへの道",
    descriptionJa: "レベル20に到達。ACE受験の準備完了！",
    icon: "Trophy",
    category: "milestone",
    xpReward: 200,
    condition: (s) => s.level >= 20,
  },
  {
    id: "level-30",
    nameJa: "プロフェッショナル",
    descriptionJa: "レベル30に到達。Professional資格に挑戦！",
    icon: "Crown",
    category: "milestone",
    xpReward: 300,
    condition: (s) => s.level >= 30,
  },

  // ─── Streak ───
  {
    id: "streak-3",
    nameJa: "3日連続",
    descriptionJa: "3日連続で学習した",
    icon: "Flame",
    category: "streak",
    xpReward: 30,
    condition: (s) => s.streaks.currentStreak >= 3,
  },
  {
    id: "streak-7",
    nameJa: "1週間の習慣",
    descriptionJa: "7日連続で学習した",
    icon: "Flame",
    category: "streak",
    xpReward: 70,
    condition: (s) => s.streaks.currentStreak >= 7,
  },
  {
    id: "streak-14",
    nameJa: "2週間マスター",
    descriptionJa: "14日連続で学習した",
    icon: "Flame",
    category: "streak",
    xpReward: 140,
    condition: (s) => s.streaks.currentStreak >= 14,
  },
  {
    id: "streak-30",
    nameJa: "鉄人学習者",
    descriptionJa: "30日連続で学習した",
    icon: "Flame",
    category: "streak",
    xpReward: 300,
    condition: (s) => s.streaks.currentStreak >= 30,
  },

  // ─── Explorer ───
  {
    id: "demo-explorer-3",
    nameJa: "デモ探検家",
    descriptionJa: "3つの異なるデモを体験した",
    icon: "Compass",
    category: "explorer",
    xpReward: 30,
    condition: (s) => totalDemosUsed(s) >= 3,
  },
  {
    id: "demo-explorer-7",
    nameJa: "デモマスター",
    descriptionJa: "7つの異なるデモを体験した",
    icon: "Map",
    category: "explorer",
    xpReward: 70,
    condition: (s) => totalDemosUsed(s) >= 7,
  },
  {
    id: "demo-explorer-14",
    nameJa: "全デモ制覇",
    descriptionJa: "全14デモを体験した",
    icon: "Globe",
    category: "explorer",
    xpReward: 200,
    condition: (s) => totalDemosUsed(s) >= 14,
  },
  {
    id: "multi-cert",
    nameJa: "マルチ資格チャレンジャー",
    descriptionJa: "3つ以上の異なる資格のクイズに挑戦した",
    icon: "Layers",
    category: "explorer",
    xpReward: 50,
    condition: (s) => uniqueQuizCerts(s) >= 3,
  },

  // ─── Mastery ───
  {
    id: "quiz-10",
    nameJa: "クイズ10問",
    descriptionJa: "累計10問のクイズに回答した",
    icon: "Target",
    category: "mastery",
    xpReward: 30,
    condition: (s) => s.quizHistory.length >= 10,
  },
  {
    id: "quiz-50",
    nameJa: "クイズ50問",
    descriptionJa: "累計50問のクイズに回答した",
    icon: "Target",
    category: "mastery",
    xpReward: 100,
    condition: (s) => s.quizHistory.length >= 50,
  },
  {
    id: "quiz-100",
    nameJa: "クイズマスター",
    descriptionJa: "累計100問のクイズに回答した",
    icon: "Target",
    category: "mastery",
    xpReward: 200,
    condition: (s) => s.quizHistory.length >= 100,
  },
  {
    id: "perfect-practice",
    nameJa: "パーフェクト",
    descriptionJa: "クイズで90%以上のスコアを取得した",
    icon: "CheckCircle",
    category: "mastery",
    xpReward: 50,
    condition: (s) => {
      const cps = Object.values(s.certProgress)
      return cps.some((cp) => cp && cp.quizHighScore >= 90)
    },
  },
  {
    id: "module-10",
    nameJa: "知識の蓄積",
    descriptionJa: "10セクションのモジュールを学習した",
    icon: "BookOpen",
    category: "mastery",
    xpReward: 50,
    condition: (s) => totalModuleSections(s) >= 10,
  },
  {
    id: "lab-5",
    nameJa: "ラボ職人",
    descriptionJa: "5つのラボを完了した",
    icon: "FlaskConical",
    category: "mastery",
    xpReward: 100,
    condition: (s) => totalLabsCompleted(s) >= 5,
  },

  // ─── Specialist ───
  {
    id: "security-specialist",
    nameJa: "セキュリティスペシャリスト",
    descriptionJa: "セキュリティ系デモ5種を全て体験した",
    icon: "Shield",
    category: "specialist",
    xpReward: 100,
    condition: (s) => {
      const securityDemos = ["iam", "vpc-firewall", "service-accounts", "org-policy", "audit-logs"]
      return securityDemos.every((id) => id in s.demoCompletions)
    },
  },
  {
    id: "compute-specialist",
    nameJa: "コンピュートスペシャリスト",
    descriptionJa: "コンピュート系デモを全て体験した",
    icon: "Server",
    category: "specialist",
    xpReward: 100,
    condition: (s) => {
      const computeDemos = ["gce", "cloud-run", "gke", "cloud-functions"]
      return computeDemos.every((id) => id in s.demoCompletions)
    },
  },
  {
    id: "data-specialist",
    nameJa: "データスペシャリスト",
    descriptionJa: "データ分析系デモを全て体験した",
    icon: "BarChart3",
    category: "specialist",
    xpReward: 100,
    condition: (s) => {
      const dataDemos = ["bigquery", "pubsub", "gcs"]
      return dataDemos.every((id) => id in s.demoCompletions)
    },
  },
  {
    id: "ai-specialist",
    nameJa: "AIスペシャリスト",
    descriptionJa: "AI/ML系デモを全て体験した",
    icon: "Brain",
    category: "specialist",
    xpReward: 100,
    condition: (s) => {
      const aiDemos = ["vertex-ai", "adk"]
      return aiDemos.every((id) => id in s.demoCompletions)
    },
  },
]

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
