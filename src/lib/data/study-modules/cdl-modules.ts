import type { StudyModule } from "@/lib/types/study-module"

export const CDL_MODULES: StudyModule[] = [
  {
    id: "cdl-cloud-fundamentals",
    certId: "cdl",
    domainName: "クラウドの基礎概念",
    title: "クラウドの基礎とGCPインフラ",
    description:
      "クラウドコンピューティングの基本概念からGoogle Cloudのグローバルインフラ構造、コストモデル、移行戦略まで体系的に学習します。Cloud Digital Leader試験の出発点となる基礎ドメインです。",
    estimatedMinutes: 70,
    difficulty: "beginner",
    prerequisites: [],
    sections: [
      {
        id: "cdl-cloud-fundamentals-s1",
        title: "クラウドコンピューティングとは",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "text",
            markdown: `## クラウドコンピューティングの定義

クラウドコンピューティングとは、インターネット経由でコンピューティングリソース（サーバー、ストレージ、データベース、ネットワーク、ソフトウェアなど）をオンデマンドで提供するモデルです。NISTの定義では「使用量に応じた課金で、設定可能なコンピューティングリソースの共有プールに対して利便性が高く、オンデマンドなネットワークアクセスを可能にするモデル」とされています。

### サービスモデルの4階層

**IaaS（Infrastructure as a Service）**
仮想マシン、ストレージ、ネットワーキングなどの基盤インフラを提供します。ユーザーはOSからアプリケーションまで管理します。Google Cloud の Compute Engine（GCE）が代表例です。インフラの柔軟な制御が必要な場合や、既存のオンプレミスシステムをリフト＆シフトで移行する際に適しています。

**PaaS（Platform as a Service）**
アプリケーション開発・実行環境を提供します。ユーザーはアプリケーションコードとデータのみ管理し、OSやミドルウェアの管理からは解放されます。Google Cloud の App Engine や Cloud SQL が代表例です。開発者が基盤の管理なしにアプリ開発に集中したい場合に適しています。

**SaaS（Software as a Service）**
完成したソフトウェアアプリケーションをサービスとして提供します。ユーザーはデータの利用のみ行い、インフラからアプリケーションまでの管理をすべてプロバイダが担います。Google Workspace（Gmail、Google Docs等）が代表例です。

**FaaS（Function as a Service）**
イベント駆動の関数実行環境を提供するサーバーレスモデルです。コードをデプロイするだけで実行され、使用した分だけ課金されます。Google Cloud の Cloud Functions や Cloud Run（第2世代）が代表例です。マイクロサービスやイベント処理に適しています。`,
          },
          {
            type: "concept_card",
            term: "責任共有モデル（Shared Responsibility Model）",
            definition:
              "クラウドプロバイダとユーザーの間でセキュリティ責任をどのように分担するかを定義したフレームワーク。クラウドプロバイダは「クラウドのセキュリティ（Security OF the Cloud）」を担当し、ユーザーは「クラウド内のセキュリティ（Security IN the Cloud）」を担当します。サービスモデル（IaaS/PaaS/SaaS）によって責任範囲が変化します。",
            useCases: [
              "IaaSでは、物理インフラはGCPが管理するが、OSパッチ適用やファイアウォール設定はユーザー責任",
              "PaaSでは、ランタイムやOSはGCPが管理するが、アプリケーションコードとデータはユーザー責任",
              "SaaSでは、ほぼすべてGCPが管理するが、アクセス制御（誰がアクセスできるか）はユーザー責任",
              "コンプライアンス監査において、どの制御がユーザー責任かを明確にするために活用",
            ],
            characteristics: [
              "物理的なデータセンターセキュリティは常にGCPの責任範囲",
              "データの暗号化設定はIaaSではユーザー責任、SaaSではGCP責任が多い",
              "IAMによるアクセス管理の適切な設定はすべてのモデルでユーザー責任",
              "インシデント発生時の調査・通知義務の範囲も責任共有モデルで規定される",
              "PCI DSSやHIPAAなどのコンプライアンス認証は責任共有のもとで取得される",
            ],
            examRelevance:
              "CDL試験では「このシナリオでの責任はGCPとユーザーのどちらか？」という問題が頻出。サービスモデルごとに責任範囲が異なることを理解し、特にデータ保護とアクセス管理は常にユーザー責任であることを覚えておく。",
          },
        ],
      },
      {
        id: "cdl-cloud-fundamentals-s2",
        title: "Google Cloudのグローバルインフラ",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown: `## Google Cloudのグローバルインフラ階層

Google Cloudのインフラは複数の階層から構成されており、それぞれが異なる可用性・パフォーマンス・冗長性の保証を提供します。

### リージョン（Region）
リージョンは地理的に独立したデータセンターの集合体です。2025年時点で世界38以上のリージョンが存在し、アジアパシフィック、北米、南米、欧州、中東・アフリカをカバーしています。ユーザーに近いリージョンを選択することでレイテンシを最小化し、データの地理的境界（データレジデンシー）を満たすことができます。

**日本のリージョン:**
- asia-northeast1（東京）
- asia-northeast2（大阪）

### ゾーン（Zone）
ゾーンはリージョン内の独立した物理的施設（データセンター）です。各リージョンには通常3つ以上のゾーンがあります。ゾーンは互いに独立した電源・冷却・ネットワーキングを持つため、1つのゾーンで障害が発生しても他のゾーンには影響しません。高可用性を実現するには、複数ゾーンにリソースを分散させます（マルチゾーン構成）。

### PoP（Point of Presence）/ エッジノード
GCPはCloudflareやAkamaiと同様のCDN（Content Delivery Network）ネットワークを世界中に展開しています。PoP（エッジノード）は世界160以上の都市に配置されており、Cloud CDNやCloud Armorがここで動作します。エンドユーザーに最も近いPoPでコンテンツを配信することで、オリジンサーバーへの負荷を減らしつつ高速なコンテンツ配信を実現します。

### プレミアムネットワーク vs スタンダードネットワーク
GCPは自社の海底ケーブルを含むプライベートグローバルネットワーク（プレミアムティア）を持ちます。プレミアムティアはGCPのバックボーンネットワーク上でトラフィックを転送し、低レイテンシ・高信頼性を実現します。スタンダードティアは一般的なインターネット経由で転送され、コストを抑えられますが品質は劣ります。`,
          },
          {
            type: "concept_card",
            term: "可用性ゾーン（Availability Zone）と高可用性設計",
            definition:
              "複数の独立したゾーンにリソースを分散させることで、単一障害点（SPOF）を排除し、サービスの継続性を確保する設計アプローチ。GCPではゾーン間のネットワーク転送は低レイテンシ（通常1ms以下）かつ低コストで、マルチゾーン構成を取りやすい設計になっています。",
            useCases: [
              "Compute Engine VMを複数ゾーンに分散配置し、ゾーン障害時の影響を最小化する",
              "GKEクラスタをリージョンクラスタとして作成し、ノードプールを複数ゾーンに展開する",
              "Cloud SQLのHAオプションで、プライマリとスタンバイを異なるゾーンに配置する",
              "重大災害に備えてリージョン間でデータを複製するマルチリージョン構成",
            ],
            characteristics: [
              "SLA（サービスレベル合意）は通常マルチゾーン構成での数値が提示される",
              "ゾーン間のデータ転送は同一リージョン内で完結するため規制面でも安心",
              "GCPのマネージドサービス（Cloud Spanner等）は自動的にマルチゾーン冗長化される",
              "リージョン間複製はコストが高くなるが、ディザスタリカバリ（DR）に必須",
            ],
            examRelevance:
              "CDL試験では「99.9%の可用性を実現するには？」という問題で、マルチゾーン構成が正答になるケースが多い。単一ゾーンへの依存は試験では「リスクのある選択肢」として扱われる。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験頻出：インフラ階層用語の整理",
            content:
              "CDL試験でインフラ関連の問題が出たら、以下の用語階層を即座に思い出すこと。\n\n「リージョン＞ゾーン」の包含関係を覚える。リージョンは地理的エリア、ゾーンはリージョン内の独立施設。「マルチリージョン」はCloud StorageやFirestoreで選択できる最上位の冗長構成。「PoP/エッジノード」はCloud CDNやCloud Armorが動作する場所。\n\n試験では「データをeu（ヨーロッパ）に保存する理由は？」→「GDPRなどのデータレジデンシー要件」という文脈でも出題される。",
          },
        ],
      },
      {
        id: "cdl-cloud-fundamentals-s3",
        title: "CapExとOpExモデル",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "comparison_table",
            title: "オンプレミス vs クラウド：7項目比較",
            headers: ["比較項目", "オンプレミス（CapEx）", "クラウド（OpEx）"],
            rows: [
              {
                label: "初期投資",
                values: [
                  "高い（ハードウェア購入・データセンター構築費用が先行）",
                  "ほぼゼロ（従量課金制、初期コスト不要）",
                ],
                highlight: true,
              },
              {
                label: "スケーラビリティ",
                values: [
                  "低い（容量増加には新規ハードウェア購入と設置作業が必要）",
                  "高い（数分でスケールアップ・ダウン可能）",
                ],
                highlight: false,
              },
              {
                label: "メンテナンス責任",
                values: [
                  "すべて自社負担（ハードウェア保守・OS更新・セキュリティパッチ）",
                  "インフラ部分はGCPが担当（責任共有モデルによる分担）",
                ],
                highlight: false,
              },
              {
                label: "リソース利用効率",
                values: [
                  "低い傾向（ピーク需要に合わせて過剰調達になりがち）",
                  "高い（必要なときだけ使い、必要量だけ利用）",
                ],
                highlight: false,
              },
              {
                label: "調達リードタイム",
                values: [
                  "長い（数週間〜数ヶ月。注文・納品・設置・設定が必要）",
                  "即時（APIやコンソールから数分で利用開始）",
                ],
                highlight: true,
              },
              {
                label: "グローバル展開",
                values: [
                  "困難（各国・地域に物理インフラが必要）",
                  "容易（GCPリージョンが存在する地域ならすぐに展開可能）",
                ],
                highlight: false,
              },
              {
                label: "イノベーション速度",
                values: [
                  "遅い（ハードウェアサイクルに縛られる、新技術導入に時間がかかる）",
                  "速い（AI/ML等の最新サービスをすぐに試せる）",
                ],
                highlight: false,
              },
            ],
            footnote:
              "CapEx（Capital Expenditure）=設備投資、OpEx（Operational Expenditure）=運用費用。クラウド移行でCapExをOpExに転換することで財務的柔軟性が高まる。",
          },
          {
            type: "text",
            markdown: `## TCO（Total Cost of Ownership）計算の考え方

TCOとは、システムやインフラを保有・運用するための総コストです。オンプレミスとクラウドを比較する際、単純なハードウェア購入価格だけでなく、以下の要素をすべて含めて計算する必要があります。

### オンプレミスの隠れたコスト
- **人件費**: システム管理者、セキュリティ担当者、ネットワークエンジニアの人件費
- **施設費用**: データセンターの賃料・電力・冷却費用
- **ハードウェア保守**: 機器の修理・交換費用（通常は年間コストの5〜15%）
- **ソフトウェアライセンス**: OS、監視ツール、セキュリティソフトウェアのライセンス費用
- **ディザスタリカバリ**: 二次データセンターの構築・維持費用
- **機会費用**: インフラ管理に費やす時間の機会コスト（新規事業への投資ができない）

### クラウドのコスト計算
- 使用したコンピューティング・ストレージ・ネットワークの従量課金
- Committed Use Discounts（CUD）やSustained Use Discounts（SUD）による割引
- Preemptible/Spot VMを活用したコスト削減（通常価格の60〜91%オフ）
- GCPのコスト計算ツール（Google Cloud Pricing Calculator）を使った見積もり

クラウドでの実際のTCOは単純な料金表の比較だけでは分からず、隠れたオンプレミスコストを可視化することで、クラウド移行の経済的メリットが明確になります。`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "CDL試験頻出：CapEx → OpEx の転換メリット",
            content:
              "CDL試験でコスト関連の問題が出た場合、「クラウド移行によってCapEx（設備投資）をOpEx（運用費）に転換できる」というキーワードが重要。これにより予算の柔軟性が高まり（使った分だけ支払う）、初期投資リスクが低減される。また「スケーラビリティ」と「イノベーション速度の向上」もクラウド移行のビジネスメリットとして頻出。",
          },
        ],
      },
      {
        id: "cdl-cloud-fundamentals-s4",
        title: "クラウド移行の戦略",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "6R移行戦略（6Rs of Cloud Migration）",
            definition:
              "既存システムをクラウドに移行する際の6つのアプローチを体系化したフレームワーク。各システムの特性・ビジネス要件・技術的制約に応じて最適な移行戦略を選択します。Gartner社が提唱した「5R」にGoogleが「Retain」を加えた形が広く使われています。",
            useCases: [
              "Rehost（リホスト）: オンプレミスのVMをそのままGCE（Compute Engine）に移行する「リフト＆シフト」",
              "Replatform（リプラットフォーム）: MySQLをCloud SQL（マネージドMySQL）に移行し、OS管理を削減する",
              "Repurchase（リパーチェス）: 自社開発CRMをSalesforceなどのSaaS製品に切り替える",
              "Refactor（リファクタリング）: モノリシックアプリをマイクロサービス化し、Cloud Runにコンテナデプロイする",
              "Retire（廃止）: 移行評価中に不要と判明したシステムを廃止し、コストを削減する",
              "Retain（維持）: 規制要件や技術的複雑性からオンプレミスに残留させる（ハイブリッドクラウド）",
            ],
            characteristics: [
              "Rehost が最も短期間・低リスクで実施できるが、クラウドの恩恵を最大限には受けられない",
              "Refactor が最も時間・コストがかかるが、クラウドネイティブの恩恵（スケーラビリティ・コスト最適化）を最大化できる",
              "移行戦略は1つに固定せず、システムごとに最適な戦略を組み合わせる",
              "Retire により移行対象の15〜20%が削減できることが多く、全体コスト削減に貢献する",
            ],
            examRelevance:
              "CDL試験では各Rの定義と代表的なシナリオの対応を問われる。特に「リフト＆シフト=Rehost」「マネージドサービスへの移行=Replatform」の区別が頻出。",
          },
          {
            type: "decision_tree",
            title: "どの移行戦略（6R）を選ぶか",
            rootId: "dt-start",
            nodes: [
              {
                id: "dt-start",
                question: "このシステムは今後も必要ですか？",
                yesId: "dt-cloud-value",
                noId: "dt-retire",
              },
              {
                id: "dt-retire",
                answer: "Retire（廃止）",
                explanation:
                  "不要なシステムは廃止してコストを削減する。移行プロジェクトで最初に行うポートフォリオ整理で重要。",
              },
              {
                id: "dt-cloud-value",
                question: "クラウド移行によるビジネス価値はありますか？（コスト削減・スケーラビリティ等）",
                yesId: "dt-migration-type",
                noId: "dt-retain",
              },
              {
                id: "dt-retain",
                answer: "Retain（維持）",
                explanation:
                  "規制要件・レイテンシ・技術的複雑性からオンプレミスに残す。ハイブリッドクラウド戦略の一部として管理する。",
              },
              {
                id: "dt-migration-type",
                question: "アプリケーションを大きく変更せずに移行しますか？",
                yesId: "dt-lift-shift",
                noId: "dt-modernize",
              },
              {
                id: "dt-lift-shift",
                question: "既存のOSやミドルウェアも含めてそのまま移行しますか？",
                yesId: "dt-rehost",
                noId: "dt-replatform",
              },
              {
                id: "dt-rehost",
                answer: "Rehost（リホスト）",
                explanation:
                  "VM丸ごとをCompute EngineやBare Metal Solutionに移行。最速・最低リスク。クラウドネイティブの恩恵は限定的。",
              },
              {
                id: "dt-replatform",
                answer: "Replatform（リプラットフォーム）",
                explanation:
                  "アプリコードは変えず、DBをCloud SQLに移行するなど基盤をマネージドサービスに置き換え。OS管理の負担を削減。",
              },
              {
                id: "dt-modernize",
                question: "既存ベンダーのSaaSに切り替えることを検討していますか？",
                yesId: "dt-repurchase",
                noId: "dt-refactor",
              },
              {
                id: "dt-repurchase",
                answer: "Repurchase（リパーチェス）",
                explanation:
                  "既存アプリをSaaS製品（Salesforce、Google Workspace等）に置き換え。カスタマイズ性は下がるが管理負荷が大幅に低減。",
              },
              {
                id: "dt-refactor",
                answer: "Refactor（リファクタリング）",
                explanation:
                  "マイクロサービス化・コンテナ化・サーバーレス化等でアーキテクチャを刷新。最もクラウドネイティブの価値を得られるが、時間と投資が最も大きい。",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cdl-gcp-services",
    certId: "cdl",
    domainName: "GCPサービスカタログ",
    title: "GCPサービスカタログと選択",
    description:
      "Google Cloudが提供するCompute・Storage・Database・AI/MLの主要サービスを横断的に学習し、ビジネスシナリオに応じた適切なサービス選択の判断力を養います。",
    estimatedMinutes: 75,
    difficulty: "beginner",
    prerequisites: ["cdl-cloud-fundamentals"],
    sections: [
      {
        id: "cdl-gcp-services-s1",
        title: "Computeサービスの全体像",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "GCPコンピュートサービス比較：GCE / GKE / Cloud Run / App Engine / Cloud Functions",
            headers: ["サービス", "コントロール度", "スケーリング", "管理負荷", "最適ユースケース"],
            rows: [
              {
                label: "Compute Engine（GCE）",
                values: [
                  "最高（OSからすべて自由に設定）",
                  "手動またはManaged Instance Groupで自動",
                  "最高（OS管理・パッチ・監視を自己管理）",
                  "既存オンプレアプリのリフト＆シフト、特殊OS要件、ベアメタルに近い処理",
                ],
                highlight: false,
              },
              {
                label: "Google Kubernetes Engine（GKE）",
                values: [
                  "高（コンテナ・Kubernetesレベルで制御）",
                  "Horizontal Pod Autoscaler + Cluster Autoscalerで自動",
                  "高（Kubernetesの知識が必要、ノード管理あり）",
                  "マイクロサービス、ポータブルなコンテナワークロード、複雑なオーケストレーション",
                ],
                highlight: false,
              },
              {
                label: "Cloud Run",
                values: [
                  "中（コンテナイメージを指定、基盤は管理不要）",
                  "完全自動（0〜Nのスケール、リクエスト単位）",
                  "低（コンテナさえ用意すればデプロイ可能）",
                  "HTTPワークロード、APIサービス、スケール変動が大きいWebアプリ",
                ],
                highlight: true,
              },
              {
                label: "App Engine",
                values: [
                  "低〜中（ランタイムと設定のみ）",
                  "自動（トラフィックベース）",
                  "低（デプロイはgcloud app deployのみ）",
                  "従来型Webアプリ、スタートアップの迅速なデプロイ、GAE標準環境での制約を許容できるケース",
                ],
                highlight: false,
              },
              {
                label: "Cloud Functions",
                values: [
                  "最低（関数コードのみ）",
                  "完全自動（イベント駆動）",
                  "最低（コードだけ書けばよい）",
                  "イベント処理、Webhook、小規模バックエンドロジック、他GCPサービスとの連携トリガー",
                ],
                highlight: false,
              },
            ],
            footnote:
              "コントロール度と管理負荷はトレードオフの関係。「柔軟性 vs 手間」で選択する。CDL試験ではユースケースから適切なサービスを選ぶ問題が多い。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "サーバーレスとは何か：CDL試験の定義",
            content:
              "「サーバーレス」とは、サーバーが存在しないのではなく「ユーザーがサーバーを管理しなくてよい」モデル。GCPのサーバーレスサービスはCloud Functions・Cloud Run・App Engine（標準環境）・BigQueryなど。\n\n試験での重要ポイント：\n① サーバーレスはトラフィックゼロ時にスケールインして0になれる（コスト最適）\n② コールドスタートの概念（初回リクエストに遅延が発生する場合がある）\n③ 「インフラ管理なしで迅速にデプロイしたい」→サーバーレスが正解",
          },
        ],
      },
      {
        id: "cdl-gcp-services-s2",
        title: "ストレージとデータベース",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "GCPストレージ・データベースサービス比較",
            headers: ["サービス", "種別", "スケール", "一貫性", "最適ユースケース", "CDL試験のポイント"],
            rows: [
              {
                label: "Cloud Storage",
                values: [
                  "オブジェクトストレージ",
                  "無制限（エクサバイト級）",
                  "強整合性（2021年〜）",
                  "画像・動画・バックアップ・ログの保存、静的Webサイトホスティング",
                  "バケット＋オブジェクトの概念。Nearline/Coldline/Archiveのストレージクラス選択",
                ],
                highlight: false,
              },
              {
                label: "Cloud SQL",
                values: [
                  "リレーショナルDB（マネージド）",
                  "最大64TB、64vCPU",
                  "ACID準拠",
                  "既存のMySQL/PostgreSQL/SQL ServerアプリをPaaSに移行",
                  "地域単位のサービス。グローバルスケールが必要ならSpannerを選択",
                ],
                highlight: false,
              },
              {
                label: "Cloud Spanner",
                values: [
                  "グローバル分散RDB",
                  "無制限（グローバル水平分散）",
                  "外部強整合性（業界最高レベル）",
                  "グローバル金融システム、グローバルゲームランキング、99.999%可用性が必要なDB",
                  "SQLとNoSQLの特性を両立。コストが高い。マルチリージョン構成が可能",
                ],
                highlight: true,
              },
              {
                label: "Firestore",
                values: [
                  "NoSQLドキュメントDB",
                  "自動スケール",
                  "強整合性",
                  "モバイル・Webアプリのリアルタイムデータ同期、ユーザープロファイル、セッション管理",
                  "Firebase Realtime Databaseの後継。オフラインサポート機能あり",
                ],
                highlight: false,
              },
              {
                label: "Bigtable",
                values: [
                  "NoSQL ワイドカラムストア",
                  "ペタバイト級",
                  "結果整合性",
                  "IoTデータ、時系列データ、広告クリックログ、機械学習特徴量ストア",
                  "HBaseと互換性あり。低レイテンシの大量読み書きに特化",
                ],
                highlight: false,
              },
              {
                label: "BigQuery",
                values: [
                  "DWH（データウェアハウス）",
                  "ペタバイト級",
                  "分析用（OLAP）",
                  "大規模データ分析、BIダッシュボード、ML（BigQuery ML）",
                  "OLTPではなくOLAPに特化。ストレージとコンピュートが分離した独自アーキテクチャ",
                ],
                highlight: false,
              },
            ],
            footnote:
              "ストレージ種別の違い：オブジェクトストレージ（Cloud Storage）=ファイル単位で保存。ブロックストレージ（Persistent Disk）=VMのディスクとして使用。ファイルストレージ（Filestore）=NFS共有ファイルシステム。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "オブジェクト vs ブロック vs ファイルストレージの使い分け",
            content:
              "CDL試験でストレージ選択問題が出たら次の判断軸で選ぶ：\n\n① **オブジェクトストレージ（Cloud Storage）**: 大量のファイルをWeb経由で保存・配信。バックアップ、メディア、ログ。HTTPSでアクセス。\n\n② **ブロックストレージ（Persistent Disk）**: VMにアタッチするディスク。OSやアプリケーションの動作ドライブとして使用。\n\n③ **ファイルストレージ（Filestore）**: 複数のVMから同時にNFSマウントが必要な場合。共有ファイルシステム。\n\n「大量の画像を保存したい」→ Cloud Storage、「VMのブートディスク」→ Persistent Disk が試験の定番回答。",
          },
        ],
      },
      {
        id: "cdl-gcp-services-s3",
        title: "AI/MLサービス",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "GCPのML活用3段階：事前学習済みAPI / AutoML / カスタムトレーニング",
            definition:
              "Google Cloudは機械学習の専門知識レベルに応じた3段階のMLサービス群を提供します。ML初心者でも事前学習済みAPIですぐに高精度なAI機能を利用でき、上級者はカスタムモデルをVertex AIで完全制御できます。この階層構造は「MLの民主化」を実現するGCPの戦略的設計です。",
            useCases: [
              "事前学習済みAPI: 自社アプリに画像認識・テキスト分析・音声認識を数行のコードで追加する",
              "AutoML: 独自の商品カテゴリ分類モデルを、MLエンジニアなしでCSVデータだけで作成する",
              "カスタムトレーニング: TensorFlowやPyTorchを使って独自アーキテクチャの深層学習モデルを構築・訓練する",
              "Vertex AI: MLパイプライン全体（データ準備→学習→評価→デプロイ→モニタリング）を統合管理する",
            ],
            characteristics: [
              "事前学習済みAPI（Vision/NL/Speech等）はGoogleが大規模データで学習済み。コード数行で利用開始可能",
              "AutoML は独自データをアップロードするだけで高精度モデルを自動生成。ML知識不要",
              "カスタムトレーニングは最大の柔軟性を持つが、MLエンジニアのスキルとGPU/TPUリソースが必要",
              "Vertex AI はこれらすべてを統合したMLプラットフォームで、2021年にCloud AI PlatformからリブランドされたGCPのMLハブ",
            ],
            examRelevance:
              "CDL試験では「MLエンジニアがいない会社が独自データでAIを使いたい」→「AutoML」が定番回答。「すぐに画像認識機能を追加したい」→「事前学習済みAPI（Vision API）」。ML専門知識とスピードの要件から選択する。",
          },
          {
            type: "comparison_table",
            title: "GCPのAI/MLサービス比較",
            headers: ["サービス", "ML知識の要不要", "カスタマイズ度", "主な機能・対象", "最適な利用者"],
            rows: [
              {
                label: "Vision API",
                values: [
                  "不要",
                  "低（Googleが学習済みモデルを使用）",
                  "物体検出・ラベル検出・OCR・顔認識・SafeSearch",
                  "アプリ開発者、非ML専門家",
                ],
                highlight: false,
              },
              {
                label: "Natural Language API",
                values: [
                  "不要",
                  "低",
                  "感情分析・エンティティ抽出・構文解析・テキスト分類",
                  "カスタマーサポート改善、SNS分析担当者",
                ],
                highlight: false,
              },
              {
                label: "Gemini API（旧PaLM API）",
                values: [
                  "不要〜中",
                  "中（プロンプトチューニング・ファインチューニング可能）",
                  "テキスト生成・要約・コード生成・マルチモーダル理解",
                  "生成AIアプリ開発者、LLM活用を検討する企業",
                ],
                highlight: true,
              },
              {
                label: "Vertex AI AutoML",
                values: [
                  "低（データ準備の知識は必要）",
                  "中（独自データで学習）",
                  "画像・テキスト・表形式データの分類・回帰・検出モデルを自動生成",
                  "データサイエンティスト、MLエンジニアが少ない企業",
                ],
                highlight: false,
              },
            ],
            footnote:
              "CDL試験では各サービスを覚えるより「ユースケース→適切なサービス」のマッピングを理解することが重要。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験での選択基準：AI/MLサービスの選び方",
            content:
              "CDL試験AI/ML問題の判断フロー：\n\n**既成のAI機能をすぐ使いたい** → 事前学習済みAPI（Vision/NL/Speech/Translation等）\n\n**自社独自データでカスタムモデルを作りたい・でもMLエンジニアがいない** → AutoML\n\n**独自アーキテクチャでモデル構築・完全制御したい** → Vertex AI カスタムトレーニング\n\n**生成AIテキスト生成・LLMを使いたい** → Gemini API / Vertex AI Gemini\n\n「MLエンジニア不要」「素早く」「既存API」の組み合わせは事前学習済みAPIが正答。",
          },
        ],
      },
      {
        id: "cdl-gcp-services-s4",
        title: "主要サービスのユースケースマッピング",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "text",
            markdown: `## 実際のビジネスシナリオと対応GCPサービス

CDL試験では「このビジネス課題を解決するのに最適なGCPサービスはどれか？」という問題が多く出題されます。代表的なビジネスシナリオとGCPサービスの対応関係を理解しておきましょう。

### シナリオ1：ECサイトのトラフィック急増への対応
- **課題**: セール期間中にトラフィックが100倍になる。オンプレでは対応できない。
- **GCPソリューション**:
  - **Cloud Run** または **GKE** でアプリをコンテナ化し、自動スケーリングを設定
  - **Cloud Load Balancing** でグローバルにトラフィックを分散
  - **Cloud CDN** で静的コンテンツをキャッシュしてサーバー負荷を削減
  - **Cloud Spanner** または **Cloud SQL** with HA構成で高可用性DBを確保

### シナリオ2：大量の顧客レビューデータの感情分析
- **課題**: 毎日数万件の顧客レビューを手動で分析している。自動化したい。
- **GCPソリューション**:
  - **Natural Language API** でテキストの感情分析・エンティティ抽出を自動化
  - **BigQuery** で分析結果を蓄積し、トレンドを把握
  - **Looker Studio** でダッシュボード化してビジネス部門と共有

### シナリオ3：グローバル決済システムのデータベース
- **課題**: 世界中のユーザーが同時に取引を行う。強整合性と高可用性（99.999%）が必要。
- **GCPソリューション**:
  - **Cloud Spanner** のマルチリージョン構成を採用
  - 外部強整合性によりグローバルで一貫したデータを保証
  - ACID準拠のトランザクション処理で金融グレードの信頼性を確保

### シナリオ4：工場の機械センサーデータのリアルタイム異常検知
- **課題**: 工場の1,000台の機械から毎秒センサーデータが送られてくる。リアルタイムで異常を検知したい。
- **GCPソリューション**:
  - **Pub/Sub** でストリームデータをリアルタイムに受信
  - **Dataflow** でストリーム処理・異常値検出を実行
  - **Bigtable** で時系列センサーデータを低レイテンシで保存
  - **Vertex AI** でMLモデルによる予知保全（Predictive Maintenance）を実装

### シナリオ5：スタートアップの迅速なWebアプリデプロイ
- **課題**: 3名のエンジニアチームで、インフラ管理なしにWebアプリを素早くリリースしたい。
- **GCPソリューション**:
  - **Cloud Run** でコンテナを使ったサーバーレスデプロイ（インフラ管理ゼロ）
  - **Cloud SQL** または **Firestore** でバックエンドDB
  - **Firebase Hosting** または **Cloud Load Balancing** でグローバル配信
  - **Cloud Build** でCI/CDパイプラインを構築し、コードプッシュで自動デプロイ`,
          },
        ],
      },
    ],
  },
  {
    id: "cdl-security-compliance",
    certId: "cdl",
    domainName: "セキュリティとコンプライアンス",
    title: "セキュリティとコンプライアンスの基礎",
    description:
      "Google Cloudのセキュリティモデル、IAMによるアクセス管理、データ保護の仕組み、コンプライアンス認証、そしてコスト管理とガバナンスまでを学習します。CDL試験のセキュリティドメインに対応します。",
    estimatedMinutes: 65,
    difficulty: "beginner",
    prerequisites: ["cdl-cloud-fundamentals"],
    sections: [
      {
        id: "cdl-security-compliance-s1",
        title: "GCPのセキュリティモデル",
        estimatedMinutes: 18,
        blocks: [
          {
            type: "text",
            markdown: `## 多層防御（Defense in Depth）の概念

Google Cloudのセキュリティは「多層防御（Defense in Depth）」の考え方に基づいています。単一のセキュリティ対策に頼るのではなく、複数の独立したセキュリティ層を積み重ねることで、1つの層が突破されても他の層が攻撃を防ぐことができます。

### Googleのグローバルインフラセキュリティ層

**物理セキュリティ層**
Googleのデータセンターは生体認証・複数の入退室管理・24時間監視カメラで保護されています。ハードウェアレベルで設計された独自のセキュリティチップ（Titan）がサーバーの真正性を保証します。

**ネットワークセキュリティ層**
Google Front End（GFE）がすべての外部通信を受け付け、DoS/DDoS攻撃を自動的に検知・緩和します。Cloud Armorがアプリケーションレイヤーのファイアウォールとして機能します。Googleのプライベートグローバルネットワーク上でのデータ転送は暗号化されます。

**アイデンティティ層（IAM）**
IAM（Identity and Access Management）がGCPリソースへのアクセスを制御します。すべてのAPIコールは認証・認可が必要です。

**アプリケーション層**
Secret Managerによる機密情報管理、Binary Authorizationによるコンテナイメージの検証、Cloud ArmorによるWAF機能などが含まれます。

**データ層**
デフォルトで保存時・転送時の暗号化が適用されます。顧客管理の暗号鍵（CMEK）オプションも提供されます。`,
          },
          {
            type: "concept_card",
            term: "IAM（Identity and Access Management）の基本：Who / What / Which",
            definition:
              "IAMはGCPリソースへのアクセスを「誰が（Who）」「何を（What/役割）」「どのリソースに対して（Which）」できるかを定義する仕組みです。この3つの要素（プリンシパル・ロール・リソース）をバインディングとして設定することで、きめ細かいアクセス制御を実現します。",
            useCases: [
              "開発者グループに特定プロジェクトのCloud Storageへの読み書き権限を付与する",
              "本番環境のCloud SQLへのアクセスをDBAチームのサービスアカウントに限定する",
              "外部パートナーに特定のBigQueryデータセットの閲覧のみを許可する",
              "CI/CDシステムのサービスアカウントに、デプロイに必要な最小限の権限のみ付与する",
            ],
            characteristics: [
              "プリンシパル（Who）: Google Account、サービスアカウント、Googleグループ、Google Workspace/Cloud Identity ドメイン",
              "ロール（What）: 権限の集合体。基本ロール（Owner/Editor/Viewer）・事前定義ロール・カスタムロールの3種類",
              "リソース（Which）: 組織・フォルダ・プロジェクト・個別リソース。上位の設定は下位に継承される",
              "IAMポリシーは「Allow」が基本。Deny Policyで明示的な拒否も設定可能（2022年〜）",
              "ポリシーの変更はCloud Audit Logsに自動記録される",
            ],
            examRelevance:
              "CDL試験では「最小権限の原則（Principle of Least Privilege）」に従った権限設計が問われる。必要最小限の権限のみ付与する選択肢が正解。Owner/Editorを安易に付与する選択肢は誤答になることが多い。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "最小権限の原則：CDL試験の基本方針",
            content:
              "CDL試験のセキュリティ問題を解く基本方針：「最小権限の原則（Least Privilege）」に従い、必要な操作に必要な権限のみ付与する。\n\n**試験でよく出る誤答パターン：**\n- 「簡単だから」とOwnerロールを付与する → 過剰な権限で誤り\n- 全員にEditor権限を与えてしまう → 不要な権限で誤り\n- サービスアカウントに組織レベルのAdminを付与する → 過剰権限で誤り\n\n**正解パターン：** 事前定義ロールの中から最も制限の厳しいロールを選択する（例: roles/storage.objectViewer vs roles/storage.admin）",
          },
        ],
      },
      {
        id: "cdl-security-compliance-s2",
        title: "データ保護とプライバシー",
        estimatedMinutes: 17,
        blocks: [
          {
            type: "concept_card",
            term: "暗号化の基礎：保存時（At Rest）と転送時（In Transit）",
            definition:
              "GCPはデータの暗号化を2つの状態で提供します。「保存時の暗号化」はストレージに保存されたデータを暗号化し、物理メディアへの不正アクセスからデータを保護します。「転送時の暗号化」はネットワーク経由でデータが移動する際にTLS等で暗号化し、盗聴・改ざんから保護します。GCPではこれらがデフォルトで自動的に適用されます。",
            useCases: [
              "Cloud StorageのオブジェクトはデフォルトでAES-256で暗号化されて保存される",
              "GCPへのすべてのAPIコールはHTTPS（TLS 1.2以上）で暗号化される",
              "データセンター間のネットワーク転送はGoogleのプライベートネットワーク上で暗号化される",
              "Cloud SQLのデータはストレージレベルとDB接続の両方で暗号化される",
            ],
            characteristics: [
              "Google管理の鍵（GMEK）はデフォルト設定で、追加設定不要・ユーザー管理不要",
              "顧客管理の鍵（CMEK）はCloud KMSで管理する暗号化鍵を使用。鍵の回転・廃止をユーザーが制御",
              "顧客提供の鍵（CSEK）はユーザーが独自の暗号化鍵をAPIリクエスト時に提供する最高制御モード",
              "転送時の暗号化はTLS（Transport Layer Security）プロトコルで実装",
              "GCPサービス間の内部通信も暗号化される（Application Layer Transport Security）",
            ],
            examRelevance:
              "CDL試験では「コンプライアンス要件で鍵の管理をユーザーが行う必要がある」→「CMEK」が定番回答。「最も高い鍵の制御性が必要」→「CSEK」。",
          },
          {
            type: "comparison_table",
            title: "暗号化鍵管理方式の比較：GMEK vs CMEK vs CSEK",
            headers: ["方式", "鍵の管理者", "設定の手間", "制御・監査性", "適したケース"],
            rows: [
              {
                label: "GMEK（Google管理暗号化鍵）",
                values: [
                  "Google",
                  "なし（デフォルト）",
                  "低（鍵ローテーションはGoogleが自動実施）",
                  "一般的なワークロード、コンプライアンス要件が緩い場合",
                ],
                highlight: false,
              },
              {
                label: "CMEK（顧客管理暗号化鍵）",
                values: [
                  "顧客（Cloud KMS経由）",
                  "Cloud KMSでの鍵作成・設定が必要",
                  "高（鍵の作成・ローテーション・無効化・監査をユーザーが制御）",
                  "金融・医療等のコンプライアンス要件、鍵の無効化でデータアクセスを即座に遮断したい場合",
                ],
                highlight: true,
              },
              {
                label: "CSEK（顧客提供暗号化鍵）",
                values: [
                  "顧客（完全自己管理）",
                  "高（APIリクエストごとに鍵を提供）",
                  "最高（GCPは鍵を保存しない）",
                  "厳格なセキュリティ要件、GCPに鍵を一切預けたくない場合（Cloud StorageとCompute Engineのみ対応）",
                ],
                highlight: false,
              },
            ],
            footnote:
              "CMEKで設定した鍵をCloud KMSで無効化すると、そのキーで暗号化されたすべてのデータへのアクセスが即座に遮断される。これが規制要件でのCMEK採用の主な理由の一つ。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "GDPR・個人情報保護とGCPの関連",
            content:
              "CDL試験でプライバシー・コンプライアンスの問題が出た場合のポイント：\n\n**GDPR（EU一般データ保護規則）への対応：**\n- GCPはデータレジデンシー（データをEU内に保存）を実現できる（EUリージョンを選択）\n- Cloud DLP（Data Loss Prevention）で個人情報を検出・マスキング・匿名化\n- Google Cloud Privacy Noticeで処理者（Processor）としてのGCPの責任が規定\n\n**個人情報保護法（日本）への対応：**\n- 日本リージョン（asia-northeast1/2）でのデータ保存により国内保管を実現\n- 第三者提供制限への対応としてVPC Service Controlsによるデータ境界の設定\n\nデータ保護の選択問題では「データの保存場所（リージョン選択）」と「Cloud DLP」がキーワード。",
          },
        ],
      },
      {
        id: "cdl-security-compliance-s3",
        title: "コンプライアンスと認証",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "text",
            markdown: `## GCPのコンプライアンス認証の対応状況

Google Cloudは世界中の規制・業界標準に対応した認証を取得しています。これらの認証はGoogleが定期的に第三者監査を受けることで維持されており、ユーザーはGCPを利用することでこれらの認証を自社のコンプライアンス要件の証拠として活用できます（責任共有モデルの範囲内で）。

### 主要なコンプライアンス認証

**PCI DSS（Payment Card Industry Data Security Standard）**
クレジットカード情報を扱うシステムに適用される国際セキュリティ標準です。GCPはPCI DSSに準拠した環境でカード決済システムを構築するための認証（AOC: Attestation of Compliance）を取得しています。ただし、PCI DSSへの準拠はGCPとユーザーの責任共有であり、ユーザー側のアプリケーション設計も重要です。

**HIPAA（Health Insurance Portability and Accountability Act）**
米国の医療情報保護法です。GCPはHIPAAに対応したサービスを提供しており、医療情報（PHI：Protected Health Information）を扱う場合はGoogleとBAA（Business Associate Agreement）を締結する必要があります。

**ISO/IEC 27001**
情報セキュリティ管理システム（ISMS）の国際標準です。GCPはISO 27001の認証を取得しており、組織的なセキュリティ管理体制が第三者監査により検証されています。

**SOC 1 / SOC 2 / SOC 3**
米国CPAが実施するサービス組織のコントロール報告書です。SOC 2はセキュリティ・可用性・処理の整合性・機密性・プライバシーの5つの信頼サービス基準を評価します。SOC 3は公開版の簡易報告書です。

**FedRAMP（Federal Risk and Authorization Management Program）**
米国連邦政府のクラウドサービス調達に必要なセキュリティ評価プログラムです。GCPはFedRAMP Highの認証を取得しています。`,
          },
          {
            type: "concept_card",
            term: "Compliance Reports Manager（コンプライアンスレポートマネージャー）",
            definition:
              "Google Cloud が提供するコンプライアンス関連のドキュメント（監査レポート・認証書・第三者評価書等）をまとめてダウンロードできるセルフサービスポータルです。これまでNDAの締結や個別リクエストが必要だった監査レポートへのアクセスを自動化・迅速化しました。",
            useCases: [
              "SOC 2 Type II レポートをダウンロードして社内の情報セキュリティ審査に提出する",
              "ISO 27001の認証書を取得して顧客へのコンプライアンス証明資料として活用する",
              "PCI DSSのAOCをダウンロードしてクレジットカード審査に提出する",
              "規制当局からの問い合わせに対して、GCPの認証ドキュメントを迅速に提供する",
            ],
            characteristics: [
              "Cloud Consoleから直接アクセス可能。事前申請なしで即座にレポートをダウンロード",
              "300以上のコンプライアンスドキュメントが利用可能",
              "レポートごとにカバーされるサービス・期間・地域を確認できる",
              "新しいレポートが公開されると自動通知を受け取ることができる",
            ],
            examRelevance:
              "CDL試験では「GCPのコンプライアンス認証書を取得する方法」としてCompliance Reports Managerが正答になるケースがある。",
          },
        ],
      },
      {
        id: "cdl-security-compliance-s4",
        title: "コスト管理とガバナンス",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "text",
            markdown: `## コスト管理とガバナンスの基本

クラウド活用においてコスト管理はITガバナンスの重要な柱の一つです。GCPは費用の可視化・制御・最適化のための豊富なツールを提供しています。

### 課金アラートと予算設定

**予算（Budget）とアラート**
Google Cloud Billing Consoleで月次予算を設定し、使用額が設定した閾値（50%・90%・100%等）に達した際にメールや Pub/Sub で通知を受け取ることができます。アラートは通知のみで自動的にリソースを停止させるわけではない点に注意が必要です（Pub/Sub経由でCloud Functionsを呼び出して自動停止を実装することは可能）。

**請求レポートと課金データのエクスポート**
Cloud Billingの請求レポートでプロジェクト別・サービス別・ラベル別にコストを可視化できます。課金データをBigQueryにエクスポートして詳細な分析も可能です。

### コスト最適化の基本手法

**Committed Use Discounts（CUD）**
1年または3年間の使用を事前にコミットすることで、オンデマンド料金から最大57%の割引を受けられます。安定した使用量が見込まれるWorkloadに適しています。

**Sustained Use Discounts（SUD）**
Compute Engineを月の一定時間以上使用した場合に自動的に適用される割引です。1ヶ月の100%使用で最大30%の割引。申請不要で自動適用されます。

**Preemptible/Spot VM**
他のユーザーのリクエストによって中断される可能性がある代わりに、通常価格の60〜91%オフで利用できるVM。バッチ処理・ML学習等の中断耐性があるワークロードに最適です。

### 組織レベルのガバナンス

**リソース階層とポリシー適用**
組織→フォルダ→プロジェクトの階層構造を使い、フォルダレベルでコスト管理ポリシーや権限を一括適用できます。

**ラベル（Labels）を活用したコスト配分**
リソースにラベル（例: env:production, team:marketing, cost-center:123）を付与することで、部門別・プロジェクト別のコスト追跡が可能になります。`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "CDLとしてのコスト責任範囲",
            content:
              "Cloud Digital Leaderとして知っておくべきコスト管理の視点：\n\n**ビジネスリーダーの責任範囲：**\n① 予算の設定と承認\n② コスト最適化の意思決定（Committed Use Discountsへのコミット等）\n③ 部門間のコスト配分ルール（チャージバック）の決定\n④ FinOps（Financial Operations）文化の推進\n\n**技術チームに委任する範囲：**\n- リソースのサイズ調整（Right-Sizing）\n- 未使用リソースの特定と削除\n- アーキテクチャの最適化\n\n試験では「CDLが取るべき行動」として「予算アラートを設定して過剰支出を早期検知する」「コミットメントディスカウントを活用して安定ワークロードのコストを削減する」が正答になることが多い。",
          },
        ],
      },
    ],
  },
]
