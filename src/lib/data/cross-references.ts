/**
 * クロスリファレンスレジストリ
 * 製品・デモ・資格・アーキテクチャを双方向に接続する
 */

// ─── 製品名 → 製品ID マッピング（certifications.tsのkeyServicesが文字列のため） ───
export const SERVICE_NAME_TO_PRODUCT_ID: Record<string, string> = {
  "Compute Engine": "gce",
  "Cloud Storage": "gcs",
  "BigQuery": "bigquery",
  "Cloud Run": "cloud-run",
  "Cloud SQL": "cloud-sql",
  "Vertex AI": "vertex-ai",
  "GKE": "gke",
  "Google Kubernetes Engine": "gke",
  "Cloud Functions": "cloud-functions",
  "Cloud IAM": "iam",
  "VPC": "vpc",
  "Cloud Spanner": "spanner",
  "Firestore": "firestore",
  "Cloud Bigtable": "bigtable",
  "Memorystore": "memorystore",
  "Dataflow": "dataflow",
  "Pub/Sub": "pubsub",
  "Dataproc": "dataproc",
  "Looker": "looker",
  "Cloud CDN": "cloud-cdn",
  "Cloud Load Balancing": "cloud-load-balancing",
  "Cloud Armor": "cloud-armor",
  "Secret Manager": "secret-manager",
  "Cloud Build": "cloud-build",
  "Artifact Registry": "artifact-registry",
  "Cloud Deploy": "cloud-deploy",
  "Cloud Monitoring": "cloud-monitoring",
  "Cloud Logging": "cloud-logging",
  "Cloud VPN": "vpc",
  "Cloud Interconnect": "vpc",
  "Cloud DNS": "vpc",
  "Network Connectivity Center": "vpc",
  "VPC Service Controls": "iam",
  "Cloud KMS": "secret-manager",
  "Security Command Center": "iam",
  "Chronicle": "iam",
  "Binary Authorization": "iam",
  "Document AI": "document-ai",
  "Speech-to-Text": "speech-to-text",
  "Vision AI": "vision-ai",
  "AlloyDB": "alloydb",
  "Cloud Endpoints": "cloud-run",
  "Cloud Tasks": "cloud-functions",
  "App Engine": "app-engine",
}

// ─── 製品ID → デモパス マッピング ───
export const PRODUCT_TO_DEMO: Record<string, string> = {
  "gce": "/demos/gce",
  "gcs": "/demos/gcs",
  "bigquery": "/demos/bigquery",
  "cloud-run": "/demos/cloud-run",
  "cloud-functions": "/demos/cloud-functions",
  "gke": "/demos/gke",
  "pubsub": "/demos/pubsub",
  "vertex-ai": "/demos/vertex-ai",
  // Security demos (製品IDではなくカテゴリベース)
  "iam": "/demos/iam",
  "vpc": "/demos/vpc-firewall",
  "secret-manager": "/demos/service-accounts",
}

// ─── デモID → 関連情報 ───
export interface DemoContext {
  /** デモID（URLパスの末尾） */
  id: string
  /** 関連する製品ID群 */
  productIds: string[]
  /** 関連する資格ID群 */
  certIds: string[]
  /** 関連するアーキテクチャID群 */
  archIds: string[]
}

export const DEMO_CONTEXTS: DemoContext[] = [
  { id: "gce", productIds: ["gce"], certIds: ["cdl", "ace", "pca"], archIds: ["hybrid-cloud"] },
  { id: "gcs", productIds: ["gcs"], certIds: ["cdl", "ace", "pde"], archIds: ["3tier-web", "data-pipeline", "analytics-platform", "genai-rag"] },
  { id: "bigquery", productIds: ["bigquery"], certIds: ["cdl", "pde"], archIds: ["data-pipeline", "analytics-platform"] },
  { id: "cloud-run", productIds: ["cloud-run"], certIds: ["cdl", "ace", "pcd"], archIds: ["3tier-web", "event-driven"] },
  { id: "cloud-functions", productIds: ["cloud-functions"], certIds: ["cdl", "ace", "pcd"], archIds: ["serverless", "event-driven"] },
  { id: "gke", productIds: ["gke"], certIds: ["ace", "pca", "pcd"], archIds: ["microservices", "cicd-pipeline"] },
  { id: "pubsub", productIds: ["pubsub"], certIds: ["pde", "pcd"], archIds: ["data-pipeline", "microservices", "event-driven"] },
  { id: "vertex-ai", productIds: ["vertex-ai"], certIds: ["cdl", "pmle"], archIds: ["ml-pipeline", "genai-rag", "adk-multi-agent"] },
  { id: "adk", productIds: ["vertex-ai"], certIds: ["pmle"], archIds: ["adk-multi-agent"] },
  // Security demos
  { id: "iam", productIds: ["iam"], certIds: ["ace", "pcse"], archIds: ["3tier-web", "microservices", "hybrid-cloud"] },
  { id: "vpc-firewall", productIds: ["vpc", "cloud-armor"], certIds: ["ace", "pcne", "pcse"], archIds: ["3tier-web", "microservices", "hybrid-cloud"] },
  { id: "service-accounts", productIds: ["iam", "secret-manager"], certIds: ["ace", "pcse"], archIds: ["cicd-pipeline", "ml-pipeline"] },
  { id: "org-policy", productIds: ["iam"], certIds: ["pca", "pcse"], archIds: ["hybrid-cloud"] },
  { id: "audit-logs", productIds: ["cloud-logging", "cloud-monitoring"], certIds: ["pcse", "pca"], archIds: ["event-driven"] },
]

// ─── 実務シナリオ ───
export interface UseCaseScenario {
  id: string
  title: string
  description: string
  icon: string
  color: string
  /** シナリオに含まれるデモID群 */
  demoIds: string[]
  /** 推奨する学習順序のデモID群 */
  learningPath: string[]
  /** 関連する資格 */
  certIds: string[]
  /** 関連するアーキテクチャ */
  archIds: string[]
}

export const USE_CASE_SCENARIOS: UseCaseScenario[] = [
  {
    id: "web-app",
    title: "Webアプリケーションを構築する",
    description: "3層Webアーキテクチャの設計から、コンテナデプロイ、セキュリティ設定まで一気通貫で体験",
    icon: "Globe",
    color: "#4285F4",
    demoIds: ["cloud-run", "gcs", "iam", "vpc-firewall"],
    learningPath: ["cloud-run", "gcs", "vpc-firewall", "iam"],
    certIds: ["ace", "pcd"],
    archIds: ["3tier-web", "serverless"],
  },
  {
    id: "data-analytics",
    title: "データ分析基盤を作る",
    description: "データの収集・変換・分析・可視化までのパイプラインを構築し、権限管理も含めて体験",
    icon: "BarChart3",
    color: "#34A853",
    demoIds: ["bigquery", "pubsub", "gcs", "service-accounts"],
    learningPath: ["gcs", "pubsub", "bigquery", "service-accounts"],
    certIds: ["pde"],
    archIds: ["data-pipeline", "analytics-platform"],
  },
  {
    id: "ai-ml",
    title: "AI/MLを導入する",
    description: "MLモデルの構築からRAG、マルチエージェントまで、AI活用のフルスタックを体験",
    icon: "Brain",
    color: "#4285F4",
    demoIds: ["vertex-ai", "adk", "bigquery", "gcs"],
    learningPath: ["gcs", "bigquery", "vertex-ai", "adk"],
    certIds: ["pmle"],
    archIds: ["ml-pipeline", "genai-rag", "adk-multi-agent"],
  },
  {
    id: "security-governance",
    title: "セキュリティ監査に対応する",
    description: "IAM設計、SA管理、ネットワーク防御、監査ログ調査まで、セキュリティ運用の全体像を体験",
    icon: "Shield",
    color: "#EA4335",
    demoIds: ["iam", "service-accounts", "vpc-firewall", "org-policy", "audit-logs"],
    learningPath: ["iam", "vpc-firewall", "service-accounts", "org-policy", "audit-logs"],
    certIds: ["pcse"],
    archIds: ["3tier-web", "hybrid-cloud"],
  },
  {
    id: "microservices",
    title: "マイクロサービスを運用する",
    description: "Kubernetes上のマイクロサービス設計から、CI/CD、イベント駆動連携、監視まで体験",
    icon: "Box",
    color: "#FBBC05",
    demoIds: ["gke", "pubsub", "cloud-run", "cloud-functions"],
    learningPath: ["gke", "pubsub", "cloud-run", "cloud-functions"],
    certIds: ["pcd", "pca"],
    archIds: ["microservices", "cicd-pipeline", "event-driven"],
  },
  {
    id: "enterprise-infra",
    title: "エンタープライズ基盤を設計する",
    description: "ハイブリッドクラウド接続、組織ポリシー、権限階層設計など、大規模環境のガバナンスを体験",
    icon: "Building2",
    color: "#5f6368",
    demoIds: ["org-policy", "iam", "vpc-firewall", "audit-logs", "gce"],
    learningPath: ["gce", "vpc-firewall", "iam", "org-policy", "audit-logs"],
    certIds: ["pca", "pcne", "pcse"],
    archIds: ["hybrid-cloud"],
  },
]

// ─── ヘルパー関数 ───

/** 製品IDに関連するデモIDを返す */
export function getDemosForProduct(productId: string): string[] {
  return DEMO_CONTEXTS
    .filter((d) => d.productIds.includes(productId))
    .map((d) => d.id)
}

/** 製品IDに関連する資格IDを返す */
export function getCertsForProduct(productId: string): string[] {
  const certs = new Set<string>()
  DEMO_CONTEXTS.forEach((d) => {
    if (d.productIds.includes(productId)) {
      d.certIds.forEach((c) => certs.add(c))
    }
  })
  return Array.from(certs)
}

/** 製品IDに関連するアーキテクチャIDを返す */
export function getArchsForProduct(productId: string): string[] {
  const archs = new Set<string>()
  DEMO_CONTEXTS.forEach((d) => {
    if (d.productIds.includes(productId)) {
      d.archIds.forEach((a) => archs.add(a))
    }
  })
  return Array.from(archs)
}

/** 資格IDに関連するデモIDを返す */
export function getDemosForCert(certId: string): string[] {
  return DEMO_CONTEXTS
    .filter((d) => d.certIds.includes(certId))
    .map((d) => d.id)
}

/** アーキテクチャIDに関連するデモIDを返す */
export function getDemosForArch(archId: string): string[] {
  return DEMO_CONTEXTS
    .filter((d) => d.archIds.includes(archId))
    .map((d) => d.id)
}

/** デモIDからコンテキスト取得 */
export function getDemoContext(demoId: string): DemoContext | undefined {
  return DEMO_CONTEXTS.find((d) => d.id === demoId)
}

/** サービス名文字列から製品IDに変換 */
export function serviceNameToProductId(name: string): string | undefined {
  return SERVICE_NAME_TO_PRODUCT_ID[name]
}

/** デモIDからデモページパスへ変換 */
export function demoIdToPath(demoId: string): string {
  return `/demos/${demoId}`
}

/** デモの表示名マップ */
export const DEMO_DISPLAY_NAMES: Record<string, string> = {
  "gce": "Compute Engine",
  "gcs": "Cloud Storage",
  "bigquery": "BigQuery",
  "cloud-run": "Cloud Run",
  "cloud-functions": "Cloud Functions",
  "gke": "GKE",
  "pubsub": "Pub/Sub",
  "vertex-ai": "Vertex AI",
  "adk": "ADK (AI Agents)",
  "iam": "IAM ポリシー",
  "vpc-firewall": "VPC & Firewall",
  "service-accounts": "サービスアカウント",
  "org-policy": "Org Policy",
  "audit-logs": "Audit Logs",
}
