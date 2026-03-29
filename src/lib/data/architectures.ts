export interface ArchLayer {
  id: string
  label: string
  color: string
  nodeIds: string[]
}

export interface ArchNode {
  id: string
  label: string
  service: string
  x: number
  y: number
  color: string
  icon: string
  /** このアーキテクチャ内でのノードの役割説明 */
  role?: string
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

export interface Architecture {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  layers: ArchLayer[]
  nodes: ArchNode[]
  edges: ArchEdge[]
  useCases: string[]
  benefits: string[]
}

export const ARCHITECTURES: Architecture[] = [
  {
    id: "3tier-web",
    name: "3層Webアプリケーション",
    description:
      "Cloud Load Balancing → Cloud Run → Cloud SQL という定番の3層Webアーキテクチャ。スケーラブルで管理が容易。",
    category: "Web",
    tags: ["web", "cloud-run", "cloud-sql", "basic"],
    layers: [
      { id: "l-client", label: "Client Layer", color: "#5f6368", nodeIds: ["internet"] },
      { id: "l-edge", label: "Edge / Security", color: "#34A853", nodeIds: ["lb", "cdn", "armor"] },
      { id: "l-app", label: "Application Layer", color: "#4285F4", nodeIds: ["run", "gcs", "secrets"] },
      { id: "l-data", label: "Data Layer", color: "#EA4335", nodeIds: ["sql"] },
    ],
    nodes: [
      { id: "internet", label: "Internet", service: "Internet", x: 300, y: 30, color: "#5f6368", icon: "Globe", role: "エンドユーザーからのリクエスト起点。ブラウザやモバイルアプリからHTTPS経由でアクセスする。" },
      { id: "lb", label: "Cloud Load\nBalancing", service: "Load Balancer", x: 300, y: 120, color: "#34A853", icon: "SplitSquareHorizontal", role: "受信トラフィックを複数のCloud Runインスタンスに分散し、高可用性とスケーラビリティを確保する。" },
      { id: "cdn", label: "Cloud CDN", service: "CDN", x: 150, y: 120, color: "#34A853", icon: "Globe", role: "静的アセット（画像・CSS・JS）をエッジキャッシュし、ユーザーに低レイテンシで配信する。" },
      { id: "armor", label: "Cloud Armor\n(WAF/DDoS)", service: "Security", x: 450, y: 120, color: "#EA4335", icon: "Shield", role: "DDoS攻撃やSQLインジェクション等のWeb攻撃からアプリケーションを防御する。" },
      { id: "run", label: "Cloud Run\n(App)", service: "Cloud Run", x: 300, y: 220, color: "#34A853", icon: "Play", role: "アプリケーションのビジネスロジックを実行するサーバーレスコンテナ。リクエスト量に応じて自動スケールする。" },
      { id: "sql", label: "Cloud SQL\n(PostgreSQL)", service: "Database", x: 300, y: 320, color: "#EA4335", icon: "Database", role: "アプリケーションの永続データ（ユーザー情報・トランザクション等）を格納するリレーショナルDB。" },
      { id: "gcs", label: "Cloud Storage\n(Static Assets)", service: "Storage", x: 150, y: 220, color: "#4285F4", icon: "HardDrive", role: "画像・動画・静的ファイルなどの非構造化データを格納し、CDN経由で配信する。" },
      { id: "secrets", label: "Secret Manager", service: "Security", x: 450, y: 220, color: "#EA4335", icon: "Key", role: "DBパスワードやAPIキーなどの機密情報を安全に管理し、Cloud Runから参照させる。" },
    ],
    edges: [
      { from: "internet", to: "lb" },
      { from: "internet", to: "cdn" },
      { from: "lb", to: "armor" },
      { from: "lb", to: "run" },
      { from: "cdn", to: "gcs" },
      { from: "run", to: "sql" },
      { from: "run", to: "secrets", dashed: true },
    ],
    useCases: ["SaaS Webアプリ", "ECサイト", "企業ポータル", "APIサーバー"],
    benefits: ["オートスケール", "管理負荷低減", "セキュリティ組み込み", "コスト効率"],
  },
  {
    id: "data-pipeline",
    name: "リアルタイムデータパイプライン",
    description:
      "Pub/Sub → Dataflow → BigQuery → Looker によるリアルタイムストリーミング分析パイプライン。IoTデータや行動ログの分析に最適。",
    category: "Analytics",
    tags: ["analytics", "streaming", "bigquery", "pubsub"],
    layers: [
      { id: "l-ingest", label: "Ingestion", color: "#5f6368", nodeIds: ["sources"] },
      { id: "l-messaging", label: "Messaging", color: "#FBBC05", nodeIds: ["pubsub"] },
      { id: "l-processing", label: "Processing", color: "#4285F4", nodeIds: ["dataflow", "dls"] },
      { id: "l-storage", label: "Storage / Analytics", color: "#4285F4", nodeIds: ["bq", "bigtable"] },
      { id: "l-viz", label: "Visualization", color: "#34A853", nodeIds: ["looker"] },
    ],
    nodes: [
      { id: "sources", label: "Data Sources\n(IoT/App/Logs)", service: "Source", x: 60, y: 200, color: "#5f6368", icon: "Radio", role: "IoTセンサー、アプリケーションログ、行動データなどのリアルタイムデータの発生源。" },
      { id: "pubsub", label: "Pub/Sub", service: "Pub/Sub", x: 200, y: 200, color: "#FBBC05", icon: "Radio", role: "データソースからのストリームを受信し、後続の処理サービスにリアルタイムで配信するメッセージバス。" },
      { id: "dataflow", label: "Dataflow\n(Apache Beam)", service: "Dataflow", x: 360, y: 200, color: "#4285F4", icon: "GitBranch", role: "ストリーミングデータのリアルタイム変換・集約・エンリッチメントを行うETL処理エンジン。" },
      { id: "bq", label: "BigQuery\n(DWH)", service: "BigQuery", x: 500, y: 160, color: "#4285F4", icon: "BarChart3", role: "加工済みデータを格納し、SQLによる高速な分析クエリを実行するデータウェアハウス。" },
      { id: "bigtable", label: "Cloud Bigtable\n(Low Latency)", service: "Bigtable", x: 500, y: 260, color: "#EA4335", icon: "LayoutGrid", role: "低レイテンシが要求されるリアルタイムサービング用データを格納するNoSQLストア。" },
      { id: "looker", label: "Looker Studio\n(Dashboard)", service: "Looker", x: 620, y: 120, color: "#4285F4", icon: "LineChart", role: "BigQueryのデータをリアルタイムダッシュボードとして可視化し、ビジネスKPIをモニタリングする。" },
      { id: "dls", label: "Cloud Storage\n(Data Lake)", service: "Storage", x: 360, y: 310, color: "#4285F4", icon: "HardDrive", role: "生データのアーカイブや再処理用のデータレイク。長期保存やバッチ分析の起点となる。" },
    ],
    edges: [
      { from: "sources", to: "pubsub" },
      { from: "pubsub", to: "dataflow" },
      { from: "dataflow", to: "bq" },
      { from: "dataflow", to: "bigtable" },
      { from: "dataflow", to: "dls", dashed: true },
      { from: "bq", to: "looker" },
    ],
    useCases: ["IoTセンサーデータ分析", "ユーザー行動分析", "不正検知", "リアルタイムKPI"],
    benefits: ["リアルタイム可視化", "ペタバイト規模対応", "フルマネージド", "SQL分析"],
  },
  {
    id: "ml-pipeline",
    name: "MLパイプライン",
    description:
      "Cloud Storage → Vertex AI Training → Vertex AI Endpoint → Cloud Run によるエンドツーエンドのML本番パイプライン。",
    category: "AI/ML",
    tags: ["ml", "vertex-ai", "mlops", "ai"],
    layers: [
      { id: "l-data-src", label: "Data Sources", color: "#4285F4", nodeIds: ["gcs-data", "bq-data"] },
      { id: "l-feature", label: "Feature Engineering", color: "#34A853", nodeIds: ["fs"] },
      { id: "l-train", label: "Training & Evaluation", color: "#4285F4", nodeIds: ["training", "eval"] },
      { id: "l-deploy", label: "Deployment", color: "#EA4335", nodeIds: ["registry", "endpoint", "batch"] },
      { id: "l-ops", label: "Monitoring / MLOps", color: "#FBBC05", nodeIds: ["monitoring"] },
    ],
    nodes: [
      { id: "gcs-data", label: "Cloud Storage\n(Training Data)", service: "Storage", x: 80, y: 180, color: "#4285F4", icon: "HardDrive", role: "学習用データセット（画像・テキスト・CSV等）を格納するデータソースストレージ。" },
      { id: "bq-data", label: "BigQuery\n(Features)", service: "BigQuery", x: 80, y: 280, color: "#4285F4", icon: "BarChart3", role: "構造化された特徴量データを格納し、Feature Storeへの入力元として機能する。" },
      { id: "fs", label: "Feature Store", service: "Vertex AI", x: 220, y: 230, color: "#4285F4", icon: "Database", role: "トレーニングとサービングで一貫した特徴量を管理・配信し、データスキューを防ぐ。" },
      { id: "training", label: "Vertex AI\nTraining", service: "Vertex AI", x: 360, y: 180, color: "#4285F4", icon: "Brain", role: "カスタムモデルまたはAutoMLでモデルを学習する。GPU/TPUリソースを自動管理。" },
      { id: "eval", label: "Model\nEvaluation", service: "Vertex AI", x: 360, y: 280, color: "#4285F4", icon: "CheckCircle", role: "学習済みモデルの精度・性能を評価し、デプロイ可否を判定するゲートウェイ。" },
      { id: "registry", label: "Model Registry", service: "Vertex AI", x: 490, y: 180, color: "#4285F4", icon: "Package", role: "評価済みモデルをバージョン管理し、本番デプロイへのパイプラインに接続する。" },
      { id: "endpoint", label: "Vertex AI\nEndpoint", service: "Vertex AI", x: 610, y: 130, color: "#4285F4", icon: "Cpu", role: "モデルをオンラインエンドポイントとしてデプロイし、リアルタイム推論リクエストに応答する。" },
      { id: "batch", label: "Batch\nPrediction", service: "Vertex AI", x: 610, y: 230, color: "#4285F4", icon: "List", role: "大量データに対するバッチ推論を実行し、結果をCloud StorageやBigQueryに出力する。" },
      { id: "monitoring", label: "Model\nMonitoring", service: "Vertex AI", x: 490, y: 300, color: "#FBBC05", icon: "Activity", role: "デプロイ済みモデルの予測ドリフトやデータスキューを継続的に監視しアラートする。" },
    ],
    edges: [
      { from: "gcs-data", to: "fs" },
      { from: "bq-data", to: "fs" },
      { from: "fs", to: "training" },
      { from: "training", to: "eval" },
      { from: "eval", to: "registry" },
      { from: "registry", to: "endpoint" },
      { from: "registry", to: "batch" },
      { from: "endpoint", to: "monitoring", dashed: true },
    ],
    useCases: ["レコメンデーションエンジン", "需要予測", "異常検知", "画像分類"],
    benefits: ["エンドツーエンド管理", "モデル監視", "CI/CD for ML", "再現性確保"],
  },
  {
    id: "microservices",
    name: "マイクロサービスアーキテクチャ",
    description:
      "GKE上で複数サービスを運用し、Pub/SubとCloud SQLでデータを管理する疎結合マイクロサービス。",
    category: "Architecture",
    tags: ["microservices", "gke", "kubernetes", "event-driven"],
    layers: [
      { id: "l-ingress", label: "Ingress / Gateway", color: "#34A853", nodeIds: ["lb2", "gateway"] },
      { id: "l-services", label: "Application Services (GKE)", color: "#4285F4", nodeIds: ["svc-a", "svc-b", "svc-c"] },
      { id: "l-middleware", label: "Middleware", color: "#FBBC05", nodeIds: ["pubsub2", "cache"] },
      { id: "l-data", label: "Data Layer", color: "#EA4335", nodeIds: ["db-user", "db-order"] },
    ],
    nodes: [
      { id: "lb2", label: "Cloud Load\nBalancing", service: "LB", x: 300, y: 30, color: "#34A853", icon: "SplitSquareHorizontal", role: "外部トラフィックを受け付け、API Gatewayに振り分けるエントリーポイント。" },
      { id: "gateway", label: "API Gateway\n/Istio", service: "GKE", x: 300, y: 120, color: "#4285F4", icon: "Router", role: "サービスメッシュとしてリクエストルーティング、認証、レート制限、トレーシングを担当する。" },
      { id: "svc-a", label: "User Service\n(Pod)", service: "GKE", x: 150, y: 220, color: "#4285F4", icon: "Users", role: "ユーザー管理（登録・認証・プロフィール）を担当する独立したマイクロサービス。" },
      { id: "svc-b", label: "Order Service\n(Pod)", service: "GKE", x: 300, y: 220, color: "#4285F4", icon: "ShoppingCart", role: "注文処理・在庫管理を担当し、イベントをPub/Subに発行する中核サービス。" },
      { id: "svc-c", label: "Notification\nService (Pod)", service: "GKE", x: 450, y: 220, color: "#4285F4", icon: "Bell", role: "Pub/Subからイベントを受信し、メール・プッシュ通知を送信する非同期サービス。" },
      { id: "pubsub2", label: "Pub/Sub\n(Events)", service: "Pub/Sub", x: 300, y: 320, color: "#FBBC05", icon: "Radio", role: "サービス間の非同期イベント配信を担い、疎結合な連携を実現するメッセージバス。" },
      { id: "db-user", label: "Cloud SQL\n(Users)", service: "Database", x: 150, y: 380, color: "#EA4335", icon: "Database", role: "User Serviceの専用DB。ユーザー情報を格納し、サービス間のデータ独立性を保つ。" },
      { id: "db-order", label: "Cloud SQL\n(Orders)", service: "Database", x: 300, y: 380, color: "#EA4335", icon: "Database", role: "Order Serviceの専用DB。注文・トランザクションデータを格納する。" },
      { id: "cache", label: "Memorystore\n(Redis)", service: "Cache", x: 450, y: 320, color: "#EA4335", icon: "Zap", role: "頻繁にアクセスされるデータをキャッシュし、DBへの負荷を軽減しレスポンスを高速化する。" },
    ],
    edges: [
      { from: "lb2", to: "gateway" },
      { from: "gateway", to: "svc-a" },
      { from: "gateway", to: "svc-b" },
      { from: "svc-b", to: "pubsub2" },
      { from: "pubsub2", to: "svc-c" },
      { from: "svc-a", to: "db-user" },
      { from: "svc-b", to: "db-order" },
      { from: "svc-a", to: "cache", dashed: true },
      { from: "svc-b", to: "cache", dashed: true },
    ],
    useCases: ["ECプラットフォーム", "金融システム", "SaaS基盤", "大規模Webサービス"],
    benefits: ["独立デプロイ", "技術スタック自由", "障害分離", "スケーラビリティ"],
  },
  {
    id: "serverless",
    name: "サーバーレスアーキテクチャ",
    description:
      "Cloud Functions + Firestore + Firebase Hosting による完全サーバーレス構成。インフラ管理が不要。",
    category: "Serverless",
    tags: ["serverless", "cloud-functions", "firestore", "firebase"],
    layers: [
      { id: "l-client", label: "Client", color: "#5f6368", nodeIds: ["browser"] },
      { id: "l-hosting", label: "Hosting / Auth", color: "#FBBC05", nodeIds: ["firebase", "auth"] },
      { id: "l-backend", label: "Backend Services", color: "#FBBC05", nodeIds: ["firestore2", "functions"] },
      { id: "l-infra", label: "Infrastructure", color: "#4285F4", nodeIds: ["pubsub3", "gcs3"] },
    ],
    nodes: [
      { id: "browser", label: "Browser / Mobile", service: "Client", x: 300, y: 30, color: "#5f6368", icon: "Monitor", role: "エンドユーザーのブラウザやモバイルアプリ。Firestoreとリアルタイム同期する。" },
      { id: "firebase", label: "Firebase Hosting\n(Static Files)", service: "Firebase", x: 300, y: 120, color: "#FBBC05", icon: "Globe", role: "SPAやPWAの静的ファイルをグローバルCDNで配信するホスティング基盤。" },
      { id: "firestore2", label: "Firestore\n(Real-time DB)", service: "Firestore", x: 150, y: 230, color: "#FBBC05", icon: "Flame", role: "ドキュメントDBとしてアプリデータを格納し、クライアントとリアルタイム同期する。" },
      { id: "functions", label: "Cloud Functions\n(Business Logic)", service: "Functions", x: 450, y: 230, color: "#FBBC05", icon: "Zap", role: "サーバーレス関数でビジネスロジックを実行。Firestoreトリガーやhttp呼び出しに対応。" },
      { id: "pubsub3", label: "Pub/Sub\n(Events)", service: "Pub/Sub", x: 450, y: 330, color: "#FBBC05", icon: "Radio", role: "Cloud Functionsからの非同期イベントを外部サービスや後続処理に配信する。" },
      { id: "gcs3", label: "Cloud Storage\n(Media)", service: "Storage", x: 150, y: 330, color: "#4285F4", icon: "HardDrive", role: "ユーザーがアップロードした画像・動画などのメディアファイルを格納する。" },
      { id: "auth", label: "Firebase Auth\n(Identity)", service: "Firebase", x: 300, y: 230, color: "#FBBC05", icon: "Lock", role: "ユーザー認証（メール/Google/SNS）を提供し、Firestoreのセキュリティルールと連携する。" },
    ],
    edges: [
      { from: "browser", to: "firebase" },
      { from: "browser", to: "auth" },
      { from: "firebase", to: "firestore2" },
      { from: "firebase", to: "functions" },
      { from: "functions", to: "pubsub3" },
      { from: "functions", to: "gcs3" },
      { from: "firestore2", to: "browser", dashed: true },
    ],
    useCases: ["モバイルバックエンド", "チャットアプリ", "リアルタイムダッシュボード", "スタートアップ"],
    benefits: ["ゼロ管理", "従量課金", "自動スケール", "迅速な開発"],
  },
  {
    id: "hybrid-cloud",
    name: "ハイブリッドクラウド",
    description:
      "Cloud Interconnect / Cloud VPN でオンプレミスとGCPを接続する企業向けハイブリッドアーキテクチャ。",
    category: "Networking",
    tags: ["hybrid", "vpn", "interconnect", "enterprise"],
    layers: [
      { id: "l-onprem", label: "On-Premises", color: "#5f6368", nodeIds: ["onprem"] },
      { id: "l-connectivity", label: "Connectivity", color: "#34A853", nodeIds: ["interconnect", "vpn"] },
      { id: "l-network", label: "GCP Network", color: "#34A853", nodeIds: ["vpc2", "iam2"] },
      { id: "l-workload", label: "GCP Workloads", color: "#4285F4", nodeIds: ["gce2", "gke2", "sql2"] },
    ],
    nodes: [
      { id: "onprem", label: "On-Premises\nDatacenter", service: "On-Prem", x: 80, y: 200, color: "#5f6368", icon: "Building2", role: "既存のオンプレミス環境。段階的にGCPへワークロードを移行する起点。" },
      { id: "interconnect", label: "Cloud\nInterconnect", service: "Network", x: 230, y: 150, color: "#34A853", icon: "Cable", role: "専用線でオンプレミスとGCPを高速・低レイテンシに接続。大容量データ転送に最適。" },
      { id: "vpn", label: "Cloud VPN", service: "Network", x: 230, y: 270, color: "#34A853", icon: "Lock", role: "IPsec VPNによるバックアップ接続。Interconnectの冗長化やコスト効率の良い接続手段。" },
      { id: "vpc2", label: "Shared VPC\n(Host Project)", service: "VPC", x: 380, y: 200, color: "#34A853", icon: "Network", role: "複数GCPプロジェクト間でネットワークを共有し、セキュリティポリシーを一元管理する。" },
      { id: "gce2", label: "Compute Engine\n(Lift & Shift)", service: "Compute", x: 510, y: 130, color: "#4285F4", icon: "Server", role: "オンプレミスからリフト＆シフトで移行されたVMワークロードを実行する。" },
      { id: "gke2", label: "GKE\n(Containers)", service: "GKE", x: 510, y: 200, color: "#4285F4", icon: "Box", role: "コンテナ化されたアプリケーションをKubernetesで管理。モダナイゼーションの受け皿。" },
      { id: "sql2", label: "Cloud SQL\n(Managed DB)", service: "Database", x: 510, y: 280, color: "#EA4335", icon: "Database", role: "オンプレミスDBから移行したデータベース。自動バックアップ・HA構成で運用負荷を削減。" },
      { id: "iam2", label: "Cloud IAM &\nCloud Directory", service: "Security", x: 380, y: 310, color: "#EA4335", icon: "Lock", role: "GCPリソースへのアクセスを一元管理。オンプレミスのAD/LDAPと連携した認証基盤。" },
    ],
    edges: [
      { from: "onprem", to: "interconnect" },
      { from: "onprem", to: "vpn", dashed: true },
      { from: "interconnect", to: "vpc2" },
      { from: "vpn", to: "vpc2", dashed: true },
      { from: "vpc2", to: "gce2" },
      { from: "vpc2", to: "gke2" },
      { from: "vpc2", to: "sql2" },
      { from: "iam2", to: "vpc2", dashed: true },
    ],
    useCases: ["レガシーシステム移行", "データ主権要件", "段階的クラウド移行", "エンタープライズ"],
    benefits: ["既存投資活用", "段階移行", "ハイブリッド運用", "コンプライアンス"],
  },
  {
    id: "adk-multi-agent",
    name: "ADK マルチエージェントアーキテクチャ",
    description:
      "Gemini ベースのオーケストレーターが複数の専門エージェント（検索・コード・データ）を協調させるマルチエージェントシステム。",
    category: "AI/ML",
    tags: ["adk", "agents", "gemini", "ai", "multi-agent"],
    layers: [
      { id: "l-input", label: "Input", color: "#5f6368", nodeIds: ["user-input"] },
      { id: "l-orchestration", label: "Orchestration Layer", color: "#4285F4", nodeIds: ["orchestrator", "vertex-llm"] },
      { id: "l-agents", label: "Specialist Agents", color: "#34A853", nodeIds: ["search-agent", "code-agent", "data-agent"] },
      { id: "l-tools", label: "Tool Layer", color: "#FBBC05", nodeIds: ["google-search", "code-exec", "bigquery-tool"] },
    ],
    nodes: [
      { id: "user-input", label: "User Input", service: "User", x: 60, y: 200, color: "#5f6368", icon: "MessageSquare", role: "ユーザーからの自然言語入力。オーケストレーターが意図を解析して適切なエージェントに振り分ける。" },
      { id: "orchestrator", label: "Orchestrator\n(Gemini)", service: "ADK", x: 220, y: 200, color: "#4285F4", icon: "Brain", role: "全体を統括するメインエージェント。タスクを分解し、専門エージェントに委譲・結果を統合する。" },
      { id: "search-agent", label: "Search Agent", service: "ADK", x: 400, y: 100, color: "#34A853", icon: "Search", role: "Web検索に特化した専門エージェント。最新情報の取得やファクトチェックを担当する。" },
      { id: "code-agent", label: "Code Agent", service: "ADK", x: 400, y: 200, color: "#4285F4", icon: "Code2", role: "コード生成・レビュー・デバッグに特化した専門エージェント。コード実行ツールを利用する。" },
      { id: "data-agent", label: "Data Agent", service: "ADK", x: 400, y: 300, color: "#EA4335", icon: "Database", role: "データ分析に特化した専門エージェント。BigQueryへのクエリ生成・実行・結果解釈を行う。" },
      { id: "google-search", label: "Google Search\nTool", service: "Tool", x: 560, y: 100, color: "#34A853", icon: "Globe", role: "Search AgentがWeb上の情報を検索するための外部ツール。" },
      { id: "code-exec", label: "Code Executor\nTool", service: "Tool", x: 560, y: 200, color: "#4285F4", icon: "Cpu", role: "Code Agentが生成したコードを安全なサンドボックスで実行・検証するツール。" },
      { id: "bigquery-tool", label: "BigQuery\nTool", service: "Tool", x: 560, y: 300, color: "#4285F4", icon: "BarChart3", role: "Data AgentがBigQueryに対してSQLクエリを実行し、分析結果を取得するツール。" },
      { id: "vertex-llm", label: "Vertex AI\n(LLM)", service: "Vertex AI", x: 220, y: 340, color: "#4285F4", icon: "Sparkles", role: "全エージェントの推論基盤。Geminiモデルを提供し、自然言語理解・生成を支える。" },
    ],
    edges: [
      { from: "user-input", to: "orchestrator" },
      { from: "orchestrator", to: "search-agent" },
      { from: "orchestrator", to: "code-agent" },
      { from: "orchestrator", to: "data-agent" },
      { from: "search-agent", to: "google-search" },
      { from: "code-agent", to: "code-exec" },
      { from: "data-agent", to: "bigquery-tool" },
      { from: "vertex-llm", to: "orchestrator", dashed: true },
      { from: "vertex-llm", to: "search-agent", dashed: true },
      { from: "vertex-llm", to: "code-agent", dashed: true },
      { from: "vertex-llm", to: "data-agent", dashed: true },
    ],
    useCases: ["カスタマーサポート自動化", "コードレビューボット", "データ分析エージェント", "研究支援AI"],
    benefits: ["マルチステップ推論", "ツール統合", "並列処理", "コンテキスト管理"],
  },
  {
    id: "genai-rag",
    name: "GenAI RAG パイプライン",
    description:
      "ドキュメントをベクトル化して Vector Search に格納し、Gemini が検索結果を基に回答するRAGアーキテクチャ。ハルシネーション低減に効果的。",
    category: "AI/ML",
    tags: ["rag", "gemini", "vector-search", "genai", "llm"],
    layers: [
      { id: "l-ingest", label: "Document Ingestion", color: "#5f6368", nodeIds: ["docs", "gcs"] },
      { id: "l-embedding", label: "Embedding / Index", color: "#4285F4", nodeIds: ["embeddings", "vector-search"] },
      { id: "l-query", label: "Query / Retrieval", color: "#34A853", nodeIds: ["user-query", "reranker"] },
      { id: "l-generation", label: "Generation / Monitoring", color: "#4285F4", nodeIds: ["gemini", "monitoring"] },
    ],
    nodes: [
      { id: "docs", label: "Documents", service: "Source", x: 40, y: 200, color: "#5f6368", icon: "HardDrive", role: "RAGの知識ソース。PDF・Webページ・社内文書などの非構造化ドキュメント。" },
      { id: "gcs", label: "Cloud Storage\n(GCS)", service: "Storage", x: 180, y: 200, color: "#4285F4", icon: "HardDrive", role: "ドキュメントの中間格納場所。チャンク分割前の原本を保管する。" },
      { id: "embeddings", label: "Vertex AI\nEmbeddings", service: "Vertex AI", x: 320, y: 200, color: "#4285F4", icon: "Brain", role: "テキストをベクトル（数値表現）に変換し、意味的類似度での検索を可能にする。" },
      { id: "vector-search", label: "Vector Search\n(Index)", service: "Vertex AI", x: 460, y: 200, color: "#4285F4", icon: "Search", role: "ベクトルインデックスを保持し、ユーザークエリに意味的に近いドキュメントを高速検索する。" },
      { id: "gemini", label: "Gemini\n(LLM)", service: "Vertex AI", x: 580, y: 200, color: "#4285F4", icon: "Sparkles", role: "検索結果を文脈として受け取り、ユーザーの質問に対する回答を生成するLLM。" },
      { id: "user-query", label: "User Query", service: "User", x: 460, y: 80, color: "#5f6368", icon: "MessageSquare", role: "ユーザーからの自然言語による質問。ベクトル化されてVector Searchで関連文書を検索する。" },
      { id: "reranker", label: "Reranker\n(Results)", service: "Vertex AI", x: 320, y: 320, color: "#FBBC05", icon: "Layers", role: "Vector Searchの検索結果を再ランキングし、最も関連性の高い文書をLLMに渡す。" },
      { id: "monitoring", label: "Monitoring\n(Quality)", service: "Cloud Ops", x: 580, y: 320, color: "#FBBC05", icon: "Activity", role: "RAGパイプラインの回答品質・レイテンシ・ハルシネーション率を継続的にモニタリングする。" },
    ],
    edges: [
      { from: "docs", to: "gcs" },
      { from: "gcs", to: "embeddings" },
      { from: "embeddings", to: "vector-search" },
      { from: "user-query", to: "vector-search" },
      { from: "vector-search", to: "reranker" },
      { from: "reranker", to: "gemini" },
      { from: "monitoring", to: "gemini", dashed: true },
    ],
    useCases: ["社内知識検索", "ドキュメントQA", "製品レコメンド", "コード検索"],
    benefits: ["ハルシネーション低減", "最新情報対応", "ドメイン特化", "引用付き回答"],
  },
  {
    id: "event-driven",
    name: "イベント駆動アーキテクチャ",
    description:
      "Eventarc がクラウドサービスのイベントをトリガーし、Cloud Functions / Cloud Run / Pub/Sub で疎結合に処理するイベント駆動アーキテクチャ。",
    category: "Architecture",
    tags: ["event-driven", "eventarc", "serverless", "cloud-functions"],
    layers: [
      { id: "l-sources", label: "Event Sources", color: "#4285F4", nodeIds: ["gcs-event", "gce-event", "firestore-event"] },
      { id: "l-router", label: "Event Router", color: "#34A853", nodeIds: ["eventarc"] },
      { id: "l-handlers", label: "Event Handlers", color: "#FBBC05", nodeIds: ["cf-handler", "run-handler", "pubsub"] },
      { id: "l-sinks", label: "Data Sinks", color: "#EA4335", nodeIds: ["bq-sink", "firestore-sink", "notification"] },
    ],
    nodes: [
      { id: "gcs-event", label: "Cloud Storage\n(Event)", service: "Storage", x: 60, y: 120, color: "#4285F4", icon: "HardDrive", role: "ファイルのアップロード・削除などのオブジェクトイベントを発生させるイベントソース。" },
      { id: "gce-event", label: "Compute Engine\n(Event)", service: "Compute", x: 60, y: 240, color: "#4285F4", icon: "Server", role: "VMの起動・停止・ステータス変更などのコンピューティングイベントを発生させるソース。" },
      { id: "firestore-event", label: "Firestore\n(Event)", service: "Firestore", x: 60, y: 360, color: "#FBBC05", icon: "Zap", role: "ドキュメントの作成・更新・削除を検知してイベントを発火するデータベーストリガー。" },
      { id: "eventarc", label: "Eventarc\n(Router)", service: "Eventarc", x: 220, y: 240, color: "#34A853", icon: "Radio", role: "各サービスのイベントを統一的に受信し、適切なハンドラーにルーティングする中枢。" },
      { id: "cf-handler", label: "Cloud Functions\n(Handler)", service: "Functions", x: 380, y: 120, color: "#FBBC05", icon: "Zap", role: "軽量なイベント処理を担当するサーバーレスハンドラー。データ変換や集計に使用。" },
      { id: "run-handler", label: "Cloud Run\n(Handler)", service: "Cloud Run", x: 380, y: 240, color: "#34A853", icon: "Play", role: "重い処理や長時間実行が必要なイベントハンドラー。コンテナベースで柔軟に対応。" },
      { id: "pubsub", label: "Pub/Sub\n(Queue)", service: "Pub/Sub", x: 380, y: 360, color: "#FBBC05", icon: "Radio", role: "イベントをキューイングし、下流の通知サービスに非同期で配信するバッファ。" },
      { id: "bq-sink", label: "BigQuery\n(Sink)", service: "BigQuery", x: 540, y: 120, color: "#4285F4", icon: "BarChart3", role: "処理済みイベントデータを蓄積し、後続の分析・レポーティングに活用するシンク。" },
      { id: "firestore-sink", label: "Firestore\n(Sink)", service: "Firestore", x: 540, y: 240, color: "#FBBC05", icon: "Zap", role: "処理結果をリアルタイムDBに格納し、アプリケーションから即座に参照可能にする。" },
      { id: "notification", label: "Notification\n(Slack/Email)", service: "Notification", x: 540, y: 360, color: "#34A853", icon: "MessageSquare", role: "イベント処理結果をSlack・メール等で関係者に通知するアウトプットサービス。" },
    ],
    edges: [
      { from: "gcs-event", to: "eventarc" },
      { from: "gce-event", to: "eventarc" },
      { from: "firestore-event", to: "eventarc" },
      { from: "eventarc", to: "cf-handler" },
      { from: "eventarc", to: "run-handler" },
      { from: "eventarc", to: "pubsub" },
      { from: "cf-handler", to: "bq-sink" },
      { from: "run-handler", to: "firestore-sink" },
      { from: "pubsub", to: "notification" },
    ],
    useCases: ["画像処理パイプライン", "監査ログ収集", "リアルタイム通知", "データ変換"],
    benefits: ["疎結合設計", "スケーラブル", "コスト効率", "マネージドイベント"],
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD パイプライン",
    description:
      "GitHub → Cloud Build → Artifact Registry → Cloud Deploy → GKE による自動化されたCI/CDパイプライン。dev/staging/prod 環境への段階的デプロイに対応。",
    category: "DevOps",
    tags: ["cicd", "cloud-build", "gke", "cloud-deploy", "devops"],
    layers: [
      { id: "l-source", label: "Source", color: "#5f6368", nodeIds: ["github"] },
      { id: "l-ci", label: "CI (Build & Test)", color: "#34A853", nodeIds: ["cloud-build", "sonar"] },
      { id: "l-registry", label: "Artifact Management", color: "#4285F4", nodeIds: ["artifact-reg"] },
      { id: "l-cd", label: "CD (Delivery)", color: "#34A853", nodeIds: ["cloud-deploy", "monitoring"] },
      { id: "l-env", label: "Target Environments", color: "#4285F4", nodeIds: ["gke-dev", "gke-staging", "gke-prod"] },
    ],
    nodes: [
      { id: "github", label: "GitHub\n(Source)", service: "GitHub", x: 40, y: 200, color: "#5f6368", icon: "Code2", role: "ソースコードのバージョン管理。push/PRイベントでCI/CDパイプラインをトリガーする。" },
      { id: "cloud-build", label: "Cloud Build\n(CI)", service: "Cloud Build", x: 180, y: 200, color: "#34A853", icon: "GitBranch", role: "コードのビルド・テスト・コンテナイメージ作成を自動実行するCIステージ。" },
      { id: "artifact-reg", label: "Artifact Registry\n(Images)", service: "Artifact Registry", x: 320, y: 200, color: "#4285F4", icon: "Package", role: "ビルド済みコンテナイメージを安全に保管し、デプロイパイプラインに提供する。" },
      { id: "cloud-deploy", label: "Cloud Deploy\n(CD)", service: "Cloud Deploy", x: 460, y: 200, color: "#34A853", icon: "Play", role: "dev→staging→prodへの段階的デプロイを管理。承認フローやロールバックに対応。" },
      { id: "gke-dev", label: "GKE\n(dev)", service: "GKE", x: 580, y: 100, color: "#4285F4", icon: "Box", role: "開発環境のKubernetesクラスタ。最初にデプロイされ、開発者が動作確認を行う。" },
      { id: "gke-staging", label: "GKE\n(staging)", service: "GKE", x: 580, y: 200, color: "#4285F4", icon: "Box", role: "ステージング環境。本番同等の構成でQAテスト・負荷テストを実施する。" },
      { id: "gke-prod", label: "GKE\n(prod)", service: "GKE", x: 580, y: 300, color: "#4285F4", icon: "Box", role: "本番環境のKubernetesクラスタ。承認後に最終デプロイされ、エンドユーザーに公開される。" },
      { id: "sonar", label: "Security Scan\n(Quality)", service: "Tool", x: 180, y: 320, color: "#FBBC05", icon: "TestTube", role: "コード品質チェックとセキュリティ脆弱性スキャンを実行し、問題があればビルドを停止する。" },
      { id: "monitoring", label: "Monitoring\n(Observe)", service: "Cloud Ops", x: 460, y: 320, color: "#FBBC05", icon: "Activity", role: "デプロイ後のアプリケーション稼働状況を監視し、問題検知時にロールバックを促す。" },
    ],
    edges: [
      { from: "github", to: "cloud-build" },
      { from: "cloud-build", to: "sonar", dashed: true },
      { from: "cloud-build", to: "artifact-reg" },
      { from: "artifact-reg", to: "cloud-deploy" },
      { from: "cloud-deploy", to: "gke-dev" },
      { from: "cloud-deploy", to: "gke-staging" },
      { from: "cloud-deploy", to: "gke-prod" },
      { from: "monitoring", to: "cloud-deploy", dashed: true },
    ],
    useCases: ["アプリケーションデプロイ", "マイクロサービスCI/CD", "ML モデルデプロイ", "インフラ自動化"],
    benefits: ["デプロイ自動化", "ロールバック対応", "環境一貫性", "セキュリティスキャン"],
  },
  {
    id: "analytics-platform",
    name: "アナリティクスデータプラットフォーム",
    description:
      "複数ソースからデータレイク（GCS）に集約し、Dataproc/Dataflow で加工、BigQuery + Looker でBI分析する統合データプラットフォーム。",
    category: "Analytics",
    tags: ["analytics", "bigquery", "dataproc", "looker", "data-platform"],
    layers: [
      { id: "l-sources", label: "Data Sources", color: "#5f6368", nodeIds: ["db-source", "api-source"] },
      { id: "l-lake", label: "Data Lake", color: "#4285F4", nodeIds: ["gcs-lake", "dataplex"] },
      { id: "l-processing", label: "Processing / Transform", color: "#4285F4", nodeIds: ["dataproc", "dataflow", "dbt"] },
      { id: "l-warehouse", label: "Data Warehouse", color: "#4285F4", nodeIds: ["bq-raw", "bq-dwh"] },
      { id: "l-bi", label: "BI / Visualization", color: "#34A853", nodeIds: ["looker"] },
    ],
    nodes: [
      { id: "db-source", label: "DB Sources\n(RDB/SaaS)", service: "Source", x: 40, y: 140, color: "#5f6368", icon: "Database", role: "既存のRDBやSaaSからのデータ取り込み元。CDC（Change Data Capture）やバッチ抽出で連携する。" },
      { id: "api-source", label: "API Sources\n(REST/Stream)", service: "Source", x: 40, y: 260, color: "#5f6368", icon: "Globe", role: "REST APIやストリーミングAPIから取得する外部データソース。リアルタイム/バッチ両方に対応。" },
      { id: "gcs-lake", label: "Cloud Storage\n(Data Lake)", service: "Storage", x: 200, y: 200, color: "#4285F4", icon: "HardDrive", role: "全データの一次格納場所（Data Lake）。生データをスキーマレスで保管し、後続処理に提供する。" },
      { id: "dataproc", label: "Dataproc\n(Batch)", service: "Dataproc", x: 360, y: 120, color: "#4285F4", icon: "Cpu", role: "Spark/Hadoopによる大規模バッチ処理。日次・週次のデータ変換ジョブを実行する。" },
      { id: "dataflow", label: "Dataflow\n(Streaming)", service: "Dataflow", x: 360, y: 200, color: "#4285F4", icon: "GitBranch", role: "ストリーミングデータのリアルタイム変換処理。ニアリアルタイムでDWHにデータを投入する。" },
      { id: "dbt", label: "dbt\n(Transform)", service: "dbt", x: 360, y: 300, color: "#FBBC05", icon: "Code2", role: "SQLベースのデータ変換（ELTのT）。Raw→DWHレイヤーのデータモデリングとテストを担当する。" },
      { id: "bq-raw", label: "BigQuery\n(Raw Layer)", service: "BigQuery", x: 520, y: 120, color: "#4285F4", icon: "BarChart3", role: "加工前の生データを格納するRawレイヤー。データの原本として保持し、再処理に備える。" },
      { id: "bq-dwh", label: "BigQuery\n(DWH Layer)", service: "BigQuery", x: 520, y: 220, color: "#4285F4", icon: "BarChart3", role: "ビジネスロジックを適用した分析用DWHレイヤー。BIツールからの直接クエリに対応する。" },
      { id: "looker", label: "Looker\n(BI/Dashboard)", service: "Looker", x: 600, y: 160, color: "#4285F4", icon: "Activity", role: "DWHのデータをダッシュボード・レポートとして可視化し、ビジネスユーザーに提供する。" },
      { id: "dataplex", label: "Dataplex\n(Governance)", service: "Dataplex", x: 200, y: 340, color: "#34A853", icon: "Layers", role: "データカタログ・品質管理・アクセス制御を統合管理するデータガバナンス基盤。" },
    ],
    edges: [
      { from: "db-source", to: "gcs-lake" },
      { from: "api-source", to: "gcs-lake" },
      { from: "gcs-lake", to: "dataproc" },
      { from: "gcs-lake", to: "dataflow" },
      { from: "dataproc", to: "bq-raw" },
      { from: "dataflow", to: "bq-dwh" },
      { from: "dbt", to: "bq-dwh" },
      { from: "bq-raw", to: "dbt", dashed: true },
      { from: "bq-dwh", to: "looker" },
      { from: "dataplex", to: "gcs-lake", dashed: true },
      { from: "dataplex", to: "bq-dwh", dashed: true },
    ],
    useCases: ["データウェアハウス構築", "BI・可視化", "データメッシュ", "MLデータ基盤"],
    benefits: ["統合データ管理", "セルフサービスBI", "データ品質管理", "コスト最適化"],
  },
]

export function getArchById(id: string): Architecture | undefined {
  return ARCHITECTURES.find((a) => a.id === id)
}
