"use client";

import { useState } from "react";
import { useStepAutoSequence } from "@/lib/hooks/useStepAutoSequence";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import { Sparkles, Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: number; // USD/seat/month
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "standard",
    name: "Gemini Enterprise Standard",
    price: 30,
    features: [
      "Gemini 1.5 Pro / 2.0 Flash モデル利用",
      "AI Application (Search / Chat) 標準セット",
      "Data Store (15 ソースまでコネクタ)",
      "Workforce Identity Federation 連携",
    ],
    recommended: true,
  },
  {
    id: "plus",
    name: "Gemini Enterprise Plus",
    price: 45,
    features: [
      "Standard の全機能",
      "Gemini 2.5 Pro / Live API",
      "高度な ACL / DLP 連携",
      "Premium サポート (24/7)",
    ],
  },
];

const FX_JPY = 155; // 仮の為替

export function Step10_GeSubscription() {
  const [planId, setPlanId] = useState<string>("plus");
  const [seats, setSeats] = useState(10);
  const [agreeTos, setAgreeTos] = useState(false);

  useStepAutoSequence(
    [
      // 1. Standard プランを選択
      () => setPlanId("standard"),
      // 2. シート数を 10 → 25 → 50 と段階的に増やす
      () => setSeats(25),
      () => setSeats(50),
      // 3. 利用規約に同意 (購入ボタンが有効化)
      () => setAgreeTos(true),
    ],
    { intervalMs: 1100, startDelayMs: 700 },
  );
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const monthlyJpy = plan.price * seats * FX_JPY;
  const annualJpy = monthlyJpy * 12;

  return (
    <GcpConsoleShell
      navHighlightId="ge"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["Gemini Enterprise", "サブスクリプションの管理", "新規購入"]}
      title="サブスクリプションを購入"
      description="Gemini Enterprise のシート単位ライセンスを購入します。Workforce Identity プールからログインしたユーザーに自動付与されます。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          サブスクリプション一覧へ戻る
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          {/* Plan cards */}
          <Section title="プランを選択">
            <div className="grid sm:grid-cols-2 gap-3">
              {PLANS.map((p) => {
                const selected = planId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={cn(
                      "text-left rounded-lg border-2 p-4 transition-all relative",
                      selected
                        ? "border-[#1A73E8] bg-[#E8F0FE]/40"
                        : "border-[#DADCE0] hover:border-[#1A73E8]/60",
                    )}
                  >
                    {p.recommended && (
                      <GcpChip tone="blue" className="absolute top-3 right-3">
                        推奨
                      </GcpChip>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-[#1A73E8]" />
                      <span className="text-[14px] font-medium font-display">
                        {p.name}
                      </span>
                    </div>
                    <div className="font-display">
                      <span className="text-[28px] font-bold text-[#202124] dark:text-white">
                        ${p.price}
                      </span>
                      <span className="text-[12px] text-[#5F6368] ml-1">
                        / seat / 月 (USD)
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {p.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-[11px] text-[#5F6368]"
                        >
                          <Check
                            size={11}
                            className="text-[#1A73E8] mt-0.5 shrink-0"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Seats */}
          <Section title="シート数 (利用ユーザー数)">
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="accent-[#1A73E8]"
              />
              <div className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#DADCE0]">
                <input
                  type="number"
                  value={seats}
                  onChange={(e) =>
                    setSeats(
                      Math.max(1, Math.min(2000, Number(e.target.value))),
                    )
                  }
                  className="w-16 text-right text-[14px] outline-none bg-transparent"
                />
                <span className="text-[12px] text-[#5F6368]">名</span>
              </div>
            </div>
            <div className="text-[11px] text-[#5F6368] mt-2">
              シートは後から追加可能。PoC では実利用者数の 80% 程度 (例: 50
              名想定なら 40 名) から開始するのがコスト最適です。
            </div>
          </Section>

          {/* Billing */}
          <Section title="請求アカウント">
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-[#34A853]/40 bg-[#E6F4EA]">
              <div>
                <div className="text-[13px] font-medium text-[#202124] dark:text-white">
                  ge-billing-primary
                </div>
                <div className="text-[11px] text-[#5F6368]">
                  JPY · リセラー請求書払い
                </div>
              </div>
              <GcpChip tone="green" icon={<Check size={10} />}>
                紐付け済み
              </GcpChip>
            </div>
          </Section>

          {/* TOS */}
          <label className="flex items-start gap-2 text-[12px] cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTos}
              onChange={(e) => setAgreeTos(e.target.checked)}
              className="accent-[#1A73E8] mt-0.5"
            />
            <span className="text-[#5F6368] leading-relaxed">
              <span className="text-[#1A73E8] hover:underline">
                Gemini Enterprise 利用規約
              </span>{" "}
              と{" "}
              <span className="text-[#1A73E8] hover:underline">
                サービス固有の条項
              </span>{" "}
              に同意します。
            </span>
          </label>

          <div className="flex justify-end gap-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton variant="filled" disabled={!agreeTos}>
              {agreeTos ? "サブスクリプションを購入" : "規約への同意が必要"}
            </GcpButton>
          </div>
        </div>

        {/* Right: cost estimate */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4 space-y-4">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white">
            費用試算 (参考値)
          </div>
          <div>
            <div className="text-[10px] text-[#5F6368] uppercase tracking-wider">
              月額
            </div>
            <div className="font-display text-[28px] font-bold text-[#202124] dark:text-white tabular-nums leading-tight">
              ¥{monthlyJpy.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#5F6368]">
              ${plan.price} × {seats} 名 × ¥{FX_JPY}/USD
            </div>
          </div>
          <div className="border-t border-[#DADCE0] pt-3">
            <div className="text-[10px] text-[#5F6368] uppercase tracking-wider">
              年額換算
            </div>
            <div className="font-display text-[18px] font-bold text-[#202124] dark:text-white tabular-nums">
              ¥{annualJpy.toLocaleString()}
            </div>
          </div>
          <div className="border-t border-[#DADCE0] pt-3 text-[11px] text-[#5F6368] leading-relaxed">
            為替レート ¥{FX_JPY}/USD
            で試算。実際の請求はリセラー側で確定。シート追加・削減は月割で計算。
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
