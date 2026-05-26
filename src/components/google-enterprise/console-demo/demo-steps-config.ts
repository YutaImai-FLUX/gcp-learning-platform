// Gemini Enterprise 導入デモ - 23 ステップ定義
// 出典: docs/refferance/Gemini_Enterprise導入・セットアップ完全ガイド.pdf
// + GCP 実務経験者視点で不足フェーズを補完 (v2: 15 → 23)

export type ShellType =
  | "gcp-console"
  | "workspace-signup"
  | "accounts"
  | "dns"
  | "end-user-app";

export interface DemoStepGuideContent {
  what: string;
  why: string;
  pitfall?: string;
}

export type CalloutTone = "blue" | "green" | "yellow" | "red";

export interface Callout {
  title: string;
  body: string;
  tone?: CalloutTone;
}

export interface DemoStep {
  id: string;
  order: number;
  product: string;
  title: string;
  url: string;
  shell: ShellType;
  guide: DemoStepGuideContent;
  callouts: Callout[];
}

export type PhaseTone = "blue" | "green" | "purple" | "yellow" | "red";

export interface Phase {
  id: string;
  label: string;
  shortLabel: string;
  tone: PhaseTone;
  stepIds: string[];
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: "google-account",
    order: 1,
    product: "Google アカウント",
    title: "管理者用 Google アカウントを作成",
    url: "accounts.google.com/signup",
    shell: "accounts",
    guide: {
      what: "Google Cloud / Cloud Identity を申し込むための、管理者個人の Google アカウントを作成する。",
      why: "Cloud Identity / Workspace の申込みは Google アカウントへのログインが前提。実務では情シス部門の代表アカウント、または個人の業務アカウントから開始する。",
      pitfall:
        "個人 Gmail で申込んでしまうと、後で別管理者へ移管しにくい。原則として組織で管理する専用アドレスを準備する。",
    },
    callouts: [
      {
        title: "個人 Gmail で作らない",
        body: "業務用の専用アドレスで申込みます。退職・異動でテナント管理が止まらないように。",
        tone: "blue",
      },
      {
        title: "2 段階認証は必須",
        body: "管理者アカウントは MFA を必ず有効化。フィッシング攻撃の最初の的になります。",
        tone: "yellow",
      },
      {
        title: "管理者は最低 2 名で",
        body: "バス係数 1 にしないこと。プライマリ + バックアップ管理者を準備します。",
        tone: "green",
      },
    ],
  },
  {
    id: "cloud-identity-signup",
    order: 2,
    product: "Cloud Identity",
    title: "Cloud Identity Free に申し込み",
    url: "workspace.google.com/signup/cloudidentity",
    shell: "workspace-signup",
    guide: {
      what: "会社名・従業員数・カスタムドメイン（例 yamatoseiki.co.jp）を入力して Cloud Identity Free を申込む。",
      why: "Cloud Identity が Google Cloud の組織ノードを作るためのアイデンティティ基盤になる。Workspace 未契約のテナントはここから始める。",
      pitfall:
        "既に Google Workspace 契約済みの組織は別途申込み不要。Workspace の管理コンソールから直接 Google Cloud にアクセスできる。",
    },
    callouts: [
      {
        title: "Free でも組織機能はフル",
        body: "Cloud Identity Free でも Organization / IAM / 監査ログはすべて利用できます。",
        tone: "green",
      },
      {
        title: "ドメイン名は永久不変",
        body: "ここで入力したドメインがテナント識別子になります。タイポ厳禁。",
        tone: "red",
      },
      {
        title: "Workspace 契約済みなら不要",
        body: "既に Workspace を使っている組織はこのステップをスキップ。Admin Console から GCP に直行できます。",
        tone: "blue",
      },
    ],
  },
  {
    id: "domain-verify",
    order: 3,
    product: "DNS / ドメイン検証",
    title: "DNS に TXT レコードを追加してドメイン所有権を証明",
    url: "navi.onamae.com/domain/dns",
    shell: "dns",
    guide: {
      what: "Google から発行された TXT レコードを DNS プロバイダ（お名前.com / Route53 等）に追加し、ドメイン所有権を Google に証明する。",
      why: "検証なしには Google Cloud の組織ノードが作成できない。組織はテナントの最上位リソースで、IAM / 請求 / 組織ポリシーの基盤になる。",
      pitfall:
        "TXT 反映には DNS の TTL に応じた待機時間が必要（数分〜数時間）。dig や nslookup で TXT が引けることを確認してから「確認」ボタンを押す。",
    },
    callouts: [
      {
        title: "値は完全一致で",
        body: "前後にスペースが混入したり、引用符を含めると検証が必ず失敗します。",
        tone: "red",
      },
      {
        title: "TTL は短めに",
        body: "300 秒推奨。検証後に書き換える可能性があるため、長すぎると待機時間に直結します。",
        tone: "yellow",
      },
      {
        title: "dig で事前確認",
        body: "「dig +short TXT yamatoseiki.co.jp」で反映を確認してから「確認」ボタンを押すと一発で通ります。",
        tone: "blue",
      },
    ],
  },
  {
    id: "org-confirm",
    order: 4,
    product: "Google Cloud Console",
    title: "Google Cloud にログイン・組織ノードを確認",
    url: "console.cloud.google.com",
    shell: "gcp-console",
    guide: {
      what: "Cloud Console にログインし、画面上部のプロジェクト selector にドメインが「組織」として表示されることを確認する。",
      why: "組織ノードはドメイン検証完了に伴い自動生成される。手動作成手順は不要。これでテナントのガバナンス基盤が整う。",
      pitfall:
        "個人 Gmail でログインしていると組織ノードは見えない。必ず Cloud Identity で作った管理者アカウント（例 admin@yamatoseiki.co.jp）でログインする。",
    },
    callouts: [
      {
        title: "組織ノードは自動生成",
        body: "DNS 検証完了と同時に Google Cloud 上に組織が現れます。手動作成手順は存在しません。",
        tone: "green",
      },
      {
        title: "Resource Hierarchy の最上位",
        body: "ここから全リソースが配下に作られます。Folder / Project / 各リソースは組織の子。",
        tone: "blue",
      },
      {
        title: "組織 ID は永続",
        body: "数字 12 桁の Organization ID は変更不可。命名規則文書・運用 Runbook に必ず記載。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "billing-create",
    order: 5,
    product: "Cloud Billing",
    title: "請求アカウント（Billing Account）を作成",
    url: "console.cloud.google.com/billing/create",
    shell: "gcp-console",
    guide: {
      what: "国 / 通貨 / 支払い方法を指定して Cloud Billing Account を作成する。",
      why: "Google Cloud のすべての課金リソースは Billing Account に紐付く。Billing がないと API も Gemini Enterprise も有効化できない。",
      pitfall:
        "通貨は作成後変更不可（JPY を選ぶ）。エンタープライズは Google Cloud パートナー経由のリセラー請求書払いが定番。",
    },
    callouts: [
      {
        title: "通貨は永久不変",
        body: "一度 JPY で作ったら USD には変えられません。為替リスクと請求体験のバランスで判断。",
        tone: "red",
      },
      {
        title: "リセラー経由がエンプラ定番",
        body: "月次・日本円・請求書払いを実現する唯一の現実解。直契約は審査 2 週間。",
        tone: "blue",
      },
      {
        title: "クレカは PoC 用",
        body: "本番運用でクレカ払いは経理が承認しません。最初からリセラー契約を進めるとスムーズです。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "budget-alerts",
    order: 6,
    product: "Cloud Billing",
    title: "予算とアラートを設定（FinOps の起点）",
    url: "console.cloud.google.com/billing/budgets",
    shell: "gcp-console",
    guide: {
      what: "請求アカウント / プロジェクト / ラベル単位で月額予算を定義し、50% / 90% / 100% / 120% のしきい値で通知を設定する。",
      why: "「月末に請求書を見て初めて高額に気づく」が最頻の失敗。Budgets API + Pub/Sub 連携で、超過前にエンジニアと経理に同時通知できる。Gemini Enterprise はトークン課金が見えにくいため必須。",
      pitfall:
        "通知先メールは必ず情シス管理者と財務部門の両方を指定する。Pub/Sub 連携にすれば Slack / Teams にも飛ばせる。アラート閾値超過後も課金は止まらない点に注意（停止ロジックは Cloud Functions で別途実装）。",
    },
    callouts: [
      {
        title: "通知のみ・停止しない",
        body: "Budget Alert は通知だけです。自動停止には Pub/Sub → Cloud Functions で BillingAccount を unlink する自前実装が必要。",
        tone: "red",
      },
      {
        title: "経理にもメールを",
        body: "情シスだけだと予算超過のエスカレが止まる典型。CC に財務部門のメーリングリストを必ず追加。",
        tone: "yellow",
      },
      {
        title: "Pub/Sub で Slack 連携",
        body: "Pub/Sub 経由で Slack / Teams に流せば、エンジニアが Cloud Console を見ていなくても気付けます。",
        tone: "blue",
      },
    ],
  },
  {
    id: "project-create",
    order: 7,
    product: "Google Cloud Console",
    title: "プロジェクトを作成",
    url: "console.cloud.google.com/projectcreate",
    shell: "gcp-console",
    guide: {
      what: "Gemini Enterprise を配置するためのプロジェクトを作成し、Billing Account を紐付ける。",
      why: "プロジェクトは課金・API・IAM の単位。Project ID は作成時に確定し変更不可なので命名規則を事前に決める。",
      pitfall:
        "Billing 紐付けを忘れると次のステップ（API 有効化）で 403 エラー。お支払いメニューから紐付け状態を必ず確認。",
    },
    callouts: [
      {
        title: "Project ID は変更不可",
        body: "「ge-poc」のような短い ID ではなく、組織内で一意になる「gemini-poc-prod-23874」のような命名を。",
        tone: "red",
      },
      {
        title: "Folder 配下に配置",
        body: "Production / Staging / Sandbox の各 Folder 配下に作ると、Org Policy が自動継承されます。",
        tone: "green",
      },
      {
        title: "Billing 紐付け忘れに注意",
        body: "紐付けないと次の API 有効化が必ず 403 で失敗。お支払いメニューで紐付け状態を必ず確認。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "org-policy",
    order: 8,
    product: "IAM と管理 / 組織のポリシー",
    title: "組織ポリシーとリソース階層を設計",
    url: "console.cloud.google.com/iam-admin/orgpolicies",
    shell: "gcp-console",
    guide: {
      what: "組織全体のガードレールとなる Org Policy（Domain Restricted Sharing / Allowed APIs / VPC Service Controls 等）を設定し、Folders で本番 / ステージング / サンドボックスを分離する。",
      why: "本番 PJ 作成より前に防衛線を張る。組織ポリシーは全配下リソースに自動継承され、後付けより遥かに統制が効く。次の Step 9 (API 有効化) が失敗する原因 No.1 でもある。",
      pitfall:
        "Domain Restricted Sharing を ON にすると、外部 Google アカウントとのリソース共有が一切できなくなる。要件に応じて Allow List を維持。「Disable Service Account Key Creation」は鍵管理を強制するので、開発フローと併せて設計する。",
    },
    callouts: [
      {
        title: "組織レベルが起点",
        body: "親で設定すると配下のすべてのリソースに自動継承。後付けより圧倒的に管理が楽です。",
        tone: "blue",
      },
      {
        title: "Dry-run で違反検出",
        body: "「gcloud asset analyze-org-policies」で既存リソースの違反を事前に洗い出してから適用。",
        tone: "green",
      },
      {
        title: "SA Key 禁止は WIF とセット",
        body: "「Disable Service Account Key Creation」は Workload Identity / WIF 採用前提。先に開発フローを整える。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "api-enable",
    order: 9,
    product: "API ライブラリ",
    title: "必要な API を 4 つ有効化",
    url: "console.cloud.google.com/apis/library",
    shell: "gcp-console",
    guide: {
      what: "Vertex AI API / Vertex AI Agent Builder API（旧 Discovery Engine API）/ IAM API / Security Token Service API の 4 つを有効化する。",
      why: "Gemini Enterprise のフロントエンド（AI Application）と WIF 認証フローを動かすための必須 API。",
      pitfall:
        "組織ポリシー『Restrict Allowed APIs』で allowlist が設定されていると有効化が拒否される。Step 8 で先に Allow List に含めておくこと。",
    },
    callouts: [
      {
        title: "Allowlist で詰まる",
        body: "Step 8 で組織ポリシーを設定済みなら、API が allowlist に入っていないと「403」で拒否されます。",
        tone: "red",
      },
      {
        title: "4 API は前提条件",
        body: "1 つでも欠けると WIF / AI App / KMS が動きません。必ず 4 つ全部有効化。",
        tone: "yellow",
      },
      {
        title: "Quota も同時確認",
        body: "大規模利用なら IAM > Quotas で Discovery Engine API の Rate Limit を事前に増加申請。",
        tone: "blue",
      },
    ],
  },
  {
    id: "iam-roles",
    order: 10,
    product: "IAM と管理",
    title: "IAM ロールをグループ単位で設計・付与",
    url: "console.cloud.google.com/iam-admin/iam",
    shell: "gcp-console",
    guide: {
      what: "管理者 / プリセールス / 業務ユーザー / 監査人の役割ごとに、必要最小限の事前定義ロール（Owner / Editor は基本使わない）をグループ単位で付与する。",
      why: "IAM の鉄則は「最小権限 + グループベース」。個人にロールを直接付けると退職・異動で運用破綻する。Discovery Engine Admin / Viewer のようなプロダクト固有ロールも必要に応じて選定。",
      pitfall:
        "「とりあえず Editor」が事故の元。Editor は Service Account 作成・Org Policy 一部上書きもできてしまう。条件付き IAM (時間・IP・タグ条件) を併用するとさらに強い。",
    },
    callouts: [
      {
        title: "Owner / Editor は禁忌",
        body: "個人アカウントに付与しない。Owner は組織管理者・ブートストラップ時のみ、Editor は緊急用に限定。",
        tone: "red",
      },
      {
        title: "グループベースで",
        body: "個人ではなく Cloud Identity Group に付与。退職・異動でロールが残るトラブルを根絶。",
        tone: "green",
      },
      {
        title: "Conditional IAM 活用",
        body: "外部監査人は「平日のみ」「特定 IP のみ」のような条件付き許可で。期間限定付与が安全。",
        tone: "blue",
      },
    ],
  },
  {
    id: "wif-pool",
    order: 11,
    product: "IAM と管理",
    title: "Workforce Identity プールを作成",
    url: "console.cloud.google.com/iam-admin/workforce-identity-pools",
    shell: "gcp-console",
    guide: {
      what: "外部 IdP（Entra ID 等）からのログインを受け入れる Workforce Identity プールを作成する。",
      why: "Cloud Identity ユーザーを増やさずに、既存の Entra ID / Okta / Ping のユーザーをそのまま Gemini Enterprise に認証連携できる。ID 同期不要が大きな価値。",
      pitfall:
        "プール ID は後から変更不可。命名は org-wide で一意になるようにする（例 wif-employees-pool）。",
    },
    callouts: [
      {
        title: "組織レベルのリソース",
        body: "Project ではなく Organization 配下に作成。同じプールを複数プロジェクトから参照できます。",
        tone: "blue",
      },
      {
        title: "Pool ID は永続",
        body: "一度作ったら名前変更不可。命名は組織全体で一意に。例: wif-employees-pool。",
        tone: "red",
      },
      {
        title: "セッション有効化を忘れずに",
        body: "「ユーザーセッションを有効化」を OFF のまま作ると GE 利用時に認証エラー。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "scim-provision",
    order: 12,
    product: "IAM と管理 / SCIM",
    title: "SCIM プロビジョニングで Entra ID とグループ同期",
    url: "console.cloud.google.com/iam-admin/scim",
    shell: "gcp-console",
    guide: {
      what: "Cloud Identity 側に SCIM エンドポイント URL とプロビジョニングトークンを発行し、Entra ID 側のエンタープライズアプリで「自動プロビジョニング」を ON にすることでユーザー・グループを定期同期する。",
      why: "WIF だけだと「初回ログインしないとユーザー情報が届かない」。SCIM 併用でログイン前に Google Cloud 側にユーザー・グループが揃い、Step 10 の IAM ロール付与を事前に行える。エンタープライズ標準のあるべき姿。",
      pitfall:
        "Entra 側で『プロビジョニング対象グループ』を絞り込まないと全社員が同期されてしまう。プロビジョニングトークンの有効期限管理（年1回ローテーション）も忘れずに。",
    },
    callouts: [
      {
        title: "WIF の進化形",
        body: "WIF だけだと初回ログインまでユーザー不在。SCIM で先回り同期して IAM 付与を事前完了。",
        tone: "green",
      },
      {
        title: "トークン期限 1 年",
        body: "シークレットトークンは 1 年で失効。Secret Manager Rotation Policy + Calendar リマインダで管理。",
        tone: "red",
      },
      {
        title: "スコープ絞り込み必須",
        body: "Entra 側で「部門 / グループ」フィルタを設定。全社員同期は事故の元。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "wif-provider",
    order: 13,
    product: "IAM と管理",
    title: "プロバイダ（Entra ID）を追加・属性マッピング設定",
    url: "console.cloud.google.com/iam-admin/workforce-identity-pools/wif-employees-pool/providers/add",
    shell: "gcp-console",
    guide: {
      what: "SAML 2.0 プロトコル / メタデータ URL / 属性マッピング（google.subject = assertion.email.toLowerCase()）を設定する。",
      why: "ここで設定したマッピングが、後の Data Store の ACL 評価で使われる。.toLowerCase() を入れないと大文字混在の UPN（User.Name@...）でアクセス権が一致せず障害になる。",
      pitfall:
        "属性マッピングは超重要。.toLowerCase() の漏れ / グループが oid（GUID）で送出される設定 / Entra 側 Optional Claims の追加忘れがハマりどころ Top 3。",
    },
    callouts: [
      {
        title: ".toLowerCase() が命綱",
        body: "Entra の UPN は大文字混在しがち。小文字化を入れないと SharePoint ACL とマッチしません。",
        tone: "red",
      },
      {
        title: "displayName 送出に切替",
        body: "Entra デフォルトは oid (GUID) 送出。これだと SharePoint の グループ表示名 ACL と紐付かない。",
        tone: "yellow",
      },
      {
        title: "メタデータは XML 直接でも可",
        body: "URL が公開できない閉域環境では、メタデータ XML ファイルをアップロード方式で投入できます。",
        tone: "blue",
      },
    ],
  },
  {
    id: "ge-subscription",
    order: 14,
    product: "Gemini Enterprise",
    title: "Gemini Enterprise サブスクリプションを購入",
    url: "console.cloud.google.com/gemini-enterprise/subscriptions",
    shell: "gcp-console",
    guide: {
      what: "Gemini Enterprise の管理画面でサブスクリプションを作成、請求アカウントとシート数を指定して購入する。",
      why: "ライセンスシートはユーザー単位の課金単位。PoC では実利用者数の 80% 程度から開始し、本番展開時に追加する戦略が現実的。",
      pitfall:
        "シートは後からいつでも追加可能。PoC で全社分を一気に買うと未消化リスクが高い。スモールスタートが鉄則。",
    },
    callouts: [
      {
        title: "スモールスタート",
        body: "PoC は実利用者の 80% から開始。シート追加は即時反映なので慌てて多めに買わない。",
        tone: "green",
      },
      {
        title: "シートは月割計算",
        body: "増減は月割で即日適用。途中追加・削減もペナルティなし。",
        tone: "blue",
      },
      {
        title: "Plus は本当に必要か",
        body: "Standard の 1.5 倍単価。Live API / Premium Support が本当に要るか PoC で見極めを。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "notebooklm-subscription",
    order: 15,
    product: "NotebookLM Enterprise",
    title: "NotebookLM Enterprise サブスクリプションを購入",
    url: "console.cloud.google.com/vertex-ai/notebooklm/subscriptions",
    shell: "gcp-console",
    guide: {
      what: "Gemini Enterprise とは別ライセンスの NotebookLM Enterprise を購入。研究・調査・ドキュメント要約用の Notebook 型 UI と Audio Overview (音声要約) を提供する。",
      why: "Gemini Enterprise (横断検索) と NotebookLM Enterprise (深掘り研究) は用途が異なり、ユーザー層も別れる。法務・研究・企画・経営企画など『資料を構造化して読み込む業務』には NotebookLM が刺さる。両方を同じ Workforce Pool で SSO 連携できるのが Google Cloud 側で契約する最大の利点。",
      pitfall:
        "Gemini Enterprise の Audio Overview と勘違いされやすいが、現状は NotebookLM Enterprise Plus のみが Audio Overview を提供。データレジデンシーは asia-northeast1 で確定できるかを必ず事前確認。",
    },
    callouts: [
      {
        title: "GE と独立した課金",
        body: "Gemini Enterprise と NotebookLM Enterprise は別 SKU。両方使うユーザーには両方のシートが必要です。",
        tone: "blue",
      },
      {
        title: "Audio Overview は Plus のみ",
        body: "ポッドキャスト風の音声要約機能は NotebookLM Enterprise Plus のみ。役員向け資料調査で人気。",
        tone: "yellow",
      },
      {
        title: "Workforce Pool 共有 OK",
        body: "Step 11 で作った WIF プール (wif-employees-pool) をそのまま認証に使えます。SSO 二重設定不要。",
        tone: "green",
      },
    ],
  },
  {
    id: "user-licensing",
    order: 16,
    product: "Gemini Enterprise",
    title: "ライセンスの自動割当を有効化",
    url: "console.cloud.google.com/gemini-enterprise/users",
    shell: "gcp-console",
    guide: {
      what: "「Assign licenses automatically」トグルを ON にし、Workforce プール経由でサインインしたユーザーに動的にライセンスを付与する設定にする。",
      why: "手動割当は数百名以上の本番運用では破綻する。WIF と自動割当の組み合わせが、エンタープライズ標準のあるべき姿。",
      pitfall:
        "対象 Workforce プールとマルチリージョン（global / us / eu）の指定を忘れない。global を選ぶケースが多い。",
    },
    callouts: [
      {
        title: "自動割当が正解",
        body: "手動だと運用破綻 + ユーザー漏れで炎上が典型。WIF + 自動割当はセット必須。",
        tone: "green",
      },
      {
        title: "マルチリージョン選択",
        body: "global を選べばどこからでも利用可。データ所在制約があれば us / eu を選択。",
        tone: "blue",
      },
      {
        title: "退職者は自動回収",
        body: "SCIM 連携が効いていれば、退職者は即座にプロビジョン解除 → GE ライセンス回収。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "ai-app-create",
    order: 17,
    product: "AI Application",
    title: "AI Application（Search タイプ）を作成",
    url: "console.cloud.google.com/gen-app-builder/engines/create",
    shell: "gcp-console",
    guide: {
      what: "エンドユーザー向けの検索 UI となる AI App を作成。Search / Chat のタイプを選択し、認証プロバイダに Workforce プールを紐付ける。",
      why: "AI App が PoC ユーザーの実際の入口になる。WIF プールを必ず紐付け、組織外アクセスを遮断する。",
      pitfall:
        "認証プロバイダを紐付け忘れると、デフォルトの Google アカウント認証になり、組織外ユーザーがアクセスできる状態に。Settings > Authentication で必ず確認。",
    },
    callouts: [
      {
        title: "認証プロバイダ必須",
        body: "未紐付け公開は組織外漏洩リスク。Settings > Authentication で WIF プール紐付けを必ず確認。",
        tone: "red",
      },
      {
        title: "Search 型が王道",
        body: "「検索 → 引用 → 要約」は RAG のテンプレ。PoC は Search 型から始めるのがハマりにくい。",
        tone: "blue",
      },
      {
        title: "App ID は永続",
        body: "URL の一部になるため変更不可。テナント全体で一意な ID 命名規則を決めておくと運用が楽。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "datastore-create",
    order: 18,
    product: "AI Application",
    title: "Data Store を作成（アクセス制御 ON）",
    url: "console.cloud.google.com/gen-app-builder/data-stores/create",
    shell: "gcp-console",
    guide: {
      what: "SharePoint / Drive / Confluence 等のデータソースを選択し、「Data source access control」トグルを必ず ON にしてデータストアを作成。",
      why: "アクセス制御 ON のデータストアでは、ソース側 ACL（例: SharePoint の権限）がそのまま Gemini Enterprise に継承される。機密文書の権限境界を保てる唯一の方法。",
      pitfall:
        "アクセス制御 ON / OFF は作成時のみ設定可能、後から変更不可。OFF で作ったら作り直し確定（プロジェクト遅延の最大要因）。本番運用想定では必ず ON で作る。",
    },
    callouts: [
      {
        title: "★ ACL ON は作成時のみ",
        body: "後から ON にする操作は存在しません。OFF で作ったら全削除して作り直し。",
        tone: "red",
      },
      {
        title: "Documents タブが空に見える",
        body: "ACL ON だと管理者にも一覧非表示。仕様であって障害ではありません。",
        tone: "yellow",
      },
      {
        title: "インジェスト 2 時間",
        body: "5,000 件規模で数十分〜数時間。完了前の検索は部分結果なので品質評価は完了後に。",
        tone: "blue",
      },
    ],
  },
  {
    id: "cmek-vpc-sc",
    order: 19,
    product: "Cloud KMS / VPC Service Controls",
    title: "CMEK と VPC Service Controls でデータ境界を強化",
    url: "console.cloud.google.com/security/vpc-service-controls",
    shell: "gcp-console",
    guide: {
      what: "Cloud KMS で顧客管理鍵（CMEK）を作成し Data Store に紐付け、VPC Service Controls でサービスペリメータを構築して Discovery Engine API へのアクセスを限定する。",
      why: "金融・公共・自治体・医療など、暗号鍵を顧客側で持つ要件、データを物理境界の外に出さない要件がある業界では必須。Google 側で復号できる構造（CSEK ではない CMEK）と、API ペリメータで Exfiltration を防ぐ仕組みが両方必要。",
      pitfall:
        "VPC Service Controls の Perimeter を間違えると正規ユーザーまでブロックされる。Dry-run モードでログを取りながら段階適用するのが鉄則。KMS 鍵のローテーション（推奨 90 日）と Audit Log 監視も忘れずに。",
    },
    callouts: [
      {
        title: "金融・公共では必須",
        body: "顧客管理鍵 (CMEK) + 境界制御 (VPC SC) で「物理的に守れる」状態に。要件業界では本契約の前提条件。",
        tone: "blue",
      },
      {
        title: "Dry-run で慣らす",
        body: "VPC SC をいきなり Enforce にすると正規アクセスもブロック。ログ収集モードで違反パターンを洗ってから本適用。",
        tone: "yellow",
      },
      {
        title: "鍵削除は復号不可",
        body: "KMS 鍵を削除するとデータは永久に読めません。Destroyer ロールは情シス管理者のみに限定。",
        tone: "red",
      },
    ],
  },
  {
    id: "bind-datastore",
    order: 20,
    product: "AI Application",
    title: "AI App にデータストアをバインド",
    url: "console.cloud.google.com/gen-app-builder/engines/internal-knowledge-search",
    shell: "gcp-console",
    guide: {
      what: "Step 16 で作った AI App の設定画面を開き、Step 17 で作ったデータストアをバインドして検索対象として認識させる。",
      why: "AI App とデータストアは独立リソース。バインドして初めてユーザーが検索できる状態になる。複数データストアを一つの App にバインドする運用もよくある。",
      pitfall:
        "バインド後にインジェスト完了を待つ必要がある（5,000 件規模で数十分〜数時間）。インジェスト中は検索結果が不完全になる。",
    },
    callouts: [
      {
        title: "複数バインド可",
        body: "1 つの App に SharePoint + Drive + Confluence など複数 Data Store を紐付けて横断検索できます。",
        tone: "blue",
      },
      {
        title: "インジェスト中も検索可",
        body: "部分結果が返ります。「完全」に見えて実は未取込みのケースに注意 — 完了は別タブで確認。",
        tone: "yellow",
      },
      {
        title: "Reindex は別操作",
        body: "ソース文書更新は自動再取込みされません。Refresh スケジュール (日次 / 週次) を別途設定。",
        tone: "green",
      },
    ],
  },
  {
    id: "search-preview",
    order: 21,
    product: "Gemini Enterprise（エンドユーザー視点）",
    title: "検索プレビューで実際の動作を確認",
    url: "internal-knowledge-search.app.gemini.cloud.google.com",
    shell: "end-user-app",
    guide: {
      what: "PoC ユーザーとしてログインし、自然言語クエリを入力。AI が回答 + 引用ソースを返してくれることを確認する。",
      why: "ここまでの 19 ステップの集大成。Data Store のアクセス制御が効いているため、各ユーザーは「自分が SharePoint 上で閲覧可能な文書だけ」が回答に使われる。",
      pitfall:
        "管理コンソールの Documents タブにファイル一覧が表示されないのは仕様（アクセス制御 ON のため）。動作確認は必ずアプリのプレビュー画面で行う。",
    },
    callouts: [
      {
        title: "ACL の実証地点",
        body: "権限のない文書が本当に除外されるか、ここで現場ユーザーアカウントで確認します。",
        tone: "green",
      },
      {
        title: "PoC ユーザーで検証",
        body: "管理者アカウントだと ACL が緩いケースが多い。必ず実エンドユーザーで動作確認を。",
        tone: "blue",
      },
      {
        title: "引用必須",
        body: "引用が出ない回答は使わせない。利用ガイドライン (Step 23) に明文化。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "audit-log",
    order: 22,
    product: "Cloud Logging / Access Transparency",
    title: "監査ログと Access Transparency を有効化",
    url: "console.cloud.google.com/iam-admin/audit",
    shell: "gcp-console",
    guide: {
      what: "Admin Activity / Data Access / System Event / Policy Denied の 4 種類の監査ログを有効化し、BigQuery / Cloud Storage に長期エクスポート、Access Transparency で Google 社員のアクセスログまで取得する。",
      why: "監査部門の必須要件。「いつ・誰が・何にアクセスしたか」が説明できないと本契約に進めない。Data Access ログは課金されるので対象 API を絞る設計が必要。Access Transparency は Google 側のオペレーションまで可視化するエンプラ特権。",
      pitfall:
        "デフォルトの 90 日保存では監査要件（多くは 1 年以上）を満たせない。BigQuery シンクで永続化＋ロック設定が必須。Data Access ログを全 API で取ると課金が一気に跳ねるので、対象 API を IAM / Discovery Engine / KMS に絞り込む。",
    },
    callouts: [
      {
        title: "Data Access は課金注意",
        body: "全 API ON で月数十万円になることも。対象を Discovery Engine / IAM / KMS に絞り込む。",
        tone: "red",
      },
      {
        title: "BigQuery で永続化",
        body: "90 日デフォルトでは ISO27001 等の監査要件を満たせません。BigQuery シンク + 改竄防止ロックが必須。",
        tone: "yellow",
      },
      {
        title: "Google の覗き見対策",
        body: "Access Transparency で Google サポート社員のアクセスログも記録。Access Approval で事前承認制も可。",
        tone: "blue",
      },
    ],
  },
  {
    id: "quality-kpi",
    order: 23,
    product: "AI Application / 評価",
    title: "回答品質（RAG eval）と KPI ダッシュボードを構築",
    url: "console.cloud.google.com/gen-app-builder/evaluation",
    shell: "gcp-console",
    guide: {
      what: "Faithfulness（忠実性）/ Groundedness（引用根拠）/ Answer Relevance / Coverage / Latency / Cost / User Feedback の 7 軸で回答品質を継続的に評価し、Cloud Monitoring ダッシュボードで可視化する。",
      why: "「動く」と「業務で使える」の間には深い谷がある。評価データセットと指標を定義しないと、モデル更新時のリグレッションに気付けない。導入後 3-6 ヶ月の継続価値はここで決まる。",
      pitfall:
        "Faithfulness と Groundedness の違いを混同しがち（前者: 引用に矛盾しないか、後者: 引用が回答を支持しているか）。User Feedback 👍👎 をスコアの一次情報にしないこと（採点バイアスが強い）。Gold Set は業務担当者と一緒に作る。",
    },
    callouts: [
      {
        title: "Faithful ≠ Grounded",
        body: "Faithful は「引用に矛盾しないか」、Grounded は「引用が回答を支持するか」。両方測ること。",
        tone: "blue",
      },
      {
        title: "Gold Set は業務担当者と",
        body: "IT 部門だけで作ると現場の質問とズレる。営業 / 品証 / 経理から実クエリを集める。",
        tone: "green",
      },
      {
        title: "👍👎 は一次指標にしない",
        body: "ユーザーは「期待外れ」=「役に立たない」と押すバイアスあり。自動評価と組合せて判断。",
        tone: "yellow",
      },
    ],
  },
  {
    id: "change-mgmt",
    order: 24,
    product: "Go-Live 計画",
    title: "チェンジマネジメント & 段階展開を設計",
    url: "internal-runbook/gemini-enterprise/go-live",
    shell: "gcp-console",
    guide: {
      what: "Pilot（50 名 / 1 拠点）→ Limited（500 名 / 5 拠点）→ GA（全社 / 23 拠点）の 3 段階で展開計画を引き、各フェーズに KPI ゲート・利用ガイドライン・トレーニング・コミュニケーション計画を紐付ける。",
      why: "エンプラ PoC で最頻の失敗は『技術は完成したが誰も使わない』。展開を一気にやらず、Pilot でユーザー満足度・誤回答率を測ってから次段へ。経営層への報告フォーマットも事前定義する。",
      pitfall:
        "Pilot 参加者を「IT リテラシーが高い人」だけで揃えると、本番展開で別の層が脱落する。各部門の代表（営業 / 品証 / 経理 / 工場）から多様にサンプリングする。利用ガイドラインに『機密情報を入力しない』を明示しないと事故る。",
    },
    callouts: [
      {
        title: "ゲート未達は延期判断",
        body: "数値ゲートをクリアしなかったら次フェーズを延期する勇気を。無理に進めて全社展開で炎上が最悪。",
        tone: "yellow",
      },
      {
        title: "Don't を明記",
        body: "「機密情報を入力しない」「外部転送禁止」は Day1 から教育。利用ガイドラインに必ず含める。",
        tone: "red",
      },
      {
        title: "技術完成 ≠ 成功",
        body: "使われない PoC は失敗です。定着 (アクティブ率 / NPS) が真のゴール。チェンジマネジメントを軽視しない。",
        tone: "blue",
      },
    ],
  },
];

export const TOTAL_STEPS = DEMO_STEPS.length;

export const PHASES: Phase[] = [
  {
    id: "setup",
    label: "アカウント & 組織立ち上げ",
    shortLabel: "立ち上げ",
    tone: "blue",
    stepIds: [
      "google-account",
      "cloud-identity-signup",
      "domain-verify",
      "org-confirm",
    ],
  },
  {
    id: "foundation",
    label: "課金 / プロジェクト / ガバナンス",
    shortLabel: "基盤",
    tone: "green",
    stepIds: [
      "billing-create",
      "budget-alerts",
      "project-create",
      "org-policy",
      "api-enable",
      "iam-roles",
    ],
  },
  {
    id: "identity",
    label: "ID 連携",
    shortLabel: "ID連携",
    tone: "purple",
    stepIds: ["wif-pool", "scim-provision", "wif-provider"],
  },
  {
    id: "ge",
    label: "Gemini Enterprise 利用開始",
    shortLabel: "GE 利用",
    tone: "yellow",
    stepIds: [
      "ge-subscription",
      "notebooklm-subscription",
      "user-licensing",
      "ai-app-create",
      "datastore-create",
      "cmek-vpc-sc",
      "bind-datastore",
      "search-preview",
    ],
  },
  {
    id: "ops",
    label: "監査 / 品質 / 運用",
    shortLabel: "運用",
    tone: "red",
    stepIds: ["audit-log", "quality-kpi", "change-mgmt"],
  },
];

export function getPhaseForStep(stepId: string): Phase | undefined {
  return PHASES.find((p) => p.stepIds.includes(stepId));
}
