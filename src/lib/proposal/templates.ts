import type { Requirement, Industry, TimelinePhase, ChallengePoint } from "@/lib/types/proposal"

export interface TemplateService {
  productId: string
  name: string
  role: string
  reason: string
  tier: string
}

export interface SupplementaryRule {
  when: Requirement[]
  add: TemplateService[]
}

export interface ProposalTemplate {
  id: string
  name: string
  matchRequirements: Requirement[]
  matchIndustries: Industry[]
  baseArchitectureId: string
  coreServices: TemplateService[]
  supplementaryRules: SupplementaryRule[]
  baseTimeline: TimelinePhase[]
  baseChallenges: ChallengePoint[]
  titleTemplate: string
  summaryTemplate: string
}

export const PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  /* ── 1. 標準Webアプリケーション ── */
  {
    id: "tpl-web-standard",
    name: "標準Webアプリケーション",
    matchRequirements: ["web-app", "api-backend"],
    matchIndustries: ["retail", "startup", "education"],
    baseArchitectureId: "3tier-web",
    coreServices: [
      { productId: "cloud-run", name: "Cloud Run", role: "アプリケーションサーバー", reason: "コンテナベースでオートスケール対応、コールドスタートが短く高速起動", tier: "CPU: 2vCPU / メモリ: 1GiB" },
      { productId: "cloud-sql", name: "Cloud SQL", role: "メインデータベース", reason: "フルマネージドRDB、自動バックアップ・高可用性構成に対応", tier: "db-standard-2 (2vCPU/7.5GB)" },
      { productId: "cloud-load-balancing", name: "Cloud Load Balancing", role: "ロードバランサー", reason: "グローバル対応のL7ロードバランサー、SSL終端を担当", tier: "Global External HTTP(S)" },
      { productId: "cloud-storage", name: "Cloud Storage", role: "静的アセット・メディア保存", reason: "高耐久性のオブジェクトストレージ、CDNと連携で高速配信", tier: "Standard Storage" },
      { productId: "secret-manager", name: "Secret Manager", role: "シークレット管理", reason: "DB接続情報やAPIキーの安全な管理・ローテーション", tier: "Standard" },
      { productId: "cloud-cdn", name: "Cloud CDN", role: "コンテンツ配信", reason: "静的コンテンツをエッジキャッシュ、レイテンシ削減", tier: "Standard" },
    ],
    supplementaryRules: [
      { when: ["ci-cd"], add: [
        { productId: "cloud-build", name: "Cloud Build", role: "CI/CDパイプライン", reason: "Dockerビルドとテスト自動化", tier: "Standard" },
        { productId: "artifact-registry", name: "Artifact Registry", role: "コンテナイメージ管理", reason: "セキュアなDockerレジストリ", tier: "Standard" },
      ]},
      { when: ["security-compliance"], add: [
        { productId: "cloud-armor", name: "Cloud Armor", role: "WAF/DDoS防御", reason: "OWASP Top 10対応のWAFルール", tier: "Standard" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: 設計・PoC", durationWeeks: 2, tasks: ["要件定義・画面設計", "技術スタック選定", "PoC環境構築"], services: ["cloud-run", "cloud-sql"] },
      { phase: "Phase 2: インフラ構築", durationWeeks: 3, tasks: ["VPC/ネットワーク設計", "Cloud SQL HA構成", "Cloud Run サービス設定", "CI/CDパイプライン構築"], services: ["cloud-sql", "cloud-load-balancing", "cloud-cdn"] },
      { phase: "Phase 3: アプリケーション開発", durationWeeks: 5, tasks: ["API開発", "フロントエンド開発", "認証・認可実装", "外部API連携"], services: ["cloud-run", "secret-manager"] },
      { phase: "Phase 4: テスト・移行", durationWeeks: 2, tasks: ["結合テスト", "負荷テスト", "データ移行", "セキュリティテスト"], services: ["cloud-run", "cloud-sql"] },
      { phase: "Phase 5: 本番稼働", durationWeeks: 1, tasks: ["DNS切り替え", "監視設定", "運用ドキュメント整備", "運用チームへの引き継ぎ"], services: ["cloud-load-balancing", "cloud-cdn"] },
    ],
    baseChallenges: [
      { category: "technical", title: "データベース移行リスク", description: "既存DBからCloud SQLへのデータ移行時にスキーマ差異やデータ型の非互換が発生する可能性があります。", mitigation: "Database Migration Service を活用し、ダウンタイムを最小化した段階的な移行を実施。事前にテスト移行を複数回行い、差異を洗い出します。" },
      { category: "technical", title: "コールドスタート対策", description: "Cloud Runはリクエストがない時間帯にインスタンスが0になるため、初回アクセス時のレイテンシが課題となります。", mitigation: "min-instances を1以上に設定してウォームインスタンスを維持。コンテナの起動時間を最適化（軽量ベースイメージ、遅延初期化）します。" },
      { category: "organizational", title: "開発チーム体制", description: "クラウドネイティブ開発の経験が少ない場合、学習コストと初期の生産性低下が懸念されます。", mitigation: "Google Cloud のトレーニングプログラムを活用し、PoC フェーズで技術検証と並行してスキルアップを図ります。" },
      { category: "cost", title: "コスト最適化", description: "開発・ステージング環境のコストが本番と同等にならないよう注意が必要です。", mitigation: "非本番環境はスケールダウン構成とし、Cloud Scheduler で夜間・休日にリソースを縮小するスケジュールを設定します。" },
    ],
    titleTemplate: "{client}様 {industry}向け Webアプリケーション基盤 構築提案書",
    summaryTemplate: "{client}様の{industry}事業におけるWebアプリケーション基盤として、Google Cloud の Cloud Run を中心としたスケーラブルな3層アーキテクチャをご提案いたします。{scale}規模の要件に対し、フルマネージドサービスを活用することで運用負荷を最小化しつつ、高い可用性とパフォーマンスを実現します。",
  },

  /* ── 2. データ分析基盤 ── */
  {
    id: "tpl-data-analytics",
    name: "データ分析基盤",
    matchRequirements: ["realtime-analytics", "data-warehouse", "batch-processing"],
    matchIndustries: ["retail", "finance", "media"],
    baseArchitectureId: "data-pipeline",
    coreServices: [
      { productId: "bigquery", name: "BigQuery", role: "データウェアハウス", reason: "ペタバイト規模のサーバーレスDWH、SQL分析が高速", tier: "On-demand / Flat-rate slots" },
      { productId: "dataflow", name: "Dataflow", role: "ストリーミング/バッチ処理", reason: "Apache Beamベースのフルマネージドデータ処理エンジン", tier: "Standard Workers" },
      { productId: "pub-sub", name: "Pub/Sub", role: "メッセージング基盤", reason: "リアルタイムデータ取り込みのメッセージキュー", tier: "Standard" },
      { productId: "cloud-storage", name: "Cloud Storage", role: "データレイク", reason: "生データの長期保存・バッチ処理の入力ソース", tier: "Standard / Nearline" },
      { productId: "looker-studio", name: "Looker Studio", role: "BI・ダッシュボード", reason: "BigQueryと直接連携したデータ可視化", tier: "Free / Pro" },
      { productId: "dataproc", name: "Dataproc", role: "Spark/Hadoopバッチ処理", reason: "既存Sparkジョブの移行先として最適", tier: "Standard (Autoscaling)" },
    ],
    supplementaryRules: [
      { when: ["ml-prediction"], add: [
        { productId: "vertex-ai", name: "Vertex AI", role: "ML予測モデル", reason: "BigQueryデータを活用したML予測", tier: "Standard" },
      ]},
      { when: ["iot"], add: [
        { productId: "bigtable", name: "Cloud Bigtable", role: "IoT低レイテンシDB", reason: "時系列データの高速書き込み・読み取り", tier: "SSD 3-node" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: データ設計", durationWeeks: 3, tasks: ["データソース棚卸し", "データカタログ設計", "ETL/ELTパイプライン設計", "アクセス権限設計"], services: ["bigquery", "cloud-storage"] },
      { phase: "Phase 2: パイプライン構築", durationWeeks: 4, tasks: ["Pub/Subトピック設計", "Dataflowジョブ開発", "Dataprocバッチジョブ移行", "データ品質チェック実装"], services: ["pub-sub", "dataflow", "dataproc"] },
      { phase: "Phase 3: DWH構築", durationWeeks: 3, tasks: ["BigQueryデータセット設計", "パーティショニング/クラスタリング最適化", "データマート作成", "クエリ最適化"], services: ["bigquery"] },
      { phase: "Phase 4: BI構築", durationWeeks: 2, tasks: ["ダッシュボード設計", "KPIアラート設定", "ユーザートレーニング"], services: ["looker-studio"] },
      { phase: "Phase 5: 運用移管", durationWeeks: 1, tasks: ["運用手順書作成", "監視・アラート設定", "コスト最適化レビュー"], services: ["cloud-monitoring"] },
    ],
    baseChallenges: [
      { category: "technical", title: "データ品質管理", description: "複数ソースからのデータ統合において、フォーマットの不整合やデータ欠損が品質低下を引き起こすリスクがあります。", mitigation: "Dataplex を活用したデータ品質ルールの定義と自動チェックを導入。データリネージの可視化でトレーサビリティを確保します。" },
      { category: "cost", title: "BigQuery コスト管理", description: "オンデマンドクエリの場合、スキャン量に応じて課金されるため、不適切なクエリがコスト増大を招く可能性があります。", mitigation: "BigQuery のスロット予約（Flat-rate）の検討、パーティショニング・クラスタリングの最適化、カスタムコストアラートを設定します。" },
      { category: "organizational", title: "データリテラシーの向上", description: "分析基盤を構築しても、利用者のSQLスキルやデータ分析力が不足しているとROIが低下します。", mitigation: "BigQuery のデータカタログとカラム説明を充実させ、社内トレーニングプログラムを並行して実施します。" },
      { category: "technical", title: "スキーマ進化への対応", description: "事業の変化に伴いデータスキーマが頻繁に変わる可能性があり、既存パイプラインへの影響が懸念されます。", mitigation: "スキーマバージョニングを導入し、BigQuery のスキーマ自動検出機能やネストされたフィールドを活用して後方互換性を維持します。" },
    ],
    titleTemplate: "{client}様 {industry}向け データ分析基盤 構築提案書",
    summaryTemplate: "{client}様の{industry}事業におけるデータ駆動型意思決定を実現するため、BigQuery を中核としたリアルタイム・バッチ統合データ分析基盤をご提案いたします。{scale}規模に対応したスケーラブルなパイプラインにより、データの収集・加工・蓄積・可視化を一気通貫で実現します。",
  },

  /* ── 3. ML/AIプラットフォーム ── */
  {
    id: "tpl-ml-platform",
    name: "ML/AIプラットフォーム",
    matchRequirements: ["ml-prediction"],
    matchIndustries: ["retail", "finance", "healthcare"],
    baseArchitectureId: "ml-pipeline",
    coreServices: [
      { productId: "vertex-ai", name: "Vertex AI", role: "MLプラットフォーム", reason: "トレーニングからデプロイまでのエンドツーエンドML基盤", tier: "Standard (GPU: T4)" },
      { productId: "cloud-storage", name: "Cloud Storage", role: "学習データストレージ", reason: "大規模な学習データの保存と高速アクセス", tier: "Standard Storage" },
      { productId: "bigquery", name: "BigQuery", role: "特徴量管理・分析", reason: "Feature StoreとBigQuery ML による効率的な特徴量管理", tier: "On-demand" },
      { productId: "cloud-run", name: "Cloud Run", role: "推論APIサーバー", reason: "推論エンドポイントのサーバーレスホスティング", tier: "CPU: 4vCPU / メモリ: 8GiB" },
      { productId: "cloud-monitoring", name: "Cloud Monitoring", role: "モデル監視", reason: "推論レイテンシ・精度劣化の監視・アラート", tier: "Standard" },
    ],
    supplementaryRules: [
      { when: ["realtime-analytics"], add: [
        { productId: "dataflow", name: "Dataflow", role: "リアルタイム特徴量計算", reason: "ストリーミングデータからの特徴量抽出", tier: "Standard Workers" },
      ]},
      { when: ["ci-cd"], add: [
        { productId: "cloud-build", name: "Cloud Build", role: "MLパイプラインCI", reason: "モデル学習パイプラインの自動化", tier: "Standard" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: ML設計・データ分析", durationWeeks: 3, tasks: ["ビジネス課題のML問題定義", "データ分析(EDA)", "特徴量候補の選定", "評価指標の定義"], services: ["bigquery", "cloud-storage"] },
      { phase: "Phase 2: モデル開発", durationWeeks: 5, tasks: ["ベースラインモデル構築", "ハイパーパラメータチューニング", "モデル評価・バイアスチェック", "Feature Store 構築"], services: ["vertex-ai", "bigquery"] },
      { phase: "Phase 3: API化・デプロイ", durationWeeks: 3, tasks: ["推論API開発", "A/Bテスト基盤構築", "ロードテスト", "モデルレジストリ登録"], services: ["cloud-run", "vertex-ai"] },
      { phase: "Phase 4: 監視・MLOps構築", durationWeeks: 2, tasks: ["モデルドリフト検知設定", "再学習パイプライン構築", "ダッシュボード構築"], services: ["cloud-monitoring", "vertex-ai"] },
      { phase: "Phase 5: 本番稼働", durationWeeks: 1, tasks: ["本番切り替え", "運用手順整備", "チームトレーニング"], services: ["cloud-run"] },
    ],
    baseChallenges: [
      { category: "technical", title: "学習データの偏り(バイアス)", description: "学習データに偏りがあると、モデルの予測精度が特定のセグメントで著しく低下するリスクがあります。", mitigation: "Vertex AI の Explainable AI 機能を活用し、モデルの判断根拠を可視化。What-if Tool で公平性を継続的に評価します。" },
      { category: "technical", title: "モデルドリフトへの対応", description: "本番環境でのデータ分布変化により、時間経過とともにモデル精度が劣化する可能性があります。", mitigation: "Vertex AI Model Monitoring でデータドリフト・コンセプトドリフトを検知し、閾値超過時に自動再学習パイプラインをトリガーします。" },
      { category: "cost", title: "GPU学習コストの管理", description: "大規模モデルの学習にはGPUインスタンスが必要で、長時間の学習ジョブがコスト増大を招きます。", mitigation: "Spot VM によるコスト削減、学習ジョブのプリエンプション耐性設計、小規模データでの早期停止(Early Stopping)を実装します。" },
      { category: "organizational", title: "MLOps体制の構築", description: "MLモデルの運用には、データサイエンティストとMLエンジニアの継続的な協業体制が必要です。", mitigation: "Vertex AI Pipelines で再現可能なMLワークフローを標準化し、チーム間のコラボレーションを促進します。" },
    ],
    titleTemplate: "{client}様 {industry}向け ML/AIプラットフォーム 構築提案書",
    summaryTemplate: "{client}様の{industry}事業における機械学習活用を実現するため、Vertex AI を中核としたエンドツーエンドMLプラットフォームをご提案いたします。データ準備からモデル学習・デプロイ・監視までを一貫して管理し、{scale}規模でのML運用を効率化します。",
  },

  /* ── 4. マイクロサービス基盤 ── */
  {
    id: "tpl-microservices",
    name: "マイクロサービス基盤",
    matchRequirements: ["microservices", "api-backend", "event-driven"],
    matchIndustries: ["finance", "retail", "gaming"],
    baseArchitectureId: "microservices",
    coreServices: [
      { productId: "gke", name: "GKE", role: "コンテナオーケストレーション", reason: "Kubernetesベースのマイクロサービス実行基盤", tier: "Autopilot (推奨) / Standard" },
      { productId: "cloud-sql", name: "Cloud SQL", role: "サービス別データベース", reason: "各マイクロサービスの専用DB (Database per Service)", tier: "db-standard-2 HA構成" },
      { productId: "memorystore", name: "Memorystore", role: "キャッシュ/セッション", reason: "Redis互換の低レイテンシキャッシュ", tier: "Standard (M1 6GB)" },
      { productId: "pub-sub", name: "Pub/Sub", role: "イベントバス", reason: "サービス間の非同期イベント通信", tier: "Standard" },
      { productId: "cloud-load-balancing", name: "Cloud Load Balancing", role: "Ingress LB", reason: "サービスメッシュへのトラフィック分散", tier: "Global External HTTP(S)" },
      { productId: "artifact-registry", name: "Artifact Registry", role: "コンテナレジストリ", reason: "Docker イメージのセキュアな管理", tier: "Standard" },
    ],
    supplementaryRules: [
      { when: ["ci-cd"], add: [
        { productId: "cloud-build", name: "Cloud Build", role: "CI/CD", reason: "サービスごとの独立したビルドパイプライン", tier: "Standard" },
        { productId: "cloud-deploy", name: "Cloud Deploy", role: "デリバリーパイプライン", reason: "dev → staging → prod の段階的デプロイ", tier: "Standard" },
      ]},
      { when: ["high-availability"], add: [
        { productId: "cloud-spanner", name: "Cloud Spanner", role: "グローバル分散DB", reason: "マルチリージョン対応の強整合性DB", tier: "1-node Regional" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: アーキテクチャ設計", durationWeeks: 3, tasks: ["ドメイン分析・サービス境界設計", "API契約定義(OpenAPI)", "データ分割戦略策定", "CI/CDパイプライン設計"], services: ["gke"] },
      { phase: "Phase 2: GKE基盤構築", durationWeeks: 4, tasks: ["GKE Autopilotクラスター構築", "Istioサービスメッシュ設定", "Namespace/RBAC設計", "モニタリング基盤構築"], services: ["gke", "cloud-load-balancing"] },
      { phase: "Phase 3: サービス開発", durationWeeks: 6, tasks: ["コアサービス実装", "イベント駆動連携実装", "API Gateway設定", "統合テスト"], services: ["cloud-sql", "pub-sub", "memorystore"] },
      { phase: "Phase 4: 統合テスト・負荷テスト", durationWeeks: 3, tasks: ["E2Eテスト", "カオスエンジニアリング", "パフォーマンスチューニング", "セキュリティスキャン"], services: ["gke"] },
      { phase: "Phase 5: 移行・本番稼働", durationWeeks: 2, tasks: ["段階的トラフィック移行", "既存システムとの並行運用", "運用チームトレーニング", "ランブック整備"], services: ["cloud-load-balancing"] },
    ],
    baseChallenges: [
      { category: "technical", title: "サービス境界の設計", description: "不適切なサービス分割は、分散モノリスとなり複雑性だけが増大するリスクがあります。", mitigation: "ドメイン駆動設計(DDD)のBounded Context分析を実施し、チームトポロジーに合わせたサービス境界を定義します。" },
      { category: "technical", title: "分散トランザクション", description: "サービス間をまたぐ一貫性が必要なトランザクションの実装が複雑化します。", mitigation: "Sagaパターンを採用し、Pub/Sub による補償トランザクションで結果整合性を実現。必要に応じて Cloud Spanner を導入します。" },
      { category: "technical", title: "可観測性の確保", description: "マイクロサービス環境では、障害の原因特定が困難になります。", mitigation: "Cloud Trace/Profiler/Logging を統合した分散トレーシングを導入。OpenTelemetry 標準でサービス間の依存関係を可視化します。" },
      { category: "organizational", title: "チーム組織の適合", description: "コンウェイの法則に基づき、マイクロサービスの成功にはチーム組織構造の見直しが必要になる場合があります。", mitigation: "各サービスのオーナーシップを明確化し、DevOps文化の醸成とともにPlatformチームが横断的な基盤を提供する体制を構築します。" },
    ],
    titleTemplate: "{client}様 {industry}向け マイクロサービス基盤 構築提案書",
    summaryTemplate: "{client}様の{industry}事業の成長に合わせてスケールするマイクロサービスアーキテクチャを、GKE Autopilot を中心に構築いたします。{scale}規模の要件に対し、サービス間の疎結合な設計とイベント駆動連携により、開発の独立性と運用の効率性を両立します。",
  },

  /* ── 5. サーバーレスアプリケーション ── */
  {
    id: "tpl-serverless",
    name: "サーバーレスアプリケーション",
    matchRequirements: ["serverless", "mobile-backend"],
    matchIndustries: ["startup", "education", "media"],
    baseArchitectureId: "serverless",
    coreServices: [
      { productId: "cloud-functions", name: "Cloud Functions", role: "ビジネスロジック", reason: "イベント駆動のサーバーレス関数", tier: "2nd Gen (2vCPU/1GiB)" },
      { productId: "firestore", name: "Firestore", role: "リアルタイムDB", reason: "リアルタイム同期対応のNoSQLデータベース", tier: "Native Mode" },
      { productId: "firebase-hosting", name: "Firebase Hosting", role: "静的ホスティング", reason: "SPAのグローバル配信", tier: "Spark / Blaze" },
      { productId: "firebase-auth", name: "Firebase Auth", role: "認証基盤", reason: "ソーシャルログイン・多要素認証を簡単に実装", tier: "Standard" },
      { productId: "cloud-storage", name: "Cloud Storage", role: "メディアストレージ", reason: "ユーザーアップロードファイルの保存", tier: "Standard" },
    ],
    supplementaryRules: [
      { when: ["api-backend"], add: [
        { productId: "cloud-run", name: "Cloud Run", role: "REST API サーバー", reason: "複雑なAPIロジックのコンテナ実行", tier: "CPU: 2vCPU" },
      ]},
      { when: ["content-delivery"], add: [
        { productId: "cloud-cdn", name: "Cloud CDN", role: "コンテンツ配信", reason: "メディアファイルの高速配信", tier: "Standard" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: 設計", durationWeeks: 1, tasks: ["Firestore データモデル設計", "Cloud Functions 設計", "セキュリティルール設計"], services: ["firestore"] },
      { phase: "Phase 2: Firebase構築", durationWeeks: 2, tasks: ["Firebase プロジェクト設定", "認証フロー実装", "Firestore セキュリティルール"], services: ["firebase-hosting", "firebase-auth", "firestore"] },
      { phase: "Phase 3: 機能開発", durationWeeks: 4, tasks: ["Cloud Functions実装", "フロントエンド開発", "プッシュ通知実装", "ファイルアップロード機能"], services: ["cloud-functions", "cloud-storage"] },
      { phase: "Phase 4: テスト・最適化", durationWeeks: 1, tasks: ["エミュレータでのローカルテスト", "Firebase Test Lab", "パフォーマンス最適化"], services: ["firestore"] },
      { phase: "Phase 5: リリース", durationWeeks: 1, tasks: ["本番環境デプロイ", "Firebase Analytics 設定", "監視アラート設定"], services: ["firebase-hosting"] },
    ],
    baseChallenges: [
      { category: "technical", title: "ベンダーロックイン", description: "Firebase/Firestore への依存度が高く、将来的な他クラウドへの移行コストが大きくなる可能性があります。", mitigation: "ビジネスロジック層を抽象化し、Firebase SDK への直接依存を最小限に。クリティカルなデータは定期的にエクスポートする仕組みを構築します。" },
      { category: "technical", title: "Firestore データモデリング", description: "RDBと異なるNoSQLのデータ設計が必要で、不適切な設計がパフォーマンス低下やコスト増を招きます。", mitigation: "クエリパターンを先に定義し、それに最適化したドキュメント構造を設計。非正規化とサブコレクションを適切に使い分けます。" },
      { category: "cost", title: "従量課金の予測困難", description: "サーバーレスの従量課金モデルでは、トラフィック急増時のコスト予測が困難です。", mitigation: "Budget Alert の設定と Firestore のキャッシュ戦略を実装。必要に応じて Cloud Functions の最大インスタンス数を制限します。" },
    ],
    titleTemplate: "{client}様 {industry}向け サーバーレスアプリ 構築提案書",
    summaryTemplate: "{client}様の{industry}事業向けに、Firebase/Cloud Functions を活用した完全サーバーレスアーキテクチャをご提案いたします。インフラ管理ゼロで迅速な開発を実現し、{scale}規模に自動スケールする構成です。",
  },

  /* ── 6. 生成AI/RAGシステム ── */
  {
    id: "tpl-genai",
    name: "生成AI/RAGシステム",
    matchRequirements: ["genai-rag", "multi-agent"],
    matchIndustries: ["finance", "healthcare", "education"],
    baseArchitectureId: "genai-rag",
    coreServices: [
      { productId: "gemini-api", name: "Gemini API", role: "LLM推論エンジン", reason: "高精度な自然言語処理と生成", tier: "Gemini 1.5 Pro" },
      { productId: "vertex-ai-search", name: "Vertex AI Search", role: "ベクトル検索", reason: "ドキュメントの意味的検索とランキング", tier: "Standard" },
      { productId: "cloud-storage", name: "Cloud Storage", role: "ドキュメント保存", reason: "RAG対象ドキュメントの永続化", tier: "Standard" },
      { productId: "cloud-run", name: "Cloud Run", role: "RAG APIサーバー", reason: "RAGパイプラインのAPIエンドポイント", tier: "CPU: 4vCPU / メモリ: 8GiB" },
      { productId: "secret-manager", name: "Secret Manager", role: "APIキー管理", reason: "Gemini APIキーのセキュアな管理", tier: "Standard" },
    ],
    supplementaryRules: [
      { when: ["data-warehouse"], add: [
        { productId: "bigquery", name: "BigQuery", role: "構造化データソース", reason: "SQLクエリ結果をRAGのコンテキストに活用", tier: "On-demand" },
      ]},
      { when: ["security-compliance"], add: [
        { productId: "cloud-armor", name: "Cloud Armor", role: "API保護", reason: "プロンプトインジェクション攻撃の防御", tier: "Standard" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: PoC・プロンプト設計", durationWeeks: 3, tasks: ["ドキュメント分析・チャンキング戦略設計", "プロンプトエンジニアリング", "Gemini API 精度検証", "RAGパイプラインPoC"], services: ["gemini-api", "cloud-storage"] },
      { phase: "Phase 2: RAGパイプライン構築", durationWeeks: 4, tasks: ["ドキュメント前処理パイプライン", "Embedding生成・インデックス構築", "Rerankerの最適化", "検索精度評価フレームワーク構築"], services: ["vertex-ai-search", "cloud-storage"] },
      { phase: "Phase 3: アプリケーション開発", durationWeeks: 3, tasks: ["RAG API 開発", "チャットUI開発", "フィードバック収集機能", "引用元表示機能"], services: ["cloud-run", "gemini-api"] },
      { phase: "Phase 4: 評価・チューニング", durationWeeks: 2, tasks: ["RAG精度評価(RAGAS)", "ハルシネーション率測定", "プロンプトチューニング", "ガードレール実装"], services: ["gemini-api"] },
      { phase: "Phase 5: 本番稼働", durationWeeks: 1, tasks: ["本番環境デプロイ", "利用者トレーニング", "フィードバックループ構築"], services: ["cloud-run"] },
    ],
    baseChallenges: [
      { category: "technical", title: "ハルシネーション制御", description: "LLMが学習データに基づいて事実と異なる情報を生成するリスクがあり、特に業務利用では致命的です。", mitigation: "RAGによるグラウンディング、回答への引用元明示、温度パラメータの調整、ファクトチェック後処理パイプラインを導入します。" },
      { category: "technical", title: "チャンキング・検索精度", description: "ドキュメントの分割方法が検索精度に直結し、不適切なチャンキングは回答品質を大きく低下させます。", mitigation: "Semantic Chunking と Fixed-size Chunking を比較検証。Reranker による検索結果の精度向上とフィードバックループで継続改善します。" },
      { category: "cost", title: "LLM API コスト管理", description: "Gemini API の利用量に応じた従量課金のため、大量のリクエストでコストが急増する可能性があります。", mitigation: "キャッシュ戦略の導入、プロンプトの最適化(トークン数削減)、利用上限の設定、Context Caching の活用でコストを最適化します。" },
      { category: "security", title: "プロンプトインジェクション対策", description: "悪意のあるプロンプトにより、システムの意図しない動作や情報漏洩を引き起こすリスクがあります。", mitigation: "入力サニタイゼーション、System Prompt の堅牢化、Cloud Armor によるリクエストフィルタリング、出力ガードレールの多層防御を実装します。" },
    ],
    titleTemplate: "{client}様 {industry}向け 生成AI/RAG基盤 構築提案書",
    summaryTemplate: "{client}様の{industry}事業における知識活用を革新するため、Gemini API と Vertex AI Search を組み合わせた RAG(検索拡張生成)基盤をご提案いたします。社内ドキュメントを知識源として活用し、{scale}規模での高精度な質問応答システムを構築します。",
  },

  /* ── 7. IoT+分析基盤 ── */
  {
    id: "tpl-iot-analytics",
    name: "IoT+分析基盤",
    matchRequirements: ["iot", "realtime-analytics"],
    matchIndustries: ["manufacturing", "retail"],
    baseArchitectureId: "data-pipeline",
    coreServices: [
      { productId: "pub-sub", name: "Pub/Sub", role: "IoTデータ取り込み", reason: "デバイスからの大量メッセージを確実に受信", tier: "Standard" },
      { productId: "dataflow", name: "Dataflow", role: "ストリーム処理", reason: "リアルタイムのデータ変換・集計", tier: "Standard Workers" },
      { productId: "bigquery", name: "BigQuery", role: "分析用データウェアハウス", reason: "時系列データの長期蓄積と分析", tier: "On-demand" },
      { productId: "bigtable", name: "Cloud Bigtable", role: "低レイテンシ時系列DB", reason: "デバイスデータのリアルタイム読み書き", tier: "SSD 3-node" },
      { productId: "cloud-storage", name: "Cloud Storage", role: "データレイク", reason: "生データの長期保管とバッチ処理入力", tier: "Standard / Coldline" },
      { productId: "cloud-monitoring", name: "Cloud Monitoring", role: "デバイス監視", reason: "デバイス稼働状況とアラート管理", tier: "Standard" },
    ],
    supplementaryRules: [
      { when: ["ml-prediction"], add: [
        { productId: "vertex-ai", name: "Vertex AI", role: "予知保全モデル", reason: "IoTデータからの異常検知・予測", tier: "Standard" },
      ]},
      { when: ["high-availability"], add: [
        { productId: "cloud-load-balancing", name: "Cloud Load Balancing", role: "IoT Ingress", reason: "デバイス接続のグローバル分散", tier: "Global External" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: IoT設計", durationWeeks: 2, tasks: ["デバイスプロトコル選定(MQTT/HTTP)", "データフォーマット設計", "トピック/サブスクリプション設計"], services: ["pub-sub"] },
      { phase: "Phase 2: パイプライン構築", durationWeeks: 4, tasks: ["Dataflowストリーミングジョブ開発", "Bigtableスキーマ設計", "BigQuery取り込み設定", "データ品質チェック"], services: ["dataflow", "bigtable", "bigquery"] },
      { phase: "Phase 3: ダッシュボード構築", durationWeeks: 3, tasks: ["リアルタイムダッシュボード", "アラートルール設定", "レポート自動生成"], services: ["cloud-monitoring", "bigquery"] },
      { phase: "Phase 4: デバイス接続テスト", durationWeeks: 2, tasks: ["デバイスシミュレーター検証", "負荷テスト(1万デバイス同時)", "フェイルオーバーテスト"], services: ["pub-sub", "bigtable"] },
      { phase: "Phase 5: 本番展開", durationWeeks: 1, tasks: ["段階的デバイス接続", "運用手順整備", "アラート閾値調整"], services: ["cloud-monitoring"] },
    ],
    baseChallenges: [
      { category: "technical", title: "デバイスプロトコルの統一", description: "既存デバイスのプロトコルが多様(MQTT, HTTP, CoAP等)で、統一的なデータ取り込みが複雑化します。", mitigation: "Pub/Sub を統一的なメッセージングレイヤーとし、プロトコルアダプタをCloud Run上にデプロイして吸収します。" },
      { category: "technical", title: "データ遅延とバックプレッシャー", description: "デバイス数の急増やネットワーク障害時にデータ遅延が発生し、リアルタイム性が失われるリスクがあります。", mitigation: "Pub/Sub のデッドレターキュー設定、Dataflow のAutoscaling、Bigtable のCPU使用率監視で適切に対処します。" },
      { category: "cost", title: "Bigtable ノードコスト", description: "Bigtable は最小3ノードが必要で、小規模開始時の固定コストが大きくなります。", mitigation: "開発/テスト環境ではBigtable エミュレータを使用。本番では Autoscaling を有効にしてトラフィックに応じたノード数最適化を行います。" },
    ],
    titleTemplate: "{client}様 {industry}向け IoTデータ分析基盤 構築提案書",
    summaryTemplate: "{client}様の{industry}事業におけるIoTデータの有効活用を実現するため、Pub/Sub + Dataflow + BigQuery/Bigtable による統合IoT分析基盤をご提案いたします。{scale}規模のデバイスからのリアルタイムデータ収集と分析を支えます。",
  },

  /* ── 8. エンタープライズ統合基盤 ── */
  {
    id: "tpl-enterprise",
    name: "エンタープライズ統合基盤",
    matchRequirements: ["hybrid-cloud", "high-availability", "security-compliance"],
    matchIndustries: ["finance", "government", "manufacturing"],
    baseArchitectureId: "hybrid-cloud",
    coreServices: [
      { productId: "cloud-interconnect", name: "Cloud Interconnect", role: "専用線接続", reason: "オンプレミスとGCP間の高帯域・低遅延な専用接続", tier: "Dedicated 10Gbps" },
      { productId: "gke", name: "GKE", role: "コンテナ基盤", reason: "ワークロードのモダナイゼーション実行基盤", tier: "Standard (Multi-zone)" },
      { productId: "cloud-sql", name: "Cloud SQL", role: "マネージドDB", reason: "RDBワークロードのクラウド移行先", tier: "db-highmem-4 HA構成" },
      { productId: "cloud-armor", name: "Cloud Armor", role: "WAF/DDoS防御", reason: "エンタープライズ向け多層セキュリティ", tier: "Enterprise" },
      { productId: "cloud-logging", name: "Cloud Logging", role: "統合ログ管理", reason: "オンプレミス+クラウドの統合監査ログ", tier: "Standard" },
      { productId: "cloud-vpn", name: "Cloud VPN", role: "バックアップ接続", reason: "Interconnect障害時のVPNフォールバック", tier: "HA VPN" },
      { productId: "cloud-iam", name: "Cloud IAM", role: "統合ID管理", reason: "Active Directory連携のSSO/RBAC", tier: "Premium" },
    ],
    supplementaryRules: [
      { when: ["data-warehouse"], add: [
        { productId: "bigquery", name: "BigQuery", role: "統合分析基盤", reason: "オンプレミスとクラウドのデータ統合分析", tier: "Flat-rate slots" },
      ]},
      { when: ["ci-cd"], add: [
        { productId: "cloud-build", name: "Cloud Build", role: "CI/CD", reason: "マルチ環境デプロイの自動化", tier: "Standard" },
        { productId: "cloud-deploy", name: "Cloud Deploy", role: "デリバリー", reason: "段階的デプロイの自動管理", tier: "Standard" },
      ]},
    ],
    baseTimeline: [
      { phase: "Phase 1: 要件定義・PoC", durationWeeks: 4, tasks: ["既存インフラ棚卸し", "移行対象ワークロード選定", "PoC環境構築", "セキュリティ要件定義"], services: ["cloud-vpn"] },
      { phase: "Phase 2: ネットワーク構築", durationWeeks: 4, tasks: ["Cloud Interconnect構築", "Shared VPC設計・構築", "DNS/Firewall設定", "HA VPNバックアップ構成"], services: ["cloud-interconnect", "cloud-vpn"] },
      { phase: "Phase 3: セキュリティ構築", durationWeeks: 3, tasks: ["IAM/SSO連携", "VPC Service Controls", "Cloud Armor WAF設定", "監査ログ基盤構築"], services: ["cloud-iam", "cloud-armor", "cloud-logging"] },
      { phase: "Phase 4: ワークロード移行", durationWeeks: 6, tasks: ["DBマイグレーション", "アプリケーション移行・リファクタ", "負荷テスト", "フェイルオーバーテスト"], services: ["gke", "cloud-sql"] },
      { phase: "Phase 5: 運用移管", durationWeeks: 2, tasks: ["運用手順書整備", "24/365監視体制構築", "インシデント対応訓練", "コスト最適化レビュー"], services: ["cloud-logging", "cloud-monitoring"] },
    ],
    baseChallenges: [
      { category: "technical", title: "レガシーシステム連携", description: "オンプレミスのレガシーシステムとの API 連携やデータ同期において、プロトコルやデータ形式の差異が障壁となります。", mitigation: "Apigee API Gateway を活用したプロトコル変換と、Pub/Sub による非同期データ連携で段階的に統合します。" },
      { category: "technical", title: "ネットワーク帯域設計", description: "Cloud Interconnect の帯域選定を誤ると、移行時やピーク時にボトルネックが発生します。", mitigation: "現在のトラフィック量を測定し、ピーク時の1.5倍の帯域を確保。HA VPN をフォールバック経路として構成します。" },
      { category: "security", title: "コンプライアンス認証の維持", description: "クラウド移行に伴い、既存の認証(PCI DSS, SOC2等)の再評価・更新が必要になります。", mitigation: "Google Cloud のコンプライアンスレポート(Compliance Reports Manager)を活用し、監査対応の工数を最小化。Assured Workloads で準拠状態を継続監視します。" },
      { category: "organizational", title: "組織横断の合意形成", description: "大規模な移行プロジェクトでは、セキュリティ・インフラ・アプリ・経営層など多数のステークホルダーの合意が必要です。", mitigation: "Google Cloud のクラウド移行成熟度フレームワーク(CAMP)を活用し、ステークホルダーごとの懸念事項を体系的に整理・対応します。" },
    ],
    titleTemplate: "{client}様 {industry}向け エンタープライズクラウド統合基盤 構築提案書",
    summaryTemplate: "{client}様の{industry}事業における既存オンプレミスインフラとGoogle Cloudの統合基盤をご提案いたします。Cloud Interconnect による安全な専用接続と、{scale}規模に対応したハイブリッドアーキテクチャにより、段階的かつ安全なクラウド移行を実現します。",
  },
]
