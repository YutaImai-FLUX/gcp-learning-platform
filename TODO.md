# TODO — GCP Learning Platform

## テスト基盤
- [ ] Vitest/Jestテストフレームワーク導入
- [ ] ゲームロジック（XP計算・ストリーク・適応難易度）のユニットテスト
- [ ] クイズセッション・回答判定のテスト
- [ ] 提案シミュレーターのロジックテスト

## バックエンド・データ永続化
- [ ] ユーザーアカウント機能（Firestore/Supabase検討）
- [ ] 学習進捗のクラウド同期（現在localStorage依存）
- [ ] クイズ履歴・成績のサーバー保存

## UI/UX改善
- [ ] ダンジョンモードのモバイル最適化（SVGレイアウト調整）
- [ ] 提案シミュレーターのレスポンシブ対応
- [ ] アクセシビリティ監査（ARIA、キーボードナビゲーション、色コントラスト）
- [ ] Error Boundary導入

## 脱AI感デザイン改善（2026-03-31 完了）

全ページを対象にfrontend-designプラグイン準拠のデザイン改善を実施。

### Phase 1: デザイン基盤
- [x] `src/app/globals.css` — カラー変数統一（primary #1a73e8）、モーショントークン、heading-display
- [x] `tailwind.config.ts` — フォント: Noto Sans JP + Inter Tight（display）
- [x] `src/app/layout.tsx` — CDNフォントインポート、font-sans適用
- [x] `src/components/layout/MainContent.tsx` — radial-gradient背景で深度追加
- [x] `src/components/layout/Sidebar.tsx` — backdrop-blur-xl（ガラス風）
- [x] `src/components/layout/Header.tsx` — backdrop-blur-xl（ガラス風）

### Phase 2: ホームページ
- [x] `src/app/page.tsx` — ヒーロー拡大、非対称レイアウト（1大+2小）、stagger animation統一

### Phase 3: 学習ページ
- [x] `src/app/learn/page.tsx` — カード左端カラーバー、レベル別セクション分け、統計数値font-display強調

### Phase 4: ダンジョン選択
- [x] `src/app/dungeon/page.tsx` — ヒーロー風グラデーションヘッダー、ロック状態blur+オーバーレイ

### Phase 5: 製品カタログ
- [x] `src/app/products/page.tsx` — カテゴリ別セクション分け、カラーコード上端バー、検索バー強化

### Phase 6: その他ページ
- [x] `src/app/roadmap/page.tsx` — font-display統一、stagger animation、弱点ドメインUI改善
- [x] `src/app/onboarding/page.tsx` — 番号付きステッパーUI、ラベル付きステップインジケーター
- [x] `src/app/proposal/page.tsx` — ヒーロー拡大、カラーバー付きサンプル
- [x] `src/app/flashcards/page.tsx` — カラーバー追加、数値font-display強調

## コンテンツ管理
- [ ] クイズ問題・GCPサービス情報の更新フロー整備
- [ ] コンテンツ更新の自動化検討（GCP公式からの定期取得等）

## パフォーマンス
- [ ] Lighthouse / Web Vitals計測＆改善
- [ ] コード分割の最適化
- [ ] 大量データコンポーネントの遅延読み込み

## ドキュメント
- [ ] CLAUDE.md 作成（プロジェクト概要・開発ルール）
- [ ] アーキテクチャ説明ドキュメント
- [ ] 複雑ロジック（ゲームメカニクス・提案エンジン）へのコードコメント追加
