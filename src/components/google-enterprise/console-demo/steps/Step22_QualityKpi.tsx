"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import {
  ChevronLeft,
  Activity,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCard {
  id: string;
  label: string;
  description: string;
  value: number;
  unit: string;
  target: number;
  trend: number;
  goodHigher: boolean;
}

const METRICS: MetricCard[] = [
  {
    id: "faithfulness",
    label: "Faithfulness",
    description: "回答が引用文書の内容と矛盾しないか (0-100)",
    value: 87,
    unit: "%",
    target: 85,
    trend: 3,
    goodHigher: true,
  },
  {
    id: "groundedness",
    label: "Groundedness",
    description: "回答の主張が引用で支持されている割合 (0-100)",
    value: 81,
    unit: "%",
    target: 80,
    trend: -1,
    goodHigher: true,
  },
  {
    id: "answer-relevance",
    label: "Answer Relevance",
    description: "質問に対する回答の関連度 (LLM-as-a-Judge)",
    value: 92,
    unit: "%",
    target: 88,
    trend: 2,
    goodHigher: true,
  },
  {
    id: "coverage",
    label: "Coverage (Top-K Recall)",
    description: "Gold Set で正解文書を上位 K 件に含めた割合",
    value: 78,
    unit: "%",
    target: 80,
    trend: -3,
    goodHigher: true,
  },
  {
    id: "latency",
    label: "P95 Latency",
    description: "応答時間の 95 パーセンタイル",
    value: 1850,
    unit: "ms",
    target: 2000,
    trend: -120,
    goodHigher: false,
  },
  {
    id: "cost",
    label: "クエリ単価",
    description: "1 クエリあたりの実コスト (トークン+ベクトル検索)",
    value: 3.2,
    unit: "円",
    target: 5,
    trend: -0.4,
    goodHigher: false,
  },
];

interface EvalSample {
  q: string;
  faithful: boolean;
  grounded: boolean;
  relevant: boolean;
  source: string;
}

const EVAL_SAMPLES: EvalSample[] = [
  {
    q: "ライン3 の組み立て手順書 (Rev7.2) の変更点は？",
    faithful: true,
    grounded: true,
    relevant: true,
    source: "Production/Line3/Rev7.2.docx",
  },
  {
    q: "経費精算の上限額",
    faithful: true,
    grounded: true,
    relevant: true,
    source: "Policy/経費精算規程_2026年4月改訂.pdf",
  },
  {
    q: "競合 A 社のシェアは？",
    faithful: false,
    grounded: false,
    relevant: false,
    source: "(該当文書なし、ハルシネーション)",
  },
  {
    q: "ISO9001 監査の最新コメント",
    faithful: true,
    grounded: true,
    relevant: true,
    source: "(権限なしで回答拒否)",
  },
  {
    q: "新型部品 X-7 のスペック",
    faithful: true,
    grounded: false,
    relevant: true,
    source: "Engineering/X-7_Spec_v2.pptx",
  },
];

export function Step22_QualityKpi() {
  const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");
  const okCount = EVAL_SAMPLES.filter(
    (e) => e.faithful && e.grounded && e.relevant,
  ).length;
  const goodFeedback = 142;
  const badFeedback = 23;
  const npsLike = Math.round(
    (goodFeedback / (goodFeedback + badFeedback)) * 100,
  );

  return (
    <GcpConsoleShell
      navHighlightId="ai-app"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={[
        "AI Application",
        "internal-knowledge-search",
        "評価 & モニタリング",
      ]}
      title="回答品質 & KPI ダッシュボード"
      description="RAG eval 7 軸 + ユーザーフィードバックでモデル更新時のリグレッションを検知。"
      actions={
        <>
          <PeriodTabs value={period} onChange={setPeriod} />
          <GcpButton
            variant="outlined"
            size="sm"
            leadingIcon={<RefreshCcw size={12} />}
          >
            再評価
          </GcpButton>
          <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
            アプリへ戻る
          </GcpButton>
        </>
      }
    >
      <div className="space-y-5">
        {/* Metrics grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {METRICS.map((m) => {
            const meetsTarget = m.goodHigher
              ? m.value >= m.target
              : m.value <= m.target;
            const trendGood = m.goodHigher ? m.trend > 0 : m.trend < 0;
            return (
              <div
                key={m.id}
                className={cn(
                  "rounded-lg border-2 p-4 bg-white dark:bg-[#1F1F1F]",
                  meetsTarget
                    ? "border-[#34A853]/30"
                    : "border-[#FBBC05]/40 bg-[#FEF7E0]/30",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[12px] font-medium text-[#202124] dark:text-white">
                    {m.label}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold flex items-center gap-0.5",
                      trendGood ? "text-[#137333]" : "text-[#D93025]",
                    )}
                  >
                    {trendGood ? (
                      <TrendingUp size={11} />
                    ) : (
                      <TrendingDown size={11} />
                    )}
                    {m.trend > 0 ? "+" : ""}
                    {m.trend}
                    {m.unit === "ms" || m.unit === "円" ? m.unit : "pp"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-[28px] font-bold tabular-nums text-[#202124] dark:text-white leading-tight">
                    {m.value}
                  </span>
                  <span className="text-[12px] text-[#5F6368]">{m.unit}</span>
                </div>
                <div className="text-[10px] text-[#5F6368] mb-2">
                  目標: {m.goodHigher ? "≥" : "≤"} {m.target}
                  {m.unit} ·{" "}
                  {meetsTarget ? (
                    <span className="text-[#137333]">達成</span>
                  ) : (
                    <span className="text-[#B26A00]">未達</span>
                  )}
                </div>
                <div className="h-1 rounded-full bg-[#E8EAED] overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      meetsTarget ? "bg-[#34A853]" : "bg-[#FBBC05]",
                    )}
                    style={{
                      width: `${Math.min(100, (m.value / (m.goodHigher ? m.target * 1.2 : m.target * 1.5)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] text-[#5F6368] mt-2 leading-relaxed">
                  {m.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* User feedback summary */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-medium font-display flex items-center gap-2">
              <Activity size={16} className="text-[#1A73E8]" />
              ユーザーフィードバック ({period})
            </div>
            <GcpChip tone="neutral">
              総回答数: {(goodFeedback + badFeedback).toLocaleString()}
            </GcpChip>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FeedbackCard
              icon={ThumbsUp}
              tone="green"
              label="役に立った"
              count={goodFeedback}
              pct={(goodFeedback / (goodFeedback + badFeedback)) * 100}
            />
            <FeedbackCard
              icon={ThumbsDown}
              tone="red"
              label="役に立たなかった"
              count={badFeedback}
              pct={(badFeedback / (goodFeedback + badFeedback)) * 100}
            />
            <div className="rounded-lg border border-[#1A73E8]/40 bg-[#E8F0FE]/40 p-3 flex flex-col justify-center">
              <div className="text-[10px] text-[#5F6368] uppercase tracking-wider">
                NPS 風スコア
              </div>
              <div className="font-display text-[26px] font-bold text-[#1A73E8] leading-tight tabular-nums">
                {npsLike}
              </div>
              <div className="text-[10px] text-[#5F6368]">
                Pilot ゲート基準: ≥ 70
              </div>
            </div>
          </div>
          <div className="mt-3 rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertTriangle
              size={13}
              className="text-[#B26A00] mt-0.5 shrink-0"
            />
            <span>
              👍👎 を <strong>一次指標にしない</strong>
              こと。ユーザーは「期待と違う」=「役に立たない」と押す傾向あり。Gold
              Set ベースの自動評価 (Faithfulness / Groundedness)
              と組合せて判断。
            </span>
          </div>
        </section>

        {/* Eval sample table */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#DADCE0] flex items-center justify-between">
            <div className="text-[13px] font-medium font-display flex items-center gap-2">
              <Sparkles size={14} className="text-[#1A73E8]" />
              Gold Set 評価サンプル (Auto-Eval)
            </div>
            <GcpChip
              tone={okCount === EVAL_SAMPLES.length ? "green" : "yellow"}
            >
              {okCount} / {EVAL_SAMPLES.length} 全項目クリア
            </GcpChip>
          </div>
          <table className="w-full text-[12px]">
            <thead className="bg-[#F8F9FA] text-[#5F6368]">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider">
                  クエリ
                </th>
                <th className="px-3 py-2 text-center text-[10px] uppercase tracking-wider w-24">
                  Faithful
                </th>
                <th className="px-3 py-2 text-center text-[10px] uppercase tracking-wider w-24">
                  Grounded
                </th>
                <th className="px-3 py-2 text-center text-[10px] uppercase tracking-wider w-24">
                  Relevant
                </th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider">
                  Top ソース
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DADCE0]">
              {EVAL_SAMPLES.map((s, i) => {
                const allOk = s.faithful && s.grounded && s.relevant;
                return (
                  <tr key={i} className={cn(!allOk && "bg-[#FCE8E6]/20")}>
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-[12px]">{s.q}</div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Pass ok={s.faithful} />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Pass ok={s.grounded} />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Pass ok={s.relevant} />
                    </td>
                    <td className="px-3 py-2.5 text-[11px] font-mono text-[#5F6368]">
                      {s.source}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Best practices */}
        <div className="rounded-lg border border-[#1A73E8]/30 bg-[#E8F0FE]/40 p-4 space-y-2">
          <div className="text-[13px] font-medium text-[#1A73E8]">
            運用ベストプラクティス
          </div>
          <ul className="text-[11px] text-[#3C4043] dark:text-white/80 leading-relaxed space-y-1 pl-5 list-disc">
            <li>
              Gold Set は業務担当者と共同で作成 (50-200 件)。四半期毎に更新
            </li>
            <li>
              モデル更新前に必ず Auto-Eval を回し、リグレッション 5% 以上で延期
            </li>
            <li>
              Cloud Monitoring の Alert Policy で Faithfulness {"<"} 80% 通知
            </li>
            <li>
              悪い回答は Cloud Logging から復元できるよう{" "}
              <code className="font-mono bg-white rounded px-1">
                request_id
              </code>{" "}
              をログ
            </li>
          </ul>
        </div>
      </div>
    </GcpConsoleShell>
  );
}

function PeriodTabs({
  value,
  onChange,
}: {
  value: "24h" | "7d" | "30d";
  onChange: (v: "24h" | "7d" | "30d") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-[#DADCE0] bg-white p-0.5 text-[11px]">
      {(["24h", "7d", "30d"] as const).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "px-3 py-1 rounded-full transition-colors",
            value === p
              ? "bg-[#1A73E8] text-white font-medium"
              : "text-[#5F6368] hover:text-[#202124]",
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function FeedbackCard({
  icon: Icon,
  tone,
  label,
  count,
  pct,
}: {
  icon: React.ElementType;
  tone: "green" | "red";
  label: string;
  count: number;
  pct: number;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "green"
          ? "border-[#34A853]/30 bg-[#E6F4EA]/40"
          : "border-[#EA4335]/30 bg-[#FCE8E6]/40",
      )}
    >
      <Icon
        size={16}
        className={tone === "green" ? "text-[#137333]" : "text-[#D93025]"}
      />
      <div className="font-display text-[24px] font-bold tabular-nums text-[#202124] dark:text-white leading-tight mt-1">
        {count.toLocaleString()}
      </div>
      <div className="text-[10px] text-[#5F6368]">
        {label} · {pct.toFixed(1)}%
      </div>
    </div>
  );
}

function Pass({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-5 h-5 rounded-full text-[12px] font-bold leading-5",
        ok
          ? "bg-[#34A853]/15 text-[#137333]"
          : "bg-[#EA4335]/15 text-[#D93025]",
      )}
    >
      {ok ? "✓" : "✕"}
    </span>
  );
}
