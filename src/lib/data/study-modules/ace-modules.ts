import type { StudyModule } from "@/lib/types/study-module"

export const ACE_MODULES: StudyModule[] = [
  {
    id: "ace-iam",
    certId: "ace",
    domainName: "セキュリティとアクセス管理",
    title: "アクセスとセキュリティの構成",
    description:
      "GCPのIAM（Identity and Access Management）の基本から組織リソース階層、サービスアカウント、監査ログまでを体系的に学習します。ACE試験で最頻出のセキュリティドメインです。",
    estimatedMinutes: 80,
    difficulty: "intermediate",
    prerequisites: [],
    relatedLabIds: ["lab-iam-basics", "lab-service-accounts"],
    sections: [
      {
        id: "ace-iam-s1",
        title: "IAMの基本モデル",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "IAMポリシー（Cloud IAM Policy）",
            definition:
              "GCPリソースへのアクセスを制御する仕組み。「誰が（メンバー）」「何を（ロール）」「どのリソースに対して」できるかを定義するバインディングの集合。ポリシーはリソース階層の各レベルに紐付けられ、継承される。",
            useCases: [
              "特定のユーザーにプロジェクトへのビューアーアクセスを付与する",
              "サービスアカウントにCloud Storageへの書き込み権限を付与する",
              "グループ単位でBigQueryデータセットへのアクセスを管理する",
              "外部IDプロバイダからのWorkload Identity FederationによるアクセスをIAMで制御する",
            ],
            characteristics: [
              "ポリシーは親リソースから子リソースへ継承される（組織→フォルダ→プロジェクト→リソース）",
              "Deny policyを使用すると継承されたAllow policyを上書きできる（2022年GA）",
              "最大1,500件のメンバー・ロールバインディングをプロジェクト単位で設定可能",
              "条件付きロールバインディング（IAM Conditions）で時間帯やリソースタグに基づく制御が可能",
              "ポリシーの変更はCloud Audit Logsに記録される",
            ],
            examRelevance:
              "試験では「最小権限の原則」に従ったロール設計が問われる。ポリシー継承の順序と、より限定的なポリシーが優先されないことに注意（親の許可は子にも有効）。",
          },
          {
            type: "comparison_table",
            title: "IAMロール種別比較",
            headers: ["種別", "定義者", "権限の粒度", "カスタマイズ", "推奨ユースケース", "注意点"],
            rows: [
              {
                label: "基本ロール（Primitive）",
                values: [
                  "Google",
                  "非常に粗い（プロジェクト全体）",
                  "不可",
                  "Owner / Editor / Viewer の3種類のみ",
                  "本番環境では非推奨。Ownerはすべての権限を持つ",
                ],
                highlight: false,
              },
              {
                label: "事前定義ロール（Predefined）",
                values: [
                  "Google",
                  "サービス単位で細かく定義",
                  "不可",
                  "roles/storage.objectViewer など600種類以上",
                  "通常はこれを使用。Googleがメンテナンスする",
                ],
                highlight: true,
              },
              {
                label: "カスタムロール（Custom）",
                values: [
                  "ユーザー",
                  "個別パーミッションレベル",
                  "完全にカスタマイズ可能",
                  "独自ビジネス要件・最小権限の厳格な実装",
                  "プロジェクト/組織レベルのみ作成可能。メンテナンスコストが高い",
                ],
                highlight: false,
              },
            ],
            footnote:
              "試験ではOwner/Editorなどの基本ロールを本番環境に付与する選択肢は通常「不正解」。事前定義ロールを優先する。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験頻出：ロール選択の優先順位",
            content:
              "ACE試験でロール設計問題が出た場合、選択の優先順位は「事前定義ロール > カスタムロール > 基本ロール」。Owner/Editorを本番で使う選択肢は基本的に誤り。また、「最小権限の原則」に従い、必要最小限の権限のみ付与する選択肢を選ぶこと。",
          },
        ],
      },
      {
        id: "ace-iam-s2",
        title: "サービスアカウント",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "サービスアカウント（Service Account）",
            definition:
              "人間ではなくアプリケーションやVMなどのワークロードが使用するGoogle Accountの特殊な種類。GCPサービス間の認証・認可に使用される。メールアドレス形式（PROJECT_ID@PROJECT_ID.iam.gserviceaccount.com）で識別される。",
            useCases: [
              "Compute Engine VMがCloud Storageにアクセスする際の認証",
              "Cloud FunctionsがBigQueryにクエリを実行する際の認証",
              "Cloud RunコンテナがSecret Managerからシークレットを取得する際",
              "CI/CDパイプライン（GitHub Actions等）がGCPリソースをデプロイする際",
              "オンプレミスサーバーがGCP APIを呼び出す際（キーファイル使用またはWorkload Identity Federation）",
            ],
            characteristics: [
              "デフォルトサービスアカウントはプロジェクト作成時に自動生成される（roles/editor付与済み・要注意）",
              "サービスアカウントキー（JSON）はセキュリティリスクが高いため、可能な限りWorkload Identity等で代替",
              "サービスアカウントはリソースとしてIAMポリシーを持てる（impersonation制御）",
              "roles/iam.serviceAccountTokenCreatorでトークン生成権限を委任できる",
              "サービスアカウントのなりすまし（Impersonation）は監査ログで追跡可能",
            ],
            examRelevance:
              "デフォルトサービスアカウントへのroles/editor付与は試験で「問題のある設定」として出題される。用途に合った専用サービスアカウントを作成し最小権限を付与するパターンを選ぶこと。",
          },
          {
            type: "code_example",
            language: "bash",
            title: "サービスアカウントの作成とIAMバインディング",
            code: `# サービスアカウントの作成
gcloud iam service-accounts create my-app-sa \\
  --display-name="My Application SA" \\
  --description="Cloud StorageにアクセスするアプリケーションのSA"

# サービスアカウントへのロール付与
gcloud projects add-iam-policy-binding PROJECT_ID \\
  --member="serviceAccount:my-app-sa@PROJECT_ID.iam.gserviceaccount.com" \\
  --role="roles/storage.objectAdmin"

# VMへのサービスアカウント紐付け（インスタンス作成時）
gcloud compute instances create my-vm \\
  --service-account=my-app-sa@PROJECT_ID.iam.gserviceaccount.com \\
  --scopes=https://www.googleapis.com/auth/cloud-platform

# サービスアカウントのimpersonation（キーなし認証）
gcloud auth print-access-token \\
  --impersonate-service-account=my-app-sa@PROJECT_ID.iam.gserviceaccount.com

# サービスアカウント一覧の確認
gcloud iam service-accounts list`,
            explanation:
              "VMにサービスアカウントを紐付ける場合、--scopes=cloud-platform と組み合わせてIAMポリシーで細かく制御するのがベストプラクティス。キーファイルの発行は最終手段として使用する。",
          },
          {
            type: "key_point",
            level: "warning",
            title: "デフォルトサービスアカウントの危険性",
            content:
              "GCEとApp Engineのデフォルトサービスアカウントにはroles/editorが自動付与されている。これは過剰な権限であり、本番環境では必ず専用のサービスアカウントを作成し、必要最小限のロールのみを付与すること。また、サービスアカウントキーのダウンロードは管理が困難なため、Workload Identity Federationや内部認証メカニズムを優先する。",
          },
        ],
      },
      {
        id: "ace-iam-s3",
        title: "組織リソース階層",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown: `## GCPリソース階層の構造

GCPのリソースは以下の4層の階層構造で管理されます。IAMポリシーは上位から下位へ**継承**されます（逆は不可）。

\`\`\`
組織（Organization）
  └── フォルダ（Folder）※ネスト可能
        └── プロジェクト（Project）
              └── リソース（GCE VM、GCS Bucket等）
\`\`\`

### 継承の重要なルール
- **親で付与したAllow policyは子でも有効**（削除・上書き不可）
- **Deny policyは継承の例外**：親でDenyされた権限は子でも拒否される
- **最も限定的なスコープでロールを付与**することが最小権限の原則

### 試験でよく問われるシナリオ
- フォルダAのuser@example.comにroles/viewerを付与 → フォルダA配下の全プロジェクト・リソースにビューア権限が伝播
- プロジェクトでより制限されたロールを付与しても、組織レベルの広いロールは上書きされない`,
          },
          {
            type: "decision_tree",
            title: "どのレベルでロールを付与すべきか？",
            rootId: "q1",
            nodes: [
              {
                id: "q1",
                question: "全プロジェクトに同じ権限が必要か？",
                yesId: "q2",
                noId: "q3",
              },
              {
                id: "q2",
                question: "全社員（または大規模グループ）に付与するか？",
                yesId: "ans-org",
                noId: "ans-org-group",
              },
              {
                id: "q3",
                question: "複数プロジェクトをまたぐ特定チームへの付与か？",
                yesId: "ans-folder",
                noId: "q4",
              },
              {
                id: "q4",
                question: "単一プロジェクト内の権限か？",
                yesId: "ans-project",
                noId: "ans-resource",
              },
              {
                id: "ans-org",
                answer: "組織レベルでロールを付与",
                explanation: "全プロジェクトに継承される。roles/viewer等の読み取り専用が典型例",
              },
              {
                id: "ans-org-group",
                answer: "組織レベルでGoogle Groupにロールを付与",
                explanation: "個人ではなくグループ単位で管理することでスケーラブルなIAM管理が可能",
              },
              {
                id: "ans-folder",
                answer: "フォルダレベルでロールを付与",
                explanation: "事業部・環境（dev/staging/prod）ごとにフォルダを分けて管理するのがベストプラクティス",
              },
              {
                id: "ans-project",
                answer: "プロジェクトレベルでロールを付与",
                explanation: "最も一般的なスコープ。プロジェクト単位でのアクセス制御",
              },
              {
                id: "ans-resource",
                answer: "リソースレベルでロールを付与",
                explanation: "GCS Bucket、BigQuery Dataset等の個別リソースへの細粒度アクセス制御",
              },
            ],
          },
          {
            type: "comparison_table",
            title: "リソース階層レベル比較",
            headers: ["レベル", "主な用途", "IAM継承", "Org Policy", "課金単位"],
            rows: [
              {
                label: "組織（Organization）",
                values: [
                  "企業全体のポリシー設定・Workspace連携",
                  "全下位リソースへ継承",
                  "設定可能（最上位）",
                  "非（プロジェクト単位）",
                ],
              },
              {
                label: "フォルダ（Folder）",
                values: [
                  "部門・環境・チームのグループ化",
                  "配下プロジェクト・リソースへ継承",
                  "設定可能（フォルダ以下に適用）",
                  "非（プロジェクト単位）",
                ],
              },
              {
                label: "プロジェクト（Project）",
                values: [
                  "APIの有効化・課金の単位・リソースのスコープ",
                  "配下リソースへ継承",
                  "設定可能（プロジェクト以下に適用）",
                  "はい（課金アカウントに紐付く）",
                ],
                highlight: true,
              },
              {
                label: "リソース（Resource）",
                values: [
                  "VM・Bucket・Dataset等の個別サービスリソース",
                  "なし（最下位）",
                  "一部サービスで可能",
                  "プロジェクトを通じて課金",
                ],
              },
            ],
            footnote:
              "組織リソースはCloud Identity / Google Workspaceドメインが必要。個人のGmailアカウントでは組織を作成できない。",
          },
        ],
      },
      {
        id: "ace-iam-s4",
        title: "監査ログとCloud Audit Logs",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud Audit Logs（監査ログ）",
            definition:
              "GCPリソースに対する「誰が・いつ・何をしたか」を記録するログサービス。Cloud Loggingと統合されており、コンプライアンス・セキュリティ調査・インシデント対応に使用される。3種類の監査ログが存在する。",
            useCases: [
              "不正アクセスの検知（誰がいつどのリソースにアクセスしたか）",
              "コンプライアンス要件への対応（SOC2、PCI DSS等）",
              "IAMポリシー変更の追跡（誰がロールを付与・削除したか）",
              "Cloud Storageバケットへのデータアクセス監査",
            ],
            characteristics: [
              "管理アクティビティ監査ログ：デフォルト有効・無効化不可・課金なし（APIの書き込み操作）",
              "データアクセス監査ログ：デフォルト無効・有効化で課金発生（API読み取り・データ操作）",
              "システムイベント監査ログ：GCPシステムが自動実行した操作（ライブマイグレーション等）",
              "ポリシー拒否監査ログ（v2）：IAM Denyポリシーによる拒否を記録",
              "ログの保存期間：管理アクティビティ400日、データアクセス30日（Cloud Storageで長期保存可能）",
            ],
            examRelevance:
              "試験では「データアクセス監査ログはデフォルトで無効」という点が頻出。有効化するにはIAM & 管理画面またはgcloudコマンドで明示的に設定が必要。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "監査ログ試験頻出ポイント",
            content: `監査ログに関する重要な試験ポイント：

1. **管理アクティビティログ**はデフォルト有効で無効化不可（追加コストなし）
2. **データアクセスログ**はデフォルト無効。BigQuery等のデータ操作を監査したい場合は明示的に有効化が必要（Logging料金発生）
3. **ログルーター（Log Router）**でCloud Storage、BigQuery、Pub/Subへエクスポート可能
4. ログはプロジェクト・フォルダ・組織レベルで確認でき、**集約シンク**で一元管理可能
5. BigQueryへのエクスポートで長期保存・SQLによる分析が可能`,
          },
        ],
      },
    ],
  },
  {
    id: "ace-compute",
    certId: "ace",
    domainName: "コンピューティングリソース",
    title: "Computeリソースの選択と管理",
    description:
      "GCPのコンピューティングサービス（GCE、GKE、Cloud Run、App Engine、Cloud Functions）の特性を理解し、ユースケースに応じた適切なサービス選択とリソース管理を学習します。",
    estimatedMinutes: 90,
    difficulty: "intermediate",
    prerequisites: ["ace-iam"],
    relatedLabIds: ["lab-gce-basics", "lab-gke-autopilot", "lab-cloud-run"],
    sections: [
      {
        id: "ace-compute-s1",
        title: "Computeオプション比較",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "GCPコンピューティングサービス全比較",
            headers: ["サービス", "管理レベル", "スケール", "課金単位", "最適ユースケース", "コンテナ対応"],
            rows: [
              {
                label: "Compute Engine (GCE)",
                values: [
                  "IaaS（OS・ミドルウェアまで管理）",
                  "手動 or MIGによる自動スケール",
                  "秒単位（最低1分）",
                  "レガシーアプリ・OSレベル制御が必要・高パフォーマンス計算",
                  "可（Docker等を自分でインストール）",
                ],
              },
              {
                label: "Google Kubernetes Engine (GKE)",
                values: [
                  "CaaS（コントロールプレーンはGoogle管理）",
                  "HPA/VPA/Cluster Autoscalerで自動スケール",
                  "ノード単位（秒）",
                  "マイクロサービス・コンテナオーケストレーション・ML系ワークロード",
                  "はい（Kubernetes Pod単位）",
                ],
                highlight: true,
              },
              {
                label: "Cloud Run",
                values: [
                  "フルマネージド（インフラ管理不要）",
                  "0〜Nまで完全自動（0スケール対応）",
                  "リクエスト単位 or 最小インスタンス",
                  "HTTPリクエスト駆動・ステートレスAPI・イベント駆動",
                  "はい（コンテナイメージをデプロイ）",
                ],
                highlight: true,
              },
              {
                label: "App Engine Standard",
                values: [
                  "PaaS（ランタイムはGoogle提供）",
                  "完全自動（0スケール対応）",
                  "インスタンス時間",
                  "Web/APIアプリ・特定ランタイム（Python/Java/Node等）",
                  "限定的（カスタムランタイムはFlexible）",
                ],
              },
              {
                label: "App Engine Flexible",
                values: [
                  "PaaS + Docker（GCEベース）",
                  "自動（最低1インスタンス常時起動）",
                  "vCPU/メモリ時間",
                  "カスタムランタイム・長時間処理・バックグラウンドスレッド",
                  "はい（Dockerfile指定）",
                ],
              },
              {
                label: "Cloud Functions（第2世代）",
                values: [
                  "FaaS（関数単位のデプロイ）",
                  "完全自動（0スケール対応）",
                  "呼び出し回数 + CPU/メモリ時間",
                  "イベント駆動・軽量処理・Pub/Sub/GCSトリガー",
                  "内部的にCloud Runで実行",
                ],
              },
            ],
            footnote:
              "試験では「サーバーレス」「フルマネージド」「コンテナ」「OSレベル制御」等のキーワードからサービスを特定する問題が多い。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "コンピューティングサービス選択の決め手",
            content: `サービス選択の判断基準：

- **OSレベルの制御が必要** → Compute Engine
- **既存コンテナアプリをKubernetesで管理** → GKE（Autopilotで管理負担軽減）
- **ステートレスHTTPコンテナ・0スケール必要** → Cloud Run
- **特定言語ランタイム・PaaS希望** → App Engine Standard
- **イベント駆動・軽量処理・数百行のコード** → Cloud Functions

「最小の運用負荷」を求める問題はCloud Run or Cloud Functions。「既存のKubernetesワークロード」はGKE。`,
          },
        ],
      },
      {
        id: "ace-compute-s2",
        title: "Compute Engineの設定",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "マシンタイプファミリー",
            definition:
              "Compute Engineのマシンタイプはワークロードに最適化された複数のファミリーで構成される。vCPUとメモリの比率・アーキテクチャ・用途によって選択する。",
            useCases: [
              "汎用（E2/N2/N2D）：Webサーバー・開発環境・中規模DBなど一般的なワークロード",
              "コンピューティング最適化（C2/C2D）：高周波CPUが必要なゲーム・HPC・スキャン処理",
              "メモリ最適化（M1/M2/M3）：SAP HANA・大規模インメモリDB・リアルタイム分析",
              "ストレージ最適化（Z3）：高スループットI/OのRDBMS・データウェアハウス",
              "アクセラレータ最適化（A2/A3）：ML学習・推論・GPUが必要なワークロード",
            ],
            characteristics: [
              "カスタムマシンタイプ：vCPUとメモリを個別指定（N1/N2/E2系で対応）",
              "Spot VM（旧プリエンプティブル）：最大90%オフだが24時間以内に停止される可能性",
              "確約利用割引（CUD）：1年または3年コミットで最大57%割引",
              "持続使用割引（SUD）：月間使用率に応じて自動的に最大30%割引（コミット不要）",
              "シールドVM：セキュアブート・vTPM・整合性監視でセキュリティを強化",
            ],
            examRelevance:
              "「コスト最適化」問題ではSpot VM・CUD・SUD・自動スケールの組み合わせが問われる。Spot VMは中断されても問題ないバッチ処理に最適。",
          },
          {
            type: "code_example",
            language: "bash",
            title: "VM作成・管理コマンド",
            code: `# 基本的なVM作成
gcloud compute instances create my-vm \\
  --zone=asia-northeast1-a \\
  --machine-type=e2-medium \\
  --image-family=debian-11 \\
  --image-project=debian-cloud \\
  --boot-disk-size=50GB \\
  --boot-disk-type=pd-ssd

# Spot VM（プリエンプティブル）の作成
gcloud compute instances create my-spot-vm \\
  --zone=asia-northeast1-a \\
  --machine-type=n2-standard-4 \\
  --provisioning-model=SPOT \\
  --instance-termination-action=STOP

# カスタムマシンタイプの作成（6 vCPU, 24GB RAM）
gcloud compute instances create my-custom-vm \\
  --zone=asia-northeast1-a \\
  --machine-type=custom-6-24576

# SSHで接続
gcloud compute ssh my-vm --zone=asia-northeast1-a

# インスタンスの停止・起動・削除
gcloud compute instances stop my-vm --zone=asia-northeast1-a
gcloud compute instances start my-vm --zone=asia-northeast1-a
gcloud compute instances delete my-vm --zone=asia-northeast1-a

# スナップショットの作成
gcloud compute disks snapshot my-vm \\
  --snapshot-names=my-vm-snapshot-$(date +%Y%m%d) \\
  --zone=asia-northeast1-a`,
            explanation:
              "ゾーンはリソース配置の最小単位。高可用性のためには複数ゾーンへの分散が必要（MIGで実現）。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "プリエンプティブルVM / Spot VMの試験ポイント",
            content: `Spot VM（旧プリエンプティブル）の重要な特徴：

1. 最大90%のコスト削減が可能
2. Googleのキャパシティが必要になると**30秒の警告後に停止**される
3. **最大24時間**の実行時間制限がある（旧プリエンプティブル）、Spot VMは時間制限なし
4. **チェックポイント・再起動設計が必須**（中断されても大丈夫なワークロード）
5. 最適なユースケース：バッチ処理、ML学習、動画トランスコーディング、CI/CDワークロード
6. **SLA対象外**（可用性保証なし）`,
          },
        ],
      },
      {
        id: "ace-compute-s3",
        title: "マネージドインスタンスグループ（MIG）",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "マネージドインスタンスグループ（MIG）",
            definition:
              "同一のインスタンステンプレートから作成された複数のVM群を一元管理するサービス。オートスケール、自動修復、ローリングアップデート、ロードバランサーとの統合を提供する。",
            useCases: [
              "Webアプリケーションのオートスケール（負荷に応じた自動増減）",
              "高可用性が必要なサービス（インスタンス障害時の自動修復）",
              "ダウンタイムなしのアプリケーションアップデート（ローリングアップデート）",
              "複数ゾーンにまたがる冗長構成（リージョンMIG）",
            ],
            characteristics: [
              "インスタンステンプレートで定義された設定（マシンタイプ・イメージ・SA等）に基づきVM作成",
              "ヘルスチェックに失敗したインスタンスを自動削除・再作成（自動修復）",
              "CPU使用率・LBキャパシティ・カスタムメトリクスに基づくオートスケール",
              "ゾーンMIG（単一ゾーン）とリージョンMIG（最大3ゾーンに分散）の2種類",
              "ステートフルMIGでディスク・IPを保持したままスケール可能",
            ],
            examRelevance:
              "試験では「高可用性のWebアプリ設計」にMIG + ロードバランサーの組み合わせが正解パターン。リージョンMIGが単一障害点を排除する。",
          },
          {
            type: "text",
            markdown: `## オートスケーリングの設定

MIGのオートスケールは以下のメトリクスに基づいて動作します：

| メトリクス | 説明 | ユースケース |
|---|---|---|
| CPU使用率 | 平均CPU使用率がターゲット値を超えたらスケールアウト | 汎用Webアプリ |
| LBキャパシティ利用率 | ロードバランサーのバックエンドキャパシティ | HTTP(S) LB連携時 |
| 1インスタンスあたりのリクエスト数 | リクエスト数が閾値を超えたらスケールアウト | 高スループットAPI |
| Cloud Monitoring カスタムメトリクス | 任意のメトリクスに基づくスケール | 高度なスケール要件 |

### スケールインの保護
- **最小インスタンス数**（min-num-replicas）を設定して0スケールを防止
- **安定期間**（--cool-down-period）でスケールイン後の揺れを防止（デフォルト60秒）`,
          },
          {
            type: "code_example",
            language: "bash",
            title: "MIG作成とオートスケール設定",
            code: `# インスタンステンプレートの作成
gcloud compute instance-templates create web-template \\
  --machine-type=e2-medium \\
  --image-family=debian-11 \\
  --image-project=debian-cloud \\
  --tags=http-server \\
  --metadata=startup-script='#!/bin/bash
    apt-get update && apt-get install -y nginx
    systemctl start nginx'

# リージョンMIGの作成（3ゾーンに分散）
gcloud compute instance-groups managed create web-mig \\
  --region=asia-northeast1 \\
  --template=web-template \\
  --size=3

# オートスケールの設定（CPU 60%目標）
gcloud compute instance-groups managed set-autoscaling web-mig \\
  --region=asia-northeast1 \\
  --max-num-replicas=10 \\
  --min-num-replicas=2 \\
  --target-cpu-utilization=0.6 \\
  --cool-down-period=60

# ヘルスチェックの作成とMIGへの適用
gcloud compute health-checks create http web-health-check \\
  --port=80 \\
  --request-path=/health \\
  --check-interval=10s \\
  --unhealthy-threshold=3

gcloud compute instance-groups managed set-autohealing web-mig \\
  --region=asia-northeast1 \\
  --health-check=web-health-check \\
  --initial-delay=300`,
            explanation:
              "初期遅延（--initial-delay）はアプリケーションの起動時間を考慮して設定する。短すぎると起動中のインスタンスが不健全と判断されて再起動ループに陥る。",
          },
        ],
      },
      {
        id: "ace-compute-s4",
        title: "Cloud Load Balancing",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "Cloud Load Balancingの種別比較",
            headers: ["種別", "プロトコル", "スコープ", "バックエンド", "SSL終端", "主なユースケース"],
            rows: [
              {
                label: "グローバルHTTP(S) LB（外部）",
                values: [
                  "HTTP/HTTPS/HTTP2/gRPC",
                  "グローバル（エニーキャスト）",
                  "MIG・GKE・Cloud Run・Cloud Storage",
                  "あり（証明書管理・Cloud Armor統合）",
                  "グローバルWebアプリ・CDN・マルチリージョンAPI",
                ],
                highlight: true,
              },
              {
                label: "リージョンHTTP(S) LB（外部）",
                values: [
                  "HTTP/HTTPS",
                  "リージョン内",
                  "MIG・NEG",
                  "あり",
                  "特定リージョンのみにトラフィックを限定したいWebアプリ",
                ],
              },
              {
                label: "TCP/UDP LB（外部・リージョン）",
                values: [
                  "TCP/UDP/その他L4",
                  "リージョン",
                  "MIG・VM",
                  "なし（パススルー型）",
                  "ゲームサーバー・非HTTPプロトコル・IPアドレス保持が必要",
                ],
              },
              {
                label: "内部TCP/UDP LB",
                values: [
                  "TCP/UDP（L4）",
                  "リージョン（VPC内部）",
                  "MIG・VM",
                  "なし",
                  "マイクロサービス間通信・VPC内部のトラフィック",
                ],
              },
              {
                label: "内部HTTP(S) LB",
                values: [
                  "HTTP/HTTPS/gRPC（L7）",
                  "リージョン（VPC内部）",
                  "MIG・Cloud Run・NEG",
                  "あり",
                  "VPC内マイクロサービス・プライベートAPIゲートウェイ",
                ],
                highlight: true,
              },
            ],
            footnote:
              "グローバルLBはAnycasting IPアドレス（一つのIPで全リージョン対応）。SSL証明書の自動管理（Google Managed Certificate）はグローバルHTTPS LBのみ対応。",
          },
          {
            type: "decision_tree",
            title: "どのロードバランサーを選ぶか",
            rootId: "lb-q1",
            nodes: [
              {
                id: "lb-q1",
                question: "インターネットからの外部トラフィックか？",
                yesId: "lb-q2",
                noId: "lb-q5",
              },
              {
                id: "lb-q2",
                question: "HTTP/HTTPS/gRPCプロトコルか？",
                yesId: "lb-q3",
                noId: "lb-q4",
              },
              {
                id: "lb-q3",
                question: "グローバル（複数リージョン）にサービスを展開するか？",
                yesId: "lb-ans-global-https",
                noId: "lb-ans-regional-https",
              },
              {
                id: "lb-q4",
                question: "クライアントIPアドレスの保持が必要か？",
                yesId: "lb-ans-network",
                noId: "lb-ans-tcp-proxy",
              },
              {
                id: "lb-q5",
                question: "VPC内部トラフィックか？",
                yesId: "lb-q6",
                noId: "lb-ans-hybrid",
              },
              {
                id: "lb-q6",
                question: "HTTP/gRPCプロトコルか？",
                yesId: "lb-ans-internal-https",
                noId: "lb-ans-internal-tcp",
              },
              {
                id: "lb-ans-global-https",
                answer: "グローバルHTTP(S) ロードバランサー",
                explanation: "Anycast IP・Cloud Armor・Cloud CDN統合。マルチリージョンWebアプリの標準構成",
              },
              {
                id: "lb-ans-regional-https",
                answer: "リージョンHTTP(S) ロードバランサー",
                explanation: "特定リージョンのみ。データレジデンシー要件がある場合に適用",
              },
              {
                id: "lb-ans-network",
                answer: "ネットワーク（TCP/UDP）ロードバランサー",
                explanation: "パススルー型でクライアントIPを保持。ゲームサーバー・DNS・VoIPに適用",
              },
              {
                id: "lb-ans-tcp-proxy",
                answer: "TCPプロキシ / SSLプロキシ ロードバランサー",
                explanation: "グローバルTCP/SSLトラフィックのプロキシ型。クライアントIPはX-Forwarded-Forで取得",
              },
              {
                id: "lb-ans-internal-https",
                answer: "内部HTTP(S) ロードバランサー",
                explanation: "VPC内マイクロサービスのL7 LB。Cloud RunやGKEバックエンドに対応",
              },
              {
                id: "lb-ans-internal-tcp",
                answer: "内部TCP/UDP ロードバランサー",
                explanation: "VPC内のL4 LB。データベース・内部APIサーバーへの分散に使用",
              },
              {
                id: "lb-ans-hybrid",
                answer: "ハイブリッドLBまたはCloud Interconnect/VPN経由",
                explanation: "オンプレミスへのトラフィック分散。Hybrid NEGを使用してオンプレミスバックエンドを追加",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ace-storage",
    certId: "ace",
    domainName: "ストレージとデータベース",
    title: "ストレージの選択と管理",
    description:
      "GCPのストレージサービス全体像を把握し、ユースケースに応じた適切なサービス選択と運用管理を学習します。Cloud Storage、データベースサービス、コスト最適化まで体系的に習得します。",
    estimatedMinutes: 85,
    difficulty: "intermediate",
    prerequisites: [],
    relatedLabIds: ["lab-gcs-basics", "lab-cloud-sql", "lab-bigquery"],
    sections: [
      {
        id: "ace-storage-s1",
        title: "ストレージサービス完全比較",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "GCPストレージ・データベースサービス全比較",
            headers: ["サービス", "データモデル", "スケール", "整合性", "主なユースケース", "試験キーワード"],
            rows: [
              {
                label: "Cloud Storage (GCS)",
                values: [
                  "オブジェクト（バイナリ・非構造化）",
                  "無制限（ペタバイト級）",
                  "強整合性（2021年〜）",
                  "メディア・バックアップ・データレイク・静的Webホスティング",
                  "バケット・オブジェクト・ライフサイクル・署名付きURL",
                ],
              },
              {
                label: "Cloud SQL",
                values: [
                  "リレーショナル（MySQL/PostgreSQL/SQL Server）",
                  "最大96 vCPU・624GB RAM・64TB",
                  "強整合性（ACID）",
                  "既存RDB移行・中規模Webアプリ・CMS",
                  "フルマネージドRDB・HA構成・リードレプリカ・自動バックアップ",
                ],
              },
              {
                label: "Cloud Spanner",
                values: [
                  "リレーショナル（分散SQL）",
                  "水平スケール（無制限）・グローバル分散",
                  "外部整合性（最強レベル）",
                  "グローバル決済・在庫管理・高可用性DB",
                  "水平スケール・グローバル分散・外部整合性・TrueTime",
                ],
                highlight: true,
              },
              {
                label: "Firestore",
                values: [
                  "ドキュメント（NoSQL）",
                  "自動スケール",
                  "強整合性（単一ドキュメント）",
                  "モバイル/Webアプリ・リアルタイム同期・ユーザープロファイル",
                  "サーバーレス・SDKリアルタイム同期・コレクション/ドキュメント",
                ],
              },
              {
                label: "Cloud Bigtable",
                values: [
                  "Wide Column（HBase互換）",
                  "ペタバイト級・高スループット",
                  "結果整合性",
                  "IoTデータ・時系列・AdTech・ML特徴量ストア",
                  "HBase互換・Row Key設計・大規模時系列・低レイテンシ",
                ],
                highlight: true,
              },
              {
                label: "BigQuery",
                values: [
                  "列指向（DWH）",
                  "ペタバイト級のクエリ対応",
                  "結果整合性（ストリーミング挿入後）",
                  "データウェアハウス・BI分析・ML（BQML）・大規模集計",
                  "サーバーレスDWH・オンデマンド/定額課金・パーティション・クラスタ",
                ],
              },
              {
                label: "Memorystore",
                values: [
                  "キーバリュー（Redis/Memcached）",
                  "最大300GB（Redis）",
                  "結果整合性（レプリカ）",
                  "セッション管理・キャッシュ・リーダーボード・Pub/Sub代替",
                  "フルマネージドRedis/Memcached・インメモリキャッシュ",
                ],
              },
            ],
            footnote:
              "試験の判断基準：SQL必須→Cloud SQL or Spanner、大規模時系列→Bigtable、分析→BigQuery、NoSQLドキュメント→Firestore、キャッシュ→Memorystore",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "ストレージ選択の試験頻出パターン",
            content: `ストレージ選択問題での判断キーワード：

- **「トランザクション・ACID・既存MySQL/PostgreSQL移行」** → Cloud SQL
- **「グローバル分散・水平スケール・SQL・高可用性」** → Cloud Spanner
- **「リアルタイム・モバイルアプリ・ドキュメント型NoSQL」** → Firestore
- **「IoT・時系列・HBase互換・毎秒数百万書き込み」** → Bigtable
- **「データウェアハウス・BI・大規模分析・SQLクエリ」** → BigQuery
- **「キャッシュ・セッション・Redis・低レイテンシ読み取り」** → Memorystore
- **「画像・動画・バックアップ・非構造化データ」** → Cloud Storage`,
          },
        ],
      },
      {
        id: "ace-storage-s2",
        title: "Cloud Storageの詳細",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud Storageクラス（ストレージクラス）",
            definition:
              "Cloud Storageはアクセス頻度・コスト要件に応じて4つのストレージクラスを提供する。クラス間の移行はライフサイクルポリシーで自動化できる。",
            useCases: [
              "Standard：頻繁にアクセスされるWebコンテンツ・アプリケーションデータ",
              "Nearline：月1回程度のアクセス（バックアップ・メディアアーカイブ）",
              "Coldline：四半期に1回程度のアクセス（障害復旧用データ・規制対応アーカイブ）",
              "Archive：年1回以下のアクセス（長期保存・コンプライアンス・オフサイトバックアップ）",
            ],
            characteristics: [
              "Standard：ストレージ料金最高・読み取り無料・最小保存期間なし",
              "Nearline：ストレージ料金中・読み取り料金あり・最小保存期間30日",
              "Coldline：ストレージ料金低・読み取り料金高・最小保存期間90日",
              "Archive：ストレージ料金最低・読み取り料金最高・最小保存期間365日",
              "どのクラスもSLA99.95%（デュアルリージョン）・99.9%（リージョン）・99.0%（マルチリージョン）",
            ],
            examRelevance:
              "「コスト最適化」問題でライフサイクルポリシーによる自動クラス移行が頻出。「90日後にNearlineへ、365日後にArchiveへ」という設定パターンを覚えること。",
          },
          {
            type: "code_example",
            language: "bash",
            title: "gsutil / gcloud storage コマンド",
            code: `# バケット作成（gcloud storage推奨、gsutilはレガシー）
gcloud storage buckets create gs://my-bucket \\
  --location=asia-northeast1 \\
  --storage-class=STANDARD \\
  --uniform-bucket-level-access

# オブジェクトのアップロード
gcloud storage cp ./local-file.txt gs://my-bucket/
gcloud storage cp -r ./local-dir/ gs://my-bucket/

# ライフサイクルポリシーの設定（JSONファイルで定義）
cat > lifecycle.json << 'EOF'
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30, "matchesStorageClass": ["STANDARD"]}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90, "matchesStorageClass": ["NEARLINE"]}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
EOF

gcloud storage buckets update gs://my-bucket \\
  --lifecycle-file=lifecycle.json

# バケットのIAMポリシー設定（一様なバケットレベルのアクセス）
gcloud storage buckets add-iam-policy-binding gs://my-bucket \\
  --member="allUsers" \\
  --role="roles/storage.objectViewer"

# 署名付きURL（一時アクセスURL）の生成
gcloud storage sign-url gs://my-bucket/private-file.pdf \\
  --duration=1h \\
  --private-key-file=service-account-key.json`,
            explanation:
              "uniformBucketLevelAccessを有効化すると、オブジェクトレベルのACLが無効になりIAMのみで制御される。セキュリティのベストプラクティス。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "Lifecycle Policyの試験ポイント",
            content: `Cloud Storageライフサイクルポリシーの重要ポイント：

1. **age条件**：オブジェクト作成からの日数（0から開始）
2. **matchesStorageClass**：特定クラスのオブジェクトのみに適用
3. **最小保存期間**：Nearline=30日、Coldline=90日、Archive=365日の前に削除・変更すると**早期削除料金**が発生
4. **バージョニング**と組み合わせて旧バージョンの自動削除が可能（noncurrentDays条件）
5. 試験では「コスト削減・アーカイブ自動化」の設問でライフサイクルが正解パターン`,
          },
        ],
      },
      {
        id: "ace-storage-s3",
        title: "データベース選択の意思決定",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "decision_tree",
            title: "GCPデータベース選択フロー",
            rootId: "db-q1",
            nodes: [
              {
                id: "db-q1",
                question: "SQLトランザクション（ACID）が必要か？",
                yesId: "db-q2",
                noId: "db-q5",
              },
              {
                id: "db-q2",
                question: "グローバル分散・水平スケールが必要か？",
                yesId: "db-ans-spanner",
                noId: "db-q3",
              },
              {
                id: "db-q3",
                question: "既存のMySQL/PostgreSQL/SQL Serverからの移行か？",
                yesId: "db-ans-sql",
                noId: "db-q4",
              },
              {
                id: "db-q4",
                question: "データウェアハウス・大規模分析クエリが目的か？",
                yesId: "db-ans-bigquery",
                noId: "db-ans-sql",
              },
              {
                id: "db-q5",
                question: "時系列・IoT・毎秒数百万の書き込みが必要か？",
                yesId: "db-ans-bigtable",
                noId: "db-q6",
              },
              {
                id: "db-q6",
                question: "モバイル/Webのリアルタイム同期・ドキュメント型か？",
                yesId: "db-ans-firestore",
                noId: "db-q7",
              },
              {
                id: "db-q7",
                question: "インメモリキャッシュ・セッション管理が目的か？",
                yesId: "db-ans-memorystore",
                noId: "db-ans-gcs",
              },
              {
                id: "db-ans-spanner",
                answer: "Cloud Spanner",
                explanation: "グローバル分散・外部整合性・水平スケール。コストは高いが無敵の可用性",
              },
              {
                id: "db-ans-sql",
                answer: "Cloud SQL",
                explanation: "フルマネージドMySQL/PostgreSQL/SQL Server。最大96vCPU・HA構成・リードレプリカ対応",
              },
              {
                id: "db-ans-bigquery",
                answer: "BigQuery",
                explanation: "サーバーレスDWH。ペタバイト級の分析クエリ。ETL不要でGCSから直接クエリ可能",
              },
              {
                id: "db-ans-bigtable",
                answer: "Cloud Bigtable",
                explanation: "HBase互換のWide Column DB。Row Key設計が重要。低レイテンシ・高スループット",
              },
              {
                id: "db-ans-firestore",
                answer: "Cloud Firestore",
                explanation: "サーバーレスNoSQL。リアルタイムリスナー・オフライン対応・モバイルSDK完備",
              },
              {
                id: "db-ans-memorystore",
                answer: "Cloud Memorystore (Redis/Memcached)",
                explanation: "フルマネージドインメモリDB。セッション・キャッシュ・ランキング・Pub/Sub代替",
              },
              {
                id: "db-ans-gcs",
                answer: "Cloud Storage",
                explanation: "オブジェクトストレージ。画像・動画・バックアップ・データレイク・静的コンテンツ",
              },
            ],
          },
          {
            type: "comparison_table",
            title: "Cloud SQL vs Cloud Spanner vs Cloud Firestore",
            headers: ["項目", "Cloud SQL", "Cloud Spanner", "Cloud Firestore"],
            rows: [
              {
                label: "データモデル",
                values: ["リレーショナル（MySQL/PG/SS）", "リレーショナル（分散SQL）", "ドキュメント（NoSQL）"],
              },
              {
                label: "最大スケール",
                values: ["最大96vCPU・64TB（垂直）", "水平スケール（無制限）", "自動スケール（無制限）"],
              },
              {
                label: "整合性",
                values: ["強整合性（ACID）", "外部整合性（最強）", "強整合性（ドキュメント単位）"],
              },
              {
                label: "グローバル分散",
                values: ["なし（リードレプリカは可）", "あり（マルチリージョン）", "あり（マルチリージョン）"],
                highlight: true,
              },
              {
                label: "コスト",
                values: ["中（インスタンス型課金）", "高（ノード + ストレージ）", "低〜中（操作数課金）"],
              },
              {
                label: "最適ユースケース",
                values: ["既存RDB移行・中規模Webアプリ", "グローバル金融・在庫・ゲームスコア", "モバイル・Webアプリ・CMS"],
              },
            ],
          },
        ],
      },
      {
        id: "ace-storage-s4",
        title: "コスト最適化",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "text",
            markdown: `## ストレージコスト最適化戦略

### Cloud Storageのコスト最適化
- **ライフサイクルポリシー**：アクセス頻度に応じてNearline→Coldline→Archiveへ自動移行
- **リージョン選択**：asia（マルチリージョン）よりasia-northeast1（リージョン）の方が安価
- **Requester Pays**：バケットオーナーではなくアクセス者が転送コストを負担する設定
- **Autoclass**：GCSが自動的に最適なストレージクラスを選択する機能（2022年〜）

### データベースのコスト最適化
- **Cloud SQL**：使用しない時間帯に自動停止・HA構成は必要な場合のみ有効化
- **BigQuery**：パーティションとクラスタリングでスキャンデータ量を削減、定額料金プランの検討
- **Bigtable**：SSDよりHDD（コスト70%削減）、テスト環境は最小1ノードに

### 転送コスト
- **リージョン内**：無料（例：us-central1内のGCE→GCS）
- **リージョン間（同一マルチリージョン内）**：無料
- **リージョン間（異なるリージョン）**：有料
- **インターネットへの出力（Egress）**：有料（月200GBまで無料）`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "ストレージコスト最適化の試験ポイント",
            content: `試験でのコスト最適化問題の解法：

1. **アーカイブデータ** → Coldline/Archiveクラス + ライフサイクルポリシー
2. **BigQuery高コスト** → パーティションテーブル・クラスタリングでスキャン量削減
3. **開発環境DB** → Cloud SQL自動停止スケジュール、または最小インスタンスタイプ
4. **転送コスト削減** → 同一リージョン内でリソースを配置、Private Google Accessで外部通信を回避
5. **Bigtable開発環境** → HDDタイプの1ノードクラスタで最大70%コスト削減

「最もコスト効率の良い方法」問題では、ライフサイクルポリシー・パーティション・Spot VMの組み合わせが多い。`,
          },
        ],
      },
    ],
  },
]
