/** GCP製品の説明マップ（ノードのlabel第1行をキーにマッチ） */
export const GCP_SERVICE_DESCRIPTIONS: Record<string, string> = {
  // Compute
  "Compute Engine": "Google のインフラ上で動作する高パフォーマンスな仮想マシン。カスタムマシンタイプやプリエンプティブルVMをサポート。",
  "Cloud Run": "コンテナをサーバーレスで実行する完全マネージドサービス。リクエストに応じて自動スケール、ゼロスケールも可能。",
  "Cloud Functions": "イベントに応答して実行される軽量なサーバーレス関数。インフラ管理不要でコードに集中可能。",
  "GKE": "Google マネージドの Kubernetes クラスタ。Autopilot モードで完全自動管理が可能。",

  // Networking
  "Cloud Load": "グローバルに分散したロードバランサー。HTTP(S)、TCP/SSL、内部負荷分散に対応。",
  "Cloud CDN": "Googleのエッジネットワークを活用したコンテンツ配信。低レイテンシでの静的コンテンツ配信を実現。",
  "Cloud Armor": "DDoS防御とWAF（Web Application Firewall）を提供するセキュリティサービス。",
  "Cloud VPN": "オンプレミスネットワークとGCPをIPsec VPNトンネルで安全に接続するサービス。",
  "Cloud Interconnect": "オンプレミスとGCPを専用線で高速・低レイテンシに接続するサービス。",
  "Shared VPC": "複数プロジェクト間でVPCネットワークを共有し、一元管理を実現するネットワーク構成。",
  "API Gateway": "APIのトラフィック管理、認証、レート制限を提供するフルマネージドゲートワイ。",

  // Storage
  "Cloud Storage": "ペタバイト規模のオブジェクトストレージ。ストレージクラスによるコスト最適化が可能。",
  "Cloud SQL": "MySQL、PostgreSQL、SQL Server 対応のフルマネージドリレーショナルDB。自動バックアップ・レプリケーション対応。",
  "Cloud Bigtable": "低レイテンシ・高スループットの NoSQL データベース。IoTや時系列データに最適。",
  "Firestore": "リアルタイム同期が可能なサーバーレスドキュメントDB。モバイル/Webアプリに最適。",
  "Memorystore": "Redis / Memcached 対応のフルマネージドインメモリデータストア。キャッシュやセッション管理に利用。",

  // Analytics
  "BigQuery": "ペタバイト規模のサーバーレスデータウェアハウス。標準SQLで高速分析が可能。",
  "Pub/Sub": "グローバル規模のリアルタイムメッセージングサービス。イベント駆動アーキテクチャの中核。",
  "Dataflow": "Apache Beam ベースのフルマネージドストリーム/バッチデータ処理サービス。",
  "Dataproc": "Apache Spark / Hadoop のマネージドクラスタサービス。大規模バッチ処理に対応。",
  "Looker Studio": "ビジネスインテリジェンスとデータ可視化のためのダッシュボードツール。",
  "Looker": "エンタープライズ向けBI・データ可視化プラットフォーム。LookMLによるデータモデリング。",
  "Dataplex": "データレイクとデータウェアハウスを横断して統合管理するデータガバナンスサービス。",
  "Eventarc": "Google Cloud サービスのイベントを統一的にルーティングするイベント管理サービス。",

  // AI/ML
  "Vertex AI": "ML モデルの構築・トレーニング・デプロイを統合管理するAI/MLプラットフォーム。",
  "Gemini": "Googleの最先端マルチモーダルLLM。テキスト・画像・コード生成に対応。",
  "Feature Store": "ML用の特徴量を一元管理・配信するストア。トレーニングとサービングで一貫したデータを提供。",
  "Model Registry": "学習済みモデルのバージョン管理・メタデータ管理を行うレジストリ。",
  "Vector Search": "ベクトル類似検索のためのインデックスサービス。RAGパイプラインの検索基盤。",
  "ADK": "AIエージェントの構築・評価・デプロイを行うオープンソースフレームワーク。マルチエージェントシステム対応。",
  "Agent Development Kit": "AIエージェントの構築・評価・デプロイを行うオープンソースフレームワーク。マルチエージェントシステム対応。",
  "Agent Builder": "Vertex AI上でAIエージェントを構築・テスト・デプロイするマネージドプラットフォーム。",
  "Agent Engine": "AIエージェントのフルマネージドランタイム。セッション管理・メモリ・ツールガバナンスを提供。",
  "Agentspace": "Geminiとエージェント機能を企業全体に展開するAIプラットフォーム。社内ナレッジ検索・業務自動化。",
  "Imagen": "テキストプロンプトから高品質な画像を生成・編集するAIモデル。SynthIDデジタル透かし付き。",

  // Security
  "Secret Manager": "APIキーやパスワードなどの機密情報を安全に管理・配布するサービス。",
  "Cloud IAM": "リソースへのきめ細かいアクセス制御を提供するID・アクセス管理サービス。",
  "Google Unified Security": "脅威インテリジェンス・SecOps・クラウドセキュリティ・ブラウザセキュリティをAIで統合した包括的セキュリティプラットフォーム。",

  // DevOps
  "Cloud Build": "CI/CDパイプラインのビルド・テスト・デプロイを自動化するサーバーレスサービス。",
  "Cloud Deploy": "GKE / Cloud Run への継続的デリバリーを管理するマネージドサービス。",
  "Artifact Registry": "コンテナイメージや言語パッケージを安全に保管・管理するレジストリ。",

  // Firebase
  "Firebase Hosting": "Webアプリの静的ファイルを高速配信するグローバルCDNホスティング。",
  "Firebase Auth": "メール/パスワード、Google、SNS認証に対応するマネージド認証サービス。",

  // Monitoring
  "Model Monitoring": "デプロイ済みモデルの予測品質・ドリフトを監視するサービス。",
  "Monitoring": "アプリとインフラのメトリクス・ログ・アラートを統合管理する Cloud Operations サービス。",

  // Networking
  "Cloud WAN": "Googleのグローバルネットワークを企業バックボーンとして利用できるフルマネージドWANサービス。",

  // Integration
  "Cloud Composer": "Apache Airflowベースのフルマネージドワークフローオーケストレーションサービス。",
  "Colab Enterprise": "VPC-SC・IAM統合対応のエンタープライズ向けデータサイエンスノートブック環境。",

  // Other
  "dbt": "SQLベースのデータ変換ツール。ELTパイプラインのTransformレイヤーを担当。",
  "GitHub": "ソースコードのバージョン管理とコラボレーションプラットフォーム。",
}

/**
 * ノードのlabel（第1行）からGCP製品説明を検索する
 */
export function getServiceDescription(label: string): string | undefined {
  const firstLine = label.split("\n")[0].trim()
  // 完全一致
  if (GCP_SERVICE_DESCRIPTIONS[firstLine]) return GCP_SERVICE_DESCRIPTIONS[firstLine]
  // 部分一致（label先頭がキーで始まる場合）
  for (const [key, desc] of Object.entries(GCP_SERVICE_DESCRIPTIONS)) {
    if (firstLine.startsWith(key)) return desc
  }
  return undefined
}
