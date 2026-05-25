"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import {
  Users,
  Rocket,
  GraduationCap,
  Megaphone,
  Check,
  ChevronLeft,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PhaseId = "pilot" | "limited" | "ga";

interface Phase {
  id: PhaseId;
  label: string;
  users: number;
  sites: number;
  weeks: number;
  startWeek: number;
  status: "done" | "active" | "planned";
  gates: { metric: string; target: string; current?: string; ok?: boolean }[];
}

const PHASES: Phase[] = [
  {
    id: "pilot",
    label: "Pilot",
    users: 50,
    sites: 1,
    weeks: 4,
    startWeek: 1,
    status: "done",
    gates: [
      {
        metric: "アクティブユーザー率",
        target: "≥ 70%",
        current: "82%",
        ok: true,
      },
      { metric: "Faithfulness", target: "≥ 85%", current: "87%", ok: true },
      { metric: "NPS 風スコア", target: "≥ 70", current: "86", ok: true },
      { metric: "インシデント", target: "0 件", current: "0 件", ok: true },
    ],
  },
  {
    id: "limited",
    label: "Limited Rollout",
    users: 500,
    sites: 5,
    weeks: 6,
    startWeek: 5,
    status: "active",
    gates: [
      {
        metric: "アクティブユーザー率",
        target: "≥ 60%",
        current: "54%",
        ok: false,
      },
      { metric: "Coverage", target: "≥ 80%", current: "78%", ok: false },
      { metric: "クエリ単価", target: "≤ 5 円", current: "3.2 円", ok: true },
      { metric: "サポート問合せ率", target: "≤ 8%", current: "5.1%", ok: true },
    ],
  },
  {
    id: "ga",
    label: "General Availability",
    users: 9200,
    sites: 23,
    weeks: 12,
    startWeek: 11,
    status: "planned",
    gates: [
      { metric: "アクティブユーザー率", target: "≥ 50%" },
      { metric: "回答品質スコア", target: "≥ 85" },
      { metric: "MAU", target: "≥ 4,500" },
      { metric: "ROI", target: "黒字化" },
    ],
  },
];

interface CommSchedule {
  date: string;
  event: string;
  audience: string;
  channel: string;
}

const COMMS: CommSchedule[] = [
  {
    date: "Week 0",
    event: "経営層キックオフ",
    audience: "役員 / 部門長",
    channel: "対面 + 動画",
  },
  {
    date: "Week 1",
    event: "Pilot 参加者オンボーディング",
    audience: "Pilot 50 名",
    channel: "Zoom + ハンズオン",
  },
  {
    date: "Week 2",
    event: "中間レポート (経営層)",
    audience: "役員 / 情シス",
    channel: "Slack #ge-pilot",
  },
  {
    date: "Week 4",
    event: "Pilot 結果報告 + Limited 移行決議",
    audience: "全社",
    channel: "全社メール",
  },
  {
    date: "Week 6",
    event: "部門別トレーニング (5 拠点)",
    audience: "Limited 500 名",
    channel: "対面 + e-Learning",
  },
  {
    date: "Week 10",
    event: "GA 移行最終ゲート判定",
    audience: "役員",
    channel: "対面",
  },
  {
    date: "Week 12",
    event: "全社展開アナウンス",
    audience: "全社員",
    channel: "イントラ + 動画",
  },
];

interface Guideline {
  title: string;
  rule: string;
  tone: "do" | "dont";
}

const GUIDELINES: Guideline[] = [
  {
    title: "業務文書の検索・要約",
    rule: "社内 SharePoint / Drive 内の業務文書に対する質問は積極的に活用してください",
    tone: "do",
  },
  {
    title: "出典の確認",
    rule: "重要な意思決定には必ず引用元の原本も併せて確認してください",
    tone: "do",
  },
  {
    title: "誤回答の報告",
    rule: "明らかに間違った回答には 👎 をクリックし、コメント欄に正しい情報を添えてください",
    tone: "do",
  },
  {
    title: "機密情報の入力",
    rule: "個人情報・お客様情報・未公表数字を質問文に含めない (プロンプトインジェクション対策)",
    tone: "dont",
  },
  {
    title: "私的利用",
    rule: "業務外の質問・娯楽目的の利用は禁止 (利用ログは監査対象)",
    tone: "dont",
  },
  {
    title: "外部共有",
    rule: "AI 回答をそのまま外部 (顧客・取引先) へ転送しない。誤りが含まれる可能性",
    tone: "dont",
  },
];

export function Step23_ChangeMgmt() {
  const [tab, setTab] = useState<"phases" | "comms" | "guidelines">("phases");

  return (
    <GcpConsoleShell
      navHighlightId="ge"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["Gemini Enterprise", "Go-Live ランブック"]}
      title="チェンジマネジメント & Go-Live"
      description="技術が完成しても使われなければ価値ゼロ。Pilot → Limited → GA の段階展開計画と利用ガイドラインで定着を確実に。"
      actions={
        <>
          <GcpButton
            variant="outlined"
            size="sm"
            leadingIcon={<FileText size={12} />}
          >
            Runbook PDF
          </GcpButton>
          <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
            管理画面へ戻る
          </GcpButton>
        </>
      }
    >
      <div className="space-y-5">
        {/* Tabs */}
        <div className="border-b border-[#DADCE0] -mt-1">
          <div className="flex items-center gap-6 text-[13px]">
            <Tab
              icon={Rocket}
              label="段階展開フェーズ"
              active={tab === "phases"}
              onClick={() => setTab("phases")}
            />
            <Tab
              icon={Megaphone}
              label="コミュニケーション計画"
              active={tab === "comms"}
              onClick={() => setTab("comms")}
            />
            <Tab
              icon={FileText}
              label="利用ガイドライン"
              active={tab === "guidelines"}
              onClick={() => setTab("guidelines")}
            />
          </div>
        </div>

        {tab === "phases" && <PhasesPanel />}
        {tab === "comms" && <CommsPanel />}
        {tab === "guidelines" && <GuidelinesPanel />}
      </div>
    </GcpConsoleShell>
  );
}

function PhasesPanel() {
  return (
    <div className="space-y-5">
      {/* Roadmap visualization */}
      <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
        <div className="text-[14px] font-medium font-display mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-[#1A73E8]" />
          ロードマップ (Week 1-22)
        </div>
        <div className="space-y-3">
          {PHASES.map((p) => {
            const pct = (p.weeks / 22) * 100;
            const offset = ((p.startWeek - 1) / 22) * 100;
            return (
              <div key={p.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#202124] dark:text-white">
                      {p.label}
                    </span>
                    <GcpChip
                      tone={
                        p.status === "done"
                          ? "green"
                          : p.status === "active"
                            ? "blue"
                            : "neutral"
                      }
                    >
                      {p.status === "done"
                        ? "完了"
                        : p.status === "active"
                          ? "進行中"
                          : "計画"}
                    </GcpChip>
                  </div>
                  <span className="text-[#5F6368]">
                    {p.users.toLocaleString()} 名 · {p.sites} 拠点 · Week{" "}
                    {p.startWeek}〜{p.startWeek + p.weeks - 1}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#E8EAED] relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute h-full rounded-full",
                      p.status === "done"
                        ? "bg-[#34A853]"
                        : p.status === "active"
                          ? "bg-[#1A73E8]"
                          : "bg-[#DADCE0]",
                    )}
                    style={{ left: `${offset}%`, width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Phase gates */}
      <div className="grid lg:grid-cols-3 gap-3">
        {PHASES.map((p) => (
          <section
            key={p.id}
            className={cn(
              "rounded-lg border-2 bg-white dark:bg-[#1F1F1F] p-4",
              p.status === "done"
                ? "border-[#34A853]/40"
                : p.status === "active"
                  ? "border-[#1A73E8]/60 ring-2 ring-[#1A73E8]/15"
                  : "border-[#DADCE0]",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users
                  size={14}
                  className={
                    p.status === "done"
                      ? "text-[#137333]"
                      : p.status === "active"
                        ? "text-[#1A73E8]"
                        : "text-[#5F6368]"
                  }
                />
                <span className="text-[14px] font-medium font-display">
                  {p.label}
                </span>
              </div>
              <span className="text-[10px] text-[#5F6368]">
                {p.users.toLocaleString()} 名
              </span>
            </div>
            <div className="text-[10px] text-[#5F6368] uppercase tracking-wider mb-2">
              次フェーズ移行ゲート
            </div>
            <ul className="space-y-1.5">
              {p.gates.map((g, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[11px] leading-relaxed"
                >
                  {g.ok === undefined ? (
                    <span className="w-3 h-3 rounded-full border border-[#DADCE0] shrink-0" />
                  ) : g.ok ? (
                    <Check size={11} className="text-[#137333] shrink-0" />
                  ) : (
                    <AlertTriangle
                      size={11}
                      className="text-[#B26A00] shrink-0"
                    />
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="text-[#202124] dark:text-white">
                      {g.metric}
                    </span>
                    <span className="text-[#5F6368]"> {g.target}</span>
                  </span>
                  {g.current && (
                    <span
                      className={cn(
                        "font-bold tabular-nums",
                        g.ok ? "text-[#137333]" : "text-[#B26A00]",
                      )}
                    >
                      {g.current}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 text-[11px] leading-relaxed flex items-start gap-2">
        <AlertTriangle size={13} className="text-[#B26A00] mt-0.5 shrink-0" />
        <span>
          <strong>
            Limited Rollout のアクティブユーザー率が未達 (54% / 目標 60%)。
          </strong>{" "}
          原因分析が必要 —
          利用ガイドライン未読率、研修参加率、ユースケース不足のどれか？GA
          移行を 2 週間延期する判断もあり。
        </span>
      </div>
    </div>
  );
}

function CommsPanel() {
  return (
    <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[#DADCE0]">
        <div className="text-[13px] font-medium font-display flex items-center gap-2">
          <Megaphone size={14} className="text-[#1A73E8]" />
          社内コミュニケーション スケジュール
        </div>
      </div>
      <table className="w-full text-[12px]">
        <thead className="bg-[#F8F9FA] text-[#5F6368]">
          <tr>
            <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider w-24">
              タイミング
            </th>
            <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
              イベント
            </th>
            <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
              対象
            </th>
            <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
              チャンネル
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DADCE0]">
          {COMMS.map((c, i) => (
            <tr key={i}>
              <td className="px-4 py-2.5 font-mono text-[11px] text-[#5F6368]">
                {c.date}
              </td>
              <td className="px-4 py-2.5 font-medium">{c.event}</td>
              <td className="px-4 py-2.5 text-[#5F6368]">{c.audience}</td>
              <td className="px-4 py-2.5">
                <GcpChip tone="blue">{c.channel}</GcpChip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-[#DADCE0] bg-[#F8F9FA]/50 text-[11px] text-[#5F6368] leading-relaxed">
        <div className="flex items-center gap-1.5 mb-1 text-[#202124] font-medium">
          <GraduationCap size={12} className="text-[#1A73E8]" />{" "}
          トレーニング素材
        </div>
        基本操作動画 (3 分) / ハンズオン Notebook / ユースケース 30 選 / FAQ
        サイト を Week 1 までに公開。Pilot 参加者には Slack 専用チャンネル
        `#ge-pilot` で 24h 質問対応。
      </div>
    </section>
  );
}

function GuidelinesPanel() {
  const dos = GUIDELINES.filter((g) => g.tone === "do");
  const donts = GUIDELINES.filter((g) => g.tone === "dont");
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <section className="rounded-lg border-2 border-[#34A853]/40 bg-[#E6F4EA]/30 p-4">
        <div className="text-[14px] font-medium font-display text-[#137333] mb-3 flex items-center gap-2">
          <Check size={16} /> やってOK (Do)
        </div>
        <ul className="space-y-3">
          {dos.map((g, i) => (
            <li key={i}>
              <div className="text-[13px] font-medium text-[#202124] dark:text-white">
                {g.title}
              </div>
              <div className="text-[11px] text-[#5F6368] leading-relaxed mt-0.5">
                {g.rule}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border-2 border-[#EA4335]/40 bg-[#FCE8E6]/30 p-4">
        <div className="text-[14px] font-medium font-display text-[#D93025] mb-3 flex items-center gap-2">
          <AlertTriangle size={16} /> {"やってはいけない (Don't)"}
        </div>
        <ul className="space-y-3">
          {donts.map((g, i) => (
            <li key={i}>
              <div className="text-[13px] font-medium text-[#202124] dark:text-white">
                {g.title}
              </div>
              <div className="text-[11px] text-[#5F6368] leading-relaxed mt-0.5">
                {g.rule}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Tab({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 -mb-px pb-2.5 border-b-2 transition-colors",
        active
          ? "border-[#1A73E8] text-[#1A73E8] font-medium"
          : "border-transparent text-[#5F6368] hover:text-[#202124]",
      )}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
