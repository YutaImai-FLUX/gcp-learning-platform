// Google法人向けサービス理解ページ用データ
// 2025年1月〜 Gemini AI機能がWorkspace Business/Enterpriseプランに標準搭載
// 旧Gemini Business/Enterpriseアドオンは販売終了

export interface WorkspacePlan {
  name: string
  price: string
  priceAnnual: string
  storage: string
  meetCapacity: string
  vault: boolean
  dlp: boolean
  appSheet: boolean
  securityLevel: string
  geminiLevel: string
  highlight?: boolean
}

export interface GeminiPlan {
  name: string
  price: string
  features: {
    geminiSidePanel: boolean
    helpMeWrite: boolean
    geminiApp: boolean
    meetNotes: boolean
    notebookLmPlus: boolean
    deepResearch: boolean
    appSheetGemini: boolean
    workspaceStudioExpanded: boolean
  }
}

export interface ConfusionPoint {
  question: string
  answer: string
  category: "gemini" | "workspace" | "gcp"
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface ServiceLayer {
  id: string
  label: string
  color: string
  description: string
  services: string[]
  target: string
  billing: string
}

export const WORKSPACE_PLANS: WorkspacePlan[] = [
  {
    name: "Business Starter",
    price: "$8.40/user/月",
    priceAnnual: "$7/user/月",
    storage: "30GB/user",
    meetCapacity: "100人",
    vault: false,
    dlp: false,
    appSheet: true,
    securityLevel: "基本",
    geminiLevel: "制限付き（1日5プロンプト）",
  },
  {
    name: "Business Standard",
    price: "$16.80/user/月",
    priceAnnual: "$14/user/月",
    storage: "2TB/user",
    meetCapacity: "150人",
    vault: false,
    dlp: false,
    appSheet: true,
    securityLevel: "基本",
    geminiLevel: "標準AI内蔵",
    highlight: true,
  },
  {
    name: "Business Plus",
    price: "$26.40/user/月",
    priceAnnual: "$22/user/月",
    storage: "5TB/user",
    meetCapacity: "500人",
    vault: true,
    dlp: true,
    appSheet: true,
    securityLevel: "強化",
    geminiLevel: "標準AI内蔵",
  },
  {
    name: "Enterprise",
    price: "要問合せ",
    priceAnnual: "要問合せ",
    storage: "5TB/user〜",
    meetCapacity: "1,000人",
    vault: true,
    dlp: true,
    appSheet: true,
    securityLevel: "最上位（S/MIME, DLP, CAA等）",
    geminiLevel: "拡張AI内蔵（高上限）",
  },
]

export const GEMINI_PLANS: GeminiPlan[] = [
  {
    name: "Standard / Plus 内蔵AI",
    price: "Workspace料金に含む",
    features: {
      geminiSidePanel: true,
      helpMeWrite: true,
      geminiApp: true,
      meetNotes: true,
      notebookLmPlus: true,
      deepResearch: true,
      appSheetGemini: false,
      workspaceStudioExpanded: false,
    },
  },
  {
    name: "Enterprise 内蔵AI",
    price: "Workspace料金に含む",
    features: {
      geminiSidePanel: true,
      helpMeWrite: true,
      geminiApp: true,
      meetNotes: true,
      notebookLmPlus: true,
      deepResearch: true,
      appSheetGemini: true,
      workspaceStudioExpanded: true,
    },
  },
]

export const GEMINI_FEATURE_LABELS: Record<keyof GeminiPlan["features"], string> = {
  geminiSidePanel: "Gemini サイドパネル（Gmail / Docs / Sheets / Slides / Drive / Chat）",
  helpMeWrite: "Help me write（文書・メール作成支援）",
  geminiApp: "Gemini アプリ（Gems でAIエキスパート構築）",
  meetNotes: "Meet ノート自動生成・会議要約",
  notebookLmPlus: "NotebookLM Plus",
  deepResearch: "Deep Research",
  appSheetGemini: "AppSheet Gemini連携（自然言語アプリ生成）",
  workspaceStudioExpanded: "Workspace Studio（拡張上限）",
}

export const USAGE_LIMITS = {
  description: "2026年4月1日より使用量制限が適用開始。それ以前はプロモーション期間。",
  tiers: [
    {
      tier: "Business Starter",
      imageGeneration: "3回/月",
      vidsGeneration: "50本/月",
      workspaceStudio: "100回/月",
      pdfAudioSummary: "なし",
    },
    {
      tier: "Business Standard / Plus",
      imageGeneration: "30回/月",
      vidsGeneration: "50本/月",
      workspaceStudio: "400回/月",
      pdfAudioSummary: "20回/日",
    },
    {
      tier: "Enterprise",
      imageGeneration: "300回/月",
      vidsGeneration: "200本/月",
      workspaceStudio: "2,000回/月",
      pdfAudioSummary: "40回/日",
    },
  ],
  addons: [
    {
      name: "AI Expanded Access",
      description: "使用量上限を大幅に引き上げるオプションアドオン",
      imageGeneration: "1,000回/月",
      vidsGeneration: "500本/月",
      workspaceStudio: "10,000回/月",
      pdfAudioSummary: "200回/日",
    },
    {
      name: "AI Ultra Access",
      description: "最も高度なAI機能へのアクセス権（創造的・研究プロジェクト向け）",
      imageGeneration: "1,000回/月",
      vidsGeneration: "500本/月",
      workspaceStudio: "—",
      pdfAudioSummary: "—",
    },
  ],
} as const

export const CONFUSION_POINTS: ConfusionPoint[] = [
  {
    question: "Gemini Enterprise = GCPのサービス？",
    answer:
      "いいえ。旧「Gemini Enterprise」はGoogle Workspace向けのAIアドオンでしたが、2025年1月に販売終了しました。現在はWorkspace各プランにGemini AI機能が標準搭載されています。GCPで利用するGemini API（Vertex AI経由）とは課金体系も利用方法も完全に別物です。",
    category: "gemini",
  },
  {
    question: "WorkspaceプランにGemini AI機能は含まれる？",
    answer:
      "はい、2025年1月以降、Business Standard以上のプランにGemini AI機能が標準搭載されました。Business Starterにも制限付き（1日5プロンプト）で含まれます。旧Gemini Business/Enterpriseアドオンの別途契約は不要になりました。",
    category: "workspace",
  },
  {
    question: "Gemini APIとWorkspace内蔵Geminiの違いは？",
    answer:
      "Gemini API（Vertex AI）は開発者向けで従量課金（トークン単位）。Workspace内蔵Geminiはエンドユーザー向けでWorkspaceサブスクリプションに含まれます。同じGeminiモデルを基盤としていますが、提供形態・課金方式・利用上限が異なります。",
    category: "gcp",
  },
  {
    question: "Google One AI PremiumとWorkspace内蔵Geminiの違いは？",
    answer:
      "Google One AI Premiumは個人向けで、個人のGmailやDriveでGemini Advancedを利用できます。Workspace内蔵Geminiは法人向けで、組織全体のセキュリティ・管理機能（DLP、データ保護ポリシー等）が含まれます。",
    category: "gemini",
  },
  {
    question: "AI Expanded Access / AI Ultra Access とは？",
    answer:
      "Gemini AI機能がWorkspaceに標準搭載された後の新しいオプションアドオンです。画像生成・動画生成・Workspace Studioなどの使用量上限を大幅に引き上げます。旧Gemini Business/Enterpriseアドオンの後継に相当しますが、基本AI機能は別途契約不要です。",
    category: "workspace",
  },
  {
    question: "Duet AIとGemini for Workspaceは別物？",
    answer:
      "同じものの名称変更です。2024年2月にDuet AI for Google Workspaceは「Gemini for Google Workspace」にリブランドされ、さらに2025年1月からはWorkspace各プランに統合されました。現在は「Workspace内蔵AI」として提供されています。",
    category: "gemini",
  },
  {
    question: "使用量制限（Usage Limits）はいつから適用される？",
    answer:
      "2026年4月1日から正式に使用量制限が適用されます。それ以前はプロモーション期間として、Business/Enterpriseエディションのユーザーは新しいAI機能に優先アクセスできます。制限は日次または月次でリセットされ、ユーザー間で共有できません。",
    category: "workspace",
  },
]

export const SERVICE_LAYERS: ServiceLayer[] = [
  {
    id: "workspace",
    label: "Google Workspace",
    color: "#4285F4",
    description: "全社員の業務基盤となるコラボレーションSaaS（Gemini AI機能を標準搭載）",
    services: ["Gmail", "Google Drive", "Docs / Sheets / Slides", "Google Meet", "Google Chat", "Google Calendar", "AppSheet", "Gemini AI"],
    target: "全社員（非エンジニア含む）",
    billing: "ユーザー単位の月額サブスクリプション",
  },
  {
    id: "gemini-workspace",
    label: "AI拡張オプション",
    color: "#886FBF",
    description: "Workspace内蔵AIの使用量上限を引き上げるオプションアドオン",
    services: ["AI Expanded Access", "AI Ultra Access", "画像生成上限拡張", "動画生成上限拡張", "Workspace Studio拡張", "PDF音声概要拡張"],
    target: "AI活用ヘビーユーザー",
    billing: "Workspace契約 + アドオン月額",
  },
  {
    id: "gcp",
    label: "Google Cloud (GCP)",
    color: "#34A853",
    description: "開発者・データエンジニア向けクラウドインフラ",
    services: ["Compute Engine", "BigQuery", "Vertex AI / Gemini API", "Cloud Run", "Cloud Storage", "GKE", "Cloud SQL"],
    target: "開発者・データエンジニア・MLエンジニア",
    billing: "従量課金（使った分だけ）",
  },
]

export const CERT_RELEVANCE = [
  {
    certId: "CDL",
    certName: "Cloud Digital Leader",
    relevance: "Google Workspaceとの統合、AIの業務活用（概念レベル）",
    level: "high" as const,
  },
  {
    certId: "PCA",
    certName: "Professional Cloud Architect",
    relevance: "Workspace連携アーキテクチャ、Cloud Identity統合設計",
    level: "medium" as const,
  },
  {
    certId: "PCSE",
    certName: "Professional Cloud Security Engineer",
    relevance: "Workspace × GCPのID連携、DLP、Vault、データ保護",
    level: "high" as const,
  },
  {
    certId: "ACE",
    certName: "Associate Cloud Engineer",
    relevance: "Cloud Identity / IAM の基礎、組織ポリシー",
    level: "low" as const,
  },
]

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "ge-q1",
    question: "2025年以降、Google WorkspaceでGemini AI機能を利用するために必要なものは？",
    options: [
      "GCPプロジェクトとVertex AIの有効化",
      "Business Standard以上のWorkspaceプランの契約（AI機能は標準搭載）",
      "旧Gemini Enterpriseアドオンの契約",
      "Gemini APIキーの発行",
    ],
    correctIndex: 1,
    explanation:
      "2025年1月以降、Gemini AI機能はWorkspace Business/Enterpriseプランに標準搭載されました。旧Gemini Business/Enterpriseアドオンは販売終了しています。GCPのVertex AI（Gemini API）とは別の契約・課金体系です。",
  },
  {
    id: "ge-q2",
    question: "Google Workspace Enterprise プランに標準で含まれるものはどれか？",
    options: [
      "Vertex AI APIの無料枠",
      "Gemini AI機能 + Google Vault + DLP + AppSheet Gemini連携",
      "BigQueryへの直接エクスポート",
      "AI Ultra Accessアドオン",
    ],
    correctIndex: 1,
    explanation:
      "EnterpriseプランにはGemini AI機能が標準搭載されており、Vault、DLP、AppSheet Gemini連携も含まれます。AI Ultra Accessは使用量上限を引き上げる別途オプションアドオンです。",
  },
  {
    id: "ge-q3",
    question: "GCPのGemini API（Vertex AI経由）の課金方式は？",
    options: [
      "ユーザー単位の月額固定（Workspaceに含む）",
      "入出力トークン単位の従量課金",
      "リクエスト数に応じた段階制",
      "年間契約の一括払い",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI経由のGemini APIは入出力トークン数に基づく従量課金です。Workspace内蔵のGemini AIとは提供形態・課金体系が完全に異なります。",
  },
  {
    id: "ge-q4",
    question: "Workspace Enterprise内蔵AIでのみ利用可能（または拡張上限が適用される）機能はどれか？",
    options: [
      "Gemini in Gmail でのメール文面生成",
      "Help me write による文書作成支援",
      "AppSheet Gemini連携 と Workspace Studio拡張上限",
      "NotebookLM Plus",
    ],
    correctIndex: 2,
    explanation:
      "AppSheet Gemini連携とWorkspace Studioの拡張上限はEnterprise内蔵AIの特徴です。Gemini サイドパネル、Help me write、NotebookLM PlusはBusiness Standard/Plus内蔵AIでも利用可能です。",
  },
  {
    id: "ge-q5",
    question: "Google WorkspaceとGCPの認証基盤を統合するサービスは？",
    options: [
      "Google Vault",
      "Cloud Identity / Cloud Identity Premium",
      "Google One",
      "AppSheet",
    ],
    correctIndex: 1,
    explanation:
      "Cloud IdentityはWorkspaceとGCPの両方でID管理を統合するサービスです。組織のユーザー・グループ管理、SSO、デバイス管理を一元化できます。",
  },
]
