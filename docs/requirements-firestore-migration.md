# 学習履歴 Firestore 永続化 — 要件定義書

## 1. 背景と目的

### 1.1 現状

学習履歴（XP / レベル / クイズ結果 / ストリーク / 実績 / ダンジョン進捗 等）は、
ブラウザの **localStorage** に Zustand persist で保存されている（キー: `gcp_study_progress_v1`）。

### 1.2 課題

| # | 課題 | 影響度 | 詳細 |
|---|---|---|---|
| 1 | データ消失 | HIGH | キャッシュクリア・端末変更・シークレットモードで全履歴が消失 |
| 2 | クロスデバイス同期不可 | HIGH | PC / スマホ / 別ブラウザ間で進捗を共有できない |
| 3 | 管理者が進捗を把握できない | HIGH | 誰がどこまで学習したかサーバー側で把握不能 |
| 4 | 容量制限 | MEDIUM | localStorage 上限 5-10MB、長期利用で肥大化リスク |
| 5 | XSS 脆弱性 | MEDIUM | localStorage は JS から直接アクセス可能（httpOnly 不可） |

### 1.3 目的

- 学習履歴を **Firestore** に永続化し、上記課題を解消する
- 管理者が全ユーザーの学習進捗をサーバーサイドで把握可能にする
- クロスデバイスでシームレスに学習を継続可能にする
- 既存の localStorage 設計とのハイブリッド運用で移行リスクを最小化する

---

## 2. スコープ

### 2.1 対象

- `useGameStore` が管理する全 GameState の Firestore 永続化
- Firestore セキュリティルールの設計
- localStorage → Firestore への初回マイグレーション
- 管理者向け進捗閲覧 API

### 2.2 対象外

- 学習コンテンツ（クイズ問題・モジュール等）の Firestore 移行（静的 TS ファイルを維持）
- リアルタイムマルチプレイヤー機能
- Firebase Analytics 連携

---

## 3. Firestore データモデル設計

### 3.1 コレクション構成

```
firestore/
├── allowedUsers/              ← 既存（変更なし）
│   └── {userId}/
│       ├── email: string
│       ├── name: string
│       ├── role: "admin" | "user"
│       ├── active: boolean
│       └── addedAt: timestamp
│
├── userProgress/              ← 新規
│   └── {uid}/                 ← Firebase Auth の uid をドキュメント ID
│       ├── version: number
│       ├── xp: number
│       ├── level: number
│       ├── streaks: map
│       │   ├── currentStreak: number
│       │   ├── longestStreak: number
│       │   └── lastActiveDate: string
│       ├── unlockedAchievements: string[]
│       ├── demoCompletions: map<demoId, DemoCompletion>
│       ├── dungeonProgress: map<roomId, DungeonRoomProgress>
│       ├── lastActiveAt: timestamp
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp      ← 新規: 競合検出用
│
├── userProgress/{uid}/certProgress/   ← サブコレクション
│   └── {certId}/
│       ├── certId: string
│       ├── completedModuleSectionIds: string[]
│       ├── completedLabIds: string[]
│       ├── completedLabStepIds: string[]
│       ├── quizHighScore: number
│       ├── quizAttempts: number
│       ├── domainScores: map<domain, { correct, total }>
│       └── lastStudiedAt: timestamp
│
├── userProgress/{uid}/quizHistory/    ← サブコレクション
│   └── {autoId}/
│       ├── certId: string
│       ├── questionId: string
│       ├── correct: boolean
│       ├── difficulty: string
│       ├── domain: string
│       └── timestamp: timestamp
│
└── userProgress/{uid}/activityLog/    ← サブコレクション
    └── {date}/                        ← YYYY-MM-DD をドキュメント ID
        ├── date: string
        ├── xpEarned: number
        └── actions: number
```

### 3.2 設計判断

| 判断 | 理由 |
|---|---|
| `userProgress/{uid}` をルートドキュメント | uid 単位でアクセス制御、1回の読み取りで主要データ取得 |
| `certProgress` をサブコレクション | 資格ごとに独立更新、ドキュメントサイズ肥大化を防止 |
| `quizHistory` をサブコレクション | 件数が多い（100+問 × 複数回答）、ページネーション対応 |
| `activityLog` をサブコレクション | 最大365日分、日付をキーにした効率的クエリ |
| `demoCompletions`/`dungeonProgress` はルートに埋め込み | 件数が少ない（14デモ / 数十ルーム）、1ドキュメント内で十分 |

### 3.3 ドキュメントサイズ見積もり

| コレクション | 見積もりサイズ | 根拠 |
|---|---|---|
| `userProgress/{uid}` | 約 2-5 KB | マップ系フィールド含む |
| `certProgress/{certId}` | 約 0.5-2 KB | 配列・マップ含む（資格あたり） |
| `quizHistory/{autoId}` | 約 0.2 KB | 1レコードあたり |
| `activityLog/{date}` | 約 0.1 KB | 1日あたり |
| **合計（1ユーザー/年間）** | **約 30-50 KB** | 無料枠 1GB に対して十分 |

---

## 4. セキュリティルール

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // allowedUsers: 既存ルール維持（Admin SDK のみ）
    match /allowedUsers/{document=**} {
      allow read, write: if false;
    }

    // userProgress: 認証済みユーザーが自分のデータのみ操作可能
    match /userProgress/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if request.auth != null && request.auth.uid == uid
                   && request.resource.data.keys().hasAll(['version', 'xp', 'level', 'updatedAt']);

      // サブコレクション: 同じ uid 制約
      match /certProgress/{certId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
      match /quizHistory/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
      match /activityLog/{date} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }

    // 管理者用: 全ユーザー進捗の読み取り（Admin SDK 経由を推奨）
    // クライアントからの管理者アクセスが必要な場合は以下を有効化:
    // match /userProgress/{uid} {
    //   allow read: if request.auth != null
    //               && get(/databases/$(database)/documents/allowedUsers/$(request.auth.token.email)).data.role == "admin";
    // }

    // デフォルト拒否
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 5. 同期アーキテクチャ

### 5.1 ハイブリッド戦略（localStorage + Firestore）

```
┌─────────────────────────────────────────────────────┐
│  React Components (useGameStore)                     │
└──────────┬──────────────────────────┬────────────────┘
           │ (即時)                    │ (非同期)
           ▼                          ▼
┌─────────────────────┐    ┌──────────────────────────┐
│  localStorage        │    │  Firestore               │
│  (プライマリキャッシュ) │    │  (永続ストア)             │
│  読み書き: 同期        │    │  読み書き: 非同期          │
└─────────────────────┘    └──────────────────────────┘
```

### 5.2 同期フロー

#### 書き込み（Write-Behind）

1. ユーザーアクション → `useGameStore` 更新 → localStorage 即時保存（既存動作）
2. デバウンス（3秒）後に Firestore へ差分書き込み
3. Firestore 書き込み失敗時はリトライキューに積む（最大3回）

```typescript
// 同期ミドルウェアのイメージ
const syncToFirestore = debounce(async (state: GameState) => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  await setDoc(doc(db, "userProgress", uid), {
    version: state.version,
    xp: state.xp,
    level: state.level,
    streaks: state.streaks,
    unlockedAchievements: state.unlockedAchievements,
    demoCompletions: state.demoCompletions,
    dungeonProgress: state.dungeonProgress,
    lastActiveAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}, 3000);
```

#### 読み込み（Read-Through）

1. アプリ起動 → localStorage から即時ロード（既存動作、高速起動を維持）
2. Firebase Auth 認証完了後 → Firestore から最新データを取得
3. `updatedAt` タイムスタンプを比較し、新しい方を採用
4. マージ後の状態を localStorage + Firestore 双方に書き戻し

#### 競合解決

| シナリオ | 解決方針 |
|---|---|
| Firestore 側が新しい | Firestore のデータで上書き |
| localStorage 側が新しい | localStorage のデータを Firestore に同期 |
| 同一タイムスタンプ | XP が大きい方を採用（データロス防止） |
| オフライン操作後の復帰 | フィールド単位で max 値マージ（XP, スコア等は max、配列は union） |

### 5.3 オフライン対応

- Firestore SDK の `enablePersistence()` は使用しない（localStorage と二重管理になるため）
- オフライン時: localStorage のみに書き込み、オンライン復帰時に同期
- `navigator.onLine` イベントで同期トリガー

---

## 6. API 設計

### 6.1 進捗同期 API

#### `POST /api/progress/sync`

認証済みユーザーの学習進捗を Firestore と同期する。

**Request:**
```json
{
  "clientState": {
    "version": 1,
    "xp": 1250,
    "level": 8,
    "updatedAt": 1712000000000
  }
}
```

**Response:**
```json
{
  "action": "merged",
  "serverState": { ... },
  "conflicts": []
}
```

### 6.2 管理者 API

#### `GET /api/admin/progress`

全ユーザーの学習進捗サマリーを取得する（admin ロール必須）。

**Response:**
```json
{
  "users": [
    {
      "uid": "xxx",
      "email": "y.imai@flux-g.com",
      "name": "Imai Yuta",
      "xp": 1250,
      "level": 8,
      "currentStreak": 5,
      "lastActiveAt": "2026-04-02T10:00:00Z",
      "certProgress": {
        "cdl": { "quizHighScore": 85, "quizAttempts": 3 },
        "ace": { "quizHighScore": 72, "quizAttempts": 1 }
      }
    }
  ]
}
```

#### `GET /api/admin/progress/:uid`

特定ユーザーの詳細進捗を取得する。

---

## 7. マイグレーション計画

### 7.1 既存データの移行

```
Phase 1: 初回ログイン時の自動マイグレーション
───────────────────────────────────────────
1. ユーザーがログイン
2. Firestore に userProgress/{uid} が存在するか確認
3. 存在しない場合:
   a. localStorage の gcp_study_progress_v1 を読み取り
   b. Firestore にバッチ書き込み（ルート + サブコレクション）
   c. localStorage の migrated フラグを true に設定
4. 存在する場合:
   a. タイムスタンプ比較 → マージ → 双方に書き戻し
```

### 7.2 ロールアウト戦略

| Phase | 内容 | 期間 |
|---|---|---|
| Phase 0 | Firestore クライアント SDK 導入 + セキュリティルール追加 | 1日 |
| Phase 1 | Write-Behind 同期ミドルウェア実装 + 初回マイグレーション | 2-3日 |
| Phase 2 | Read-Through 同期 + 競合解決 + オフライン対応 | 2-3日 |
| Phase 3 | 管理者 API + 進捗ダッシュボード | 2日 |
| Phase 4 | E2E テスト + 本番デプロイ + モニタリング | 1-2日 |

### 7.3 ロールバック

- localStorage を常にプライマリキャッシュとして維持するため、Firestore 同期に問題が発生しても学習体験に影響なし
- 環境変数 `NEXT_PUBLIC_ENABLE_FIRESTORE_SYNC=false` でFirestore 同期を無効化可能

---

## 8. 実装仕様

### 8.1 変更対象ファイル

| ファイル | 変更内容 |
|---|---|
| `src/lib/firebase.ts` | Firestore クライアント SDK の初期化追加 |
| `src/lib/stores/useGameStore.ts` | Firestore 同期ミドルウェアの追加 |
| `src/lib/stores/firestore-sync.ts` | **新規**: 同期ロジック（Write-Behind / Read-Through / マージ） |
| `src/lib/stores/migration.ts` | **新規**: localStorage → Firestore マイグレーション |
| `src/app/api/progress/sync/route.ts` | **新規**: 進捗同期 API |
| `src/app/api/admin/progress/route.ts` | **新規**: 管理者向け進捗取得 API |
| `firestore.rules` | `userProgress` コレクションのルール追加 |
| `.env.example` | `NEXT_PUBLIC_ENABLE_FIRESTORE_SYNC` 追加 |

### 8.2 新規依存パッケージ

| パッケージ | 用途 |
|---|---|
| `firebase/firestore` | Firestore クライアント SDK（firebase パッケージに内包済み） |

> `firebase` パッケージは既にインストール済みのため、追加インストール不要。
> `getFirestore` / `doc` / `setDoc` / `getDoc` 等を `firebase/firestore` からインポートする。

### 8.3 Zustand 同期ミドルウェア

```typescript
// src/lib/stores/firestore-sync.ts（概要）

interface SyncConfig {
  enabled: boolean;
  debounceMs: number;       // デフォルト: 3000
  maxRetries: number;       // デフォルト: 3
}

// Write-Behind: state 変更を検知し Firestore へ非同期書き込み
function createFirestoreSyncMiddleware(config: SyncConfig);

// Read-Through: 起動時に Firestore から読み込みマージ
async function loadAndMergeFromFirestore(uid: string): Promise<Partial<GameState>>;

// マージ: フィールドごとの競合解決
function mergeStates(local: GameState, remote: GameState): GameState;

// マイグレーション: localStorage → Firestore 初回転送
async function migrateLocalToFirestore(uid: string, localState: GameState): Promise<void>;
```

---

## 9. コスト見積もり

### 9.1 Firestore 無料枠

| リソース | 無料枠/日 | 想定使用量/日（10ユーザー） | 余裕度 |
|---|---|---|---|
| ドキュメント読み取り | 50,000 | 約 200-500 | 100倍以上 |
| ドキュメント書き込み | 20,000 | 約 100-300 | 66倍以上 |
| ストレージ | 1 GB | 約 0.5 MB | 2000倍以上 |

### 9.2 スケーリング見積もり

| ユーザー数 | 月間 Read | 月間 Write | 月額コスト |
|---|---|---|---|
| 10名 | 約 15,000 | 約 9,000 | **$0**（無料枠内） |
| 50名 | 約 75,000 | 約 45,000 | **$0**（無料枠内） |
| 100名 | 約 150,000 | 約 90,000 | **$0**（無料枠内） |
| 500名 | 約 750,000 | 約 450,000 | 約 **$1-2/月** |

> 社内学習プラットフォームの規模では、無料枠で十分に運用可能。

---

## 10. テスト計画

### 10.1 単体テスト

| テスト対象 | テスト内容 |
|---|---|
| `mergeStates()` | local 優先 / remote 優先 / max 値マージの各パターン |
| `migrateLocalToFirestore()` | 初回マイグレーション、既存データありケース |
| セキュリティルール | 自 uid のみ読み書き可、他 uid は拒否 |

### 10.2 統合テスト

| テスト対象 | テスト内容 |
|---|---|
| Write-Behind 同期 | XP 獲得 → 3秒後に Firestore 反映確認 |
| Read-Through 同期 | 別ブラウザで更新 → リロード後に最新データ取得 |
| オフライン復帰 | オフラインで学習 → オンライン復帰後に同期 |
| 競合解決 | 2端末で同時操作 → マージ結果の正当性 |

### 10.3 E2E テスト

| シナリオ | 期待結果 |
|---|---|
| 新規ユーザー初回ログイン | Firestore に空の userProgress 作成 |
| 既存ユーザー（localStorage あり）初回ログイン | localStorage → Firestore マイグレーション完了 |
| クイズ回答 → 別端末でログイン | XP / クイズ結果が同期されている |
| キャッシュクリア → 再ログイン | Firestore からデータ復元 |
| 管理者が進捗ダッシュボード閲覧 | 全ユーザーの XP / レベル / 最終アクティブ日時が表示 |

---

## 11. 非機能要件

| 項目 | 要件 |
|---|---|
| レイテンシ | localStorage 読み込みは同期（既存と同等）、Firestore は非同期バックグラウンド |
| 可用性 | Firestore ダウン時も localStorage で学習継続可能 |
| データ整合性 | 結果整合性（eventual consistency）を許容、XP / スコアは max 値で収束 |
| セキュリティ | 自 uid のデータのみアクセス可能、Admin SDK 経由で管理者アクセス |
| 監視 | Firestore 同期エラーを console.warn で出力、将来的に Cloud Logging 連携 |
| フィーチャーフラグ | `NEXT_PUBLIC_ENABLE_FIRESTORE_SYNC` で同期の有効/無効を制御 |
