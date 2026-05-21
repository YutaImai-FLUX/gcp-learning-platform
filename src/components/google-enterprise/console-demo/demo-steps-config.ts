// Gemini Enterprise 導入デモ - 15 ステップ定義
// 出典: docs/refferance/Gemini_Enterprise導入・セットアップ完全ガイド.pdf

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

export interface DemoStep {
  id: string;
  order: number;
  product: string;
  title: string;
  url: string;
  shell: ShellType;
  guide: DemoStepGuideContent;
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
  },
  {
    id: "project-create",
    order: 6,
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
  },
  {
    id: "api-enable",
    order: 7,
    product: "API ライブラリ",
    title: "必要な API を 4 つ有効化",
    url: "console.cloud.google.com/apis/library",
    shell: "gcp-console",
    guide: {
      what: "Vertex AI API / Vertex AI Agent Builder API（旧 Discovery Engine API）/ IAM API / Security Token Service API の 4 つを有効化する。",
      why: "Gemini Enterprise のフロントエンド（AI Application）と WIF 認証フローを動かすための必須 API。",
      pitfall:
        "組織ポリシー『Restrict Allowed APIs』で allowlist が設定されていると有効化が拒否される。情シスに API allowlist 解除を事前依頼する。",
    },
  },
  {
    id: "wif-pool",
    order: 8,
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
  },
  {
    id: "wif-provider",
    order: 9,
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
  },
  {
    id: "ge-subscription",
    order: 10,
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
  },
  {
    id: "user-licensing",
    order: 11,
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
  },
  {
    id: "ai-app-create",
    order: 12,
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
  },
  {
    id: "datastore-create",
    order: 13,
    product: "AI Application",
    title: "Data Store を作成（アクセス制御 ON）",
    url: "console.cloud.google.com/gen-app-builder/data-stores/create",
    shell: "gcp-console",
    guide: {
      what: "SharePoint / Drive / Confluence 等のデータソースを選択し、「Data source access control」トグルを必ず ON にしてデータストアを作成。",
      why: "アクセス制御 ON のデータストアでは、ソース側 ACL（例: SharePoint の権限）がそのまま Gemini Enterprise に継承される。機密文書の権限境界を保てる唯一の方法。",
      pitfall:
        "アクセス制御 ON / OFF は作成時のみ設定可能、後から変更不可。OFF で作ったら作り直し確定（プロジェクト遅延の最大要因）。本番運用想定で必ず ON で作る。",
    },
  },
  {
    id: "bind-datastore",
    order: 14,
    product: "AI Application",
    title: "AI App にデータストアをバインド",
    url: "console.cloud.google.com/gen-app-builder/engines/internal-knowledge-search",
    shell: "gcp-console",
    guide: {
      what: "Step 12 で作った AI App の設定画面を開き、Step 13 で作ったデータストアをバインドして検索対象として認識させる。",
      why: "AI App とデータストアは独立リソース。バインドして初めてユーザーが検索できる状態になる。複数データストアを一つの App にバインドする運用もよくある。",
      pitfall:
        "バインド後にインジェスト完了を待つ必要がある（5,000 件規模で数十分〜数時間）。インジェスト中は検索結果が不完全になる。",
    },
  },
  {
    id: "search-preview",
    order: 15,
    product: "Gemini Enterprise（エンドユーザー視点）",
    title: "検索プレビューで実際の動作を確認",
    url: "internal-knowledge-search.app.gemini.cloud.google.com",
    shell: "end-user-app",
    guide: {
      what: "PoC ユーザーとしてログインし、自然言語クエリを入力。AI が回答 + 引用ソースを返してくれることを確認する。",
      why: "ここまでの 14 ステップの集大成。Data Store のアクセス制御が効いているため、各ユーザーは「自分が SharePoint 上で閲覧可能な文書だけ」が回答に使われる。",
      pitfall:
        "管理コンソールの Documents タブにファイル一覧が表示されないのは仕様（アクセス制御 ON のため）。動作確認は必ずアプリのプレビュー画面で行う。",
    },
  },
];

export const TOTAL_STEPS = DEMO_STEPS.length;
