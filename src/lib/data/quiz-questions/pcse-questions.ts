import type { QuizQuestion } from "@/lib/types/quiz"

export const PCSE_EXTRA_QUESTIONS: QuizQuestion[] = [
  // ─── クラウド環境のセキュリティ設計と計画 (30%) ───
  {
    id: "pcse-006",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "easy",
    question:
      "Security Command Centerの主な機能はどれですか？",
    options: [
      "仮想マシンのパフォーマンスモニタリング",
      "Google Cloud環境全体のセキュリティ態勢の可視化と脅威検出",
      "ネットワーク帯域幅の最適化",
      "Cloud SQLのバックアップ管理",
    ],
    correctIndex: 1,
    explanation:
      "Security Command Center（SCC）はGoogle Cloud環境のセキュリティとリスク管理のプラットフォームです。脆弱性の検出、脅威の検知、コンプライアンス監視、アセットインベントリの管理など、セキュリティ態勢の一元的な可視化と管理を提供します。",
    tags: ["security-command-center", "threat-detection", "visibility"],
  },
  {
    id: "pcse-007",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "easy",
    question:
      "組織ポリシー（Organization Policy）で「ドメイン制限の共有」制約を設定する目的はどれですか？",
    options: [
      "特定のリージョンでのみリソースを作成できるようにする",
      "IAMポリシーで許可されるメンバードメインを制限し、外部ユーザーへの権限付与を防ぐ",
      "Cloud Storageバケットの公開アクセスを制限する",
      "VPCネットワークのファイアウォールルールを一元管理する",
    ],
    correctIndex: 1,
    explanation:
      "iam.allowedPolicyMemberDomains制約を使用すると、IAMポリシーで許可されるメンバーを特定のドメイン（例: example.com）に制限できます。これにより、組織外のユーザーにリソースへのアクセス権が誤って付与されることを防止します。",
    tags: ["organization-policy", "domain-restriction", "iam"],
  },
  {
    id: "pcse-008",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "medium",
    question:
      "BeyondCorpの基本原則として正しいのはどれですか？",
    options: [
      "社内ネットワークからのアクセスは常に信頼する",
      "VPNを使用してすべてのリモートアクセスを保護する",
      "アクセスをネットワークの場所ではなくデバイスとユーザーのコンテキストに基づいて制御する",
      "すべてのアプリケーションをオンプレミスでホスティングする",
    ],
    correctIndex: 2,
    explanation:
      "BeyondCorpはゼロトラストセキュリティモデルに基づいており、アクセスの判断をネットワークの場所（社内/社外）ではなく、ユーザーのアイデンティティ、デバイスの状態、コンテキスト情報に基づいて行います。VPNを必要とせずにアプリケーションへの安全なアクセスを提供します。",
    tags: ["beyondcorp", "zero-trust", "identity-aware-proxy"],
  },
  {
    id: "pcse-009",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "medium",
    question:
      "Cloud HSM（Hardware Security Module）の主な用途はどれですか？",
    options: [
      "データベースのバックアップを暗号化する",
      "FIPS 140-2 Level 3準拠のハードウェアで暗号鍵を生成・管理・保護する",
      "ファイアウォールルールを自動的に適用する",
      "IAMポリシーの監査ログを保存する",
    ],
    correctIndex: 1,
    explanation:
      "Cloud HSMは、Cloud KMS上でFIPS 140-2 Level 3認定のハードウェアセキュリティモジュールを使用して暗号鍵のホスティングを可能にします。規制要件で暗号鍵をハードウェアで保護することが求められる場合に使用します。",
    tags: ["cloud-hsm", "fips-140-2", "key-management", "compliance"],
  },
  {
    id: "pcse-010",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "hard",
    question:
      "Security Command Center Premiumで提供されるEvent Threat Detection（ETD）が検出できる脅威はどれですか？",
    options: [
      "VPCネットワークのレイテンシ増加",
      "暗号通貨マイニング、マルウェア、IAMの異常な権限昇格",
      "Cloud Storageの使用量超過",
      "Compute Engineインスタンスの高CPU使用率",
    ],
    correctIndex: 1,
    explanation:
      "Event Threat Detection（ETD）は、Cloud LoggingとGoogle独自の脅威インテリジェンスを組み合わせて、暗号通貨マイニング、マルウェアのC&C通信、IAMの異常な権限変更、ブルートフォース攻撃などの脅威をリアルタイムで検出します。",
    tags: [
      "event-threat-detection",
      "scc-premium",
      "threat-intelligence",
    ],
  },
  {
    id: "pcse-011",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "hard",
    question:
      "Binary Authorizationを使用してGKEクラスタのセキュリティを強化する方法として正しいのはどれですか？",
    options: [
      "コンテナイメージのサイズを制限する",
      "信頼された認証局が署名したコンテナイメージのみデプロイを許可するポリシーを適用する",
      "GKEノードのOSパッチを自動適用する",
      "Podのネットワークポリシーを自動生成する",
    ],
    correctIndex: 1,
    explanation:
      "Binary Authorizationは、GKEにデプロイされるコンテナイメージに対してデプロイ時の検証を行います。信頼された認証者（Attestor）が署名したイメージのみデプロイを許可するポリシーを定義でき、承認されていないイメージのデプロイを防止します。CI/CDパイプラインと統合して使用します。",
    tags: [
      "binary-authorization",
      "gke",
      "container-security",
      "attestation",
    ],
  },
  // ─── クラウド環境の管理と保護 (30%) ───
  {
    id: "pcse-012",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "easy",
    question:
      "Cloud DLP（Data Loss Prevention）の主な機能はどれですか？",
    options: [
      "データベースのパフォーマンスを最適化する",
      "機密データ（個人情報、クレジットカード番号など）の検出、分類、マスキング",
      "ファイルのウイルススキャン",
      "ネットワークトラフィックの暗号化",
    ],
    correctIndex: 1,
    explanation:
      "Cloud DLP（Sensitive Data Protection）は、テキスト、画像、構造化データ内の機密情報（PII、PHI、金融データなど）を自動的に検出・分類し、マスキング、トークン化、暗号化などの変換処理を適用できます。",
    tags: ["cloud-dlp", "sensitive-data", "data-classification"],
  },
  {
    id: "pcse-013",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "easy",
    question:
      "Google CloudでCMEK（Customer-Managed Encryption Keys）を使用する利点はどれですか？",
    options: [
      "暗号化が不要になる",
      "顧客が暗号鍵のライフサイクル（作成、ローテーション、無効化、削除）を管理できる",
      "暗号化のパフォーマンスが向上する",
      "Googleが自動的に暗号鍵を生成・管理する",
    ],
    correctIndex: 1,
    explanation:
      "CMEKを使用すると、Cloud KMSで顧客自身が暗号鍵を管理できます。鍵の作成、ローテーションスケジュール、無効化、削除を制御でき、鍵を無効化すると対応するデータへのアクセスも不可能になります。規制要件への対応に重要です。",
    tags: ["cmek", "cloud-kms", "encryption", "key-management"],
  },
  {
    id: "pcse-014",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "medium",
    question:
      "VPC Service Controlsのサービス境界（Service Perimeter）の目的はどれですか？",
    options: [
      "VPCネットワーク間のファイアウォールルールを管理する",
      "Google Cloudサービスのリソースへのアクセスを境界内に制限し、データ流出を防止する",
      "Cloud CDNのキャッシュポリシーを設定する",
      "IAMロールを自動的に割り当てる",
    ],
    correctIndex: 1,
    explanation:
      "VPC Service Controlsのサービス境界は、BigQuery、Cloud Storage、Spannerなどのサービスのリソースへのアクセスを境界内に制限します。境界外からのAPIアクセスや境界外へのデータコピーを防止し、データ流出リスクを大幅に軽減します。",
    tags: [
      "vpc-service-controls",
      "service-perimeter",
      "data-exfiltration",
    ],
  },
  {
    id: "pcse-015",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "medium",
    question:
      "Cloud KMSの鍵ローテーションについて正しい説明はどれですか？",
    options: [
      "鍵をローテーションすると、以前のバージョンで暗号化されたデータは復号できなくなる",
      "自動ローテーションを設定でき、新しい鍵バージョンが作成されるが以前のバージョンも復号に使用可能",
      "鍵のローテーションは手動でしか実行できない",
      "ローテーション後は全データを新しい鍵で再暗号化する必要がある",
    ],
    correctIndex: 1,
    explanation:
      "Cloud KMSでは鍵の自動ローテーション期間を設定できます。ローテーション時に新しいプライマリ鍵バージョンが作成されますが、以前のバージョンも「有効」状態であれば復号に使用可能です。新規暗号化はプライマリ鍵バージョンで行われます。",
    tags: ["cloud-kms", "key-rotation", "encryption", "versioning"],
  },
  {
    id: "pcse-016",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "hard",
    question:
      "VPC Service ControlsのDry Runモードの用途として正しいのはどれですか？",
    options: [
      "サービス境界を自動的に修復する",
      "本番環境に影響を与えずに境界ポリシーの影響をログで確認し、違反を検出する",
      "境界内のリソースを自動スキャンする",
      "IAMポリシーのシミュレーションを実行する",
    ],
    correctIndex: 1,
    explanation:
      "Dry Runモードでは、サービス境界を実際に適用せずにポリシーの影響をログで確認できます。新しい境界の設定やポリシー変更時に、本番ワークロードを中断させるリスクなく、どのアクセスがブロックされるかを事前に検証できます。",
    tags: [
      "vpc-service-controls",
      "dry-run",
      "policy-validation",
      "logging",
    ],
  },
  {
    id: "pcse-017",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "hard",
    question:
      "Cloud DLPのde-identification（非識別化）手法のうち、元のデータに戻すことが可能な手法はどれですか？",
    options: [
      "マスキング（Masking）",
      "削除（Redaction）",
      "暗号ベースのトークン化（Crypto-based tokenization）",
      "バケット化（Bucketing）",
    ],
    correctIndex: 2,
    explanation:
      "暗号ベースのトークン化（CryptoReplaceFfxFpeConfig、CryptoDeterministicConfig）は、暗号鍵を使用してデータを変換するため、同じ鍵を使用して元のデータに復元（re-identification）できます。マスキングや削除は不可逆な変換です。",
    tags: [
      "cloud-dlp",
      "tokenization",
      "de-identification",
      "reversible",
    ],
  },
  // ─── アイデンティティとアクセス管理の設定 (20%) ───
  {
    id: "pcse-018",
    certId: "pcse",
    domain: "アイデンティティとアクセス管理の設定",
    difficulty: "easy",
    question:
      "IAMの条件付きロールバインディング（Conditional IAM）で使用できる条件属性はどれですか？",
    options: [
      "ユーザーの年齢",
      "リクエストの時間、リソースの名前やタイプ、IPアドレス",
      "ユーザーのパスワード強度",
      "リソースの作成日時のみ",
    ],
    correctIndex: 1,
    explanation:
      "条件付きIAMバインディングでは、CEL（Common Expression Language）を使用して、リクエストのタイムスタンプ、リソースの名前・タイプ・サービス、送信元IPアドレス、アクセスレベルなどの条件属性に基づいてアクセスを制御できます。",
    tags: ["conditional-iam", "cel", "access-control", "conditions"],
  },
  {
    id: "pcse-019",
    certId: "pcse",
    domain: "アイデンティティとアクセス管理の設定",
    difficulty: "medium",
    question:
      "Workload Identity Federationの主な利点はどれですか？",
    options: [
      "サービスアカウントキーの発行が簡単になる",
      "外部のIDプロバイダー（AWS、Azure AD、GitHubなど）の認証情報を使用して、サービスアカウントキーなしでGoogle Cloudリソースにアクセスできる",
      "Cloud IAMのロール数が削減される",
      "多要素認証が自動的に有効になる",
    ],
    correctIndex: 1,
    explanation:
      "Workload Identity Federationにより、外部IDプロバイダー（AWS IAM、Azure AD、OIDC、SAMLなど）のトークンをGoogle Cloudのアクセストークンと交換できます。長期間有効なサービスアカウントキーの発行・管理が不要になり、セキュリティリスクを軽減します。",
    tags: [
      "workload-identity-federation",
      "keyless",
      "external-idp",
      "security",
    ],
  },
  {
    id: "pcse-020",
    certId: "pcse",
    domain: "アイデンティティとアクセス管理の設定",
    difficulty: "medium",
    question:
      "GKEにおけるWorkload Identityの役割として正しいのはどれですか？",
    options: [
      "GKEクラスタのノードOSを自動更新する",
      "KubernetesサービスアカウントとGoogle Cloudサービスアカウントを関連付け、PodからGoogle Cloudリソースに安全にアクセスする",
      "GKEクラスタのネットワークポリシーを自動生成する",
      "コンテナイメージのスキャンを実行する",
    ],
    correctIndex: 1,
    explanation:
      "Workload Identityは、KubernetesサービスアカウントとGoogle Cloud IAMサービスアカウントを関連付けます。これにより、PodはサービスアカウントキーをSecretとしてマウントすることなく、GCPのIAM認証を使用してGoogle Cloudリソースに安全にアクセスできます。",
    tags: ["workload-identity", "gke", "pod-security", "iam"],
  },
  {
    id: "pcse-021",
    certId: "pcse",
    domain: "アイデンティティとアクセス管理の設定",
    difficulty: "hard",
    question:
      "サービスアカウントのキー管理に関するセキュリティベストプラクティスとして正しいのはどれですか？",
    options: [
      "各開発者に専用のサービスアカウントキーを発行する",
      "サービスアカウントキーの使用を最小限にし、Workload Identity FederationやAttached Service Accountを優先的に使用する",
      "サービスアカウントキーをソースコードリポジトリで管理する",
      "1つのサービスアカウントキーを全環境で共有する",
    ],
    correctIndex: 1,
    explanation:
      "サービスアカウントキーは漏洩リスクが高いため、使用を最小限にすることがベストプラクティスです。GCE/GKEではAttached Service Account、CI/CDではWorkload Identity Federation、Cloud FunctionsではデフォルトのサービスアカウントIDを使用し、キーレス認証を優先します。",
    tags: [
      "service-account",
      "key-management",
      "best-practices",
      "keyless",
    ],
  },
  {
    id: "pcse-022",
    certId: "pcse",
    domain: "アイデンティティとアクセス管理の設定",
    difficulty: "hard",
    question:
      "IAM Recommenderが提案するロール推奨の仕組みとして正しいのはどれですか？",
    options: [
      "手動で設定した推奨ルールに基づいてロールを提案する",
      "過去90日間のIAMポリシー使用状況を分析し、実際に使用された権限に基づいて最小権限のロールを推奨する",
      "Google Cloudの全サービスのロールを自動的に削除する",
      "組織外のユーザーに追加ロールを推奨する",
    ],
    correctIndex: 1,
    explanation:
      "IAM Recommenderは、ML（機械学習）を使用して過去90日間のIAMポリシーの使用パターンを分析します。実際に使用された権限に基づいて、過剰な権限を持つロールから最小権限のカスタムロールまたは事前定義ロールへの変更を推奨します。",
    tags: [
      "iam-recommender",
      "least-privilege",
      "ml",
      "policy-analysis",
    ],
  },
  // ─── ネットワークセキュリティ (20%) ───
  {
    id: "pcse-023",
    certId: "pcse",
    domain: "ネットワークセキュリティ",
    difficulty: "medium",
    question:
      "GKEのプライベートクラスタの特徴として正しいのはどれですか？",
    options: [
      "ノードとPodが外部IPアドレスを持ち、インターネットから直接アクセスできる",
      "ノードはプライベートIPアドレスのみを持ち、コントロールプレーンのエンドポイントもプライベートにできる",
      "プライベートクラスタではCloud NATは使用できない",
      "プライベートクラスタではインターネットからコンテナイメージをプルできない",
    ],
    correctIndex: 1,
    explanation:
      "GKEプライベートクラスタでは、ノードにプライベートIPアドレスのみが割り当てられ、外部IPアドレスは持ちません。コントロールプレーンのエンドポイントもプライベートIPに制限できます。インターネットへの送信が必要な場合はCloud NATを使用します。",
    tags: [
      "gke",
      "private-cluster",
      "control-plane",
      "network-isolation",
    ],
  },
  {
    id: "pcse-024",
    certId: "pcse",
    domain: "ネットワークセキュリティ",
    difficulty: "medium",
    question:
      "Cloud Armorの事前構成WAFルールで防御できる攻撃として正しいのはどれですか？",
    options: [
      "DDoS攻撃のみ",
      "SQLインジェクション、クロスサイトスクリプティング（XSS）、リモートファイルインクルージョン（RFI）",
      "ブルートフォースパスワード攻撃のみ",
      "DNS増幅攻撃のみ",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Armorの事前構成WAFルールは、OWASP ModSecurity Core Rule Set（CRS）に基づいており、SQLインジェクション、XSS、RFI/LFI、リモートコード実行（RCE）などのWebアプリケーション攻撃を検出・ブロックできます。",
    tags: ["cloud-armor", "waf", "owasp", "web-security"],
  },
  {
    id: "pcse-025",
    certId: "pcse",
    domain: "ネットワークセキュリティ",
    difficulty: "hard",
    question:
      "VPC Service Controlsのアクセスレベル（Access Level）とAccess Context Managerの関係として正しいのはどれですか？",
    options: [
      "アクセスレベルはVPCファイアウォールルールと同じ機能である",
      "Access Context ManagerでIPアドレス範囲やデバイス属性などの条件を定義したアクセスレベルを作成し、VPC Service Controlsの境界でイングレス/エグレスポリシーの条件として使用する",
      "アクセスレベルはCloud IAMロールの代替として機能する",
      "Access Context ManagerはCloud DNSの一部である",
    ],
    correctIndex: 1,
    explanation:
      "Access Context Managerでは、IPアドレス範囲、デバイスポリシー（OS、暗号化状態など）、地理的な場所などの条件を組み合わせたアクセスレベルを定義します。このアクセスレベルをVPC Service Controlsのイングレス/エグレスポリシーやBeyondCorp Enterprise（IAP）で条件として使用し、コンテキストベースのアクセス制御を実現します。",
    tags: [
      "access-context-manager",
      "access-level",
      "vpc-service-controls",
      "context-aware",
    ],
  },
  {
    id: "pcse-026",
    certId: "pcse",
    domain: "ネットワークセキュリティ",
    difficulty: "hard",
    question:
      "GKEのネットワークポリシー（Network Policy）について正しい説明はどれですか？",
    options: [
      "ネットワークポリシーはデフォルトで有効になっている",
      "ネットワークポリシーを有効にしてCalicoベースのPod間通信制御を設定し、ラベルセレクターでイングレス/エグレスルールを定義する",
      "ネットワークポリシーはノード間通信のみを制御する",
      "ネットワークポリシーはStandardクラスタでは使用できない",
    ],
    correctIndex: 1,
    explanation:
      "GKEのネットワークポリシーはCalicoを使用してPod間通信を制御します。デフォルトでは無効なため、クラスタ作成時または更新時に有効にする必要があります。Kubernetesのラベルセレクター、名前空間セレクター、IPブロックを使用してイングレス/エグレスルールを定義します。",
    tags: [
      "gke",
      "network-policy",
      "calico",
      "pod-security",
      "microsegmentation",
    ],
  },
  {
    id: "pcse-027",
    certId: "pcse",
    domain: "クラウド環境のセキュリティ設計と計画",
    difficulty: "medium",
    question:
      "Cloud Audit Logsの3種類のログタイプの組み合わせとして正しいのはどれですか？",
    options: [
      "アクセスログ、エラーログ、パフォーマンスログ",
      "管理アクティビティログ、データアクセスログ、システムイベントログ",
      "認証ログ、認可ログ、暗号化ログ",
      "ネットワークログ、ストレージログ、コンピューティングログ",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Audit Logsは3種類のログを提供します。管理アクティビティログ（リソースの構成変更を記録、デフォルト有効・無料）、データアクセスログ（データの読み取り・書き込みを記録、デフォルト無効）、システムイベントログ（Googleシステムによる操作を記録）です。",
    tags: ["audit-logs", "admin-activity", "data-access", "logging"],
  },
  {
    id: "pcse-028",
    certId: "pcse",
    domain: "クラウド環境の管理と保護",
    difficulty: "hard",
    question:
      "CSEK（Customer-Supplied Encryption Keys）とCMEK（Customer-Managed Encryption Keys）の違いとして正しいのはどれですか？",
    options: [
      "CSEKとCMEKは同じ機能で名前が異なるだけ",
      "CSEKは顧客が鍵を提供しGoogleは保持しない、CMEKはCloud KMSで顧客が鍵を管理しGoogleのインフラで保持される",
      "CMEKの方がCSEKよりセキュリティが低い",
      "CSEKはCloud KMSでのみ使用でき、CMEKはすべてのサービスで使用できる",
    ],
    correctIndex: 1,
    explanation:
      "CSEKは顧客が暗号鍵を直接提供し、APIリクエスト時に毎回鍵を送信します。Googleは鍵を永続的に保持しません。CMEKはCloud KMSで顧客が鍵のライフサイクルを管理し、鍵はGoogleのインフラ（HSM含む）に保持されます。CSEKの方が顧客の管理責任が大きくなります。",
    tags: ["csek", "cmek", "encryption", "key-management"],
  },
  {
    id: "pcse-029",
    certId: "pcse",
    domain: "アイデンティティとアクセス管理の設定",
    difficulty: "medium",
    question:
      "Google CloudのIAM deny policy（拒否ポリシー）の特徴として正しいのはどれですか？",
    options: [
      "拒否ポリシーは許可ポリシーよりも後に評価される",
      "拒否ポリシーは許可ポリシーよりも先に評価され、明示的にアクセスを拒否する",
      "拒否ポリシーはカスタムロールでのみ使用できる",
      "拒否ポリシーはプロジェクトレベルでのみ設定可能",
    ],
    correctIndex: 1,
    explanation:
      "IAM拒否ポリシーは許可ポリシーよりも先に評価されます。拒否ポリシーでアクセスが拒否された場合、許可ポリシーに関係なくアクセスはブロックされます。これにより、特定のプリンシパルに対して明確にアクセスを禁止するガードレールを設定できます。",
    tags: ["iam", "deny-policy", "access-control", "guardrails"],
  },
  {
    id: "pcse-030",
    certId: "pcse",
    domain: "ネットワークセキュリティ",
    difficulty: "hard",
    question:
      "Certificate Authority Service（CA Service）を使用してプライベートPKIインフラを構築する利点はどれですか？",
    options: [
      "パブリック証明書を無料で発行できる",
      "スケーラブルなプライベート認証局（CA）をマネージドサービスとして運用でき、mTLS用のプライベート証明書を自動発行できる",
      "Let's Encryptの代替として外部向けSSL証明書を発行できる",
      "VPNトンネルの暗号化に使用する鍵ペアを生成できる",
    ],
    correctIndex: 1,
    explanation:
      "Certificate Authority Service（CA Service）はマネージドなプライベートCAサービスです。組織内のmTLS、サービスメッシュ（Anthos Service Mesh/Istio）、IoTデバイス認証などに使用するプライベート証明書を、API経由でスケーラブルに発行・管理できます。",
    tags: [
      "ca-service",
      "private-pki",
      "mtls",
      "certificate-management",
    ],
  },
]
