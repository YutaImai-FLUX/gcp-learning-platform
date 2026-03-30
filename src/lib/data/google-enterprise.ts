// Google法人向けサービス理解ページ用データ

export interface WorkspacePlan {
  name: string
  price: string
  storage: string
  meetCapacity: string
  vault: boolean
  dlp: boolean
  appSheet: boolean
  securityLevel: string
  highlight?: boolean
}

export interface GeminiPlan {
  name: string
  price: string
  features: {
    docsSheetSlides: boolean
    gmailMeet: boolean
    notebookLmPlus: boolean
    deepResearch: boolean
    aiMeetingsFull: boolean
    aiSecurityDlp: boolean
    vertexAiGrounding: boolean
    aiStudioExpanded: boolean
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
    price: "$7.20/user/月",
    storage: "30GB/user",
    meetCapacity: "100人",
    vault: false,
    dlp: false,
    appSheet: false,
    securityLevel: "基本",
  },
  {
    name: "Business Standard",
    price: "$14.40/user/月",
    storage: "2TB/user",
    meetCapacity: "150人",
    vault: false,
    dlp: false,
    appSheet: false,
    securityLevel: "基本",
  },
  {
    name: "Business Plus",
    price: "$21.60/user/月",
    storage: "5TB/user",
    meetCapacity: "500人",
    vault: true,
    dlp: true,
    appSheet: true,
    securityLevel: "強化",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "要問合せ",
    storage: "無制限",
    meetCapacity: "1,000人",
    vault: true,
    dlp: true,
    appSheet: true,
    securityLevel: "最上位（S/MIME, DLP, CAA等）",
  },
]

export const GEMINI_PLANS: GeminiPlan[] = [
  {
    name: "Gemini Business",
    price: "$14/user/月",
    features: {
      docsSheetSlides: true,
      gmailMeet: true,
      notebookLmPlus: false,
      deepResearch: false,
      aiMeetingsFull: false,
      aiSecurityDlp: false,
      vertexAiGrounding: false,
      aiStudioExpanded: false,
    },
  },
  {
    name: "Gemini Enterprise",
    price: "$30/user/月",
    features: {
      docsSheetSlides: true,
      gmailMeet: true,
      notebookLmPlus: true,
      deepResearch: true,
      aiMeetingsFull: true,
      aiSecurityDlp: true,
      vertexAiGrounding: true,
      aiStudioExpanded: true,
    },
  },
]

export const GEMINI_FEATURE_LABELS: Record<keyof GeminiPlan["features"], string> = {
  docsSheetSlides: "Gemini in Docs / Sheets / Slides",
  gmailMeet: "Gemini in Gmail / Meet",
  notebookLmPlus: "NotebookLM Plus",
  deepResearch: "Gemini Deep Research",
  aiMeetingsFull: "AI Meetings（翻訳字幕・要約等フル機能）",
  aiSecurityDlp: "AI Security（DLP for AI）",
  vertexAiGrounding: "Vertex AI データグラウンディング連携",
  aiStudioExpanded: "Google AI Studio 拡張上限",
}

export const CONFUSION_POINTS: ConfusionPoint[] = [
  {
    question: "Gemini Enterprise = GCPのサービス？",
    answer:
      "いいえ。Gemini EnterpriseはGoogle Workspace向けのAIアドオンです。GCPで利用するGemini API（Vertex AI経由）とは課金体系も利用方法も完全に別物です。",
    category: "gemini",
  },
  {
    question: "Workspace EnterpriseプランにGeminiは含まれる？",
    answer:
      "含まれません。Workspace Enterpriseプランは基盤サービス（Gmail, Drive等）の最上位プランであり、Gemini機能を利用するには別途Gemini Business/Enterpriseアドオンの契約が必要です。",
    category: "workspace",
  },
  {
    question: "Gemini APIとGemini for Workspaceの違いは？",
    answer:
      "Gemini API（Vertex AI）は開発者向けで従量課金（トークン単位）。Gemini for Workspaceはエンドユーザー向けで月額固定のサブスクリプション。同じGeminiモデルを基盤としていますが、提供形態が異なります。",
    category: "gcp",
  },
  {
    question: "Google One AI PremiumとGemini Enterpriseの違いは？",
    answer:
      "Google One AI Premiumは個人向け（$19.99/月）で、個人のGmailやDriveでGeminiを利用できます。Gemini Enterpriseは法人向けで、組織全体のセキュリティ・管理機能（DLP, Vault連携等）が含まれます。",
    category: "gemini",
  },
  {
    question: "AppSheetとGeminiの関係は？",
    answer:
      "AppSheetはWorkspaceに統合されたノーコード開発プラットフォームです。Business Plus以上で利用可能。Geminiと連携して自然言語からアプリを自動生成する機能も提供されています。",
    category: "workspace",
  },
  {
    question: "Duet AIとGemini for Workspaceは別物？",
    answer:
      "同じものです。2024年2月にDuet AI for Google Workspaceは「Gemini for Google Workspace」にリブランドされました。機能はそのまま引き継がれています。",
    category: "gemini",
  },
]

export const SERVICE_LAYERS: ServiceLayer[] = [
  {
    id: "workspace",
    label: "Google Workspace",
    color: "#4285F4",
    description: "全社員の業務基盤となるコラボレーションSaaS",
    services: ["Gmail", "Google Drive", "Docs / Sheets / Slides", "Google Meet", "Google Chat", "Google Calendar", "AppSheet"],
    target: "全社員（非エンジニア含む）",
    billing: "ユーザー単位の月額サブスクリプション",
  },
  {
    id: "gemini-workspace",
    label: "Gemini for Workspace",
    color: "#886FBF",
    description: "Workspace上で動作するAIアシスタント（アドオン）",
    services: ["文書・メール生成支援", "スプレッドシート分析", "プレゼン自動生成", "会議要約・翻訳字幕", "NotebookLM Plus", "Deep Research"],
    target: "Workspaceユーザー（アドオン契約者）",
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
    question: "Gemini for Google Workspaceを利用するために必要なものは？",
    options: [
      "GCPプロジェクトとVertex AIの有効化",
      "Google Workspaceの契約 + Geminiアドオンの契約",
      "Google One AI Premiumの契約",
      "Gemini APIキーの発行",
    ],
    correctIndex: 1,
    explanation:
      "Gemini for WorkspaceはWorkspaceのアドオンとして提供されます。GCPのVertex AI（Gemini API）とは別の契約・課金体系です。",
  },
  {
    id: "ge-q2",
    question: "Google Workspace Enterprise プランに標準で含まれるものはどれか？",
    options: [
      "Gemini Enterprise機能",
      "Vertex AI APIの無料枠",
      "Google Vault（データ保持・電子情報開示）",
      "BigQueryへの直接エクスポート",
    ],
    correctIndex: 2,
    explanation:
      "VaultはWorkspace Enterprise（およびBusiness Plus）に含まれます。Gemini機能は別途アドオン契約が必要です。",
  },
  {
    id: "ge-q3",
    question: "GCPのGemini API（Vertex AI経由）の課金方式は？",
    options: [
      "ユーザー単位の月額固定",
      "入出力トークン単位の従量課金",
      "リクエスト数に応じた段階制",
      "年間契約の一括払い",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI経由のGemini APIは入出力トークン数に基づく従量課金です。Gemini for Workspaceのユーザー月額固定とは異なります。",
  },
  {
    id: "ge-q4",
    question: "Gemini Enterprise（Workspace用アドオン）でのみ利用可能な機能はどれか？",
    options: [
      "Gemini in Gmail での文面生成",
      "Gemini in Sheets での数式提案",
      "NotebookLM Plus と Deep Research",
      "Gemini in Slides での画像生成",
    ],
    correctIndex: 2,
    explanation:
      "NotebookLM PlusとDeep ResearchはGemini Enterpriseのみの機能です。Docs/Sheets/Slides/Gmail/Meetの基本AI機能はGemini Businessでも利用可能です。",
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
