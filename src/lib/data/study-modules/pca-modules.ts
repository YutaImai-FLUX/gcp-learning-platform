import type { StudyModule } from "@/lib/types/study-module"

export const PCA_MODULES: StudyModule[] = [
  {
    id: "pca-reliability",
    certId: "pca",
    domainName: "高可用性・信頼性設計",
    title: "高可用性・災害復旧設計",
    description:
      "GCPプロフェッショナルクラウドアーキテクトとして必須の高可用性・DR（災害復旧）設計を体系的に学習します。SLO/SLI/SLAの定義、DR戦略の4段階、Cloud SQLのHA、マルチリージョン設計まで網羅します。",
    estimatedMinutes: 90,
    difficulty: "advanced",
    prerequisites: ["ace-compute", "ace-storage"],
    relatedLabIds: ["lab-ha-cloudsql", "lab-dr-runbook", "lab-multi-region"],
    sections: [
      {
        id: "pca-rel-s1",
        title: "SLO/SLI/SLAの定義",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "SLI（Service Level Indicator）/ SLO（Objective）/ SLA（Agreement）",
            definition:
              "サービスの信頼性・品質を定量化するための指標体系。SLIは測定値、SLOは目標値、SLAは契約上の約束を表す。Google SREの中核概念であり、PCA試験で必須知識。",
            useCases: [
              "SLI：可用性（成功レスポンス数/総リクエスト数）・レイテンシ（95パーセンタイル応答時間）・スループット",
              "SLO：「99.9%の可用性を30日間ローリングウィンドウで達成」という内部目標",
              "SLA：「99.5%を下回った場合、クレジットを返還する」という顧客との契約",
              "Error Budget：1 - SLO（例：SLO 99.9% → Error Budget 0.1% = 月43分）",
            ],
            characteristics: [
              "SLI → SLO → SLA の順で値は緩くなる（SLO < SLA < SLI実測値が理想）",
              "Error Budgetを使い切るとリリースを凍結してシステム安定化に注力する",
              "Google Cloud Monitoring・SLO Monitoringで自動的にSLO違反を検出・アラート",
              "VALET（Volume/Availability/Latency/Error/Tickets）フレームワークでSLIを体系化",
              "依存サービスのSLAを考慮したSLO設定が重要（例：外部DBのSLA 99.9%→自サービスSLOは99.5%以下に）",
            ],
            examRelevance:
              "PCA試験ではSLIの適切な定義・Error Budgetの計算・SLOに基づいたアーキテクチャ設計が問われる。「月間のダウンタイム許容量」を計算できるようにすること。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "SLO・Error Budget計算の試験ポイント",
            content: `可用性とダウンタイムの換算表（必須暗記）：

| 可用性 | 年間ダウンタイム | 月間ダウンタイム | 週間ダウンタイム |
|---|---|---|---|
| 99% | 87.6時間 | 7.3時間 | 1.68時間 |
| 99.9%（"3ナイン"） | 8.76時間 | 43.8分 | 10.1分 |
| 99.95% | 4.38時間 | 21.9分 | 5.05分 |
| 99.99%（"4ナイン"） | 52.56分 | 4.38分 | 1.01分 |
| 99.999%（"5ナイン"） | 5.26分 | 26.3秒 | 6.05秒 |

**Error Budget計算例**：SLO 99.9%、30日間
- Error Budget = 30日 × 24時間 × 60分 × 0.1% = **43.2分**
- この43.2分の範囲内でリリース・メンテナンスを計画する`,
          },
        ],
      },
      {
        id: "pca-rel-s2",
        title: "DR戦略4段階",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "DR戦略4段階のRPO/RTO/コスト比較",
            headers: ["戦略", "RPO（目標復旧時点）", "RTO（目標復旧時間）", "コスト", "GCP実装サービス", "適用シナリオ"],
            rows: [
              {
                label: "Backup & Restore（コールドスタンバイ）",
                values: [
                  "時間〜日単位（バックアップ頻度による）",
                  "時間〜日単位（バックアップ復元時間）",
                  "最低（バックアップストレージのみ）",
                  "Cloud Storage（Coldline/Archive）+ Cloud SQL Backups",
                  "RPO/RTOが長くても許容できる非クリティカルシステム",
                ],
              },
              {
                label: "Pilot Light（最小限稼働）",
                values: [
                  "分〜時間単位",
                  "10分〜数時間（インフラ起動時間）",
                  "低（最小構成のリソースを常時起動）",
                  "Cloud SQL（最小インスタンス）+ Terraform（IaC）+ Snapshot",
                  "復旧に少し時間がかかってもコスト重視",
                ],
                highlight: false,
              },
              {
                label: "Warm Standby（ウォームスタンバイ）",
                values: [
                  "秒〜分単位",
                  "分単位（スケールアップ時間）",
                  "中（縮小版の本番環境を常時稼働）",
                  "Cloud SQL HA（リードレプリカ）+ GKE（最小ノード）+ リージョンMIG",
                  "一定のRTO/RPO要件・コストバランスを取りたい",
                ],
                highlight: true,
              },
              {
                label: "Hot Standby / Multi-Site（アクティブ-アクティブ）",
                values: [
                  "ほぼ0（リアルタイム同期）",
                  "秒〜分単位（ヘルスチェック切り替え）",
                  "最高（フル構成を複数リージョンで常時稼働）",
                  "Cloud Spanner（グローバル分散）+ グローバルHTTPS LB + マルチリージョンGKE",
                  "金融・ゲーム・Eコマース・ミッションクリティカル",
                ],
                highlight: true,
              },
            ],
            footnote:
              "コストとRPO/RTOはトレードオフ。試験ではビジネス要件（RPO/RTO目標値）から適切な戦略を選択する問題が出題される。",
          },
          {
            type: "text",
            markdown: `## 各DR戦略のGCP実装サービス詳細

### Backup & Restore の実装
- **Cloud SQL**：自動バックアップ（日次）+ Point-in-Time Recovery（PITR）で分単位の復旧点指定
- **GCE**：ディスクスナップショット（Scheduled Snapshot Policy）を別リージョンに保存
- **Cloud Storage**：Cross-region replication（マルチリージョンバケット）でデータをレプリケート
- **Terraform/Cloud Deployment Manager**：インフラをコードで定義して素早く再構築

### Warm Standby の実装
- **Cloud SQL HA**：同一リージョン内でスタンバイインスタンスを常時起動（フェイルオーバー: 1〜2分）
- **リードレプリカ**：読み取りをレプリカに分散しつつDRにも活用（昇格時間: 数分）
- **GKEクラスタ**：DRリージョンに縮小版クラスタを維持（スケールアップで本番相当に）

### Hot Standby の実装
- **Cloud Spanner**：マルチリージョン構成でRPO=0の外部整合性（自動フェイルオーバー）
- **グローバルHTTPS LB**：複数リージョンのバックエンドをAnycasting IPで統合
- **Firestore**：マルチリージョンモードで自動的にデータをレプリケート`,
          },
        ],
      },
      {
        id: "pca-rel-s3",
        title: "Cloud SQLのHA設計",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud SQL HA（高可用性）構成",
            definition:
              "Cloud SQLのHA構成は同一リージョン内の別ゾーンにスタンバイインスタンスを配置し、プライマリ障害時に自動フェイルオーバーする仕組み。Cloud SQL Enterprise PlusではSLA 99.99%を提供。",
            useCases: [
              "本番WebアプリのデータベースでゾーンレベルのSLAが必要",
              "定期メンテナンス中のダウンタイムを最小化（計画的フェイルオーバー）",
              "Cloud SQL Enterprise Plusで99.99% SLA + Near-Zero Downtime Maintenanceを達成",
            ],
            characteristics: [
              "プライマリとスタンバイは同一リージョンの別ゾーンに配置",
              "プライマリのディスクへの書き込みはスタンバイに同期レプリケーション",
              "フェイルオーバー時間：通常60秒以内（Enterprise Plus: 10秒以内）",
              "HA構成は通常の約2倍のコスト（スタンバイインスタンス料金が加算）",
              "リードレプリカはHA構成とは別概念（読み取りスケールアウト + DR用）",
            ],
            examRelevance:
              "「Cloud SQLでゾーン障害に対応したい」→ HA構成。「読み取りパフォーマンスを向上させたい」→ リードレプリカ。「リージョン障害に対応したい」→ 別リージョンにリードレプリカ（手動昇格が必要）。",
          },
          {
            type: "code_example",
            language: "bash",
            title: "Cloud SQL HA構成の作成と管理",
            code: `# HA構成のCloud SQLインスタンス作成（MySQL）
gcloud sql instances create prod-db \\
  --database-version=MYSQL_8_0 \\
  --tier=db-n1-standard-4 \\
  --region=asia-northeast1 \\
  --availability-type=REGIONAL \\
  --backup-start-time=03:00 \\
  --enable-bin-log \\
  --retained-backups-count=7 \\
  --retained-transaction-log-days=7

# Point-in-Time Recovery（PITR）の有効化確認
gcloud sql instances describe prod-db \\
  --format="json(settings.backupConfiguration)"

# リードレプリカの作成（同一リージョン）
gcloud sql instances create prod-db-replica \\
  --master-instance-name=prod-db \\
  --region=asia-northeast1

# 別リージョンへのリードレプリカ（DR用）
gcloud sql instances create prod-db-dr-replica \\
  --master-instance-name=prod-db \\
  --region=us-central1

# リードレプリカの昇格（DRシナリオ）
gcloud sql instances promote-replica prod-db-dr-replica

# フェイルオーバーのテスト（計画的フェイルオーバー）
gcloud sql instances failover prod-db`,
            explanation:
              "PITRにはbinary logging（MySQL）またはWAL（PostgreSQL）の有効化が必要。--enable-bin-logまたはPGのデフォルト設定で対応。バックアップは同一リージョムに保存されるため、リージョン障害対策には手動でバックアップをGCSに保存することを検討。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "Cloud SQL HA・フェイルオーバーの試験ポイント",
            content: `Cloud SQL信頼性設計の重要ポイント：

1. **HA構成（availability-type=REGIONAL）** = 同一リージョン内のゾーン障害に対応
2. **リードレプリカ** = 読み取り性能向上 + DR用（昇格には手動操作が必要）
3. **クロスリージョンリードレプリカ** = リージョン障害対応（RPO: 秒〜分、手動昇格でRTO: 数分）
4. **PITR（Point-in-Time Recovery）** = 論理的なデータ破損・誤削除への対応（バックアップ内の任意時点に復元）
5. HA構成のコストは**通常の約2倍**。コスト最適化問題では開発環境は非HA推奨`,
          },
        ],
      },
      {
        id: "pca-rel-s4",
        title: "マルチリージョン設計",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "text",
            markdown: `## Active-Active vs Active-Passive マルチリージョン設計

### Active-Active（アクティブ-アクティブ）
全リージョンが本番トラフィックを処理する構成。最高の可用性とパフォーマンスを提供するが、コストと設計複雑度が最も高い。

**特徴：**
- 全リージョンが100%のキャパシティで稼働
- グローバルロードバランサーがジオロケーション・レイテンシベースでトラフィックを分散
- データの一貫性が最大の課題（分散トランザクション・結果整合性の理解が必要）
- **適用サービス**：Cloud Spanner・Firestore（マルチリージョン）・GCS（マルチリージョン）

### Active-Passive（アクティブ-パッシブ）
1つのリージョンが本番トラフィックを処理し、別リージョンはスタンバイの構成。

**特徴：**
- パッシブリージョンはウォームスタンバイまたはコールドスタンバイ
- フェイルオーバーには切り替え時間が発生（秒〜分単位）
- コストはActive-Activeより低い（パッシブ側は縮小版）
- **適用サービス**：Cloud SQL（クロスリージョンレプリカ）+ グローバルLBによるヘルスチェック切り替え

### マルチリージョン設計のチェックリスト
- [ ] データレイヤーの整合性モデルを定義（強整合性 vs 結果整合性）
- [ ] リージョン間のレイテンシを計測・許容値を定義
- [ ] フェイルオーバーの自動化 vs 手動承認プロセスを定義
- [ ] コスト試算（ネットワーク転送コストを含む）
- [ ] テスト：定期的なDRドリルで実際にフェイルオーバーを試験`,
          },
          {
            type: "comparison_table",
            title: "Active-Active vs Active-Passive 比較",
            headers: ["比較項目", "Active-Active", "Active-Passive（Warm Standby）", "Active-Passive（Cold Standby）"],
            rows: [
              {
                label: "RPO",
                values: ["0（リアルタイム同期）", "秒〜分（非同期レプリカのLag）", "時間〜日（バックアップ頻度）"],
                highlight: true,
              },
              {
                label: "RTO",
                values: ["秒未満（LBが自動切り替え）", "分単位（フェイルオーバー処理）", "時間単位（インフラ起動+復元）"],
                highlight: true,
              },
              {
                label: "コスト",
                values: ["最高（全リージョンがフル稼働）", "中（スタンバイは縮小版）", "低（バックアップコストのみ）"],
              },
              {
                label: "データ一貫性",
                values: ["要設計（分散トランザクション）", "準同期/非同期レプリケーション", "バックアップ時点のみ"],
              },
              {
                label: "適したGCPサービス",
                values: [
                  "Cloud Spanner・Firestore（MR）・GCS（MR）+ グローバルLB",
                  "Cloud SQL（クロスリージョンレプリカ）+ リージョンMIG + グローバルLB",
                  "GCSバックアップ + Terraform（IaC） + Cloud SQL Backup",
                ],
              },
              {
                label: "適用シナリオ",
                values: [
                  "グローバルゲーム・金融取引・SLA 99.99%以上",
                  "Eコマース・SaaS（RTO数分許容）",
                  "バッチ処理・内部ツール・コスト重視",
                ],
              },
            ],
            footnote:
              "グローバルHTTPS LBはAnycasting IPを使用するため、Active-Activeでもユーザーは自動的に最も近いリージョンにルーティングされる。",
          },
        ],
      },
    ],
  },
  {
    id: "pca-architecture",
    certId: "pca",
    domainName: "アーキテクチャ設計フレームワーク",
    title: "アーキテクチャ設計フレームワーク",
    description:
      "Google Cloud Architecture Frameworkの5本柱を体系的に理解し、PCA試験のケーススタディ問題を解くための実践的な設計アプローチとコスト最適化・セキュリティ設計を学習します。",
    estimatedMinutes: 85,
    difficulty: "advanced",
    prerequisites: ["pca-reliability"],
    relatedLabIds: ["lab-architecture-framework", "lab-cost-optimization"],
    sections: [
      {
        id: "pca-arch-s1",
        title: "Google Cloud Architecture Framework 5本柱",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "Google Cloud Architecture Framework",
            definition:
              "Googleが提供するクラウドアーキテクチャ設計のベストプラクティス集。5本の柱（Pillar）で構成され、システムの品質特性を総合的に評価・改善するためのフレームワーク。AWSのWell-Architected Frameworkと類似。",
            useCases: [
              "オペレーショナルエクセレンス：自動化・IaC・CI/CD・障害対応手順の整備",
              "セキュリティ・プライバシー・コンプライアンス：多層防御・最小権限・暗号化・コンプライアンス",
              "信頼性：SLO設定・DR設計・障害分離・ヘルスチェック・自動復旧",
              "コスト最適化：リソースの右サイジング・コミットメント割引・自動スケール・不要リソース削除",
              "パフォーマンス最適化：適切なサービス選択・キャッシュ・CDN・リージョン選択",
            ],
            characteristics: [
              "5つの柱はトレードオフ関係にあることが多い（例：信頼性↑→コスト↑）",
              "Google Cloud Architecture Center（cloud.google.com/architecture）で詳細を参照可能",
              "PCA試験ではケーススタディで複数の柱を横断した設計判断が問われる",
              "特定の柱を優先する場合は他の柱へのトレードオフを明確に説明できる必要がある",
              "各柱には具体的な設計原則とGCPサービスのマッピングが定義されている",
            ],
            examRelevance:
              "PCA試験のケーススタディ（Mountkirk Games・Dress4Win・TerramEarth等）ではFrameworkの各柱を適用して設計判断を行う。要件文から「どの柱が重要か」を読み取ることが鍵。",
          },
          {
            type: "text",
            markdown: `## 5本柱の詳細と主要なGCPサービス・設計パターン

### 1. オペレーショナルエクセレンス
- **IaC（Infrastructure as Code）**：Terraform・Deployment Manager・Config Connector
- **CI/CD**：Cloud Build・Artifact Registry・Cloud Deploy
- **モニタリング・ログ**：Cloud Monitoring・Cloud Logging・Error Reporting・Cloud Trace
- **インシデント対応**：PagerDuty統合・Runbookの自動化・Pub/Sub→Cloud Functionsで自動修復

### 2. セキュリティ・プライバシー・コンプライアンス
- **アイデンティティ**：Cloud Identity・BeyondCorp・Workload Identity Federation
- **データ保護**：CMEK・Cloud DLP・VPC Service Controls
- **ネットワーク**：Cloud Armor・Cloud NAT・Private Google Access・VPC Service Controls
- **コンプライアンス**：Assured Workloads（FedRAMP/HIPAA）・Policy Controller・Security Command Center

### 3. 信頼性
- **マルチゾーン/リージョン**：リージョンMIG・グローバルLB・Cloud Spanner・Firestore MR
- **自動回復**：ヘルスチェック + MIG自動修復・Cloud SQL HA自動フェイルオーバー
- **バックアップ・DR**：Cloud SQL PITR・GCSのCross-region replication・Scheduled Snapshots

### 4. コスト最適化
- **コミットメント**：CUD（1/3年）・Cloud Storage Autoclass・BigQuery定額プラン
- **適切なサイジング**：Recommender・Active Assist・Spot VM/Spot Pod
- **コスト管理**：Cloud Billing Budget Alerts・Cost Table・Billing Export to BigQuery

### 5. パフォーマンス最適化
- **キャッシュ**：Memorystore・Cloud CDN・Firebase Hosting CDN
- **データベース最適化**：BigQueryクラスタリング/パーティション・Cloud Spannerのインデックス
- **グローバル配信**：Cloud CDN・グローバルLB・Cloud Armor（エッジキャッシュ）`,
          },
        ],
      },
      {
        id: "pca-arch-s2",
        title: "ケーススタディ解析アプローチ",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown: `## PCAケーススタディの解析手順

PCA試験には公式のケーススタディ（Mountkirk Games・Dress4Win等）が事前公開されており、これに基づく問題が出題される。

### 解析フレームワーク：BTRACS
1. **B（Business Requirements）**：ビジネス目標を抽出（コスト削減・市場投入速度・グローバル展開等）
2. **T（Technical Requirements）**：技術的要件を抽出（SLO・スケール・レイテンシ・データ保存場所等）
3. **R（Regulations/Compliance）**：規制・コンプライアンス要件（GDPR・HIPAA・PCI DSS等）
4. **A（Architecture/Current State）**：現在のシステム構成と課題を整理
5. **C（Constraints）**：制約事項（移行期間・予算・既存ベンダー契約等）
6. **S（Solutions）**：要件を満たす設計をFrameworkの5本柱で評価

### ケーススタディ典型パターン

| ケース | 主要要件 | 典型的な正解設計 |
|---|---|---|
| グローバルゲーム（Mountkirk Games） | グローバル低レイテンシ・動的スケール・ゲームデータ | GKE Autopilot + Cloud Spanner + グローバルLB |
| オンプレ→クラウド移行（Dress4Win） | リフト&シフト→最適化・コスト削減 | GCE（移行期）→ GKE/Cloud Run（最適化期） |
| IoT/製造（TerramEarth） | 大量センサーデータ・予測保全・グローバル展開 | Pub/Sub + Dataflow + BigQuery + Vertex AI |`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "PCA試験戦略",
            content: `PCA試験の重要戦略：

1. **ケーススタディは事前に熟読**：試験前にcloud.google.com/certification/guides/professional-cloud-architectで公式ケーススタディを熟読する

2. **要件を「柱」に分類**：問題文に「コスト最適化」「高可用性」「コンプライアンス」等のキーワードがあれば対応する柱で考える

3. **トレードオフを理解**：「最もコスト効率が良い」vs「最も高可用性」は異なる答えになることが多い

4. **GCPサービスのSLAを知る**：Cloud Spanner 99.999%・Cloud SQL HA 99.95%・GKE Autopilot 99.95%・GCE 99.99%（同一ゾーン複数インスタンス）

5. **「マネージドサービス優先」の原則**：同等の機能なら自己管理よりGCPマネージドサービスを選ぶ（運用負荷・信頼性の観点）`,
          },
        ],
      },
      {
        id: "pca-arch-s3",
        title: "コスト最適化戦略",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "GCE課金モデルの比較",
            headers: ["課金モデル", "割引率", "コミット期間", "中断リスク", "最適ユースケース"],
            rows: [
              {
                label: "On-demand（従量課金）",
                values: ["なし（基準）", "なし", "なし（いつでも停止可）", "開発・テスト・一時的ワークロード・予測不可能な負荷"],
              },
              {
                label: "Sustained Use Discount（SUD）",
                values: [
                  "最大30%（自動適用）",
                  "なし（月間使用率に応じて自動）",
                  "なし",
                  "月間70%以上稼働するワークロード（自動で適用されるため設定不要）",
                ],
              },
              {
                label: "Committed Use Discount（CUD）1年",
                values: [
                  "最大37%（Resource CUD）/ 最大57%（Flexible CUD）",
                  "1年",
                  "コミット期間中は料金発生（使用しなくても）",
                  "安定した本番ワークロード・予測可能なキャパシティ",
                ],
                highlight: true,
              },
              {
                label: "Committed Use Discount（CUD）3年",
                values: [
                  "最大57%（Resource CUD）/ 最大70%（Flexible CUD）",
                  "3年",
                  "コミット期間中は料金発生",
                  "長期的に安定したワークロード・データベース・コアインフラ",
                ],
                highlight: true,
              },
              {
                label: "Spot VM（旧プリエンプティブル）",
                values: [
                  "最大91%",
                  "なし",
                  "高（30秒警告で停止される可能性）",
                  "バッチ処理・ML学習・CI/CD・フォールトトレラントワークロード",
                ],
              },
            ],
            footnote:
              "CUDとSUDは併用可能（CUD適用後の残りキャパシティにSUDが適用される）。Spot VMはSUDもCUDも対象外。",
          },
          {
            type: "decision_tree",
            title: "コスト最適化のためのVM課金モデル選択",
            rootId: "cost-q1",
            nodes: [
              {
                id: "cost-q1",
                question: "ワークロードは中断されても問題ないか？（チェックポイント可能）",
                yesId: "cost-ans-spot",
                noId: "cost-q2",
              },
              {
                id: "cost-q2",
                question: "ワークロードは長期間（1年以上）安定して稼働するか？",
                yesId: "cost-q3",
                noId: "cost-q4",
              },
              {
                id: "cost-q3",
                question: "3年以上のコミットが可能か？",
                yesId: "cost-ans-cud3",
                noId: "cost-ans-cud1",
              },
              {
                id: "cost-q4",
                question: "月間70%以上の稼働が見込まれるか？",
                yesId: "cost-ans-sud",
                noId: "cost-ans-ondemand",
              },
              {
                id: "cost-ans-spot",
                answer: "Spot VM（最大91%割引）",
                explanation: "バッチ処理・ML学習に最適。中断時にジョブを再実行できる設計が必要",
              },
              {
                id: "cost-ans-cud3",
                answer: "3年CUD（最大70%割引）",
                explanation: "最大の割引率。データベース・コアインフラなど長期安定ワークロードに最適",
              },
              {
                id: "cost-ans-cud1",
                answer: "1年CUD（最大57%割引）",
                explanation: "本番Webアプリ・安定したマイクロサービスに最適。3年ほどのコミットリスクなし",
              },
              {
                id: "cost-ans-sud",
                answer: "SUD（Sustained Use Discount）自動適用",
                explanation: "設定不要で自動的に最大30%割引。毎月の使用率が高い汎用ワークロードに有効",
              },
              {
                id: "cost-ans-ondemand",
                answer: "オンデマンド（従量課金）",
                explanation: "開発・テスト環境・不定期ワークロード・スパイクトラフィックへの対応",
              },
            ],
          },
        ],
      },
      {
        id: "pca-arch-s4",
        title: "セキュリティ設計",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown: `## アーキテクチャレベルのセキュリティ設計原則

### 多層防御（Defense in Depth）
GCPのセキュリティは複数の層で重ね合わせて実装する：

\`\`\`
インターネット
    ↓ [Cloud Armor: DDoS・WAF・地理的ブロック]
グローバルLB（外部）
    ↓ [VPC Firewall: ポート・プロトコル制御]
VMサブネット（Public）
    ↓ [内部LB + VPC Firewall タグ制御]
VMサブネット（Private）
    ↓ [VPC Service Controls: API境界]
GCP Managed Services
（BigQuery / Cloud Storage / Cloud SQL）
    ↓ [CMEK: データ暗号化]
データ
\`\`\`

### GCPネットワーク分離パターン
- **サブネット分離**：フロントエンド（Public）・バックエンド（Private）・DB層（Isolated）の3層
- **Shared VPC**：組織内の複数プロジェクトで共通ネットワークを共有（ホストプロジェクト + サービスプロジェクト）
- **VPC Peering**：異なるVPC間の直接通信（推移的ルーティング不可）
- **Private Service Connect**：マネージドサービスへのプライベートエンドポイント

### セキュアなデプロイメントパターン
- **CI/CDのセキュリティ**：Binary Authorization（署名済みコンテナのみデプロイ）
- **シークレット管理**：Secret Manager（APIキー・DBパスワードの安全な保管・自動ローテーション）
- **コンテナセキュリティ**：Artifact Registryの脆弱性スキャン・Container Analysis・GKEのWorkload Identity`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "PCAセキュリティ設計の試験ポイント",
            content: `PCAアーキテクチャ設計でのセキュリティ問題解法：

1. **「SAキーを安全に管理したい」** → Secret Manager + Workload Identity Federation（キーレス認証が最善）
2. **「コンテナイメージのセキュリティ」** → Artifact Registry脆弱性スキャン + Binary Authorization
3. **「複数プロジェクトで同一ネットワーク」** → Shared VPC（ホストプロジェクトでネットワークを一元管理）
4. **「DBパスワードの管理」** → Secret Manager（バージョン管理・自動ローテーション・IAMで細粒度アクセス）
5. **「ゼロトラストアクセス」** → Identity-Aware Proxy（IAP） + BeyondCorp Enterprise
6. **「規制産業のデータ保護」** → Assured Workloads（データレジデンシー保証）+ CMEK + VPC SC`,
          },
        ],
      },
    ],
  },
]
