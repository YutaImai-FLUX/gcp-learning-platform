import type { QuizQuestion } from "@/lib/types/quiz"

export const PCD_EXTRA_QUESTIONS: QuizQuestion[] = [
  // ─── スケーラブルで可用性の高いアプリ設計 (30%) ───
  {
    id: "pcd-006",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "easy",
    question:
      "Cloud Runでコンテナのコールドスタートを最小化するための方法はどれですか？",
    options: [
      "コンテナイメージのサイズを大きくする",
      "最小インスタンス数（min-instances）を1以上に設定する",
      "最大インスタンス数（max-instances）を1に制限する",
      "リクエストタイムアウトを短く設定する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Runでmin-instancesを1以上に設定すると、常に指定数のインスタンスがウォーム状態で維持されます。これによりコールドスタートが回避され、最初のリクエストのレイテンシが大幅に改善されます。ただし、アイドル状態のインスタンスにもコストが発生します。",
    tags: ["cloud-run", "cold-start", "min-instances", "latency"],
  },
  {
    id: "pcd-007",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "easy",
    question:
      "マイクロサービス間の非同期通信に最適なGoogle Cloudサービスはどれですか？",
    options: [
      "Cloud SQL",
      "Cloud Pub/Sub",
      "Cloud CDN",
      "Cloud DNS",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Pub/Subはフルマネージドのメッセージングサービスで、マイクロサービス間の非同期通信に最適です。パブリッシャーとサブスクライバーを疎結合にし、メッセージの信頼性のある配信、自動スケーリング、at-least-once配信保証を提供します。",
    tags: ["pub-sub", "async", "microservices", "messaging"],
  },
  {
    id: "pcd-008",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "medium",
    question:
      "SLO（Service Level Objective）におけるエラーバジェットの概念として正しいのはどれですか？",
    options: [
      "サービスの月間運用コストの上限",
      "SLOの目標値と100%の差分であり、許容されるダウンタイムやエラーの量を示す",
      "開発チームの年間予算の一部",
      "エラーが発生した際のペナルティ料金",
    ],
    correctIndex: 1,
    explanation:
      "エラーバジェットは「100% - SLO目標値」で計算されます。例えばSLOが99.9%の場合、エラーバジェットは0.1%（月間約43分のダウンタイム）です。エラーバジェットが残っている間は新機能のリリースを進め、消費し尽くした場合は安定性改善に注力するという意思決定フレームワークとして使用します。",
    tags: ["slo", "error-budget", "sre", "reliability"],
  },
  {
    id: "pcd-009",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "medium",
    question:
      "Cloud Tasksの主なユースケースとして正しいのはどれですか？",
    options: [
      "リアルタイムのチャット機能の実装",
      "タスクの実行レート制御、リトライ設定、スケジューリングを伴う非同期タスクの分散実行",
      "大規模データの一括バッチ処理",
      "機械学習モデルのトレーニング",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Tasksはタスクキューのマネージドサービスで、非同期タスクの分散実行を管理します。レート制限、リトライポリシー、タスクの遅延実行（スケジューリング）を設定でき、ターゲットとしてCloud Run、Cloud Functions、任意のHTTPエンドポイントを指定できます。",
    tags: ["cloud-tasks", "task-queue", "rate-limiting", "async"],
  },
  {
    id: "pcd-010",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "hard",
    question:
      "Cloud Runのコンカレンシー設定（concurrency）について正しい説明はどれですか？",
    options: [
      "コンカレンシーは常に1に設定すべきである",
      "コンカレンシーを適切に設定することで、1つのインスタンスが複数のリクエストを同時処理し、コスト効率とスケーリング効率を向上させる",
      "コンカレンシーの設定はレスポンスタイムに影響しない",
      "コンカレンシーを高くするとコールドスタートが増加する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Runのコンカレンシー設定は、1つのインスタンスが同時に処理するリクエスト数の上限を決定します。適切なコンカレンシー値を設定することで、インスタンス数を削減しコストを最適化できます。ただし、アプリケーションがスレッドセーフであることが前提で、メモリ/CPU使用量とのバランスが重要です。",
    tags: [
      "cloud-run",
      "concurrency",
      "cost-optimization",
      "scaling",
    ],
  },
  {
    id: "pcd-011",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "hard",
    question:
      "Eventarcを使用したイベント駆動アーキテクチャの構成として正しいのはどれですか？",
    options: [
      "EventarcはCloud Functions第1世代でのみ使用できる",
      "EventarcはCloud Audit Logs、Pub/Sub、直接イベントなどのイベントソースからCloud Run、Cloud Functions、GKEなどのターゲットにイベントをルーティングする",
      "Eventarcはバッチ処理専用のサービスである",
      "Eventarcを使用するにはカスタムメッセージキューが必要である",
    ],
    correctIndex: 1,
    explanation:
      "Eventarcは統合的なイベントルーティングサービスです。Cloud Audit Logs（60以上のGCPサービスからのイベント）、Pub/Subメッセージ、Cloud Storageの直接イベントなどをトリガーとして、Cloud Run、Cloud Functions（第2世代）、GKE、Workflowsにルーティングできます。",
    tags: [
      "eventarc",
      "event-driven",
      "routing",
      "cloud-audit-logs",
    ],
  },
  {
    id: "pcd-012",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "hard",
    question:
      "Cloud Workflowsの特徴として正しいのはどれですか？",
    options: [
      "リアルタイムストリーミング処理に最適化されている",
      "HTTPサービス、Cloud Functions、Cloud Run、GCP APIを組み合わせたサーバーレスオーケストレーションで、条件分岐・リトライ・並列実行をYAMLで定義できる",
      "機械学習パイプライン専用のサービスである",
      "ワークフロー実行中はVMインスタンスが起動する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Workflowsはサーバーレスのワークフローオーケストレーションサービスです。YAML/JSONでステップを定義し、HTTPリクエスト、Cloud Functions/Run呼び出し、GCP API操作を組み合わせて実行できます。条件分岐、リトライ、並列ステップ、エラーハンドリングを宣言的に記述できます。",
    tags: [
      "cloud-workflows",
      "orchestration",
      "serverless",
      "yaml",
    ],
  },
  // ─── アプリケーションのビルドとテスト (25%) ───
  {
    id: "pcd-013",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "easy",
    question:
      "Cloud Buildで使用されるcloudbuild.yamlの役割はどれですか？",
    options: [
      "インフラストラクチャのプロビジョニングを定義する",
      "ビルドステップ（テスト、ビルド、プッシュ、デプロイ等）をパイプラインとして定義する",
      "モニタリングアラートの設定を定義する",
      "IAMロールの割り当てを定義する",
    ],
    correctIndex: 1,
    explanation:
      "cloudbuild.yamlはCloud Buildのパイプライン定義ファイルです。各ステップでDockerイメージを使用してコマンドを実行し、ソースコードのビルド、テスト実行、コンテナイメージのビルド・プッシュ、デプロイなどの一連のCI/CDパイプラインを定義します。",
    tags: ["cloud-build", "cicd", "pipeline", "yaml"],
  },
  {
    id: "pcd-014",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "easy",
    question:
      "Artifact Registryの主な用途はどれですか？",
    options: [
      "ソースコードのバージョン管理",
      "コンテナイメージ、言語パッケージ（npm、Maven、Python等）の保存と管理",
      "ログデータの長期保存",
      "データベースのバックアップ管理",
    ],
    correctIndex: 1,
    explanation:
      "Artifact RegistryはGoogle Cloudのユニバーサルパッケージマネージャーです。Dockerコンテナイメージ、npm、Maven、Python（PyPI）、Go、Aptなどのパッケージを安全に保存・管理でき、脆弱性スキャンやIAMベースのアクセス制御を提供します。",
    tags: [
      "artifact-registry",
      "container-registry",
      "package-management",
    ],
  },
  {
    id: "pcd-015",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "medium",
    question:
      "テストピラミッドにおいて、最も数が多く実行コストが低いテストタイプはどれですか？",
    options: [
      "E2E（エンドツーエンド）テスト",
      "統合テスト",
      "ユニットテスト",
      "パフォーマンステスト",
    ],
    correctIndex: 2,
    explanation:
      "テストピラミッドでは、底辺にユニットテスト（最も数が多く、高速で低コスト）、中間に統合テスト、頂点にE2Eテスト（最も数が少なく、低速で高コスト）を配置します。Google Cloud開発でも、Cloud Functions/Runのロジックにはユニットテストを充実させることが推奨されます。",
    tags: ["testing", "unit-test", "test-pyramid", "best-practices"],
  },
  {
    id: "pcd-016",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "medium",
    question:
      "Cloud Buildトリガーで、特定のブランチへのプッシュ時にのみビルドを実行する設定方法はどれですか？",
    options: [
      "cloudbuild.yaml内でブランチ名を条件分岐する",
      "トリガー設定でブランチフィルター（正規表現）を指定し、マッチするブランチへのプッシュ時のみ実行する",
      "IAMポリシーでブランチごとの権限を設定する",
      "Cloud Schedulerでビルドスケジュールを設定する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Buildトリガーでは、ブランチフィルター（正規表現パターン、例: ^main$）を設定して、特定のブランチへのプッシュやプルリクエスト時にのみビルドを実行できます。タグフィルターやファイルパスフィルターも併用可能です。",
    tags: [
      "cloud-build",
      "trigger",
      "branch-filter",
      "cicd",
    ],
  },
  {
    id: "pcd-017",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "hard",
    question:
      "Cloud Buildでマルチステージビルドを使用する利点はどれですか？",
    options: [
      "ビルド時間が常に短くなる",
      "ビルド時の依存関係とランタイムの依存関係を分離し、最終コンテナイメージのサイズを削減してセキュリティを向上させる",
      "ビルドステップの並列実行が自動的に有効になる",
      "Cloud Buildの料金が割引される",
    ],
    correctIndex: 1,
    explanation:
      "Dockerのマルチステージビルドでは、ビルドステージでコンパイル・依存関係解決を行い、最終ステージでは実行に必要なバイナリとファイルのみをコピーします。これにより、コンパイラやビルドツールが最終イメージに含まれず、イメージサイズの削減と攻撃サーフェスの縮小が実現できます。",
    tags: [
      "multi-stage-build",
      "docker",
      "image-optimization",
      "security",
    ],
  },
  {
    id: "pcd-018",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "hard",
    question:
      "Cloud Buildでプライベートプール（Private Pool）を使用する主なユースケースはどれですか？",
    options: [
      "ビルド速度を向上させるため",
      "VPCネットワーク内のプライベートリソース（プライベートArtifact Registry、内部APIなど）にアクセスするビルドを実行するため",
      "無料枠のビルド時間を増やすため",
      "Cloud Buildの管理コンソールをカスタマイズするため",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Buildのプライベートプールは、顧客のVPCネットワークとピアリングして動作するため、VPC内のプライベートリソース（Artifact Registry、内部Git、プライベートAPIなど）にアクセスするビルドを安全に実行できます。セキュリティ要件が厳しい環境で使用します。",
    tags: [
      "cloud-build",
      "private-pool",
      "vpc-peering",
      "security",
    ],
  },
  // ─── アプリのデプロイとリリース管理 (25%) ───
  {
    id: "pcd-019",
    certId: "pcd",
    domain: "アプリのデプロイとリリース管理",
    difficulty: "easy",
    question:
      "Cloud Runでトラフィック分割（Traffic Splitting）を使用する目的はどれですか？",
    options: [
      "コスト削減のためにリクエストを制限する",
      "新しいリビジョンへトラフィックを段階的に移行し、カナリアリリースやロールバックを実現する",
      "特定のユーザーのみにサービスを提供する",
      "Cloud CDNのキャッシュヒット率を向上させる",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Runのトラフィック分割機能を使用すると、複数のリビジョン間でトラフィックの割合を指定できます。新リビジョンに5%のトラフィックを送信してカナリアテストを行い、問題がなければ段階的に100%に移行するといったリリース戦略を実現できます。",
    tags: [
      "cloud-run",
      "traffic-splitting",
      "canary-release",
      "rollback",
    ],
  },
  {
    id: "pcd-020",
    certId: "pcd",
    domain: "アプリのデプロイとリリース管理",
    difficulty: "medium",
    question:
      "ブルーグリーンデプロイメントのメリットとして正しいのはどれですか？",
    options: [
      "デプロイに必要なリソースが半分で済む",
      "新旧の環境を並行稼働させ、問題発生時にトラフィックを旧環境に即座にスイッチバックしてダウンタイムを最小化する",
      "デプロイ速度が常にカナリアリリースより速い",
      "ロールバックが不要になる",
    ],
    correctIndex: 1,
    explanation:
      "ブルーグリーンデプロイメントでは、現行環境（Blue）と新環境（Green）を並行稼働させます。Greenの検証完了後にトラフィックを切り替え、問題があればBlueに即座にスイッチバックできます。ダウンタイムが最小限で、ロールバックが高速です。",
    tags: [
      "blue-green",
      "deployment-strategy",
      "zero-downtime",
      "rollback",
    ],
  },
  {
    id: "pcd-021",
    certId: "pcd",
    domain: "アプリのデプロイとリリース管理",
    difficulty: "medium",
    question:
      "GKEでRolling Updateデプロイメント戦略を使用する際のmaxSurgeとmaxUnavailableパラメータの役割はどれですか？",
    options: [
      "maxSurgeはPodのメモリ上限、maxUnavailableはCPU上限を指定する",
      "maxSurgeは更新中に追加作成できるPod数の上限、maxUnavailableは更新中に利用不可にできるPod数の上限を指定する",
      "maxSurgeはデプロイ速度、maxUnavailableはロールバック速度を指定する",
      "maxSurgeはレプリカ数の最大値、maxUnavailableはレプリカ数の最小値を指定する",
    ],
    correctIndex: 1,
    explanation:
      "Rolling UpdateでmaxSurgeは更新中にDesiredReplicasを超えて作成できるPod数（またはパーセンテージ）を指定し、maxUnavailableは更新中に利用不可にできるPod数を指定します。例えばmaxSurge=1、maxUnavailable=0なら、常に全Podが利用可能な状態で段階的に更新されます。",
    tags: [
      "gke",
      "rolling-update",
      "max-surge",
      "max-unavailable",
    ],
  },
  {
    id: "pcd-022",
    certId: "pcd",
    domain: "アプリのデプロイとリリース管理",
    difficulty: "hard",
    question:
      "Cloud Deployを使用したデリバリーパイプラインの構成要素として正しい組み合わせはどれですか？",
    options: [
      "ソースリポジトリ、ビルドトリガー、デプロイスクリプト",
      "デリバリーパイプライン、ターゲット（dev/staging/prod）、リリース、ロールアウト",
      "Dockerfile、cloudbuild.yaml、サービスアカウント",
      "Helmチャート、Kustomize、ArgoCD",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Deployのデリバリーパイプラインは、ターゲット（dev→staging→prodなどの環境）の順序を定義します。リリースはデプロイ対象のアーティファクトを表し、ロールアウトは特定のターゲットへの実際のデプロイ操作です。承認ゲートやカナリア戦略も設定可能です。",
    tags: [
      "cloud-deploy",
      "delivery-pipeline",
      "target",
      "release",
      "rollout",
    ],
  },
  {
    id: "pcd-023",
    certId: "pcd",
    domain: "アプリのデプロイとリリース管理",
    difficulty: "hard",
    question:
      "カナリアリリースで新バージョンのロールバック基準として最も適切なのはどれですか？",
    options: [
      "デプロイから一定時間が経過したかどうか",
      "エラーレート、レイテンシ、サチュレーションなどのSLIがSLOの閾値を超えたかどうか",
      "デプロイ担当者の主観的な判断のみ",
      "ログのエントリ数が増加したかどうか",
    ],
    correctIndex: 1,
    explanation:
      "カナリアリリースでは、SLI（Service Level Indicator）であるエラーレート、レイテンシ（p50、p95、p99）、サチュレーション（リソース使用率）を監視し、これらがSLOの閾値を超えた場合にロールバックを判断します。Cloud Monitoringのアラートと連携した自動ロールバックも推奨されます。",
    tags: [
      "canary-release",
      "sli",
      "slo",
      "rollback",
      "observability",
    ],
  },
  {
    id: "pcd-024",
    certId: "pcd",
    domain: "アプリのデプロイとリリース管理",
    difficulty: "medium",
    question:
      "Cloud RunでImmutable（イミュータブル）なデプロイを実現するためのベストプラクティスはどれですか？",
    options: [
      "コンテナイメージにlatestタグを使用する",
      "コンテナイメージにダイジェスト（SHA256ハッシュ）またはバージョンタグを使用してデプロイする",
      "環境変数でアプリケーションバージョンを管理する",
      "Cloud Storageにデプロイ設定を保存する",
    ],
    correctIndex: 1,
    explanation:
      "イミュータブルなデプロイでは、コンテナイメージのダイジェスト（例: gcr.io/project/image@sha256:abc...）または明確なバージョンタグを使用します。latestタグは内容が変わる可能性があるため使用を避け、特定の不変なイメージを参照することで再現性と信頼性を確保します。",
    tags: [
      "cloud-run",
      "immutable-deployment",
      "image-digest",
      "best-practices",
    ],
  },
  // ─── Google Cloudサービスの統合 (20%) ───
  {
    id: "pcd-025",
    certId: "pcd",
    domain: "Google Cloudサービスの統合",
    difficulty: "easy",
    question:
      "API GatewayとCloud Endpointsの共通の機能はどれですか？",
    options: [
      "コンテナオーケストレーション",
      "APIの認証、レート制限、モニタリングなどのAPI管理機能",
      "データベースクエリの最適化",
      "CDNキャッシュの管理",
    ],
    correctIndex: 1,
    explanation:
      "API GatewayとCloud Endpointsは、APIキー認証、JWT検証、レート制限、リクエスト/レスポンスの検証、APIモニタリング・ロギングなどのAPI管理機能を提供します。API GatewayはサーバーレスAPI向け、Cloud Endpointsはより柔軟なバックエンド向けに使用されます。",
    tags: [
      "api-gateway",
      "cloud-endpoints",
      "api-management",
      "authentication",
    ],
  },
  {
    id: "pcd-026",
    certId: "pcd",
    domain: "Google Cloudサービスの統合",
    difficulty: "medium",
    question:
      "Cloud RunからCloud SQLに接続する推奨方法はどれですか？",
    options: [
      "Cloud SQLのパブリックIPアドレスに直接接続する",
      "Cloud SQL Auth Proxyを使用したUnixソケット接続またはCloud SQL Connectorライブラリを使用する",
      "VPNトンネル経由で接続する",
      "Cloud Storageにエクスポートしたデータを読み込む",
    ],
    correctIndex: 1,
    explanation:
      "Cloud RunからCloud SQLへの接続には、Cloud SQL Auth Proxy（Unixソケット経由）またはCloud SQL Connectorライブラリの使用が推奨されます。IAMベースの認証を利用でき、SSL/TLS暗号化、自動的な接続管理が提供されます。Cloud Run設定でCloud SQL接続を追加するだけで使用可能です。",
    tags: [
      "cloud-run",
      "cloud-sql",
      "sql-auth-proxy",
      "connectivity",
    ],
  },
  {
    id: "pcd-027",
    certId: "pcd",
    domain: "Google Cloudサービスの統合",
    difficulty: "medium",
    question:
      "Secret Managerを使用してアプリケーションのシークレットを管理する利点はどれですか？",
    options: [
      "シークレットがソースコードに埋め込まれるため管理が簡単になる",
      "シークレットのバージョン管理、IAMベースのアクセス制御、監査ログ、自動ローテーションを提供する",
      "環境変数の代わりにコマンドライン引数でシークレットを渡せる",
      "シークレットがCloud Storageに平文で保存される",
    ],
    correctIndex: 1,
    explanation:
      "Secret Managerはシークレットの一元管理サービスです。バージョン管理によりシークレットの更新・ロールバックが可能で、IAMポリシーでアクセスを制御し、Cloud Audit Logsでアクセスを監査できます。Cloud Run/Functions/GKEから直接マウントまたは参照できます。",
    tags: [
      "secret-manager",
      "security",
      "versioning",
      "iam",
    ],
  },
  {
    id: "pcd-028",
    certId: "pcd",
    domain: "Google Cloudサービスの統合",
    difficulty: "hard",
    question:
      "Cloud RunとFirestoreを組み合わせたリアルタイムアプリケーションの設計で考慮すべき点はどれですか？",
    options: [
      "Firestoreはバッチ処理にのみ適している",
      "Firestoreのリアルタイムリスナーはサーバーサイドでは使用できないため、クライアントSDKでのリアルタイム同期とCloud Runでのデータ操作APIを分離して設計する",
      "Cloud RunからFirestoreへの書き込みはPub/Sub経由でのみ可能",
      "FirestoreとCloud Runは同じリージョンに配置できない",
    ],
    correctIndex: 1,
    explanation:
      "Firestoreのリアルタイムリスナーは主にクライアントSDK（Web、モバイル）で使用されます。Cloud Runではリクエスト/レスポンス型のAPIとしてFirestoreのCRUD操作を提供し、リアルタイム同期はクライアント側で直接Firestoreに接続する設計が推奨されます。",
    tags: [
      "cloud-run",
      "firestore",
      "realtime",
      "architecture",
    ],
  },
  {
    id: "pcd-029",
    certId: "pcd",
    domain: "Google Cloudサービスの統合",
    difficulty: "hard",
    question:
      "GKEでのサービスメッシュ（Anthos Service Mesh）を導入する主な利点はどれですか？",
    options: [
      "コンテナイメージのビルドが高速になる",
      "サービス間のmTLS暗号化、トラフィック管理、可観測性（分散トレーシング、メトリクス）をアプリケーションコードの変更なしに実現する",
      "GKEクラスタのノード数が自動的に削減される",
      "Kubernetesのマニフェストが不要になる",
    ],
    correctIndex: 1,
    explanation:
      "Anthos Service Mesh（Istio）はサイドカープロキシ（Envoy）を各Podに注入し、サービス間のmTLS暗号化、トラフィック分割・フォールトインジェクション、分散トレーシング（Cloud Trace連携）、サービスレベルのメトリクスをアプリケーションコードの変更なしに提供します。",
    tags: [
      "anthos-service-mesh",
      "istio",
      "mtls",
      "observability",
      "gke",
    ],
  },
  {
    id: "pcd-030",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "hard",
    question:
      "Cloud BuildでTerraformとの統合によるInfrastructure as Code（IaC）パイプラインのベストプラクティスはどれですか？",
    options: [
      "terraform applyをローカルマシンから直接実行する",
      "Cloud Buildでterraform plan → PRレビュー → マージ後にterraform applyの自動実行パイプラインを構築し、状態ファイルはCloud Storageバックエンドで管理する",
      "terraform.tfstateファイルをGitリポジトリにコミットする",
      "各開発者が個別のTerraform状態ファイルを管理する",
    ],
    correctIndex: 1,
    explanation:
      "IaCパイプラインのベストプラクティスとして、PRでterraform planの結果をレビューし、マージ後にCloud Buildでterraform applyを自動実行する構成が推奨されます。状態ファイルはCloud Storageバックエンドにロック機能付きで管理し、GitOpsワークフローを実現します。",
    tags: [
      "cloud-build",
      "terraform",
      "iac",
      "gitops",
      "state-management",
    ],
  },
]
