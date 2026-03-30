import type { ProductInsight } from "@/lib/types/product"

/**
 * 製品詳細インサイト — 5観点
 * 1. purpose: 製品の目的（何のために存在するか、どんな課題を解決するか）
 * 2. useCasesDetail: 利用シーンとアーキテクチャ例
 * 3. comparison: 類似・競合サービスとの使い分け
 * 4. bestPractices: 設計・運用のベストプラクティスと注意点
 * 5. examTips: 資格試験での頻出ポイント
 */
export const PRODUCT_INSIGHTS: Record<string, ProductInsight> = {
  // ─── Compute ───
  gce: {
    purpose:
      "Compute Engineは、Google のグローバルインフラ上でLinux/Windows仮想マシンを実行するIaaSサービスです。オンプレミスのサーバーをそのままクラウドに移行（リフト&シフト）したい場合や、OS・ミドルウェアを細かく制御したいワークロードに最適です。",
    useCasesDetail:
      "Webサーバークラスタ（MIG + ロードバランサ構成）、GPU/TPU付きの機械学習トレーニング、SAP HANAなどのエンタープライズアプリ、ゲームサーバー（Spot VMでコスト削減）が典型例です。Cloud Storage をデータレイクとして併用し、BigQuery でログ分析する構成がよく使われます。",
    comparison:
      "Cloud Run/Cloud Functions はコンテナ・関数単位のサーバーレスで、インフラ管理不要だがOS制御不可。GKE はコンテナオーケストレーション向き。GCE は「OSレベルの制御が必要」「既存VMイメージをそのまま使いたい」場合に選択します。AWS EC2、Azure VM に相当します。",
    bestPractices:
      "Managed Instance Group（MIG）でオートスケールを設定し、Preemptible/Spot VM を活用してコストを最大80%削減できます。カスタムマシンタイプで必要なvCPU/メモリだけを割り当て、Sustained Use Discount を活用しましょう。ファイアウォールルールは最小権限で設定し、サービスアカウントの適切な付与を忘れずに。",
    examTips:
      "CDL・ACEで頻出。マシンタイプの選択基準（汎用 vs コンピューティング最適化 vs メモリ最適化）、Preemptible VM の制約（24時間で停止、再起動保証なし）、ライブマイグレーションの仕組み、Sole-tenant Node の用途を押さえましょう。",
  },
  gke: {
    purpose:
      "Google Kubernetes Engine（GKE）は、Googleが開発・運用するKubernetesのフルマネージドサービスです。コンテナ化されたアプリケーションのデプロイ、スケーリング、管理を自動化し、マイクロサービスアーキテクチャの運用基盤として機能します。",
    useCasesDetail:
      "マイクロサービスアーキテクチャ（各サービスを独立デプロイ）、CI/CDパイプライン（Cloud Build → Artifact Registry → GKE）、ステートフルワークロード（StatefulSet + Persistent Disk）、MLサービングインフラ（GPU ノードプール + Vertex AI連携）が典型です。",
    comparison:
      "Cloud Run はコンテナ実行だがKubernetesの柔軟性（カスタムネットワーキング、StatefulSet、DaemonSet等）は不要な場合に適します。GKE Autopilot はノード管理不要でCloud Runに近い体験、Standard はノードレベル制御が必要な場合に選択。AWS EKS、Azure AKS に相当します。",
    bestPractices:
      "本番環境ではAutopilotモードを第一選択とし、運用負荷を削減しましょう。Workload Identity でPodにIAMロールを安全にバインドし、サービスアカウントキーの使用を避けます。Binary Authorization でデプロイ時のコンテナ検証を有効化。ノードの自動アップグレードとリリースチャネル（Rapid/Regular/Stable）を適切に設定してください。",
    examTips:
      "ACE・PCAで頻出。Autopilot vs Standard の違い、Workload Identity の仕組み、Pod Security Policy、ノードプールの設計（マシンタイプ混在、Taints/Tolerations）、クラスタのアップグレード戦略が問われます。",
  },

  // ─── Serverless ───
  "cloud-run": {
    purpose:
      "Cloud Runは、コンテナイメージをサーバーレスで実行するフルマネージドサービスです。リクエストがないときはインスタンス数をゼロにスケールダウンし、トラフィック増加時は自動でスケールアウトします。インフラ管理ゼロでコンテナを本番運用できます。",
    useCasesDetail:
      "REST API / GraphQL サーバー、Webアプリケーションのバックエンド、Pub/Subからのイベント駆動処理、スケジュール実行（Cloud Scheduler連携）、内部マイクロサービス間通信が典型的です。Artifact Registry からイメージをプルし、Cloud SQL に接続する構成がよく使われます。",
    comparison:
      "Cloud Functions はソースコードから直接デプロイでき関数単位の軽量処理向き。Cloud Run は任意のコンテナ（言語・フレームワーク自由）でより柔軟。GKE はKubernetesの全機能が必要な場合に選択。「コンテナ化済みで、Kubernetesほどの複雑さは不要」ならCloud Runが最適解です。",
    bestPractices:
      "コールドスタートを最小化するため、min-instances を1以上に設定（コスト vs レイテンシのトレードオフ）。Concurrency設定を適切に調整し、1インスタンスで複数リクエストを処理させましょう。VPCコネクタ経由でCloud SQLやMemorystoreに接続。Secret Manager で機密情報を管理し、環境変数にハードコードしないこと。",
    examTips:
      "ACE・PCAで頻出。Cloud Run vs Cloud Functions vs GKE の使い分け判断が最重要。最大リクエストタイムアウト（最大60分）、コンカレンシー設定、Cloud Run Jobs（バッチ処理）、トラフィック分割によるカナリアデプロイを理解しましょう。",
  },
  "cloud-functions": {
    purpose:
      "Cloud Functionsは、イベントに応答して実行される軽量なサーバーレス関数です。インフラのプロビジョニングや管理が一切不要で、コードを書くだけでHTTPリクエストやPub/Subメッセージ、Cloud Storageの変更などに反応する処理を実装できます。",
    useCasesDetail:
      "Webhook受信処理、Cloud Storageへのファイルアップロード時の画像リサイズ/サムネイル生成、Pub/Subメッセージの処理、Firestore変更トリガーによるデータ集計、Cloud Scheduler連携のスケジュール実行（日次バッチ等）が典型です。",
    comparison:
      "Cloud Run はコンテナベースでより柔軟（任意のランタイム、長時間処理対応）。Cloud Functions は関数単位でより軽量、イベントトリガーの設定が簡単。2nd Gen は内部的にCloud Run基盤で動作し、コンカレンシーやタイムアウト上限が拡張されています。AWS Lambda に相当します。",
    bestPractices:
      "コールドスタート対策として、最小インスタンス数の設定や依存パッケージの軽量化を行いましょう。冪等性を確保し、同じイベントが複数回配信されても安全に処理できる設計にすること。2nd Gen への移行を検討し、コンカレンシー設定でスループットを向上させましょう。環境変数や Secret Manager で設定を外部化してください。",
    examTips:
      "CDL・ACEで出題。1st Gen vs 2nd Gen の違い（基盤、タイムアウト上限、コンカレンシー）、トリガータイプ（HTTP、Pub/Sub、Cloud Storage、Firestore）、コールドスタートの概念、Cloud Functions vs Cloud Run の選択基準を押さえましょう。",
  },
  "app-engine": {
    purpose:
      "App Engineは、Google Cloudが最初に提供したPaaS（Platform as a Service）で、インフラ管理不要でWebアプリケーションをデプロイ・運用できます。アプリのコードを書くだけで、スケーリング、ロードバランシング、ヘルスチェックを自動で行います。",
    useCasesDetail:
      "シンプルなWebアプリケーション、モバイルアプリのバックエンドAPI、社内ツール、プロトタイピングに適しています。Standard環境はゼロスケール対応で低トラフィック時のコスト効率が高く、Flexible環境はカスタムランタイムやDockerコンテナに対応します。",
    comparison:
      "Cloud Run はコンテナベースでより柔軟かつモダン。新規プロジェクトではCloud Run が推奨されるケースが多いです。App Engine は既存のApp Engineアプリの運用継続や、自動スケーリング・バージョン管理・トラフィック分割が組み込み済みで設定が最小限な点が利点です。",
    bestPractices:
      "Standard環境を第一選択とし、カスタムランタイムが必要な場合のみFlexible環境を使用します。バージョン管理を活用してトラフィック分割（カナリアリリース）を実施。古いバージョンは定期的にクリーンアップしてコストを抑えましょう。Memcache（Standard）やMemorystore（Flexible）でキャッシュ層を構築してください。",
    examTips:
      "ACEで出題されることがあります。Standard環境 vs Flexible環境の違い（スケール速度、サポート言語、カスタムランタイム対応）、ゼロスケールの可否、デプロイバージョンとトラフィック分割の仕組みを理解しましょう。",
  },

  // ─── Storage ───
  gcs: {
    purpose:
      "Cloud Storageは、あらゆるサイズ・形式のデータを保存できる統一オブジェクトストレージです。99.999999999%（イレブンナイン）の耐久性を持ち、静的WebサイトホスティングからAI/MLのトレーニングデータ格納、バックアップ・DR、データレイクまで幅広く利用されます。",
    useCasesDetail:
      "データレイク（BigQuery外部テーブルで直接クエリ）、静的Webサイトホスティング（Cloud CDN連携）、アプリケーションのメディアファイル格納、バックアップ/DR（Nearline/Coldline/Archive）、ML学習データの格納（Vertex AI連携）が典型です。",
    comparison:
      "Persistent Disk はVM用ブロックストレージ（ファイルシステムとしてマウント）。Filestore はNFSプロトコルの共有ファイルストレージ。Cloud Storage はオブジェクトストレージで、HTTPアクセス、大量の非構造化データ格納に最適。AWS S3、Azure Blob Storage に相当します。",
    bestPractices:
      "ライフサイクルルールを設定し、古いオブジェクトをNearline→Coldline→Archiveへ自動移行してコスト最適化。バケットのバージョニングを有効化して誤削除を防止。Uniform bucket-level access を使用してACLの複雑さを回避。パブリックアクセスは慎重に管理し、必要な場合はSigned URLを使用してください。",
    examTips:
      "CDL・ACE・PCAで最頻出。4ストレージクラス（Standard/Nearline/Coldline/Archive）の最低保存期間と料金体系、ライフサイクルルール、gsutilコマンド、Transfer Service、強整合性モデル（2021年以降）が重要です。",
  },
  "persistent-disk": {
    purpose:
      "Persistent Diskは、Compute Engine VMにアタッチして使用する高耐久性のブロックストレージです。VMが削除されてもデータが永続化され、スナップショットによるバックアップ、マルチリーダー対応、リージョン間レプリケーションをサポートします。",
    useCasesDetail:
      "データベースのストレージ（Cloud SQLの裏側でも使用）、VM起動ディスク、複数VMからの同時読み取り（Multi-reader モード）、スナップショットベースのDR構成が典型です。",
    comparison:
      "Local SSD はVM直結で超高速だがVM削除で消失。Persistent Disk は永続的で耐久性が高い。Filestore はNFSプロトコルの共有ストレージ。pd-standard（HDD）vs pd-ssd vs pd-balanced vs pd-extreme で性能・コストのバランスを選択します。AWS EBS に相当します。",
    bestPractices:
      "スナップショットを定期的に取得し、DR戦略を確立しましょう。ワークロードに応じたディスクタイプを選択（読み取り重視ならpd-ssd、コスト重視ならpd-standard）。ディスクサイズに比例してIOPS/スループットが増加する仕様を活用し、適切なサイズを設計してください。",
    examTips:
      "ACEで出題。ディスクタイプ別のIOPS特性、スナップショットのスケジューリング、リージョンPersistent Disk によるHA構成、ディスクのリサイズ（オンライン拡張可能、縮小不可）を理解しましょう。",
  },
  filestore: {
    purpose:
      "Filestoreは、NFSプロトコルでアクセスできるフルマネージドの共有ファイルストレージです。複数のVMやGKE Podから同時にマウントでき、オンプレミスのNASをクラウドに移行する場合や、共有ファイルシステムが必要なワークロードに適しています。",
    useCasesDetail:
      "GKE永続ボリューム（ReadWriteMany）、レンダリングファーム、メディア処理パイプライン、レガシーアプリケーションのファイル共有、HPC環境のスクラッチストレージが典型です。",
    comparison:
      "Cloud Storage はオブジェクトストレージでHTTPアクセス向き。Persistent Disk はブロックストレージで1対1（または Multi-reader）。Filestore はNFSで複数クライアントから同時書き込み可能。AWS EFS に相当します。",
    bestPractices:
      "ティア選択を適切に行いましょう（Basic HDD はコスト重視、Basic SSD は汎用、High Scale / Enterprise は高性能要件向け）。スナップショットでバックアップを自動化。GKE PersistentVolume として使う場合はCSIドライバーを活用してください。",
    examTips:
      "PCA・PCNEで出題されることがあります。NFSプロトコルの特性、GKE でのReadWriteMany対応、ティア別の性能特性を押さえましょう。",
  },

  // ─── Database ───
  "cloud-sql": {
    purpose:
      "Cloud SQLは、MySQL・PostgreSQL・SQL Serverのフルマネージドリレーショナルデータベースです。パッチ適用、バックアップ、レプリケーション、HA構成をGoogleが自動管理し、開発者はアプリケーション開発に集中できます。",
    useCasesDetail:
      "WebアプリのバックエンドDB（Cloud Run + Cloud SQL構成）、オンプレミスDB移行（Database Migration Service）、ERP/CRMなどのエンタープライズアプリのDB層、WordPress/Drupalなどの既存アプリ移行が典型です。",
    comparison:
      "AlloyDB はPostgreSQL互換でOLTP/OLAP両対応の高性能DB。Cloud Spanner はグローバル分散で水平スケール+強整合性。Cloud SQL は「RDB移行が容易」「馴染みのあるMySQL/PostgreSQLをそのまま使いたい」場合に最適。AWS RDS に相当します。",
    bestPractices:
      "HA構成（リージョナル）を本番環境で有効化。Cloud SQL Auth Proxy を使用してセキュアに接続し、パブリックIPの使用を避けましょう。自動バックアップとポイントインタイムリカバリを設定。接続数の上限に注意し、コネクションプーリングを導入してください。",
    examTips:
      "ACE・PCAで頻出。HA構成の仕組み（リージョナル vs ゾーン）、リードレプリカ、Cloud SQL Auth Proxy の役割、メンテナンスウィンドウ設定、Importメソッド（gcloud sql import）を理解しましょう。",
  },
  spanner: {
    purpose:
      "Cloud Spannerは、リレーショナルDBの強整合性とNoDBの水平スケーラビリティを両立した、グローバル分散データベースです。99.999% SLA（ファイブナイン）を提供し、地球規模のミッションクリティカルなアプリケーションの基盤となります。",
    useCasesDetail:
      "グローバルゲームのプレイヤーデータ（世界中どこでも低レイテンシ）、金融取引システム（強整合性が必須）、大規模eコマース（在庫管理の整合性）、グローバルSaaSのマルチテナントDB が典型です。",
    comparison:
      "Cloud SQL は単一リージョンのRDBで水平スケール不可。BigQuery はOLAP（分析クエリ）向きでOLTPには不向き。Spanner は「水平スケール + 強整合性 + SQL」が全て必要な場合に選択。コストが高いため、要件が合致する場合にのみ採用しましょう。AWS Aurora Global Database + DynamoDB の特性を統合したものに近いです。",
    bestPractices:
      "主キーにUUID（Version 4）を使用してホットスポットを回避。単調増加するキー（タイムスタンプ、連番）は避けましょう。インターリーブテーブルで親子関係をデータ局所化。処理単位（Processing Unit）の適切なサイジングを行い、コスト最適化を図ってください。",
    examTips:
      "PCA・PDEで重要。Cloud SQL vs Spanner の選択基準（グローバル分散が必要か、水平スケールが必要か）、キー設計のアンチパターン（ホットスポット）、99.999% SLAの条件（マルチリージョン構成）が頻出です。",
  },
  firestore: {
    purpose:
      "Firestoreは、リアルタイム同期機能を持つサーバーレスNoSQLドキュメントデータベースです。モバイル/Webアプリからの直接アクセスに最適化されており、オフラインサポート、ACIDトランザクション、自動スケーリングを備えています。",
    useCasesDetail:
      "モバイル/Webアプリのユーザーデータ管理、リアルタイムチャット・コラボレーション機能、ゲームリーダーボード、IoTデバイスの状態管理、Firebase Authentication連携のユーザープロフィール格納が典型です。",
    comparison:
      "Bigtable は低レイテンシ大規模データ（IoT、時系列）向きだがリアルタイム同期なし。Cloud SQL はリレーショナルデータ向き。Firestore は「モバイル/WebクライアントからSDKで直接アクセス」「リアルタイム同期」が必要な場合に選択。AWS DynamoDB + AppSync に近い立ち位置です。",
    bestPractices:
      "ドキュメントサイズは1MB以下に保ち、サブコレクションで階層を分割。複合インデックスを事前定義してクエリ性能を確保。セキュリティルールを適切に設定し、クライアントからの不正アクセスを防止。Native モード（推奨）と Datastore モードの違いを理解して選択してください。",
    examTips:
      "CDL・ACEで出題。Native モード vs Datastore モードの違い（リアルタイム同期の有無）、ドキュメント/コレクションのデータモデル、セキュリティルール、クエリの制約（不等式フィルタは1フィールドのみ等）を押さえましょう。",
  },
  bigtable: {
    purpose:
      "Cloud Bigtableは、ミリ秒以下のレイテンシで数十億行・数百TBのデータを処理できるフルマネージドの幅広カラムNoSQLデータベースです。GoogleのSearch、Gmail、Mapsなどの内部基盤として20年以上の実績があります。",
    useCasesDetail:
      "IoTセンサーデータの時系列蓄積・分析、AdTechのクリック/インプレッションログ、金融取引データのリアルタイム処理、Googleアナリティクスのバックエンド、推薦エンジンのユーザー行動データ格納が典型です。",
    comparison:
      "Firestore はモバイル/Webアプリ向けのドキュメントDB。BigQuery は分析クエリ（OLAP）向きでレイテンシは秒単位。Bigtable は「大量データ × 低レイテンシ読み書き」に特化。HBase API互換でHadoopエコシステムとの連携が容易。AWS DynamoDB（低レイテンシ）に近いですがスキーマ設計思想が異なります。",
    bestPractices:
      "行キーの設計が最重要。タイムスタンプの逆順（reverse timestamp）でホットスポットを回避。テーブル設計は「幅広カラム（Tall and Narrow ではなく Wide）」を推奨。最低3ノードからスタートし、Key Visualizer でアクセスパターンを分析して最適化しましょう。",
    examTips:
      "PDE・PCAで重要。行キー設計のベストプラクティス（ホットスポット回避）、ストレージタイプ（SSD vs HDD）の選択基準、HBase API互換性、Key Visualizer の役割、Bigtable vs BigQuery の使い分けが頻出です。",
  },
  memorystore: {
    purpose:
      "Memorystoreは、RedisおよびMemcachedのフルマネージドインメモリデータストアです。マイクロ秒〜ミリ秒の超低レイテンシでデータにアクセスでき、キャッシュ層やセッション管理に使用してアプリケーションのパフォーマンスを大幅に向上させます。",
    useCasesDetail:
      "データベースクエリ結果のキャッシュ（Cloud SQL前段のキャッシュ層）、Webアプリケーションのセッション管理、リアルタイムリーダーボード、Pub/Sub + Cloud Functions でのメッセージキューイング、レート制限の実装が典型です。",
    comparison:
      "Redis はデータ構造が豊富（Sorted Set, Hash等）で永続化対応。Memcached はシンプルなキーバリューキャッシュで高スループット。Cloud SQL は永続的なリレーショナルデータ向き。Memorystore は「アプリ層のキャッシュ・高速データアクセス」に特化。AWS ElastiCache に相当します。",
    bestPractices:
      "Redis を選択する場合はRDB/AOF永続化を有効化し、HA構成（レプリカ付き）を本番環境で使用。キーのTTL（有効期限）を適切に設定してメモリ溢れを防止。VPC内に配置し、パブリックアクセスを避けてください。メモリ使用量の監視アラートを設定しましょう。",
    examTips:
      "PCA・ACEで出題されることがあります。Redis vs Memcached の使い分け、キャッシュ戦略（Cache-Aside, Write-Through）、HA構成の仕組み、VPCネイティブ接続を理解しましょう。",
  },
  alloydb: {
    purpose:
      "AlloyDBは、PostgreSQL完全互換でありながら、標準PostgreSQLの最大4倍のOLTP性能と100倍の分析クエリ性能を実現するフルマネージドデータベースです。GoogleのAI技術を活用した自動チューニングと、分離されたストレージアーキテクチャが特徴です。",
    useCasesDetail:
      "高性能OLTPワークロード（eコマース、ゲーム）、ハイブリッドトランザクション/分析処理（HTAP）、PostgreSQLからの移行（互換性100%）、AI/ML統合（組み込みMLモデル呼び出し）が典型です。",
    comparison:
      "Cloud SQL for PostgreSQL は汎用RDBで十分な性能の場合にコスト効率が良い。Cloud Spanner はグローバル分散+水平スケール。AlloyDB は「PostgreSQL互換を維持しつつ高性能が必要」「OLTPとOLAPを1つのDBで処理したい」場合に選択。AWS Aurora PostgreSQL に近いポジションです。",
    bestPractices:
      "カラム型エンジンを有効化して分析クエリを高速化。自動バキュームと適応型メモリ管理を活用。Cross-region レプリケーションでDR構成を構築。PostgreSQL拡張機能（pgvector等）を活用してAI/MLワークロードにも対応できます。",
    examTips:
      "PCA・PDEで出題が増加中。Cloud SQL vs AlloyDB vs Spanner の3択判断、カラム型ストレージによる分析性能向上、PostgreSQL互換性のメリット、コスト比較を押さえましょう。",
  },

  // ─── Analytics ───
  bigquery: {
    purpose:
      "BigQueryは、ペタバイト規模のデータに対してインフラ管理不要でSQLクエリを実行できるサーバーレスデータウェアハウスです。ストレージとコンピュートが分離されたアーキテクチャにより、必要な分だけの課金でコスト効率の高い分析を実現します。",
    useCasesDetail:
      "全社データウェアハウス（各種データソースを統合）、リアルタイムダッシュボード（BI Engine + Looker Studio）、BigQuery ML（SQLだけでML実行）、ログ分析（Cloud Logging からの自動エクスポート）、外部テーブル（Cloud Storage のデータを直接クエリ）が典型です。",
    comparison:
      "Cloud SQL は OLTP（トランザクション処理）向き。Bigtable は低レイテンシの大量読み書き向き。Dataproc は既存Hadoop/Sparkジョブの移行向き。BigQuery は「大規模データの分析クエリ（OLAP）」に特化。SQL完結でML/GeoViz/BIまで一貫して実行可能。AWS Redshift + Athena に相当します。",
    bestPractices:
      "パーティション（日付/整数範囲）とクラスタリング（カラム指定）を設定してクエリコストを削減。SELECT * を避け必要なカラムだけを指定。マテリアライズドビューで繰り返しクエリを最適化。Slots（オンデマンド vs Editions）の課金モデルを理解し、大規模利用時はEditionsへの移行を検討してください。",
    examTips:
      "CDL・ACE・PDE 全てで最頻出。パーティション vs クラスタリングの違いと使い分け、オンデマンド課金 vs 定額課金、外部テーブル vs マネージドテーブル、データセットのアクセス制御（列レベル/行レベルセキュリティ）、ストリーミング挿入 vs バッチロードを完全に理解しましょう。",
  },
  dataflow: {
    purpose:
      "Dataflowは、Apache Beamベースのフルマネージドデータパイプラインサービスです。バッチ処理とストリーム処理を統一的なプログラミングモデルで記述でき、自動スケーリングでインフラ管理が不要です。ETL処理やリアルタイムデータ処理の基盤として使用します。",
    useCasesDetail:
      "Pub/Sub → Dataflow → BigQuery のリアルタイムストリーミングパイプライン、Cloud Storage → Dataflow → BigQuery のバッチETL、データクレンジング・変換処理、機械学習の特徴量エンジニアリングが典型です。",
    comparison:
      "Dataproc は Hadoop/Spark エコシステムの既存コードをそのまま実行したい場合に選択。Dataflow は Apache Beam ベースで統一APIによるバッチ/ストリーム処理。Cloud Composer は ワークフローオーケストレーション（Airflow）で Dataflow ジョブのスケジュール管理に使用。AWS Kinesis Data Analytics に相当します。",
    bestPractices:
      "Flex Templates を使用して再利用可能なパイプラインテンプレートを作成。ウィンドウ処理（Fixed, Sliding, Session）を適切に設定してストリーミングデータを集約。自動スケーリングを活用し、ワーカー数の上下限を設定。デッドレターキュー（エラーデータの退避先）を設計してデータロスを防ぎましょう。",
    examTips:
      "PDE で最重要。Apache Beam のプログラミングモデル（Pipeline, PCollection, Transform）、ウィンドウ処理の種類、Exactly-once vs At-least-once セマンティクス、Dataflow vs Dataproc の選択基準が頻出です。",
  },
  pubsub: {
    purpose:
      "Pub/Subは、非同期メッセージングとイベントストリーミングを提供するフルマネージドサービスです。パブリッシャーとサブスクライバーを疎結合にし、マイクロサービス間の通信やリアルタイムイベント配信のバックボーンとして機能します。",
    useCasesDetail:
      "イベント駆動マイクロサービス間通信、IoTデバイスからのデータ収集（数百万デバイス対応）、Cloud Functions / Cloud Run のイベントトリガー、Dataflow へのストリーミングデータ入力、Cloud Logging のログルーティング先が典型です。",
    comparison:
      "Eventarc はイベントルーティングのマネージドレイヤーで、Pub/Sub を内部的に使用。Pub/Sub Lite はコスト重視で機能を絞った軽量版。Cloud Tasks は HTTP ターゲットへのタスクキュー（1:1配信）で Pub/Sub（1:N配信）とは異なります。AWS SNS + SQS に相当します。",
    bestPractices:
      "デッドレタートピックを設定し、処理失敗メッセージをキャプチャ。サブスクリプションの acknowledgement deadline を適切に設定（処理時間より長く）。メッセージの順序保証が必要な場合は Ordering Key を使用。スキーマバリデーションを有効化してメッセージ品質を確保しましょう。",
    examTips:
      "CDL・ACE・PDE で頻出。Push vs Pull サブスクリプションの違い、メッセージの最低1回配信保証（冪等処理の必要性）、メッセージ保持期間（最大31日）、Pub/Sub Lite との使い分け、Dataflow / Cloud Functions との連携パターンを理解しましょう。",
  },
  looker: {
    purpose:
      "Lookerは、LookMLというモデリング言語でデータのセマンティックレイヤーを定義し、一貫性のあるビジネスメトリクスをダッシュボードやレポートで可視化するBIプラットフォームです。データの「信頼できる唯一の情報源（Single Source of Truth）」を組織全体で共有できます。",
    useCasesDetail:
      "経営ダッシュボード（KPI自動更新）、セルフサービスBI（ビジネスユーザーが自らデータ探索）、アプリケーション組み込み分析（Embedded Analytics）、データガバナンス（LookMLでメトリクス定義を一元管理）が典型です。",
    comparison:
      "Looker Studio（旧Data Studio）は無料のセルフサービスBIツールで軽量な可視化向き。Looker はエンタープライズ向けでLookMLによるデータモデリング、ガバナンス、API/SDKでの拡張が特徴。BigQuery BI Engine は BigQuery データの高速キャッシュ。AWS QuickSight に相当します。",
    bestPractices:
      "LookML のデータモデルをGitで管理し、バージョン管理と変更レビューを徹底。PDT（Persistent Derived Table）で高コストクエリの結果をキャッシュ。ユーザーアクセス制御を適切に設定し、データセキュリティを確保してください。",
    examTips:
      "PDE で出題されることがあります。LookML の概念、Looker vs Looker Studio の使い分け、BigQuery との統合方法を理解しましょう。",
  },
  dataproc: {
    purpose:
      "Dataprocは、Apache Hadoop、Apache Spark、Presto などのオープンソースフレームワークを90秒でクラスタ起動できるフルマネージドサービスです。既存のHadoop/Sparkワークロードをクラウドに移行する場合や、大規模データ処理に使用します。",
    useCasesDetail:
      "既存のSpark/HadoopジョブのクラウドJourney、大規模バッチETL処理、機械学習のトレーニング（SparkML）、インタラクティブクエリ（Presto/Trino）、ログ解析が典型です。Cloud Storage をHDFSの代替として使用する構成が推奨されます。",
    comparison:
      "Dataflow は Apache Beam ベースで統一バッチ/ストリーム処理（新規開発向き）。Dataproc は既存のHadoop/Sparkコードをそのまま実行（移行向き）。BigQuery はSQL完結の分析に最適。「Sparkジョブを変更せずにクラウドで実行したい」なら Dataproc を選択します。",
    bestPractices:
      "データはCloud Storageに格納し、クラスタのHDFSは一時データのみに使用（エフェメラルクラスタパターン）。ジョブ完了後はクラスタを削除してコスト削減。Dataproc Serverless でインフラ管理をさらに省略可能。初期化アクションでカスタムソフトウェアを自動インストールしましょう。",
    examTips:
      "PDE で重要。Dataproc vs Dataflow の選択基準（既存コード移行 vs 新規開発）、エフェメラルクラスタパターン、Preemptible VM をセカンダリワーカーに使用する構成、Cloud Storage コネクタの役割を押さえましょう。",
  },

  // ─── AI/ML ───
  "vertex-ai": {
    purpose:
      "Vertex AIは、データの準備・モデルのトレーニング・デプロイ・モニタリング・MLOps までをカバーするGoogle Cloudの統合AI/MLプラットフォームです。AutoMLからカスタムトレーニング、Gemini API まで、あらゆるMLスキルレベルに対応します。",
    useCasesDetail:
      "カスタムモデルのトレーニング・デプロイ（TensorFlow/PyTorch）、AutoML（コーディング不要でモデル構築）、Gemini APIを使った生成AIアプリ開発、Vertex AI Pipelines（MLOps）、Feature Store（特徴量管理）、Model Monitoring（モデルドリフト検出）が典型です。",
    comparison:
      "BigQuery ML はSQLだけでML実行（簡易な予測モデル向き）。AutoML は特定タスク（画像分類、テキスト分類等）のノーコードML。Vertex AI カスタムトレーニングはフルコントロール。Gemini API はLLMベースの生成AI。用途と技術レベルに応じて使い分けます。AWS SageMaker に相当します。",
    bestPractices:
      "Vertex AI Workbench（マネージドJupyterノートブック）で実験。Feature Store で特徴量を組織横断で再利用。Vertex AI Pipelines で学習→評価→デプロイのCI/CDパイプラインを構築。Model Monitoring でデータドリフト・予測ドリフトを検出し、自動再学習のトリガーに活用しましょう。",
    examTips:
      "PMLE で最重要、PCA でも出題。AutoML vs カスタムトレーニングの選択基準、Vertex AI Pipelines のコンポーネント、Feature Store の役割、モデルのA/Bテスト（トラフィック分割デプロイ）、Explainable AI を理解しましょう。",
  },
  "document-ai": {
    purpose:
      "Document AIは、OCRと自然言語処理を組み合わせてPDF、画像、手書きドキュメントから構造化データを自動抽出するAIプラットフォームです。請求書、契約書、レシートなど業務ドキュメントのデジタル化・自動処理を実現します。",
    useCasesDetail:
      "請求書処理の自動化（Invoice Parser）、契約書からの条項抽出、ID証明書の自動読み取り（KYC）、フォームデータのデジタル化、医療記録の構造化が典型です。Cloud Functions でトリガーし、BigQuery に結果を格納するパイプラインがよく構築されます。",
    comparison:
      "Vision AI は汎用画像認識（物体検出、ラベル付け等）。Document AI はドキュメント特化で構造化データ抽出に最適化。Vertex AI はカスタムMLモデルのトレーニング向き。「ドキュメントから特定のフィールドを自動抽出したい」なら Document AI が最適です。",
    bestPractices:
      "事前学習済みプロセッサ（Invoice Parser, Receipt Parser 等）を最初に試し、精度が不足する場合にカスタムトレーニング。Human-in-the-loop レビュー機能で品質を担保。バッチ処理 API を使用して大量ドキュメントを効率的に処理しましょう。",
    examTips:
      "PMLE で出題されることがあります。事前学習済みプロセッサの種類、カスタムプロセッサの作成フロー、Document AI Warehouse との連携を理解しましょう。",
  },
  "speech-to-text": {
    purpose:
      "Speech-to-Textは、125以上の言語・方言に対応した自動音声認識（ASR）APIです。リアルタイムストリーミング認識とバッチ処理の両方をサポートし、コールセンター分析、字幕生成、音声コマンドなどの音声データ処理を実現します。",
    useCasesDetail:
      "コールセンターの通話記録分析（話者ダイアライゼーション付き）、動画の自動字幕生成、音声入力UI、議事録の自動生成、音声メッセージのテキスト変換が典型です。",
    comparison:
      "Text-to-Speech は逆方向（テキスト→音声合成）。Natural Language API はテキスト分析（感情分析、エンティティ抽出）。Speech-to-Text は「音声→テキスト変換」に特化。Contact Center AI は コールセンター向けの統合ソリューションで内部的に Speech-to-Text を活用します。",
    bestPractices:
      "Enhanced モデル（電話音声向け）と Default モデルを用途に応じて使い分け。音声適応（Speech Adaptation）でドメイン固有の用語の認識精度を向上。ストリーミング認識では interim results を活用してUXを向上させましょう。",
    examTips:
      "PMLE で出題されることがあります。同期 vs 非同期 vs ストリーミングの3つの認識方式、サポート言語、モデル選択（Enhanced / Default）を理解しましょう。",
  },
  "vision-ai": {
    purpose:
      "Vision AI（Cloud Vision API）は、画像の内容を機械学習で分析するAPIです。ラベル検出、物体検出、OCR（テキスト検出）、顔検出、セーフサーチ判定など、画像理解に必要な主要機能をAPIコール1つで利用できます。",
    useCasesDetail:
      "ユーザー投稿画像のコンテンツモデレーション（SafeSearch）、ECサイトの商品画像自動タグ付け、ドキュメントのOCR（名刺、レシート等）、ランドマーク検出（旅行アプリ）、画像ベースの検索機能が典型です。",
    comparison:
      "Document AI はドキュメント特化の構造化データ抽出。Vision AI は汎用画像分析。Vertex AI AutoML Vision はカスタム画像分類モデルのトレーニング。「既成のML機能でいいなら Vision API、カスタムモデルが必要なら AutoML Vision」と使い分けます。",
    bestPractices:
      "バッチ処理で大量画像を効率的に処理。検出タイプ（LABEL_DETECTION, TEXT_DETECTION 等）を必要なものだけ指定してコスト削減。SafeSearch は UGC（ユーザー生成コンテンツ）を扱うサービスで必須。Vertex AI Product Search で商品画像検索を実装できます。",
    examTips:
      "PMLE・CDL で出題されることがあります。Vision API の検出タイプ一覧、事前学習済みAPI vs AutoML Vision の使い分け、OCR機能の制約を理解しましょう。",
  },

  // ─── Networking ───
  vpc: {
    purpose:
      "Virtual Private Cloud（VPC）は、GCPリソースのためのグローバル仮想ネットワークです。サブネット、ファイアウォールルール、ルーティングを制御し、リソース間の通信を安全に管理します。GCPの全てのコンピュートリソースはVPC内に配置されます。",
    useCasesDetail:
      "マルチリージョン構成（グローバルVPC + リージョナルサブネット）、ハイブリッドクラウド（Cloud VPN / Cloud Interconnect でオンプレ接続）、共有VPC（複数プロジェクト間でネットワーク共有）、VPCピアリング（異なるVPC間の内部通信）が典型です。",
    comparison:
      "GCP VPC はグローバル（リージョンをまたがるサブネット配置可能）で、AWS VPC（リージョナル）や Azure VNet とは設計思想が異なります。Shared VPC は組織レベルのネットワーク一元管理、VPC ピアリングはプロジェクト間の対等接続です。",
    bestPractices:
      "カスタムモードVPC を使用し、サブネットのCIDR範囲を計画的に設計（将来の拡張を考慮）。ファイアウォールルールは最小権限で設定し、サービスアカウントベースのルールを優先。Private Google Access を有効化して、内部IPのみのVMからGoogleサービスにアクセスできるようにしましょう。",
    examTips:
      "ACE・PCA・PCNE で最重要。GCP VPC のグローバル特性、Auto vs Custom モード、Shared VPC vs VPC ピアリング、ファイアウォールルールの優先度（priority値が小さいほど優先）、Private Google Access の仕組みを完全に理解しましょう。",
  },
  "cloud-cdn": {
    purpose:
      "Cloud CDNは、Googleのグローバルエッジネットワーク（100以上のPoP）を活用して、Webコンテンツやメディアファイルをユーザーの近くからキャッシュ配信するコンテンツ配信ネットワークです。レイテンシの削減とオリジンサーバーの負荷軽減を実現します。",
    useCasesDetail:
      "静的Webサイトの高速配信（Cloud Storage + Cloud CDN）、動画・画像のグローバル配信、API レスポンスのキャッシュ、ゲームアセットの配信が典型です。Cloud Load Balancing と統合して使用します。",
    comparison:
      "Cloud Storage は単独でも静的ホスティング可能だが、CDN キャッシュなし。Cloud CDN は Load Balancing のバックエンドとして動作し、エッジキャッシュを提供。Media CDN はメディアストリーミングに特化した大容量配信向け。AWS CloudFront に相当します。",
    bestPractices:
      "Cache-Control ヘッダーを適切に設定してキャッシュヒット率を最大化。Signed URL / Signed Cookie で認証付きコンテンツ配信。Cloud Armor と統合してDDoS防御。キャッシュ無効化（Invalidation）は頻繁に使わず、バージョニングURLを推奨します。",
    examTips:
      "PCNE・PCA で出題。キャッシュキーの仕組み、キャッシュモード（CACHE_ALL_STATIC, USE_ORIGIN_HEADERS, FORCE_CACHE_ALL）、Signed URL の用途を理解しましょう。",
  },
  "cloud-load-balancing": {
    purpose:
      "Cloud Load Balancingは、単一のAnycast IPアドレスでグローバルにトラフィックを分散するフルマネージドロードバランサーです。ウォームアップ不要で瞬時にスケールし、HTTP(S)、TCP、UDPプロトコルに対応します。",
    useCasesDetail:
      "グローバルWebアプリの負荷分散（External HTTP(S) LB）、マイクロサービス間の内部通信（Internal LB）、SSL/TLS終端、Cloud CDN・Cloud Armor の統合フロントエンド、GKE Ingress のバックエンドが典型です。",
    comparison:
      "外部HTTP(S) LB はグローバル（Anycast IP）。内部HTTP(S) LB はリージョナル。TCP/UDP LB はレイヤー4。ネットワークLB はリージョナルパススルー。Application LB（HTTP(S)）vs Network LB（TCP/UDP）の選択が重要。AWS ALB/NLB/GWLB に相当します。",
    bestPractices:
      "HTTP(S) LB + Cloud CDN + Cloud Armor の組み合わせが最も一般的なフロントエンド構成。ヘルスチェックを適切に設定してバックエンドの健全性を確保。SSL証明書はGoogle マネージド証明書を使用して運用を簡素化。URL マップでパスベースルーティングを構成しましょう。",
    examTips:
      "ACE・PCA・PCNE で頻出。LBの種類（Global External vs Regional External vs Internal）の選択、Premium vs Standard ネットワークティア、SSL/TLSポリシー、バックエンドサービスの概念を理解しましょう。",
  },
  "cloud-armor": {
    purpose:
      "Cloud Armorは、GoogleのグローバルインフラをGoogle Cloud上のアプリケーションを DDoS攻撃やWebアプリケーション攻撃（SQLi、XSS等）から保護するWAF（Web Application Firewall）です。Managed Protection Plus でプロアクティブなDDoS防御も提供します。",
    useCasesDetail:
      "外部向けWebアプリのDDoS防御（HTTP(S) LB前段）、IPアドレス/地域ベースのアクセス制御、OWASP Top 10 攻撃の防御、reCAPTCHA Enterprise連携によるボット対策、レート制限が典型です。",
    comparison:
      "VPCファイアウォールはレイヤー3/4のネットワークレベル制御。Cloud Armor はレイヤー7（アプリケーション層）のWAF。両方を組み合わせて多層防御を構築します。AWS WAF + AWS Shield に相当します。",
    bestPractices:
      "事前構成済みのWAFルール（OWASP ModSecurity Core Rule Set）を有効化。適応型保護（Adaptive Protection）を有効にしてDDoS攻撃パターンの自動検出。ルールの優先度を計画的に設計し、deny/allow の順序を明確に。レート制限ルールでブルートフォース攻撃を防止しましょう。",
    examTips:
      "PCSE・PCA で重要。セキュリティポリシーの構成、事前構成WAFルールの種類、適応型保護の仕組み、Cloud Load Balancing との統合が問われます。",
  },

  // ─── Security ───
  iam: {
    purpose:
      "Identity and Access Management（IAM）は、GCPリソースへのアクセスを「誰が」「何に対して」「何をできるか」の3要素で制御する中核的なセキュリティサービスです。最小権限の原則を実現し、組織全体のアクセスガバナンスを統一管理します。",
    useCasesDetail:
      "プロジェクトレベルのロール付与（開発者にはEditor、閲覧者にはViewer）、サービスアカウントによるアプリケーション間認証、組織ポリシーによる全社的な制約適用、Workload Identity Federation による外部IdP連携が典型です。",
    comparison:
      "IAM はアクセス制御の中核。Organization Policy はリソースの「作れるもの」を制限（IAMの上位制約）。VPCファイアウォールはネットワークレベルのアクセス制御。Secret Manager は認証情報の保管。Cloud Armor はアプリ層のWAF。多層防御として全て組み合わせます。",
    bestPractices:
      "基本ロール（Owner/Editor/Viewer）は避け、事前定義ロールまたはカスタムロールで最小権限を付与。サービスアカウントキーの使用を避けWorkload Identity を使用。IAM条件（Conditions）で時限付き・リソース限定のアクセスを設定。定期的にIAMポリシーの棚卸しを実施しましょう。",
    examTips:
      "全資格で最重要。基本ロール vs 事前定義ロール vs カスタムロール、IAMポリシーの継承（組織→フォルダ→プロジェクト→リソース）、サービスアカウント vs ユーザーアカウント、Workload Identity Federation、deny ポリシーを完全に理解しましょう。",
  },
  "secret-manager": {
    purpose:
      "Secret Managerは、APIキー、パスワード、証明書、暗号鍵などの機密情報を安全に一元管理するサービスです。アプリケーションコードやCI/CDパイプラインから安全にシークレットを参照でき、自動ローテーションとバージョン管理をサポートします。",
    useCasesDetail:
      "データベース接続パスワードの管理、外部API キーの格納、TLS/SSL証明書の管理、Cloud Run / Cloud Functions の環境変数としてのシークレット注入、CI/CDパイプラインでのシークレット参照が典型です。",
    comparison:
      "Cloud KMS は暗号化キーの管理（データ暗号化/復号用）。Secret Manager はシークレット値そのものの保管。両方を組み合わせ、Secret Manager に保管したシークレットをCMEK（Cloud KMS）で暗号化することも可能。AWS Secrets Manager に相当します。",
    bestPractices:
      "シークレットのバージョンを活用し、ローテーション時に旧バージョンを即座に無効化しない（ローリング更新対応）。IAMで最小権限のアクセス制御を設定。Cloud Functions のシークレット自動ローテーション機能を活用。環境変数へのハードコードは絶対に避け、Secret Manager から動的に取得してください。",
    examTips:
      "PCSE・ACE で出題。Secret Manager vs Cloud KMS の使い分け、シークレットのバージョニング、IAMによるアクセス制御、Cloud Run / Cloud Functions でのシークレットマウント方法を理解しましょう。",
  },

  // ─── DevOps ───
  "cloud-build": {
    purpose:
      "Cloud Buildは、コンテナ環境でビルド、テスト、デプロイを実行するサーバーレスCI/CDプラットフォームです。GitHub / GitLab / Cloud Source Repositories と統合し、コードの変更をトリガーに自動パイプラインを実行します。",
    useCasesDetail:
      "コンテナイメージのビルド → Artifact Registry へのプッシュ → Cloud Run / GKE へのデプロイ、ユニットテスト・統合テストの自動実行、Terraform / Pulumi によるインフラのCI/CD、マルチアーキテクチャビルド（ARM/x86）が典型です。",
    comparison:
      "Cloud Deploy は CD（デリバリー）に特化し、承認ゲート付きのプログレッシブデリバリー。Cloud Build は CI/CD 両方をカバーする汎用ビルドサービス。組み合わせて使うのが推奨パターン。Jenkins/GitHub Actions のマネージド代替として機能します。",
    bestPractices:
      "cloudbuild.yaml でビルドステップを定義し、GitリポジトリにIaC的に管理。ビルドキャッシュ（kaniko キャッシュ）を活用してビルド時間を短縮。プライベートプール（Private Pool）でVPC内のリソースにアクセス。最小権限のサービスアカウントをビルドに割り当てましょう。",
    examTips:
      "PCD・ACE で出題。ビルドトリガーの種類（Push、PR、スケジュール）、cloudbuild.yaml の構造、Artifact Registry との連携、Binary Authorization によるデプロイ時検証を理解しましょう。",
  },
  "artifact-registry": {
    purpose:
      "Artifact Registryは、Docker コンテナイメージ、Maven/Gradle パッケージ、npm パッケージ、Python パッケージなどのビルドアーティファクトを一元管理するフルマネージドリポジトリです。脆弱性スキャン、IAM統合、VPC Service Controls 対応で安全に管理できます。",
    useCasesDetail:
      "CI/CD パイプラインでのコンテナイメージ管理（Cloud Build → Artifact Registry → GKE/Cloud Run）、社内共有ライブラリの配信（npm/Maven/Python）、マルチリージョンレプリケーション、脆弱性スキャンの自動実行が典型です。",
    comparison:
      "Container Registry（旧サービス）は Docker イメージのみ対応で非推奨。Artifact Registry はマルチフォーマット対応の後継サービス。GitHub Container Registry、AWS ECR に相当します。新規プロジェクトでは必ず Artifact Registry を使用してください。",
    bestPractices:
      "脆弱性スキャンを有効化し、Critical/High の脆弱性がある場合はデプロイをブロック。クリーンアップポリシーで古いイメージを自動削除してストレージコストを管理。リモートリポジトリ機能で外部レジストリ（Docker Hub等）のプロキシを構成し、レート制限を回避しましょう。",
    examTips:
      "PCD・ACE で出題。Container Registry との違い、サポートするアーティファクト形式、脆弱性スキャン機能、Binary Authorization との統合を理解しましょう。",
  },
  "cloud-deploy": {
    purpose:
      "Cloud Deployは、GKE、Cloud Run、Anthos への継続的デリバリー（CD）に特化したマネージドサービスです。承認ゲート、ロールバック、カナリアデプロイなどのプログレッシブデリバリー機能を提供し、安全で一貫性のあるデプロイプロセスを実現します。",
    useCasesDetail:
      "マルチ環境デプロイパイプライン（dev → staging → production）、承認ワークフロー付きの本番デプロイ、カナリアリリース（段階的トラフィック移行）、自動ロールバック（ヘルスチェック失敗時）が典型です。",
    comparison:
      "Cloud Build は CI（ビルド/テスト）+ 基本的なCD。Cloud Deploy は CD に特化し、環境プロモーション、承認ゲート、デプロイ戦略（カナリア/ブルーグリーン）を提供。Cloud Build → Cloud Deploy のパイプラインが推奨構成。AWS CodeDeploy / Argo Rollouts に相当します。",
    bestPractices:
      "デリバリーパイプラインとターゲット環境をYAMLで定義しGit管理。承認者を適切に設定してヒューマンゲートを確保。Skaffold 統合でローカル開発→クラウドデプロイの一貫したワークフロー。デプロイ履歴と監査ログを活用して変更追跡を行いましょう。",
    examTips:
      "PCD で出題。デリバリーパイプラインの概念、ターゲット（dev/staging/prod）、承認ゲート、カナリアデプロイの設定方法を理解しましょう。",
  },

  // ─── Management ───
  "cloud-monitoring": {
    purpose:
      "Cloud Monitoring（旧Stackdriver Monitoring）は、GCP、AWS、オンプレミスのインフラとアプリケーションのメトリクスを収集・可視化・アラートするオブザーバビリティサービスです。SLI/SLO/エラーバジェットによるサービス信頼性管理を実現します。",
    useCasesDetail:
      "インフラメトリクスの監視（CPU、メモリ、ディスク）、カスタムメトリクスによるアプリケーション監視、アップタイムチェック（外部URL監視）、SLO定義とエラーバジェットのトラッキング、ダッシュボードによる可視化が典型です。",
    comparison:
      "Cloud Logging はログ収集・分析。Cloud Trace は分散トレーシング。Cloud Profiler はアプリパフォーマンスプロファイリング。Cloud Monitoring はメトリクスベースの監視・アラート。これらを組み合わせてオブザーバビリティスタックを構築します。AWS CloudWatch に相当します。",
    bestPractices:
      "アラートポリシーはSLOベースで設計し、ノイズを最小化。カスタムダッシュボードで重要メトリクスを一覧化。MQL（Monitoring Query Language）で高度なメトリクスクエリを作成。アラート通知チャネル（Slack、PagerDuty等）を適切に設定してインシデント対応を迅速化しましょう。",
    examTips:
      "ACE・PCA で出題。メトリクスの種類（GCP メトリクス、カスタムメトリクス）、アラートポリシーの構成要素、アップタイムチェックの仕組み、SLI/SLO/エラーバジェットの概念を理解しましょう。",
  },
  "cloud-logging": {
    purpose:
      "Cloud Logging（旧Stackdriver Logging）は、GCPリソースやアプリケーションのログを集中管理するサービスです。構造化ログの収集、リアルタイム検索、ログベースメトリクスの作成、ログシンクによる外部エクスポートを提供します。",
    useCasesDetail:
      "セキュリティ監査（管理アクティビティログ、データアクセスログ）、アプリケーションデバッグ（Cloud Run / GKE のログ分析）、コンプライアンス（長期ログ保持）、ログベースメトリクスによるアラート、BigQuery へのログエクスポート（高度な分析）が典型です。",
    comparison:
      "Cloud Monitoring はメトリクスベースの監視。Cloud Logging はログベースの分析。ログベースメトリクスで両方を連携可能。Cloud Audit Logs は IAM / リソース操作の監査ログ（Cloud Logging の特殊なログ）。AWS CloudWatch Logs に相当します。",
    bestPractices:
      "ログシンクを設定してCloud Storage（長期保管）やBigQuery（分析）にエクスポート。除外フィルタで不要なログ（ヘルスチェック等）を除外してコスト削減。ログベースメトリクスでエラー発生率を監視。構造化ログ（JSON形式）を採用してフィルタリングを容易にしましょう。",
    examTips:
      "ACE・PCSE で出題。監査ログの種類（管理アクティビティ / データアクセス / システムイベント / ポリシー拒否）、ログシンクの設定、ログの保持期間（デフォルト30日、最大10年）、除外フィルタの仕組みを理解しましょう。",
  },
}
