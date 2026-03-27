import type { StudyModule } from "@/lib/types/study-module"

export const PCD_MODULES: StudyModule[] = [
  {
    id: "pcd-app-design",
    certId: "pcd",
    domainName: "スケーラブルアプリケーション設計",
    title: "スケーラブルアプリケーション設計",
    description:
      "Professional Cloud Developerとして必須の12-Factor App原則、マイクロサービス設計パターン、非同期通信設計、キャッシング戦略を体系的に学習します。クラウドネイティブなアプリケーション設計の思想と実装パターンを習得します。",
    estimatedMinutes: 95,
    difficulty: "advanced",
    prerequisites: ["ace-app-engine", "ace-gke"],
    relatedLabIds: ["lab-12factor", "lab-pubsub", "lab-memorystore"],
    sections: [
      {
        id: "pcd-app-s1",
        title: "12-Factor Appの原則",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "text",
            markdown: `## 12-Factor Appの全原則とクラウドネイティブ開発との対応

12-Factor AppはHerokuによって提唱されたモダンなWebアプリケーション開発方法論。GCP上のサービス（Cloud Run/GKE/App Engine）は12-Factorに準拠した設計を推奨している。

### 12の原則一覧

| # | 原則 | 内容 | GCPでの実装 |
|---|---|---|---|
| 1 | **コードベース** | 1つのコードベース、複数デプロイ | Cloud Source Repositories / GitHub |
| 2 | **依存関係** | 依存関係を明示的に宣言・分離 | requirements.txt / go.mod / package.json |
| 3 | **設定** | 設定を環境変数に格納 | Secret Manager / Cloud Run環境変数 |
| 4 | **バックエンドサービス** | バックエンドサービスをアタッチリソースとして扱う | Cloud SQL / Memorystore / Pub/Sub |
| 5 | **ビルド・リリース・実行** | ビルドとランタイムを分離 | Cloud Build / Artifact Registry / Cloud Run |
| 6 | **プロセス** | アプリをステートレスなプロセスとして実行 | Cloud Run（ステートレス前提） |
| 7 | **ポートバインディング** | ポートバインディングで公開 | Cloud Run（PORT環境変数） |
| 8 | **並行性** | プロセスモデルでスケールアウト | Cloud Runのconcurrency / GKE HPA |
| 9 | **廃棄容易性** | 高速起動とグレースフルシャットダウン | Cloud Run（コールドスタート最適化） |
| 10 | **開発/本番一致** | 開発・ステージング・本番を一致させる | Cloud Deploy + 複数環境 |
| 11 | **ログ** | ログをイベントストリームとして扱う | Cloud Logging（stdout/stderrを自動収集） |
| 12 | **管理プロセス** | 管理タスクをワンオフプロセスとして実行 | Cloud Run Jobs / GKE Jobs |

### GCPでの12-Factor実装例

\`\`\`python
# NG: 設定をコードにハードコード（12-Factor違反）
DATABASE_URL = "postgresql://user:pass@10.0.0.1:5432/mydb"

# OK: 環境変数から取得（12-Factor準拠）
import os
DATABASE_URL = os.environ.get("DATABASE_URL")

# さらに良い: Secret Managerから取得（機密情報）
from google.cloud import secretmanager
client = secretmanager.SecretManagerServiceClient()
name = f"projects/{PROJECT_ID}/secrets/db-password/versions/latest"
response = client.access_secret_version(request={"name": name})
DB_PASSWORD = response.payload.data.decode("UTF-8")
\`\`\`
`,
          },
          {
            type: "concept_card",
            term: "12-Factorの特に重要な5要素",
            definition:
              "12-Factor Appの原則のうち、PCD試験で特に問われる5つの要素。コードベース（単一リポジトリ）、依存関係（明示的宣言）、設定（環境変数化）、ステートレス（状態を持たない）、ログ（ストリームとして扱う）の5つはクラウドネイティブ設計の根幹を形成する。",
            useCases: [
              "コードベース統一：モノレポまたはサービスごとの独立リポジトリで管理（本番/開発はブランチ/タグで分離）",
              "依存関係明示化：コンテナイメージに全依存関係をパッケージし、ランタイム環境に依存しない設計",
              "設定の外部化：データベースURL・APIキー等を環境変数またはSecret Managerに移し、コードとデータを分離",
              "ステートレス化：セッション情報をMemorystore(Redis)に外部化し、インスタンスの追加・削除を自由に行える",
              "ログのストリーム化：アプリがstdout/stderrに出力すれば、Cloud Loggingが自動収集・構造化ログとして保存",
            ],
            characteristics: [
              "コードベース：1アプリ = 1リポジトリ。複数のデプロイ（本番/ステージング）は同一コードから作成",
              "依存関係：システムへのグローバルインストールに依存しない（requirements.txtで全依存を記載）",
              "設定：コードと設定の明確な分離。Gitにシークレットを絶対にコミットしない",
              "ステートレス：インスタンスが再起動・スケールダウンされても状態が失われないアーキテクチャ",
              "ログ：ファイルへの書き込みでなくstdoutへの出力。ログの収集・保存はプラットフォームに委任",
            ],
            examRelevance:
              "「本番インスタンスの再起動後にデータが失われる」→ ステートレス違反（セッションをVM内に保存）が原因。「環境ごとに動作が異なる」→ 設定の環境変数化不足。試験では違反パターンを特定して修正策を答える問題が多い。",
          },
          {
            type: "key_point",
            level: "common_mistake",
            title: "試験でよく問われる12-Factor違反パターン",
            content: `**頻出の違反パターンと修正策：**

1. **セッションをVM/コンテナのメモリに保存**
   - 違反: スケールアウト後にセッションが失われる
   - 修正: Memorystore (Redis) にセッションを外部化

2. **データベース接続情報をコードにハードコード**
   - 違反: 環境ごとにコードを変更する必要がある
   - 修正: Secret Manager + 環境変数で外部化

3. **ログをファイルに書き込む**
   - 違反: コンテナ再起動でログが消える、分散環境で収集困難
   - 修正: stdout/stderrに出力（Cloud Loggingが自動収集）

4. **本番と開発でDockerイメージが異なる**
   - 違反: 「自分の環境では動く」問題が発生
   - 修正: 同一イメージを全環境で使用し、設定のみ環境変数で切り替え

5. **バックグラウンドスレッドで状態管理**
   - 違反: オートスケール時に処理の重複や欠落が発生
   - 修正: Pub/SubやCloud Tasksで非同期処理を外部化`,
          },
        ],
      },
      {
        id: "pcd-app-s2",
        title: "マイクロサービス設計パターン",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "モノリス vs マイクロサービス vs サーバーレスの比較",
            headers: ["比較項目", "モノリス", "マイクロサービス", "サーバーレス"],
            rows: [
              {
                label: "結合度",
                values: [
                  "高い（全コンポーネントが単一デプロイ単位）",
                  "低い（サービス間はAPIで疎結合）",
                  "最も低い（関数単位で独立デプロイ）",
                ],
                highlight: true,
              },
              {
                label: "スケーリング",
                values: [
                  "アプリケーション全体を水平スケール（非効率）",
                  "ボトルネックのサービスのみをスケール（効率的）",
                  "リクエストごとに自動スケール（ゼロスケールも可能）",
                ],
                highlight: true,
              },
              {
                label: "開発速度",
                values: [
                  "初期は速い。規模拡大とともに遅くなる（変更の影響範囲が大）",
                  "チームが独立して開発できるため大規模チームで速い",
                  "小さな機能の実装は非常に速い。複雑なオーケストレーションは困難",
                ],
              },
              {
                label: "運用複雑度",
                values: [
                  "シンプル（単一デプロイ）。DBスキーマ変更が困難",
                  "高い（サービスディスカバリ/分散トレーシング/サーキットブレーカー等が必要）",
                  "低い（インフラ管理不要）。コールドスタートとステートレス制約あり",
                ],
                highlight: true,
              },
              {
                label: "GCPでの推奨サービス",
                values: [
                  "App Engine Standard、単一Cloud Runサービス",
                  "GKE (Autopilot)、Cloud Run複数サービス",
                  "Cloud Functions、Cloud Run（ゼロスケール設定）",
                ],
              },
              {
                label: "適切なシナリオ",
                values: [
                  "小規模チーム、スタートアップ初期、社内ツール",
                  "大規模チーム、独立したデプロイ頻度が必要、機能ごとに異なるスケール要件",
                  "イベントドリブン処理、バックグラウンドタスク、軽量API",
                ],
              },
            ],
            footnote:
              "マイクロサービスは「銀の弾丸」ではない。チームが小さい場合はモノリスで始めてサービス境界が明確になってから分割するアプローチ（Strangler Fig Pattern）が現実的。",
          },
          {
            type: "text",
            markdown: `## サービスメッシュとIstio/Anthos Service Meshの役割

### なぜサービスメッシュが必要か

マイクロサービスが増えると以下の問題が顕在化する：
- サービス間の認証・認可（mTLS）
- トラフィック制御（重み付けルーティング・サーキットブレーカー）
- 可観測性（分散トレーシング・メトリクス）

これらをアプリケーションコードに実装すると全サービスで重複実装が必要になる。サービスメッシュはこれらをサイドカープロキシ（Envoy）として各Podに注入し、アプリコード変更なしに横断的機能を提供する。

### Anthos Service Mesh (ASM) の主要機能

\`\`\`
ASM機能マップ：

トラフィック管理:
  ├── VirtualService: ルーティングルール（ヘッダー/重みによる分岐）
  ├── DestinationRule: サーキットブレーカー・リトライ・mTLS設定
  └── Gateway: ingress/egressトラフィックの制御

セキュリティ:
  ├── PeerAuthentication: Pod間のmTLS強制
  ├── RequestAuthentication: JWTトークン検証
  └── AuthorizationPolicy: L7レベルのアクセス制御

可観測性:
  ├── 分散トレーシング → Cloud Trace
  ├── メトリクス → Cloud Monitoring
  └── サービスグラフ → ASMコンソール
\`\`\`
`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "GCPでのマイクロサービス実装推奨パターン",
            content: `**Cloud Run でのマイクロサービス：**
- 各サービスを独立したCloud Runサービスとしてデプロイ
- サービス間通信：Cloud Run invokerロールを使ったIAM認証
- サービスディスカバリ：Cloud Run URLを環境変数で渡す
- 推奨：同一リージョン内はCloud Run to Cloud Runで低レイテンシ

**GKEでのマイクロサービス：**
- Namespace単位でチームを分離
- サービスメッシュ（ASM）でmTLSとトラフィック制御
- Workload Identityでサービスアカウントを管理
- GKE AutopilotでノードプロビジョニングをGoogle管理に委任

**試験での判断基準：**
- 「チームが独立してデプロイしたい」→ マイクロサービス + Cloud Deploy
- 「サービス間通信のセキュリティ（mTLS）が必要」→ Anthos Service Mesh
- 「コンテナオーケストレーション不要でシンプルに」→ Cloud Run（マネージドKubernetes不要）`,
          },
        ],
      },
      {
        id: "pcd-app-s3",
        title: "非同期通信設計",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "Pub/Sub vs Cloud Tasks vs Eventarc の比較",
            headers: ["比較項目", "Pub/Sub", "Cloud Tasks", "Eventarc"],
            rows: [
              {
                label: "配信保証",
                values: [
                  "At-least-once（最低1回配信）。重複配信は冪等性で対応",
                  "Exactly-once（タスクは1回のみ実行を保証、ACK後は削除）",
                  "At-least-once（Pub/Sub基盤のため同様）",
                ],
                highlight: true,
              },
              {
                label: "メッセージ順序",
                values: [
                  "デフォルト無順序。MessageOrdering Keyで同一キーのメッセージを順序保証",
                  "キューごとのFIFO。タスクに遅延・スケジュール実行が設定可能",
                  "イベントソースの順序に依存（保証なし）",
                ],
              },
              {
                label: "デッドライン",
                values: [
                  "ack deadline: デフォルト10秒〜600秒。延長可能（Lease Management）",
                  "タスクごとにdeadlineを設定（最大24時間）。Retry設定でバックオフ制御",
                  "イベント処理のタイムアウトはCloud Run/Functionsの設定に依存",
                ],
              },
              {
                label: "ユースケース",
                values: [
                  "イベントバス（Fan-out）：1つのイベントを複数のサブスクライバーに配信。ログ収集・分析パイプライン",
                  "タスクキュー：処理速度制御・スケジュール実行・リトライが必要なバックグラウンドタスク",
                  "イベントトリガー：GCSアップロード→Cloud Run、BigQueryジョブ完了→通知など",
                ],
                highlight: true,
              },
              {
                label: "スケーリング",
                values: [
                  "スループット重視（大量メッセージを高速処理）。サブスクリプションごとに並列処理数を制御",
                  "レート制限（max_dispatches_per_second）で処理速度を細かく制御可能",
                  "Cloud Run/Functionsの自動スケールに依存",
                ],
              },
              {
                label: "モニタリング",
                values: [
                  "oldest_unacked_message_age・num_undelivered_messagesをモニタリング",
                  "キュー内タスク数・試行回数・dispatches/secondをモニタリング",
                  "イベント配信状況はCloud Loggingで確認",
                ],
              },
            ],
            footnote:
              "Pub/Sub = イベントバス（Fan-out可能・高スループット）、Cloud Tasks = タスクキュー（処理制御・スケジュール・デッドライン）という使い分けが試験の核心。Eventarcはイベントドリブンアーキテクチャのグルーとして機能する。",
          },
          {
            type: "decision_tree",
            title: "非同期メッセージングサービスの選択フロー",
            rootId: "q1",
            nodes: [
              {
                id: "q1",
                question: "1つのイベントを複数の異なるサービスで処理（Fan-out）したいか？",
                yesId: "ans-pubsub",
                noId: "q2",
              },
              {
                id: "ans-pubsub",
                answer: "Cloud Pub/Sub を使用",
                explanation:
                  "1トピックに複数のサブスクリプションを作成することでFan-outが実現できる。Pub/SubはGCPのイベントバスとして設計されており、大量メッセージの高スループット処理に最適。",
              },
              {
                id: "q2",
                question: "タスクの処理速度制限・スケジュール実行・バックオフ付きリトライが必要か？",
                yesId: "ans-tasks",
                noId: "q3",
              },
              {
                id: "ans-tasks",
                answer: "Cloud Tasks を使用",
                explanation:
                  "Cloud Tasksはタスクキューとして、レート制限（max_dispatches_per_second）、遅延実行（schedule_time）、詳細なリトライ設定（max_attempts/max_backoff）を提供する。バックエンドAPIのオーバーロード防止に有効。",
              },
              {
                id: "q3",
                question: "GCSアップロードやBigQueryジョブ完了などのGCPサービスイベントがトリガーか？",
                yesId: "ans-eventarc",
                noId: "q4",
              },
              {
                id: "ans-eventarc",
                answer: "Eventarc を使用",
                explanation:
                  "EventarcはGCPサービスのイベント（Cloud Audit Logs経由）やPub/SubメッセージをCloud Run/Workflowsにルーティングする。イベントドリブンアーキテクチャの接続層として機能する。",
              },
              {
                id: "q4",
                question: "メッセージの順序保証が必要か？",
                yesId: "ans-tasks-ordered",
                noId: "ans-pubsub-simple",
              },
              {
                id: "ans-tasks-ordered",
                answer: "Cloud Tasks（FIFOキュー）またはPub/Sub（MessageOrdering Key使用）",
                explanation:
                  "Cloud Tasksは同一キュー内でFIFO順序を保証。Pub/SubはMessageOrdering Keyを設定することで同一キーのメッセージ順序を保証（ただしスループットが低下する）。",
              },
              {
                id: "ans-pubsub-simple",
                answer: "Cloud Pub/Sub（シンプルな非同期通信）",
                explanation:
                  "シンプルなプロデューサー/コンシューマーパターン。高スループット・低レイテンシの非同期メッセージングに最適。Dead Letter Topic設定で処理失敗メッセージを別トピックに退避できる。",
              },
            ],
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "Cloud Tasks = タスクキュー、Pub/Sub = イベントバス",
            content: `**最も重要な使い分けの違い：**

**Cloud Tasks向きのシナリオ：**
- 「外部APIへのリクエストをレート制限したい（1秒に10リクエストまで）」
- 「メール送信を5分後に実行したい（遅延実行）」
- 「失敗したタスクを指数バックオフでリトライしたい」
- 「タスクの実行状況を追跡・管理したい」

**Pub/Sub向きのシナリオ：**
- 「注文イベントを在庫/請求/通知の3サービスに同時配信したい（Fan-out）」
- 「毎秒10万件のログをリアルタイムに処理したい（高スループット）」
- 「IoTデバイスからのストリームデータを収集したい」
- 「DataflowやBigQueryにデータを流し込みたい」

**試験のトラップ：**
両方とも「非同期処理」だが目的が異なる。
「処理速度制御」「スケジュール」→ Cloud Tasks
「マルチコンシューマー」「高スループット」→ Pub/Sub`,
          },
        ],
      },
      {
        id: "pcd-app-s4",
        title: "キャッシング戦略",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "キャッシングの4パターン：Cache-Aside / Read-Through / Write-Through / Write-Behind",
            definition:
              "キャッシング戦略はアプリケーションとキャッシュ・データベースの間でデータをどのように同期するかを定義するパターン。GCPではMemorystore（Redis/Memcached）を使ってこれらのパターンを実装する。",
            useCases: [
              "Cache-Aside（Lazy Loading）: アプリがキャッシュを明示的に管理。キャッシュミス時にDBから取得してキャッシュに格納。最も汎用的なパターン",
              "Read-Through: キャッシュがDBから自動的に読み込む。アプリはキャッシュのみにアクセス。Redisモジュールで実装",
              "Write-Through: 書き込み時にキャッシュとDBを同時更新。データ整合性が高い反面、書き込みレイテンシが増加",
              "Write-Behind（Write-Back）: 書き込みをキャッシュに行い、非同期でDBに反映。書き込み高速化だがデータ消失リスクあり",
              "Refresh-Ahead: キャッシュの有効期限が切れる前に非同期でデータを更新。レイテンシスパイク防止",
            ],
            characteristics: [
              "Cache-Aside: キャッシュとDBの不整合が起きやすい（TTL設定が重要）。スタンプード問題（同時キャッシュミス）に注意",
              "Write-Through: キャッシュに書き込んだデータが必ずDBにも反映されるため整合性が高い",
              "Write-Behind: キャッシュがダウンするとDBへの書き込みが失われるリスク（耐久性が低い）",
              "適切なTTL設定: 短すぎるとDBへのリクエストが増加、長すぎると古いデータを返し続ける",
              "キャッシュ無効化の難しさ: 「コンピューターサイエンスで最も難しい2つの問題のひとつはキャッシュの無効化」",
            ],
            examRelevance:
              "「DBの負荷を下げたい」→ Cache-Aside（最もシンプル）。「書き込みパフォーマンスが重要」→ Write-Behind（ただしデータ損失リスクを理解した上で）。「データ整合性が最重要」→ Write-Through。",
          },
          {
            type: "comparison_table",
            title: "Memorystore Redis vs Memcached の比較",
            headers: ["比較項目", "Memorystore for Redis", "Memorystore for Memcached"],
            rows: [
              {
                label: "データ構造",
                values: [
                  "String, Hash, List, Set, Sorted Set, Bitmap, Stream等のリッチなデータ構造をサポート",
                  "Stringのみ（シンプルなKey-Value）",
                ],
                highlight: true,
              },
              {
                label: "永続化",
                values: [
                  "RDB（スナップショット）とAOF（追記ログ）による永続化をサポート。再起動後もデータ保持",
                  "永続化なし。インスタンス再起動でデータが消える",
                ],
                highlight: true,
              },
              {
                label: "高可用性",
                values: [
                  "レプリカノード設定で自動フェイルオーバー（Standard Tier）。Basic TierはSLAなし",
                  "分散キャッシュ（シャーディング）はサポートするがレプリケーションなし",
                ],
              },
              {
                label: "主なユースケース",
                values: [
                  "セッション管理、リーダーボード（Sorted Set）、Pub/Sub、分散ロック、レート制限、キュー",
                  "シンプルなオブジェクトキャッシュ、大規模なキャッシュクラスター（マルチスレッド高速処理）",
                ],
              },
              {
                label: "スケーリング",
                values: [
                  "垂直スケール（ノードサイズ変更）。Redis Clusterモードで水平シャーディング（プレビュー）",
                  "水平スケール（ノード追加）でシャーディング。マルチスレッドで高いスループット",
                ],
              },
              {
                label: "GCPでの推奨",
                values: [
                  "セッション・複雑なデータ構造・高可用性が必要な場合（大多数のユースケース）",
                  "シンプルなWebページキャッシュ・大規模オブジェクトキャッシュ・スループット最重視",
                ],
                highlight: true,
              },
            ],
            footnote:
              "PCD試験では「セッション管理」「リーダーボード」「分散ロック」はRedis、「大規模シンプルキャッシュ」はMemcachedという使い分けを覚える。通常のWebアプリではRedisを推奨。",
          },
          {
            type: "key_point",
            level: "warning",
            title: "キャッシュのTTL設定とキャッシュ無効化の難しさ",
            content: `**TTL設計の考え方：**
- データ更新頻度とキャッシュヒット率のトレードオフ
- 頻繁に変わらないデータ（商品マスター等）→ 長いTTL（1時間〜1日）
- リアルタイム性が重要なデータ（在庫数等）→ 短いTTL（数十秒）または書き込み時にキャッシュ削除
- ユーザー固有のデータ（セッション等）→ セッション有効期限に合わせたTTL

**スタンプード問題（Thundering Herd）への対処：**
同じキャッシュキーが同時に期限切れになると、大量のリクエストがDBに殺到する問題。

解決策：
1. Random Jitter: TTLに乱数を加算（例: base_ttl + random(0, 300)）
2. Early Expiration: TTLより早めにバックグラウンドで更新（Refresh-Ahead）
3. Mutex Lock: 最初の1リクエストのみDBにアクセスし、他はロック解除まで待機

**試験でよく問われるシナリオ：**
「キャッシュ更新後もユーザーが古いデータを見続ける」
→ キャッシュ無効化（DEL）または短いTTL設定が必要
→ Write-Throughパターンへの移行を検討`,
          },
        ],
      },
    ],
  },
  {
    id: "pcd-cicd",
    certId: "pcd",
    domainName: "CI/CDとデプロイメント戦略",
    title: "CI/CDとデプロイメント戦略",
    description:
      "Cloud Build・Artifact Registryによるコンテナビルドパイプライン、4つのデプロイメント戦略の使い分け、Cloud Deployによるリリースパイプライン管理、テスト戦略とBinary Authorizationを体系的に学習します。",
    estimatedMinutes: 90,
    difficulty: "advanced",
    prerequisites: ["pcd-app-design"],
    relatedLabIds: ["lab-cloud-build", "lab-cloud-deploy", "lab-binary-auth"],
    sections: [
      {
        id: "pcd-cicd-s1",
        title: "Cloud BuildとArtifact Registry",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "text",
            markdown: `## cloudbuild.yaml の構造とステップ定義

Cloud BuildはサーバーレスなフルマネージドCI/CDサービス。\`cloudbuild.yaml\`でパイプラインのステップを定義する。

### cloudbuild.yaml の基本構造

\`\`\`yaml
steps:
  - name: string          # 使用するビルダーコンテナイメージ
    id: string            # ステップの識別子
    entrypoint: string    # コンテナのエントリーポイント
    args: [string]        # コマンド引数
    env: [string]         # 環境変数
    waitFor: [string]     # 依存するステップのIDリスト（並列実行に使用）
    timeout: string       # ステップタイムアウト（デフォルト600s）

images:                   # Artifact Registryにプッシュするイメージ
  - string

timeout: string           # ビルド全体のタイムアウト
\`\`\`

### 並列実行の設定

\`waitFor: ['-']\` で直前のステップを待たずに並列実行：

\`\`\`yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build'
    args: ['build', '-t', 'IMAGE:TAG', '.']

  # buildと並列でlintを実行
  - name: 'python:3.11'
    id: 'lint'
    waitFor: ['-']   # どのステップも待たない（並列実行）
    entrypoint: 'pip'
    args: ['install', 'flake8']
\`\`\`
`,
          },
          {
            type: "code_example",
            language: "yaml",
            title: "Cloud Buildパイプライン設定（test → build → push → deploy）",
            code: `# cloudbuild.yaml
steps:
  # Step 1: ユニットテスト
  - name: 'python:3.11-slim'
    id: 'unit-test'
    entrypoint: bash
    args:
      - '-c'
      - |
        pip install -r requirements.txt
        python -m pytest tests/unit/ -v --junitxml=/workspace/test-results.xml

  # Step 2: コンテナイメージのビルド
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build'
    waitFor: ['unit-test']
    args:
      - 'build'
      - '-t'
      - '\${_REGION}-docker.pkg.dev/\${PROJECT_ID}/\${_REPO}/\${_SERVICE}:\${SHORT_SHA}'
      - '-t'
      - '\${_REGION}-docker.pkg.dev/\${PROJECT_ID}/\${_REPO}/\${_SERVICE}:latest'
      - '.'

  # Step 3: Artifact Registryにプッシュ
  - name: 'gcr.io/cloud-builders/docker'
    id: 'push'
    waitFor: ['build']
    args:
      - 'push'
      - '--all-tags'
      - '\${_REGION}-docker.pkg.dev/\${PROJECT_ID}/\${_REPO}/\${_SERVICE}'

  # Step 4: Cloud Runへデプロイ（開発環境）
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    id: 'deploy-dev'
    waitFor: ['push']
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - '\${_SERVICE}-dev'
      - '--image=\${_REGION}-docker.pkg.dev/\${PROJECT_ID}/\${_REPO}/\${_SERVICE}:\${SHORT_SHA}'
      - '--region=\${_REGION}'
      - '--platform=managed'
      - '--no-allow-unauthenticated'

images:
  - '\${_REGION}-docker.pkg.dev/\${PROJECT_ID}/\${_REPO}/\${_SERVICE}:\${SHORT_SHA}'

artifacts:
  objects:
    location: 'gs://\${PROJECT_ID}-build-artifacts/\${BUILD_ID}'
    paths: ['/workspace/test-results.xml']

substitutions:
  _REGION: asia-northeast1
  _REPO: my-app-repo
  _SERVICE: my-service

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: E2_HIGHCPU_8

timeout: 1800s`,
            explanation:
              "SHORT_SHAはGitコミットのショートハッシュで自動設定される変数。substitutionsで環境固有の値を外部化できる。waitForで依存関係を明示的に設定することで並列/直列実行を制御する。",
          },
          {
            type: "concept_card",
            term: "Artifact Registryとcontainer imageのタグ戦略",
            definition:
              "Artifact RegistryはGCPのフルマネージドなパッケージ・コンテナイメージレジストリ。Container Registry（旧gcr.io）の後継サービスで、Dockerイメージ・npm・Maven・Python等のパッケージを一元管理できる。",
            useCases: [
              "コンテナイメージの格納と脆弱性スキャン（Artifact Analysis）",
              "Cloud Buildと統合したCI/CDパイプラインでの自動push/pull",
              "Binary Authorizationと組み合わせた署名済みイメージのみデプロイ許可",
              "npm/Maven/Python等のプライベートパッケージレジストリとして使用",
              "マルチリージョンリポジトリでグローバル展開時のイメージ可用性向上",
            ],
            characteristics: [
              "タグ戦略：immutableなタグはコミットSHA（sha-abc1234）、mutableなタグはlatest/stagingで環境を識別",
              "同一イメージをlatestとsha両方でタグ付けすることでトレーサビリティと使いやすさを両立",
              "Artifact Analysis：プッシュ時に脆弱性スキャンが自動実行（Container Scanning API）",
              "IAMで細かなアクセス制御が可能（roles/artifactregistry.reader / writer / admin）",
              "GCRからの移行：gcr.io/PROJECT_ID → REGION-docker.pkg.dev/PROJECT_ID/REPO_NAME",
            ],
            examRelevance:
              "「latestタグはimmutableでないため本番で使用すべきでない」という原則が頻出。本番デプロイにはSHAまたはセマンティックバージョンタグを使用すること。Binary Authorization + Artifact AnalysisでDevSecOpsパイプラインを構築する問題も出る。",
          },
        ],
      },
      {
        id: "pcd-cicd-s2",
        title: "デプロイメント戦略",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "デプロイメント戦略の比較：Rolling / Blue-Green / Canary / A-B Testing",
            headers: ["戦略", "リスク", "ロールバック速度", "リソースコスト", "主なユースケース"],
            rows: [
              {
                label: "Rolling Deploy",
                values: [
                  "中（新旧バージョンが混在する期間あり）",
                  "遅い（ロールバック時も徐々に戻す）",
                  "低い（既存リソースを段階的に更新）",
                  "通常の段階的デプロイ。API互換性が保証される場合に最適",
                ],
              },
              {
                label: "Blue-Green Deploy",
                values: [
                  "低い（切り替え前にGreenで完全テスト可能）",
                  "非常に速い（DNSまたはLBの切り替えのみで即座にロールバック）",
                  "高い（本番と同等の環境を2つ維持）",
                  "ダウンタイムゼロのリリース。即座のロールバックが必須の重要サービス",
                ],
                highlight: true,
              },
              {
                label: "Canary Release",
                values: [
                  "低い（小さなトラフィック割合で先行検証）",
                  "速い（Canaryのトラフィック割合を0に戻すだけ）",
                  "中程度（Canaryインスタンスは少数でOK）",
                  "新機能の段階的リリース。本番トラフィックで実際の動作を検証してから段階的に拡大",
                ],
                highlight: true,
              },
              {
                label: "A/B Testing",
                values: [
                  "低い（特定ユーザーセグメントのみ）",
                  "速い（ユーザーセグメントをAに戻す）",
                  "中程度",
                  "機能の効果測定（コンバージョン率/UX比較）。HTTPヘッダー/Cookieでユーザーを振り分け",
                ],
              },
            ],
            footnote:
              "Cloud RunとGKEは4つの戦略すべてをサポート。Cloud RunはトラフィックスプリットでCanary/Blue-Greenを実装しやすい。",
          },
          {
            type: "text",
            markdown: `## Cloud Runでのトラフィック分割実装

### Canary Deployのトラフィック分割

\`\`\`bash
# 新リビジョンへのデプロイ（トラフィックなし）
gcloud run deploy my-service \\
  --image=REGION-docker.pkg.dev/PROJECT/REPO/my-service:v2 \\
  --region=asia-northeast1 \\
  --no-traffic

# 10%だけ新リビジョンに流す（Canary開始）
gcloud run services update-traffic my-service \\
  --region=asia-northeast1 \\
  --to-revisions=my-service-v2=10,my-service-v1=90

# 全トラフィックを新リビジョンへ（完全切り替え）
gcloud run services update-traffic my-service \\
  --region=asia-northeast1 \\
  --to-latest

# 問題が発生したらロールバック
gcloud run services update-traffic my-service \\
  --region=asia-northeast1 \\
  --to-revisions=my-service-v1=100
\`\`\`

### Blue-Green DeployのGKEでの実装

\`\`\`yaml
# Service selectorをBlue/Greenで切り替え
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
    version: blue   # ← この行でBlue/Greenを切り替え
\`\`\`

\`\`\`bash
# GreenにDeploymentをデプロイ後、Serviceのselectorを変更
kubectl patch service my-service -p '{"spec":{"selector":{"version":"green"}}}'
# ロールバック
kubectl patch service my-service -p '{"spec":{"selector":{"version":"blue"}}}'
\`\`\`
`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "本番リリースリスクを最小化する戦略選択",
            content: `**試験での戦略選択パターン：**

- 「即座のロールバックが必要」→ Blue-Green（切り替えはLB/DNSのみ）
- 「少数ユーザーで先行検証してから全体リリース」→ Canary
- 「機能AとBどちらがコンバージョン率が高いか測定」→ A/B Testing
- 「リソースコスト最小で通常のリリース」→ Rolling Deploy
- 「ダウンタイムゼロが必須」→ Blue-Green または Canary

**Cloud Runのトラフィック分割の特徴：**
- Revisionベースでトラフィックを割り当て（%単位）
- タグ（tag）でRevisionに名前を付けてURLで直接アクセス可能（Canaryテスト用）
- Cloud Deployと組み合わせると段階的リリースを自動化できる

**GKEのRolling Updateのデフォルト設定：**
maxSurge: 25%, maxUnavailable: 25%
→ リソースを最大25%増やしながら最大25%を同時に入れ替える`,
          },
        ],
      },
      {
        id: "pcd-cicd-s3",
        title: "Cloud Deployとリリースパイプライン",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud Deployの主要コンセプト：Delivery Pipeline / Target / Release / Rollout",
            definition:
              "Cloud DeployはGCPのフルマネージドなCD（継続的デリバリー）サービス。デプロイパイプラインを宣言的に定義し、dev→staging→prodへの段階的リリースを管理・可視化する。承認ゲートと自動ロールバックをサポートする。",
            useCases: [
              "開発→ステージング→本番への段階的なCanaryデプロイの自動化",
              "本番デプロイ前の手動承認ゲート（リリースマネージャーの承認が必要なケース）",
              "デプロイ失敗時の自動ロールバック（Cloud Run/GKE両対応）",
              "複数のCloud Run/GKEサービスへのコーディネートされたリリース",
              "デプロイ履歴の可視化と監査ログ（誰が何をデプロイしたかの証跡）",
            ],
            characteristics: [
              "Delivery Pipeline: デプロイのステージ順序（dev→staging→prod）とターゲットを定義",
              "Target: デプロイ先の環境（GKEクラスター or Cloud Runサービス）を定義",
              "Release: 特定のコンテナイメージを含むデプロイ可能な単位（一度作成したReleaseは変更不可）",
              "Rollout: ReleaseをTargetに適用するデプロイ実行インスタンス（承認待ち/進行中/成功/失敗の状態を持つ）",
              "Skaffoldとの統合：Kubernetes/Cloud Run向けのビルド・デプロイ設定をskaffold.yamlで一元管理",
            ],
            examRelevance:
              "「Cloud BuildはCI（ビルド・テスト）、Cloud DeployはCD（デプロイ管理）」という役割分担が試験の核心。「段階的リリースと承認ゲート」要件はCloud Deploy。「ビルドパイプライン定義」はCloud Build。",
          },
          {
            type: "code_example",
            language: "yaml",
            title: "clouddeploy.yaml 設定例",
            code: `# clouddeploy.yaml - Delivery Pipelineの定義
apiVersion: deploy.cloud.google.com/v1
kind: DeliveryPipeline
metadata:
  name: my-app-pipeline
  region: asia-northeast1
description: "My App のデプロイパイプライン"
serialPipeline:
  stages:
    - targetId: dev
      profiles: [dev]
    - targetId: staging
      profiles: [staging]
      strategy:
        canary:
          runtimeConfig:
            cloudRun:
              automaticTrafficControl: true
          canaryDeployment:
            percentages: [25, 50, 75]
            verify: true
    - targetId: production
      profiles: [production]
      strategy:
        canary:
          runtimeConfig:
            cloudRun:
              automaticTrafficControl: true
          canaryDeployment:
            percentages: [10, 50]
            verify: true
---
# Target定義（開発環境）
apiVersion: deploy.cloud.google.com/v1
kind: Target
metadata:
  name: dev
  region: asia-northeast1
run:
  location: projects/my-project/locations/asia-northeast1
---
# Target定義（本番環境、承認必須）
apiVersion: deploy.cloud.google.com/v1
kind: Target
metadata:
  name: production
  region: asia-northeast1
requireApproval: true
run:
  location: projects/my-project-prod/locations/asia-northeast1`,
            explanation:
              "serialPipelineでdev→staging→productionの順序を定義。requireApproval: trueで本番デプロイに手動承認を挟む。Cloud Runのcanary strategyと組み合わせると自動トラフィックスプリットが実現できる。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "Cloud Deploy vs Cloud Build の使い分け",
            content: `**Cloud Build の役割（CI）：**
- コードのビルド・テスト実行
- コンテナイメージの作成・プッシュ
- 静的解析・脆弱性スキャン
- 成果物の生成と保存

**Cloud Deploy の役割（CD）：**
- ビルド済みイメージの段階的デプロイ
- 複数環境（dev/staging/prod）の管理
- 承認ゲートの設定
- ロールバックとデプロイ履歴管理

**統合パターン：**
Gitプッシュ → Cloud Build（CI：テスト/ビルド/プッシュ）
→ Cloud Deploy Release作成 → dev自動デプロイ
→ staging Canaryデプロイ → production承認待ち → 手動承認 → デプロイ

**試験の判断：**
「デプロイの承認フロー」→ Cloud Deploy
「コンテナビルドのカスタマイズ」→ Cloud Build
「段階的リリースの自動化」→ Cloud Deploy`,
          },
        ],
      },
      {
        id: "pcd-cicd-s4",
        title: "テスト戦略",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "テスト種別の比較：ユニット〜カオスエンジニアリング",
            headers: ["テスト種別", "対象範囲", "実行速度", "メンテナンスコスト", "Cloud Buildでの実装"],
            rows: [
              {
                label: "ユニットテスト",
                values: [
                  "個別の関数・クラス（依存はモック）",
                  "非常に速い（ミリ秒〜秒）",
                  "低い（モックで外部依存を排除）",
                  "pytest/jest等をステップとして実行。並列実行でビルド時間短縮",
                ],
                highlight: true,
              },
              {
                label: "統合テスト",
                values: [
                  "複数コンポーネント間の連携（実際のDB/API使用）",
                  "中程度（秒〜分）",
                  "中程度（テスト環境の維持が必要）",
                  "Cloud SQL/Memorystore等のテスト用インスタンスをCloud Buildで起動",
                ],
              },
              {
                label: "E2Eテスト",
                values: [
                  "ユーザーシナリオ全体（フロントエンド〜バックエンド）",
                  "遅い（分〜時間）",
                  "高い（UI変更で壊れやすい）",
                  "Selenium/Playwright等。テスト環境にデプロイしてから実行",
                ],
              },
              {
                label: "負荷テスト",
                values: [
                  "システム全体のスループット・レイテンシ・スケーラビリティ",
                  "遅い（時間単位）",
                  "中程度",
                  "Cloud Run上でLocust/k6を実行。Cloud Monitoringでメトリクス収集",
                ],
              },
              {
                label: "カオスエンジニアリング",
                values: [
                  "システムの障害耐性（ランダムな障害注入）",
                  "遅い（実験設計・実行・分析で日単位）",
                  "高い（専用フレームワーク・役割が必要）",
                  "GKEでChaos MonkeyまたはLitmus Chaosを実行",
                ],
              },
            ],
            footnote:
              "Googleのテストピラミッド：ユニットテストを最多（70%）、統合テストを中程度（20%）、E2Eテストを最小（10%）とすることでテストの実行速度と信頼性のバランスを最適化する。",
          },
          {
            type: "text",
            markdown: `## Google Testing Pyramidの思想と実装

### テストピラミッドの基本原則

\`\`\`
         /\\
        /E2E\\      少数（遅い・脆い・高コスト）
       /------\\
      /Integration\\ 中程度（適度な数）
     /------------\\
    /  Unit Tests  \\ 多数（速い・安定・低コスト）
   /________________\\
\`\`\`

**ユニットテストを充実させる理由：**
- CIで数分以内に完了（フィードバックが速い）
- 問題箇所が明確（モックで外部依存を排除しているため）
- リファクタリングを安全に行える

### Cloud Buildでのテスト並列化

\`\`\`yaml
steps:
  - name: 'python:3.11'
    id: 'unit-test'
    waitFor: ['-']      # 並列開始
    args: ['python', '-m', 'pytest', 'tests/unit/']

  - name: 'python:3.11'
    id: 'lint'
    waitFor: ['-']      # 並列開始
    args: ['python', '-m', 'flake8', 'src/']

  # 両方完了後にビルド開始
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build'
    waitFor: ['unit-test', 'lint']
    args: ['build', '-t', 'IMAGE:TAG', '.']
\`\`\`
`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "コンテナイメージのスキャンとBinary Authorization",
            content: `**Artifact Analysis（コンテナ脆弱性スキャン）：**
- Artifact Registryへのプッシュ時に自動スキャン実行
- CVE（共通脆弱性識別子）データベースと照合
- 重大度：CRITICAL/HIGH/MEDIUM/LOW/MINIMALで分類
- Container Scanning APIを有効化することで機能する

**Binary Authorization（デプロイポリシー）：**
フロー：
Cloud Build → Attestor（署名）→ Artifact Registry
→ GKE/Cloud Run → Binary Authorizationが確認
→ 署名されたイメージのみデプロイ許可、未署名はブロック

**試験での判断：**
「セキュリティスキャンを通過したイメージのみデプロイしたい」
→ Artifact Analysis + Binary Authorization の組み合わせが正解
「本番環境で未テストのイメージが誤ってデプロイされるのを防ぎたい」
→ Binary Authorization（Attestorによる署名検証）`,
          },
        ],
      },
    ],
  },
  {
    id: "pcd-gcp-integration",
    certId: "pcd",
    domainName: "GCPサービス統合とデータ設計",
    title: "GCPサービス統合とデータ設計",
    description:
      "Cloud Runの高度な設定・チューニング、Cloud Firestoreのデータモデル設計、APIゲートウェイサービスの選択基準、Secret Managerを使ったセキュアな認証情報管理を実践的に学習します。",
    estimatedMinutes: 95,
    difficulty: "advanced",
    prerequisites: ["pcd-app-design", "pcd-cicd"],
    relatedLabIds: ["lab-cloud-run-advanced", "lab-firestore", "lab-api-gateway", "lab-secret-manager"],
    sections: [
      {
        id: "pcd-integration-s1",
        title: "Cloud Run の詳細設定",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "text",
            markdown: `## Cloud Run チューニングガイド：コールドスタート・同時実行・CPU割り当て・min-instances

### コールドスタートとは

Cloud Runはリクエストがない場合にインスタンス数をゼロにスケールダウンする。リクエストが来た際にインスタンスを起動する時間が「コールドスタートレイテンシ」。

\`\`\`
コールドスタートの流れ：
リクエスト到着 → コンテナイメージのPull（初回のみ）
→ コンテナ起動 → アプリケーション初期化 → レスポンス返却
\`\`\`

### コールドスタート対策

| 対策 | 効果 | コスト |
|---|---|---|
| min-instances設定 | 常時ウォームインスタンスを維持。コールドスタートゼロ | CPU/メモリ料金が発生 |
| コンテナイメージの軽量化 | イメージPull時間の短縮 | 開発コスト |
| アプリ初期化の最適化 | 起動スクリプトの最適化 | 開発コスト |
| CPU常時割り当て | idle時もCPUを割り当て | CPU料金増加 |

### 同時実行（Concurrency）設定

\`\`\`
concurrency=1（デフォルト Cloud Functions的な動作）:
リクエストA → Instance-1、リクエストB → Instance-2（新起動）
→ インスタンス数 = アクティブリクエスト数

concurrency=80（推奨、Node.js/Go等の非同期言語）:
リクエストA,B,C...Z → Instance-1（80リクエストまで並列処理）
→ インスタンス数が大幅削減、コールドスタート機会も減少
\`\`\`

### CPU割り当て設定

\`\`\`bash
# リクエスト処理中のみCPU割り当て（デフォルト）
gcloud run deploy my-service --no-cpu-throttling=false

# 常にCPUを割り当て（always-on CPU）
# バックグラウンドタスクの実行が可能
gcloud run deploy my-service --no-cpu-throttling
\`\`\`
`,
          },
          {
            type: "concept_card",
            term: "Cloud Runの主要コンセプト：Revision / Traffic / Service",
            definition:
              "Cloud RunのService（サービス）はデプロイの単位で、個々のデプロイはRevision（リビジョン）として記録される。Trafficはリビジョンに対するトラフィック割り当てを定義し、カナリアリリースやBlue-Greenデプロイを実現する。",
            useCases: [
              "新しいコードをデプロイするたびに新しいRevisionが自動作成される",
              "TrafficをRevision間で分割してCanaryリリースを実現（5%→新版, 95%→旧版）",
              "Revisionにタグを付けてテスト用URLでプロダクションに影響せずテスト",
              "問題が発覚した際に前のRevisionにトラフィックを100%戻してロールバック",
              "min-instances設定をRevisionレベルで制御してコストを最適化",
            ],
            characteristics: [
              "Service: Cloud Runサービスの設定全体を管理するリソース（URL・IAM・設定を包括）",
              "Revision: Serviceのある時点のスナップショット（コンテナイメージ+設定の組み合わせ）、イミュータブル",
              "Traffic: 各Revisionへのトラフィック割り当て（合計100%になるよう設定）",
              "デフォルト動作：新デプロイ時に最新Revisionに100%トラフィックが自動移行",
              "タグ（tag）: Revisionに名前を付けてhttps://TAG---SERVICE-URL.a.run.appでアクセス可能",
            ],
            examRelevance:
              "「前のバージョンにロールバックしたい」→ 以前のRevisionにトラフィックを移動するだけ（再デプロイ不要）。Revisionはイミュータブルなため、設定変更は常に新Revisionとして記録され変更履歴が残る。",
          },
          {
            type: "code_example",
            language: "bash",
            title: "gcloud run deploy 主要フラグ一覧",
            code: `# Cloud Run デプロイの主要フラグ一覧
gcloud run deploy my-service \\
  --image=asia-northeast1-docker.pkg.dev/PROJECT/REPO/my-service:v1.2.3 \\
  --region=asia-northeast1 \\
  --platform=managed \\
  # --- スケーリング設定 ---
  --min-instances=1 \\           # コールドスタート防止
  --max-instances=100 \\         # 最大インスタンス数
  --concurrency=80 \\            # 1インスタンスの同時リクエスト数
  # --- リソース設定 ---
  --cpu=2 \\
  --memory=512Mi \\
  --timeout=3600 \\
  # --- CPU割り当て ---
  --no-cpu-throttling \\         # リクエスト外でもCPUを割り当て
  # --- アクセス制御 ---
  --no-allow-unauthenticated \\  # IAM認証必須
  # --- ネットワーク ---
  --vpc-connector=my-connector \\
  --vpc-egress=private-ranges-only \\
  # --- Secret Manager統合 ---
  --set-secrets=DB_PASSWORD=db-password:latest \\   # 環境変数として注入
  --set-secrets=/secrets/api-key=api-key:latest \\  # ボリュームマウント
  # --- 環境変数 ---
  --set-env-vars=ENV=production,LOG_LEVEL=info \\
  # --- サービスアカウント ---
  --service-account=my-sa@PROJECT.iam.gserviceaccount.com \\
  # --- トラフィック ---
  --no-traffic                  # デプロイするが0%（Canary開始前の準備）`,
            explanation:
              "--vpc-egressをall-traffic（全通信をVPC経由）かprivate-ranges-only（プライベートIPのみVPC経由）で設定できる。Serverless VPC Access Connectorが必要。Secret Managerは環境変数またはボリュームマウントで注入できる。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "Cloud Run vs GKEの選択基準",
            content: `**Cloud Runを選ぶべき場合：**
- HTTP/HTTPSリクエストドリブンな処理（API・Webhook等）
- インフラ管理の負担をゼロにしたい（Kubernetesを使いたくない）
- 利用量に応じた従量課金（ゼロスケールでコスト削減）
- シンプルなマイクロサービス

**GKEを選ぶべき場合（Cloud Runが不適なケース）：**
- TCP/UDP等のHTTP以外のプロトコルが必要
- ステートフルなWorkload（StatefulSet）
- カスタムHWアクセラレーター（GPU/TPU）が必要
- Kubernetesエコシステム（Helm/Operator等）を活用したい
- 長時間実行プロセス（1時間以上）

**試験でのクイック判断：**
- 「コンテナをシンプルにデプロイ、スケーリング自動化」→ Cloud Run
- 「Kubernetesの柔軟性・カスタマイズ性が必要」→ GKE
- 「GPUが必要な機械学習ワークロード」→ GKE
- 「インフラ管理なしでKubernetes相当の機能」→ GKE Autopilot`,
          },
        ],
      },
      {
        id: "pcd-integration-s2",
        title: "Cloud Firestoreのデータ設計",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "text",
            markdown: `## コレクション/ドキュメント/サブコレクション設計と非正規化の考え方

### Firestoreのデータモデル

\`\`\`
/users/{userId}              コレクション/ドキュメント
  name: "田中太郎"
  email: "tanaka@example.com"
  createdAt: Timestamp

  /orders/{orderId}          サブコレクション
    total: 5000
    status: "delivered"
\`\`\`

### 非正規化（Denormalization）の考え方

RDBと異なり、Firestoreでは**JOINができない**ため、クエリに必要なデータを1つのドキュメントに重複して持たせることが一般的。

\`\`\`javascript
// NG: 正規化（RDB的思考）
// orderドキュメントにuserIdしか持たない → ユーザー名表示に2回クエリが必要
{ orderId: "order-001", userId: "user-123", total: 5000 }

// OK: 非正規化（Firestore推奨）
// 注文表示に必要なユーザー情報をorderドキュメントにコピー
{
  orderId: "order-001",
  userId: "user-123",
  userName: "田中太郎",   // 非正規化（冗長データ）
  total: 5000
}
// デメリット: ユーザー名変更時に全orderドキュメントを更新が必要
\`\`\`

### クエリ制限と設計への影響

| Firestoreの制約 | 設計パターン |
|---|---|
| OR/NOT条件が限定的（IN は最大10要素） | 複数クエリをクライアントでマージ |
| 不等式フィルタは同じフィールドにしか使えない | 複合インデックスで対応 |
| コレクションクエリはサブコレクション跨ぎ不可 | コレクショングループクエリを使用 |
`,
          },
          {
            type: "comparison_table",
            title: "Firestoreのクエリ制限 vs 非正規化のトレードオフ",
            headers: ["設計アプローチ", "メリット", "デメリット", "適切なシナリオ"],
            rows: [
              {
                label: "完全正規化",
                values: [
                  "データの一貫性（変更箇所が1か所）、ストレージ効率が良い",
                  "複数コレクションへのクエリが必要（Firestoreでは困難）。読み取りコストが増加",
                  "データ変更が頻繁でRead頻度が低い管理者向けダッシュボード",
                ],
              },
              {
                label: "部分的非正規化（推奨）",
                values: [
                  "よく使う表示用データを1ドキュメントに集約して読み取りが効率化",
                  "更新時に複数ドキュメントの変更が必要（バッチ書き込みで対応）",
                  "ユーザーフィード表示・注文一覧等の高頻度Read操作",
                ],
                highlight: true,
              },
              {
                label: "完全非正規化",
                values: [
                  "常に単一ドキュメントで必要なデータが揃う",
                  "データの不整合リスク、ストレージ使用量増加",
                  "アーカイブデータ・ログデータ等の変更がないデータ",
                ],
              },
              {
                label: "コレクショングループクエリ",
                values: [
                  "全てのサブコレクションを横断検索可能",
                  "適切なインデックス設計が必須。読み取りコストが増加",
                  "複数ユーザーの注文一覧・全チャットルームのメッセージ検索",
                ],
              },
            ],
            footnote:
              "Firestoreの読み取りはドキュメント単位で課金。1クエリで1ドキュメントを返すのが最も効率的。表示に必要なデータのみを持つ「軽いドキュメント」の設計が重要。",
          },
          {
            type: "concept_card",
            term: "FieldValue.increment / arrayUnion / arrayRemoveのアトミック操作",
            definition:
              "Firestoreのアトミック操作はread-modify-writeを1回のAPIコールで実行し、複数クライアントが同時に同じドキュメントを更新する際の競合状態（Race Condition）を防ぐ特殊なフィールド値。",
            useCases: [
              "FieldValue.increment(1): ビュー数・いいね数のカウンターを競合なしにインクリメント",
              "FieldValue.increment(-stock): 在庫数の減算（複数ユーザーが同時に購入しても整合性を保つ）",
              "arrayUnion(['tag1']): 配列に重複なしで要素を追加（タグ追加・フォロワーリスト更新）",
              "arrayRemove(['tag1']): 配列から指定要素を削除（タグ削除・フォロワー解除）",
              "serverTimestamp(): サーバー側のタイムスタンプを挿入（クライアント時計ズレを排除）",
            ],
            characteristics: [
              "transactionのwrite操作と組み合わせることでより複雑なアトミック操作が可能",
              "increment/decrement操作は数値のみ対応。上限/下限チェックにはTransactionが必要",
              "arrayUnion/arrayRemoveはFirestore内部でアトミックに処理されるため競合がない",
              "大量書き込み（カウンターの高頻度更新）には1秒あたり1ドキュメント更新の制限に注意",
              "高頻度カウンターにはDistributed Counter（複数ドキュメントに分散して集計）パターンを使用",
            ],
            examRelevance:
              "「複数ユーザーが同時に購入したとき在庫が正しく減算されるか」という競合状態の問題でFieldValue.increment + TransactionまたはDistributed Counterが正解になる問題が頻出。",
          },
          {
            type: "key_point",
            level: "warning",
            title: "Cloud Datastore（旧）vs Firestore Native Modeの違い",
            content: `**Firestore Native Mode（推奨・新規採用）：**
- リアルタイムリスナーをサポート（onSnapshot）
- モバイル/Webクライアントからの直接接続対応
- コレクション/ドキュメントモデル
- 新規プロジェクトではNative Modeのみ選択可能

**Datastore Mode（旧Cloud Datastore互換）：**
- リアルタイムリスナー不可
- サーバーサイドアクセスのみ
- 既存のCloud DatastoreアプリをFirestoreに移行する際の互換モード

**試験での重要な制限：**
- プロジェクトごとに1つのFirestoreデータベースのみ
- ロケーション設定後は変更不可
- BigQueryへのエクスポートはBigQuery Data Transfer Serviceまたはイベントパイプライン経由

**移行の方向性：**
Cloud Datastore → Firestore（Datastoreモード）→ Firestore（Native Mode）
移行はワンウェイ（後戻り不可）のため設計時点での判断が重要`,
          },
        ],
      },
      {
        id: "pcd-integration-s3",
        title: "API設計とゲートウェイ",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "Cloud Endpoints / API Gateway / Apigee の比較",
            headers: ["比較項目", "Cloud Endpoints", "API Gateway", "Apigee"],
            rows: [
              {
                label: "機能",
                values: [
                  "認証（API Key/JWT）、ロギング、モニタリング。OpenAPI/gRPC対応",
                  "Cloud RunやCloud Functions向けの軽量マネージドゲートウェイ。OpenAPI 2.0対応",
                  "フルスペックAPIマネジメント（流量制限/開発者ポータル/分析/収益化/高度な変換）",
                ],
                highlight: true,
              },
              {
                label: "スケール",
                values: [
                  "小〜中規模（Cloud Run/GKEバックエンド向け）",
                  "サーバーレスバックエンド向け。自動スケール",
                  "エンタープライズ規模（数百万RPSまで対応）",
                ],
              },
              {
                label: "コスト",
                values: [
                  "Cloud Endpoints自体は無料（背後のCompute/Cloud Runのコストのみ）",
                  "API呼び出し数に応じた料金（1Mコール単位）",
                  "高コスト（エンタープライズライセンス）。大規模API管理には費用対効果が高い",
                ],
              },
              {
                label: "ユースケース",
                values: [
                  "内部マイクロサービス間のAPI管理。gRPCのトランスコーディング（gRPC→REST変換）",
                  "Cloud Run/Functionsで構築したAPIの簡易的なゲートウェイ。モバイルバックエンド",
                  "外部公開API（パートナー連携）、マネタイズAPI、開発者エコシステムの構築",
                ],
                highlight: true,
              },
              {
                label: "開発者ポータル",
                values: [
                  "なし（Cloud Consoleのみ）",
                  "なし（基本的な管理コンソールのみ）",
                  "あり（外部開発者向けドキュメント・API管理ポータル）",
                ],
              },
              {
                label: "変換・メディエーション",
                values: [
                  "基本的な変換のみ（主にプロキシ機能）",
                  "簡易なリクエスト変換",
                  "高度な変換（SOAP→REST、XMLからJSON変換、Groovyスクリプトポリシー）",
                ],
              },
            ],
            footnote:
              "選択の核心：「シンプルな認証・ロギング」→ Cloud EndpointsまたはAPI Gateway、「外部パートナー向けAPI管理・開発者ポータル・収益化」→ Apigee。",
          },
          {
            type: "text",
            markdown: `## OpenAPI仕様とCloud Endpointsの設定方法

### OpenAPI仕様（OAS）の基本構造

\`\`\`yaml
# openapi.yaml
swagger: "2.0"
info:
  title: My API
  version: "1.0"
host: "my-api-abc123-uc.a.run.app"
x-google-backend:
  address: "https://my-backend-service-abc123-uc.a.run.app"
schemes:
  - "https"
securityDefinitions:
  api_key:
    type: "apiKey"
    name: "key"
    in: "query"
  firebase:
    authorizationUrl: ""
    flow: "implicit"
    type: "oauth2"
    x-google-issuer: "https://securetoken.google.com/PROJECT_ID"
    x-google-jwks_uri: "https://www.googleapis.com/service_accounts/v1/jwk/..."
paths:
  /users:
    get:
      operationId: "getUsers"
      security:
        - api_key: []
      responses:
        "200":
          description: "成功"
\`\`\`

### Cloud Endpointsのデプロイ手順

\`\`\`bash
# 1. OpenAPI仕様のデプロイ
gcloud endpoints services deploy openapi.yaml

# 2. ESP v2をCloud Runと組み合わせる
gcloud run deploy my-api-gateway \\
  --image=gcr.io/endpoints-release/endpoints-runtime-serverless:2 \\
  --set-env-vars="ENDPOINTS_SERVICE_NAME=my-api-abc123-uc.a.run.app" \\
  --region=asia-northeast1

# 3. API Keyの作成
gcloud alpha services api-keys create \\
  --display-name="My App API Key" \\
  --api-target=service=my-api-abc123-uc.a.run.app
\`\`\`
`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験でApigeeが正解になるケース",
            content: `**Apigeeが正解になる典型的な要件：**

1. **外部開発者向けAPIの公開**
   「外部パートナーにAPIを公開し、ドキュメント・SDKを提供したい」
   → Apigee（開発者ポータル機能）

2. **APIの収益化（Monetization）**
   「APIの利用量に応じて請求したい、APIを売りたい」
   → Apigee（課金・収益化機能）

3. **レガシーSOAPをREST APIとして公開**
   「既存のSOAPサービスをモバイルアプリ向けにREST化したい」
   → Apigee（SOAPからRESTへの変換ポリシー）

4. **大規模API Management**
   「数百のAPIエンドポイントを統合管理したい」
   → Apigee（エンタープライズ規模のAPI管理）

**Cloud EndpointsとAPI Gatewayが正解になるケース：**
- 「Cloud RunのAPIにAPI Keyで認証を追加したい」→ API Gateway
- 「GKEのgRPCサービスをREST APIとして公開したい」→ Cloud Endpoints（gRPCトランスコーディング）
- 「社内マイクロサービスのAPI管理」→ Cloud Endpoints（コストが低い）`,
          },
        ],
      },
      {
        id: "pcd-integration-s4",
        title: "Secret Managerとセキュリティベストプラクティス",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "Secret Manager vs 環境変数 vs Cloud Storage の比較",
            definition:
              "アプリケーションで使用する認証情報・APIキー・データベースパスワードの管理方法として、Secret Manager・環境変数・Cloud Storageの3つが選択肢として挙げられるが、それぞれ適切な用途が異なる。Secret Managerが機密情報の管理において最も推奨される。",
            useCases: [
              "Secret Manager: データベースパスワード・APIキー・OAuth2クライアントシークレット等の機密情報の安全な保管と配信",
              "Secret Manager: バージョン管理によるシークレットのローテーション（旧バージョンと新バージョンの並行運用）",
              "Secret Manager: IAMによる細かなアクセス制御（特定のCloud RunサービスのSAにのみアクセス許可）",
              "環境変数: 非機密の設定値（ログレベル・機能フラグ・エンドポイントURL等）",
              "Cloud Storage: 設定ファイル（JSON/YAML等）の保管。機密情報には暗号化を別途実装が必要",
            ],
            characteristics: [
              "Secret Managerのバージョン管理：新バージョン追加後も古いバージョンは無効化するまでアクセス可能",
              "自動ローテーション：Secret ManagerはCloud FunctionsとPub/Subを使った自動ローテーションをサポート",
              "CMEK（Customer Managed Encryption Keys）：Cloud KMSキーでシークレットを暗号化",
              "Secret Managerのアクセス監査：Data Access Audit Logで誰がいつシークレットにアクセスしたかを記録",
              "環境変数はコンテナのinspectコマンドや一部のログで露出するリスクがあり機密情報に不適切",
            ],
            examRelevance:
              "「APIキーを安全に管理したい」→ Secret Manager一択。「Cloud Runで使う」→ 環境変数インジェクションまたはボリュームマウントで注入。「コードにシークレットをハードコードしている」→ 問題のある設計でSecret Managerへの移行が正解。",
          },
          {
            type: "code_example",
            language: "python",
            title: "Cloud Runでのシークレットマウント方法",
            code: `# 方法1: 環境変数としてSecret Managerのシークレットを注入
# (gcloud run deploy --set-secrets=DB_PASSWORD=db-password:latest で設定)
import os

db_password = os.environ.get("DB_PASSWORD")

# 方法2: ボリュームマウントでファイルとして注入
# (--set-secrets=/secrets/db-password=db-password:latest で設定)
with open("/secrets/db-password", "r") as f:
    db_password = f.read().strip()

# 方法3: Python SDK でコードから直接取得
# （最も柔軟だがlatency増・依存関係が必要）
from google.cloud import secretmanager

def get_secret(project_id: str, secret_id: str, version: str = "latest") -> str:
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

# 起動時に一度だけ取得してキャッシュ（毎リクエストで呼ばないこと）
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT")
DB_PASSWORD = get_secret(PROJECT_ID, "db-password")  # 起動時のみ

# シークレットのバージョン管理（ローテーション例）
def rotate_secret(project_id: str, secret_id: str, new_value: str):
    client = secretmanager.SecretManagerServiceClient()
    parent = f"projects/{project_id}/secrets/{secret_id}"
    payload = new_value.encode("UTF-8")
    response = client.add_secret_version(
        request={"parent": parent, "payload": {"data": payload}}
    )
    print(f"新バージョン追加: {response.name}")
    return response.name`,
            explanation:
              "本番では方法1（環境変数インジェクション）または方法2（ボリュームマウント）が推奨。方法3（SDK直接取得）はシークレット取得のlatencyが発生するため、起動時に一度取得してメモリにキャッシュすること。毎リクエストでSecret Manager APIを呼ぶと遅延増加・コスト増加の原因になる。",
          },
          {
            type: "key_point",
            level: "common_mistake",
            title: "開発者がやりがちな認証情報の扱いミスTop5",
            content: `**やりがちな認証情報ミスと対策：**

1. **Gitリポジトリへのシークレットコミット**
   - NG: APIキーやパスワードを.envファイルや設定ファイルにハードコードしてコミット
   - 対策: .gitignoreに.envを追加、git-secretsやgitleaks等のPre-commitフックを導入
   - 万が一コミットしたら: gitの履歴から完全削除 + シークレットを即座にローテーション

2. **Cloud StorageバケットをパブリックにしてAPIキーを配置**
   - NG: バケットをallUsersに公開してconfig.jsonを配置
   - 対策: バケットはプライベート設定 + Secret Managerへ移行

3. **サービスアカウントキーファイル（JSON）の使用**
   - NG: SA JSONキーをコードリポジトリや環境変数に配置
   - 対策: Workload Identity（GKE）またはSAメタデータサーバー（GCE/Cloud Run）を使用
   - Organization Policyでconstraints/iam.disableServiceAccountKeyCreationを強制

4. **環境変数で機密情報を設定**
   - NG: --set-env-vars=DB_PASSWORD=mysecretpass（コンソールに平文表示される）
   - 対策: --set-secrets でSecret Managerから注入（コンソールに値が表示されない）

5. **開発・本番で同じシークレットを使い回し**
   - NG: 全環境で同一DBパスワードを使用
   - 対策: 環境ごとに別のシークレットを作成（db-password-dev / db-password-prod）
   - Secret ManagerのIAMで環境ごとのSAにのみアクセス許可`,
          },
        ],
      },
    ],
  },
]
