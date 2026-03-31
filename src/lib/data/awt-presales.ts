// AWT (Agentic Workplace Transformation) プリセールス指南書データ
// NTTデータ様向けプリセールス活動用コンテンツ

export interface AWTSection {
  id: string
  title: string
  subtitle: string
  icon: string // lucide icon name reference
  color: string
}

export interface MarketROI {
  industry: string
  stat: string
  detail: string
  useCases: string[]
}

export interface ArchitectureLayer {
  id: string
  label: string
  role: string
  color: string
  description: string
  components: string[]
  examples: string[]
}

export interface DevTier {
  id: string
  label: string
  target: string
  codeLevel: "no-code" | "low-code" | "high-code"
  color: string
  tools: { name: string; description: string }[]
  example: string
}

export interface SecurityFeature {
  id: string
  name: string
  description: string
  detail: string
  icon: string
}

export interface SalesMotion {
  id: string
  label: string
  description: string
}

export interface AWTQuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface AIModelFeature {
  id: string
  name: string
  description: string
  category: "model" | "ux" | "personalization"
}

export interface DataIntegration {
  id: string
  name: string
  description: string
  detail: string
}

export interface PrebuiltAgent {
  id: string
  name: string
  description: string
  highlight: string
}

export interface BeforeAfterCase {
  id: string
  department: string
  color: string
  before: string
  after: string
}

export interface ObservabilityFeature {
  id: string
  name: string
  description: string
  metrics: string[]
}

// ─── Sections ───
export const AWT_SECTIONS: AWTSection[] = [
  {
    id: "executive",
    title: "エグゼクティブ・サマリー",
    subtitle: "AWTとは何か？",
    icon: "Briefcase",
    color: "#4285F4",
  },
  {
    id: "value",
    title: "クライアント提供価値",
    subtitle: "市場のパラダイムシフトとROI",
    icon: "TrendingUp",
    color: "#34A853",
  },
  {
    id: "architecture",
    title: "コア・アーキテクチャ",
    subtitle: "統合3レイヤー構造",
    icon: "Layers",
    color: "#886FBF",
  },
  {
    id: "democratization",
    title: "開発の民主化",
    subtitle: "全社員がエージェントを活用・構築",
    icon: "Users",
    color: "#EA4335",
  },
  {
    id: "models",
    title: "最新AIモデル & UX",
    subtitle: "AWTを駆動するエンジンと新体験",
    icon: "Cpu",
    color: "#E040FB",
  },
  {
    id: "data-integration",
    title: "データ連携と拡張性",
    subtitle: "AWTの\"頭脳\"を支える仕組み",
    icon: "Database",
    color: "#00BCD4",
  },
  {
    id: "prebuilt",
    title: "プリビルドAgent",
    subtitle: "すぐに使えるGoogle製エージェント",
    icon: "Bot",
    color: "#FF7043",
  },
  {
    id: "use-cases",
    title: "導入効果 Before/After",
    subtitle: "業務別の具体的な変革イメージ",
    icon: "ArrowLeftRight",
    color: "#66BB6A",
  },
  {
    id: "security",
    title: "セキュリティ & 運用監視",
    subtitle: "エンタープライズ水準の保護と可観測性",
    icon: "Shield",
    color: "#FBBC05",
  },
  {
    id: "sales",
    title: "セールスモーション",
    subtitle: "提案に向けた実践フレームワーク",
    icon: "Target",
    color: "#4285F4",
  },
]

// ─── Executive Summary ───
export const EXECUTIVE_SUMMARY = {
  headline: "Agentic Workplace Transformation (AWT)",
  tagline:
    "個人の生産性向上と全社横断のビジネスプロセス自動化を統合し、「Multiplier Effect（相乗効果）」を生み出す",
  keyPoints: [
    {
      label: "AIの進化",
      text: "単なる「チャットボット」から、自律的に問題を解決する「エージェント主導の職場」へ",
    },
    {
      label: "統合の力",
      text: "Google Workspace（個人生産性）+ Gemini Enterprise（全社自動化）の相乗効果",
    },
    {
      label: "コンテキスト重視",
      text: "AIエージェントの価値は、モデルの賢さだけでなく「アクセスできるコンテキストの有効性」で決まる",
    },
  ],
  multiplierFormula: {
    left: "Google Workspace",
    operator: "×",
    right: "Gemini Enterprise",
    result: "Multiplier Effect",
  },
} as const

// ─── Market ROI ───
export const MARKET_ROI: MarketROI[] = [
  {
    industry: "金融サービス業界",
    stat: "経営幹部の53%がAIエージェントを本番導入済み",
    detail:
      "49%が将来のAI予算の半分以上をエージェントに割り当て予定",
    useCases: ["不正行為の管理・検出", "顧客サービス", "リスク管理"],
  },
  {
    industry: "メディア・エンターテインメント業界",
    stat: "幹部の54%がAIエージェントを活用中",
    detail: "コンテンツ制作から配信までのワークフロー自動化が加速",
    useCases: ["セキュリティ運用", "マーケティング", "コンテンツ最適化"],
  },
]

export const CONTEXT_SILO_PROBLEM = {
  before: {
    label: "従来：コンテキストのサイロ化",
    description:
      "ツールごとに分断された状態。各システムが独立しており、情報の統合に手動作業が必要",
    items: ["メール", "ドキュメント", "CRM", "ERP", "チャット"],
  },
  after: {
    label: "AWT：統合コンテキスト",
    description:
      "企業全体の文脈を理解した自律的な自動化。AIエージェントがシステム横断で情報を統合",
    items: [
      "統合検索",
      "自動ワークフロー",
      "クロスシステム分析",
      "インテリジェント通知",
    ],
  },
} as const

// ─── Architecture Layers ───
export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "user",
    label: "ユーザー レイヤー",
    role: "Google Workspace",
    color: "#4285F4",
    description:
      "従業員が日常業務を行うインターフェース。ツールに組み込まれたGeminiが個人のタスクを自動化",
    components: [
      "Gmail",
      "Google Docs",
      "Google Sheets",
      "Google Slides",
      "Google Meet",
      "Google Chat",
      "Google Drive",
      "Google Calendar",
    ],
    examples: [
      "メール返信の自動下書き",
      "会議の要約・アクションアイテム抽出",
      "ドキュメントの自動要約・翻訳",
    ],
  },
  {
    id: "agent",
    label: "エージェント レイヤー",
    role: "Gemini Enterprise",
    color: "#886FBF",
    description:
      "組織の中枢神経として機能。複数のAIエージェントをオーケストレーションし、複雑な業務を自動実行",
    components: [
      "AI Assistant",
      "Agent Designer",
      "ADK (Agent Development Kit)",
      "Agent Gallery",
      "NotebookLM",
      "Deep Research",
    ],
    examples: [
      "部門横断の承認フロー自動化",
      "複数データソースからのレポート生成",
      "インシデント対応のオーケストレーション",
    ],
  },
  {
    id: "data",
    label: "データ レイヤー",
    role: "Google Cloud / 3rd Party",
    color: "#34A853",
    description:
      "Salesforce、SAP、ServiceNowなどの外部システムや社内データベースと連携し、サイロ化されたデータソースを統合",
    components: [
      "BigQuery",
      "Cloud Storage",
      "Vertex AI",
      "Salesforce連携",
      "SAP連携",
      "ServiceNow連携",
    ],
    examples: [
      "CRM + ERPデータの統合分析",
      "リアルタイムダッシュボード生成",
      "データパイプラインの自動構築",
    ],
  },
]

// ─── Development Democratization ───
export const DEV_TIERS: DevTier[] = [
  {
    id: "no-code",
    label: "ノーコード",
    target: "ビジネスユーザー",
    codeLevel: "no-code",
    color: "#4285F4",
    tools: [
      {
        name: "Workspace Studio",
        description:
          "GmailやDocsなどにネイティブに組み込まれたフローを自然言語で構築",
      },
    ],
    example:
      "「毎週の会議後にアクションアイテムを抽出し、翻訳してスペースに投稿する」",
  },
  {
    id: "low-code",
    label: "ローコード",
    target: "業務プロフェッショナル",
    codeLevel: "low-code",
    color: "#FBBC05",
    tools: [
      {
        name: "Agent Designer",
        description:
          "自然言語やビジュアルエディターで複雑なマルチステップのワークフローを持つエージェントを構築・管理",
      },
    ],
    example:
      "顧客問い合わせの自動トリアージ → 担当者アサイン → フォローアップ",
  },
  {
    id: "high-code",
    label: "ハイコード",
    target: "エンジニア",
    codeLevel: "high-code",
    color: "#EA4335",
    tools: [
      {
        name: "Agent Development Kit (ADK)",
        description:
          "柔軟なフレームワークでカスタムエージェントを開発し、Agent Engine上にデプロイ",
      },
      {
        name: "Antigravity",
        description:
          "Googleが開発したエージェント型IDE。Agent Managerで数十のエージェントを俯瞰して管理・監視",
      },
    ],
    example: "社内データ統合エージェント + 外部API連携パイプライン構築",
  },
]

// ─── Security Features ───
export const SECURITY_FEATURES: SecurityFeature[] = [
  {
    id: "model-armor",
    name: "Model Armor",
    description:
      "プロンプトインジェクションや脱獄からシステムを保護し、悪意のあるコンテンツをフィルタリング",
    detail:
      "入力と出力の両方をリアルタイムで検査し、ポリシー違反を自動ブロック",
    icon: "ShieldCheck",
  },
  {
    id: "dlp",
    name: "Data Loss Prevention (DLP)",
    description:
      "クレジットカード番号などの機密情報（PII）を検出し、自動的にマスクしてデータ漏洩を防止",
    detail:
      "ユーザーに表示される前にリアルタイムで機密データをフィルタリング",
    icon: "Lock",
  },
  {
    id: "iam",
    name: "厳密なアクセス制御 (IAM/PoLP)",
    description:
      "最小権限の原則（PoLP）を徹底し、既存のコーポレートIAMルールを適用",
    detail:
      "エージェントやデータストアへのアクセスを細粒度で制御。VPC Service Controls対応",
    icon: "Key",
  },
  {
    id: "cmek",
    name: "顧客管理暗号鍵 (CMEK)",
    description: "顧客自身の暗号鍵でデータを暗号化し、データ主権を確保",
    detail:
      "Cloud KMSと連携し、鍵のローテーション・アクセス監査を完全に顧客側で管理",
    icon: "KeyRound",
  },
]

// ─── Sales Motion ───
export const SALES_MOTIONS: SalesMotion[] = [
  {
    id: "joint-pitch",
    label: "ジョイントピッチ",
    description:
      "AWT（Gemini Enterprise + Google Workspace）の統合価値を訴求。個人生産性 × 全社自動化の相乗効果をデモで実演",
  },
  {
    id: "objection-handling",
    label: "オブジェクション・ハンドリング",
    description:
      "「4つのAフレームワーク」を活用して顧客の懸念を関係構築の機会に転換",
  },
]

export const FOUR_A_FRAMEWORK = [
  {
    letter: "A",
    word: "Anticipate",
    label: "予測する",
    description: "顧客が抱く可能性のある懸念を事前に洗い出し、回答を準備する",
    color: "#4285F4",
  },
  {
    letter: "A",
    word: "Acknowledge",
    label: "受け止める",
    description:
      "顧客の懸念を否定せず、まず「おっしゃる通りです」と受け止めて信頼を構築する",
    color: "#34A853",
  },
  {
    letter: "A",
    word: "Ask",
    label: "深掘りする",
    description:
      "「具体的にどのような場面でご懸念ですか？」と質問し、真のニーズを引き出す",
    color: "#FBBC05",
  },
  {
    letter: "A",
    word: "Answer",
    label: "回答する",
    description:
      "顧客の文脈に合わせた具体的な回答・事例・データで懸念を解消する",
    color: "#EA4335",
  },
] as const

// ─── AI Models & New UX (追加要素1) ───
export const AI_MODEL_FEATURES: AIModelFeature[] = [
  {
    id: "gemini-pro",
    name: "Gemini 3.1 Pro",
    description:
      "高度な推論能力を持つ最新フラッグシップモデル。複雑な業務判断や分析タスクを高精度に処理",
    category: "model",
  },
  {
    id: "nano-banana",
    name: "Gemini 3.1 Pro Image (Nano Banana)",
    description:
      "最高品質の画像生成・編集モデル。テキスト以外のクリエイティブな業務も自動化",
    category: "model",
  },
  {
    id: "veo",
    name: "Veo 3.1",
    description:
      "高品質な動画生成モデル。マーケティング素材やトレーニング動画の自動生成に活用",
    category: "model",
  },
  {
    id: "canvas",
    name: "Canvas Mode（キャンバスモード）",
    description:
      "Docs / Slides / Sheets上で、AIと対話しながらインタラクティブにコンテンツを生成・編集できる新機能",
    category: "ux",
  },
  {
    id: "personalization",
    name: "パーソナライゼーション & 音声操作",
    description:
      "ユーザーの好み（保存・破棄の指示）を記憶し、モバイル・デスクトップでハンズフリーな音声対話を提供",
    category: "personalization",
  },
]

// ─── Data Integration (追加要素2) ───
export const DATA_INTEGRATIONS: DataIntegration[] = [
  {
    id: "federated",
    name: "連携コネクタ（Federated）",
    description:
      "データのコピーを持たずリアルタイムに情報を取得。セキュリティと鮮度を両立",
    detail:
      "取り込みコネクタとの使い分けにより、アクセス権限（ACL）ごとデータをインデックス化し、検索精度とセキュリティを両立",
  },
  {
    id: "byo-mcp",
    name: "BYO-MCP (Bring Your Own MCP)",
    description:
      "独自のMCP（Model Context Protocol）サーバーを持ち込み、Geminiと統合",
    detail:
      "企業固有のシステムをエージェントのワークフローに組み込むことが可能。A2Aプロトコルにも対応",
  },
  {
    id: "api-integration",
    name: "高度なAPI連携 (Apigee / Application Integration)",
    description:
      "既存のビジネスオペレーション（ERP等）を安全かつ確実にエージェントから実行",
    detail:
      "Apigee APIゲートウェイとApplication Integrationを活用し、ハイコードエージェントの業務システム連携を実現",
  },
]

// ─── Prebuilt Agents (追加要素3) ───
export const PREBUILT_AGENTS: PrebuiltAgent[] = [
  {
    id: "deep-research",
    name: "Deep Research Agent",
    description:
      "ウェブや社内ソースから情報を統合し、複雑で多段階にわたる調査・分析を自律的に遂行",
    highlight: "引用付きの詳細なレポートを自動作成",
  },
  {
    id: "idea-generation",
    name: "Idea Generation Agent",
    description:
      "特定のトピックに対してアイデアを継続的に生成し、多角的な評価を実行",
    highlight: "トーナメント形式でアイデアをランク付け",
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    description:
      "コンプライアンスに対応した状態でGemini Enterpriseに組み込み済み",
    highlight:
      "アップロードしたカスタムドキュメント（提案依頼書など）に特化した回答・要約を取得",
  },
]

// ─── Before / After Use Cases (追加要素4) ───
export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: "cs",
    department: "カスタマーサポート",
    color: "#4285F4",
    before:
      "各オペレータが別々のデータ（顧客DB、FAQなど）を参照。情報の統合に時間がかかり、対応品質にばらつき",
    after:
      "AIがフロントから基盤までを繋ぎ、通話要約やナレッジ検索を自動化。対応品質が均一化",
  },
  {
    id: "sales",
    department: "営業",
    color: "#34A853",
    before:
      "SFAへの入力と資料作成で労働時間の40%を消費。顧客対応に集中できない",
    after:
      "AIが商談の文脈を理解し、返信メールの下書きや要約を自動生成。営業活動に集中可能",
  },
  {
    id: "marketing",
    department: "マーケティング",
    color: "#FBBC05",
    before:
      "データのクレンジングに時間がかかり、リアルタイムな意思決定が不可能",
    after:
      "広告コピーの生成やトレンド分析をAIが即座に実行。データドリブンな施策を迅速に展開",
  },
  {
    id: "hr",
    department: "人事",
    color: "#EA4335",
    before:
      "採用から評価までシステムが分断され、離職兆候の検知が後手に回る",
    after:
      "AIがキャリア提案や離職兆候分析をパーソナライズして提供。人材リテンションが向上",
  },
  {
    id: "scm",
    department: "サプライチェーン (SCM)",
    color: "#886FBF",
    before:
      "現場の異常検知が遅れ、欠品や在庫過多が頻発。対応が事後的",
    after:
      "予測に基づく自律的なSCMにより、配送ルートの最適化や異常検知をリアルタイムで実現",
  },
]

// ─── Observability (追加要素5) ───
export const OBSERVABILITY_FEATURES: ObservabilityFeature[] = [
  {
    id: "agent-logs",
    name: "エージェント実行ログ & トレース",
    description:
      "エージェントの実行ごとに詳細なログとトレースを記録し、ダッシュボードで完全に可視化・監査可能",
    metrics: [
      "平均レイテンシ",
      "ツール呼び出し回数 / エラー率",
      "モデル呼び出し回数 / エラー率",
      "エンドツーエンドの実行トレース",
    ],
  },
]

// ─── Quiz Questions ───
export const AWT_QUIZ_QUESTIONS: AWTQuizQuestion[] = [
  {
    id: "awt-q1",
    question:
      "AWTにおける「Multiplier Effect（相乗効果）」とは何の組み合わせか？",
    options: [
      "Google Cloud + AWS の マルチクラウド統合",
      "Google Workspace（個人生産性）+ Gemini Enterprise（全社自動化）",
      "Gemini API + OpenAI API のモデル並列実行",
      "BigQuery + Salesforce のデータ統合",
    ],
    correctIndex: 1,
    explanation:
      "AWTの核心は、Google Workspace（個人の生産性向上）とGemini Enterprise（全社横断のビジネスプロセス自動化）を統合し、相乗効果を生み出すことです。",
  },
  {
    id: "awt-q2",
    question: "AWTの3レイヤーアーキテクチャで「エージェント レイヤー」に該当するものは？",
    options: [
      "Google Workspace",
      "Gemini Enterprise",
      "BigQuery / Cloud Storage",
      "Salesforce / SAP",
    ],
    correctIndex: 1,
    explanation:
      "エージェント レイヤーはGemini Enterpriseが担い、組織の中枢神経として複数のAIエージェントをオーケストレーションします。",
  },
  {
    id: "awt-q3",
    question: "ビジネスユーザー（非エンジニア）がAIエージェントを構築するためのツールは？",
    options: [
      "Agent Development Kit (ADK)",
      "Antigravity",
      "Workspace Studio",
      "Vertex AI Pipeline",
    ],
    correctIndex: 2,
    explanation:
      "Workspace StudioはGmailやDocsなどにネイティブに組み込まれたノーコードツールで、自然言語でフローを構築できます。",
  },
  {
    id: "awt-q4",
    question: "プロンプトインジェクションや脱獄攻撃からAIエージェントを保護する機能は？",
    options: [
      "Data Loss Prevention (DLP)",
      "Model Armor",
      "VPC Service Controls",
      "Cloud Identity",
    ],
    correctIndex: 1,
    explanation:
      "Model Armorはプロンプトインジェクションや脱獄からシステムを保護し、悪意のあるコンテンツをフィルタリングする専用機能です。",
  },
  {
    id: "awt-q5",
    question:
      "4Aフレームワークの正しい順序は？",
    options: [
      "Ask → Acknowledge → Anticipate → Answer",
      "Anticipate → Acknowledge → Ask → Answer",
      "Answer → Ask → Acknowledge → Anticipate",
      "Acknowledge → Anticipate → Answer → Ask",
    ],
    correctIndex: 1,
    explanation:
      "4Aフレームワークは Anticipate（予測）→ Acknowledge（受け止め）→ Ask（深掘り）→ Answer（回答）の順で、顧客の反論を関係構築の機会に転換します。",
  },
  {
    id: "awt-q6",
    question: "Antigravityとは何か？",
    options: [
      "Google Cloudの新しいデータベースサービス",
      "Googleが開発したエージェント型IDE",
      "Gemini Enterprise のマーケティング名称",
      "Google Workspaceのセキュリティ機能",
    ],
    correctIndex: 1,
    explanation:
      "AntigravityはGoogleが開発したエージェント型IDEで、Agent Managerを通じて数十のエージェントを俯瞰して管理・監視できます。",
  },
  {
    id: "awt-q7",
    question: "BYO-MCPとは何の略か？",
    options: [
      "Build Your Own Machine Code Pipeline",
      "Bring Your Own Model Context Protocol",
      "Business Yield Optimization Model Control Panel",
      "Bring Your Own Multi-Cloud Platform",
    ],
    correctIndex: 1,
    explanation:
      "BYO-MCP（Bring Your Own MCP）は、独自のMCP（Model Context Protocol）サーバーを持ち込み、Geminiと統合することで、企業固有のシステムをエージェントのワークフローに組み込む仕組みです。",
  },
  {
    id: "awt-q8",
    question: "Deep Research Agentの特徴として正しいものは？",
    options: [
      "コードのバグを自動修正する",
      "ウェブや社内ソースから情報を統合し、引用付きの詳細なレポートを自動作成する",
      "動画コンテンツを自動生成する",
      "データベースのスキーマを最適化する",
    ],
    correctIndex: 1,
    explanation:
      "Deep Research Agentは、複雑で多段階にわたる調査・分析を自律的に遂行し、引用付きの詳細なレポートを自動作成するプリビルドエージェントです。",
  },
  {
    id: "awt-q9",
    question: "AWTの導入により、営業部門のBefore/Afterで改善される主な課題は？",
    options: [
      "セキュリティインシデントの検知遅延",
      "SFA入力と資料作成に労働時間の40%を消費していた非効率",
      "サプライチェーンの在庫管理ミス",
      "採用プロセスの長期化",
    ],
    correctIndex: 1,
    explanation:
      "営業部門では、SFAへの入力と資料作成で労働時間の40%を消費していた課題を、AIによる商談文脈理解・メール下書き・要約の自動生成で解決します。",
  },
]
