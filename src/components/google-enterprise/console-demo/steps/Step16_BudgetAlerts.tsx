"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpInput } from "../primitives/GcpInput";
import { GcpSelect } from "../primitives/GcpSelect";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import {
  ChevronLeft,
  JapaneseYen,
  Bell,
  Plus,
  Mail,
  Radio as RadioIcon,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Threshold {
  pct: number;
  channels: string[];
}

export function Step16_BudgetAlerts() {
  const [name, setName] = useState("ge-monthly-budget");
  const [scope, setScope] = useState("billing-account");
  const [amount, setAmount] = useState(2000000); // 200 万円
  const [pubsubEnabled, setPubsubEnabled] = useState(true);
  const [thresholds] = useState<Threshold[]>([
    { pct: 50, channels: ["email"] },
    { pct: 90, channels: ["email", "pubsub"] },
    { pct: 100, channels: ["email", "pubsub", "slack"] },
    { pct: 120, channels: ["email", "pubsub", "slack", "phone"] },
  ]);

  return (
    <GcpConsoleShell
      navHighlightId="billing"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["お支払い", "予算とアラート", "予算を作成"]}
      title="予算を作成"
      description="月次の支出に対するしきい値アラートを設定。Pub/Sub 連携で Slack / Teams への自動通知も可能。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          予算一覧へ戻る
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* Scope */}
          <Section title="範囲">
            <div className="space-y-4">
              <GcpInput
                label="予算名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <GcpSelect
                label="対象"
                value={scope}
                onChange={setScope}
                options={[
                  {
                    value: "billing-account",
                    label: "請求アカウント全体 (ge-billing-primary)",
                  },
                  {
                    value: "project",
                    label: "プロジェクト: gemini-poc-prod",
                  },
                  { value: "label", label: "ラベル: env=poc" },
                ]}
                helperText="どの粒度で支出を計測するかを選ぶ。本番運用ではプロジェクトまたはラベル単位を推奨。"
              />
              <div>
                <div className="text-[11px] text-[#5F6368] mb-1">サービス</div>
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-[#DADCE0]">
                  <span className="text-[13px]">すべてのサービス (推奨)</span>
                  <button className="text-[12px] text-[#1A73E8] hover:underline">
                    変更
                  </button>
                </div>
              </div>
            </div>
          </Section>

          {/* Amount */}
          <Section title="金額">
            <div className="space-y-3">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <div className="text-[11px] text-[#5F6368] mb-1">
                    予算額 (月額)
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded border border-[#DADCE0]">
                    <JapaneseYen size={16} className="text-[#5F6368]" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) =>
                        setAmount(Math.max(0, Number(e.target.value)))
                      }
                      className="flex-1 text-[20px] font-display tabular-nums bg-transparent outline-none"
                    />
                    <span className="text-[12px] text-[#5F6368]">JPY</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-[#5F6368]">
                {amount.toLocaleString()} 円 / 月 (年額{" "}
                {(amount * 12).toLocaleString()} 円)
              </div>
              <div className="rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertTriangle
                  size={13}
                  className="text-[#B26A00] mt-0.5 shrink-0"
                />
                <span>
                  予算アラートは「通知」のみで、実際の課金は自動停止されません。停止が必要な場合は
                  Pub/Sub → Cloud Functions で `gcloud billing projects unlink`
                  を呼ぶ自動化を実装します。
                </span>
              </div>
            </div>
          </Section>

          {/* Thresholds */}
          <Section title="アラートしきい値">
            <div className="rounded border border-[#DADCE0] divide-y divide-[#DADCE0] overflow-hidden">
              <div className="grid grid-cols-12 px-3 py-2 bg-[#F8F9FA] text-[10px] font-medium text-[#5F6368] uppercase tracking-wider">
                <div className="col-span-2">しきい値</div>
                <div className="col-span-3">金額</div>
                <div className="col-span-5">通知先</div>
                <div className="col-span-2 text-right">アクション</div>
              </div>
              {thresholds.map((t) => (
                <div
                  key={t.pct}
                  className={cn(
                    "grid grid-cols-12 px-3 py-2.5 items-center text-[12px]",
                    t.pct >= 100 && "bg-[#FCE8E6]/30",
                  )}
                >
                  <div className="col-span-2 flex items-center gap-1.5">
                    <Bell
                      size={12}
                      className={
                        t.pct >= 100 ? "text-[#D93025]" : "text-[#1A73E8]"
                      }
                    />
                    <span className="font-mono font-bold">{t.pct}%</span>
                  </div>
                  <div className="col-span-3 font-mono tabular-nums">
                    ¥{((amount * t.pct) / 100).toLocaleString()}
                  </div>
                  <div className="col-span-5 flex items-center gap-1 flex-wrap">
                    {t.channels.map((c) => (
                      <GcpChip
                        key={c}
                        tone={
                          c === "phone"
                            ? "red"
                            : c === "slack"
                              ? "blue"
                              : "neutral"
                        }
                      >
                        {c}
                      </GcpChip>
                    ))}
                  </div>
                  <div className="col-span-2 text-right">
                    <button className="text-[12px] text-[#1A73E8] hover:underline">
                      編集
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-2 text-[12px] text-[#1A73E8] font-medium hover:underline flex items-center gap-1">
              <Plus size={12} />
              しきい値を追加
            </button>
          </Section>

          {/* Notification channels */}
          <Section title="通知チャンネル">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-3 rounded border border-[#DADCE0]">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#1A73E8]" />
                  <div>
                    <div className="text-[13px] font-medium">メール通知</div>
                    <div className="text-[11px] text-[#5F6368]">
                      admin@yamatoseiki.co.jp, finance@yamatoseiki.co.jp
                    </div>
                  </div>
                </div>
                <GcpChip tone="green">有効</GcpChip>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded border border-[#1A73E8]/30 bg-[#E8F0FE]/40">
                <div className="flex items-center gap-2">
                  <RadioIcon size={14} className="text-[#1A73E8]" />
                  <div>
                    <div className="text-[13px] font-medium">
                      Pub/Sub 連携 (Slack / Teams / 自動化)
                    </div>
                    <div className="text-[11px] text-[#5F6368]">
                      topic: projects/gemini-poc-prod/topics/budget-alerts
                    </div>
                  </div>
                </div>
                <GcpToggle
                  checked={pubsubEnabled}
                  onChange={setPubsubEnabled}
                />
              </div>
            </div>
          </Section>

          <div className="flex justify-end gap-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton variant="filled">予算を作成</GcpButton>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4 space-y-3">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white">
            プレビュー: 通知タイムライン
          </div>
          <ol className="space-y-2 text-[11px]">
            {thresholds.map((t) => {
              const amt = (amount * t.pct) / 100;
              return (
                <li
                  key={t.pct}
                  className="flex items-start gap-2 pb-2 border-b border-[#DADCE0] last:border-b-0"
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                      t.pct >= 100 ? "bg-[#D93025]" : "bg-[#1A73E8]",
                    )}
                  />
                  <div className="min-w-0">
                    <div className="font-medium tabular-nums">
                      {t.pct}% 到達 → ¥{amt.toLocaleString()}
                    </div>
                    <div className="text-[#5F6368]">
                      {t.channels.length} チャンネルへ通知
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="border-t border-[#DADCE0] pt-3 text-[10px] text-[#5F6368] leading-relaxed">
            120% は警告色で表示されます。実機では Cloud Monitoring の
            `billing/budget/used_amount` メトリクスとも連動可能。
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
