import type { QuizQuestion } from "@/lib/types/quiz"
import { CDL_EXTRA_QUESTIONS } from "./quiz-questions/cdl-questions"
import { ACE_EXTRA_QUESTIONS } from "./quiz-questions/ace-questions"
import { PCA_EXTRA_QUESTIONS } from "./quiz-questions/pca-questions"
import { PDE_EXTRA_QUESTIONS } from "./quiz-questions/pde-questions"
import { PMLE_EXTRA_QUESTIONS } from "./quiz-questions/pmle-questions"
import { PCNE_EXTRA_QUESTIONS } from "./quiz-questions/pcne-questions"
import { PCSE_EXTRA_QUESTIONS } from "./quiz-questions/pcse-questions"
import { PCD_EXTRA_QUESTIONS } from "./quiz-questions/pcd-questions"

const BASE_QUESTIONS: QuizQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // CDL (Cloud Digital Leader)
  // ═══════════════════════════════════════════════════════════
  {
    id: "cdl-001",
    certId: "cdl",
    domain: "デジタルトランスフォーメーションとGoogle Cloud",
    difficulty: "easy",
    question: "クラウドコンピューティングの主な利点として最も適切でないものはどれですか？",
    options: [
      "使用した分だけ支払う従量課金制",
      "物理サーバーの購入が不要",
      "完全なデータセキュリティが保証される",
      "迅速なリソースのスケールアップ・ダウン",
    ],
    correctIndex: 2,
    explanation:
      "クラウドはセキュリティ向上を支援しますが、「完全なセキュリティ」を保証するものではありません。セキュリティはお客様とクラウドプロバイダーの共有責任モデルです。",
    tags: ["cloud-basics", "security"],
  },
  {
    id: "cdl-002",
    certId: "cdl",
    domain: "Google Cloudによるインフラストラクチャのモダナイズ",
    difficulty: "easy",
    question: "Compute Engineの説明として正しいものはどれですか？",
    options: [
      "サーバーレスでコードを実行するサービス",
      "Google のインフラ上で動作する仮想マシンサービス",
      "Kubernetesクラスターを管理するサービス",
      "コンテナをサーバーレスで実行するサービス",
    ],
    correctIndex: 1,
    explanation:
      "Compute Engineは、Google のインフラ上でスケーラブルな仮想マシンを実行するサービスです。サーバーレスはCloud FunctionsやCloud Runが担います。",
    tags: ["compute", "gce"],
  },
  {
    id: "cdl-003",
    certId: "cdl",
    domain: "Google Cloudによるデータ価値の最大化",
    difficulty: "easy",
    question: "BigQueryを使用する主な目的として最も適切なものはどれですか？",
    options: [
      "ファイルのオブジェクトストレージ",
      "リアルタイムのキャッシュ",
      "ペタバイト規模のデータ分析",
      "NoSQLドキュメントデータベース",
    ],
    correctIndex: 2,
    explanation:
      "BigQueryはサーバーレスのデータウェアハウスで、ペタバイト規模のデータをSQLで高速に分析できます。",
    tags: ["analytics", "bigquery"],
  },
  {
    id: "cdl-004",
    certId: "cdl",
    domain: "Google Cloudによるアプリケーションの近代化",
    difficulty: "medium",
    question: "Cloud RunとCloud Functionsの違いとして正しいものはどれですか？",
    options: [
      "Cloud RunはDockerコンテナを実行し、Cloud Functionsはコード関数を実行する",
      "Cloud Runは無料で、Cloud Functionsは有料",
      "Cloud FunctionsはKubernetesベース、Cloud Runはサーバーレス",
      "どちらも同じサービスで違いはない",
    ],
    correctIndex: 0,
    explanation:
      "Cloud Runは任意のDockerコンテナをサーバーレスで実行できます。Cloud Functionsは個別の関数コードを実行するイベント駆動型サービスです。両方ともサーバーレスですが、粒度が異なります。",
    tags: ["serverless", "cloud-run", "cloud-functions"],
  },
  {
    id: "cdl-005",
    certId: "cdl",
    domain: "Google Cloudによるインフラストラクチャのモダナイズ",
    difficulty: "easy",
    question: "Cloud Storageのストレージクラスで最もコストが安いものはどれですか？",
    options: ["Standard", "Nearline", "Coldline", "Archive"],
    correctIndex: 3,
    explanation:
      "Archiveストレージクラスはアクセス頻度が最も低いデータ向けで、最安値(約$0.0012/GB/月)ですが、アクセス時のコストが最も高くなります。",
    tags: ["storage", "gcs"],
  },
  {
    id: "cdl-006",
    certId: "cdl",
    domain: "デジタルトランスフォーメーションとGoogle Cloud",
    difficulty: "medium",
    question: "Google Cloud の責任共有モデルにおいて、クラウドプロバイダー (Google) が責任を持つのはどれですか？",
    options: [
      "アプリケーションコードのセキュリティ",
      "ユーザーデータの暗号化設定",
      "物理インフラとハードウェアのセキュリティ",
      "IAMポリシーの設定",
    ],
    correctIndex: 2,
    explanation:
      "責任共有モデルでは、Googleは物理インフラ・ハードウェア・ネットワークのセキュリティを担当します。アプリケーションコード・データ・IAM設定はお客様の責任です。",
    tags: ["security", "shared-responsibility"],
  },
  {
    id: "cdl-007",
    certId: "cdl",
    domain: "Google Cloudによるデータ価値の最大化",
    difficulty: "medium",
    question: "Vertex AIを使用する適切なシナリオはどれですか？",
    options: [
      "ユーザーのアクセス権限を管理する",
      "カスタム機械学習モデルのトレーニングとデプロイ",
      "仮想マシンを管理する",
      "データベースのバックアップを取得する",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AIはカスタムMLモデルのトレーニング、評価、デプロイ、監視のためのエンドツーエンドMLプラットフォームです。",
    tags: ["ai-ml", "vertex-ai"],
  },
  {
    id: "cdl-008",
    certId: "cdl",
    domain: "Google Cloudによるインフラストラクチャのモダナイズ",
    difficulty: "medium",
    question: "VPC (Virtual Private Cloud) の主な目的はどれですか？",
    options: [
      "データを圧縮して転送コストを削減する",
      "GCPリソース用のプライベートな仮想ネットワーク環境を提供する",
      "データベースのパフォーマンスを向上させる",
      "コンテナのオーケストレーションを管理する",
    ],
    correctIndex: 1,
    explanation:
      "VPCはGCPリソース用の分離されたプライベート仮想ネットワーク環境を提供し、ファイアウォールルール・ルーティング・サブネット分割を制御できます。",
    tags: ["networking", "vpc"],
  },
  {
    id: "cdl-009",
    certId: "cdl",
    domain: "Google Cloudによるアプリケーションの近代化",
    difficulty: "hard",
    question: "GKE Autopilotモードの特徴として正しいものはどれですか？",
    options: [
      "ノード管理が完全に自動化され、Podのリソース要求に基づいて課金される",
      "手動でノードプールを設定する必要がある",
      "Autopilotではカスタムワークロードを実行できない",
      "Autopilotは追加コストなしで使用できる",
    ],
    correctIndex: 0,
    explanation:
      "GKE Autopilotではノードのプロビジョニング・スケーリング・管理がすべて自動化されます。課金はPodのvCPU/メモリ要求ベースで、ノード単位の課金ではありません。",
    tags: ["compute", "gke", "kubernetes"],
  },
  {
    id: "cdl-010",
    certId: "cdl",
    domain: "Google Cloudによるデータ価値の最大化",
    difficulty: "easy",
    question: "Pub/Subサービスの主なユースケースはどれですか？",
    options: [
      "SQLデータベースの管理",
      "アプリケーション間の非同期メッセージング",
      "静的Webサイトのホスティング",
      "機械学習モデルのトレーニング",
    ],
    correctIndex: 1,
    explanation:
      "Pub/Sub (Publish/Subscribe) はアプリケーション間の非同期メッセージングを提供し、イベント駆動アーキテクチャやストリーミングデータパイプラインで使用されます。",
    tags: ["messaging", "pubsub"],
  },
  {
    id: "cdl-011",
    certId: "cdl",
    domain: "Google Cloudによるインフラストラクチャのモダナイズ",
    difficulty: "medium",
    question: "Cloud SQLとCloud Spannerの最大の違いはどれですか？",
    options: [
      "Cloud SQLはNoSQL、SpannerはRDB",
      "SpannerはグローバルスケールでACIDトランザクションをサポートし、水平スケールできる",
      "Cloud SQLは無制限にスケールできる",
      "SpannerはMySQL専用",
    ],
    correctIndex: 1,
    explanation:
      "Cloud SpannerはグローバルにスケールするRDBで、強整合性とACIDトランザクションを維持しながら水平スケールが可能です。Cloud SQLはシングルリージョンの従来型RDBです。",
    tags: ["database", "cloud-sql", "spanner"],
  },
  {
    id: "cdl-012",
    certId: "cdl",
    domain: "デジタルトランスフォーメーションとGoogle Cloud",
    difficulty: "easy",
    question: "デジタルトランスフォーメーション (DX) においてクラウドが果たす役割として最も重要なものはどれですか？",
    options: [
      "既存のシステムを完全に廃棄する",
      "イノベーションの加速とコスト最適化を可能にする",
      "IT部門の廃止",
      "すべてのデータをオンプレミスに保持する",
    ],
    correctIndex: 1,
    explanation:
      "クラウドはDXにおいてイノベーションの加速（素早いプロトタイプ、新サービス展開）とコスト最適化（CapExからOpExへの転換）を可能にします。",
    tags: ["cloud-basics", "transformation"],
  },

  // ═══════════════════════════════════════════════════════════
  // ACE (Associate Cloud Engineer)
  // ═══════════════════════════════════════════════════════════
  {
    id: "ace-001",
    certId: "ace",
    domain: "クラウドソリューション環境の設定",
    difficulty: "easy",
    question: "gcloud CLIでプロジェクトを切り替えるコマンドはどれですか？",
    options: [
      "gcloud change project PROJECT_ID",
      "gcloud config set project PROJECT_ID",
      "gcloud switch --project PROJECT_ID",
      "gcloud projects use PROJECT_ID",
    ],
    correctIndex: 1,
    explanation:
      "`gcloud config set project PROJECT_ID` でアクティブなプロジェクトを切り替えます。設定を確認するには `gcloud config get-value project` を使用します。",
    tags: ["cli", "gcloud", "projects"],
  },
  {
    id: "ace-002",
    certId: "ace",
    domain: "クラウドソリューションのデプロイと実装",
    difficulty: "medium",
    question: "Compute EngineのインスタンスにSSH接続する最も安全な方法はどれですか？",
    options: [
      "パブリックIPを有効化してパスワード認証でSSH接続",
      "Cloud Identity-Aware Proxy (IAP) 経由でSSHトンネルを使用する",
      "ファイアウォールですべてのIPからポート22を開放する",
      "シリアルポートで接続する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud IAP TCP転送を使用するとパブリックIPなしでインターネット経由でSSH接続でき、IAMポリシーでアクセス制御できます。最も安全な方法です。",
    tags: ["compute", "security", "ssh", "iap"],
  },
  {
    id: "ace-003",
    certId: "ace",
    domain: "クラウドソリューションが正常に動作するための確保",
    difficulty: "medium",
    question: "GKEクラスターのPodが頻繁にOOMKilledで再起動する場合、最初に確認すべきことはどれですか？",
    options: [
      "ノードのCPU使用率を確認する",
      "Podのメモリリクエストとリミットがコンテナの実際の使用量に合っているか確認する",
      "クラスターを再作成する",
      "Kubernetes のバージョンをアップグレードする",
    ],
    correctIndex: 1,
    explanation:
      "OOMKilledはメモリ不足でPodが強制終了されることを示します。まずPodのメモリリクエスト/リミット設定と実際の使用量を確認し、適切に設定し直します。",
    tags: ["gke", "kubernetes", "troubleshooting"],
  },
  {
    id: "ace-004",
    certId: "ace",
    domain: "アクセスとセキュリティの構成",
    difficulty: "medium",
    question: "Compute EngineインスタンスがCloud StorageにアクセスするためのIAMのベストプラクティスはどれですか？",
    options: [
      "インスタンスにユーザーのサービスアカウントキーをダウンロードして保存する",
      "インスタンスにサービスアカウントをアタッチし、必要最小限のIAMロールを付与する",
      "全リソースにeditor権限を付与したサービスアカウントを使用する",
      "Application Default Credentialsは不要なので設定しない",
    ],
    correctIndex: 1,
    explanation:
      "最小権限の原則に従い、インスタンスに専用のサービスアカウントをアタッチし、必要なリソースへの必要最小限のロールのみを付与します。これにより認証情報の漏洩リスクを最小化できます。",
    tags: ["iam", "security", "service-accounts"],
  },
  {
    id: "ace-005",
    certId: "ace",
    domain: "クラウドソリューションの計画と構成",
    difficulty: "hard",
    question: "リードレプリカを持つCloud SQLインスタンスをリージョン障害から保護するための最善策はどれですか？",
    options: [
      "同一リージョン内に複数のリードレプリカを作成する",
      "クロスリージョンリードレプリカを作成し、必要時に手動でプロモーションする",
      "定期的にスナップショットを別リージョンに保存する",
      "Cloud Spannerに移行する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud SQLのクロスリージョンリードレプリカを作成しておくと、プライマリリージョン障害時にそのレプリカをスタンドアロンインスタンスとしてプロモーションできます。これがCloud SQLでのリージョン障害対策の標準的なアプローチです。",
    tags: ["database", "cloud-sql", "ha", "dr"],
  },
  {
    id: "ace-006",
    certId: "ace",
    domain: "クラウドソリューションのデプロイと実装",
    difficulty: "medium",
    question: "Cloud Runサービスのトラフィック分割を設定する目的として最も適切なものはどれですか？",
    options: [
      "コスト削減のためにリクエストを減らす",
      "新バージョンへの段階的なカナリアリリースを行う",
      "リクエストをCloud Functionsにリダイレクトする",
      "ロードバランサーを削除する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Runのトラフィック分割機能を使用すると、リビジョン間でトラフィックを分割し、新バージョンへの段階的な移行 (カナリアリリース) を安全に実施できます。",
    tags: ["cloud-run", "deployments", "canary"],
  },
  {
    id: "ace-007",
    certId: "ace",
    domain: "クラウドソリューション環境の設定",
    difficulty: "easy",
    question: "組織内の複数プロジェクトを一元管理するための構造として正しいものはどれですか？",
    options: [
      "全プロジェクトをフラットに管理する",
      "組織 > フォルダ > プロジェクト の階層構造を使用する",
      "プロジェクトを複数の課金アカウントに分散させる",
      "サービスアカウントごとにプロジェクトを作成する",
    ],
    correctIndex: 1,
    explanation:
      "GCPのリソース階層は「組織 > フォルダ > プロジェクト > リソース」の順です。フォルダを使うと部門別・環境別にプロジェクトをグループ化し、IAMポリシーを継承させて一元管理できます。",
    tags: ["organization", "resource-hierarchy"],
  },
  {
    id: "ace-008",
    certId: "ace",
    domain: "クラウドソリューションが正常に動作するための確保",
    difficulty: "hard",
    question: "Cloud Monitoringでアラートポリシーを作成する際、SLI (Service Level Indicator) として最も重要なメトリクスはどれですか？",
    options: [
      "CPU使用率のみを監視する",
      "エラー率・レイテンシ・可用性などのユーザー影響があるメトリクス",
      "ディスク使用量のみ",
      "ネットワーク帯域幅のみ",
    ],
    correctIndex: 1,
    explanation:
      "SLIはサービスの信頼性を測定する指標で、エラー率 (成功したリクエストの割合)・レイテンシ (応答時間)・可用性などユーザーエクスペリエンスに直結するメトリクスを使用します。",
    tags: ["monitoring", "slo", "sli"],
  },
  {
    id: "ace-009",
    certId: "ace",
    domain: "アクセスとセキュリティの構成",
    difficulty: "medium",
    question: "Cloud Storage バケットへのアクセスをプロジェクト外のユーザーに一時的に提供する最良の方法はどれですか？",
    options: [
      "バケットを公開にする",
      "Signed URL を生成して使用する",
      "ユーザーをプロジェクトに招待する",
      "バケットの内容をメールで送付する",
    ],
    correctIndex: 1,
    explanation:
      "Signed URLを使用すると、指定した期間だけ特定のオブジェクトへの一時的なアクセスを許可できます。IAMアカウントを作成する必要がなく、有効期限付きで安全です。",
    tags: ["storage", "gcs", "security", "signed-url"],
  },
  {
    id: "ace-010",
    certId: "ace",
    domain: "クラウドソリューションの計画と構成",
    difficulty: "medium",
    question: "GKEでステートフルなデータベースアプリを実行する際に使用すべきKubernetesリソースはどれですか？",
    options: ["Deployment", "DaemonSet", "StatefulSet", "ReplicaSet"],
    correctIndex: 2,
    explanation:
      "StatefulSetは永続的なIDと安定したストレージを必要とするステートフルなアプリ (データベース等) 向けのリソースです。Podが再作成されても同じIDとPersistent Volumeが使用されます。",
    tags: ["gke", "kubernetes", "statefulset"],
  },
  {
    id: "ace-011",
    certId: "ace",
    domain: "クラウドソリューションのデプロイと実装",
    difficulty: "hard",
    question: "BigQueryへのストリーミングデータ挿入と定期バッチロードの違いとして正しいものはどれですか？",
    options: [
      "ストリーミングはコストがかからず、バッチは高価",
      "ストリーミングは即座にクエリ可能だがコストが高く、バッチロードは無料だが数分の遅延がある",
      "バッチロードはリアルタイムクエリが可能",
      "どちらも機能と価格は同じ",
    ],
    correctIndex: 1,
    explanation:
      "BigQueryへのストリーミング挿入はデータが即座にクエリ可能になりますが、$0.01/200MBのコストがかかります。BigQuery Storage Write APIやバッチロード (GCSからのロード) は無料ですが、利用可能になるまで数分かかります。",
    tags: ["bigquery", "streaming", "batch"],
  },
  {
    id: "ace-012",
    certId: "ace",
    domain: "クラウドソリューション環境の設定",
    difficulty: "medium",
    question: "Cloud Deployment Managerを使用する主なメリットはどれですか？",
    options: [
      "GCPリソースをコードとして定義・管理し、インフラをバージョン管理できる",
      "アプリのデプロイを高速化する",
      "コストを自動的に削減する",
      "Kubernetesクラスターを管理する",
    ],
    correctIndex: 0,
    explanation:
      "Cloud Deployment Managerはインフラをコード (IaC) として管理するサービスです。YAMLやJinjaでGCPリソースを定義し、バージョン管理・繰り返し可能なデプロイ・インフラの標準化が実現できます。",
    tags: ["iac", "deployment-manager"],
  },

  // ═══════════════════════════════════════════════════════════
  // PCA (Professional Cloud Architect)
  // ═══════════════════════════════════════════════════════════
  {
    id: "pca-001",
    certId: "pca",
    domain: "クラウドソリューションインフラストラクチャの設計と計画",
    difficulty: "hard",
    question: "グローバルEコマースサイトで、ユーザーデータを一元管理しながら地域ごとのデータ主権要件を満たすためのデータベース設計はどれですか？",
    options: [
      "各リージョンに独立したCloud SQLインスタンスを配置し、アプリ層で同期する",
      "Cloud Spannerでマルチリージョン構成を使用し、テーブルにリージョン属性を付与してリーダー配置を制御する",
      "Firestoreのマルチリージョンレプリケーションを使用する",
      "BigQueryをデータストアとして使用する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Spannerのマルチリージョン構成では、データを複数リージョンに複製しながら、特定テーブルのリーダー (書き込み処理) を特定リージョンに配置できます。これにより強整合性を保ちながらデータ主権要件に対応できます。",
    tags: ["database", "spanner", "architecture", "global"],
  },
  {
    id: "pca-002",
    certId: "pca",
    domain: "セキュリティとコンプライアンスの設計",
    difficulty: "hard",
    question: "金融機関がGCPに移行する際、PCI DSS準拠を維持するための最も重要な設計原則はどれですか？",
    options: [
      "すべてのリソースをパブリックサブネットに配置し、ファイアウォールで保護する",
      "カード会員データを扱うシステムをプライベートVPCに分離し、VPC Service Controlsで境界を設定する",
      "Cloud Armorのみでセキュリティを確保する",
      "データを暗号化せずに保存して処理速度を向上させる",
    ],
    correctIndex: 1,
    explanation:
      "PCI DSSではカード会員データ環境 (CDE) の厳格な分離が必要です。VPC Service Controlsを使用してAPIレベルの境界を作成し、プライベートサブネット・Cloud Armor・Cloud KMS暗号化・監査ログを組み合わせます。",
    tags: ["security", "pci-dss", "vpc-service-controls", "compliance"],
  },
  {
    id: "pca-003",
    certId: "pca",
    domain: "クラウドソリューションインフラストラクチャの設計と計画",
    difficulty: "hard",
    question: "RTOが15分、RPOが5分の要件がある重要なWebアプリのDR設計として最適なものはどれですか？",
    options: [
      "バックアップ/リストア戦略 (別リージョンへの日次スナップショット)",
      "Pilot Light (最小限のリソースを別リージョンに待機させる)",
      "Warm Standby (縮小されたスタンバイ環境を別リージョンで常時稼働)",
      "Hot Standby/Active-Active (両リージョンで完全稼働)",
    ],
    correctIndex: 2,
    explanation:
      "RTO=15分、RPO=5分の要件はWarm Standbyが最適です。Backup/Restoreは数時間かかり、Pilot Lightは30分以上かかります。Hot StandbyはRTO/RPOは優れますが過剰にコストがかかります。Warm StandbyはRPO約5分、RTO約15分を達成できます。",
    tags: ["disaster-recovery", "rto", "rpo", "ha"],
  },
  {
    id: "pca-004",
    certId: "pca",
    domain: "技術プロセスの分析と最適化",
    difficulty: "hard",
    question: "既存オンプレミスHadoopクラスターをGCPに移行する際の最も推奨されるアプローチはどれですか？",
    options: [
      "Lift & Shift: オンプレミスのVMをそのままGCEに移動する",
      "Dataproc + Cloud Storage: HDFSをGCSに置き換え、Dataprocをエフェメラルクラスターとして使用する",
      "BigQuery: すべてのHadoopワークロードをBigQueryに移行する",
      "GKEでHadoopを自分で管理する",
    ],
    correctIndex: 1,
    explanation:
      "推奨アプローチは「HDFSをCloud Storageに」「HadoopクラスターをDataprocの一時クラスターに」です。ジョブ実行時のみクラスターを起動してコストを大幅削減できます。全ワークロードをBigQueryに移行するのは理想的ですが、Spark/Hiveジョブが多い場合はDataprocが現実的です。",
    tags: ["migration", "hadoop", "dataproc", "bigquery"],
  },
  {
    id: "pca-005",
    certId: "pca",
    domain: "クラウドソリューションインフラストラクチャの管理と準備",
    difficulty: "medium",
    question: "マルチプロジェクト環境でのVPC設計のベストプラクティスはどれですか？",
    options: [
      "各プロジェクトに独立したVPCを作成し、VPCピアリングで全接続する",
      "共有VPC (Shared VPC) を使用し、ホストプロジェクトから複数のサービスプロジェクトにネットワークを共有する",
      "すべてのリソースを1つのプロジェクトに集約する",
      "VPCは使用せずパブリックIPで全通信する",
    ],
    correctIndex: 1,
    explanation:
      "共有VPC (Shared VPC) はネットワーク管理をホストプロジェクトに集中させながら、複数のサービスプロジェクトでサブネットを共有できます。VPCピアリングのフルメッシュより管理が簡単で、一貫したネットワークポリシーを適用できます。",
    tags: ["networking", "vpc", "shared-vpc"],
  },
  {
    id: "pca-006",
    certId: "pca",
    domain: "技術プロセスの分析と最適化",
    difficulty: "hard",
    question: "マイクロサービスアーキテクチャでサービス間の結合度を下げながら、リアルタイムの状態変化を伝播させる最適な設計パターンはどれですか？",
    options: [
      "同期REST API呼び出しですべてのサービスを連結する",
      "イベント駆動アーキテクチャ: Pub/Subでドメインイベントを発行・購読する",
      "共有データベースですべてのサービスが直接読み書きする",
      "サービスメッシュのみで通信を制御する",
    ],
    correctIndex: 1,
    explanation:
      "Pub/Subを使ったイベント駆動アーキテクチャでは、各サービスが独立してイベントを発行・消費します。サービス間の直接依存がなく疎結合を実現でき、スケーラビリティと耐障害性が向上します。",
    tags: ["architecture", "microservices", "pubsub", "event-driven"],
  },
  {
    id: "pca-007",
    certId: "pca",
    domain: "セキュリティとコンプライアンスの設計",
    difficulty: "medium",
    question: "組織でCloud KMSのCustomer-Managed Encryption Keys (CMEK) を使用する主な理由はどれですか？",
    options: [
      "データを暗号化しないため処理速度を向上させる",
      "暗号鍵の管理・ローテーション・失効をお客様が制御し、コンプライアンス要件を満たす",
      "データ転送コストを削減する",
      "CMEKはデフォルト暗号化より安全ではない",
    ],
    correctIndex: 1,
    explanation:
      "CMEKを使用すると、暗号鍵をお客様が管理するCloud KMSのキーリングに保存します。鍵のローテーション・無効化・監査ができ、特定のコンプライアンス要件 (金融・医療等) でデータへのアクセス制御証明が必要な場合に使用します。",
    tags: ["security", "kms", "encryption", "cmek"],
  },
  {
    id: "pca-008",
    certId: "pca",
    domain: "クラウドソリューションインフラストラクチャの設計と計画",
    difficulty: "hard",
    question: "グローバルなゲームプラットフォームで月間アクティブユーザー数1億人を処理するためのデータベース選択として最適なものはどれですか？",
    options: [
      "Cloud SQL (MySQL) シングルリージョン",
      "Cloud Bigtable: 低レイテンシ・高スループットでプレイヤーセッション/スコアを格納",
      "Firestore: リアルタイム同期でゲーム状態を管理",
      "BigQuery: ゲームプレイデータをリアルタイムで分析",
    ],
    correctIndex: 1,
    explanation:
      "1億人規模のゲームプラットフォームでのプレイヤーセッション・スコア管理には、Cloud Bigtableが最適です。ミリ秒以下のレイテンシ・大規模書き込みスループット・行キーによる高速ルックアップを提供します。Firestoreはドキュメント指向でシングルドキュメントの同時書き込みに制限があります。",
    tags: ["database", "bigtable", "gaming", "scale"],
  },

  // ═══════════════════════════════════════════════════════════
  // PDE (Professional Data Engineer)
  // ═══════════════════════════════════════════════════════════
  {
    id: "pde-001",
    certId: "pde",
    domain: "データ処理システムの設計",
    difficulty: "medium",
    question: "毎秒100万件のIoTデバイスデータをリアルタイムで分析するパイプラインに最適な構成はどれですか？",
    options: [
      "Cloud Storage → バッチDataflow → BigQuery",
      "Pub/Sub → ストリーミングDataflow → BigQuery + BigTable",
      "Cloud SQL → アプリケーション処理 → BigQuery",
      "Dataproc → Spark Streaming → Firestore",
    ],
    correctIndex: 1,
    explanation:
      "リアルタイムIoTデータパイプラインの標準的なGCPアーキテクチャはPub/Sub (取り込み) → Dataflow (変換/集計) → BigQuery (分析/レポート) + Cloud Bigtable (低レイテンシルックアップ) です。",
    tags: ["iot", "streaming", "pubsub", "dataflow", "bigquery"],
  },
  {
    id: "pde-002",
    certId: "pde",
    domain: "データ処理システムの構築と運用",
    difficulty: "hard",
    question: "BigQueryでクエリのコストを最小化するためのベストプラクティスとして正しいものはどれですか？",
    options: [
      "SELECT * を使用して全列を取得する",
      "クラスタリング・パーティショニング・必要な列のみ選択でスキャン量を削減する",
      "すべてのデータを1つの大きなテーブルに格納する",
      "ネストされたデータ構造を使用しない",
    ],
    correctIndex: 1,
    explanation:
      "BigQueryはスキャンしたデータ量で課金されます。コスト最適化には: (1) 必要な列のみSELECT、(2) WHERE句でパーティション列をフィルタ、(3) クラスタリングで関連データをまとめる、(4) マテリアライズドビューの活用 が効果的です。",
    tags: ["bigquery", "cost", "optimization"],
  },
  {
    id: "pde-003",
    certId: "pde",
    domain: "機械学習モデルの運用",
    difficulty: "medium",
    question: "BigQuery MLとVertex AI Custom Trainingの選択基準として正しいものはどれですか？",
    options: [
      "BigQuery MLは常により高精度なモデルを生成する",
      "BQMLはBQデータに対してSQL直接でモデル作成・予測でき素早く試行できる。複雑なカスタムモデルにはVertex AIが適する",
      "Vertex AIはBigQueryデータの分析に使用できない",
      "両サービスに機能の差はない",
    ],
    correctIndex: 1,
    explanation:
      "BigQuery MLはBQデータに対してSQLでモデルの作成・評価・予測ができ、データを移動せず素早く試行できます。複雑なカスタムアーキテクチャ・大規模トレーニング・高度なMLOpsにはVertex AI Custom Trainingが適します。",
    tags: ["ml", "bigquery-ml", "vertex-ai"],
  },
  {
    id: "pde-004",
    certId: "pde",
    domain: "データ処理システムの設計",
    difficulty: "hard",
    question: "Dataflowパイプラインでレイトデータ (遅延データ) を適切に処理するための Apache Beam の機能はどれですか？",
    options: [
      "遅延データは無視してドロップする",
      "ウィンドウ関数 + Watermark + allowedLateness を設定して遅延データを処理する",
      "すべてのデータをバッチ処理する",
      "Pub/Subの保持期間を延長する",
    ],
    correctIndex: 1,
    explanation:
      "Apache Beamのウィンドウ処理では、WatermarkでイベントタイムとProcessing Timeの遅れを推定し、allowedLatenessで指定時間内の遅延データをウィンドウ結果に含めます。これによりストリーミングパイプラインで信頼性のある集計が可能です。",
    tags: ["dataflow", "apache-beam", "streaming", "windowing"],
  },
  {
    id: "pde-005",
    certId: "pde",
    domain: "信頼性の高いソリューションの確保",
    difficulty: "medium",
    question: "Cloud Bigtableのパフォーマンスを最大化するためのロウキー設計の原則として正しいものはどれですか？",
    options: [
      "タイムスタンプをロウキーの先頭に配置してデータの時系列アクセスを最適化する",
      "ホットスポットを避けるためにロウキーを分散させ、タイムスタンプは末尾か逆順にする",
      "すべてのロウキーを数値IDにする",
      "ロウキーを短くしてストレージを節約する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Bigtableでタイムスタンプをキー先頭に使うと最新データが同じノードに集中しホットスポットが発生します。ホットスポット回避のため、フィールドを逆順にしたタイムスタンプや、ハッシュプレフィックス、ユーザーID等でロウキーを分散させます。",
    tags: ["bigtable", "row-key", "performance"],
  },
  {
    id: "pde-006",
    certId: "pde",
    domain: "データ処理システムの構築と運用",
    difficulty: "hard",
    question: "Pub/Subでメッセージが重複して配信された場合のべき等性 (Idempotency) を確保する最良の方法はどれですか？",
    options: [
      "サブスクリプションのACKタイムアウトを延長する",
      "メッセージIDまたは一意のビジネスキーを使用してサブスクライバー側で重複チェックを行う",
      "Pub/Subは常に正確に1回だけ配信するので対応不要",
      "メッセージ受信ごとにトピックを削除・再作成する",
    ],
    correctIndex: 1,
    explanation:
      "Pub/Subは「少なくとも1回」の配信保証のため重複が発生しえます。Pub/Sub Liteのexactly-once配信またはサブスクライバー側でメッセージIDや一意のビジネスキーでべき等性処理 (重複チェック/冪等更新) を実装します。",
    tags: ["pubsub", "idempotency", "messaging"],
  },
  {
    id: "pde-007",
    certId: "pde",
    domain: "機械学習モデルの運用",
    difficulty: "hard",
    question: "Vertex AI Feature Storeを使用する主なメリットはどれですか？",
    options: [
      "特徴量の計算を完全に自動化する",
      "特徴量の一貫性確保 (学習・推論でのskew防止)・再利用・低レイテンシ提供",
      "モデルのトレーニングを高速化する",
      "データパイプラインを自動生成する",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI Feature Storeはトレーニングと推論で同じ特徴量変換を使用することを保証し、学習・推論スキュー (training-serving skew) を防ぎます。また特徴量を再利用可能にし、低レイテンシのオンライン提供とバッチ取得の両方に対応します。",
    tags: ["vertex-ai", "feature-store", "mlops"],
  },

  // ═══════════════════════════════════════════════════════════
  // PMLE (Professional ML Engineer)
  // ═══════════════════════════════════════════════════════════
  {
    id: "pmle-001",
    certId: "pmle",
    domain: "MLの問題の設計",
    difficulty: "medium",
    question: "モデルのデータドリフトを検出・対応するためのMLOpsのアプローチとして最適なものはどれですか？",
    options: [
      "本番環境でのモデルパフォーマンスを監視せず、定期的に手動で再トレーニングする",
      "Vertex AI Model Monitoringでスキュー・ドリフトを継続的に検出し、閾値超過時に自動再トレーニングパイプラインをトリガーする",
      "モデルは一度作成したら変更しない",
      "本番データとトレーニングデータを同一にする",
    ],
    correctIndex: 1,
    explanation:
      "本番環境では時間とともにデータ分布が変化 (コンセプトドリフト・データドリフト) します。Vertex AI Model MonitoringでKL divergenceやJSH divergenceを監視し、閾値超過時にVertex AI Pipelinesで自動再トレーニングをトリガーするのがMLOpsのベストプラクティスです。",
    tags: ["mlops", "model-monitoring", "drift", "vertex-ai"],
  },
  {
    id: "pmle-002",
    certId: "pmle",
    domain: "MLモデルの構築",
    difficulty: "hard",
    question: "Vertex AI で大規模言語モデル (LLM) をファインチューニングする際のベストプラクティスはどれですか？",
    options: [
      "常にゼロからフルトレーニングを行う",
      "タスク固有データでSFT (Supervised Fine-Tuning) またはLoRA/QLoRAで効率的にファインチューニングし、RLHF等でアライメントする",
      "プロンプトエンジニアリングのみで対応し、ファインチューニングは不要",
      "すべてのデータで常にフルパラメータ更新する",
    ],
    correctIndex: 1,
    explanation:
      "LLMのファインチューニングでは、Parameter-Efficient Fine-Tuning (PEFT) のLoRA/QLoRAを使用すると少ないGPUリソースで効率的にドメイン適応できます。タスク固有データでのSFTから始め、必要に応じてRLHFでアライメントします。Vertex AI Model GardenとVertex AI Fine-tuningサービスを活用します。",
    tags: ["llm", "fine-tuning", "vertex-ai", "peft"],
  },
  {
    id: "pmle-003",
    certId: "pmle",
    domain: "MLパイプラインの自動化とオーケストレーション",
    difficulty: "hard",
    question: "ML実験を再現可能にするための Vertex AI Experiments の活用方法として正しいものはどれですか？",
    options: [
      "ハイパーパラメータを手動でスプレッドシートで管理する",
      "Vertex AI Experimentsでトレーニングパラメータ・メトリクス・アーティファクトを自動追跡し比較する",
      "実験結果は保存せず都度実行する",
      "MLflowのみを使用してGCPのサービスは使わない",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI Experimentsはトレーニングラン・ハイパーパラメータ・メトリクス・モデルアーティファクトを自動追跡します。実験間の比較・再現・最良モデルの特定が容易になります。TensorBoardとも統合されています。",
    tags: ["mlops", "experiments", "vertex-ai", "reproducibility"],
  },
  {
    id: "pmle-004",
    certId: "pmle",
    domain: "MLモデルの提供と共有",
    difficulty: "medium",
    question: "オンライン予測とバッチ予測の使い分けとして正しいものはどれですか？",
    options: [
      "バッチ予測は常にオンライン予測より精度が高い",
      "オンライン予測はリアルタイム単一リクエスト用（低レイテンシ重視）、バッチ予測は大量データの非同期処理用（コスト重視）",
      "オンライン予測は大量データの処理に最適",
      "バッチ予測はリアルタイムアプリケーションに使用する",
    ],
    correctIndex: 1,
    explanation:
      "オンライン予測（Endpoint）はHTTPリクエストを受け取り即座に予測を返します（ミリ秒〜秒単位、常時稼働コスト）。バッチ予測はGCSのデータを非同期で一括処理します（時間単位、使った分だけ課金）。レイテンシ要件と処理量でどちらを使うか決めます。",
    tags: ["vertex-ai", "prediction", "online", "batch"],
  },
  {
    id: "pmle-005",
    certId: "pmle",
    domain: "MLソリューションの監視、最適化、保守",
    difficulty: "hard",
    question: "本番MLモデルで予測の偏り (Bias) を検出・軽減するために Vertex AI が提供する機能はどれですか？",
    options: [
      "偏りはMLモデルには存在しないため対応不要",
      "Vertex AI Model EvaluationとVertex Explainable AIを使用してスライス評価・特徴量重要度を分析しバイアスを特定する",
      "すべてのデータを同じ量で使えば偏りは発生しない",
      "偏り検出は本番後でなくトレーニング時のみ行う",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI Model Evaluationではスライス (年齢・性別・地域など) ごとのメトリクスを評価してグループ間の公平性を検証できます。Vertex Explainable AI (Shapley値・LIME等) で予測根拠の特徴量重要度を分析し、不当なバイアスを特定します。",
    tags: ["fairness", "bias", "explainability", "vertex-ai"],
  },
  {
    id: "pmle-006",
    certId: "pmle",
    domain: "MLパイプラインの自動化とオーケストレーション",
    difficulty: "hard",
    question: "Vertex AI Pipelinesを使用するメリットとして最も重要なものはどれですか？",
    options: [
      "パイプラインを使用するとモデル精度が自動的に向上する",
      "ML ワークフロー（データ処理・学習・評価・デプロイ）をコードで定義し、再現可能・監査可能・スケーラブルにする",
      "トレーニングコストが0になる",
      "手動でのモデル管理が容易になる",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI PipelinesはKubeflow Pipelines/TFXベースのMLワークフローオーケストレーションサービスです。各ステップをコンテナとして定義し、依存関係を管理します。再現性・監査可能性・並列実行・キャッシュ活用によりMLOpsを効率化します。",
    tags: ["mlops", "pipelines", "vertex-ai", "orchestration"],
  },
  {
    id: "pmle-007",
    certId: "pmle",
    domain: "MLモデルの構築",
    difficulty: "medium",
    question: "AutoMLとカスタムトレーニングの選択基準として正しいものはどれですか？",
    options: [
      "AutoMLは常にカスタムモデルより優れている",
      "AutoMLは素早くベースラインを構築するのに適し、特殊なアーキテクチャや既存コードの再利用が必要な場合はカスタムトレーニングを選ぶ",
      "カスタムトレーニングは初心者向けで、AutoMLはエキスパート向け",
      "AutoMLはテキスト/画像のみ対応で表形式データには使えない",
    ],
    correctIndex: 1,
    explanation:
      "AutoML (Vertex AI AutoML) は少ないコードでデータからモデルを自動構築します。素早いベースライン構築・MLの専門知識が少ない場合に有効です。特殊なアーキテクチャ・既存フレームワーク (TF/PyTorch) の活用・完全なカスタマイズが必要な場合はCustom Trainingを選択します。",
    tags: ["automl", "custom-training", "vertex-ai"],
  },
  {
    id: "pmle-008",
    certId: "pmle",
    domain: "MLの問題の設計",
    difficulty: "hard",
    question: "推薦システムの評価指標として適切なものはどれですか？",
    options: [
      "Accuracy (正解率) のみ",
      "Precision@K・Recall@K・NDCG・AUC-ROC などランキング考慮の指標",
      "MSE (平均二乗誤差) のみ",
      "モデルサイズが小さいほど良い推薦システム",
    ],
    correctIndex: 1,
    explanation:
      "推薦システムでは上位K件のレコメンデーションの品質が重要です。Precision@K（上位K件の正解率）、Recall@K（正解のカバー率）、NDCG（順序を考慮したランキング品質）、AUC-ROCなどを使用します。単純なAccuracyはクリック率や満足度との相関が低いです。",
    tags: ["recommendation", "evaluation", "metrics"],
  },
  // ═══════════════════════════════════════════════════════════
  // CDL Additional Questions
  // ═══════════════════════════════════════════════════════════
  {
    id: "cdl-013",
    certId: "cdl",
    domain: "デジタルトランスフォーメーションとGoogle Cloud",
    difficulty: "easy",
    question: "Google Cloud の「責任共有モデル」において、クラウドプロバイダーが責任を持つのはどれですか？",
    options: [
      "顧客データのアクセス制御",
      "物理インフラのセキュリティ",
      "アプリケーションの脆弱性対応",
      "IAMポリシーの設定",
    ],
    correctIndex: 1,
    explanation:
      "責任共有モデルでは、物理インフラ（データセンター、ハードウェア）のセキュリティはクラウドプロバイダーが責任を持ちます。IAMやデータ保護は顧客側の責任です。",
    tags: ["security", "shared-responsibility"],
  },
  {
    id: "cdl-014",
    certId: "cdl",
    domain: "Google Cloudによるインフラストラクチャのモダナイズ",
    difficulty: "medium",
    question: "オンプレミスのサーバーをそのままクラウドに移行する戦略を何と呼びますか？",
    options: [
      "Replatform (再プラットフォーム)",
      "Refactor (リファクタリング)",
      "Rehost (リホスト/Lift & Shift)",
      "Replace (置換)",
    ],
    correctIndex: 2,
    explanation:
      "Rehost（リホスト）は「Lift & Shift」とも呼ばれ、アプリケーションを変更せずにそのままクラウドに移行する最も迅速な方法です。",
    tags: ["migration", "lift-and-shift"],
  },
  {
    id: "cdl-015",
    certId: "cdl",
    domain: "Google Cloudによるデータ価値の最大化",
    difficulty: "easy",
    question: "Vertex AIの説明として正しいものはどれですか？",
    options: [
      "リレーショナルデータベースサービス",
      "機械学習モデルの開発・デプロイ・管理プラットフォーム",
      "ストリーミングデータ処理サービス",
      "NoSQLデータベースサービス",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AIはGoogle CloudのフルマネージドMLプラットフォームで、データ準備からモデルトレーニング、デプロイ、監視まで一元管理できます。",
    tags: ["vertex-ai", "ml"],
  },
  {
    id: "cdl-016",
    certId: "cdl",
    domain: "Google Cloudによるアプリケーションの近代化",
    difficulty: "medium",
    question: "Kubernetesを使用するメリットとして正しいものはどれですか？",
    options: [
      "仮想マシンより起動が遅い",
      "コンテナのオーケストレーションと自動スケーリングが可能",
      "データベース管理専用のシステム",
      "サーバーレス実行環境",
    ],
    correctIndex: 1,
    explanation:
      "KubernetesはコンテナのOrchestrationシステムで、デプロイ自動化、スケーリング、自己修復、ロードバランシングなどを提供します。",
    tags: ["kubernetes", "containers"],
  },
  {
    id: "cdl-017",
    certId: "cdl",
    domain: "Google Cloudによるインフラストラクチャのモダナイズ",
    difficulty: "easy",
    question: "Google Cloud で複数のリソースをグループ化し、課金や権限管理を行う単位は何ですか？",
    options: [
      "ゾーン",
      "リージョン",
      "プロジェクト",
      "組織",
    ],
    correctIndex: 2,
    explanation:
      "GCPではプロジェクトがリソースのグループ化単位で、課金・IAM・API管理の境界となります。組織は複数プロジェクトの管理階層です。",
    tags: ["project", "billing", "iam"],
  },
  // ═══════════════════════════════════════════════════════════
  // ACE Additional Questions
  // ═══════════════════════════════════════════════════════════
  {
    id: "ace-013",
    certId: "ace",
    domain: "クラウドソリューションのデプロイと実装",
    difficulty: "medium",
    question: "GKEクラスターで、特定のノードにのみPodをスケジュールするための仕組みはどれですか？",
    options: [
      "Namespace",
      "ConfigMap",
      "NodeSelector / NodeAffinity",
      "DaemonSet",
    ],
    correctIndex: 2,
    explanation:
      "NodeSelectorやNodeAffinityを使用すると、ラベルに基づいて特定ノードにPodをスケジュールできます。DaemonSetは全ノードにPodを配置します。",
    tags: ["gke", "kubernetes", "scheduling"],
  },
  {
    id: "ace-014",
    certId: "ace",
    domain: "アクセスとセキュリティの構成",
    difficulty: "medium",
    question: "サービスアカウントのベストプラクティスとして正しいものはどれですか？",
    options: [
      "1つのサービスアカウントを全サービスで共有する",
      "サービスアカウントキーをGitリポジトリに保存する",
      "最小権限の原則に従い、用途ごとに専用アカウントを作成する",
      "サービスアカウントにオーナーロールを付与する",
    ],
    correctIndex: 2,
    explanation:
      "最小権限の原則に従い、サービスごとに専用のサービスアカウントを作成し、必要最小限の権限のみを付与することがベストプラクティスです。",
    tags: ["iam", "service-account", "security"],
  },
  {
    id: "ace-015",
    certId: "ace",
    domain: "クラウドソリューションが正常に動作するための確保",
    difficulty: "medium",
    question: "Cloud Monitoringでアラートを設定する際、通知を送るために設定する必要があるものは何ですか？",
    options: [
      "Cloud Trace",
      "通知チャンネル (Notification Channel)",
      "Cloud Profiler",
      "Cloud Deployment Manager",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Monitoringのアラートポリシーでは、条件に加えて通知チャンネル（メール、SMS、PagerDuty等）を設定する必要があります。",
    tags: ["monitoring", "alerting"],
  },
  {
    id: "ace-016",
    certId: "ace",
    domain: "クラウドソリューション環境の設定",
    difficulty: "easy",
    question: "gcloudコマンドでデフォルトプロジェクトを設定するコマンドはどれですか？",
    options: [
      "gcloud projects set default PROJECT_ID",
      "gcloud config set project PROJECT_ID",
      "gcloud init --project PROJECT_ID",
      "gcloud set-project PROJECT_ID",
    ],
    correctIndex: 1,
    explanation:
      "gcloud config set project PROJECT_ID でデフォルトプロジェクトを設定します。gcloud init を使うと対話的に設定できます。",
    tags: ["gcloud", "cli", "config"],
  },
  {
    id: "ace-017",
    certId: "ace",
    domain: "クラウドソリューションの計画と構成",
    difficulty: "hard",
    question: "低レイテンシが要求されるグローバルユーザー向けのリレーショナルデータベースとして最適なサービスはどれですか？",
    options: [
      "Cloud SQL",
      "Cloud Bigtable",
      "Cloud Spanner",
      "Firestore",
    ],
    correctIndex: 2,
    explanation:
      "Cloud Spannerはグローバルに分散したリレーショナルデータベースで、強一貫性を保ちながらグローバルスケールで低レイテンシを実現します。マルチリージョン構成でSLA 99.999%を提供します。",
    tags: ["cloud-spanner", "database", "global"],
  },
  {
    id: "ace-018",
    certId: "ace",
    domain: "クラウドソリューションのデプロイと実装",
    difficulty: "medium",
    question: "Cloud Runサービスで、リクエストがない場合にインスタンス数を0にしてコストを削減するための設定はどれですか？",
    options: [
      "最大インスタンス数を0に設定",
      "最小インスタンス数を0に設定（デフォルト）",
      "同時実行数を0に設定",
      "タイムアウトを0に設定",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Runのデフォルト設定では最小インスタンス数が0のため、リクエストがない場合は0にスケールダウンします。コールドスタートを防ぐには最小インスタンスを1以上に設定します。",
    tags: ["cloud-run", "scaling", "cost"],
  },
  // ═══════════════════════════════════════════════════════════
  // PCA Additional Questions
  // ═══════════════════════════════════════════════════════════
  {
    id: "pca-009",
    certId: "pca",
    domain: "クラウドソリューションインフラストラクチャの設計と計画",
    difficulty: "hard",
    question: "RPO=1時間、RTO=4時間の要件に最も適したDR戦略はどれですか？",
    options: [
      "Backup & Restore（バックアップ/復元）",
      "Pilot Light（パイロットライト）",
      "Warm Standby（ウォームスタンバイ）",
      "Hot Standby（ホットスタンバイ/マルチサイト）",
    ],
    correctIndex: 2,
    explanation:
      "RPO=1時間は継続的なデータレプリケーションが必要で、RTO=4時間は完全な切り替えより速く、コストも抑えられるWarm Standbyが適切です。Hot Standbyはコストが最も高いため過剰です。",
    tags: ["disaster-recovery", "rpo-rto", "ha"],
  },
  {
    id: "pca-010",
    certId: "pca",
    domain: "セキュリティとコンプライアンスの設計",
    difficulty: "hard",
    question: "多数のGCPプロジェクトにまたがって一貫したセキュリティポリシーを適用するための最も効率的な方法はどれですか？",
    options: [
      "各プロジェクトに個別にIAMポリシーを設定する",
      "組織ノードで組織ポリシーを設定する",
      "すべてのリソースにタグを付けてポリシーを管理する",
      "Cloud Deployment Managerで各プロジェクトを管理する",
    ],
    correctIndex: 1,
    explanation:
      "組織ノードでの組織ポリシー設定は、配下のすべてのフォルダ・プロジェクトに継承されます。これにより一貫したポリシーを効率的に管理できます。",
    tags: ["organization-policy", "security", "iam"],
  },
  {
    id: "pca-011",
    certId: "pca",
    domain: "技術プロセスの分析と最適化",
    difficulty: "hard",
    question: "TerramEarthのケーススタディで、重機のテレメトリデータをリアルタイム処理するためのアーキテクチャとして最適なものはどれですか？",
    options: [
      "Cloud SQL → BigQuery",
      "Pub/Sub → Dataflow → BigQuery",
      "Cloud Storage → Dataproc → BigQuery",
      "Cloud Functions → Cloud SQL",
    ],
    correctIndex: 1,
    explanation:
      "TerramEarthの重機センサーデータはリアルタイムストリーミングが必要です。Pub/Sub（メッセージキュー）→ Dataflow（ストリーミング処理）→ BigQuery（分析）がベストプラクティスです。",
    tags: ["case-study", "terramearth", "streaming", "architecture"],
  },
  {
    id: "pca-012",
    certId: "pca",
    domain: "クラウドソリューションインフラストラクチャの管理と準備",
    difficulty: "medium",
    question: "複数のチームが同じGCPリソースを使用しているとき、コストの割り当てを明確にするためのベストプラクティスはどれですか？",
    options: [
      "すべてのリソースを1つのプロジェクトにまとめる",
      "チームごとに別々のプロジェクトを作成し、ラベルで管理する",
      "すべてのリソースにコスト配分ラベルを付けて予算アラートを設定する",
      "月次で手動でコストを集計する",
    ],
    correctIndex: 2,
    explanation:
      "コスト配分ラベル（例: team=backend, env=prod）をリソースに付けることで、BigQueryの課金エクスポートデータを使ってチーム別・環境別のコスト分析が可能になります。",
    tags: ["cost-management", "labels", "billing"],
  },
  {
    id: "pca-013",
    certId: "pca",
    domain: "クラウドソリューションインフラストラクチャの設計と計画",
    difficulty: "hard",
    question: "Mountkirkのケーススタディで、グローバルなゲームプレイヤーに対して低レイテンシの排他ゲームサーバーを動的に配置するサービスはどれですか？",
    options: [
      "Cloud Run",
      "Compute Engine Managed Instance Group",
      "Google Kubernetes Engine Autopilot",
      "Cloud Game Servers (Agones)",
    ],
    correctIndex: 3,
    explanation:
      "Cloud Game Servers (オープンソースのAgonesを基盤)はKubernetes上でステートフルなゲームサーバーを動的にプロビジョニング・管理するサービスで、Mountkirkのユースケースに最適です。",
    tags: ["case-study", "mountkirk", "game-servers", "agones"],
  },
  // ═══════════════════════════════════════════════════════════
  // PDE Additional Questions
  // ═══════════════════════════════════════════════════════════
  {
    id: "pde-008",
    certId: "pde",
    domain: "データ処理システムの構築と運用",
    difficulty: "hard",
    question: "BigQueryでクエリコストを最小化するためのベストプラクティスとして正しいものはどれですか？",
    options: [
      "SELECT * を使用してすべての列を取得する",
      "パーティション分割されたテーブルにパーティションフィルターを使用する",
      "クエリごとに新しいデータセットを作成する",
      "常にJOINを避けてサブクエリを使用する",
    ],
    correctIndex: 1,
    explanation:
      "BigQueryは列指向ストレージのため、SELECT * は全列を読み込みコストが増大します。パーティション分割テーブルにWHEREでパーティションフィルターを使うことでスキャン量を削減できます。",
    tags: ["bigquery", "cost-optimization", "partitioning"],
  },
  {
    id: "pde-009",
    certId: "pde",
    domain: "データ処理システムの構築と運用",
    difficulty: "hard",
    question: "Apache Beam の Dataflow パイプラインで、遅延データ（Late Data）を処理するための機能はどれですか？",
    options: [
      "Side Input",
      "Allowed Lateness と Water Mark",
      "Combine Transform",
      "Flatten Transform",
    ],
    correctIndex: 1,
    explanation:
      "DataflowではWatermarkがストリームの進行を追跡し、Allowed Latenessで遅延データを受け入れる時間窓を設定します。これにより遅延到着のイベントも適切に処理できます。",
    tags: ["dataflow", "beam", "streaming", "watermark"],
  },
  {
    id: "pde-010",
    certId: "pde",
    domain: "データ処理システムの設計",
    difficulty: "hard",
    question: "Cloud Bigtableで大量の時系列データを効率的に読み取るためのRow Keyの設計として最適なものはどれですか？",
    options: [
      "タイムスタンプのみを使用する（例: 20260326143000）",
      "デバイスID + 逆順タイムスタンプ（例: device123#99999999-timestamp）",
      "ランダムUUIDを使用する",
      "自動インクリメントの整数を使用する",
    ],
    correctIndex: 1,
    explanation:
      "時系列データでタイムスタンプのみのRow KeyはHotspotを引き起こします。デバイスID + 逆順タイムスタンプの組み合わせにより、最新データが先頭に来てシーケンシャル読み取りが効率化されます。",
    tags: ["bigtable", "row-key", "timeseries", "design"],
  },
  {
    id: "pde-011",
    certId: "pde",
    domain: "機械学習モデルの運用",
    difficulty: "medium",
    question: "BigQuery MLで線形回帰モデルを作成するSQLの正しい構文はどれですか？",
    options: [
      "CREATE MODEL dataset.model OPTIONS(model_type='linear_reg') AS SELECT ...",
      "TRAIN MODEL dataset.model TYPE linear_reg AS SELECT ...",
      "INSERT INTO dataset.model SELECT ... USING linear_regression",
      "CREATE TABLE dataset.model USING ML AS SELECT ...",
    ],
    correctIndex: 0,
    explanation:
      "BigQuery MLではCREATE MODEL文を使用します。OPTIONS(model_type='linear_reg')でモデルタイプを指定し、AS SELECTでトレーニングデータを指定します。",
    tags: ["bigquery-ml", "sql", "ml"],
  },
  {
    id: "pde-012",
    certId: "pde",
    domain: "信頼性の高いソリューションの確保",
    difficulty: "medium",
    question: "Pub/Subのデッドレタートピック（Dead Letter Topic）の主な用途はどれですか？",
    options: [
      "未配信または処理失敗したメッセージを別トピックに転送して分析する",
      "優先度の高いメッセージを最初に処理する",
      "メッセージのフィルタリングに使用する",
      "トピック間のメッセージ転送に使用する",
    ],
    correctIndex: 0,
    explanation:
      "デッドレタートピックは、最大配信試行回数を超えたメッセージを転送します。これにより問題のあるメッセージを隔離し、メインのパイプラインをブロックせずに後で調査・再処理できます。",
    tags: ["pubsub", "dead-letter", "error-handling"],
  },
  // ═══════════════════════════════════════════════════════════
  // PMLE Additional Questions
  // ═══════════════════════════════════════════════════════════
  {
    id: "pmle-009",
    certId: "pmle",
    domain: "MLパイプラインの自動化とオーケストレーション",
    difficulty: "hard",
    question: "Vertex AI Pipelinesでコンポーネントを再利用可能にするために使用するデコレータはどれですか？",
    options: [
      "@pipeline",
      "@component",
      "@task",
      "@vertex_component",
    ],
    correctIndex: 1,
    explanation:
      "@component デコレータを使用すると、Python関数をVertex AI Pipelinesの再利用可能なコンポーネントとして定義できます。コンポーネントはDockerコンテナとして実行されます。",
    tags: ["vertex-ai-pipelines", "mlops", "kubeflow"],
  },
  {
    id: "pmle-010",
    certId: "pmle",
    domain: "MLモデルの提供と共有",
    difficulty: "hard",
    question: "オンライン予測とバッチ予測の使い分けとして正しいものはどれですか？",
    options: [
      "リアルタイムでの単一リクエスト→オンライン予測、大量データの一括処理→バッチ予測",
      "オンラインの方がコストが安い",
      "バッチ予測はリアルタイムで応答する",
      "どちらも同じレイテンシを持つ",
    ],
    correctIndex: 0,
    explanation:
      "オンライン予測はリアルタイム（低レイテンシ）の単一リクエストに適し、バッチ予測は大量データを非同期で一括処理するためコスト効率が良いです。",
    tags: ["vertex-ai", "prediction", "online-vs-batch"],
  },
  {
    id: "pmle-011",
    certId: "pmle",
    domain: "MLソリューションの監視、最適化、保守",
    difficulty: "hard",
    question: "モデルのデータドリフトとコンセプトドリフトの違いとして正しいものはどれですか？",
    options: [
      "データドリフト:入力特徴量の分布変化、コンセプトドリフト:ターゲット変数と特徴量の関係変化",
      "どちらも同じ現象を指す",
      "データドリフト:モデルの精度低下、コンセプトドリフト:データ量の増加",
      "データドリフト:ラベルの変化、コンセプトドリフト:特徴量の変化",
    ],
    correctIndex: 0,
    explanation:
      "データドリフトは入力データの統計的分布が変化すること（例：季節変動）。コンセプトドリフトは特徴量とターゲットの関係自体が変化すること（例：ユーザー行動パターンの変化）。",
    tags: ["model-monitoring", "drift", "mlops"],
  },
  {
    id: "pmle-012",
    certId: "pmle",
    domain: "MLの問題の設計",
    difficulty: "medium",
    question: "Google Cloudで画像分類モデルを最小の労力で構築するための最適なアプローチはどれですか？",
    options: [
      "TensorFlowでスクラッチからCNNを構築する",
      "Vertex AI AutoML Visionを使用する",
      "BigQuery MLを使用する",
      "Cloud Functionsにモデルをデプロイする",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI AutoML Visionは、コードなしで高品質な画像分類モデルをトレーニングできます。十分なラベル付きデータがあれば、専門知識なしでもプロダクションクオリティのモデルを構築できます。",
    tags: ["automl", "vertex-ai", "image-classification"],
  },
  // ═══════════════════════════════════════════════════════════
  // PCNE (Professional Cloud Network Engineer)
  // ═══════════════════════════════════════════════════════════
  {
    id: "pcne-001",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "medium",
    question: "異なるプロジェクト間でVPCネットワークを共有する仕組みはどれですか？",
    options: [
      "VPCピアリング",
      "共有VPC (Shared VPC)",
      "Cloud Interconnect",
      "Cloud VPN",
    ],
    correctIndex: 1,
    explanation:
      "共有VPCにより、ホストプロジェクトのVPCをサービスプロジェクトと共有できます。VPCピアリングは異なるVPC間の接続で、プロジェクト共有には共有VPCが適切です。",
    tags: ["shared-vpc", "vpc", "networking"],
  },
  {
    id: "pcne-002",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "hard",
    question: "オンプレミスとGCPを接続する際、10Gbps以上の帯域幅と最高の信頼性が必要な場合に最適なサービスはどれですか？",
    options: [
      "Cloud VPN (HA VPN)",
      "Partner Interconnect",
      "Dedicated Interconnect",
      "Direct Peering",
    ],
    correctIndex: 2,
    explanation:
      "Dedicated Interconnectは10Gbps/100Gbps単位の専用物理接続を提供し、SLA 99.99%（2つのInterconnect設定時）を保証します。高帯域幅・高信頼性の要件に最適です。",
    tags: ["dedicated-interconnect", "hybrid", "bandwidth"],
  },
  {
    id: "pcne-003",
    certId: "pcne",
    domain: "ネットワークサービスの管理",
    difficulty: "medium",
    question: "グローバルに展開されたWebアプリケーションで、世界中のユーザーに対して単一のIPアドレスでサービスを提供するロードバランサーはどれですか？",
    options: [
      "リージョンTCP/UDPロードバランサー",
      "内部ロードバランサー",
      "グローバルHTTP(S)ロードバランサー",
      "ネットワークロードバランサー",
    ],
    correctIndex: 2,
    explanation:
      "グローバルHTTP(S)ロードバランサーはAnycastを使用し、単一のグローバルIPでユーザーを最も近いバックエンドにルーティングします。エニーキャストIPと組み合わせてCloud CDNも利用できます。",
    tags: ["load-balancing", "global", "http"],
  },
  {
    id: "pcne-004",
    certId: "pcne",
    domain: "ネットワークセキュリティの実装",
    difficulty: "hard",
    question: "VPC Service Controlsの主な目的はどれですか？",
    options: [
      "VPC間の通信を暗号化する",
      "GCPサービスAPIへのアクセスをネットワーク境界で制限し、データ漏洩を防ぐ",
      "ファイアウォールルールを自動生成する",
      "DDoS攻撃からAPIを保護する",
    ],
    correctIndex: 1,
    explanation:
      "VPC Service Controlsはサービス境界を作成し、境界外からのGCPサービスへのアクセスをブロックします。許可されたVPCやIPからのみアクセスを許可し、データ漏洩リスクを低減します。",
    tags: ["vpc-service-controls", "security", "data-exfiltration"],
  },
  {
    id: "pcne-005",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "medium",
    question: "Cloud NATの主な用途はどれですか？",
    options: [
      "外部IPを持つVMのプライベートIP変換",
      "外部IPを持たないVMがインターネットに出るための送信NAT",
      "VPC間の通信の暗号化",
      "内部IPアドレスの変換",
    ],
    correctIndex: 1,
    explanation:
      "Cloud NATは外部IPアドレスを持たないVMインスタンスが、インターネットへの送信接続を確立するためのマネージドNATサービスです。受信接続は許可しません。",
    tags: ["cloud-nat", "networking", "egress"],
  },
  // ═══════════════════════════════════════════════════════════
  // PCSE (Professional Cloud Security Engineer)
  // ═══════════════════════════════════════════════════════════
  {
    id: "pcse-001",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "hard",
    question: "Google Cloud の組織ポリシーで 'constraints/compute.vmExternalIpAccess' を DENY に設定した場合の効果はどれですか？",
    options: [
      "すべてのVMのインターネット通信をブロックする",
      "組織内のすべてのプロジェクトでVMへの外部IPアドレスの割り当てを禁止する",
      "外部IPアドレスへのファイアウォールルールを削除する",
      "Cloud NATの使用を禁止する",
    ],
    correctIndex: 1,
    explanation:
      "組織ポリシーのconstraints/compute.vmExternalIpAccessをDENYに設定すると、組織全体でVMに外部IPを割り当てることを防げます。これによりすべてのVMをプライベートIPのみで運用できます。",
    tags: ["organization-policy", "security", "external-ip"],
  },
  {
    id: "pcse-002",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "hard",
    question: "顧客管理の暗号化キー(CMEK)を使用する主なメリットはどれですか？",
    options: [
      "暗号化コストが削減される",
      "顧客がキーのライフサイクルを制御でき、必要に応じてアクセスを即時無効化できる",
      "データの読み取り速度が向上する",
      "Googleが暗号化を管理するため運用負荷が減る",
    ],
    correctIndex: 1,
    explanation:
      "CMEKにより顧客はCloud KMSでキーを管理し、キーを無効化することでGoogleがデータにアクセスできない状態にできます。コンプライアンス要件がある組織に適しています。",
    tags: ["cmek", "kms", "encryption"],
  },
  {
    id: "pcse-003",
    certId: "pcse",
    domain: "アイデンティティとアクセス管理の設定",
    difficulty: "medium",
    question: "Workload Identity Federationを使用する主な目的はどれですか？",
    options: [
      "サービスアカウントキーを使わずに外部ワークロード(AWS/GitHub等)がGCPにアクセスできる",
      "ユーザーアカウントをGCPサービスアカウントに変換する",
      "マルチクラウド環境でのデータ同期を自動化する",
      "サービスアカウントの権限を自動的に最小化する",
    ],
    correctIndex: 0,
    explanation:
      "Workload Identity FederationはOIDCやSAMLベースのアイデンティティプロバイダー（GitHub Actions、AWS IAM等）を使い、サービスアカウントキーなしでGCPリソースにアクセスできます。キー漏洩リスクを排除できます。",
    tags: ["workload-identity", "federation", "keyless"],
  },
  {
    id: "pcse-004",
    certId: "pcse",
    domain: "ネットワークセキュリティ",
    difficulty: "medium",
    question: "Cloud ArmorでWebアプリをSQLインジェクション攻撃から保護するための設定はどれですか？",
    options: [
      "Googleが管理するWAFルール (preconfigured WAF rules) を有効にする",
      "ファイアウォールルールで全HTTPトラフィックをブロックする",
      "Cloud CDNのキャッシュ設定を変更する",
      "VPC Service Controlsのサービス境界を設定する",
    ],
    correctIndex: 0,
    explanation:
      "Cloud ArmorはGoogleが管理するWAFルールセット（ModSecurityに基づく）を提供し、SQLインジェクション、XSS、Log4Shellなどの一般的な脅威から保護できます。",
    tags: ["cloud-armor", "waf", "sql-injection"],
  },
  {
    id: "pcse-005",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "hard",
    question: "ゼロトラストセキュリティモデルの原則として正しいものはどれですか？",
    options: [
      "社内ネットワークにいれば信頼する",
      "すべてのアクセスリクエストを常に検証し、最小権限で付与する",
      "VPNを使用すれば完全に安全",
      "ファイアウォールで外部からのアクセスをすべてブロック",
    ],
    correctIndex: 1,
    explanation:
      "ゼロトラストは「決して信頼せず、常に検証する」原則に基づき、ネットワーク位置に関わらずすべてのアクセスを継続的に検証します。GCPではBeyondCorpエンタープライズがこれを実現します。",
    tags: ["zero-trust", "beyondcorp", "security"],
  },
  // ═══════════════════════════════════════════════════════════
  // PCD (Professional Cloud Developer)
  // ═══════════════════════════════════════════════════════════
  {
    id: "pcd-001",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "medium",
    question: "12-Factor Appの「設定」の原則として正しいものはどれですか？",
    options: [
      "設定はコードと一緒にバージョン管理する",
      "設定は環境変数やSecret Managerで管理し、コードから分離する",
      "設定ファイルはアプリのルートディレクトリに配置する",
      "設定はデータベースに保存する",
    ],
    correctIndex: 1,
    explanation:
      "12-Factor Appの設定（Factor III）では、設定（認証情報、エンドポイント等）はコードから分離し、環境変数として注入します。GCPではSecret ManagerとCloud Runの環境変数を組み合わせることが推奨されます。",
    tags: ["12-factor", "configuration", "secret-manager"],
  },
  {
    id: "pcd-002",
    certId: "pcd",
    domain: "アプリのデプロイとリリース管理",
    difficulty: "medium",
    question: "Cloud Runの新バージョンに徐々にトラフィックを移行し、問題があればすぐに戻せるデプロイ戦略はどれですか？",
    options: [
      "Blue-Greenデプロイ",
      "カナリアデプロイ（トラフィック分割）",
      "ローリングデプロイ",
      "ビッグバンデプロイ",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Runではリビジョン間のトラフィック分割により、新バージョンに少量のトラフィック（例5%）を流すカナリアデプロイが可能です。問題があれば即座に0%に戻せます。",
    tags: ["cloud-run", "canary", "traffic-splitting"],
  },
  {
    id: "pcd-003",
    certId: "pcd",
    domain: "Google Cloudサービスの統合",
    difficulty: "hard",
    question: "Cloud TasksとPub/Subの選択基準として正しいものはどれですか？",
    options: [
      "Pub/Subはタスクの順序保証と重複排除が必要、Cloud Tasksはファンアウト配信が必要",
      "Cloud Tasksはタスクの重複排除・スケジュール実行・再試行設定が必要、Pub/Subはファンアウト/多数のサブスクライバーが必要",
      "どちらも同じ用途",
      "Cloud Tasksはリアルタイム、Pub/Subはバッチ",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Tasksは個別タスクの管理（重複排除、スケジュール、レート制限、再試行）に優れています。Pub/Subは多数のサブスクライバーへのファンアウト配信とリアルタイムストリーミングに適しています。",
    tags: ["cloud-tasks", "pubsub", "async"],
  },
  {
    id: "pcd-004",
    certId: "pcd",
    domain: "アプリケーションのビルドとテスト",
    difficulty: "medium",
    question: "Cloud Buildで特定のブランチへのプッシュ時に自動的にビルドを実行するための設定はどれですか？",
    options: [
      "Cloud Schedulerでcronジョブを設定する",
      "Cloud Buildトリガーをリポジトリブランチパターンに設定する",
      "Cloud FunctionsでGitHub Webhookを受信する",
      "手動でgcloud buildsを実行する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Buildトリガーをソースリポジトリ（GitHub/Cloud Source Repositories）のブランチパターンと連携させることで、プッシュ・PRイベントを検知して自動ビルドを実行できます。",
    tags: ["cloud-build", "ci-cd", "trigger"],
  },
  {
    id: "pcd-005",
    certId: "pcd",
    domain: "スケーラブルで可用性の高いアプリ設計",
    difficulty: "hard",
    question: "Firestoreを使用したリアルタイムアプリで、特定のドキュメントの変更をリアルタイムに検知するための機能はどれですか？",
    options: [
      "Firestore Trigger（Cloud Functions）",
      "リアルタイムリスナー（onSnapshot）",
      "Cloud Schedulerによるポーリング",
      "Pub/Sub Pushサブスクリプション",
    ],
    correctIndex: 1,
    explanation:
      "FirestoreのonSnapshot（リアルタイムリスナー）を使用すると、ドキュメントやコレクションの変更をリアルタイムにクライアントに通知できます。WebSocketsのような永続接続を使用します。",
    tags: ["firestore", "realtime", "onsnapshot"],
  },
]

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  ...BASE_QUESTIONS,
  ...CDL_EXTRA_QUESTIONS,
  ...ACE_EXTRA_QUESTIONS,
  ...PCA_EXTRA_QUESTIONS,
  ...PDE_EXTRA_QUESTIONS,
  ...PMLE_EXTRA_QUESTIONS,
  ...PCNE_EXTRA_QUESTIONS,
  ...PCSE_EXTRA_QUESTIONS,
  ...PCD_EXTRA_QUESTIONS,
]

export function getQuestionsByCert(certId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.certId === certId)
}

export function getQuestionsByDomain(certId: string, domain: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.certId === certId && q.domain === domain)
}

export function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return [...questions].sort(() => Math.random() - 0.5)
}
