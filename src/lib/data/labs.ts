import type { CertificationId } from "@/lib/types/quiz"

export type LabStepType = "info" | "command" | "choice" | "task" | "troubleshoot" | "code_edit"

export interface CodeBlank {
  id: string
  placeholder: string
  correctValue: string
  hint?: string
}

export interface LabStep {
  id: number
  type: LabStepType
  title: string
  content: string
  command?: string
  output?: string
  choices?: string[]
  correctChoice?: number
  choiceExplanation?: string
  // troubleshoot fields
  scenario?: string
  errorLog?: string
  solution?: string
  explanation?: string
  // code_edit fields
  commandTemplate?: string
  blanks?: CodeBlank[]
}

export interface HandsOnLab {
  id: string
  certId: CertificationId
  service: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  estimatedMinutes: number
  objectives: string[]
  steps: LabStep[]
}

export const HANDS_ON_LABS: HandsOnLab[] = [
  // ─── CDL ──────────────────────────────────────────────────────────────
  {
    id: "cdl-tco",
    certId: "cdl",
    service: "Google Cloud Console",
    title: "クラウド移行のTCO分析",
    description: "オンプレミスからクラウドへの移行コストを分析し、クラウドの経済的メリットを理解します。",
    difficulty: "easy",
    estimatedMinutes: 20,
    objectives: [
      "TCO（総所有コスト）の構成要素を理解する",
      "クラウドの従量課金モデルとオンプレミスの比較",
      "Google Cloud Pricing Calculator の活用方法",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "TCOとは何か",
        content: "TCO（Total Cost of Ownership）は、システムを所有・運用するための総コストです。オンプレミスのTCOには以下が含まれます：\n\n• **CapEx（設備投資）**: サーバー・ストレージ・ネットワーク機器購入費\n• **OpEx（運用費）**: 電力・冷却・データセンター賃料・人件費\n• **隠れコスト**: ハードウェア更新・障害対応・セキュリティ対策\n\nクラウドはCapExをOpExに転換し、使った分だけ支払う従量課金モデルです。",
      },
      {
        id: 2,
        type: "choice",
        title: "コスト分類の確認",
        content: "あなたの会社はWebサーバーを購入しました。この購入コストはどのように分類されますか？",
        choices: [
          "OpEx（運用費）— 日常的な支出として計上",
          "CapEx（設備投資）— 資産として計上し減価償却",
          "どちらでもない — R&Dコストとして計上",
          "人件費として計上",
        ],
        correctChoice: 1,
        choiceExplanation: "正解はCapExです。サーバーなどの物理的な資産購入は設備投資（CapEx）として計上され、減価償却されます。クラウドの月額料金はOpExとして計上されます。",
      },
      {
        id: 3,
        type: "task",
        title: "オンプレミス vs クラウドのコスト試算",
        content: "**シナリオ**: Webアプリサーバー 10台を3年間運用\n\n**オンプレミス想定コスト:**\n```\nサーバー購入: $3,000 × 10台 = $30,000\nデータセンター賃料 (3年): $12,000\n電力・冷却費 (3年): $8,000\n運用人件費 (3年): $45,000\n─────────────────────────\n合計 TCO: $95,000\n```\n\n**Google Cloud (Compute Engine n2-standard-2) 想定:**\n```\nOn-demand: $0.097/時間 × 10台 × 26,280時間 = $25,491\n1年確約割引 (37% off): $16,059\n3年確約割引 (55% off): $11,471\n─────────────────────────\n3年確約利用: 約 $11,500\n```\n\nコスト削減効果を確認し、「次へ」を押してください。",
      },
      {
        id: 4,
        type: "command",
        title: "Google Cloud Pricing Calculator でVMコストを確認",
        content: "gcloud CLIでCompute Engineのマシンタイプ一覧と料金情報を取得します。",
        command: "gcloud compute machine-types list \\\n  --filter='zone:us-central1-a AND name:n2-standard*' \\\n  --format='table(name,guestCpus,memoryMb)'",
        output: `NAME              GUEST_CPUS  MEMORY_MB
n2-standard-2     2           8192
n2-standard-4     4           16384
n2-standard-8     8           32768
n2-standard-16    16          65536
n2-standard-32    32          131072`,
      },
      {
        id: 5,
        type: "choice",
        title: "確約利用割引（CUD）の理解",
        content: "Google Cloudの確約利用割引（Committed Use Discounts）について正しい説明はどれですか？",
        choices: [
          "使用量が多いほど自動的に割引が適用される",
          "1年または3年の使用量をコミットすることでon-demand比最大70%の割引を受けられる",
          "月次契約で使用量をコミットすることで割引を受けられる",
          "特定のリージョンでのみ利用可能な割引制度",
        ],
        correctChoice: 1,
        choiceExplanation: "CUD（確約利用割引）は、1年または3年の使用を事前にコミットすることで、on-demand料金比でメモリ最適化VMは最大70%、汎用VMは最大57%の割引を受けられます。",
      },
      {
        id: 6,
        type: "info",
        title: "ラボ完了: クラウド移行の経済効果",
        content: "このラボで学んだ重要ポイント：\n\n✅ **TCOの構成要素**: CapEx・OpEx・隠れコストを理解\n✅ **クラウドの経済モデル**: 従量課金により初期投資不要\n✅ **確約利用割引**: 最大70%のコスト削減が可能\n✅ **実際の試算**: オンプレミスと比較し大幅なコスト削減を確認\n\n次は試験問題でこの知識を確認しましょう！",
      },
    ],
  },
  {
    id: "cdl-services",
    certId: "cdl",
    service: "GCP Service Categories",
    title: "GCPサービスの分類と選択",
    description: "主要なGCPサービスをカテゴリ別に理解し、ユースケースに応じた適切なサービス選択を習得します。",
    difficulty: "easy",
    estimatedMinutes: 15,
    objectives: [
      "Compute・Storage・Database・AI/MLの各カテゴリを理解",
      "ユースケースに適したサービスを選択できる",
      "マネージドサービスと自己管理サービスの違いを理解",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "GCPサービスカテゴリの概要",
        content: "Google Cloudのサービスは大きく6カテゴリに分類されます：\n\n| カテゴリ | 主要サービス |\n|---|---|\n| **Compute** | Compute Engine, Cloud Run, GKE, App Engine |\n| **Storage** | Cloud Storage, Filestore, Persistent Disk |\n| **Database** | Cloud SQL, Spanner, Firestore, Bigtable |\n| **Analytics** | BigQuery, Dataflow, Pub/Sub, Looker |\n| **AI/ML** | Vertex AI, Gemini, Natural Language, Vision API |\n| **Networking** | Cloud Load Balancing, Cloud DNS, VPC, CDN |",
      },
      {
        id: 2,
        type: "choice",
        title: "シナリオ: グローバルECサイトのDB選択",
        content: "グローバルに展開するECサイトのトランザクションDBを選択します。要件：**グローバル整合性・高可用性・SQLサポート**。最適なサービスはどれですか？",
        choices: [
          "Cloud SQL — リレーショナルDB（MySQL/PostgreSQL）",
          "Firestore — NoSQLドキュメントDB",
          "Cloud Spanner — グローバル分散リレーショナルDB",
          "Bigtable — 大規模NoSQL列指向DB",
        ],
        correctChoice: 2,
        choiceExplanation: "Cloud Spannerは水平スケーリング可能なグローバル分散リレーショナルDBです。複数リージョンをまたぐ強整合性のトランザクション処理を提供し、グローバルECサイトに最適です。",
      },
      {
        id: 3,
        type: "choice",
        title: "シナリオ: ログデータのリアルタイム分析",
        content: "アプリのログを毎秒100万件受信し、リアルタイム集計とダッシュボード表示が必要です。最適なアーキテクチャはどれですか？",
        choices: [
          "Pub/Sub → Dataflow → BigQuery → Looker",
          "Cloud Storage → Cloud SQL → App Engine",
          "Compute Engine → MySQL → Grafana",
          "Firestore → Cloud Functions → Firebase Hosting",
        ],
        correctChoice: 0,
        choiceExplanation: "リアルタイムストリーミング分析の典型パターンです。Pub/Subでメッセージを受信し、Dataflowで変換処理、BigQueryに格納して、LookerでBI可視化します。",
      },
      {
        id: 4,
        type: "task",
        title: "サービスマッピング演習",
        content: "以下の要件を満たすGCPサービスを確認してください：\n\n| 要件 | 適切なサービス |\n|---|---|\n| コンテナをサーバーレスで実行 | **Cloud Run** |\n| 機械学習モデルのトレーニング | **Vertex AI Training** |\n| 静的ファイルの大量保存 | **Cloud Storage** |\n| マイクロサービス間のメッセージング | **Pub/Sub** |\n| Kubernetesクラスター管理 | **Google Kubernetes Engine** |\n| グローバルHTTPS負荷分散 | **Cloud Load Balancing** |\n\n各サービスの役割を確認したら「次へ」を押してください。",
      },
      {
        id: 5,
        type: "info",
        title: "ラボ完了: GCPサービス選択の基礎",
        content: "このラボで学んだ重要ポイント：\n\n✅ **6つのカテゴリ**: Compute・Storage・Database・Analytics・AI/ML・Networking\n✅ **シナリオ別選択**: 要件に応じた最適サービスの判断基準を習得\n✅ **典型アーキテクチャ**: Pub/Sub → Dataflow → BigQuery のストリーミングパターン\n\nCDL試験では「このユースケースに最適なサービスはどれか」が頻出です！",
      },
    ],
  },

  // ─── ACE ──────────────────────────────────────────────────────────────
  {
    id: "ace-gce-create",
    certId: "ace",
    service: "Compute Engine",
    title: "gcloud CLI: VMインスタンスの作成と管理",
    description: "gcloud CLIを使用してCompute EngineのVMを作成・設定・管理する手順を実践します。",
    difficulty: "medium",
    estimatedMinutes: 30,
    objectives: [
      "gcloud compute instances create コマンドの主要オプションを理解する",
      "スタートアップスクリプトによる初期設定を習得する",
      "インスタンスへのSSH接続と基本操作を実践する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "環境の準備",
        content: "このラボではgcloud CLIを使ってCompute Engine VMを作成します。\n\n**前提条件:**\n- Google Cloud SDKがインストール済み\n- `gcloud auth login` で認証済み\n- プロジェクトが設定済み\n\n**ラボで使用する設定:**\n```\nプロジェクト: my-project-id\nリージョン:   us-central1\nゾーン:       us-central1-a\nVMname:       lab-vm-01\n```",
      },
      {
        id: 2,
        type: "command",
        title: "プロジェクトとゾーンのデフォルト設定",
        content: "作業を効率化するため、デフォルトのプロジェクトとゾーンを設定します。",
        command: "gcloud config set project my-project-id\ngcloud config set compute/zone us-central1-a\ngcloud config set compute/region us-central1",
        output: `Updated property [core/project].
Updated property [compute/zone].
Updated property [compute/region].`,
      },
      {
        id: 3,
        type: "command",
        title: "VMインスタンスの作成",
        content: "スタートアップスクリプト付きでWebサーバーVMを作成します。",
        command: `gcloud compute instances create lab-vm-01 \\
  --machine-type=e2-medium \\
  --image-family=debian-11 \\
  --image-project=debian-cloud \\
  --boot-disk-size=20GB \\
  --tags=http-server \\
  --metadata=startup-script='#!/bin/bash
apt-get update
apt-get install -y apache2
echo "<h1>GCP Lab VM</h1>" > /var/www/html/index.html
systemctl start apache2'`,
        output: `NAME        ZONE           MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS
lab-vm-01   us-central1-a  e2-medium                  10.128.0.2   34.123.45.67   RUNNING`,
      },
      {
        id: 4,
        type: "command",
        title: "ファイアウォールルールの追加",
        content: "HTTP(80番)ポートへのアクセスを許可するファイアウォールルールを作成します。",
        command: `gcloud compute firewall-rules create allow-http \\
  --allow tcp:80 \\
  --target-tags http-server \\
  --description "Allow HTTP traffic"`,
        output: `Creating firewall rule...done.
NAME        NETWORK  DIRECTION  PRIORITY  ALLOW   DENY  DISABLED
allow-http  default  INGRESS    1000      tcp:80        False`,
      },
      {
        id: 5,
        type: "command",
        title: "SSHでインスタンスに接続",
        content: "gcloudコマンドでSSH接続し、Apacheのステータスを確認します。",
        command: `gcloud compute ssh lab-vm-01 --command="sudo systemctl status apache2"`,
        output: `● apache2.service - The Apache HTTP Server
     Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2024-01-15 10:23:45 UTC; 2min ago
    Process: 1234 ExecStart=/usr/sbin/apachectl start (code=exited, status=0/SUCCESS)
   Main PID: 1240 (apache2)
      Tasks: 55 (limit: 4582)
     Memory: 12.3M
        CPU: 85ms`,
      },
      {
        id: 6,
        type: "choice",
        title: "確認問題: プリエンプティブルVMの用途",
        content: "作成したVMを夜間のバッチ処理専用にコスト削減したいと考えています。最適な設定はどれですか？",
        choices: [
          "f1-micro インスタンスに変更してコストを削減する",
          "--preemptible フラグを追加してプリエンプティブルVMとして作成する",
          "インスタンスを停止して必要な時だけ起動する",
          "Committed Use Discountを購入する",
        ],
        correctChoice: 1,
        choiceExplanation: "プリエンプティブルVM（Spot VM）はon-demand比最大91%安く、バッチ処理・分散計算・フォールトトレラントなワークロードに最適です。ただし24時間以内に停止される可能性があります。",
      },
      {
        id: 7,
        type: "command",
        title: "インスタンスの削除（クリーンアップ）",
        content: "ラボ終了後はリソースを削除して課金を止めます。",
        command: `gcloud compute instances delete lab-vm-01 --quiet
gcloud compute firewall-rules delete allow-http --quiet`,
        output: `Deleted [https://www.googleapis.com/compute/v1/projects/my-project-id/zones/us-central1-a/instances/lab-vm-01].
Deleted [https://www.googleapis.com/compute/v1/projects/my-project-id/global/firewalls/allow-http].`,
      },
    ],
  },
  {
    id: "ace-iam",
    certId: "ace",
    service: "IAM",
    title: "IAMロールと最小権限の設定",
    description: "Cloud IAMを使って最小権限の原則に基づいたアクセス制御を設定します。",
    difficulty: "medium",
    estimatedMinutes: 25,
    objectives: [
      "基本ロール・事前定義ロール・カスタムロールの違いを理解する",
      "サービスアカウントの作成と権限付与を実践する",
      "IAMポリシーのバインディングを操作する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "IAMの基本概念",
        content: "Cloud IAMは「誰が（Who）」「何を（What）」「どのリソースに対して（Which）」できるかを管理します。\n\n**ロールの種類:**\n- **基本ロール**: Owner / Editor / Viewer（広範な権限、本番では非推奨）\n- **事前定義ロール**: サービスごとに細かく定義（例: `roles/compute.instanceAdmin`）\n- **カスタムロール**: 必要な権限のみを組み合わせた独自ロール\n\n**原則: 最小権限（Least Privilege）** — 業務に必要な最小限の権限のみを付与すること",
      },
      {
        id: 2,
        type: "command",
        title: "サービスアカウントの作成",
        content: "Cloud StorageへのRead権限のみを持つサービスアカウントを作成します。",
        command: `gcloud iam service-accounts create storage-reader-sa \\
  --display-name="Storage Reader Service Account" \\
  --description="Read-only access to Cloud Storage"`,
        output: `Created service account [storage-reader-sa].`,
      },
      {
        id: 3,
        type: "command",
        title: "ロールのバインディング",
        content: "作成したSAに `roles/storage.objectViewer` ロールを付与します。",
        command: `gcloud projects add-iam-policy-binding my-project-id \\
  --member="serviceAccount:storage-reader-sa@my-project-id.iam.gserviceaccount.com" \\
  --role="roles/storage.objectViewer"`,
        output: `Updated IAM policy for project [my-project-id].
bindings:
- members:
  - serviceAccount:storage-reader-sa@my-project-id.iam.gserviceaccount.com
  role: roles/storage.objectViewer
etag: BwX...
version: 1`,
      },
      {
        id: 4,
        type: "command",
        title: "現在のIAMポリシーの確認",
        content: "プロジェクトのIAMポリシーを確認し、バインディングが正しいか検証します。",
        command: `gcloud projects get-iam-policy my-project-id \\
  --flatten="bindings[].members" \\
  --filter="bindings.members:storage-reader-sa"`,
        output: `bindings:
  members: serviceAccount:storage-reader-sa@my-project-id.iam.gserviceaccount.com
  role: roles/storage.objectViewer
etag: BwX...
version: 1`,
      },
      {
        id: 5,
        type: "choice",
        title: "確認問題: ロール選択",
        content: "開発者がCloud SQL インスタンスの作成と削除はできるが、データの読み書きはできないようにしたいです。最適なロールはどれですか？",
        choices: [
          "roles/cloudsql.admin — Cloud SQLの全操作が可能",
          "roles/cloudsql.editor — インスタンス管理とデータ操作が可能",
          "roles/cloudsql.instanceUser — インスタンスへの接続のみ",
          "roles/cloudsql.admin を付与し、データアクセスをCloud SQLの権限で制限する",
        ],
        correctChoice: 0,
        choiceExplanation: "この要件を正確に満たす事前定義ロールはありません。実際の現場では `roles/cloudsql.admin` を付与しつつ、データベース側のユーザー権限で制限するか、カスタムロールを作成します。ACE試験ではカスタムロールの作成が正解になるケースもあります。",
      },
      {
        id: 6,
        type: "command",
        title: "サービスアカウントキーの作成（注意あり）",
        content: "VMにSAの権限を付与する方法は2つあります：\n1. **VM起動時にSAを指定**（推奨）\n2. **JSONキーを発行してVM内に配置**（セキュリティリスクあり）\n\nベストプラクティスは「キーなし認証」—VMの `--service-account` フラグを使う方法です。",
        command: `# 推奨: VMにSAを直接アタッチ（キー不要）
gcloud compute instances create app-vm \\
  --service-account=storage-reader-sa@my-project-id.iam.gserviceaccount.com \\
  --scopes=https://www.googleapis.com/auth/cloud-platform`,
        output: `NAME    ZONE           MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS
app-vm  us-central1-a  n1-standard-1              10.128.0.3   34.100.0.1     RUNNING`,
      },
    ],
  },
  {
    id: "ace-cloudrun",
    certId: "ace",
    service: "Cloud Run",
    title: "Cloud Run コンテナデプロイ",
    description: "DockerイメージをArtifact Registryに格納し、Cloud Runにデプロイしてサービスを公開します。",
    difficulty: "medium",
    estimatedMinutes: 25,
    objectives: [
      "Artifact Registryへのイメージのプッシュを習得する",
      "Cloud RunサービスのデプロイとURL発行を実践する",
      "トラフィック分割による段階的ロールアウトを理解する",
    ],
    steps: [
      {
        id: 1,
        type: "command",
        title: "Artifact Registryリポジトリの作成",
        content: "コンテナイメージを格納するArtifact Registryのリポジトリを作成します。",
        command: `gcloud artifacts repositories create my-repo \\
  --repository-format=docker \\
  --location=us-central1 \\
  --description="Docker repository for Cloud Run"`,
        output: `Create request issued for: [my-repo]
Waiting for operation to complete...done.
Created repository [my-repo].`,
      },
      {
        id: 2,
        type: "command",
        title: "イメージのビルドとプッシュ",
        content: "Cloud BuildでDockerイメージをビルドし、Artifact Registryにプッシュします。",
        command: `# Dockerfileが存在するディレクトリで実行
gcloud builds submit \\
  --tag us-central1-docker.pkg.dev/my-project-id/my-repo/hello-app:v1`,
        output: `Creating temporary archive of 4 file(s) totalling 1.8 KiB before compression.
Uploading tarball of [.] to [gs://my-project-id_cloudbuild/...]
Created [https://cloudbuild.googleapis.com/v1/projects/my-project-id/builds/abc123].
Waiting for build to complete. Polling interval: 1 second(s).
BUILD
Step #0 - "build": Successfully built abc123
PUSH
Pushing us-central1-docker.pkg.dev/my-project-id/my-repo/hello-app:v1
DONE`,
      },
      {
        id: 3,
        type: "command",
        title: "Cloud Runへのデプロイ",
        content: "ビルドしたイメージをCloud Runにデプロイします。",
        command: `gcloud run deploy hello-service \\
  --image us-central1-docker.pkg.dev/my-project-id/my-repo/hello-app:v1 \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --memory 512Mi \\
  --cpu 1 \\
  --max-instances 10`,
        output: `Deploying container to Cloud Run service [hello-service] in project [my-project-id] region [us-central1]
OK Deploying new service... Done.
  OK Creating Revision...
  OK Routing traffic...
  OK Setting IAM Policy...
Done.
Service [hello-service] revision [hello-service-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://hello-service-xyz-uc.a.run.app`,
      },
      {
        id: 4,
        type: "command",
        title: "新バージョンのデプロイとトラフィック分割",
        content: "v2をデプロイし、20%のトラフィックをv2に流して段階的ロールアウトを実施します。",
        command: `# v2をデプロイ（トラフィックは流さない）
gcloud run deploy hello-service \\
  --image us-central1-docker.pkg.dev/my-project-id/my-repo/hello-app:v2 \\
  --no-traffic

# 20% を v2 に振り分け
gcloud run services update-traffic hello-service \\
  --to-revisions hello-service-00001-abc=80,hello-service-00002-xyz=20`,
        output: `OK Deploying... Done.
  OK Creating Revision...
  OK Routing traffic...
Traffic:
  80% hello-service-00001-abc (currently serving)
  20% hello-service-00002-xyz`,
      },
      {
        id: 5,
        type: "choice",
        title: "確認問題: Cloud Runのスケーリング",
        content: "Cloud Runサービスがリクエストを受けていない時間が長く続きました。この場合、どうなりますか？",
        choices: [
          "インスタンスはアイドル状態のまま維持され、課金が続く",
          "インスタンスは0台にスケールインし（スケールトゥゼロ）、課金が止まる",
          "インスタンスは最小1台を維持し、課金は継続する",
          "インスタンスはウォームアップ状態になり、半額で課金される",
        ],
        correctChoice: 1,
        choiceExplanation: "Cloud Runはデフォルトで「Scale to Zero」に対応しており、リクエストがない場合はインスタンスが0台になり課金されません。ただし次のリクエスト時に「コールドスタート」が発生します。--min-instances=1 を設定するとコールドスタートを防げますが課金が継続します。",
      },
    ],
  },

  // ─── PCA ──────────────────────────────────────────────────────────────
  {
    id: "pca-3tier",
    certId: "pca",
    service: "Architecture Design",
    title: "3層Webアプリアーキテクチャ設計",
    description: "高可用性・スケーラブルな3層Webアプリケーションアーキテクチャを設計します。",
    difficulty: "hard",
    estimatedMinutes: 35,
    objectives: [
      "Load Balancer・Webサーバー・DBの各層の設計原則を理解する",
      "可用性99.99%を達成するためのマルチリージョン設計を習得する",
      "Cloud Armorを用いたDDoS対策を理解する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "3層アーキテクチャの概要",
        content: "高可用性3層Webアプリの構成：\n\n```\n[インターネット]\n       ↓\n[Cloud CDN + Cloud Armor]  ← DDoS防御・WAF\n       ↓\n[Global Load Balancer]     ← HTTPS終端・健全性チェック\n       ↓\n[Cloud Run / GKE]          ← Webサーバー層（オートスケール）\n       ↓\n[Cloud SQL (HA)]           ← DBプライマリ（us-central1）\n       ↓ (レプリカ同期)\n[Cloud SQL Read Replica]   ← 読み取り負荷分散\n```\n\n**設計原則:**\n- 単一障害点（SPOF）を排除\n- マルチゾーン/リージョン展開\n- 自動フェイルオーバー",
      },
      {
        id: 2,
        type: "choice",
        title: "負荷分散の選択: Global vs Regional",
        content: "ユーザーが日本・米国・欧州に分散しているグローバルWebサービスのLBを選択します。最適な構成はどれですか？",
        choices: [
          "各リージョンにRegional Load Balancerを配置し、DNS でラウンドロビン",
          "Global HTTP(S) Load Balancerを1つ配置し、バックエンドをマルチリージョンに展開",
          "Cloud CDNのみで対応し、LBは不要",
          "us-central1にInternal TCP Load Balancerを配置",
        ],
        correctChoice: 1,
        choiceExplanation: "Global HTTP(S) LBはAnycasting技術でユーザーを最寄りのGoogleエッジに接続し、バックエンドへのルーティングを最適化します。単一のIPで全世界をカバーでき、Cloud Armorとの統合も容易です。",
      },
      {
        id: 3,
        type: "command",
        title: "Cloud SQLのHAインスタンス作成",
        content: "フェイルオーバーレプリカ付きのCloud SQL PostgreSQLインスタンスを作成します。",
        command: `gcloud sql instances create prod-db \\
  --database-version=POSTGRES_14 \\
  --tier=db-n1-standard-4 \\
  --region=us-central1 \\
  --availability-type=REGIONAL \\
  --backup-start-time=03:00 \\
  --enable-bin-log`,
        output: `Creating Cloud SQL instance...done.
NAME     DATABASE_VERSION  LOCATION       TIER              PRIMARY_ADDRESS  PRIVATE_ADDRESS  STATUS
prod-db  POSTGRES_14       us-central1    db-n1-standard-4  34.100.0.5       10.0.0.3         RUNNABLE

HA configuration: Standby replica in us-central1-b (primary: us-central1-a)`,
      },
      {
        id: 4,
        type: "command",
        title: "Cloud Armor セキュリティポリシーの設定",
        content: "DDoS防御とIPレート制限のセキュリティポリシーを作成します。",
        command: `# セキュリティポリシー作成
gcloud compute security-policies create my-security-policy \\
  --description "WAF and DDoS protection"

# レート制限ルール追加（1IPから60秒に100リクエスト以上でブロック）
gcloud compute security-policies rules create 1000 \\
  --security-policy my-security-policy \\
  --expression "true" \\
  --action throttle \\
  --rate-limit-threshold-count 100 \\
  --rate-limit-threshold-interval-sec 60 \\
  --conform-action allow \\
  --exceed-action deny-429`,
        output: `Created security policy [my-security-policy].
Created security policy rule [1000] in security policy [my-security-policy].`,
      },
      {
        id: 5,
        type: "choice",
        title: "DBレプリカの戦略",
        content: "レポート生成のためのAd-hocクエリがメインDBに負荷をかけています。最適な解決策はどれですか？",
        choices: [
          "Cloud SQL インスタンスのCPUをアップグレードする",
          "Cloud SQL Read Replicaを作成し、レポートクエリをレプリカに向ける",
          "BigQueryにデータをエクスポートしてそちらでクエリを実行する",
          "B と C の両方が適切で、用途に応じて使い分ける",
        ],
        correctChoice: 3,
        choiceExplanation: "正解はDです。リアルタイムに近いレポートにはRead Replica（遅延数秒）、大規模なアドホック分析にはBigQueryが適しています。PCA試験ではこのような「複数の適切な解答を組み合わせる」パターンが多く出ます。",
      },
      {
        id: 6,
        type: "task",
        title: "アーキテクチャのコスト最適化検討",
        content: "設計したアーキテクチャのコスト最適化ポイントを確認します：\n\n| 最適化 | 手法 |\n|---|---|\n| **Compute** | Cloud Run の Scale-to-Zero 活用 |\n| **DB** | 開発環境は db-f1-micro 使用 |\n| **Storage** | Cloud Storage Lifecycle Policy でコールドデータをArchive |\n| **LB** | Cloud CDNで静的コンテンツをキャッシュしバックエンド負荷を削減 |\n| **確約割引** | 本番DBとコアVMにCUD適用（最大57%削減） |\n\nコスト最適化策を確認したら「次へ」を押してください。",
      },
    ],
  },

  // ─── PDE ──────────────────────────────────────────────────────────────
  {
    id: "pde-bigquery-optimize",
    certId: "pde",
    service: "BigQuery",
    title: "BigQuery クエリ最適化とコスト管理",
    description: "パーティショニング・クラスタリング・クエリプランを使用してBigQueryのパフォーマンスとコストを最適化します。",
    difficulty: "hard",
    estimatedMinutes: 35,
    objectives: [
      "テーブルパーティショニングとクラスタリングを実装する",
      "EXPLAIN / クエリプランでボトルネックを特定する",
      "クエリコストを最小化するためのベストプラクティスを習得する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "BigQueryのコスト構造",
        content: "BigQueryの料金は主に2種類：\n\n| コンポーネント | 内容 | 料金（東京リージョン）|\n|---|---|---|\n| **クエリ（スキャン）** | スキャンしたバイト数 | $6.00 / TB |\n| **ストレージ** | 保存データ量 | $0.020 / GB/月（アクティブ） |\n\n**コスト削減の3原則:**\n1. **パーティショニング** — 日付でデータを分割し、必要な期間だけスキャン\n2. **クラスタリング** — よく使うフィルタカラムで物理的に整列\n3. **カラム選択** — `SELECT *` は禁止、必要なカラムだけ指定",
      },
      {
        id: 2,
        type: "command",
        title: "パーティション・クラスタリング付きテーブルの作成",
        content: "日付パーティション + ユーザーIDクラスタリングのテーブルを作成します。",
        command: `bq query --use_legacy_sql=false '
CREATE TABLE \`my_project.analytics.events_partitioned\`
PARTITION BY DATE(event_time)
CLUSTER BY user_id, event_type
OPTIONS(
  partition_expiration_days = 365,
  require_partition_filter = TRUE
)
AS SELECT * FROM \`my_project.analytics.events_raw\`'`,
        output: `Waiting on bqjob_r123...
Current status: DONE
Created table events_partitioned.
Partitioned by: event_time (DATE)
Clustered by: user_id, event_type
Partition expiry: 365 days
Rows: 1,234,567,890
Size: 245.3 GB`,
      },
      {
        id: 3,
        type: "command",
        title: "クエリプランの確認",
        content: "INFORMATION_SCHEMA を使ってクエリの実行プランとスキャンバイト数を確認します。",
        command: `bq query --use_legacy_sql=false --dry_run '
SELECT
  user_id,
  COUNT(*) as event_count,
  SUM(revenue) as total_revenue
FROM \`my_project.analytics.events_partitioned\`
WHERE DATE(event_time) BETWEEN "2024-01-01" AND "2024-01-31"
  AND user_id IN ("user123", "user456")
GROUP BY user_id'`,
        output: `Query successfully validated. Assuming the tables are not modified,
running this query will process 2.1 GB.
Estimated cost: $0.013 (2.1 GB × $6.00/TB)

[Before optimization: would have processed 245.3 GB → $1.47]`,
      },
      {
        id: 4,
        type: "choice",
        title: "確認問題: クエリ最適化",
        content: "以下のクエリはコストが高い問題があります。原因はどれですか？\n```sql\nSELECT * FROM `events`\nWHERE user_id = 'abc123'\n```",
        choices: [
          "WHERE句があるためクエリが遅い",
          "SELECT * で全カラムをスキャンしており、かつパーティションフィルタが使われていない",
          "user_idのフィルタは効率的でクエリに問題はない",
          "BigQueryはSELECT *でも内部的に最適化するため問題なし",
        ],
        correctChoice: 1,
        choiceExplanation: "2つの問題があります：(1) SELECT *は不要なカラムも全てスキャンするためコストが増加します。(2) パーティションフィルタ（event_timeの絞り込み）がないため全パーティションがスキャンされます。require_partition_filter=TRUEを設定するとこのクエリはエラーになります。",
      },
      {
        id: 5,
        type: "command",
        title: "Materialized View によるクエリ高速化",
        content: "頻繁に使われる集計クエリをMaterialized Viewとしてキャッシュします。",
        command: `bq query --use_legacy_sql=false '
CREATE MATERIALIZED VIEW \`my_project.analytics.daily_revenue_mv\`
PARTITION BY report_date
AS
SELECT
  DATE(event_time) as report_date,
  user_id,
  SUM(revenue) as total_revenue,
  COUNT(*) as event_count
FROM \`my_project.analytics.events_partitioned\`
GROUP BY 1, 2'`,
        output: `Created materialized view [daily_revenue_mv].
This view will be automatically refreshed every 30 minutes.
Smart tuning: Queries on the base table may automatically use this materialized view.`,
      },
      {
        id: 6,
        type: "task",
        title: "コスト管理: カスタムクォータの設定",
        content: "チームのBigQueryコストを制御するためのクォータ設定を確認します：\n\n**1. プロジェクトレベルのカスタムクォータ（コンソール設定）:**\n```\nAPI quotas > BigQuery API > Query usage per day:\n設定値: 1 TB/日（チーム全体の上限）\n```\n\n**2. ユーザーレベルのクォータ:**\n```\n個人ユーザー: 100 GB/日\n```\n\n**3. データセットのアクセス制御:**\n```sql\nGRANT `roles/bigquery.dataViewer`\nON SCHEMA my_project.analytics\nTO \"group:data-analysts@company.com\"\n```\n\n設定を確認したら「次へ」を押してください。",
      },
    ],
  },
  {
    id: "pde-pubsub-dataflow",
    certId: "pde",
    service: "Pub/Sub + Dataflow",
    title: "Pub/Sub → Dataflow ストリーミングパイプライン",
    description: "リアルタイムデータをPub/Subで受信し、Dataflowで変換してBigQueryに格納するパイプラインを構築します。",
    difficulty: "hard",
    estimatedMinutes: 40,
    objectives: [
      "Pub/SubトピックとサブスクリプションのデッドレタートピックをCLIで設定する",
      "Dataflow テンプレートを使ってストリーミングパイプラインをデプロイする",
      "パイプラインの監視とエラーハンドリングを理解する",
    ],
    steps: [
      {
        id: 1,
        type: "command",
        title: "Pub/Sub トピックとDLQの作成",
        content: "メッセージ処理に失敗したメッセージを格納するデッドレタートピック（DLQ）を設定します。",
        command: `# メインのトピック作成
gcloud pubsub topics create sensor-data

# デッドレタートピック作成
gcloud pubsub topics create sensor-data-dlq

# サブスクリプション作成（DLQ設定付き）
gcloud pubsub subscriptions create sensor-data-sub \\
  --topic=sensor-data \\
  --dead-letter-topic=sensor-data-dlq \\
  --max-delivery-attempts=5 \\
  --ack-deadline=60`,
        output: `Created topic [projects/my-project-id/topics/sensor-data].
Created topic [projects/my-project-id/topics/sensor-data-dlq].
Created subscription [projects/my-project-id/subscriptions/sensor-data-sub].
  Dead letter topic: projects/my-project-id/topics/sensor-data-dlq
  Max delivery attempts: 5`,
      },
      {
        id: 2,
        type: "command",
        title: "BigQueryデータセットとテーブルの準備",
        content: "Dataflowが書き込む先のBigQueryテーブルを作成します。",
        command: `bq mk --dataset \\
  --description "IoT Sensor Data" \\
  --location US \\
  my_project:iot_data

bq mk --table \\
  my_project:iot_data.sensor_readings \\
  device_id:STRING,timestamp:TIMESTAMP,temperature:FLOAT,humidity:FLOAT,status:STRING`,
        output: `Dataset 'my_project:iot_data' successfully created.
Table 'my_project:iot_data.sensor_readings' successfully created.`,
      },
      {
        id: 3,
        type: "command",
        title: "Dataflow ストリーミングパイプラインの起動",
        content: "事前定義テンプレート「Pub/Sub to BigQuery」を使ってパイプラインを起動します。",
        command: `gcloud dataflow jobs run sensor-pipeline \\
  --gcs-location=gs://dataflow-templates-us-central1/latest/PubSub_to_BigQuery \\
  --region=us-central1 \\
  --parameters \\
inputTopic=projects/my-project-id/topics/sensor-data,\\
outputTableSpec=my-project-id:iot_data.sensor_readings,\\
outputDeadletterTable=my-project-id:iot_data.sensor_readings_errors`,
        output: `id: 2024-01-15_10_23_45-1234567890
projectId: my-project-id
type: JOB_TYPE_STREAMING
currentState: JOB_STATE_RUNNING
currentStateTime: 2024-01-15T19:23:45Z
name: sensor-pipeline
location: us-central1`,
      },
      {
        id: 4,
        type: "choice",
        title: "確認問題: Exactly-once vs At-least-once",
        content: "金融トランザクションを処理するDataflowパイプラインに必要なメッセージ配信保証はどれですか？",
        choices: [
          "At-most-once — 重複なし、ただし損失あり（最高速）",
          "At-least-once — 損失なし、ただし重複の可能性あり",
          "Exactly-once — 損失なし、重複なし（最高信頼性）",
          "Best-effort — Pub/Subのデフォルト設定で十分",
        ],
        correctChoice: 2,
        choiceExplanation: "金融トランザクションはExactly-onceが必須です。DataflowはApache Beamを使用し、Streaming Modeでは正確に1回の処理を保証します。Pub/SubはデフォルトでAt-least-onceですが、メッセージIDによる重複排除でExactly-onceを実現できます。",
      },
      {
        id: 5,
        type: "command",
        title: "パイプラインのモニタリング",
        content: "Dataflowジョブのメトリクスを確認し、スループットと遅延を監視します。",
        command: `gcloud dataflow jobs describe 2024-01-15_10_23_45-1234567890 \\
  --region=us-central1 \\
  --format="json(currentState,metrics)"`,
        output: `{
  "currentState": "JOB_STATE_RUNNING",
  "metrics": [
    {"name": "dataflow/element_count", "scalar": 1234567},
    {"name": "dataflow/elapsed_time", "scalar": 3600},
    {"name": "pubsub/subscription/num_undelivered_messages", "scalar": 42},
    {"name": "bigquery/write_latency_ms_p99", "scalar": 245}
  ]
}`,
      },
    ],
  },

  // ─── PMLE ─────────────────────────────────────────────────────────────
  {
    id: "pmle-vertex-training",
    certId: "pmle",
    service: "Vertex AI",
    title: "Vertex AI カスタムトレーニングジョブ",
    description: "Vertex AIでカスタムPythonトレーニングスクリプトを使用してMLモデルをトレーニングし、Model Registryに登録します。",
    difficulty: "hard",
    estimatedMinutes: 40,
    objectives: [
      "Vertex AI Training のCustomJobを設定・実行する",
      "Hyperparameter TuningJobを使ってハイパーパラメータを最適化する",
      "Vertex ML MetadataでExperimentを追跡する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "Vertex AI トレーニングの仕組み",
        content: "Vertex AI Custom Trainingの流れ：\n\n```\n[トレーニングコード]\n       ↓ (Docker化)\n[Artifact Registry]\n       ↓\n[Vertex AI Training Job]\n  ├── Worker Pool 0: マスターノード (GPU: A100)\n  └── Worker Pool 1: ワーカーノード ×3\n       ↓\n[Cloud Storage: チェックポイント・ログ]\n       ↓\n[Vertex AI Model Registry]\n       ↓\n[Vertex AI Endpoint (予測サービング)]\n```\n\n**必要なリソース:**\n- Dockerイメージ（トレーニングコード含む）\n- Cloud Storageバケット（チェックポイント保存）\n- サービスアカウント（Storageアクセス権限）",
      },
      {
        id: 2,
        type: "command",
        title: "Custom Training Job の作成",
        content: "Pythonパッケージを使ったカスタムトレーニングジョブを作成します。",
        command: `gcloud ai custom-jobs create \\
  --region=us-central1 \\
  --display-name=bert-classifier-training \\
  --worker-pool-spec=\\
machine-type=n1-standard-8,\\
accelerator-type=NVIDIA_TESLA_T4,\\
accelerator-count=1,\\
replica-count=1,\\
container-image-uri=us-central1-docker.pkg.dev/my-project/ml-repo/trainer:v1 \\
  --args="--epochs=50,--batch-size=32,--learning-rate=2e-5,--output-dir=gs://my-ml-bucket/models/bert-v1"`,
        output: `Using endpoint [https://us-central1-aiplatform.googleapis.com/]
CustomJob [projects/my-project/locations/us-central1/customJobs/1234567890] is submitted successfully.

To block until complete, run:
$ gcloud ai custom-jobs stream-logs 1234567890 --region=us-central1`,
      },
      {
        id: 3,
        type: "command",
        title: "Hyperparameter Tuning Job の実行",
        content: "学習率とバッチサイズを自動チューニングするHPTジョブを設定します。",
        command: `gcloud ai hp-tuning-jobs create \\
  --region=us-central1 \\
  --display-name=bert-hpt \\
  --max-trial-count=20 \\
  --parallel-trial-count=4 \\
  --config=hpt_config.yaml`,
        output: `# hpt_config.yaml の内容:
# studySpec:
#   metrics: [{metricId: val_accuracy, goal: MAXIMIZE}]
#   parameters:
#     - parameterId: learning_rate
#       doubleValueSpec: {minValue: 1e-5, maxValue: 5e-4}
#     - parameterId: batch_size
#       discreteValueSpec: {values: [16, 32, 64]}

HyperparameterTuningJob created: projects/.../hyperparameterTuningJobs/9876543210
Best trial so far: learning_rate=2.3e-5, batch_size=32, val_accuracy=0.9234`,
      },
      {
        id: 4,
        type: "command",
        title: "モデルのModel Registryへの登録",
        content: "トレーニング済みモデルをVertex AI Model Registryに登録します。",
        command: `gcloud ai models upload \\
  --region=us-central1 \\
  --display-name=bert-classifier-v1 \\
  --artifact-uri=gs://my-ml-bucket/models/bert-v1/saved_model \\
  --container-image-uri=us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-11:latest \\
  --container-predict-route=/predict \\
  --container-health-route=/health`,
        output: `Using endpoint [https://us-central1-aiplatform.googleapis.com/]
Model [projects/.../models/5678901234] is uploaded successfully.

Model details:
  displayName: bert-classifier-v1
  artifactUri: gs://my-ml-bucket/models/bert-v1/saved_model
  containerSpec: us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-11:latest`,
      },
      {
        id: 5,
        type: "choice",
        title: "確認問題: モデル評価指標",
        content: "クレジットカード不正検知モデルを評価します。正例（不正）が全体の0.1%の不均衡データです。最適な評価指標はどれですか？",
        choices: [
          "Accuracy — 全体的な正解率",
          "Precision と Recall のトレードオフ（PR曲線 / AUC-PR）",
          "RMSE — 二乗平均平方根誤差",
          "R² スコア — 決定係数",
        ],
        correctChoice: 1,
        choiceExplanation: "不均衡データでは Accuracy は意味がありません（全て正常と予測しても99.9%の精度になる）。不正検知ではPrecision（誤検知を減らす）とRecall（見逃しを減らす）のバランスが重要です。AUC-PR（PR曲線下面積）が不均衡分類の標準的評価指標です。",
      },
    ],
  },

  // ─── PCNE ─────────────────────────────────────────────────────────────
  {
    id: "pcne-vpc-design",
    certId: "pcne",
    service: "VPC Networking",
    title: "VPCネットワーク設計とサブネット分割",
    description: "本番環境に適したVPCネットワークを設計し、セキュリティ要件を満たすサブネット構成を実装します。",
    difficulty: "hard",
    estimatedMinutes: 35,
    objectives: [
      "Shared VPC とStandalone VPCの使い分けを理解する",
      "セキュリティ要件に基づくサブネット設計を実践する",
      "VPC Peering と Private Service Connect の違いを理解する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "VPC設計の原則",
        content: "エンタープライズGCP環境の典型的VPC構成：\n\n```\n[Host Project] ─── Shared VPC ───>\n  ├── [Service Project A: Production]\n  │     ├── subnet-prod-web (10.0.1.0/24)\n  │     ├── subnet-prod-app (10.0.2.0/24)\n  │     └── subnet-prod-db  (10.0.3.0/24)\n  ├── [Service Project B: Staging]\n  │     └── subnet-staging  (10.0.10.0/23)\n  └── [Service Project C: Development]\n        └── subnet-dev      (10.0.20.0/22)\n```\n\n**Shared VPCのメリット:**\n- ネットワークを一元管理\n- プロジェクト間でサブネットを共有\n- セキュリティポリシーを集中管理\n- Cloud NATを共有してコスト削減",
      },
      {
        id: 2,
        type: "command",
        title: "VPCとサブネットの作成",
        content: "カスタムモードVPCとセキュリティ設計に基づくサブネットを作成します。",
        command: `# カスタムモードVPC作成（自動サブネット作成をオフ）
gcloud compute networks create prod-vpc \\
  --subnet-mode=custom \\
  --bgp-routing-mode=regional

# Webサーバー用パブリックサブネット
gcloud compute networks subnets create subnet-web \\
  --network=prod-vpc \\
  --region=us-central1 \\
  --range=10.0.1.0/24 \\
  --enable-private-ip-google-access

# DBサーバー用プライベートサブネット（外部IPなし）
gcloud compute networks subnets create subnet-db \\
  --network=prod-vpc \\
  --region=us-central1 \\
  --range=10.0.3.0/24 \\
  --enable-private-ip-google-access`,
        output: `Created network [prod-vpc].
Created subnetwork [subnet-web] (10.0.1.0/24, us-central1).
Created subnetwork [subnet-db] (10.0.3.0/24, us-central1).`,
      },
      {
        id: 3,
        type: "command",
        title: "Cloud NAT の設定",
        content: "プライベートサブネットのVMが外部APIにアクセスするためのCloud NATを設定します。",
        command: `# Cloud Routerの作成
gcloud compute routers create prod-router \\
  --network=prod-vpc \\
  --region=us-central1

# Cloud NATの設定
gcloud compute routers nats create prod-nat \\
  --router=prod-router \\
  --region=us-central1 \\
  --auto-allocate-nat-external-ips \\
  --nat-all-subnet-ip-ranges`,
        output: `Created router [prod-router].
Created NAT [prod-nat] in router [prod-router].
NAT configuration:
  Subnets: ALL_SUBNETWORKS_ALL_IP_RANGES
  External IPs: AUTO_ALLOCATE
  Min ports per VM: 64`,
      },
      {
        id: 4,
        type: "choice",
        title: "確認問題: VPC Peering vs Shared VPC",
        content: "A社とB社（別のGoogle Cloudオーガナイゼーション）のVPCを接続する必要があります。最適な方法はどれですか？",
        choices: [
          "Shared VPC — Aのネットワークリソースをオーガナイゼーション間で共有",
          "VPC Network Peering — 別オーガナイゼーション間でも使用可能、推移的ルーティングなし",
          "Cloud VPN — IPsec VPNで暗号化接続",
          "Cloud Interconnect — 専用線で物理接続",
        ],
        correctChoice: 1,
        choiceExplanation: "Shared VPCは同一オーガナイゼーション内のプロジェクト間でのみ使用できます。別オーガナイゼーション間のVPC接続にはVPC Peeringが使用できます。ただしVPC Peeringは推移的ではなく（A-B, B-CをPeeringしてもA-Cは通信不可）、大量ルートのエクスポートはサポートされません。",
      },
      {
        id: 5,
        type: "command",
        title: "ファイアウォールルールの最小権限設定",
        content: "不要な通信を全てブロックし、必要な通信のみ許可するファイアウォールルールを設定します。",
        command: `# デフォルトのdeny-allルール（最低優先度）
gcloud compute firewall-rules create deny-all-ingress \\
  --network=prod-vpc \\
  --direction=INGRESS \\
  --priority=65534 \\
  --action=DENY \\
  --rules=all

# WebサーバーへのHTTPS許可
gcloud compute firewall-rules create allow-https \\
  --network=prod-vpc \\
  --direction=INGRESS \\
  --priority=1000 \\
  --target-tags=web-server \\
  --allow=tcp:443 \\
  --source-ranges=0.0.0.0/0

# WebサーバーからDBへのMySQL許可
gcloud compute firewall-rules create allow-db-from-web \\
  --network=prod-vpc \\
  --direction=INGRESS \\
  --priority=1000 \\
  --target-tags=db-server \\
  --source-tags=web-server \\
  --allow=tcp:3306`,
        output: `Created firewall rule [deny-all-ingress].
Created firewall rule [allow-https].
Created firewall rule [allow-db-from-web].`,
      },
    ],
  },

  // ─── PCSE ─────────────────────────────────────────────────────────────
  {
    id: "pcse-iam-security",
    certId: "pcse",
    service: "IAM + Security",
    title: "IAM最小権限設計とOrganization Policy",
    description: "大規模組織でのIAMアクセス制御設計と、Organization Policyを使ったガードレール設定を実践します。",
    difficulty: "hard",
    estimatedMinutes: 35,
    objectives: [
      "Organization Policy Constraintsでセキュリティガードレールを設定する",
      "条件付きIAMバインディングで時間・リソースベースのアクセス制御を実装する",
      "IAM Recommenderを活用して過剰権限を削減する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "GCPセキュリティの多層防御",
        content: "GCPのセキュリティは4層で構成されます：\n\n```\n Layer 4: データ保護\n   └── Cloud KMS / CMEK / DLP\n Layer 3: アプリケーション保護\n   └── Cloud Armor / reCAPTCHA / Web Security Scanner\n Layer 2: ネットワーク保護\n   └── VPC / ファイアウォール / Private Google Access\n Layer 1: ID・アクセス管理\n   └── IAM / Organization Policy / Workforce Identity\n```\n\n**PCSEでよく問われる概念:**\n- **最小権限の原則**: 業務に必要な最小権限のみ\n- **職務分離**: 同一人物が承認と実行を兼任しない\n- **監査可能性**: Cloud Audit Logsで全操作を記録",
      },
      {
        id: 2,
        type: "command",
        title: "Organization Policy: 外部IP禁止ポリシー",
        content: "全プロジェクトでVMへの外部IP割り当てを禁止するOrganization Policyを設定します。",
        command: `cat > restrict-external-ip.yaml << 'EOF'
constraint: constraints/compute.vmExternalIpAccess
listPolicy:
  allValues: DENY
EOF

gcloud resource-manager org-policies set-policy \\
  restrict-external-ip.yaml \\
  --organization=123456789012`,
        output: `Updated policy for organization [123456789012].

Constraint: constraints/compute.vmExternalIpAccess
List policy:
  Denied values: ALL

This policy prevents all VMs from having external IP addresses.
Override requires explicit allowlisting per-project.`,
      },
      {
        id: 3,
        type: "command",
        title: "条件付きIAMバインディング（時間制限）",
        content: "承認されたメンテナンス時間帯のみStorage管理者権限を付与します。",
        command: `gcloud projects add-iam-policy-binding my-project \\
  --member="user:ops-engineer@company.com" \\
  --role="roles/storage.admin" \\
  --condition='expression=request.time.getHours("Asia/Tokyo") >= 22 || request.time.getHours("Asia/Tokyo") < 6,title=maintenance-window,description=Allow access only during maintenance window (22:00-06:00 JST)'`,
        output: `Updated IAM policy for project [my-project].
Conditional binding added:
  Member: user:ops-engineer@company.com
  Role: roles/storage.admin
  Condition: (22:00-06:00 JST のみ有効)`,
      },
      {
        id: 4,
        type: "command",
        title: "IAM Recommender で過剰権限を特定",
        content: "IAM Recommenderの推奨事項を確認し、過剰な権限を特定します。",
        command: `gcloud recommender recommendations list \\
  --project=my-project \\
  --recommender=google.iam.policy.Recommender \\
  --location=global \\
  --format=json | jq '.[].content.operationGroups[].operations[]'`,
        output: `{
  "action": "replace",
  "path": "/iamPolicy/bindings/*/role",
  "value": "roles/storage.objectViewer",
  "previousValue": "roles/storage.admin",
  "resource": "//cloudresourcemanager.googleapis.com/projects/my-project",
  "recommendation": "User 'dev@company.com' has roles/storage.admin but only used objectViewer permissions in 90 days"
}
Potential security risk: 87% of permissions were unused.`,
      },
      {
        id: 5,
        type: "choice",
        title: "確認問題: VPC Service Controls",
        content: "BigQueryデータが社外ネットワークからアクセスされるリスクを防ぎたい。最適なコントロールはどれですか？",
        choices: [
          "BigQueryのIAMポリシーで社外ユーザーをブロック",
          "VPC Service Controls でサービスペリメータを設定し、承認されたネットワークのみBigQueryへアクセス可能にする",
          "BigQueryデータセットをプライベートにする",
          "Cloud Armor でIPフィルタリングを設定する",
        ],
        correctChoice: 1,
        choiceExplanation: "VPC Service Controlsはサービスペリメータを作成し、BigQueryなどのGCPサービスへのアクセスをペリメータ内のリソースからのみに制限します。IAMとは異なり、ネットワークレベルでデータ持ち出しを防ぎます（data exfiltration protection）。",
      },
      {
        id: 6,
        type: "command",
        title: "Cloud KMS カスタム暗号化キーの設定",
        content: "BigQueryデータをCMEK（顧客管理暗号化キー）で暗号化します。",
        command: `# KMSキーリングとキーの作成
gcloud kms keyrings create my-keyring \\
  --location=us-central1

gcloud kms keys create bigquery-key \\
  --location=us-central1 \\
  --keyring=my-keyring \\
  --purpose=encryption

# BigQuery SAへの暗号化権限付与
gcloud kms keys add-iam-policy-binding bigquery-key \\
  --location=us-central1 \\
  --keyring=my-keyring \\
  --member="serviceAccount:bq-sa@my-project.iam.gserviceaccount.com" \\
  --role=roles/cloudkms.cryptoKeyEncrypterDecrypter`,
        output: `Created keyring [my-keyring].
Created key [bigquery-key].
Updated IAM policy for key [bigquery-key].

Key details:
  Primary version state: ENABLED
  Rotation period: 90 days (recommended)
  Algorithm: GOOGLE_SYMMETRIC_ENCRYPTION`,
      },
    ],
  },

  // ─── PCD ──────────────────────────────────────────────────────────────
  {
    id: "pcd-cloudrun-cicd",
    certId: "pcd",
    service: "Cloud Run + CI/CD",
    title: "Cloud Run デプロイパイプラインの構築",
    description: "Cloud BuildとCloud Runを使ってCI/CDパイプラインを構築し、本番へのBlue/Greenデプロイを実践します。",
    difficulty: "hard",
    estimatedMinutes: 40,
    objectives: [
      "Cloud BuildトリガーでGitHubプッシュ時の自動ビルド・デプロイを設定する",
      "Cloud Runのトラフィック分割でCanaryデプロイを実践する",
      "環境変数とSecret Managerの統合を実装する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "CI/CDパイプラインの全体像",
        content: "このラボで構築するパイプライン：\n\n```\n[GitHub: mainブランチへPush]\n         ↓ (Webhook)\n[Cloud Build Trigger]\n         ↓\n  ① テスト実行 (pytest)\n  ② Dockerビルド\n  ③ Artifact Registryへプッシュ\n  ④ Cloud Runへデプロイ（20%トラフィック）\n  ⑤ ヘルスチェック\n  ⑥ OK → 100%トラフィック切り替え\n         ↓\n[Cloud Run Service URL]\n         ↓\n[Slack通知 via Cloud Pub/Sub]\n```",
      },
      {
        id: 2,
        type: "command",
        title: "Cloud Build Trigger の設定",
        content: "GitHubのmainブランチへのプッシュ時に自動ビルドを起動するトリガーを作成します。",
        command: `gcloud builds triggers create github \\
  --project=my-project \\
  --repo-name=my-app \\
  --repo-owner=my-org \\
  --branch-pattern="^main$" \\
  --build-config=cloudbuild.yaml \\
  --substitutions=_REGION=us-central1,_SERVICE_NAME=my-app`,
        output: `Created trigger [my-app-main-trigger].
Trigger will fire on push to branch: main
Build config: cloudbuild.yaml`,
      },
      {
        id: 3,
        type: "task",
        title: "cloudbuild.yaml の確認",
        content: "以下のCloud Buildパイプライン設定を確認します：\n\n```yaml\nsteps:\n  # Step 1: テスト\n  - name: 'python:3.11'\n    entrypoint: pip\n    args: ['install', '-r', 'requirements.txt']\n  - name: 'python:3.11'\n    entrypoint: pytest\n    args: ['tests/']\n\n  # Step 2: Dockerビルド\n  - name: 'gcr.io/cloud-builders/docker'\n    args:\n      - build\n      - '-t'\n      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA'\n      - '.'\n\n  # Step 3: Artifact Registryへプッシュ\n  - name: 'gcr.io/cloud-builders/docker'\n    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA']\n\n  # Step 4: Cloud Runへデプロイ\n  - name: 'gcr.io/cloud-builders/gcloud'\n    args:\n      - run\n      - deploy\n      - my-app\n      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA'\n      - '--region=us-central1'\n      - '--no-traffic'\n\noptions:\n  logging: CLOUD_LOGGING_ONLY\n```\n設定内容を確認したら「次へ」を押してください。",
      },
      {
        id: 4,
        type: "command",
        title: "Secret Managerとの統合",
        content: "データベースパスワードをSecret Managerに格納し、Cloud Runから参照します。",
        command: `# シークレットの作成
echo -n "s3cr3t-db-password" | \\
  gcloud secrets create db-password \\
  --data-file=- \\
  --replication-policy=automatic

# Cloud Run SAへの参照権限付与
gcloud secrets add-iam-policy-binding db-password \\
  --member="serviceAccount:my-app-sa@my-project.iam.gserviceaccount.com" \\
  --role="roles/secretmanager.secretAccessor"

# Cloud Runサービスにシークレットをマウント
gcloud run services update my-app \\
  --region=us-central1 \\
  --set-secrets="DB_PASSWORD=db-password:latest"`,
        output: `Created secret [db-password].
Updated IAM policy for secret [db-password].
OK  Updating service [my-app]... Done.
  Secret [db-password] mounted as env var DB_PASSWORD.`,
      },
      {
        id: 5,
        type: "command",
        title: "段階的ロールアウト（Canary Deploy）",
        content: "新バージョンを20%のトラフィックでテストし、問題なければ100%に切り替えます。",
        command: `# 新リビジョンを20%に設定
gcloud run services update-traffic my-app \\
  --region=us-central1 \\
  --to-revisions my-app-v2=20,my-app-v1=80

# エラーレート確認（問題なければ100%へ）
sleep 300  # 5分間モニタリング

# 全トラフィックをv2に切り替え
gcloud run services update-traffic my-app \\
  --region=us-central1 \\
  --to-latest`,
        output: `Traffic updated:
  80% → my-app-v1 (stable)
  20% → my-app-v2 (canary)

[5分後...]
Error rate v2: 0.02% (acceptable)
Switching 100% to my-app-v2...

Traffic updated:
  100% → my-app-v2 (latest)`,
      },
      {
        id: 6,
        type: "choice",
        title: "確認問題: Cloud Runのコールドスタート対策",
        content: "Cloud Runサービスのレスポンスが不規則に遅くなります（コールドスタート問題）。PCD的に最適な対策はどれですか？",
        choices: [
          "CPU Boostを有効化し、コールドスタート時のCPUを一時的に増加させる",
          "--min-instances=1 を設定してウォームインスタンスを常時維持する",
          "A と B の両方を組み合わせる",
          "Cloud Runから GKEに移行してコールドスタートをなくす",
        ],
        correctChoice: 2,
        choiceExplanation: "Cが正解です。CPU Boost（--cpu-boost）はコールドスタート時のCPUを一時増強し起動を高速化します。min-instances=1はウォームインスタンスを常時維持してコールドスタートを防ぎます。レイテンシSLAが厳しい本番サービスにはこの組み合わせが推奨されます。",
      },
    ],
  },
  {
    id: "pcd-firestore",
    certId: "pcd",
    service: "Cloud Firestore",
    title: "Cloud Firestore データモデリングとセキュリティ",
    description: "Cloud Firestoreのデータモデリングのベストプラクティスとセキュリティルールを実装します。",
    difficulty: "medium",
    estimatedMinutes: 30,
    objectives: [
      "Firestoreのコレクション・ドキュメント・サブコレクション設計を理解する",
      "複合インデックスを使ったクエリ最適化を実践する",
      "セキュリティルールでユーザー認証ベースのアクセス制御を実装する",
    ],
    steps: [
      {
        id: 1,
        type: "info",
        title: "FirestoreのデータモデルとSQLとの違い",
        content: "FirestoreはNoSQLドキュメントDBで、SQLとは設計思想が異なります：\n\n| SQLの考え方 | Firestoreの考え方 |\n|---|---|\n| テーブル | コレクション |\n| 行 | ドキュメント |\n| JOIN | 非正規化 or サブコレクション |\n| GROUP BY | Cloud Functions で集計 |\n\n**設計のコツ:**\n- **非正規化**: 読み取り頻度が高いデータは重複しても一緒に格納\n- **サブコレクション**: 1対多の関係はサブコレクションで表現\n- **1ドキュメント = 1MBまで**",
      },
      {
        id: 2,
        type: "task",
        title: "チャットアプリのデータ設計",
        content: "以下のFirestoreデータ設計を確認します：\n\n```\n# コレクション構成\nusers/{userId}\n  ├── name: \"Alice\"\n  ├── email: \"alice@example.com\"\n  ├── createdAt: Timestamp\n  └── lastSeen: Timestamp\n\nrooms/{roomId}\n  ├── name: \"General\"\n  ├── createdBy: \"userId123\"\n  ├── memberCount: 42  ← 非正規化（毎回集計しない）\n  └── messages/{messageId}  ← サブコレクション\n        ├── text: \"Hello!\"\n        ├── userId: \"userId123\"\n        ├── userName: \"Alice\"  ← 非正規化\n        └── createdAt: Timestamp\n```\n\nこの設計のメリット:\n- メッセージ取得時にユーザー情報を別途取得不要\n- memberCountを事前集計しておくことでリスト表示が高速\n- メッセージはroomIdでスコープされ、セキュリティルールが書きやすい\n\n確認したら「次へ」を押してください。",
      },
      {
        id: 3,
        type: "command",
        title: "複合インデックスの作成",
        content: "roomId + createdAt の複合クエリを最適化するインデックスを作成します。",
        command: `# firestore.indexes.json に追加
cat > firestore.indexes.json << 'EOF'
{
  "indexes": [
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "roomId", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    }
  ]
}
EOF

firebase deploy --only firestore:indexes`,
        output: `=== Deploying to 'my-project'...
i  firestore: reading indexes from firestore.indexes.json...
i  firestore: deploying indexes...
✔  firestore: deployed index definition successfully.

Index:
  Collection: messages
  Fields: roomId ASC, createdAt DESC
  State: BUILDING... (usually takes 1-5 minutes)`,
      },
      {
        id: 4,
        type: "task",
        title: "セキュリティルールの実装",
        content: "Firebase認証と連動したFirestoreセキュリティルールを確認します：\n\n```javascript\nrules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    \n    // ユーザー自身のドキュメントのみ読み書き可\n    match /users/{userId} {\n      allow read: if request.auth != null;\n      allow write: if request.auth.uid == userId;\n    }\n    \n    // ルーム: 認証済みユーザーは読み取り可\n    match /rooms/{roomId} {\n      allow read: if request.auth != null;\n      allow create: if request.auth != null;\n      allow update, delete: if request.auth.uid == resource.data.createdBy;\n      \n      // メッセージ: 自分の投稿のみ削除可\n      match /messages/{messageId} {\n        allow read: if request.auth != null;\n        allow create: if request.auth != null\n          && request.resource.data.userId == request.auth.uid;\n        allow delete: if request.auth.uid == resource.data.userId;\n      }\n    }\n  }\n}\n```\n\n重要ポイント:\n- `request.auth.uid` で認証ユーザーのIDを取得\n- `resource.data` で既存ドキュメントのデータを参照\n- `request.resource.data` で書き込もうとしているデータを参照\n\n確認したら「次へ」を押してください。",
      },
      {
        id: 5,
        type: "choice",
        title: "確認問題: Firestoreのトランザクション",
        content: "チャットルームのメンバー数（memberCount）を安全にインクリメントする方法として正しいのはどれですか？",
        choices: [
          "ドキュメントを読み取り、memberCount + 1 を書き込む（楽観的更新）",
          "Firestoreのフィールド値インクリメント: FieldValue.increment(1) を使用する",
          "Cloud Functionsのトリガーで定期的に集計する",
          "memberCountフィールドは廃止してリアルタイム集計に切り替える",
        ],
        correctChoice: 1,
        choiceExplanation: "FieldValue.increment(1) はアトミック操作です。複数のクライアントが同時に更新しても競合が発生しません。選択肢Aの「読み取り → 書き込み」は複数クライアントが同時に実行すると競合し、カウントが正確でなくなります（lost update問題）。",
      },
    ],
  },
]

export function getLabsByCert(certId: string): HandsOnLab[] {
  return HANDS_ON_LABS.filter((lab) => lab.certId === certId)
}

export function getLabById(id: string): HandsOnLab | undefined {
  return HANDS_ON_LABS.find((lab) => lab.id === id)
}
