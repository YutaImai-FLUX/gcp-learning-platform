"use client";

import { useState } from "react";
import { EndUserAppShell } from "../shell/EndUserAppShell";
import { GcpChip } from "../primitives/GcpChip";
import {
  Search,
  Sparkles,
  FileText,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  title: string;
  path: string;
  updated: string;
  permitted: boolean;
}

interface QA {
  q: string;
  answer: string;
  sources: Source[];
  note?: string;
}

const SAMPLES: QA[] = [
  {
    q: "自動車部品の組み立て手順書（ライン3）の最新版を教えて",
    answer: `**ライン 3 の組み立て手順書 (Rev.7.2 / 2026-04 改訂)** によると、主要な変更点は以下の通りです。

1. **トルク管理値の見直し** (3.4.2 節): メインボルト締結トルクを 28 N·m → 32 N·m に変更
2. **検査工程の追加** (4.2 節): 第 2 検査工程の前に「目視外観検査」を新規追加
3. **不具合分類の細分化** (付録 B): 摩擦痕の判定基準を 3 段階 → 5 段階に拡張

旧 Rev.7.1 との完全な差分は引用元 2 を参照してください。`,
    sources: [
      {
        title: "Line3_Assembly_Procedure_Rev7.2.docx",
        path: "/sites/internal-knowledge/Shared Documents/Production/Line3/",
        updated: "2026-04-12",
        permitted: true,
      },
      {
        title: "Line3_Rev7.1_to_7.2_Diff.pdf",
        path: "/sites/internal-knowledge/Shared Documents/Production/Line3/",
        updated: "2026-04-12",
        permitted: true,
      },
      {
        title: "QualityReview_2026Q1.pptx",
        path: "/sites/quality-control/Shared Documents/2026/",
        updated: "2026-03-28",
        permitted: true,
      },
    ],
  },
  {
    q: "ISO9001 監査対応の機密文書の最新コメントは？",
    answer: `**回答できません。**この資料に関連する機密文書には、あなたのアカウント (sato.misaki@yamatoseiki.co.jp) のアクセス権が付与されていません。

該当文書を閲覧するには、品質保証部の山田課長まで権限申請をしてください。`,
    sources: [
      {
        title: "ISO9001_Audit_Confidential_2026Q1.pdf",
        path: "/sites/quality-control/Restricted/",
        updated: "2026-04-05",
        permitted: false,
      },
    ],
    note: "アクセス制御 (Step 13) が正しく ON で設定されているため、権限のない文書は SharePoint 側 ACL に従って自動的に除外されました。",
  },
  {
    q: "経費精算の上限額と承認フロー",
    answer: `**経費精算規程 (2026-04 改訂版)** より:

- **接待交際費**: 1 回あたり ¥30,000 まで部長承認、それ以上は本部長承認
- **国内出張**: 日当 ¥3,500、宿泊 ¥12,000 (東京・大阪) / ¥9,000 (その他)
- **会議費**: 1 名あたり ¥3,000 まで課長承認

承認フローは経費精算システム (kingdom@yamatoseiki.co.jp) で電子化されており、紙申請は 2025 年 12 月で廃止されました。`,
    sources: [
      {
        title: "経費精算規程_2026年4月改訂.pdf",
        path: "/sites/finance/Shared Documents/Policy/",
        updated: "2026-04-01",
        permitted: true,
      },
      {
        title: "経費承認フロー図_v3.png",
        path: "/sites/finance/Shared Documents/Policy/",
        updated: "2025-12-15",
        permitted: true,
      },
    ],
  },
];

export function Step15_SearchPreview() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);
  const [customQuery, setCustomQuery] = useState("");

  const qa = selectedIdx !== null ? SAMPLES[selectedIdx] : null;

  return (
    <EndUserAppShell appName="社内ナレッジ検索">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* ACL banner */}
        <div className="rounded-lg border border-[#34A853]/40 bg-[#E6F4EA] px-3 py-2.5 flex items-start gap-2 text-[12px] leading-relaxed">
          <ShieldCheck size={14} className="text-[#137333] mt-0.5 shrink-0" />
          <div>
            <strong className="text-[#137333]">
              あなたの権限に基づいて検索しています:{" "}
            </strong>
            sato.misaki@yamatoseiki.co.jp · 営業企画部 課長代理 · SharePoint ACL
            を継承中
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6368]"
          />
          <input
            value={qa?.q ?? customQuery}
            onChange={(e) => {
              setSelectedIdx(null);
              setCustomQuery(e.target.value);
            }}
            placeholder="社内ナレッジに質問してみましょう..."
            className="w-full pl-12 pr-12 py-3.5 rounded-full border border-[#DADCE0] bg-white shadow-[0_1px_3px_rgba(60,64,67,0.15)] text-[15px] focus:outline-none focus:border-[#1A73E8] focus:shadow-[0_2px_6px_rgba(60,64,67,0.2)]"
          />
          <button
            aria-label="送信"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center hover:bg-[#1765D0]"
          >
            <Sparkles size={16} />
          </button>
        </div>

        {/* Sample chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[#5F6368]">サンプル:</span>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedIdx(i);
                setCustomQuery("");
              }}
              className={cn(
                "px-3 py-1 rounded-full text-[12px] transition-colors",
                selectedIdx === i
                  ? "bg-[#1A73E8] text-white"
                  : "bg-white border border-[#DADCE0] hover:border-[#1A73E8] text-[#3C4043]",
              )}
            >
              {s.q.length > 26 ? s.q.slice(0, 24) + "…" : s.q}
            </button>
          ))}
        </div>

        {/* Answer */}
        {qa && (
          <div className="space-y-4">
            <div
              className={cn(
                "rounded-2xl border bg-white p-5 shadow-sm",
                qa.note
                  ? "border-[#FBBC05]/40 bg-[#FEF7E0]/40"
                  : "border-[#DADCE0]",
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A73E8] via-[#34A853] to-[#FBBC05] flex items-center justify-center text-white">
                  <Sparkles size={14} />
                </div>
                <div className="text-[12px] font-medium font-display text-[#202124]">
                  Gemini Enterprise の回答
                </div>
                <GcpChip tone="neutral" className="ml-auto">
                  ACL 適用済み
                </GcpChip>
              </div>
              <div className="prose prose-sm max-w-none text-[14px] text-[#202124] whitespace-pre-line leading-relaxed">
                <SimpleMarkdown text={qa.answer} />
              </div>
              {qa.note && (
                <div className="mt-3 text-[11px] text-[#B26A00] leading-relaxed border-t border-[#FBBC05]/40 pt-2">
                  ⓘ {qa.note}
                </div>
              )}
              {/* Action row */}
              <div className="mt-4 flex items-center gap-1 border-t border-[#DADCE0] pt-3">
                <IconAction icon={ThumbsUp} label="役に立った" />
                <IconAction icon={ThumbsDown} label="役に立たなかった" />
                <IconAction icon={Copy} label="コピー" />
                <div className="ml-auto text-[10px] text-[#5F6368]">
                  生成: 0.8 秒 · モデル: gemini-2.0-flash
                </div>
              </div>
            </div>

            {/* Sources */}
            <div>
              <div className="text-[12px] font-medium text-[#202124] mb-2 flex items-center gap-1.5">
                <FileText size={13} className="text-[#1A73E8]" />
                引用ソース ({qa.sources.length} 件)
              </div>
              <ul className="space-y-2">
                {qa.sources.map((s, i) => (
                  <li
                    key={i}
                    className={cn(
                      "rounded-md border bg-white p-3 flex items-start gap-3",
                      s.permitted
                        ? "border-[#DADCE0]"
                        : "border-[#EA4335]/40 bg-[#FCE8E6]/40",
                    )}
                  >
                    <div className="w-6 h-6 shrink-0 rounded bg-[#1A73E8]/10 text-[#1A73E8] text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-medium text-[#1A73E8] truncate hover:underline cursor-pointer">
                          {s.title}
                        </span>
                        {!s.permitted && (
                          <GcpChip tone="red">権限なし - 除外</GcpChip>
                        )}
                      </div>
                      <div className="text-[11px] text-[#5F6368] font-mono truncate">
                        {s.path}
                      </div>
                      <div className="text-[10px] text-[#5F6368] mt-0.5">
                        最終更新: {s.updated}
                      </div>
                    </div>
                    <ExternalLink
                      size={12}
                      className="text-[#5F6368] mt-1 shrink-0"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!qa && customQuery && (
          <div className="rounded-2xl border border-dashed border-[#DADCE0] bg-white p-6 text-center text-[13px] text-[#5F6368]">
            <ChevronRight size={20} className="mx-auto mb-2 text-[#1A73E8]" />
            このデモではサンプル質問のみ実際の AI
            回答を生成します。上のサンプルチップを選択してください。
          </div>
        )}
      </div>
    </EndUserAppShell>
  );
}

function IconAction({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className="w-8 h-8 rounded-full hover:bg-[#F1F3F4] text-[#5F6368] flex items-center justify-center"
    >
      <Icon size={14} />
    </button>
  );
}

function SimpleMarkdown({ text }: { text: string }) {
  // 簡易マークダウン: **bold** と 番号付きリスト だけ対応
  const html = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^(\d+)\. /gm, "<br /><strong>$1.</strong> ");
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
