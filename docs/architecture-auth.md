# GCP Learning Platform — アーキテクチャドキュメント

## 1. システム全体像

### 1.1 プロジェクト概要

GCP製品デモ・アーキテクチャパターン・資格学習をゲーミフィケーションで体験できる社内向けインタラクティブ学習プラットフォーム。

| 項目 | 値 |
|---|---|
| **GCPプロジェクト** | flux-dx-ti-dog |
| **リージョン** | asia-northeast1 (東京) |
| **本番URL** | https://gcp-learning-platform-404350469693.asia-northeast1.run.app |

### 1.2 全体アーキテクチャ図

```
                        ┌─────────────────────────────────────┐
                        │         Google Cloud (flux-dx-ti-dog)│
                        │                                      │
  ユーザー              │  ┌────────────────────────────┐     │
  (社内ブラウザ)        │  │  Identity-Aware Proxy (IAP) │     │
       │                │  │  組織認証（第1関門）         │     │
       └───────────────→│  └──────────┬─────────────────┘     │
                        │             │                        │
                        │  ┌──────────▼─────────────────┐     │
                        │  │  Cloud Run                  │     │
                        │  │  gcp-learning-platform      │     │
                        │  │  ┌──────────────────────┐  │     │
                        │  │  │  Next.js 14 (App Router) │     │
                        │  │  │  standalone mode      │  │     │
                        │  │  │                       │  │     │
                        │  │  │  ┌─ Middleware ──────┐│  │     │
                        │  │  │  │ Session Cookie検証 ││  │     │
                        │  │  │  └──────────────────┘│  │     │
                        │  │  │                       │  │     │
                        │  │  │  ┌─ API Routes ─────┐│  │     │
                        │  │  │  │ /api/auth/session ││  │     │
                        │  │  │  │ /api/auth/check   ││  │     │
                        │  │  │  │ /api/me           ││  │     │
                        │  │  │  └──────────────────┘│  │     │
                        │  │  └──────────────────────┘  │     │
                        │  │  SA: sa-gcp-learning-      │     │
                        │  │      platform@...          │     │
                        │  └────────────┬───────────────┘     │
                        │               │ ADC                  │
                        │       ┌───────┴───────┐              │
                        │       ▼               ▼              │
                        │  ┌─────────┐   ┌───────────┐        │
                        │  │Firebase │   │ Firestore  │        │
                        │  │  Auth   │   │ (default)  │        │
                        │  │ Google  │   │            │        │
                        │  │Provider │   │allowedUsers│        │
                        │  └─────────┘   └───────────┘        │
                        │                                      │
                        │  ┌──────────────────────────────┐   │
                        │  │  Cloud Build                  │   │
                        │  │  main push → 自動ビルド&デプロイ│   │
                        │  └──────────┬───────────────────┘   │
                        │             │                        │
                        │  ┌──────────▼───────────────────┐   │
                        │  │  Artifact Registry            │   │
                        │  │  docker-repo                  │   │
                        │  └──────────────────────────────┘   │
                        └─────────────────────────────────────┘
```

### 1.3 技術スタック

| レイヤー | 技術 |
|---|---|
| **フレームワーク** | Next.js 14 (App Router, standalone output) |
| **言語** | TypeScript (strict mode) |
| **UI** | Tailwind CSS, shadcn/ui, Lucide Icons |
| **アニメーション** | Framer Motion |
| **状態管理** | Zustand (クライアント), React Context (Auth) |
| **図表描画** | React Flow (@xyflow/react), Recharts, dagre |
| **認証** | IAP + Firebase Auth + Firestore allowedUsers |
| **コンテナ** | Docker (node:20-alpine, multi-stage) |
| **CI/CD** | Cloud Build → Artifact Registry → Cloud Run |
| **ランタイム** | Cloud Run (min:0, max:3, 512Mi, 1vCPU) |

### 1.4 機能マップ

```
GCP Learning Platform
├── 学習系
│   ├── 資格学習センター (/learn)       — 8資格の学習ガイド・模擬試験
│   ├── ダンジョン冒険 (/dungeon)       — RPG形式のクイズバトル
│   ├── フラッシュカード (/flashcards)   — 間隔反復で用語暗記
│   ├── デイリーチャレンジ (/daily)      — 毎日のクイズ
│   └── 資格ロードマップ (/roadmap)      — スキルツリー・弱点可視化
├── 探索系
│   ├── 製品カタログ (/products)         — GCP全製品の検索・閲覧
│   ├── インタラクティブデモ (/demos)    — 14+サービスの操作体験
│   ├── アーキテクチャ図 (/architecture) — 参照アーキテクチャの可視化
│   └── Google法人サービス (/google-enterprise) — Workspace/Gemini/GCP比較
├── ツール系
│   ├── 提案シミュレーター (/proposal)   — AI構成提案・見積生成
│   └── 最新アップデート (/updates)      — GCP製品の更新情報
└── ゲーミフィケーション
    ├── XP / レベル / ストリーク
    ├── 実績・バッジ
    └── 適応型難易度調整
```

---

## 2. 認証・認可アーキテクチャ

### 2.1 認証フロー

IAP（組織認証）+ Firebase Auth（個人認証）+ Firestore（許可リスト）の三層アクセス制御。

```
ユーザー
  │
  ▼
┌─────────────────────────────────────────────┐
│  Cloud Run + IAP（第1関門）                   │
│  組織外ユーザーをブロック                      │
│  ヘッダー注入: X-Goog-Authenticated-User-Email │
└──────────────────┬──────────────────────────┘
                   │ 組織メンバーのみ通過
                   ▼
┌─────────────────────────────────────────────┐
│  Next.js Middleware（第2関門）                │
│  __session Cookie の存在チェック              │
│  なし → /login にリダイレクト                 │
│  あり → 通過                                 │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   /login ページ          アプリ本体
   Firebase Auth           （保護済み）
   Googleサインイン
        │
        ▼
┌─────────────────────────────────────────────┐
│  /api/auth/session（第3関門）                 │
│  1. Firebase Admin SDK で IDトークン検証      │
│  2. Firestore allowedUsers で許可チェック     │
│     → 許可: セッションCookie発行 → / へ       │
│     → 拒否: 403 → /unauthorized へ           │
└─────────────────────────────────────────────┘
```

### 2.2 アクセス制御マトリクス

| ユーザー種別 | IAP | Firebase Auth | Firestore照合 | 結果 |
|---|---|---|---|---|
| 社外の人 | ブロック | — | — | アプリに到達しない |
| 社内（許可外） | 通過 | ログイン可能 | 不一致 | /unauthorized |
| 社内（許可済み） | 通過 | ログイン可能 | 一致 | アプリ利用可能 |

### 2.3 セッション管理

| 項目 | 値 |
|---|---|
| Cookie名 | `__session` |
| 有効期間 | 5日間 |
| httpOnly | true |
| secure | production時のみ |
| sameSite | lax |

### 2.4 認証関連ファイル

```
src/
├── middleware.ts                      # セッションCookie存在チェック
├── lib/
│   ├── firebase.ts                   # Firebase Client SDK（遅延初期化）
│   └── firebase-admin.ts            # Firebase Admin SDK（Firestore + Auth）
├── app/
│   ├── login/page.tsx               # Googleサインインページ
│   ├── unauthorized/page.tsx        # アクセス拒否ページ
│   └── api/
│       ├── auth/
│       │   ├── session/route.ts     # セッションCookie作成・削除
│       │   └── check/route.ts       # セッション検証
│       └── me/route.ts             # ユーザー情報取得（Firebase Auth + IAP fallback）
├── components/
│   ├── auth/AuthProvider.tsx        # Firebase Auth コンテキスト
│   └── layout/Header.tsx           # アバター・ログアウトボタン
└── app/layout.tsx                   # AuthProviderでラップ

firestore.rules                      # Firestoreセキュリティルール
```

### 2.5 Firestore データ構造

#### allowedUsers コレクション

許可ユーザーの管理。Admin SDKからサーバーサイドで読み取り。

```
allowedUsers/
  ├── y-imai
  │     ├── email: "y.imai@flux-g.com"
  │     ├── name: "Imai Yuta"
  │     ├── active: true
  │     └── addedAt: 2026-04-01T00:00:00Z
  ├── t-kanayama
  │     ├── email: "t.kanayama@flux-g.com"
  │     ├── active: true
  │     └── ...
  ├── k-akitake
  └── hiroyuki-kojima
```

#### ユーザー管理操作

**追加:**
```bash
TOKEN=$(gcloud auth print-access-token)
curl -s -X POST "https://firestore.googleapis.com/v1/projects/flux-dx-ti-dog/databases/(default)/documents/allowedUsers?documentId=新しいID" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "email": {"stringValue": "new.user@flux-g.com"},
      "name": {"stringValue": "名前"},
      "active": {"booleanValue": true},
      "addedAt": {"timestampValue": "2026-04-01T00:00:00Z"}
    }
  }'
```

**無効化（デプロイ不要・即時反映）:**
```bash
TOKEN=$(gcloud auth print-access-token)
curl -s -X PATCH "https://firestore.googleapis.com/v1/projects/flux-dx-ti-dog/databases/(default)/documents/allowedUsers/対象ID?updateMask.fieldPaths=active" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"active": {"booleanValue": false}}}'
```

---

## 3. インフラ・デプロイアーキテクチャ

### 3.1 GCP リソース構成

| リソース | 値 |
|---|---|
| **プロジェクト** | flux-dx-ti-dog |
| **Cloud Run サービス** | gcp-learning-platform |
| **リージョン** | asia-northeast1 |
| **サービスアカウント** | sa-gcp-learning-platform@flux-dx-ti-dog.iam.gserviceaccount.com |
| **SA ロール** | roles/datastore.user, roles/firebaseauth.admin |
| **Firestore データベース** | (default) |
| **Firebase Auth プロバイダ** | Google |
| **Artifact Registry** | docker-repo |

### 3.2 Cloud Run 構成

| パラメータ | 値 |
|---|---|
| ポート | 3000 |
| メモリ | 512Mi |
| CPU | 1 |
| 最小インスタンス | 0 |
| 最大インスタンス | 3 |
| 同時実行数 | 80 |
| CPU boost | 有効 |

### 3.3 CI/CD パイプライン

```
GitHub (main branch push)
  │
  ▼
Cloud Build トリガー
  │
  ├─ Step 1: Docker build
  │   └─ Firebase環境変数をbuild-argで注入
  │
  ├─ Step 2: Artifact Registry push
  │   └─ asia-northeast1-docker.pkg.dev/flux-dx-ti-dog/docker-repo/
  │
  └─ Step 3: Cloud Run deploy
      └─ 新SA指定 + 環境変数設定
```

構成ファイル: `cloudbuild.yaml`（リポジトリルートの Repository YAML を使用）

### 3.4 Docker ビルド

Multi-stage build (3段階):
1. **deps** — `npm ci --only=production`（本番依存のみ）
2. **builder** — `npm ci` + `npm run build`（Firebase環境変数をARGで注入）
3. **runner** — standalone出力をコピー、非rootユーザーで実行

### 3.5 Firebase 設定

#### 承認済みドメイン（Authentication → 設定）

| ドメイン | 用途 |
|---|---|
| `localhost` | 開発用 |
| `gcp-learning-platform-bjohlttoya-an.a.run.app` | Cloud Run直接アクセス |
| `gcp-learning-platform-404350469693.asia-northeast1.run.app` | IAP経由アクセス（本番） |

#### Cloud Build substitutions

| 変数 | 値 |
|---|---|
| `_FIREBASE_API_KEY` | Firebase Web API キー |
| `_FIREBASE_AUTH_DOMAIN` | flux-dx-ti-dog.firebaseapp.com |
| `_FIREBASE_PROJECT_ID` | flux-dx-ti-dog |

#### Firestoreセキュリティルール

既存プロジェクトのルールが `request.auth != null`（Firebase Auth依存）のため、
allowedUsers の読み取りはAdmin SDK（サーバーサイド）経由で行う。
Admin SDKはFirestoreルールをバイパスするため、クライアントからのアクセスは不要。

---

## 4. フロントエンド設計

### 4.1 ディレクトリ構成

```
src/
├── app/                          # App Router ページ
│   ├── page.tsx                 # ダッシュボード（ホーム）
│   ├── layout.tsx               # ルートレイアウト（AuthProvider）
│   ├── login/                   # ログインページ
│   ├── unauthorized/            # アクセス拒否ページ
│   ├── onboarding/              # 初回セットアップウィザード
│   ├── learn/[cert]/            # 資格学習（動的ルート）
│   ├── dungeon/[cert]/          # ダンジョン（動的ルート）
│   ├── flashcards/[cert]/       # フラッシュカード（動的ルート）
│   ├── daily/                   # デイリーチャレンジ
│   ├── roadmap/                 # 資格ロードマップ
│   ├── products/[id]/           # 製品詳細（動的ルート）
│   ├── demos/                   # 14+サービスデモ
│   ├── architecture/[id]/       # アーキテクチャ図（動的ルート）
│   ├── proposal/                # 提案シミュレーター
│   ├── updates/                 # 最新アップデート
│   ├── google-enterprise/       # Google法人サービス
│   └── api/                     # APIルート
│       ├── auth/session/        # セッション管理
│       ├── auth/check/          # セッション検証
│       └── me/                  # ユーザー情報
├── components/
│   ├── ui/                      # shadcn/ui プリミティブ
│   ├── layout/                  # Sidebar, Header, MainContent, Breadcrumb
│   ├── auth/                    # AuthProvider
│   ├── game/                    # XP, レベル, 実績, ストリーク等
│   ├── demos/                   # DemoShell
│   ├── dungeon/                 # バトル, マップ, HUD
│   ├── flashcards/              # FlashCard
│   ├── learn/                   # ModuleReader, CodeEditStep
│   ├── quiz/                    # DomainFilter, TimerBar
│   ├── architecture/            # React Flow ノード
│   ├── search/                  # CommandPalette (Ctrl+K)
│   └── shared/                  # RelatedContent
├── lib/
│   ├── data/                    # 静的データ（資格, 製品, クイズ等）
│   ├── game/                    # ゲームロジック（XP計算, 適応型難易度等）
│   ├── hooks/                   # カスタムフック
│   ├── stores/                  # Zustand ストア
│   ├── types/                   # 型定義
│   ├── proposal/                # 提案シミュレーターエンジン
│   ├── search/                  # 検索インデックス
│   ├── firebase.ts              # Firebase Client SDK
│   ├── firebase-admin.ts        # Firebase Admin SDK
│   └── utils.ts                 # ユーティリティ（cn関数等）
└── middleware.ts                 # セッション認証ミドルウェア
```

### 4.2 状態管理

| ストア | 技術 | 用途 |
|---|---|---|
| **useGameStore** | Zustand (persist) | XP, レベル, 実績, 学習進捗, ストリーク |
| **useSidebarStore** | Zustand | サイドバー開閉状態 |
| **AuthProvider** | React Context | Firebase Auth ユーザー状態 |

### 4.3 ゲーミフィケーションシステム

```
ユーザーアクション（クイズ回答, デモ操作, 学習完了）
  │
  ▼
XP獲得 → レベルアップ判定 → 実績チェック
  │            │                  │
  ▼            ▼                  ▼
XPToast   LevelUpModal    AchievementToast
```

| 機能 | 実装 |
|---|---|
| XP / レベル | xp-config.ts, xp-utils.ts |
| 実績・バッジ | achievements.ts |
| ストリーク | StreakDisplay, StreakToast |
| スキルツリー | skill-tree-config.ts |
| 適応型難易度 | adaptive-difficulty.ts |
| 間隔反復 | spaced-repetition.ts |
| 弱点検出 | weakness-detector.ts |

---

## 5. データ設計

### 5.1 データソース一覧

全学習データはクライアントサイドの静的TSファイルとして管理（DBレス設計）。

| データ | ファイル | 内容 |
|---|---|---|
| 資格情報 | `lib/data/certifications.ts` | 8資格の定義 |
| 学習モジュール | `lib/data/study-modules/` | 資格別の学習コンテンツ |
| クイズ問題 | `lib/data/quiz-questions.ts` | 100+問 |
| フラッシュカード | `lib/data/flashcards.ts` | 用語カード |
| 製品カタログ | `lib/data/products.ts` | GCP全製品 |
| デモデータ | `lib/data/demo-data.ts` | デモシナリオ |
| アーキテクチャ | `lib/data/architectures.ts` | 参照アーキテクチャ |
| 提案テンプレート | `lib/proposal/templates.ts` | 構成テンプレート |
| 相互参照 | `lib/data/cross-references.ts` | コンテンツ間リンク |

### 5.2 ユーザーデータの永続化

| データ | 保存先 | 方式 |
|---|---|---|
| 学習進捗・XP | ブラウザ localStorage | Zustand persist |
| 認証セッション | httpOnly Cookie | Firebase Session Cookie |
| 許可ユーザー | Firestore allowedUsers | Admin SDK経由 |

---

## 6. トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| `auth/unauthorized-domain` | アクセスURLがFirebase承認済みドメインに未登録 | Firebase console → Authentication → 設定 → 承認済みドメインに追加 |
| `auth/invalid-api-key` | NEXT_PUBLIC_FIREBASE_API_KEY が未設定 | Cloud Build substitutionsを確認 |
| 全員 /unauthorized | SA に roles/datastore.user がない | SAにロール付与 |
| セッション作成失敗 | SA に roles/firebaseauth.admin がない | SAにロール付与 |
| Application error (client-side) | Firebase環境変数がビルド時に注入されていない | Cloud Buildトリガーで「リポジトリのcloudbuild.yaml」を使用しているか確認（インラインYAMLだとsubstitutionsが反映されない） |
| コールドスタートが遅い | min-instances=0 | CPU boostが有効であることを確認。必要に応じてmin-instances=1に変更 |
