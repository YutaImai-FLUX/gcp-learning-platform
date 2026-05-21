"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpInput } from "../primitives/GcpInput";
import { GcpSelect } from "../primitives/GcpSelect";
import { GcpChip } from "../primitives/GcpChip";
import {
  Search,
  MessageSquare,
  Bot,
  ChevronLeft,
  Check,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AppType = "search" | "chat" | "agentic";

export function Step12_AiAppCreate() {
  const [appType, setAppType] = useState<AppType>("search");
  const [appName, setAppName] = useState("internal-knowledge-search");
  const [displayName, setDisplayName] = useState("社内ナレッジ検索");
  const [location, setLocation] = useState("global");
  const [authBound, setAuthBound] = useState(true);

  return (
    <GcpConsoleShell
      navHighlightId="ai-app"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["AI Application", "アプリ", "新しいアプリ"]}
      title="新しいアプリ"
      description="エンドユーザーが Gemini Enterprise を実際に使う UI を作成します。データストアは次のステップで作成・紐付けます。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          アプリ一覧へ戻る
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* App type */}
          <Section title="アプリのタイプを選択">
            <div className="grid sm:grid-cols-3 gap-3">
              <TypeCard
                active={appType === "search"}
                onClick={() => setAppType("search")}
                icon={Search}
                title="Search"
                description="RAG ベースの検索 UI。質問に対して引用付きで AI 回答。"
                color="#1A73E8"
              />
              <TypeCard
                active={appType === "chat"}
                onClick={() => setAppType("chat")}
                icon={MessageSquare}
                title="Chat"
                description="マルチターン対話 UI。会話履歴・コンテキスト保持。"
                color="#34A853"
              />
              <TypeCard
                active={appType === "agentic"}
                onClick={() => setAppType("agentic")}
                icon={Bot}
                title="Agentic"
                description="エージェント自律実行型。外部 Tool 呼び出しが可能。"
                color="#9333EA"
                experimental
              />
            </div>
          </Section>

          {/* Basic settings */}
          <Section title="アプリ名と基本情報">
            <div className="grid grid-cols-2 gap-4">
              <GcpInput
                label="アプリ ID"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                helperText="API / URL で使用。作成後変更不可。"
                required
              />
              <GcpInput
                label="表示名"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <GcpSelect
                label="ロケーション"
                value={location}
                onChange={setLocation}
                options={[
                  { value: "global", label: "global (世界共通)" },
                  { value: "us", label: "us (米国)" },
                  { value: "eu", label: "eu (欧州)" },
                ]}
                helperText="データストアと同じロケーションを推奨。作成後変更不可。"
              />
            </div>
          </Section>

          {/* Authentication */}
          <Section title="認証プロバイダ (必須)">
            <div className="rounded-md border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2.5 mb-3 text-[12px] leading-relaxed flex items-start gap-2">
              <ShieldCheck
                size={14}
                className="text-[#B26A00] mt-0.5 shrink-0"
              />
              <span>
                認証プロバイダを紐付けないと、デフォルトの Google
                アカウント認証になり、組織外ユーザーがアクセスできる状態になります。必ず
                Workforce プールを紐付けてください。
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded border border-[#34A853]/40 bg-[#E6F4EA]">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck size={16} className="text-[#137333]" />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium font-mono text-[#202124] dark:text-white">
                    wif-employees-pool
                  </div>
                  <div className="text-[11px] text-[#5F6368] truncate">
                    Microsoft Entra ID 連携 · 自動割当 ON
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {authBound ? (
                  <GcpChip tone="green" icon={<Check size={10} />}>
                    紐付け済み
                  </GcpChip>
                ) : (
                  <GcpChip tone="red">未紐付け</GcpChip>
                )}
                <GcpButton
                  variant="text"
                  size="sm"
                  onClick={() => setAuthBound((v) => !v)}
                >
                  {authBound ? "解除" : "紐付ける"}
                </GcpButton>
              </div>
            </div>
          </Section>

          <div className="flex justify-end gap-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton variant="filled" disabled={!authBound}>
              作成
            </GcpButton>
          </div>
        </div>

        {/* Right summary */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4 space-y-3">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white">
            プレビュー URL (作成後)
          </div>
          <code className="block text-[10px] font-mono text-[#1A73E8] break-all bg-white dark:bg-[#1F1F1F] px-2 py-1.5 rounded border border-[#DADCE0]">
            {appName}.app.gemini.cloud.google.com
          </code>
          <div className="border-t border-[#DADCE0] pt-3 space-y-1.5 text-[11px]">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[#5F6368]">タイプ</span>
              <span className="font-medium">{appType}</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[#5F6368]">場所</span>
              <span className="font-medium">{location}</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[#5F6368]">認証</span>
              <span className="font-medium">
                {authBound ? "WIF 経由" : "未設定"}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[#5F6368]">データストア</span>
              <span className="text-[#5F6368] italic">次のステップで作成</span>
            </div>
          </div>
        </aside>
      </div>
    </GcpConsoleShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
      <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white mb-4">
        {title}
      </div>
      {children}
    </section>
  );
}

function TypeCard({
  active,
  onClick,
  icon: Icon,
  title,
  description,
  color,
  experimental,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  experimental?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left rounded-lg border-2 p-4 transition-all relative",
        active
          ? "border-[#1A73E8] bg-[#E8F0FE]/40"
          : "border-[#DADCE0] hover:border-[#1A73E8]/40",
      )}
    >
      {experimental && (
        <GcpChip tone="yellow" className="absolute top-3 right-3">
          実験的
        </GcpChip>
      )}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white mb-2"
        style={{ backgroundColor: color }}
      >
        <Icon size={18} />
      </div>
      <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white">
        {title}
      </div>
      <p className="text-[11px] text-[#5F6368] mt-1 leading-relaxed">
        {description}
      </p>
    </button>
  );
}
