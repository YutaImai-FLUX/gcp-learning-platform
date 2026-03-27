import type { StudyModule } from "@/lib/types/study-module"

export const PMLE_MODULES: StudyModule[] = [
  {
    id: "pmle-ml-design",
    certId: "pmle",
    domainName: "ML問題の設計",
    title: "ML問題の定義と設計",
    description:
      "機械学習プロジェクトの成功はML問題の正確な定義から始まります。問題の種別・評価指標の選択・データ戦略・適切なツール選択まで、ML Engineerとして必要な設計思想を体系的に学習します。",
    estimatedMinutes: 85,
    difficulty: "advanced",
    prerequisites: [],
    sections: [
      {
        id: "pmle-ml-design-s1",
        title: "ML問題の種別と定義",
        estimatedMinutes: 22,
        blocks: [
          {
            type: "comparison_table",
            title: "ML問題の種別比較：分類 / 回帰 / クラスタリング / 推薦 / 時系列予測",
            headers: ["種別", "定義", "出力", "代表的な評価指標", "GCPサービス・ツール", "ビジネス例"],
            rows: [
              {
                label: "分類（Classification）",
                values: [
                  "入力を事前定義されたクラスのいずれかに分類する教師あり学習",
                  "クラスラベル（例: 正常/異常、カテゴリA/B/C）",
                  "Accuracy / Precision / Recall / F1 / AUC-ROC",
                  "Vertex AI AutoML Tables、BigQuery ML LOGISTIC_REG、カスタムTF/PyTorch",
                  "スパムメール検出、医療診断、画像分類、チャーン予測",
                ],
                highlight: false,
              },
              {
                label: "回帰（Regression）",
                values: [
                  "連続値を予測する教師あり学習",
                  "数値（例: 売上高、気温、株価）",
                  "RMSE / MAE / MAPE / R²",
                  "Vertex AI AutoML Tables、BigQuery ML LINEAR_REG、Vertex AI Custom Training",
                  "不動産価格予測、需要予測、エネルギー消費量予測",
                ],
                highlight: false,
              },
              {
                label: "クラスタリング（Clustering）",
                values: [
                  "ラベルなしデータを類似性に基づいてグループ化する教師なし学習",
                  "クラスタ割り当て（例: セグメントA/B/C）",
                  "シルエットスコア / エルボー法 / Davies-Bouldin指数",
                  "BigQuery ML KMEANS、Vertex AI Custom Training（scikit-learn/TF）",
                  "顧客セグメンテーション、異常検知、コンテンツグループ化",
                ],
                highlight: false,
              },
              {
                label: "推薦（Recommendation）",
                values: [
                  "ユーザーの過去の行動・好みに基づいてアイテムを推薦する",
                  "推薦スコア付きアイテムリスト",
                  "Precision@K / Recall@K / NDCG / MAP",
                  "Vertex AI Matching Engine（Vector Search）、Recommendations AI",
                  "ECサイトの商品推薦、動画推薦、楽曲推薦",
                ],
                highlight: false,
              },
              {
                label: "時系列予測（Time Series Forecasting）",
                values: [
                  "時間的に連続するデータから将来の値を予測する",
                  "将来の時系列値（点予測または区間予測）",
                  "RMSE / MAPE / SMAPE / WAPE",
                  "BigQuery ML ARIMA_PLUS、Vertex AI AutoML Forecasting、Vertex AI カスタム",
                  "売上予測、在庫最適化、トラフィック予測",
                ],
                highlight: false,
              },
            ],
            footnote:
              "PMLE試験では「このビジネス課題に最適なML問題の種別は？」という問題が頻出。ビジネス要件を正確にML問題に翻訳する能力が問われる。",
          },
          {
            type: "concept_card",
            term: "教師あり / 教師なし / 強化学習の違い",
            definition:
              "機械学習は学習に使うデータとフィードバックの方式によって3つの主要パラダイムに分類されます。教師あり学習（Supervised Learning）はラベル付きデータから入出力のマッピングを学習します。教師なし学習（Unsupervised Learning）はラベルなしデータから潜在構造やパターンを発見します。強化学習（Reinforcement Learning）はエージェントが環境との相互作用から試行錯誤で最適な行動方策を学習します。",
            useCases: [
              "教師あり学習: 過去の顧客データ（特徴量＋チャーンラベル）からチャーン予測モデルを構築",
              "教師なし学習: ラベルなしの購買データから顧客セグメントを自動発見（クラスタリング）",
              "教師なし学習: 高次元特徴量をPCA（主成分分析）で次元削減して可視化",
              "強化学習: ゲームAIやロボット制御、広告入札最適化での活用",
              "自己教師あり学習（Self-supervised）: GPT/BERTなどLLMの事前学習に使われるラベル不要の学習方式",
            ],
            characteristics: [
              "教師あり学習はラベル付きデータが必要。データアノテーションコストが高くなりがち",
              "教師なし学習はラベル不要だが、結果の評価が難しく主観的になりやすい",
              "強化学習は報酬設計が難しく、実装・チューニングが複雑。シミュレーション環境が必要なケースが多い",
              "現実のMLプロジェクトでは教師あり学習が最も多く使われる",
              "半教師あり学習（Semi-supervised）はラベル付きデータが少量でも活用できる中間的なアプローチ",
            ],
            examRelevance:
              "PMLE試験では「ラベルデータがほとんどない場合は？」→「半教師あり学習または教師なし学習を検討」という流れの問題が出る。各パラダイムの適用条件を理解しておくこと。",
          },
        ],
      },
      {
        id: "pmle-ml-design-s2",
        title: "データ戦略とデータ品質",
        estimatedMinutes: 18,
        blocks: [
          {
            type: "text",
            markdown: `## データ収集・前処理・品質管理の基本

MLパイプラインにおいてデータは最重要の資産です。最も洗練されたアルゴリズムや最高スペックのGPUも、質の低いデータからは良いモデルを作ることはできません。

### データ収集の戦略

**データソースの多様性**
高品質なMLモデルには、多様な視点からのデータが必要です。GCPでは以下のデータソースからの収集が可能です：
- **構造化データ**: BigQuery、Cloud SQL（トランザクションDB）、Cloud Spanner
- **半構造化データ**: Firestore（JSONドキュメント）、Cloud Storage（JSONログ）
- **非構造化データ**: Cloud Storage（画像・動画・音声・PDF）
- **ストリームデータ**: Pub/Sub（リアルタイムイベント）、IoTデータ
- **外部データ**: Google Cloud Public Datasets、外部APIからのデータ連携

**ラベリング（アノテーション）**
教師あり学習には正解ラベルが必要です。GCPでは **Vertex AI Data Labeling Service** を使ってヒューマンアノテーターによるラベル付けを管理できます。また、**Active Learning** を活用して不確実性の高いサンプルを優先的にラベリングし、少ないアノテーションコストで高精度モデルを実現できます。

### データ前処理の重要性

**欠損値処理**
欠損値は「削除」「平均/中央値/最頻値での補完」「高度な補完（KNN補完・モデルベース補完）」のいずれかで対処します。欠損パターン（MCAR/MAR/MNAR）によって適切な対処が異なります。

**外れ値処理**
統計的外れ値（3σ法・IQRベース）の検出と、ドメイン知識を使った外れ値判定を組み合わせます。外れ値を単純に削除するか、Clipping（上限/下限への切り取り）や変換（対数変換）で対処するかはケースバイケースです。

**データ分割**
学習・検証・テストデータへの分割は独立性を保つことが重要です。時系列データでは時間的な順序を考慮した分割（未来のデータで学習しない）が必須です。データリーク（Data Leakage）の防止が最重要課題です。

### データ品質管理ツール

**TFX（TensorFlow Extended）Data Validation（TFDV）**
データの統計量計算・スキーマ定義・異常検出を自動化します。本番データが学習時のデータ分布から外れていないかを監視（データドリフト検出）できます。

**Vertex AI Feature Store**
特徴量の一元管理・バージョン管理・再利用を可能にします。Training-Serving Skewの防止に貢献します。`,
          },
          {
            type: "key_point",
            level: "common_mistake",
            title: "ゴミデータからはゴミモデルしか生まれない（Garbage In, Garbage Out）",
            content:
              "PMLE試験で最も重要な原則の一つ：データ品質への投資はモデル精度への直接投資。\n\n**よくある落とし穴：**\n① **Data Leakage（データリーク）**: テストデータの情報が学習データに混入する。例：前処理（正規化）をデータ分割前に全体に適用してしまう → 必ず分割後に学習データのみで正規化パラメータを計算し、テストデータに適用すること\n② **不均衡データの無視**: 正常99%・異常1%のデータでAccuracyが99%でも無価値。Recall（異常の検出率）がほぼ0かもしれない\n③ **将来データの混入（時系列）**: 予測対象時点より後のデータを特徴量に使ってしまうPoint-in-time violation\n④ **代表性のないデータ**: 特定のグループのデータが過少代表されていると、そのグループへの精度が低いバイアスモデルになる",
          },
        ],
      },
      {
        id: "pmle-ml-design-s3",
        title: "AutoML vs カスタムトレーニングの選択",
        estimatedMinutes: 22,
        blocks: [
          {
            type: "comparison_table",
            title: "ML手法の比較：AutoML / BigQuery ML / Vertex AI Custom Training",
            headers: ["手法", "ML専門知識の要件", "開発速度", "カスタマイズ度", "コスト", "最適なユースケース"],
            rows: [
              {
                label: "Vertex AI AutoML",
                values: [
                  "低（データ準備とビジネス理解のみ）",
                  "最速（UIからデータアップロード→モデル生成）",
                  "低（Googleが自動でアーキテクチャ選択）",
                  "中（学習コスト＋予測エンドポイント費用）",
                  "MLエンジニアが少ない、迅速にベースラインが必要、標準的な画像・テキスト・表形式の問題",
                ],
                highlight: false,
              },
              {
                label: "BigQuery ML",
                values: [
                  "中（SQL知識＋ML基礎）",
                  "速（SQLで記述、データ移動不要）",
                  "中（モデルタイプ選択、ハイパーパラメータ設定）",
                  "低〜中（BigQueryのクエリ料金のみ）",
                  "BigQueryにデータが既にある、SQLエンジニアがMLを行いたい、大規模テーブルの分析的予測",
                ],
                highlight: false,
              },
              {
                label: "Vertex AI Custom Training",
                values: [
                  "高（ML/DL・Python・フレームワーク知識が必要）",
                  "遅（アーキテクチャ設計・実装・調整が必要）",
                  "最高（アーキテクチャ・データパイプライン・学習ループを完全制御）",
                  "高（GPU/TPUリソース費用、エンジニアリング工数）",
                  "最先端モデルが必要、独自アーキテクチャ、既存モデルのファインチューニング、研究用途",
                ],
                highlight: true,
              },
            ],
            footnote:
              "PMLE試験では「迅速にプロトタイプが必要」→AutoML、「データがBigQueryにあってSQLチームが主体」→BigQuery ML、「精度が最優先で独自モデルが必要」→Custom Trainingという判断フローで解ける問題が多い。",
          },
          {
            type: "decision_tree",
            title: "どのML手法を選ぶか",
            rootId: "dt-ml-start",
            nodes: [
              {
                id: "dt-ml-start",
                question: "MLエンジニアリングの専門チームがいますか？",
                yesId: "dt-has-expert",
                noId: "dt-no-expert",
              },
              {
                id: "dt-no-expert",
                question: "データはBigQueryに格納されていますか？",
                yesId: "dt-bqml",
                noId: "dt-automl",
              },
              {
                id: "dt-bqml",
                answer: "BigQuery ML",
                explanation:
                  "SQLでモデルを作成・評価・予測できる。データ移動なしで大規模データに対してMLを実行。CREATE MODEL文でロジスティック回帰・XGBoost・Deep Neural Networkなどが利用可能。",
              },
              {
                id: "dt-automl",
                answer: "Vertex AI AutoML",
                explanation:
                  "データをアップロードするだけでGoogleが自動でモデルを選択・学習・最適化。画像分類・テキスト分類・テーブル分類・回帰など複数のタスクに対応。",
              },
              {
                id: "dt-has-expert",
                question: "最先端の精度または独自のモデルアーキテクチャが必要ですか？",
                yesId: "dt-custom",
                noId: "dt-consider-automl",
              },
              {
                id: "dt-consider-automl",
                question: "迅速にベースラインモデルを作りたいですか？",
                yesId: "dt-automl-expert",
                noId: "dt-custom",
              },
              {
                id: "dt-automl-expert",
                answer: "Vertex AI AutoML（ベースライン用途）",
                explanation:
                  "専門家チームでも最初にAutoMLでベースライン精度を素早く確認し、その後カスタムモデルで精度向上を目指すアプローチが効率的。AutoMLの精度で十分なら Custom Training は不要。",
              },
              {
                id: "dt-custom",
                question: "既存の事前学習済みモデルをファインチューニングしますか？",
                yesId: "dt-finetune",
                noId: "dt-scratch",
              },
              {
                id: "dt-finetune",
                answer: "Vertex AI Custom Training（ファインチューニング）",
                explanation:
                  "Hugging FaceのBERT/T5やTensorFlow HubのモデルをVertex AIでファインチューニング。少量の独自データで高精度を実現できる。転移学習（Transfer Learning）の活用。",
              },
              {
                id: "dt-scratch",
                answer: "Vertex AI Custom Training（スクラッチ学習）",
                explanation:
                  "TensorFlow・PyTorch・JAXを使って完全にカスタムなモデルを構築。TPUやGPUクラスタを活用した大規模分散学習も可能。最大の柔軟性・コストも最大。",
              },
            ],
          },
        ],
      },
      {
        id: "pmle-ml-design-s4",
        title: "Vertex AI Feature Store",
        estimatedMinutes: 23,
        blocks: [
          {
            type: "concept_card",
            term: "Vertex AI Feature Store（特徴量ストア）",
            definition:
              "特徴量（Feature）を一元的に管理・保存・提供する ML プラットフォームのコンポーネントです。学習用のバッチ特徴量とリアルタイム推論用のオンライン特徴量を同じ定義から提供し、特徴量の再利用・発見・バージョン管理を可能にします。2023年にVertex AI Feature Store（第2世代）にリニューアルされ、BigQueryをバックエンドとした新しいアーキテクチャになりました。",
            useCases: [
              "複数のMLモデルで共通の顧客特徴量（購買履歴・属性・行動データ）を一元管理して再利用する",
              "リアルタイム推論で最新の特徴量値を低レイテンシ（ミリ秒単位）で取得する",
              "特徴量のPoint-in-time correct な取得でデータリークを防止する",
              "チーム間で特徴量定義を共有し、特徴量エンジニアリングの重複作業を削減する",
            ],
            characteristics: [
              "オンラインサービング（低レイテンシ・リアルタイム）とオフラインサービング（バッチ学習）の両方をサポート",
              "特徴量にはバージョンと更新日時が記録される。Point-in-time lookupで学習時点の特徴量を正確に再現",
              "Bigtable（オンライン）とBigQuery（オフライン）を内部で使用する2層アーキテクチャ",
              "フィーチャーグループ・フィーチャービューという概念で特徴量を論理的に整理",
              "TTL（Time To Live）設定で古い特徴量を自動削除できる",
            ],
            examRelevance:
              "PMLE試験では「Training-Serving Skew（学習サービング間のずれ）を解決するには？」→「Feature Storeを使って学習時とサービング時に同じ特徴量定義を使用する」が正答。特徴量の一貫性と再利用性の問題でFeature Storeが答えになる。",
          },
          {
            type: "code_example",
            language: "python",
            title: "Vertex AI Feature Store の操作（Python SDK）",
            code: `from google.cloud import aiplatform
from google.cloud.aiplatform import feature_store

# Vertex AI の初期化
aiplatform.init(project="my-project", location="us-central1")

# ===== Feature Store（第2世代）の操作 =====

# Feature Group の作成（BigQuery テーブルをソースとして使用）
feature_group = aiplatform.FeatureGroup.create(
    name="user_features",
    source=aiplatform.FeatureGroup.BigQuerySource(
        uri="bq://my-project.my_dataset.user_features_table",
        entity_id_columns=["user_id"],
    ),
    labels={"team": "recommendation", "env": "production"},
)

# Feature View の作成（オンラインサービング用）
feature_view = aiplatform.FeatureOnlineStore.create(
    name="user_feature_store",
    bigtable=aiplatform.FeatureOnlineStore.BigtableSpec(
        auto_scaling=aiplatform.FeatureOnlineStore.BigtableSpec.AutoScalingSpec(
            min_node_count=1,
            max_node_count=3,
            cpu_utilization_target=50,
        )
    ),
)

# ===== オンラインサービング：リアルタイム推論時に特徴量を取得 =====
# 推論時に最新の特徴量を低レイテンシで取得
data_client = feature_view.online_serving.get_data_client()
response = data_client.fetch_feature_values(
    entity_id="user_12345",
    feature_view=feature_view.resource_name,
)
features = {f.name: f.value for f in response.key_values.features}
print(f"取得した特徴量: {features}")

# ===== オフラインサービング：バッチ学習用の特徴量エクスポート =====
# BigQuery からバッチで特徴量を取得（Point-in-time correct）
from datetime import datetime, timezone

batch_job = feature_view.batch_serve_to_bq(
    bq_destination_output_uri="bq://my-project.training_dataset.features_export",
    start_time=datetime(2024, 1, 1, tzinfo=timezone.utc),
    end_time=datetime(2024, 12, 31, tzinfo=timezone.utc),
)
print(f"バッチエクスポートジョブID: {batch_job.resource_name}")`,
            explanation:
              "Feature Store の核心は「学習時（オフライン）とサービング時（オンライン）で同じ特徴量定義を使用する」こと。これによりTraining-Serving Skewを防止できる。第2世代はBigQueryをソースとして使えるため、既存のデータパイプラインとの統合が容易。",
          },
          {
            type: "key_point",
            level: "warning",
            title: "Training-Serving Skew（学習サービング間のずれ）の問題",
            content:
              "Training-Serving Skewは本番MLシステムで最も一般的な障害原因の一つ。\n\n**発生原因：**\n① 学習時とサービング時で特徴量の計算ロジックが異なる（Pythonで学習、Javaで本番実装など）\n② 学習時は月次集計、サービング時はリアルタイム集計など集計期間が違う\n③ 欠損値の補完方法が学習とサービングで異なる\n\n**対策：**\n- Vertex AI Feature Storeで特徴量の定義を一元化する\n- TFX（TensorFlow Transform）でデータ変換ロジックをコードとして固定し、学習・サービング両方で同じコードを実行する\n- 定期的にTraining-Serving Skewの監視を行い、ドリフトを早期検出する\n\nPMLE試験では「モデルがオフライン評価では良好だが本番で精度が低い」→Training-Serving Skewを疑う選択肢が正答になることが多い。",
          },
        ],
      },
    ],
  },
  {
    id: "pmle-model-build",
    certId: "pmle",
    domainName: "モデル構築と評価",
    title: "モデルの構築と評価",
    description:
      "特徴量エンジニアリングの手法、適切な評価指標の選択、過学習対策と正則化技術、そしてモデルの説明可能性まで、高品質なMLモデルを構築・評価するための実践的な知識を習得します。",
    estimatedMinutes: 90,
    difficulty: "advanced",
    prerequisites: ["pmle-ml-design"],
    sections: [
      {
        id: "pmle-model-build-s1",
        title: "特徴量エンジニアリング",
        estimatedMinutes: 22,
        blocks: [
          {
            type: "text",
            markdown: `## 特徴量エンジニアリングの手法

特徴量エンジニアリングはモデルの精度向上に最も大きな影響を与えるプロセスです。生のデータをモデルが学習しやすい形式に変換します。

### 数値特徴量の変換

**正規化（Normalization）と標準化（Standardization）**
- **Min-Max正規化**: データを[0, 1]または[-1, 1]の範囲にスケーリング。外れ値の影響を受けやすい
  - 式: x' = (x - x_min) / (x_max - x_min)
  - 用途: ニューラルネットワーク、画像データ（ピクセル値の0-1スケーリング）
- **標準化（Z-score正規化）**: 平均0・標準偏差1にスケーリング。外れ値に対して頑健
  - 式: x' = (x - μ) / σ
  - 用途: SVM、ロジスティック回帰、線形回帰、PCA

**対数変換**
右歪み（スキュー）のある分布を正規分布に近づける。売上・所得・人口などの正の値を持つデータに有効。log(x + 1) の形で0値も扱える。

**バケット化（ビニング）**
連続値を離散的なカテゴリに変換（例: 年齢を「18-25歳」「26-35歳」...に分類）。線形関係でない場合に非線形性を表現できる。

### カテゴリカル特徴量の変換

**One-Hot Encoding**
カテゴリを0/1のバイナリベクトルに変換。カテゴリ数が少ない場合（10種類以下）に適する。高カーディナリティ（数百以上のカテゴリ）では次元の呪いを引き起こす。

**Target Encoding（ターゲットエンコーディング）**
各カテゴリを目的変数の平均値で置き換える。高カーディナリティなカテゴリ（郵便番号・商品ID等）に有効だが、データリークのリスクがあるため交差検証と組み合わせることが重要。

**Embedding（埋め込み）**
ニューラルネットワークでカテゴリを密なベクトルに変換。商品・ユーザー・単語などの高カーディナリティ特徴量に有効。

### テキスト特徴量の変換

**TF-IDF（Term Frequency-Inverse Document Frequency）**
単語の重要度を文書コーパス全体での出現頻度で重み付け。「the」「is」のような頻出単語の影響を軽減できる。

**Word Embeddings（Word2Vec・GloVe・FastText）**
単語を意味的な類似性を反映した密なベクトルで表現。事前学習済みの埋め込みを転移学習で利用できる。

**BERT / Transformer Embeddings**
文脈を考慮した最先端の文書表現。Vertex AI の Text Embeddings API で容易に利用可能。

### 画像特徴量の変換

**データ拡張（Data Augmentation）**
学習データが少ない場合に、回転・フリップ・色調変更・クロッピングなどで学習データを人工的に増やす。過学習防止とモデルの汎化性能向上に貢献。

**転移学習（Transfer Learning）**
ImageNetで事前学習済みのResNet・EfficientNet等のバックボーンを特徴量抽出器として使用。少量のデータでも高精度を達成できる。`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "正規化 vs 標準化の使い分け",
            content:
              "PMLE試験で最も問われる前処理の選択問題：\n\n**正規化（Min-Max）を使うべきケース：**\n- 特徴量の範囲を[0,1]に明示的に制限したい場合\n- 画像データのピクセル値（0-255 → 0-1）\n- ニューラルネットワーク（特にシグモイド・tanh出力層使用時）\n\n**標準化（Z-score）を使うべきケース：**\n- 外れ値がある場合（外れ値があっても平均・分散は計算可能）\n- SVM・ロジスティック回帰・線形回帰（距離ベースまたは勾配降下法ベースのアルゴリズム）\n- PCAなどの次元削減手法\n\n**どちらも使わなくてよいケース：**\n- 決定木・ランダムフォレスト・XGBoost等のツリーベースモデル（スケーリング不要）\n\n重要：正規化・標準化のパラメータ（min/max または μ/σ）は**学習データのみ**から計算し、テストデータに適用すること。",
          },
        ],
      },
      {
        id: "pmle-model-build-s2",
        title: "モデル評価指標の選択",
        estimatedMinutes: 22,
        blocks: [
          {
            type: "comparison_table",
            title: "モデル評価指標の比較と使い分け",
            headers: ["指標", "計算式・定義", "用途・適したタスク", "特性", "不均衡データでの注意"],
            rows: [
              {
                label: "Accuracy（正解率）",
                values: [
                  "(TP+TN) / (TP+TN+FP+FN)",
                  "二値・多値分類の基本指標",
                  "全予測中の正解割合。直感的でわかりやすい",
                  "不均衡データでは無意味（正常99%なら全部正常と予測すれば99%になる）",
                ],
                highlight: false,
              },
              {
                label: "Precision（適合率）",
                values: [
                  "TP / (TP + FP)",
                  "スパム検出・医療スクリーニング（誤検知を減らしたい場合）",
                  "「陽性と予測したもの中で本当に陽性の割合」偽陽性（False Positive）を減らしたい場合に重視",
                  "高Precision=誤検知が少ない。RecallとトレードオフでしきいValueを調整",
                ],
                highlight: false,
              },
              {
                label: "Recall（再現率）",
                values: [
                  "TP / (TP + FN)",
                  "医療診断・詐欺検出（見逃しを減らしたい場合）",
                  "「本当の陽性のうち正しく検出できた割合」偽陰性（False Negative）を減らしたい場合に重視",
                  "高Recall=見逃しが少ない。がん検診のような「見逃し」が致命的なケースで重要",
                ],
                highlight: false,
              },
              {
                label: "F1スコア",
                values: [
                  "2 × (Precision × Recall) / (Precision + Recall)",
                  "不均衡データの二値分類全般",
                  "PrecisionとRecallの調和平均。PrecisionとRecallのバランスが重要な場合",
                  "PrecisionとRecallのどちらか片方が極端に低い場合にF1も低くなる",
                ],
                highlight: true,
              },
              {
                label: "AUC-ROC",
                values: [
                  "ROC曲線の下の面積（FPR vs TPR）",
                  "確率的な分類モデルの評価、クラス不均衡がある二値分類",
                  "しきい値に依存しない総合的な識別能力を評価。0.5=ランダム、1.0=完璧",
                  "極度の不均衡（1:100以上）ではAUC-PRの方が適切な場合がある",
                ],
                highlight: false,
              },
              {
                label: "AUC-PR（Average Precision）",
                values: [
                  "PR曲線（Precision vs Recall）の下の面積",
                  "極度に不均衡なデータ（詐欺検出・希少疾患診断）",
                  "陽性クラスが少ない場合の評価に特化。AUC-ROCより厳密に評価できる",
                  "ベースライン値（ランダム予測）が陽性クラスの割合に依存する",
                ],
                highlight: false,
              },
              {
                label: "RMSE（二乗平均平方根誤差）",
                values: [
                  "√(Σ(y_pred - y_true)² / n)",
                  "回帰問題の標準的な評価指標",
                  "予測誤差を元の単位で評価。外れ値の影響を大きく受ける（二乗するため）",
                  "N/A（回帰問題）",
                ],
                highlight: false,
              },
              {
                label: "MAE（平均絶対誤差）",
                values: [
                  "Σ|y_pred - y_true| / n",
                  "回帰問題で外れ値の影響を抑えたい場合",
                  "予測誤差の絶対値の平均。外れ値の影響がRMSEより小さい。解釈が直感的",
                  "N/A（回帰問題）",
                ],
                highlight: false,
              },
            ],
            footnote:
              "評価指標の選択はビジネス要件と連動している。「見逃しの代償 vs 誤検知の代償」のどちらが大きいかを考えてPrecision/Recallの重みを決定する。",
          },
          {
            type: "key_point",
            level: "common_mistake",
            title: "不均衡データでAccuracyは使えない理由",
            content:
              "PMLE試験頻出の落とし穴：不均衡データ（クラス比率が偏っているデータ）での評価指標の誤選択。\n\n**具体例：詐欺検出（詐欺0.1%、正常99.9%）**\n- 「全部正常と予測」するダミーモデルのAccuracy = 99.9%（高い！）\n- しかし詐欺を1件も検出できていない（Recall = 0%）\n- → Accuracyは評価指標として完全に無意味\n\n**正しい対応：**\n① 評価指標をF1・AUC-ROC・AUC-PR に変更する\n② データの不均衡自体に対処する：\n   - オーバーサンプリング（SMOTE等で少数クラスを増やす）\n   - アンダーサンプリング（多数クラスを減らす）\n   - class_weight='balanced' パラメータで学習時の損失を調整\n\nPMLE試験では「不均衡データで適切な指標は？」→「F1またはAUC-PR」が正答。",
          },
        ],
      },
      {
        id: "pmle-model-build-s3",
        title: "過学習と正則化",
        estimatedMinutes: 23,
        blocks: [
          {
            type: "concept_card",
            term: "バイアス-分散トレードオフ（Bias-Variance Tradeoff）",
            definition:
              "機械学習モデルの汎化誤差は「バイアス（Bias）」「分散（Variance）」「既約誤差（Irreducible Error）」の3つで構成されます。バイアスはモデルが真の関数を正確に表現できない能力不足から生じる系統的な誤差です。分散はモデルが学習データの細かいノイズまで過剰に適合する敏感さです。この2つはトレードオフの関係にあり、モデルの複雑さを調整することでバランスを取ります。",
            useCases: [
              "過学習（高分散）: 複雑な深層ニューラルネットワークが学習データには完璧だが、テストデータで精度が大幅低下",
              "未学習（高バイアス）: 線形モデルで非線形なデータパターンを表現しようとして、学習データでも精度が低い",
              "バイアスを下げる: より複雑なモデル、多い特徴量、学習率を下げる",
              "分散を下げる: 正則化（L1/L2/Dropout）、アンサンブル（Random Forest）、より多くの学習データ",
            ],
            characteristics: [
              "高バイアス＋低分散 = 未学習（Underfitting）。学習データでもテストデータでも精度が低い",
              "低バイアス＋高分散 = 過学習（Overfitting）。学習データでは精度が高いがテストデータで低い",
              "最適なモデルは両方のバランスが取れた「スイートスポット」に存在する",
              "学習曲線（Learning Curve）でバイアス・分散の問題を診断できる",
              "アンサンブル手法（Bagging）は分散を低減し、Boostingはバイアスを低減する傾向がある",
            ],
            examRelevance:
              "PMLE試験では「モデルの学習精度は高いがテスト精度が低い」→「過学習（高分散）」→「正則化・Dropout・データ増加で対処」という問題が定番。",
          },
          {
            type: "text",
            markdown: `## L1/L2正則化・Dropout・Early Stoppingの説明

### L1正則化（Lasso）
損失関数に重みの絶対値の和（L1ノルム）のペナルティ項を追加します：
\`L = Loss + λ * Σ|w|\`

**特性:** 不要な特徴量の重みを正確に0にする「スパース性」を生む。特徴量選択（Feature Selection）としても機能する。解釈可能性が高い。

**用途:** 特徴量が多い場合の自動特徴量選択、高次元データ（テキストデータ等）

### L2正則化（Ridge）
損失関数に重みの二乗和（L2ノルム）のペナルティ項を追加します：
\`L = Loss + λ * Σw²\`

**特性:** 重みを小さな値に抑制するが、完全に0にはしない。大きな重みに対してより大きなペナルティを与える。数値的に安定。

**用途:** 多重共線性がある場合、一般的な過学習防止。ニューラルネットワークではWeight Decayとも呼ばれる。

### L1 + L2の組み合わせ（Elastic Net）
L1とL2の両方のペナルティを組み合わせることで、それぞれの利点を活かします。特徴量間に相関がある場合に特に有効です。

### Dropout
ニューラルネットワークの正則化手法で、学習中にランダムにニューロンを「ドロップ（無効化）」します。ドロップ率p（例: 0.5）を設定すると、各ステップで50%のニューロンがランダムに無効化されます。

**メカニズム:** Dropoutはニューロン間の共適応（Co-adaptation）を防ぎ、より頑健な特徴表現を学習させます。推論時にはすべてのニューロンを使い、出力を（1-p）でスケーリングします。

### Early Stopping
検証データの損失（Validation Loss）が改善しなくなった時点で学習を停止する手法です。検証損失の改善を一定エポック数監視し、改善がなければ学習を終了します（patience パラメータで設定）。

**利点:** 追加のハイパーパラメータ不要で過学習を簡単に防止できる。計算コストの削減にも貢献。Vertex AI の学習設定で容易に実装可能。`,
          },
          {
            type: "code_example",
            language: "python",
            title: "Vertex AI Custom Training での正則化・Early Stopping 設定",
            code: `import tensorflow as tf
from tensorflow import keras

# ===== L2正則化の設定 =====
l2_reg = keras.regularizers.L2(l=0.01)  # λ=0.01

model = keras.Sequential([
    keras.layers.Dense(256, activation='relu',
                       kernel_regularizer=l2_reg,  # 重みへのL2正則化
                       input_shape=(input_dim,)),
    keras.layers.Dropout(0.3),              # 30%のDropout
    keras.layers.Dense(128, activation='relu',
                       kernel_regularizer=l2_reg),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(1, activation='sigmoid')  # 二値分類
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001,
                                    weight_decay=1e-4),  # AdamW (Weight Decay=L2)
    loss='binary_crossentropy',
    metrics=['accuracy', tf.keras.metrics.AUC(name='auc')]
)

# ===== Early Stopping の設定 =====
early_stopping = keras.callbacks.EarlyStopping(
    monitor='val_auc',        # 監視する指標
    patience=10,              # 10エポック改善なければ停止
    mode='max',               # AUCは大きいほど良い
    restore_best_weights=True # 最良モデルの重みを復元
)

reduce_lr = keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,               # 学習率を半分に
    patience=5,
    min_lr=1e-6
)

# ===== Vertex AI でのカスタムトレーニング実行 =====
# training_job.py として保存し、Vertex AI Custom Job に送信
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=100,
    batch_size=256,
    callbacks=[early_stopping, reduce_lr],
    class_weight={0: 1.0, 1: 10.0}  # 不均衡データ対応のクラス重み
)

# Vertex AI Model Registry に登録
tf.saved_model.save(model, '/tmp/model')
# gcloud ai models upload --region=us-central1 --display-name=my-model --artifact-uri=gs://my-bucket/model`,
            explanation:
              "正則化・Dropout・Early Stoppingを組み合わせることで多層防御的な過学習対策を実現する。class_weightパラメータで不均衡データにも対応。Vertex AIではカスタムコンテナまたはマネージドコンテナでこのコードを実行できる。",
          },
        ],
      },
      {
        id: "pmle-model-build-s4",
        title: "Vertex AI Explainable AI",
        estimatedMinutes: 23,
        blocks: [
          {
            type: "concept_card",
            term: "SHAP値とIntegrated Gradientsによるモデル説明",
            definition:
              "Vertex AI Explainable AIは、モデルの予測に対して「どの特徴量がどれだけ貢献したか」を定量的に説明する機能です。表形式データには**SHAP（SHapley Additive exPlanations）**、画像データには**Integrated Gradients**、テキストデータには**XRAI（eXplanation with Ranked Area Integrals）**が使用されます。これらはVertex AI Endpointのデプロイ設定で有効化できます。",
            useCases: [
              "医療診断モデルで「この患者の予測スコアが高い理由は血圧と年齢が主因」と医師に説明する",
              "与信審査モデルで金融規制（FCRA・AI規制法）に基づき「融資否決の理由」を申込者に説明する",
              "特徴量重要度をグローバルに集計し、モデルに最も影響する特徴量を特定してデータ収集戦略を改善する",
              "モデルの公平性監査で特定グループへのバイアスを数値的に検出する",
            ],
            characteristics: [
              "SHAP値はゲーム理論のシャープレイ値に基づく。各特徴量の貢献度の合計が予測値から期待値を引いた値と等しい（加法性）",
              "Integrated Gradientsは入力から参照点（ベースライン）までの勾配を積分して帰属（Attribution）を計算",
              "グローバル説明（モデル全体の特徴量重要度）とローカル説明（個別予測の説明）の両方を提供",
              "Vertex AI Endpointでexplainabilityを有効化すると、predict()呼び出し時に説明情報も返却される",
              "説明可能性の計算には追加コストと時間が発生するため、本番では設計時から考慮が必要",
            ],
            examRelevance:
              "PMLE試験では「規制要件でモデルの予測根拠の説明が必要」→「Vertex AI Explainable AI / Vertex Explanations」が正答。どの説明手法がどのデータタイプに適用されるかを覚えておく。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "医療・金融分野でのモデル説明可能性の重要性",
            content:
              "PMLE試験で説明可能性が問われる背景：AI規制・業界規制への対応が実際の業務でも重要だからこそ試験に出る。\n\n**規制要件の例：**\n- EU AI規制法（EU AI Act）: 高リスクAIシステム（医療・金融・採用等）は説明可能性が法的要件\n- GDPR: 自動化された意思決定に対する「説明を受ける権利（Right to Explanation）」\n- 金融規制: 与信スコアの理由開示義務（Equal Credit Opportunity Act等）\n\n**Vertex AI Explainable AIの選択肢整理：**\n- **表形式データ**: Sampled Shapley（近似版SHAP）または Kernel SHAP\n- **画像データ**: Integrated Gradients（各ピクセルの貢献度ヒートマップ）\n- **テキストデータ**: XRAI（テキストトークンごとの帰属スコア）\n\n試験では「医療AIで予測根拠を示したい」「金融AIで規制対応」→「Explainable AI with Integrated Gradients/SHAP」が正答パターン。",
          },
        ],
      },
    ],
  },
  {
    id: "pmle-mlops",
    certId: "pmle",
    domainName: "MLOpsとパイプライン",
    title: "MLOpsとパイプライン自動化",
    description:
      "MLモデルの本番運用を支えるMLOpsの思想・Vertex AI Pipelinesによるワークフロー自動化・モデルモニタリングと再学習・生成AI/LLMの実装パターンまでを学習します。PMLE試験で最も重要なドメインの一つです。",
    estimatedMinutes: 95,
    difficulty: "advanced",
    prerequisites: ["pmle-ml-design", "pmle-model-build"],
    sections: [
      {
        id: "pmle-mlops-s1",
        title: "MLOpsとは何か",
        estimatedMinutes: 22,
        blocks: [
          {
            type: "text",
            markdown: `## DevOps vs MLOpsの違い：MLの固有課題

MLOps（Machine Learning Operations）は、機械学習モデルの開発・デプロイ・運用を効率化・自動化・継続的に改善するための実践・原則・ツールの集合体です。DevOpsの原則をML固有の課題に拡張したものです。

### DevOpsとMLOpsの本質的な違い

**DevOpsが扱うもの:** コードが変わればシステムの動作が変わる。テストがパスすれば品質を保証できる。デプロイしたコードは外部要因で動作が変わらない。

**MLOpsが加えて扱うもの:** コードが変わらなくても、**データが変わればモデルの動作が変わる**。これがMLの本質的な難しさです。

**ML固有の課題:**

1. **データの変化によるモデル性能劣化**: 本番環境のデータ分布が学習データから変化すると、コードは同じでもモデルの精度が下がる（データドリフト・コンセプトドリフト）

2. **再現性の困難さ**: 同じコードでも異なるデータ・ライブラリバージョン・乱数シードで異なる結果が出る。実験管理（Experiment Tracking）が必須

3. **学習データの継続的な品質管理**: 本番データを学習データとして再利用する際の品質チェック・バイアス検出が必要

4. **多チームの協働**: データエンジニア・MLエンジニア・MLOpsエンジニア・ビジネスチームが協働するため、インターフェースと標準化が重要

5. **モデルの解釈可能性と公平性**: ビジネス・法規制要件への対応

### ML システムの隠れた技術的負債

Google の論文「Hidden Technical Debt in Machine Learning Systems」では、実際の ML システムで機械学習コードが占める割合はわずか数%であり、残りのほとんどがデータパイプライン・サービングインフラ・モニタリング・設定管理などの**サポートコード**であることが示されています。MLOpsはこのサポートインフラを標準化・自動化することでシステムの保守性を高めます。`,
          },
          {
            type: "comparison_table",
            title: "MLOpsの成熟度レベル比較（レベル0 / 1 / 2）",
            headers: ["成熟度レベル", "特徴", "自動化範囲", "再学習サイクル", "GCPでの実装", "典型的な組織"],
            rows: [
              {
                label: "レベル0: 手動プロセス",
                values: [
                  "データサイエンティストが手動でノートブック上でモデルを開発・デプロイ。スクリプトは手動実行",
                  "なし（すべて手動）",
                  "数ヶ月〜1年（要求があれば手動で実施）",
                  "Vertex AI Workbench（Jupyter）でのアドホック実験のみ",
                  "MLを使い始めたばかりの企業・スタートアップ・少数の本番モデル",
                ],
                highlight: false,
              },
              {
                label: "レベル1: ML パイプラインの自動化",
                values: [
                  "MLパイプラインが自動化され、新しいデータで自動的に再学習・デプロイができる。実験管理が導入される",
                  "学習パイプラインとデプロイが自動化",
                  "数週間〜月次（トリガーベースで自動実施）",
                  "Vertex AI Pipelines + Vertex AI Model Registry + Vertex AI Endpoints",
                  "ML成熟度が中程度の企業・複数の本番モデルを運用するチーム",
                ],
                highlight: true,
              },
              {
                label: "レベル2: CI/CDパイプラインの自動化",
                values: [
                  "パイプラインコード自体のCI/CDが自動化される。パイプラインの変更もテスト・デプロイが自動化",
                  "MLパイプライン自体のビルド・テスト・デプロイも自動化",
                  "継続的（データドリフト検出→自動再学習トリガー）",
                  "Cloud Build + Vertex AI Pipelines + Artifact Registry + Vertex AI Feature Store",
                  "大規模MLチーム・多数の本番モデル・厳格なSLA要件がある組織",
                ],
                highlight: false,
              },
            ],
            footnote:
              "PMLE試験では各レベルの特徴と「次のレベルに進むために何が必要か」を理解しておくこと。多くの組織はレベル0→レベル1への移行に最初の壁がある。",
          },
        ],
      },
      {
        id: "pmle-mlops-s2",
        title: "Vertex AI Pipelines",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "Kubeflow Pipelines v2（KFP v2）の基本概念",
            definition:
              "Kubeflow Pipelines（KFP）はMLワークフローを有向非巡回グラフ（DAG）として定義・実行するOSSのMLOpsフレームワークです。Vertex AI PipelinesはKFP v2のマネージドサービスとして提供されており、インフラ管理なしにスケーラブルなMLパイプラインを実行できます。各処理ステップは独立したコンテナとして実行されるため、スケーラビリティと再現性が高い。",
            useCases: [
              "データ前処理→特徴量エンジニアリング→モデル学習→評価→条件付きデプロイの一連のMLワークフローを自動化",
              "週次で最新データを使ってモデルを再学習し、精度が閾値を超えた場合のみ本番デプロイする",
              "ハイパーパラメータチューニング（Vertex AI Hyperparameter Tuning）をパイプラインに組み込む",
              "MLパイプラインのすべての実行履歴・成果物・メトリクスをLineageとして自動記録する",
            ],
            characteristics: [
              "コンポーネントはDockerコンテナとして定義され、入出力アーティファクト（Dataset・Model等）で接続される",
              "各実行のアーティファクト（学習データ・モデル・評価結果）がVertex ML Metadataに自動記録される",
              "条件分岐（if-else）・ループ・並列実行をPythonコードで表現できる",
              "Vertex AI Experiments と統合して実験結果を比較・管理できる",
              "Cloud Schedulerと連携してcron形式で定期実行のトリガーが可能",
            ],
            examRelevance:
              "PMLE試験では「MLワークフローを自動化したい」→「Vertex AI Pipelines（KFP v2ベース）」が正答。Artifact Lineageの追跡とコンポーネントの独立性がキーワード。",
          },
          {
            type: "code_example",
            language: "python",
            title: "Vertex AI Pipelines：コンポーネント定義とパイプライン構築",
            code: `from kfp.v2 import dsl
from kfp.v2.dsl import (
    component, Dataset, Model, Metrics, Output, Input, Artifact
)
from google.cloud import aiplatform

# ===== コンポーネント定義 =====
@component(
    base_image="python:3.10",
    packages_to_install=["pandas", "scikit-learn", "google-cloud-bigquery"],
)
def preprocess_data(
    project_id: str,
    dataset_id: str,
    output_dataset: Output[Dataset],
):
    """BigQueryからデータを取得して前処理するコンポーネント"""
    from google.cloud import bigquery
    import pandas as pd

    client = bigquery.Client(project=project_id)
    query = f"SELECT * FROM \`{project_id}.{dataset_id}.features\` WHERE date >= '2024-01-01'"
    df = client.query(query).to_dataframe()

    # 前処理
    df = df.dropna()
    df.to_parquet(output_dataset.path)
    print(f"前処理完了: {len(df)} レコード")


@component(
    base_image="python:3.10",
    packages_to_install=["pandas", "scikit-learn", "joblib"],
)
def train_model(
    input_dataset: Input[Dataset],
    model_output: Output[Model],
    metrics: Output[Metrics],
    n_estimators: int = 100,
):
    """モデルを学習するコンポーネント"""
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import f1_score, roc_auc_score
    import joblib

    df = pd.read_parquet(input_dataset.path)
    X = df.drop('target', axis=1)
    y = df['target']
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y)

    model = RandomForestClassifier(n_estimators=n_estimators, class_weight='balanced')
    model.fit(X_train, y_train)

    # 評価指標をVertex ML Metadataに記録
    y_pred = model.predict(X_val)
    f1 = f1_score(y_val, y_pred)
    auc = roc_auc_score(y_val, model.predict_proba(X_val)[:, 1])
    metrics.log_metric("f1_score", f1)
    metrics.log_metric("auc_roc", auc)

    joblib.dump(model, model_output.path + '/model.joblib')
    print(f"学習完了: F1={f1:.4f}, AUC={auc:.4f}")


@component(base_image="python:3.10", packages_to_install=["google-cloud-aiplatform"])
def deploy_model_if_good(
    model: Input[Model],
    metrics: Input[Metrics],
    project_id: str,
    endpoint_name: str,
    f1_threshold: float = 0.85,
):
    """F1スコアが閾値を超えた場合のみデプロイ"""
    from google.cloud import aiplatform

    f1 = metrics.metadata["f1_score"]
    if f1 >= f1_threshold:
        aiplatform.init(project=project_id, location="us-central1")
        # Vertex AI Model Registryに登録してデプロイ
        print(f"F1={f1:.4f} >= 閾値{f1_threshold}。デプロイを実行します。")
    else:
        print(f"F1={f1:.4f} < 閾値{f1_threshold}。デプロイをスキップします。")


# ===== パイプライン定義 =====
@dsl.pipeline(
    name="ml-training-pipeline",
    description="データ前処理→学習→条件付きデプロイのMLパイプライン",
)
def ml_pipeline(
    project_id: str,
    dataset_id: str,
    endpoint_name: str = "production-endpoint",
    n_estimators: int = 100,
):
    preprocess_task = preprocess_data(
        project_id=project_id,
        dataset_id=dataset_id,
    )

    train_task = train_model(
        input_dataset=preprocess_task.outputs["output_dataset"],
        n_estimators=n_estimators,
    )

    deploy_task = deploy_model_if_good(
        model=train_task.outputs["model_output"],
        metrics=train_task.outputs["metrics"],
        project_id=project_id,
        endpoint_name=endpoint_name,
    )


# ===== パイプラインのコンパイルと実行 =====
from kfp.v2 import compiler

compiler.Compiler().compile(
    pipeline_func=ml_pipeline,
    package_path="ml_pipeline.json"
)

aiplatform.init(project="my-project", location="us-central1")
job = aiplatform.PipelineJob(
    display_name="weekly-retraining",
    template_path="ml_pipeline.json",
    parameter_values={
        "project_id": "my-project",
        "dataset_id": "production_data",
        "n_estimators": 200,
    },
)
job.submit()`,
            explanation:
              "KFP v2のポイント：① 各コンポーネントは独立したDockerコンテナで実行 ② Input/Output Artifactで型付きデータ受け渡し ③ Vertex ML Metadataに自動でLineage記録 ④ 条件付きデプロイで精度保証。このパターンがPMLE試験で問われるMLOpsレベル1の実装例。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "Artifact Lineage追跡の重要性",
            content:
              "PMLE試験でVertex AI PipelinesのArtifact Lineageが問われる理由：本番MLシステムの監査可能性・再現性・障害調査に直結するから。\n\n**Artifact Lineageで追跡できること：**\n- どの学習データ（Dataset Artifact）でどのモデル（Model Artifact）が作られたか\n- どのモデルがどの評価結果（Metrics）と紐付いているか\n- 本番エンドポイントにデプロイされているモデルの来歴（データ→学習→評価→デプロイ）\n\n**ビジネス上の重要性：**\n- 「このモデルの予測結果に問題があった。どのデータで学習されたか？」→Lineageで即座に追跡可能\n- AI規制（EU AI Act等）のトレーサビリティ要件への対応\n- モデルのロールバック時に、安全なバージョンの来歴を確認\n\n試験では「モデルの来歴・追跡可能性が必要」→「Vertex ML Metadata / Artifact Lineage」が正答。",
          },
        ],
      },
      {
        id: "pmle-mlops-s3",
        title: "モデルモニタリングと再学習",
        estimatedMinutes: 23,
        blocks: [
          {
            type: "concept_card",
            term: "データドリフト / コンセプトドリフト / 予測ドリフトの違い",
            definition:
              "本番MLシステムでモデルの性能が劣化する主要原因である3種類のドリフト（Drift）を理解することはMLOpsエンジニアにとって必須です。ドリフトの種別を正確に診断することで、適切な対処法を選択できます。",
            useCases: [
              "データドリフト: ECサイトで新商品カテゴリが増え、入力特徴量の分布が学習時と変わった",
              "コンセプトドリフト: COVID-19後に顧客の購買行動パターンが大きく変わり、学習済みモデルの前提が崩れた",
              "予測ドリフト: モデルの出力分布が変化し、以前は均等だったクラス予測が特定クラスに偏り始めた",
              "季節性ドリフト: 毎年恒例のセール期間にユーザー行動が変化し、モデルの精度が一時的に低下する",
            ],
            characteristics: [
              "データドリフト（Feature Drift）: 入力特徴量X の分布 P(X) が変化。統計的検定（PSI・KLダイバージェンス）で検出",
              "コンセプトドリフト: 入力Xと正解ラベルYの関係 P(Y|X) が変化。モデルの予測精度の実際の低下として現れる",
              "予測ドリフト（Prediction Drift）: モデル出力の分布が変化。ラベルなしでもリアルタイムで検出可能",
              "Vertex AI Model Monitoringは特徴量分布の統計的比較でデータドリフトを自動検出してアラート発報",
              "コンセプトドリフトは正解ラベルが必要なため、遅延してしか検出できない（ラベリング遅延問題）",
            ],
            examRelevance:
              "PMLE試験最頻出：「本番モデルの精度が劣化している原因は？」→3種類のドリフトの区別が問われる。データドリフトはVertex AI Model Monitoringで自動検出できるが、コンセプトドリフトは実際の正解ラベルが必要な点が試験でのポイント。",
          },
          {
            type: "text",
            markdown: `## 再学習トリガーの設計パターン

モデルの再学習（Retraining）をいつ・どのようにトリガーするかは、MLOpsシステム設計の重要な意思決定です。

### 再学習トリガーの種類

**1. スケジュールベース（Schedule-based）**
一定の時間間隔で定期的に再学習を実行します。
- 例: 毎週月曜日0時に先週のデータを使って再学習
- **メリット**: シンプルで予測可能。ドリフト検出の仕組みが不要
- **デメリット**: 必要がないときも再学習コストが発生。急激なドリフトに対応が遅い
- **GCP実装**: Cloud Scheduler → Vertex AI Pipeline の定期実行

**2. パフォーマンスベース（Performance-based）**
モデルの評価指標が閾値を下回ったときに再学習をトリガーします。
- 例: AUC-ROCが0.85を下回ったらアラート→再学習
- **メリット**: 必要な時だけ再学習。コスト効率が高い
- **デメリット**: ラベルが必要（ラベリング遅延）。予測ドリフトとコンセプトドリフトの区別が必要
- **GCP実装**: Vertex AI Model Monitoring → Pub/Sub → Cloud Functions → Vertex AI Pipeline

**3. ドリフトベース（Drift-based）**
データドリフトや予測ドリフトの統計的検定が閾値を超えたときにトリガーします。
- 例: 入力特徴量の分布変化（PSI > 0.2）を検出したら再学習
- **メリット**: ラベルなしでリアルタイムに検出可能。早期対応ができる
- **デメリット**: データドリフトが必ずしも精度劣化につながるわけではない
- **GCP実装**: Vertex AI Model Monitoring → Alert → Vertex AI Pipeline

**4. ハイブリッドアプローチ（推奨）**
スケジュール＋ドリフト検出を組み合わせ、通常は定期実行しつつ急激なドリフト時は即座に再学習します。

### Vertex AI Model Monitoring の設定

Vertex AI Model Monitoringでは以下を監視できます：
- **特徴量スキュー（Skew）**: 本番データが学習データから外れていないか
- **特徴量ドリフト（Drift）**: 本番データの分布が時間的に変化していないか
- **予測ドリフト**: 予測出力の分布変化
- アラートはEmail・Pub/Sub経由で通知。統計的手法はJensen-Shannon Divergence、L-infinityなどを選択可能`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験頻出：ドリフト検出方法とVertex AI Model Monitoring",
            content:
              "PMLE試験でドリフト検出問題が出たら：\n\n**何を監視する？（Vertex AI Model Monitoring の設定項目）**\n① Training-Serving Skew: 学習データと本番データの統計的差異\n② Prediction Drift: 時間的な予測分布の変化\n\n**どの統計量で検出する？**\n- 数値特徴量: Jensen-Shannon Divergence、Wasserstein距離\n- カテゴリカル特徴量: L-infinity distance、χ²検定\n- PSI（Population Stability Index）: 分布変化の大きさを数値化（0.2以上で要注意）\n\n**試験の典型パターン：**\n「本番モデルの精度が下がっているが原因がわからない」→「Vertex AI Model Monitoringを設定してデータドリフトと予測ドリフトを監視する」が正答。\n\n「コンセプトドリフトを検出するには？」→「グランドトゥルース（正解ラベル）が必要なためリアルタイム検出は難しい。遅延後のラベルデータで精度を計算して監視する」が正答。",
          },
        ],
      },
      {
        id: "pmle-mlops-s4",
        title: "生成AI・LLMの実装",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "RAGパターン（Retrieval-Augmented Generation）の仕組み",
            definition:
              "RAG（Retrieval-Augmented Generation）は、大規模言語モデル（LLM）の知識不足や幻覚（Hallucination）の問題を解決するアーキテクチャパターンです。ユーザーのクエリに対して関連ドキュメントをベクトル検索でリアルタイムに取得し、取得した文書をコンテキストとしてLLMへ提供することで、最新情報・ドメイン固有知識に基づいた正確な回答を生成します。",
            useCases: [
              "社内ナレッジベース（社内ポリシー・製品マニュアル）を参照するQAチャットボットを構築する",
              "最新の論文・ニュースを継続的にインデックスし、LLMが最新情報を参照して回答できるようにする",
              "法律・医療ドキュメントへの引用付き回答システムで、回答根拠のトレーサビリティを確保する",
              "カスタマーサポートで過去の解決事例を参照しながら新しいチケットへの回答を自動生成する",
            ],
            characteristics: [
              "処理フロー: ①クエリをEmbedding変換 → ②Vector Searchで類似ドキュメントを検索 → ③ドキュメントをプロンプトに埋め込み → ④LLMが文脈付き回答を生成",
              "ファインチューニングと異なり、追加学習なしにドキュメントを更新できる（ドキュメントの追加・削除が即座に反映）",
              "取得する文書数（top-K）、類似度しきい値、チャンク（分割）サイズが精度に大きく影響するハイパーパラメータ",
              "GCPではVertex AI Vector Search（旧Matching Engine）で大規模ベクトルインデックスを管理・検索",
              "RAGの品質評価指標: Faithfulness（取得文書への忠実度）・Answer Relevancy・Context Recall",
            ],
            examRelevance:
              "PMLE試験では「LLMに社内データを参照させたい」「ハルシネーションを減らしたい」「最新情報を参照させたい」→「RAGパターン」が正答。ファインチューニングとの使い分けを明確に理解すること。",
          },
          {
            type: "text",
            markdown: `## Vertex AI Vector Search + Gemini APIによる RAG 実装

### Vertex AI Vector Search（旧Matching Engine）

Vertex AI Vector Searchは、数十億規模のベクトルに対して低レイテンシ（数ミリ秒）でANN（Approximate Nearest Neighbor）検索を実行するマネージドサービスです。Google独自のScaNN（Scalable Nearest Neighbors）アルゴリズムを使用し、業界最高クラスのパフォーマンスを提供します。

**主要概念:**
- **Index（インデックス）**: ベクトルデータを格納・検索する単位。ベクトルの次元数とアルゴリズムパラメータを設定
- **IndexEndpoint（インデックスエンドポイント）**: インデックスをデプロイして検索APIを提供するサービスエンドポイント
- **Embedding（埋め込み）**: テキスト・画像をベクトルに変換。Vertex AI Embeddings APIやtext-embedding-004モデルを使用

### RAGパターンの実装フロー

**1. ドキュメントの準備とインデックス構築（オフライン）**
\`\`\`
ドキュメント収集（PDF/HTML/テキスト）
→ チャンク分割（500〜1000トークン単位）
→ Embedding生成（text-embedding-004 API）
→ Vertex AI Vector Search インデックスに登録
\`\`\`

**2. リアルタイム検索と回答生成（オンライン）**
\`\`\`
ユーザークエリ
→ クエリをEmbedding変換
→ Vector Searchで上位K件のチャンクを取得
→ 取得チャンクをGeminiプロンプトに挿入
→ Geminiが文脈付き回答を生成
→ ユーザーへの回答（引用元付き）
\`\`\`

### Vertex AI Agent Builder（旧Vertex AI Search and Conversation）

より高レベルな抽象化として、Vertex AI Agent BuilderではRAGパターンをノーコード/ローコードで構築できます。データストアとしてCloud Storage・BigQuery・ウェブサイトをそのまま使えるため、Embedding生成やVector Searchの詳細を意識せずにRAGシステムを構築できます。`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "RAG vs ファインチューニングの使い分け",
            content:
              "PMLE試験で生成AI問題の最重要判断軸：RAGとファインチューニングのどちらを選ぶか。\n\n**RAGが適しているケース：**\n- 最新情報・頻繁に更新されるデータを参照させたい\n- 社内固有の文書・ナレッジベースを参照させたい\n- 回答の根拠（ソース）を示す必要がある\n- 学習コストを抑えたい（GPUリソースが不要）\n- ドキュメントの追加・更新を即座に反映させたい\n\n**ファインチューニングが適しているケース：**\n- LLMの出力スタイル・形式・トーンを変えたい（特定ドメインの文体で書いてほしい）\n- 特定のタスクでの専門的なパフォーマンスを最大化したい（コード生成等）\n- プロンプトが非常に長くなりAPIコストが高い場合\n- 応答の一貫性・予測可能性を高めたい\n\n**実務での推奨アプローチ：** まずRAGを試し、それで不十分な場合にファインチューニングを検討する。多くのユースケースではRAGで十分。\n\n試験では「社内文書をLLMに参照させて回答させたい」→「RAG（Vertex AI Vector Search + Gemini API）」が最も適切な正答。",
          },
        ],
      },
    ],
  },
]
