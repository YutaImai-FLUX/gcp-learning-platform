import type { Industry, ProjectScale, Requirement } from "@/lib/types/proposal"

export const REQUIREMENTS_META: Record<Requirement, { label: string; icon: string; description: string }> = {
  "realtime-analytics":    { label: "リアルタイム分析",     icon: "Activity",       description: "ストリーミングデータのリアルタイム分析・可視化" },
  "ml-prediction":         { label: "ML/AI 予測",          icon: "Brain",          description: "機械学習モデルによる予測・分類・推薦" },
  "batch-processing":      { label: "バッチ処理",          icon: "Clock",          description: "大量データの定期的なバッチ処理" },
  "api-backend":           { label: "APIバックエンド",     icon: "Server",         description: "REST/gRPC APIサーバーの構築" },
  "web-app":               { label: "Webアプリケーション", icon: "Globe",          description: "フロントエンド+バックエンドのWebアプリ" },
  "mobile-backend":        { label: "モバイルバックエンド", icon: "Smartphone",    description: "モバイルアプリ向けBaaS/API" },
  "iot":                   { label: "IoTデータ収集",       icon: "Radio",          description: "IoTデバイスからのデータ収集・処理" },
  "data-warehouse":        { label: "データウェアハウス",   icon: "Database",       description: "大規模データの蓄積・SQL分析" },
  "ci-cd":                 { label: "CI/CD パイプライン",  icon: "GitBranch",      description: "継続的インテグレーション・デリバリー" },
  "microservices":         { label: "マイクロサービス",     icon: "Boxes",          description: "疎結合なマイクロサービスアーキテクチャ" },
  "serverless":            { label: "サーバーレス",         icon: "Zap",            description: "サーバー管理不要のイベント駆動処理" },
  "hybrid-cloud":          { label: "ハイブリッドクラウド", icon: "Cloud",          description: "オンプレミスとクラウドの統合" },
  "high-availability":     { label: "高可用性・DR",        icon: "Shield",         description: "マルチリージョン・災害復旧対策" },
  "security-compliance":   { label: "セキュリティ・準拠",  icon: "Lock",           description: "セキュリティ強化・コンプライアンス対応" },
  "content-delivery":      { label: "コンテンツ配信",      icon: "Wifi",           description: "CDN・メディア配信の高速化" },
  "event-driven":          { label: "イベント駆動",        icon: "Bell",           description: "イベントトリガーの非同期処理" },
  "genai-rag":             { label: "生成AI / RAG",        icon: "Sparkles",       description: "RAGベースの生成AIアプリケーション" },
  "multi-agent":           { label: "マルチエージェント",   icon: "Users",          description: "AIエージェント協調による自動化" },
}

export const INDUSTRY_META: Record<Industry, { label: string; icon: string }> = {
  retail:         { label: "小売・EC",         icon: "ShoppingCart" },
  finance:        { label: "金融・保険",       icon: "Landmark" },
  healthcare:     { label: "ヘルスケア・医療", icon: "Heart" },
  manufacturing:  { label: "製造業",           icon: "Factory" },
  media:          { label: "メディア・エンタメ", icon: "Film" },
  education:      { label: "教育・EdTech",     icon: "GraduationCap" },
  government:     { label: "官公庁・公共",     icon: "Building2" },
  startup:        { label: "スタートアップ",   icon: "Rocket" },
  gaming:         { label: "ゲーム",           icon: "Gamepad2" },
}

export const SCALE_META: Record<ProjectScale, { label: string; users: string; description: string }> = {
  small:      { label: "スモール",       users: "〜1万ユーザー",     description: "小規模プロジェクト・PoC" },
  medium:     { label: "ミディアム",     users: "1万〜10万ユーザー", description: "中規模サービス" },
  large:      { label: "ラージ",         users: "10万〜100万ユーザー", description: "大規模本番サービス" },
  enterprise: { label: "エンタープライズ", users: "100万ユーザー以上",  description: "ミッションクリティカル" },
}

export const BUDGET_META: Record<string, { label: string; range: string }> = {
  low:    { label: "抑えたい",   range: "〜$3,000/月" },
  medium: { label: "標準",       range: "$3,000〜$15,000/月" },
  high:   { label: "投資型",     range: "$15,000+/月" },
}
