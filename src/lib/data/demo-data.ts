// ─────────────────────────────────────────────────────────────
// GCE Demo Data
// ─────────────────────────────────────────────────────────────
export const GCE_MACHINE_TYPES = [
  { id: "e2-micro", name: "e2-micro", vCPU: "2 (shared)", memory: "1 GB", price: "$6.11/月" },
  { id: "e2-small", name: "e2-small", vCPU: "2 (shared)", memory: "2 GB", price: "$13.09/月" },
  { id: "e2-medium", name: "e2-medium", vCPU: "2 (shared)", memory: "4 GB", price: "$26.18/月" },
  { id: "n2-standard-2", name: "n2-standard-2", vCPU: "2", memory: "8 GB", price: "$69.20/月" },
  { id: "n2-standard-4", name: "n2-standard-4", vCPU: "4", memory: "16 GB", price: "$138.40/月" },
  { id: "c3-standard-8", name: "c3-standard-8", vCPU: "8", memory: "32 GB", price: "$280.00/月" },
]

export const GCE_REGIONS = [
  { id: "asia-northeast1", name: "asia-northeast1 (東京)" },
  { id: "asia-northeast2", name: "asia-northeast2 (大阪)" },
  { id: "us-central1", name: "us-central1 (アイオワ)" },
  { id: "us-east1", name: "us-east1 (サウスカロライナ)" },
  { id: "europe-west1", name: "europe-west1 (ベルギー)" },
]

export const GCE_OS_IMAGES = [
  { id: "debian-12", name: "Debian GNU/Linux 12 (bookworm)", family: "debian-12" },
  { id: "ubuntu-2204", name: "Ubuntu 22.04 LTS", family: "ubuntu-2204-lts" },
  { id: "centos-stream-9", name: "CentOS Stream 9", family: "centos-stream-9" },
  { id: "windows-2022", name: "Windows Server 2022 Datacenter", family: "windows-cloud" },
  { id: "cos-stable", name: "Container-Optimized OS (stable)", family: "cos-stable" },
]

// ─────────────────────────────────────────────────────────────
// GCS Demo Data
// ─────────────────────────────────────────────────────────────
export interface MockFile {
  name: string
  size: string
  type: string
  updated: string
  icon: string
}

export const GCS_MOCK_FILES: MockFile[] = [
  { name: "profile-photo.jpg", size: "2.4 MB", type: "image/jpeg", updated: "2026-03-20", icon: "Image" },
  { name: "sales-report-q1.csv", size: "45.2 KB", type: "text/csv", updated: "2026-03-18", icon: "Table" },
  { name: "app-config.json", size: "1.2 KB", type: "application/json", updated: "2026-03-15", icon: "Braces" },
  { name: "model-weights.bin", size: "512 MB", type: "application/octet-stream", updated: "2026-03-10", icon: "Brain" },
  { name: "backup-2026-03.tar.gz", size: "1.8 GB", type: "application/gzip", updated: "2026-03-01", icon: "Archive" },
  { name: "index.html", size: "8.5 KB", type: "text/html", updated: "2026-02-28", icon: "Globe" },
]

export const GCS_STORAGE_CLASSES = [
  { id: "STANDARD", name: "Standard", price: "$0.020/GB/月", access: "頻繁なアクセス" },
  { id: "NEARLINE", name: "Nearline", price: "$0.010/GB/月", access: "月1回以下" },
  { id: "COLDLINE", name: "Coldline", price: "$0.004/GB/月", access: "四半期1回以下" },
  { id: "ARCHIVE", name: "Archive", price: "$0.0012/GB/月", access: "年1回以下" },
]

// ─────────────────────────────────────────────────────────────
// BigQuery Demo Data
// ─────────────────────────────────────────────────────────────
export interface BQTable {
  name: string
  rows: string
  size: string
  schema: { field: string; type: string }[]
}

export const BQ_DEMO_DATASETS = [
  {
    id: "ecommerce",
    name: "ecommerce",
    tables: [
      {
        name: "orders",
        rows: "12,847,293",
        size: "2.3 GB",
        schema: [
          { field: "order_id", type: "STRING" },
          { field: "user_id", type: "STRING" },
          { field: "product_id", type: "STRING" },
          { field: "amount", type: "FLOAT64" },
          { field: "created_at", type: "TIMESTAMP" },
          { field: "status", type: "STRING" },
          { field: "region", type: "STRING" },
        ],
      },
      {
        name: "users",
        rows: "3,421,056",
        size: "456 MB",
        schema: [
          { field: "user_id", type: "STRING" },
          { field: "email", type: "STRING" },
          { field: "age", type: "INT64" },
          { field: "country", type: "STRING" },
          { field: "registered_at", type: "TIMESTAMP" },
        ],
      },
      {
        name: "products",
        rows: "48,291",
        size: "12 MB",
        schema: [
          { field: "product_id", type: "STRING" },
          { field: "name", type: "STRING" },
          { field: "category", type: "STRING" },
          { field: "price", type: "FLOAT64" },
        ],
      },
    ],
  },
]

export const BQ_SAMPLE_QUERIES = [
  {
    label: "月別売上集計",
    query: `SELECT
  FORMAT_TIMESTAMP('%Y-%m', created_at) AS month,
  COUNT(*) AS order_count,
  ROUND(SUM(amount), 2) AS total_revenue
FROM \`ecommerce.orders\`
WHERE status = 'COMPLETED'
GROUP BY month
ORDER BY month DESC
LIMIT 12`,
    result: {
      columns: ["month", "order_count", "total_revenue"],
      rows: [
        ["2026-03", "48,291", "¥12,847,293"],
        ["2026-02", "42,183", "¥10,923,847"],
        ["2026-01", "51,029", "¥14,238,471"],
        ["2025-12", "67,432", "¥18,923,481"],
        ["2025-11", "55,918", "¥15,428,293"],
      ],
      processedBytes: "2.3 GB",
      duration: "3.2s",
    },
  },
  {
    label: "地域別ユーザー数",
    query: `SELECT
  country,
  COUNT(*) AS user_count,
  ROUND(AVG(age)) AS avg_age
FROM \`ecommerce.users\`
GROUP BY country
ORDER BY user_count DESC
LIMIT 10`,
    result: {
      columns: ["country", "user_count", "avg_age"],
      rows: [
        ["Japan", "1,284,729", "34"],
        ["United States", "892,341", "31"],
        ["Germany", "342,819", "36"],
        ["United Kingdom", "298,472", "33"],
        ["France", "187,293", "35"],
      ],
      processedBytes: "456 MB",
      duration: "1.8s",
    },
  },
  {
    label: "カテゴリ別人気商品",
    query: `SELECT
  p.category,
  p.name,
  COUNT(o.order_id) AS order_count
FROM \`ecommerce.orders\` o
JOIN \`ecommerce.products\` p ON o.product_id = p.product_id
WHERE o.status = 'COMPLETED'
GROUP BY p.category, p.name
ORDER BY order_count DESC
LIMIT 5`,
    result: {
      columns: ["category", "name", "order_count"],
      rows: [
        ["Electronics", "Smartphone X Pro", "284,291"],
        ["Clothing", "Summer Dress", "198,473"],
        ["Electronics", "Wireless Earbuds", "187,293"],
        ["Books", "ML Engineering Guide", "143,812"],
        ["Food", "Organic Coffee Beans", "129,481"],
      ],
      processedBytes: "2.7 GB",
      duration: "4.1s",
    },
  },
]

// ─────────────────────────────────────────────────────────────
// Cloud Run Demo Data
// ─────────────────────────────────────────────────────────────
export const CLOUD_RUN_SERVICES = [
  {
    name: "api-server",
    image: "asia-northeast1-docker.pkg.dev/my-project/my-repo/api-server:latest",
    url: "https://api-server-xxxx-an.a.run.app",
    region: "asia-northeast1",
    minInstances: 0,
    maxInstances: 100,
    requestPerSecond: 847,
    latencyP99: "142ms",
    status: "Running",
  },
]

export const CLOUD_RUN_DEPLOY_STEPS = [
  "イメージをArtifact Registryからプル中...",
  "新しいリビジョンを作成中...",
  "コンテナを起動中...",
  "ヘルスチェックを実行中...",
  "トラフィックを新リビジョンに切り替え中...",
  "デプロイ完了",
]

// ─────────────────────────────────────────────────────────────
// GKE Demo Data
// ─────────────────────────────────────────────────────────────
export const GKE_MOCK_PODS = [
  { name: "api-server-7d9f8b-xkp2m", status: "Running", ready: "1/1", restarts: 0, age: "2d", cpu: "45m", memory: "128Mi" },
  { name: "api-server-7d9f8b-qw3rt", status: "Running", ready: "1/1", restarts: 0, age: "2d", cpu: "52m", memory: "135Mi" },
  { name: "worker-6c8b7d-zt9yp", status: "Running", ready: "1/1", restarts: 1, age: "5d", cpu: "120m", memory: "256Mi" },
  { name: "redis-0", status: "Running", ready: "1/1", restarts: 0, age: "10d", cpu: "8m", memory: "64Mi" },
  { name: "postgres-0", status: "Running", ready: "1/1", restarts: 0, age: "10d", cpu: "200m", memory: "512Mi" },
  { name: "nginx-ingress-5f9d-bnjk8", status: "Running", ready: "1/1", restarts: 0, age: "15d", cpu: "15m", memory: "32Mi" },
]

export const GKE_KUBECTL_COMMANDS = [
  { cmd: "kubectl get nodes", desc: "ノード一覧表示" },
  { cmd: "kubectl get pods -n default", desc: "Pod一覧表示" },
  { cmd: "kubectl get svc", desc: "サービス一覧表示" },
  { cmd: "kubectl describe pod <pod-name>", desc: "Pod詳細表示" },
  { cmd: "kubectl logs <pod-name> -f", desc: "ログストリーミング" },
  { cmd: "kubectl scale deployment api-server --replicas=5", desc: "スケールアウト" },
  { cmd: "kubectl rollout status deployment/api-server", desc: "ロールアウト状況確認" },
  { cmd: "kubectl apply -f deployment.yaml", desc: "マニフェスト適用" },
]

// ─────────────────────────────────────────────────────────────
// Pub/Sub Demo Data
// ─────────────────────────────────────────────────────────────
export interface PubSubMessage {
  id: string
  data: string
  attributes: Record<string, string>
  publishTime: string
  ackId: string
}

export const PUBSUB_SAMPLE_MESSAGES = [
  { id: "msg-001", data: '{"event":"user.signup","userId":"u123","timestamp":"2026-03-26T10:00:00Z"}', attributes: { source: "auth-service", version: "1.0" }, publishTime: "2026-03-26T10:00:00Z", ackId: "ack-001" },
  { id: "msg-002", data: '{"event":"order.created","orderId":"o456","amount":12800,"currency":"JPY"}', attributes: { source: "order-service", version: "1.0" }, publishTime: "2026-03-26T10:00:05Z", ackId: "ack-002" },
  { id: "msg-003", data: '{"event":"payment.completed","orderId":"o456","method":"credit_card"}', attributes: { source: "payment-service", version: "2.1" }, publishTime: "2026-03-26T10:00:12Z", ackId: "ack-003" },
]

// ─────────────────────────────────────────────────────────────
// Vertex AI Demo Data
// ─────────────────────────────────────────────────────────────
export const VERTEX_MODELS = [
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", type: "Foundation", status: "Available", accuracy: "N/A", latency: "450ms" },
  { id: "text-classifier-v2", name: "Text Classifier v2", type: "Custom", status: "Deployed", accuracy: "94.2%", latency: "38ms" },
  { id: "image-detector-v1", name: "Object Detector v1", type: "Custom", status: "Deployed", accuracy: "91.8%", latency: "125ms" },
  { id: "demand-forecast", name: "Demand Forecaster", type: "AutoML", status: "Training", accuracy: "–", latency: "–" },
]

export const VERTEX_PREDICTION_EXAMPLES = [
  {
    modelId: "text-classifier-v2",
    input: "このレビューはとても素晴らしい！品質も高く満足しています。",
    output: { label: "POSITIVE", confidence: 0.978 },
  },
  {
    modelId: "text-classifier-v2",
    input: "配送が遅すぎて最悪でした。二度と使いません。",
    output: { label: "NEGATIVE", confidence: 0.991 },
  },
  {
    modelId: "text-classifier-v2",
    input: "普通の商品です。特に良くも悪くもありません。",
    output: { label: "NEUTRAL", confidence: 0.843 },
  },
]

// ─────────────────────────────────────────────────────────────
// Cloud Functions Demo Data
// ─────────────────────────────────────────────────────────────
export const CF_DEFAULT_CODE = `const functions = require('@google-cloud/functions-framework');

functions.http('helloGCP', (req, res) => {
  const name = req.query.name || req.body.name || 'World';
  res.status(200).json({
    message: \`Hello, \${name}! from Google Cloud Functions\`,
    timestamp: new Date().toISOString(),
    region: process.env.FUNCTION_REGION || 'asia-northeast1',
  });
});`

export const CF_DEPLOY_LOG = [
  "[INFO] Building function image...",
  "[INFO] Uploading source code to Cloud Storage...",
  "[INFO] Creating Cloud Build job...",
  "[BUILD] Step 1/5: FROM node:20-alpine",
  "[BUILD] Step 2/5: WORKDIR /app",
  "[BUILD] Step 3/5: COPY package*.json ./",
  "[BUILD] Step 4/5: RUN npm install",
  "[BUILD] Step 5/5: COPY . .",
  "[INFO] Deploying function to Cloud Run (2nd gen)...",
  "[INFO] Setting up IAM permissions...",
  "[SUCCESS] Function deployed successfully!",
  "[INFO] URL: https://asia-northeast1-my-project.cloudfunctions.net/helloGCP",
]
