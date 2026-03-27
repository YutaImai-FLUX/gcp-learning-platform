import type { StudyModule } from "@/lib/types/study-module"

export const PDE_MODULES: StudyModule[] = [
  {
    id: "pde-storage-design",
    certId: "pde",
    domainName: "データ処理システムの設計",
    title: "GCPデータストレージ設計",
    description:
      "Cloud SQL・Spanner・Firestore・Bigtable・BigQueryの特性を理解し、ユースケースに応じた最適なストレージを選択する方法を学習します。",
    estimatedMinutes: 60,
    difficulty: "advanced",
    prerequisites: [],
    relatedLabIds: ["pde-bigquery-optimize"],
    sections: [
      {
        id: "pde-storage-s1",
        title: "GCPデータベース完全比較",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown:
              "GCPには用途に応じた複数のデータストレージサービスが存在します。適切なサービスを選択することが、データエンジニアリングの核心です。\n\n各サービスの特性を理解し、ワークロードに最適なものを選びましょう。",
          },
          {
            type: "comparison_table",
            title: "GCPデータベース完全比較",
            headers: ["サービス", "モデル", "スケール", "整合性", "最適ユースケース", "試験キーワード"],
            rows: [
              {
                label: "Cloud SQL",
                values: ["リレーショナル (MySQL/PG)", "垂直 (max 96 vCPU)", "強整合性", "OLTP・既存DB移行", "リフトアンドシフト・PostgreSQL互換"],
              },
              {
                label: "Cloud Spanner",
                values: ["分散リレーショナル", "水平 (無制限)", "外部整合性", "グローバルECサイト・金融", "グローバル・水平スケール・ACID"],
                highlight: true,
              },
              {
                label: "Firestore",
                values: ["NoSQLドキュメント", "自動", "強整合性 (同一Doc)", "モバイルアプリ・リアルタイム同期", "モバイル・オフライン同期・スキーマレス"],
              },
              {
                label: "Cloud Bigtable",
                values: ["NoSQL列指向", "水平 (ペタバイト)", "結果整合性", "時系列・IoTログ・広告クリック", "時系列・書き込みスループット・HBase互換"],
              },
              {
                label: "BigQuery",
                values: ["分析DWH (OLAP)", "サーバーレス", "スナップショット", "BI分析・アドホッククエリ", "ペタバイト分析・スキャン量課金"],
              },
              {
                label: "Memorystore",
                values: ["インメモリ (Redis)", "単一リージョン", "揮発性", "セッション・キャッシュ", "低レイテンシ・ms以下・キャッシュ"],
              },
            ],
            footnote: "試験ではユースケースからサービスを選ぶ問題が多数出題されます",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験頻出: DB選択の判断基準",
            content:
              "• 「グローバル」「水平スケール」「ACID」→ Cloud Spanner\n• 「時系列」「IoT」「書き込みスループット」→ Bigtable\n• 「モバイル」「リアルタイム同期」→ Firestore\n• 「ペタバイト分析」「アドホッククエリ」→ BigQuery\n• 「PostgreSQL互換」「既存DB移行」→ Cloud SQL",
          },
        ],
      },
      {
        id: "pde-storage-s2",
        title: "Cloud Bigtable Row Key設計",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown:
              "Cloud Bigtableは世界最大規模のNoSQLデータベースです。Row Keyの設計が性能に直結します。\n\n**Bigtableのアーキテクチャ:**\n- データはRow Keyでソートされて格納される\n- 同じRow Keyプレフィックスを持つデータは同じタブレットに配置される\n- タブレットは自動的に分割・結合される",
          },
          {
            type: "key_point",
            level: "warning",
            title: "Hotspot問題: 最も注意すべき設計ミス",
            content:
              "連続するタイムスタンプやインクリメントするIDをRow Keyのプレフィックスに使うと、全ての書き込みが単一のタブレットに集中します（Hotspot）。これによりスループットが大幅に低下します。",
          },
          {
            type: "concept_card",
            term: "Row Key設計パターン",
            definition: "Bigtableで高スループットを実現するためのRow Key構造パターン",
            useCases: [
              "Reversed Timestamp: 最新データを先頭に配置 (例: 9999999999-userId)",
              "Salting: プレフィックスにランダム値を付加して分散 (例: hash%10-timestamp)",
              "Field Promotion: クエリ頻度の高いフィールドをRow Keyに昇格",
            ],
            characteristics: [
              "Row Keyは最大4KB",
              "Row Keyの順序でデータがソートされる",
              "スキャン範囲を限定するためにRow Keyプレフィックスを活用する",
              "Hot Rowを避けるためにランダム性を持たせる",
            ],
            examRelevance: "PDE試験では「高書き込みスループットを実現するRow Key設計」が頻出。Reversed Timestampパターンを理解すること",
          },
          {
            type: "code_example",
            language: "bash",
            title: "cbt コマンドでBigtableを操作",
            code: `# テーブル作成
cbt createtable iot-data

# カラムファミリー追加
cbt createfamily iot-data cf1

# データ書き込み (Reversed Timestamp パターン)
REVERSED_TS=$(( 9999999999 - $(date +%s) ))
cbt set iot-data "\${REVERSED_TS}#device001" cf1:temperature=25.3

# 最新データ取得
cbt read iot-data prefix="\${REVERSED_TS:0:6}" count=10`,
            explanation:
              "9999999999からUnixタイムスタンプを引くことで、新しいデータほど小さい数値になり、Row Keyソートで最新データが先頭に来ます。",
          },
        ],
      },
      {
        id: "pde-storage-s3",
        title: "BigQueryのパーティションとクラスタリング",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "comparison_table",
            title: "BigQueryパーティション種別",
            headers: ["種別", "パーティションキー", "メリット", "ユースケース"],
            rows: [
              { label: "時間分割", values: ["DATE/TIMESTAMP/DATETIME", "日次/月次/年次のデータで大幅コスト削減", "ログ・イベント・トランザクション"] },
              { label: "整数範囲分割", values: ["INTEGER", "連番IDでの均等分割", "ユーザーID・商品IDベースのデータ"] },
              { label: "取り込み時間", values: ["_PARTITIONTIME", "INSERT時刻で自動分割", "ストリーミング取り込みデータ"] },
            ],
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "パーティションとクラスタリングの組み合わせ",
            content:
              "パーティションは「スキャン対象ファイルの絞り込み」、クラスタリングは「ファイル内のスキャン範囲の絞り込み」です。\n\n推奨: `PARTITION BY DATE(event_time) CLUSTER BY user_id, event_type`\n\nコスト: パーティションフィルタで大幅削減。さらにクラスタリングで20-50%の追加削減が可能。",
          },
          {
            type: "code_example",
            language: "sql",
            title: "パーティション + クラスタリングテーブル作成",
            code: `CREATE TABLE \`project.dataset.events\`
PARTITION BY DATE(event_time)
CLUSTER BY user_id, event_type
OPTIONS(
  partition_expiration_days = 365,
  require_partition_filter = TRUE
)
AS SELECT * FROM \`project.dataset.events_raw\``,
            explanation:
              "require_partition_filter=TRUEを設定すると、パーティションフィルタなしのクエリはエラーになります。誤った全件スキャンを防げます。",
          },
        ],
      },
      {
        id: "pde-storage-s4",
        title: "DB選択の意思決定フロー",
        estimatedMinutes: 10,
        blocks: [
          {
            type: "decision_tree",
            title: "どのGCPデータベースを選ぶか",
            rootId: "q1",
            nodes: [
              { id: "q1", question: "分析用のOLAPワークロードか？", yesId: "bq", noId: "q2" },
              { id: "bq", answer: "BigQuery", explanation: "ペタバイト規模の分析。SQL。スキャン量課金。Lookerとの統合に最適。" },
              { id: "q2", question: "グローバル分散・水平スケールが必要か？", yesId: "spanner", noId: "q3" },
              { id: "spanner", answer: "Cloud Spanner", explanation: "グローバルACIDトランザクション。99.999% SLA。金融・グローバルECに最適。" },
              { id: "q3", question: "高書き込みスループット（時系列・IoT）か？", yesId: "bigtable", noId: "q4" },
              { id: "bigtable", answer: "Cloud Bigtable", explanation: "ペタバイト規模の時系列データ。HBase互換。ミリ秒レイテンシの書き込みに対応。" },
              { id: "q4", question: "モバイルアプリ・リアルタイム同期が必要か？", yesId: "firestore", noId: "cloudsql" },
              { id: "firestore", answer: "Firestore", explanation: "オフライン同期対応。スキーマレスドキュメントDB。Firebase連携に最適。" },
              { id: "cloudsql", answer: "Cloud SQL", explanation: "既存のMySQL/PostgreSQL/SQL Serverアプリの移行に最適。垂直スケール。" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "pde-pipeline",
    certId: "pde",
    domainName: "データ処理システムの構築と運用",
    title: "データパイプライン設計",
    description:
      "Pub/Sub・Dataflow・Dataproc・Cloud Composerを使ったデータパイプラインの設計と実装を学習します。",
    estimatedMinutes: 70,
    difficulty: "advanced",
    prerequisites: ["pde-storage-design"],
    relatedLabIds: ["pde-pubsub-dataflow"],
    sections: [
      {
        id: "pde-pipeline-s1",
        title: "ストリーミング vs バッチ処理",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "comparison_table",
            title: "データ処理パターンの比較",
            headers: ["項目", "バッチ処理", "ストリーミング処理"],
            rows: [
              { label: "レイテンシ", values: ["分〜時間", "ミリ秒〜秒"] },
              { label: "スループット", values: ["大量データ向け", "継続的な小データ向け"] },
              { label: "GCPサービス", values: ["Dataproc・BigQuery Jobs", "Dataflow・Pub/Sub"] },
              { label: "コスト", values: ["スケジュール実行で効率的", "継続的に発生"] },
              { label: "ユースケース", values: ["日次集計・ETL・ML学習", "イベント処理・不正検知・監視"] },
            ],
          },
          {
            type: "comparison_table",
            title: "Dataflow vs Dataproc",
            headers: ["項目", "Dataflow (Apache Beam)", "Dataproc (Spark/Hadoop)"],
            rows: [
              { label: "管理", values: ["フルマネージド・サーバーレス", "クラスター管理が必要"] },
              { label: "対応", values: ["ストリーミング+バッチ統一モデル", "主にバッチ (Spark Streaming可)"] },
              { label: "既存資産", values: ["新規開発向け", "既存Spark/Hadoopコードの移行"] },
              { label: "コスト", values: ["実行時間課金", "クラスター稼働時間課金"] },
            ],
            footnote: "既存SparkコードがあればDataproc、新規開発はDataflowが推奨",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験頻出: Dataflow vs Dataproc の選択",
            content:
              "• 既存のApache Spark/Hadoopコードをそのまま動かしたい → Dataproc\n• 新規ストリーミング+バッチパイプラインを統一設計 → Dataflow\n• コスト最小・クラスター不要・サーバーレス → Dataflow\n• HBase/Hive/Pigなどのエコシステムが必要 → Dataproc",
          },
        ],
      },
      {
        id: "pde-pipeline-s2",
        title: "Apache Beamの窓処理",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown:
              "Apache Beamはバッチとストリーミングを統一APIで扱えるオープンソースフレームワークです。DataflowはApache Beamのマネージドランナーです。\n\n**重要概念:**\n- **PCollection**: データの分散コレクション（不変・並列処理対象）\n- **Transform**: PCollectionを変換する操作\n- **Pipeline**: TransformのDAG（有向非巡回グラフ）\n- **Runner**: Pipelineを実行する環境 (Dataflow / Direct)",
          },
          {
            type: "concept_card",
            term: "ウィンドウ処理の3種類",
            definition: "ストリーミングデータを時間的に区切って集計処理するための仕組み",
            useCases: [
              "Fixed Window: 1分ごとのPV数集計（重複なし・均等分割）",
              "Sliding Window: 直近5分のローリング平均（重複あり）",
              "Session Window: ユーザーセッション単位の行動分析（アクティビティ間隔で区切る）",
            ],
            characteristics: [
              "Fixed: 重複しない等間隔のウィンドウ",
              "Sliding: 指定間隔でスライドする重複ありのウィンドウ",
              "Session: イベント間の無活動時間でウィンドウが閉じる",
              "Watermark: イベントタイムの最大遅延を定義する概念",
            ],
            examRelevance: "PDE試験ではどのウィンドウタイプを使うべきかのシナリオ問題が出題される",
          },
          {
            type: "key_point",
            level: "warning",
            title: "Watermarkと遅延データの処理",
            content:
              "ストリーミングデータはネットワーク遅延などで順序が乱れることがあります。\n\n• Watermark: 「このタイムスタンプ以前のデータはすでに到着した」とみなす閾値\n• Allowed Lateness: Watermark通過後に到着した遅延データを受け入れる時間\n\nAllowed Latenessを超えて到着したデータは廃棄されます。",
          },
          {
            type: "code_example",
            language: "python",
            title: "Apache Beam: Fixed Window + 集計",
            code: `import apache_beam as beam
from apache_beam.transforms.window import FixedWindows
from apache_beam.utils.timestamp import Duration

with beam.Pipeline() as p:
    result = (
        p
        | "Read" >> beam.io.ReadFromPubSub(topic="projects/my-project/topics/sensor-data")
        | "ParseJSON" >> beam.Map(lambda x: json.loads(x))
        | "Timestamps" >> beam.Map(
            lambda x: beam.window.TimestampedValue(x, x["event_time"])
          )
        | "Window" >> beam.WindowInto(
            FixedWindows(60),  # 1分ウィンドウ
            allowed_lateness=Duration(seconds=30)  # 30秒まで遅延データを受け入れ
          )
        | "GroupByKey" >> beam.GroupBy(lambda x: x["device_id"])
        | "Aggregate" >> beam.combiners.Mean.PerKey()
        | "Write" >> beam.io.WriteToBigQuery(
            "project:dataset.sensor_averages"
          )
    )`,
            explanation: "Fixed Window(60秒)でセンサーデータを集計し、30秒以内の遅延データを受け入れながらBigQueryに書き込みます。",
          },
        ],
      },
      {
        id: "pde-pipeline-s3",
        title: "Pub/Sub設計パターン",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud Pub/Sub",
            definition: "スケーラブルな非同期メッセージングサービス。パブリッシャー・サブスクライバーモデルを採用",
            useCases: [
              "マイクロサービス間の非同期通信",
              "イベント駆動アーキテクチャのバックボーン",
              "Dataflowへのストリーミングデータ供給",
            ],
            characteristics: [
              "at-least-once配信: メッセージは必ず1回以上配信される",
              "スケーラビリティ: 毎秒数百万メッセージを処理可能",
              "デッドレタートピック (DLQ): 処理失敗メッセージを格納",
              "Ordering Key: 同一キーのメッセージを順序保証して配信",
            ],
            examRelevance: "at-least-onceのためべき等な処理設計が必須。重複排除にはmessageIdを活用",
          },
          {
            type: "comparison_table",
            title: "Push vs Pull サブスクリプション",
            headers: ["項目", "Push", "Pull"],
            rows: [
              { label: "配信方法", values: ["PubSubがエンドポイントにHTTP POST", "サービスがPubSubをポーリング"] },
              { label: "スケーリング", values: ["プッシュ先サービスがオートスケール", "Pull側でスループット制御"] },
              { label: "向いているケース", values: ["Cloud Run・App Engine等のサーバーレス", "GCEや長時間処理のバックエンド"] },
              { label: "認証", values: ["HTTPS + サービスアカウント", "IAMで制御"], highlight: false },
            ],
            footnote: "Dataflowは内部的にPullを使用",
          },
          {
            type: "key_point",
            level: "common_mistake",
            title: "よくある誤り: べき等性の無視",
            content:
              "Pub/Subはat-least-onceのため、同じメッセージが複数回配信されることがあります。\n\nNGパターン: メッセージを受信するたびにDBにINSERTする\nOKパターン: messageIdでの重複チェック後にINSERT、またはUPSERT（INSERT ON CONFLICT）を使用",
          },
        ],
      },
      {
        id: "pde-pipeline-s4",
        title: "Cloud Composerによるオーケストレーション",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud Composer",
            definition: "Apache AirflowのフルマネージドサービスでDAG（有向非巡回グラフ）でパイプラインを定義・スケジュール実行",
            useCases: [
              "複数のGCPサービスをまたぐデータパイプラインのオーケストレーション",
              "依存関係のある複雑なバッチ処理のスケジューリング",
              "ML学習パイプラインの定期実行",
            ],
            characteristics: [
              "DAGはPythonコードで定義",
              "リトライ・エラーハンドリングを宣言的に設定",
              "豊富なオペレーター: BigQueryOperator, DataflowOperator等",
              "Web UIでDAGの実行状況を監視",
            ],
            examRelevance: "Cloud Composer vs Vertex AI Pipelines: 汎用データパイプラインにはComposer、MLパイプラインにはVertex AI Pipelines",
          },
          {
            type: "comparison_table",
            title: "Cloud Composer vs Vertex AI Pipelines",
            headers: ["項目", "Cloud Composer", "Vertex AI Pipelines"],
            rows: [
              { label: "用途", values: ["汎用データパイプライン", "MLパイプライン専用"] },
              { label: "フレームワーク", values: ["Apache Airflow", "Kubeflow Pipelines v2"] },
              { label: "ML向け統合", values: ["Operatorでの連携", "ネイティブML統合 (Experiment/Artifact追跡)"] },
              { label: "コスト", values: ["GKEクラスター常時稼働", "実行時のみ課金"] },
            ],
          },
          {
            type: "code_example",
            language: "python",
            title: "Cloud Composer DAGの例",
            code: `from airflow import DAG
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
from airflow.providers.google.cloud.operators.dataflow import DataflowCreateJobOperator
from datetime import datetime, timedelta

with DAG(
    dag_id="daily_etl_pipeline",
    schedule_interval="0 2 * * *",  # 毎日2時
    start_date=datetime(2024, 1, 1),
    default_args={"retries": 3, "retry_delay": timedelta(minutes=5)},
    catchup=False,
) as dag:

    run_dataflow = DataflowCreateJobOperator(
        task_id="run_dataflow_job",
        job_name="daily-etl-{{ ds_nodash }}",
        template="gs://my-bucket/templates/etl-template",
        parameters={"date": "{{ ds }}"},
    )

    load_to_bq = BigQueryInsertJobOperator(
        task_id="load_to_bigquery",
        configuration={
            "query": {
                "query": "SELECT * FROM \`staging.events_{{ ds_nodash }}\`",
                "destinationTable": {"projectId": "proj", "datasetId": "prod", "tableId": "events"},
            }
        },
    )

    run_dataflow >> load_to_bq`,
            explanation: "DAGでDataflowジョブを実行後、BigQueryへのデータロードを順次実行します。retries=3でエラー時に3回リトライします。",
          },
        ],
      },
    ],
  },
]
