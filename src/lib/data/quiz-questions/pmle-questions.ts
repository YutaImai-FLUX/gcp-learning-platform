import type { QuizQuestion } from "@/lib/types/quiz"

export const PMLE_EXTRA_QUESTIONS: QuizQuestion[] = [
  // ─── MLの問題の設計 (19%) ───
  {
    id: "pmle-013",
    certId: "pmle",
    domain: "MLの問題の設計",
    difficulty: "easy",
    question:
      "ビジネス要件をML問題として定式化する際、最初に検討すべきことはどれですか？",
    options: [
      "使用するモデルアーキテクチャの選定",
      "問題がMLで解決すべきかどうかの妥当性評価",
      "GPUインスタンスのサイズ選定",
      "モデルのハイパーパラメータチューニング戦略",
    ],
    correctIndex: 1,
    explanation:
      "ML問題の設計において最初に行うべきは、その問題がMLで解くべきかどうかの妥当性評価です。ルールベースのアプローチで十分な場合や、十分な学習データが得られない場合は、MLを適用しないほうがコスト効率が良いことがあります。",
    tags: ["ml-design", "problem-framing", "feasibility"],
  },
  {
    id: "pmle-014",
    certId: "pmle",
    domain: "MLの問題の設計",
    difficulty: "medium",
    question:
      "ECサイトで「購入しそうな商品をユーザーに推薦する」というビジネス要件をMLで実現する場合、最も適切なML設計パターンはどれですか？",
    options: [
      "バイナリ分類モデルで各商品の購入確率を予測する",
      "回帰モデルで売上金額を予測する",
      "教師なし学習でユーザーをクラスタリングし、クラスタごとに人気商品を表示する",
      "協調フィルタリングとコンテンツベースフィルタリングを組み合わせたハイブリッド推薦システムを構築する",
    ],
    correctIndex: 3,
    explanation:
      "推薦システムでは、協調フィルタリング（ユーザーの行動パターンの類似性）とコンテンツベースフィルタリング（商品属性の類似性）を組み合わせたハイブリッドアプローチが最も効果的です。コールドスタート問題にも対応でき、推薦の多様性と精度のバランスが取れます。",
    tags: ["ml-design", "recommendation", "design-patterns"],
  },
  {
    id: "pmle-015",
    certId: "pmle",
    domain: "MLの問題の設計",
    difficulty: "hard",
    question:
      "医療画像診断のMLシステムにおいて、モデルの予測根拠を医師に提示する必要があります。最も適切なアプローチはどれですか？",
    options: [
      "モデルの精度を最大化し、予測結果のみを提示する",
      "Grad-CAMやIntegrated Gradientsなどの説明可能AI手法を用いて、判断根拠をヒートマップで可視化する",
      "決定木モデルのみを使用して解釈性を確保する",
      "モデルの学習ログをすべて医師に提供する",
    ],
    correctIndex: 1,
    explanation:
      "医療分野では、モデルの説明可能性（Explainability）が規制要件として求められることがあります。Grad-CAMやIntegrated Gradientsなどの手法を用いることで、CNNなどの複雑なモデルでも、画像のどの領域が判断に寄与したかをヒートマップで可視化できます。Vertex AIのExplainable AIもこれらの手法をサポートしています。",
    tags: ["model-explainability", "xai", "grad-cam", "vertex-ai"],
  },
  {
    id: "pmle-016",
    certId: "pmle",
    domain: "MLの問題の設計",
    difficulty: "hard",
    question:
      "MLシステム設計において、トレーニング時と推論時の特徴量計算の不一致（Training-Serving Skew）を防ぐための最も効果的なアプローチはどれですか？",
    options: [
      "トレーニングと推論で異なる特徴量パイプラインを構築し、それぞれ最適化する",
      "Vertex AI Feature Storeを使用して、トレーニングと推論で同一の特徴量定義と計算ロジックを共有する",
      "推論時にはバッチ予測のみを使用し、リアルタイム予測を避ける",
      "特徴量の前処理をすべてクライアント側で実行する",
    ],
    correctIndex: 1,
    explanation:
      "Training-Serving Skewは、トレーニング時と推論時の特徴量計算ロジックの不一致によって発生する深刻な問題です。Vertex AI Feature Storeを使用することで、特徴量の定義・計算・提供を一元管理でき、トレーニングとオンライン推論の両方で一貫した特徴量を使用できます。",
    tags: [
      "feature-store",
      "training-serving-skew",
      "feature-engineering",
      "vertex-ai",
    ],
  },
  // ─── MLモデルの構築 (20%) ───
  {
    id: "pmle-017",
    certId: "pmle",
    domain: "MLモデルの構築",
    difficulty: "easy",
    question:
      "Vertex AI上でカスタムモデルのハイパーパラメータチューニングを実行する際に使用するサービスはどれですか？",
    options: [
      "Vertex AI Pipelines",
      "Vertex AI Training（Hyperparameter Tuning Job）",
      "Vertex AI Feature Store",
      "Vertex AI Model Monitoring",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI TrainingのHyperparameter Tuning Jobを使用すると、ベイズ最適化などのアルゴリズムにより、学習率やバッチサイズなどのハイパーパラメータの最適な組み合わせを自動的に探索できます。並列試行数や最大試行数を指定して効率的にチューニングを実行できます。",
    tags: ["hyperparameter-tuning", "vertex-ai-training", "bayesian-optimization"],
  },
  {
    id: "pmle-018",
    certId: "pmle",
    domain: "MLモデルの構築",
    difficulty: "medium",
    question:
      "大規模な表形式データに対して特徴量エンジニアリングを行う際、Vertex AIで推奨されるアプローチはどれですか？",
    options: [
      "ローカルマシンでpandasを使用して前処理する",
      "Cloud Dataflow（Apache Beam）を使用してスケーラブルな前処理パイプラインを構築する",
      "BigQueryにすべてのデータをロードし、SQLのみで特徴量を生成する",
      "Compute Engine上でカスタムスクリプトを実行する",
    ],
    correctIndex: 1,
    explanation:
      "大規模データの特徴量エンジニアリングには、Cloud Dataflow（Apache Beam）が推奨されます。分散処理により数TBのデータも効率的に処理でき、tf.Transformと統合することでトレーニングと推論で一貫した前処理パイプラインを構築できます。バッチ処理とストリーミング処理の両方に対応しています。",
    tags: [
      "feature-engineering",
      "dataflow",
      "apache-beam",
      "tf-transform",
    ],
  },
  {
    id: "pmle-019",
    certId: "pmle",
    domain: "MLモデルの構築",
    difficulty: "medium",
    question:
      "TFX（TensorFlow Extended）パイプラインにおいて、データの統計情報を生成し、スキーマの異常を検出するコンポーネントの正しい組み合わせはどれですか？",
    options: [
      "ExampleGen → Trainer → Evaluator",
      "StatisticsGen → SchemaGen → ExampleValidator",
      "Transform → Tuner → InfraValidator",
      "Resolver → Pusher → BulkInferrer",
    ],
    correctIndex: 1,
    explanation:
      "TFXパイプラインでは、StatisticsGenがデータの統計情報（平均、分散、分布など）を生成し、SchemaGenがその統計情報からデータスキーマ（特徴量の型、範囲、必須項目など）を推定します。ExampleValidatorはスキーマに基づいてデータの異常（欠損値の増加、分布の変化など）を検出します。",
    tags: ["tfx", "data-validation", "statistics-gen", "schema-gen"],
  },
  {
    id: "pmle-020",
    certId: "pmle",
    domain: "MLモデルの構築",
    difficulty: "hard",
    question:
      "分散トレーニングにおいて、データ並列処理とモデル並列処理の使い分けとして正しい記述はどれですか？",
    options: [
      "データ並列処理はモデルが大きすぎて1台のGPUに収まらない場合に使用する",
      "モデル並列処理はデータセットが大きすぎてメモリに収まらない場合に使用する",
      "データ並列処理は同じモデルの複製を複数のワーカーに配置し各ワーカーがデータの異なるサブセットで計算する方式で、モデル並列処理はモデル自体を分割して複数のデバイスに配置する方式である",
      "データ並列処理とモデル並列処理は同時に使用できない",
    ],
    correctIndex: 2,
    explanation:
      "データ並列処理は、モデルのコピーを複数のワーカーに配置し、ミニバッチを分割して各ワーカーで計算後に勾配を集約する方式です。モデル並列処理は、大規模なモデル（例：LLM）を層ごとやテンソルごとに分割して複数のデバイスに配置する方式です。実際にはこれらを組み合わせたハイブリッド並列処理も一般的です。",
    tags: ["distributed-training", "data-parallelism", "model-parallelism"],
  },
  // ─── MLパイプラインの自動化とオーケストレーション (21%) ───
  {
    id: "pmle-021",
    certId: "pmle",
    domain: "MLパイプラインの自動化とオーケストレーション",
    difficulty: "easy",
    question:
      "Vertex AI Pipelinesで使用されるパイプライン定義の標準フォーマットはどれですか？",
    options: [
      "Apache Airflow DAG（Python）",
      "Kubeflow Pipelines（KFP）SDKまたはTFXによるパイプライン定義",
      "Cloud Composer のワークフローYAML",
      "Jenkins Pipeline（Groovy）",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI Pipelinesは、Kubeflow Pipelines（KFP）SDKまたはTFXで定義されたパイプラインを実行するマネージドサービスです。KFP SDKではPythonデコレータを使用してコンポーネントとパイプラインを定義し、YAML形式にコンパイルして実行します。サーバーレスで実行されるため、インフラ管理が不要です。",
    tags: ["vertex-ai-pipelines", "kubeflow", "kfp", "pipeline-orchestration"],
  },
  {
    id: "pmle-022",
    certId: "pmle",
    domain: "MLパイプラインの自動化とオーケストレーション",
    difficulty: "medium",
    question:
      "CI/CDをMLパイプラインに統合する際、モデルの再トレーニングを自動的にトリガーするのに最も適切なイベントはどれですか？",
    options: [
      "開発者がコードをコミットした時のみ",
      "新しいトレーニングデータの到着、データドリフトの検出、またはスケジュール実行",
      "モデルの推論レイテンシが閾値を超えた時のみ",
      "Vertex AI Model Registryに新しいモデルが登録された時",
    ],
    correctIndex: 1,
    explanation:
      "MLOpsにおけるCI/CDでは、コード変更だけでなく、新しいデータの到着やデータドリフトの検出もパイプライン実行のトリガーとなります。Cloud Schedulerによる定期実行、Cloud FunctionsやEventarcによるイベント駆動型トリガー、Model Monitoringからのアラートに基づく自動再トレーニングなど、複数のトリガー条件を組み合わせることが推奨されます。",
    tags: ["ci-cd", "mlops", "pipeline-trigger", "automation"],
  },
  {
    id: "pmle-023",
    certId: "pmle",
    domain: "MLパイプラインの自動化とオーケストレーション",
    difficulty: "hard",
    question:
      "Vertex AI Pipelinesでモデルの品質ゲートを実装し、本番デプロイの前に自動承認/拒否を行うアーキテクチャとして最も適切なのはどれですか？",
    options: [
      "パイプライン完了後に手動でモデルの性能を確認してデプロイする",
      "パイプライン内にモデル評価コンポーネントを配置し、精度が閾値を満たす場合のみ条件分岐でVertex AI Model Registryへの登録とエンドポイントへのデプロイを実行する",
      "すべてのモデルを自動的にデプロイし、トラフィック分割で徐々にロールアウトする",
      "Cloud Build のみで品質ゲートを管理する",
    ],
    correctIndex: 1,
    explanation:
      "MLパイプラインのベストプラクティスとして、モデル評価コンポーネントで精度・再現率・AUCなどの指標を自動計算し、事前定義した閾値との比較結果に基づいて条件分岐を行います。合格した場合のみModel Registryに登録し、エンドポイントへのデプロイを自動実行します。これによりMLOps Level 2の継続的デリバリーが実現できます。",
    tags: [
      "quality-gate",
      "vertex-ai-pipelines",
      "model-registry",
      "mlops-level2",
    ],
  },
  {
    id: "pmle-024",
    certId: "pmle",
    domain: "MLパイプラインの自動化とオーケストレーション",
    difficulty: "hard",
    question:
      "TFXパイプラインをVertex AI Pipelines上で運用する際、パイプラインのメタデータ管理とアーティファクト追跡に使用されるサービスはどれですか？",
    options: [
      "Cloud Storage のバージョニング機能",
      "Vertex ML Metadata（ML Metadata Store）",
      "BigQuery のテーブルバージョニング",
      "Cloud Logging",
    ],
    correctIndex: 1,
    explanation:
      "Vertex ML Metadata（MLMD）は、パイプラインの実行履歴、アーティファクト（データセット、モデル、評価結果など）、実行コンテキストを自動的に記録・追跡するサービスです。パイプラインの各ステップの入出力の系譜（Lineage）を追跡でき、モデルの再現性やデバッグに不可欠です。TFXとKFPの両方と統合されています。",
    tags: ["ml-metadata", "artifact-tracking", "lineage", "tfx", "vertex-ai"],
  },
  // ─── MLモデルの提供と共有 (19%) ───
  {
    id: "pmle-025",
    certId: "pmle",
    domain: "MLモデルの提供と共有",
    difficulty: "easy",
    question:
      "Vertex AI Model Registryの主な目的として正しいものはどれですか？",
    options: [
      "モデルのトレーニングを高速化する",
      "モデルのバージョン管理、メタデータ管理、デプロイ先の一元管理を行う",
      "特徴量の保存と提供を行う",
      "データパイプラインのオーケストレーションを行う",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI Model Registryは、トレーニング済みモデルのバージョン管理、メタデータ（評価指標、トレーニングパイプラインへのリンクなど）の記録、デプロイ先エンドポイントの管理を一元的に行うサービスです。TensorFlow、PyTorch、scikit-learnなど複数のフレームワークのモデルを統一的に管理できます。",
    tags: ["model-registry", "vertex-ai", "model-versioning"],
  },
  {
    id: "pmle-026",
    certId: "pmle",
    domain: "MLモデルの提供と共有",
    difficulty: "medium",
    question:
      "本番環境で新しいモデルバージョンの効果を検証するためにA/Bテストを実施する場合、Vertex AIで推奨されるアプローチはどれですか？",
    options: [
      "2つの別々のエンドポイントを作成し、クライアント側でトラフィックを分割する",
      "1つのエンドポイントに複数のモデルバージョンをデプロイし、トラフィック分割を設定する",
      "バッチ予測で両モデルの結果を比較する",
      "オフライン評価のみで判断する",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AIのエンドポイントでは、1つのエンドポイントに複数のDeployedModelを設定し、各モデルへのトラフィック比率（例：90%を既存モデル、10%を新モデル）を指定できます。これにより、同一エンドポイントでA/Bテストを実行し、リアルタイムのパフォーマンスを比較してから段階的にトラフィックを移行できます。",
    tags: ["a-b-testing", "traffic-splitting", "vertex-ai-endpoint", "canary-deployment"],
  },
  {
    id: "pmle-027",
    certId: "pmle",
    domain: "MLモデルの提供と共有",
    difficulty: "medium",
    question:
      "モデルの推論レイテンシを最小化しつつコストを最適化するために、Vertex AIエンドポイントで設定すべき項目の組み合わせとして最も適切なのはどれですか？",
    options: [
      "GPUの数を最大にし、常時最大インスタンス数を維持する",
      "マシンタイプの適切な選択、オートスケーリング（最小/最大ノード数）、モデルのバッチ推論の活用",
      "すべてリアルタイム予測で処理し、オートスケーリングは無効にする",
      "最も安いマシンタイプを使用し、レイテンシは許容する",
    ],
    correctIndex: 1,
    explanation:
      "推論のレイテンシとコストの最適化には、ワークロードに適したマシンタイプ（CPU/GPU）の選択、オートスケーリングによる需要に応じたリソース調整、大量データにはバッチ予測の活用が重要です。さらに、モデルの最適化（量子化、蒸留）やリクエストバッチングも有効な手段です。",
    tags: ["serving-optimization", "autoscaling", "latency", "cost-optimization"],
  },
  // ─── MLソリューションの監視、最適化、保守 (21%) ───
  {
    id: "pmle-028",
    certId: "pmle",
    domain: "MLソリューションの監視、最適化、保守",
    difficulty: "medium",
    question:
      "データドリフトとコンセプトドリフトの違いについて正しい説明はどれですか？",
    options: [
      "データドリフトはモデルの精度低下を指し、コンセプトドリフトはデータの欠損を指す",
      "データドリフトは入力データの分布が変化することで、コンセプトドリフトは入力と出力の関係性が変化することである",
      "データドリフトはバッチ予測でのみ発生し、コンセプトドリフトはリアルタイム予測でのみ発生する",
      "データドリフトとコンセプトドリフトは同じ現象の異なる呼び方である",
    ],
    correctIndex: 1,
    explanation:
      "データドリフト（共変量シフト）は、入力特徴量の統計的分布がトレーニング時と推論時で変化する現象です。一方、コンセプトドリフトは入力データと目的変数の関係性自体が変化する現象です。例えば、ECサイトでユーザーの購買パターン自体が変化するのがコンセプトドリフトです。Vertex AI Model Monitoringは両方のドリフトを検出できます。",
    tags: ["data-drift", "concept-drift", "model-monitoring", "distribution-shift"],
  },
  {
    id: "pmle-029",
    certId: "pmle",
    domain: "MLソリューションの監視、最適化、保守",
    difficulty: "hard",
    question:
      "Vertex AI Model Monitoringで特徴量のドリフトを検出した後、モデルの性能劣化に対処するための最も包括的なアプローチはどれですか？",
    options: [
      "ドリフトが検出された特徴量を即座に削除してモデルを再トレーニングする",
      "アラートに基づいてドリフトの根本原因を分析し、新しいデータでモデルを再トレーニングし、A/Bテストで検証後に段階的にデプロイする",
      "モデルの閾値を調整して、ドリフト検出の感度を下げる",
      "新しいモデルを即座にデプロイし、古いモデルを削除する",
    ],
    correctIndex: 1,
    explanation:
      "ドリフト検出後の対応は、(1)根本原因分析（データソースの変化、季節性、外部要因など）、(2)新しいデータを含む再トレーニング、(3)オフライン評価、(4)A/Bテストによるオンライン検証、(5)段階的なトラフィック移行という体系的なプロセスが必要です。単純な特徴量の削除やモデルの即時差し替えはリスクが高く推奨されません。",
    tags: [
      "model-monitoring",
      "drift-remediation",
      "retraining",
      "a-b-testing",
      "vertex-ai",
    ],
  },
  {
    id: "pmle-030",
    certId: "pmle",
    domain: "MLソリューションの監視、最適化、保守",
    difficulty: "hard",
    question:
      "本番環境のMLモデルのパフォーマンスを継続的に監視するために、Vertex AI Model Monitoringで設定できる監視項目の組み合わせとして正しいものはどれですか？",
    options: [
      "CPUメモリ使用率とディスクI/Oのみ",
      "特徴量ドリフト検出、予測ドリフト検出、特徴量の属性スキュー検出",
      "モデルの学習曲線とバリデーション損失のみ",
      "APIのレスポンスタイムとエラーレートのみ",
    ],
    correctIndex: 1,
    explanation:
      "Vertex AI Model Monitoringは、(1)特徴量ドリフト検出（トレーニングデータとサービング入力の分布比較）、(2)予測ドリフト検出（予測結果の分布変化）、(3)特徴量の属性スキュー検出（トレーニングとサービングの特徴量分布の乖離）を監視できます。Jensen-Shannon距離やL∞距離などの統計的手法で閾値ベースのアラートを設定し、Cloud Monitoringと連携して通知を行います。",
    tags: [
      "model-monitoring",
      "feature-drift",
      "prediction-drift",
      "skew-detection",
      "vertex-ai",
    ],
  },
]
