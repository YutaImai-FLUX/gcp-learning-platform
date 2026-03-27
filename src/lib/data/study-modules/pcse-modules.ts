import type { StudyModule } from "@/lib/types/study-module"

export const PCSE_MODULES: StudyModule[] = [
  {
    id: "pcse-iam-design",
    certId: "pcse",
    domainName: "IAMとOrganization Policy設計",
    title: "IAM設計とOrganization Policy",
    description:
      "GCPセキュリティエンジニアとして必須のIAM設計原則、Organization Policyによるガードレール設定、Workload Identity Federation、BeyondCorpなど高度なアクセス制御を体系的に学習します。",
    estimatedMinutes: 90,
    difficulty: "advanced",
    prerequisites: ["ace-iam"],
    relatedLabIds: ["lab-org-policy", "lab-workload-identity", "lab-beyondcorp"],
    sections: [
      {
        id: "pcse-iam-s1",
        title: "IAM設計の原則",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "key_point",
            level: "exam_tip",
            title: "セキュリティ設計の3大原則：最小権限・職務分離・監査可能性",
            content: `PCSE試験で最重要な3つの設計原則：

**1. 最小権限の原則（Principle of Least Privilege）**
- 必要最小限の権限のみ付与。roles/owner・roles/editorは本番で使用禁止
- サービスアカウントは用途別に分割し、各SAに必要なロールのみ付与
- 条件付きロールバインディング（IAM Conditions）で時間・IP・リソースタグによる制限

**2. 職務分離（Separation of Duties）**
- 単一ユーザーがワークフローの全ステップを制御できないよう設計
- 例：コードのデプロイ権限とIAMポリシー変更権限を別人に分離
- roles/iam.securityAdminとroles/deployerを同一ユーザーに付与しない

**3. 監査可能性（Auditability）**
- すべてのアクセスをCloud Audit Logsに記録
- データアクセスログを有効化（デフォルト無効）
- ログをCloud Storageまたは BigQueryに長期保存
- Log-based Alertsで異常アクセスを即時検知`,
          },
          {
            type: "text",
            markdown: `## IAM設計のベストプラクティス

### Googleグループを使ったロール管理
個人ではなくGoogle Groupsにロールを付与することで、メンバーの追加・削除をIAMポリシー変更なしに管理できる。

\`\`\`
Google Group: dev-team@company.com
  └── roles/cloudsql.client（プロジェクトレベル）
  └── roles/storage.objectViewer（特定バケット）

メンバー追加 → グループに追加するだけ（IAM変更不要）
\`\`\`

### Recommenderの活用
IAM Recommenderは過去90日間の使用状況に基づき、過剰な権限を自動検出して最小権限への移行を推奨する。本番環境での定期的なレビューに活用する。

### Resource Manager Tagsによる条件付きロールバインディング
タグベースのIAM Conditionsで、特定の環境（prod/dev）のリソースのみへのアクセスを制限できる。

\`\`\`
条件例：
resource.matchTag("company/environment", "prod")
→ prodタグが付いたリソースのみアクセス許可
\`\`\``,
          },
        ],
      },
      {
        id: "pcse-iam-s2",
        title: "Organization Policyとの違い",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "IAM Policy vs Organization Policy",
            headers: ["比較項目", "IAM Policy", "Organization Policy"],
            rows: [
              {
                label: "目的",
                values: [
                  "誰が（アイデンティティ）何を（ロール）できるかを定義",
                  "リソース設定の制約・ガードレールを定義（IAMとは独立）",
                ],
              },
              {
                label: "制御対象",
                values: [
                  "アクセス権限（読み取り・書き込み・管理）",
                  "リソース設定（パブリックIP禁止・リージョン制限・サービス制限）",
                ],
                highlight: true,
              },
              {
                label: "継承",
                values: [
                  "親から子へ伝播（削除不可）",
                  "組織→フォルダ→プロジェクトへ伝播（上書き可否はポリシーによる）",
                ],
              },
              {
                label: "オーバーライド",
                values: [
                  "子でより広い権限を付与不可（親の権限は常に有効）",
                  "allowedValuesで許可範囲を子で拡張可能（inheritFromParent設定次第）",
                ],
              },
              {
                label: "主な制約例",
                values: [
                  "roles/viewer付与・roles/storageAdmin付与",
                  "constraints/compute.vmExternalIpAccess（外部IP禁止）\nconstraints/gcp.resourceLocations（リージョン制限）\nconstraints/iam.disableServiceAccountKeyCreation（SAキー禁止）",
                ],
              },
              {
                label: "管理者ロール",
                values: ["roles/iam.securityAdmin", "roles/orgpolicy.policyAdmin"],
              },
            ],
            footnote:
              "Organization PolicyはIAMを「誰が何をできるか」で制御するのに対し、「何を設定できるか（リソース設定の制約）」を制御する。両方を組み合わせることで多層防御を実現する。",
          },
          {
            type: "concept_card",
            term: "Organization Policy制約（Constraints）",
            definition:
              "組織・フォルダ・プロジェクトレベルでGCPリソースの設定を強制的に制限・強制するルール。管理者のミスや設定漏れによるセキュリティリスクを組織全体で防止するガードレールとして機能する。",
            useCases: [
              "外部IPアドレスの割り当てを全プロジェクトで禁止（constraints/compute.vmExternalIpAccess）",
              "リソース作成をasia-northeast1リージョンのみに制限（constraints/gcp.resourceLocations）",
              "サービスアカウントキーファイルの作成を禁止（constraints/iam.disableServiceAccountKeyCreation）",
              "VPC内でのCloud Storageバケットのパブリックアクセスを全面禁止（constraints/storage.publicAccessPrevention）",
              "デフォルトネットワークの自動作成を禁止（constraints/compute.skipDefaultNetworkCreation）",
            ],
            characteristics: [
              "List Policy（許可/拒否リスト）とBoolean Policy（有効/無効）の2種類",
              "リソース作成時にOrgPolicyに違反する設定は自動的にブロックされる",
              "既存リソースへの遡及適用はされない（新規作成・変更時のみ評価）",
              "カスタム制約（Custom Constraints）でGAサービス以外の設定も制御可能",
              "Enforcedモードで即時強制、Dry Runモードで違反のみ監視（本番適用前の検証に便利）",
            ],
            examRelevance:
              "「全プロジェクトで特定の設定を禁止したい」という要件にはOrg PolicyがIAMより適切。IAMは権限制御、Org Policyはリソース設定の制約と明確に区別すること。",
          },
        ],
      },
      {
        id: "pcse-iam-s3",
        title: "Workload Identity Federation",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "Workload Identity Federation（WIF）",
            definition:
              "外部のアイデンティティプロバイダ（IdP）を使用してGCP APIに認証する仕組み。サービスアカウントキーファイル（JSON）を発行・管理せずに、OIDC/SAMLトークンをGCPの短命認証情報に交換できる。GitHub Actions・AWS EC2・Azure AD等と統合可能。",
            useCases: [
              "GitHub ActionsからGCPリソースをデプロイ（キーレスCI/CD）",
              "AWS EC2インスタンスからCloud Storageにアクセス（クロスクラウド認証）",
              "オンプレミスKubernetesワークロードからGCP APIを呼び出す",
              "Azure ADのアプリケーションがBigQueryにクエリを実行する",
            ],
            characteristics: [
              "キーローテーション不要・キー漏洩リスクゼロ（短命トークンで認証）",
              "Workload Identity Pool（信頼するIdPの集合）とProvider（個別IdP設定）で管理",
              "属性マッピングでOIDCクレームをGCPの属性に変換（google.subject = assertion.sub等）",
              "属性条件（Attribute Conditions）でアクセスを特定リポジトリ・ブランチに制限",
              "Direct Workload Identity FederationはSAの偽装なしに直接認証（2023年〜）",
            ],
            examRelevance:
              "サービスアカウントキーファイルの代替として最推奨。試験では「キーファイルなしでCI/CDをGCPに認証」の設問でWorkload Identity Federationが正解。",
          },
          {
            type: "text",
            markdown: `## Workload Identity FederationのOIDCフロー

### GitHub Actions → GCPの認証フロー
\`\`\`
1. GitHub ActionsがGitHub OIDCエンドポイントからJWTトークンを取得
2. JWTトークンをGoogle Security Token Service（STS）に送信
3. STSがGitHub OIDCのJWKS（公開鍵）でトークンを検証
4. 検証成功 → STSが短命のGCPアクセストークン（またはSA impersonationトークン）を発行
5. アクセストークンでGCP APIを呼び出す（有効期間：1時間）
\`\`\`

### Workload Identity Poolの属性条件例
\`\`\`
# リポジトリとブランチを制限する属性条件
attribute.repository == "my-org/my-repo"
&& attribute.ref == "refs/heads/main"

# AWSの特定アカウントのみ許可
attribute.aws_account_id == "123456789012"
\`\`\``,
          },
          {
            type: "code_example",
            language: "bash",
            title: "Workload Identity Federation設定（GitHub Actions用）",
            code: `# Workload Identity Poolの作成
gcloud iam workload-identity-pools create github-pool \\
  --location=global \\
  --display-name="GitHub Actions Pool"

# GitHub OIDCプロバイダーの追加
gcloud iam workload-identity-pools providers create-oidc github-provider \\
  --location=global \\
  --workload-identity-pool=github-pool \\
  --display-name="GitHub Actions Provider" \\
  --issuer-uri="https://token.actions.githubusercontent.com" \\
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \\
  --attribute-condition="assertion.repository=='my-org/my-repo'"

# サービスアカウントにWorkload Identityの偽装を許可
gcloud iam service-accounts add-iam-policy-binding \\
  deploy-sa@PROJECT_ID.iam.gserviceaccount.com \\
  --role="roles/iam.workloadIdentityUser" \\
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUM/locations/global/workloadIdentityPools/github-pool/attribute.repository/my-org/my-repo"

# GitHub Actionsワークフローでの使用例（yaml内容）
# - uses: google-github-actions/auth@v2
#   with:
#     workload_identity_provider: 'projects/123/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
#     service_account: 'deploy-sa@PROJECT_ID.iam.gserviceaccount.com'`,
            explanation:
              "attribute-conditionで特定リポジトリのみ許可することが重要。条件なしでPoolを作成すると、そのIdPのすべてのワークロードからアクセス可能になる。",
          },
        ],
      },
      {
        id: "pcse-iam-s4",
        title: "BeyondCorp / Context-Aware Access",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "BeyondCorp Enterprise / Context-Aware Access",
            definition:
              "VPNに依存しない「ゼロトラスト」セキュリティモデル。ユーザーのデバイス状態・場所・アイデンティティなどのコンテキストに基づいてGCPリソースやGoogle Workspaceへのアクセスを動的に制御する。Identity-Aware Proxy（IAP）がゲートウェイとして機能する。",
            useCases: [
              "リモートワーク環境でVPNなしに社内アプリへ安全にアクセス",
              "BYODデバイスのセキュリティ状態（パッチ適用・ディスク暗号化等）に基づくアクセス制御",
              "特定の地域・IPアドレス・時間帯からのみGCP Consoleへのアクセスを許可",
              "Google Workspaceアプリへのアクセスをマネージドデバイスのみに制限",
            ],
            characteristics: [
              "アクセスレベル（Access Level）でデバイス・IPアドレス・地域の条件を定義",
              "Identity-Aware Proxy（IAP）でHTTPSアプリの認証・認可をプロキシ制御",
              "アクセスポリシー（Access Policy）はOrganizationまたはフォルダ単位で管理",
              "VPCサービスコントロールと組み合わせてAPIアクセスも制御可能",
              "アクセスコンテキストマネージャー（ACM）でアクセスレベルを定義・管理",
            ],
            examRelevance:
              "「VPNを廃止してゼロトラストに移行」「デバイスの状態に基づくアクセス制御」という設問でBeyondCorp/IAPが正解パターン。",
          },
          {
            type: "comparison_table",
            title: "従来型VPN vs BeyondCorp（ゼロトラスト）比較",
            headers: ["比較項目", "従来型VPN", "BeyondCorp Enterprise（IAP）"],
            rows: [
              {
                label: "アクセス判断基準",
                values: ["ネットワーク境界（VPN接続の有無）", "ユーザー・デバイス・コンテキストの総合評価"],
                highlight: true,
              },
              {
                label: "信頼モデル",
                values: [
                  "内部ネットワーク＝信頼（境界型セキュリティ）",
                  "デフォルト不信頼（すべてのアクセスを検証）",
                ],
                highlight: true,
              },
              {
                label: "デバイス管理",
                values: [
                  "VPNクライアントのインストールが必要",
                  "エンドポイント証明書・デバイスポリシーでデバイス状態を評価",
                ],
              },
              {
                label: "ユーザー体験",
                values: ["VPN接続後にアプリアクセス（二段階操作）", "ブラウザから直接アクセス（シームレス）"],
              },
              {
                label: "スケーラビリティ",
                values: [
                  "VPNゲートウェイのキャパシティ依存",
                  "Googleインフラでグローバルスケール（GCPと同等の可用性）",
                ],
              },
              {
                label: "横方向移動リスク",
                values: ["VPN接続後は内部ネットワーク全体へアクセス可能（高リスク）", "アプリ単位でアクセス制御（最小権限）"],
              },
            ],
            footnote:
              "BeyondCorpはGoogleが15年以上前から内部で実践しているモデルをプロダクト化したもの。PCSE試験ではゼロトラストとVPNの比較問題が頻出。",
          },
        ],
      },
    ],
  },
  {
    id: "pcse-encryption",
    certId: "pcse",
    domainName: "データ保護と暗号化",
    title: "データ保護と暗号化",
    description:
      "GCPの暗号化アーキテクチャ（DEK/KEK）からGMEK・CMEK・CSEKの使い分け、Cloud KMSの操作、Cloud DLPによるデータ検出・マスキングまでを体系的に学習します。",
    estimatedMinutes: 85,
    difficulty: "advanced",
    prerequisites: ["pcse-iam-design"],
    relatedLabIds: ["lab-cloud-kms", "lab-cloud-dlp"],
    sections: [
      {
        id: "pcse-enc-s1",
        title: "暗号化の基礎",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown: `## GCPの暗号化レイヤーとDEK/KEKの仕組み

### エンベロープ暗号化（Envelope Encryption）
GCPはほぼすべての保存データをデフォルトで暗号化する。この仕組みを「エンベロープ暗号化」と呼ぶ。

\`\`\`
データ暗号化の流れ：

1. データ暗号化キー（DEK: Data Encryption Key）でデータを暗号化
   → 各オブジェクト/チャンクに固有のDEK（AES-256）を生成

2. キー暗号化キー（KEK: Key Encryption Key）でDEKを暗号化（ラッピング）
   → 暗号化されたDEK（eDEK）をデータと一緒に保存

3. KEKはCloud KMSで管理（Google管理 or 顧客管理 or 顧客提供）

結果：
- データ本体 → DEKで暗号化
- DEK → KEKで暗号化（eDEK）
- KEK → Cloud KMSで保管

利点：
- KEKをローテーションしてもデータの再暗号化が不要（eDEKのみ再暗号化）
- 大量データを効率的に暗号化鍵管理できる
\`\`\`

### 暗号化のタイミング
- **保存時（At Rest）**：ディスク・オブジェクトストレージへの書き込み時
- **転送時（In Transit）**：TLS 1.2以上でGCP APIとの通信を常に暗号化
- **使用時（In Use）**：Confidential Computing（VMのメモリを暗号化）`,
          },
          {
            type: "concept_card",
            term: "暗号化レイヤーの種類",
            definition:
              "GCPでは保存データの暗号化において、鍵の管理者（誰がKEKを管理するか）によって3つの暗号化方式を選択できる。セキュリティ要件・コンプライアンス・運用負荷のバランスで選択する。",
            useCases: [
              "GMEK（Google管理暗号化鍵）：一般的なGCPサービス・追加設定不要・デフォルト",
              "CMEK（顧客管理暗号化鍵）：規制業種（金融・医療）・キーローテーション制御・アクセス監査が必要",
              "CSEK（顧客提供暗号化鍵）：GCPにキーを一切預けない・毎回APIリクエストでキーを提供",
            ],
            characteristics: [
              "GMEKはGoogleが鍵管理を担当。ユーザーの操作不要・追加コストなし",
              "CMEKはCloud KMS（またはCloud HSM）で顧客がマスターキーを管理。GCPはDEKのみ管理",
              "CSEKはGCPにキーを保存しない。APIリクエストのたびにBase64エンコードの鍵を提供",
              "CMEK対応サービス：GCS・BigQuery・GCE・Cloud SQL・Cloud Run・GKE等",
              "EKM（External Key Manager）でオンプレミスHSMの鍵を使ってCMEKを実現可能",
            ],
          },
        ],
      },
      {
        id: "pcse-enc-s2",
        title: "GMEK vs CMEK vs CSEK",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "暗号化方式の詳細比較",
            headers: ["項目", "GMEK（Google管理）", "CMEK（顧客管理）", "CSEK（顧客提供）"],
            rows: [
              {
                label: "鍵の管理者",
                values: ["Google", "顧客（Cloud KMSで管理）", "顧客（GCPには保存されない）"],
                highlight: true,
              },
              {
                label: "コスト",
                values: ["無料（デフォルト）", "Cloud KMS料金（$0.06/鍵/月 + API呼び出し）", "API呼び出しごとにキー提供のオーバーヘッド"],
              },
              {
                label: "監査・証跡",
                values: [
                  "Googleが管理（顧客は参照不可）",
                  "Cloud KMSのAudit Logsで鍵使用を完全追跡",
                  "顧客側で追跡（GCPは鍵を保存しないため）",
                ],
              },
              {
                label: "ユースケース",
                values: [
                  "一般的なワークロード・追加要件なし",
                  "規制業種・コンプライアンス・キー無効化による即時アクセス失効",
                  "最高レベルの鍵制御・GCPへの鍵の信頼ゼロ",
                ],
              },
              {
                label: "ローテーション",
                values: [
                  "Googleが自動管理（90日ごと）",
                  "顧客が設定（推奨：90日〜1年）・自動ローテーション可能",
                  "顧客が独自ローテーション（APIリクエストごとに最新鍵を提供）",
                ],
              },
            ],
            footnote:
              "CMEKの最大のメリット：鍵を無効化（Disable）するだけで、対象データへのGCPのアクセスも即座に失効する（鍵を持つデータのアンシュレッド）。",
          },
          {
            type: "decision_tree",
            title: "どの暗号化方式を選ぶか",
            rootId: "enc-q1",
            nodes: [
              {
                id: "enc-q1",
                question: "鍵のライフサイクルを自社で制御する必要があるか？",
                yesId: "enc-q2",
                noId: "enc-ans-gmek",
              },
              {
                id: "enc-q2",
                question: "GCPに鍵を一切保存したくないか？（最高レベルの鍵制御）",
                yesId: "enc-ans-csek",
                noId: "enc-q3",
              },
              {
                id: "enc-q3",
                question: "鍵の使用を監査ログで追跡する必要があるか？",
                yesId: "enc-ans-cmek",
                noId: "enc-q4",
              },
              {
                id: "enc-q4",
                question: "オンプレミスのHSMにある鍵を使いたいか？",
                yesId: "enc-ans-ekm",
                noId: "enc-ans-cmek",
              },
              {
                id: "enc-ans-gmek",
                answer: "GMEK（Google管理暗号化鍵）",
                explanation: "デフォルト。追加設定・コスト不要。一般的なワークロードに最適",
              },
              {
                id: "enc-ans-csek",
                answer: "CSEK（顧客提供暗号化鍵）",
                explanation: "GCPには鍵を保存しない。APIリクエストごとにBase64エンコードの鍵を提供する必要がある",
              },
              {
                id: "enc-ans-cmek",
                answer: "CMEK（顧客管理暗号化鍵）+ Cloud KMS",
                explanation: "Cloud KMSで鍵を管理。規制業種・コンプライアンス・監査要件に対応",
              },
              {
                id: "enc-ans-ekm",
                answer: "CMEK + External Key Manager（EKM）",
                explanation: "オンプレミスHSMの鍵をCloud KMS経由でCMEKとして使用。最高レベルの鍵主権を実現",
              },
            ],
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "CMEK・CSEK試験ポイント",
            content: `PCSE試験での暗号化問題解法：

1. **「鍵の無効化でデータへのアクセスを即時失効」** → CMEK（鍵をDisableするとGCPもアクセス不可）
2. **「GCPに鍵を渡したくない」** → CSEK（ただし毎回APIリクエストで鍵提供が必要で運用が複雑）
3. **「コンプライアンス要件で鍵の監査ログが必要」** → CMEK + Cloud KMSのAudit Logs
4. **「オンプレミスHSMの鍵を使いたい」** → CMEK + EKM（External Key Manager）
5. **「追加コストなし・デフォルト」** → GMEK
6. Cloud HSMはCloud KMSのFIPS 140-2 Level 3準拠のバックエンド（ハードウェアセキュリティモジュール）`,
          },
        ],
      },
      {
        id: "pcse-enc-s3",
        title: "Cloud KMSの操作",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "code_example",
            language: "bash",
            title: "Cloud KMSの基本操作",
            code: `# キーリングの作成（リージョンを指定）
gcloud kms keyrings create my-keyring \\
  --location=asia-northeast1

# 暗号化キー（CryptoKey）の作成
gcloud kms keys create my-key \\
  --location=asia-northeast1 \\
  --keyring=my-keyring \\
  --purpose=encryption \\
  --rotation-period=90d \\
  --next-rotation-time=$(date -d "+90 days" --iso-8601)

# データの暗号化
gcloud kms encrypt \\
  --location=asia-northeast1 \\
  --keyring=my-keyring \\
  --key=my-key \\
  --plaintext-file=secret.txt \\
  --ciphertext-file=secret.enc

# データの復号
gcloud kms decrypt \\
  --location=asia-northeast1 \\
  --keyring=my-keyring \\
  --key=my-key \\
  --ciphertext-file=secret.enc \\
  --plaintext-file=decrypted.txt

# Cloud StorageバケットにCMEKを設定
gcloud storage buckets create gs://my-cmek-bucket \\
  --location=asia-northeast1 \\
  --default-encryption-key=projects/PROJECT_ID/locations/asia-northeast1/keyRings/my-keyring/cryptoKeys/my-key

# キーのバージョン無効化（データへのアクセスを失効）
gcloud kms keys versions disable 1 \\
  --location=asia-northeast1 \\
  --keyring=my-keyring \\
  --key=my-key`,
            explanation:
              "キーの無効化はデータを削除するわけではなく、復号に使用するKEKを無効にすることでデータへのアクセスを論理的に遮断する。キーを再有効化すれば復元可能。",
          },
          {
            type: "concept_card",
            term: "Cloud KMS キーの状態（Key Version States）",
            definition:
              "Cloud KMSの暗号化キーバージョンは複数の状態を持ち、ライフサイクルに応じて遷移する。状態によって暗号化・復号操作の可否が変わる。",
            useCases: [
              "ENABLED：通常の暗号化・復号が可能（アクティブ状態）",
              "DISABLED：新規暗号化不可・復号も不可（一時停止。再有効化可能）",
              "SCHEDULED_FOR_DESTRUCTION：削除待ち（デフォルト24時間の猶予期間）",
              "DESTROYED：完全削除（データは永続的に復号不可）",
            ],
            characteristics: [
              "ENABLED → DISABLED：即座に遷移可能（セキュリティインシデント対応に使用）",
              "DISABLED → ENABLED：再有効化可能（データは保持されている）",
              "DISABLED → SCHEDULED_FOR_DESTRUCTION：削除スケジュール登録",
              "SCHEDULED_FOR_DESTRUCTION → DISABLED：削除をキャンセル可能（猶予期間中）",
              "DESTROYED：不可逆。DESTROYEDになったキーで暗号化されたデータは永久に復号不可",
            ],
            examRelevance:
              "「インシデント発生時に即座にデータアクセスを遮断」→ キーをDISABLEDに変更。「データを完全に破棄・コンプライアンス対応」→ DESTROYEDに変更。",
          },
        ],
      },
      {
        id: "pcse-enc-s4",
        title: "Cloud DLP",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud Data Loss Prevention (Cloud DLP)",
            definition:
              "テキスト・画像・構造化データから機密情報（PII・クレジットカード番号・医療情報等）を自動検出・分類・変換するフルマネージドサービス。BigQuery・Cloud Storage・データストリームをスキャンして機密データを特定・保護する。",
            useCases: [
              "BigQueryのデータセットをスキャンして個人情報（氏名・住所・マイナンバー）を検出",
              "Cloud StorageのドキュメントからクレジットカードPAN番号を自動マスキング",
              "アプリケーションAPIに組み込んでユーザー入力の機密情報をリアルタイムに検出・マスク",
              "データパイプラインでDataflowと連携して大量データを処理前に匿名化",
            ],
            characteristics: [
              "150以上の組み込みinfoTypeディテクター（CREDIT_CARD_NUMBER・US_SSN・JP_MY_NUMBER等）",
              "カスタムinfoTypeで独自の機密情報パターン（社内コード等）を定義可能",
              "変換アクション：マスキング・トークン化・置換・暗号化ハッシュ・日付シフト等",
              "De-identification（匿名化）とRe-identification（再識別）のリスク分析も可能",
              "テンプレートでスキャン設定を再利用・組織全体で標準化",
            ],
            examRelevance:
              "「PIIデータの検出・マスキング」「GDPRコンプライアンス」「テスト環境での本番データ使用回避」という設問でCloud DLPが正解。",
          },
          {
            type: "text",
            markdown: `## Cloud DLP infoTypeディテクターの種類

### カテゴリ別の主要infoType

| カテゴリ | infoType例 | 説明 |
|---|---|---|
| 金融情報 | CREDIT_CARD_NUMBER | Luhnアルゴリズムで検証 |
| 金融情報 | IBAN_CODE | 国際銀行口座番号 |
| 個人識別情報 | PERSON_NAME | 氏名（日本語対応） |
| 個人識別情報 | EMAIL_ADDRESS | メールアドレス |
| 個人識別情報 | PHONE_NUMBER | 電話番号（国別） |
| 日本固有 | JP_MY_NUMBER | マイナンバー（個人・法人） |
| 日本固有 | JP_BANK_ACCOUNT | 日本の銀行口座番号 |
| 医療情報 | MEDICAL_RECORD_NUMBER | 医療記録番号 |
| 認証情報 | AUTH_TOKEN | APIキー・OAuth Token |

### 変換（Transformation）の種類
- **マスキング（Masking）**：検出値をアスタリスク等で置換（例：4532-XXXX-XXXX-1234）
- **トークン化（Format Preserving Encryption）**：元の形式を保ったまま暗号化
- **ハッシュ化（Hashing）**：SHA-256等でハッシュ化（一方向性・復元不可）
- **日付シフト（Date Shift）**：日付を一定範囲でランダムシフト（統計的分析は可能）
- **置換（Replacement）**：任意の文字列に置換`,
          },
          {
            type: "code_example",
            language: "python",
            title: "Cloud DLP APIでPIIを検出・マスキング",
            code: `import google.cloud.dlp

def inspect_and_deidentify(project_id: str, text: str) -> str:
    """テキストからPIIを検出してマスキングする"""
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    parent = f"projects/{project_id}/locations/global"

    # スキャン対象のinfoType設定
    inspect_config = {
        "info_types": [
            {"name": "CREDIT_CARD_NUMBER"},
            {"name": "EMAIL_ADDRESS"},
            {"name": "PERSON_NAME"},
            {"name": "JP_MY_NUMBER"},
        ],
        "min_likelihood": google.cloud.dlp_v2.Likelihood.LIKELY,
    }

    # マスキング変換設定
    deidentify_config = {
        "info_type_transformations": {
            "transformations": [
                {
                    "primitive_transformation": {
                        "character_mask_config": {
                            "masking_character": "*",
                            "number_to_mask": 0,  # 全文字マスク
                        }
                    }
                }
            ]
        }
    }

    item = {"value": text}

    # De-identification（匿名化）の実行
    response = dlp.deidentify_content(
        request={
            "parent": parent,
            "deidentify_config": deidentify_config,
            "inspect_config": inspect_config,
            "item": item,
        }
    )

    return response.item.value

# 使用例
original = "山田太郎（yamada@example.com）のカード番号は4532015112830366です"
masked = inspect_and_deidentify("my-project", original)
print(masked)
# 出力: ****（***@***.***）のカード番号は****************です`,
            explanation:
              "本番データをテスト環境にコピーする際に必ずDLPで匿名化することがGDPR・個人情報保護法対応のベストプラクティス。BigQuery DLPスキャンは自動化してスケジュール実行することを推奨。",
          },
        ],
      },
    ],
  },
  {
    id: "pcse-network-security",
    certId: "pcse",
    domainName: "ネットワークセキュリティ",
    title: "ネットワークセキュリティ",
    description:
      "VPC Service Controls、Cloud Armor、Private Google Access、Security Command Centerなど、GCPのネットワークセキュリティを多層防御で実装するための知識を体系的に習得します。",
    estimatedMinutes: 95,
    difficulty: "advanced",
    prerequisites: ["pcse-iam-design"],
    relatedLabIds: ["lab-vpc-service-controls", "lab-cloud-armor", "lab-scc"],
    sections: [
      {
        id: "pcse-netsec-s1",
        title: "VPC Service Controls",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "VPC Service Controls（VPC SC）",
            definition:
              "GCPのマネージドサービス（Cloud Storage・BigQuery・Cloud KMS等）へのアクセスをVPCネットワーク境界で制限する機能。データの外部持ち出し（data exfiltration）を防止し、権限があっても境界外からのアクセスをブロックする。IAMと組み合わせることで多層防御を実現。",
            useCases: [
              "BigQueryのデータセットへのアクセスを特定VPCからのみに制限（外部持ち出し防止）",
              "Cloud Storageバケットへのアクセスを承認済みVPCとオンプレミスIPのみに制限",
              "マルチテナント環境でテナント間のデータアクセスを分離",
              "本番環境のAPIアクセスを管理VPCからのみに制限（開発者の直接アクセスをブロック）",
            ],
            characteristics: [
              "サービス境界（Service Perimeter）：保護対象のプロジェクトとAPIの集合",
              "アクセスポリシー（Access Policy）：境界を含む組織全体のポリシーコンテナ",
              "アクセスレベル（Access Level）：境界へのアクセスを許可するコンテキスト条件（IP・デバイス等）",
              "VPC内のリソース→境界内のAPIは自動的に許可（制限なし）",
              "Dry Runモードで本番適用前に影響範囲を確認可能",
            ],
            examRelevance:
              "「データの外部持ち出しを防止」「境界外からのAPIアクセスをブロック」という設問でVPC Service Controlsが正解。IAMとの違いは「権限があっても場所によってブロック」できること。",
          },
          {
            type: "text",
            markdown: `## VPC Service Controlsの設計パターン

### 基本的な境界設計
\`\`\`
組織
└── アクセスポリシー（Access Policy）
    ├── サービス境界（Perimeter A: 本番）
    │   ├── プロジェクト: prod-data-project
    │   ├── 保護API: bigquery.googleapis.com, storage.googleapis.com
    │   └── アクセスレベル: 社内VPC IPアドレス範囲
    └── サービス境界（Perimeter B: 開発）
        ├── プロジェクト: dev-project
        └── 保護API: bigquery.googleapis.com
\`\`\`

### ブリッジ（Perimeter Bridge）
2つの境界間でデータを共有する必要がある場合、ブリッジ境界を使用する。
- ブリッジは一方向ではなく双方向のアクセスを許可
- 別の組織間でのデータ共有に使用

### Ingress/Egress Policyの活用
より細かい制御のためにIngress/Egress Ruleを使用：
- **Ingress Rule**：境界外からのアクセスを特定の条件で許可
- **Egress Rule**：境界内から外部への特定APIアクセスを許可

\`\`\`json
// Ingress Rule例：特定SAからのBigQueryアクセスを許可
{
  "ingressFrom": {
    "sources": [{"accessLevel": "accessPolicies/123/accessLevels/trusted-network"}],
    "identities": ["serviceAccount:etl-sa@project.iam.gserviceaccount.com"]
  },
  "ingressTo": {
    "resources": ["projects/456"],
    "operations": [{"serviceName": "bigquery.googleapis.com"}]
  }
}
\`\`\``,
          },
        ],
      },
      {
        id: "pcse-netsec-s2",
        title: "Cloud Armor",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "Cloud Armor vs WAF vs レート制限の機能比較",
            headers: ["機能", "Cloud Armor（マネージドプロテクション）", "一般的なWAF", "Cloud Armorレート制限"],
            rows: [
              {
                label: "DDoS保護",
                values: [
                  "Googleインフラ規模のDDoS吸収（Googleの全帯域が防御壁）",
                  "ベンダーのキャパシティ依存",
                  "レート超過をブロック（DDoS対策にもなる）",
                ],
                highlight: true,
              },
              {
                label: "OWASP Top 10対策",
                values: [
                  "マネージドルールグループで自動的に適用（Google定義）",
                  "ルールセット定義が必要",
                  "非対応",
                ],
              },
              {
                label: "地理的ブロック",
                values: [
                  "国・地域単位でブロック/許可（expr: origin.region_code）",
                  "ベンダーにより異なる",
                  "非対応",
                ],
              },
              {
                label: "カスタムルール",
                values: [
                  "CEL（Common Expression Language）で独自ルール定義",
                  "ベンダー固有言語",
                  "スロットリングポリシーの定義",
                ],
              },
              {
                label: "適用対象",
                values: [
                  "グローバルHTTP(S) LBのバックエンドサービス",
                  "アプリケーション前段",
                  "グローバルHTTP(S) LBのバックエンドサービス",
                ],
              },
              {
                label: "料金",
                values: [
                  "セキュリティポリシー + ルール評価数 + マネージドプロテクション料金",
                  "ベンダー別",
                  "Cloud Armorポリシーに含まれる",
                ],
              },
            ],
            footnote:
              "Cloud Armorはグローバルロードバランサーに統合されるため、トラフィックがGCPエッジに到達した時点でフィルタリングされる。バックエンドまで攻撃トラフィックが届かない。",
          },
          {
            type: "code_example",
            language: "bash",
            title: "Cloud Armorセキュリティポリシーの設定",
            code: `# セキュリティポリシーの作成
gcloud compute security-policies create web-security-policy \\
  --description="Webアプリケーション保護ポリシー"

# OWASP Top 10ルールの適用（マネージドルールグループ）
gcloud compute security-policies rules create 1000 \\
  --security-policy=web-security-policy \\
  --expression="evaluatePreconfiguredExpr('xss-v33-stable')" \\
  --action=deny-403 \\
  --description="XSS攻撃をブロック"

gcloud compute security-policies rules create 1001 \\
  --security-policy=web-security-policy \\
  --expression="evaluatePreconfiguredExpr('sqli-v33-stable')" \\
  --action=deny-403 \\
  --description="SQLインジェクションをブロック"

# 特定国からのアクセスをブロック（例：RU・KPをブロック）
gcloud compute security-policies rules create 2000 \\
  --security-policy=web-security-policy \\
  --expression="origin.region_code == 'RU' || origin.region_code == 'KP'" \\
  --action=deny-403 \\
  --description="特定国からのアクセスをブロック"

# レート制限（IPアドレスあたり毎分100リクエストに制限）
gcloud compute security-policies rules create 3000 \\
  --security-policy=web-security-policy \\
  --expression="true" \\
  --action=throttle \\
  --rate-limit-threshold-count=100 \\
  --rate-limit-threshold-interval-sec=60 \\
  --conform-action=allow \\
  --exceed-action=deny-429 \\
  --enforce-on-key=IP

# セキュリティポリシーをロードバランサーのバックエンドサービスに適用
gcloud compute backend-services update my-backend-service \\
  --security-policy=web-security-policy \\
  --global`,
            explanation:
              "ルール番号（priority）は小さいほど優先される。デフォルトルール（priority: 2147483647）はallow。ルールはtop-downで評価され最初にマッチしたルールが適用される。",
          },
        ],
      },
      {
        id: "pcse-netsec-s3",
        title: "Private Google Access vs Private Service Connect",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "comparison_table",
            title: "GCPプライベート接続オプション比較",
            headers: ["方式", "用途", "接続先", "設定複雑度", "トラフィックのルーティング"],
            rows: [
              {
                label: "Private Google Access",
                values: [
                  "VPC内のVMがGCP APIに外部IPなしでアクセス",
                  "Google APIエンドポイント（*.googleapis.com）",
                  "低（サブネット設定のみ）",
                  "VMからGoogleのグローバルIP帯（199.36.153.4/30等）経由でアクセス",
                ],
              },
              {
                label: "Private Google Access for On-premises",
                values: [
                  "オンプレミスからCloud Interconnect/VPN経由でGCP APIにアクセス",
                  "Google APIエンドポイント",
                  "中（restricted.googleapis.com DNS設定が必要）",
                  "Interconnect/VPN経由でGoogleのIP帯にルーティング",
                ],
              },
              {
                label: "Private Service Connect（PSC）",
                values: [
                  "VPC内のプライベートIPエンドポイント経由でGCPマネージドサービスやサードパーティAPIにアクセス",
                  "GCPマネージドサービス・Cloud Run・他VPCのサービス",
                  "高（エンドポイント作成・DNS設定が必要）",
                  "VPC内のプライベートIPへのトラフィックとして処理（インターネット迂回）",
                ],
                highlight: true,
              },
              {
                label: "VPC Peering",
                values: [
                  "2つのVPC間のプライベート通信（非推奨・PSCに移行中）",
                  "別VPCのリソース",
                  "低〜中",
                  "ルーターレベルで2 VPC間のルートを交換（推移的ルーティング不可）",
                ],
              },
            ],
            footnote:
              "推奨：GCPマネージドサービスへのプライベートアクセスはPrivate Service Connect。VPC間通信はVPC PeeringよりもPSC Interfaceが推奨（推移的ルーティング等の制限を回避）。",
          },
          {
            type: "decision_tree",
            title: "どのプライベート接続方式を選ぶか",
            rootId: "psc-q1",
            nodes: [
              {
                id: "psc-q1",
                question: "接続元はGCP VPC内のリソースか？",
                yesId: "psc-q2",
                noId: "psc-q5",
              },
              {
                id: "psc-q2",
                question: "Google API（BigQuery・GCS等）への接続か？",
                yesId: "psc-q3",
                noId: "psc-q4",
              },
              {
                id: "psc-q3",
                question: "特定のプライベートIPで接続したいか？（DNS制御が必要）",
                yesId: "psc-ans-psc-api",
                noId: "psc-ans-pga",
              },
              {
                id: "psc-q4",
                question: "他のVPCやサードパーティサービスへの接続か？",
                yesId: "psc-ans-psc-service",
                noId: "psc-ans-nat",
              },
              {
                id: "psc-q5",
                question: "オンプレミスからGCP APIへの接続か？",
                yesId: "psc-ans-pga-onprem",
                noId: "psc-ans-interconnect",
              },
              {
                id: "psc-ans-pga",
                answer: "Private Google Access",
                explanation: "サブネットでenable-private-ip-google-accessを有効化するだけ。シンプルで低コスト",
              },
              {
                id: "psc-ans-psc-api",
                answer: "Private Service Connect for APIs",
                explanation: "特定のプライベートIPでGCP APIにアクセス。DNSをカスタマイズしてVPC内での名前解決を制御",
              },
              {
                id: "psc-ans-psc-service",
                answer: "Private Service Connect",
                explanation: "他VPCのCloud Run・GKE・内部LBなどをプライベートIPで公開・消費",
              },
              {
                id: "psc-ans-nat",
                answer: "Cloud NAT",
                explanation: "外部への接続が必要な場合はCloud NATで外部IPなしにインターネットにアクセス",
              },
              {
                id: "psc-ans-pga-onprem",
                answer: "Private Google Access for On-premises",
                explanation: "restricted.googleapis.comをDNSで設定し、Cloud Interconnect/VPN経由でアクセス",
              },
              {
                id: "psc-ans-interconnect",
                answer: "Cloud Interconnect または Cloud VPN",
                explanation: "オンプレミスとVPCの接続にはDedicated InterconnectまたはCloud VPNを使用",
              },
            ],
          },
        ],
      },
      {
        id: "pcse-netsec-s4",
        title: "Security Command Center",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "concept_card",
            term: "Security Command Center（SCC）",
            definition:
              "GCPの統合セキュリティ・リスク管理プラットフォーム。脆弱性の検出（Findings）・脅威インテリジェンス・コンプライアンス評価・セキュリティポスチャー管理を一元的に提供する。Standard（無料）とPremium（有料）の2エディションがある。",
            useCases: [
              "パブリックに公開されたCloud Storageバケットや不要なファイアウォールルールの自動検出",
              "Container Threat Detection・Event Threat Detectionによるリアルタイム脅威検出",
              "CIS Benchmark・PCI DSS・NIST 800-53に対するコンプライアンス評価",
              "VM上のOSレベルの脆弱性スキャン（Vulnerability Assessment）",
              "組織全体のセキュリティポスチャーのダッシュボード表示",
            ],
            characteristics: [
              "Finding種別：脆弱性（Vulnerability）・設定ミス（Misconfiguration）・脅威（Threat）・観察（Observation）",
              "Security Health Analytics：Googleが定義した100以上のセキュリティベストプラクティスを自動チェック",
              "Web Security Scanner：App Engine・Cloud Run・GCEのWebアプリに対してXSS・SQLi等をスキャン",
              "Container Threat Detection：GKEワークロード上の疑わしいプロセス・ネットワーク通信を検出",
              "Eventthread Detection（ETD）：Cloud Loggingのログを分析して脅威（マルウェア通信・クレデンシャル漏洩等）を検出",
            ],
            examRelevance:
              "「セキュリティの問題を組織全体で一元管理・検出したい」という設問でSCCが正解。特定のFindingタイプ（パブリックバケット検出等）とその解消方法が問われる。",
          },
          {
            type: "text",
            markdown: `## SCC Findingsのトリアージ手順

### Findingの重要度（Severity）
| 重要度 | 説明 | 対応優先度 |
|---|---|---|
| CRITICAL | 即座の対応が必要（活発な攻撃・データ漏洩） | 即時 |
| HIGH | 近い将来リスクになる可能性（パブリックSQL DB等） | 24時間以内 |
| MEDIUM | セキュリティベストプラクティスからの逸脱 | 1週間以内 |
| LOW | 軽微なリスク・情報収集 | 計画的に対応 |

### Finding解消の典型的なワークフロー
1. **Finding確認**：SCCコンソールまたはgcloud scc findings listで一覧を取得
2. **重要度・ソースの評価**：Security Health Analyticsか外部ソースかを確認
3. **根本原因の特定**：リソース名・プロジェクト・設定内容を確認
4. **修正実施**：IaCまたはgcloudコマンドで設定を修正
5. **Finding更新**：手動でSTATE=RESOLVEDに更新（または自動検証を待つ）

### Pub/SubへのFindingエクスポート
SCCのFindingsをPub/SubにエクスポートしてCloud FunctionsやCloud Runで自動修復を実装できる：

\`\`\`
Finding発生 → SCC → Pub/Sub通知 → Cloud Functions →
自動修復（例：パブリックバケットのACLを修正）
\`\`\``,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "SCC試験頻出ポイント",
            content: `PCSE試験でのSCC問題解法：

1. **「組織全体のセキュリティ問題を一元管理」** → Security Command Center（組織レベルで有効化）
2. **「パブリックに公開されたバケットを自動検出」** → SCC Security Health Analytics（PUBLIC_BUCKET_ACL Finding）
3. **「GKEのランタイム脅威検出」** → Container Threat Detection（SCC Premium機能）
4. **「ログからの脅威検出（不審なAPIコール・クレデンシャル漏洩）」** → Event Threat Detection
5. **「自動修復パイプライン」** → SCC → Pub/Sub → Cloud Functions の組み合わせ
6. StandardエディションはFindingsの**表示のみ**。Premiumで**脅威検出・コンプライアンス評価**が可能`,
          },
        ],
      },
    ],
  },
]
