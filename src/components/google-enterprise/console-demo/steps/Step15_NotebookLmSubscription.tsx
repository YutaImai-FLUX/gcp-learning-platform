"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import {
  BookOpen,
  Headphones,
  ChevronLeft,
  Check,
  Globe,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepAutoSequence } from "@/lib/hooks/useStepAutoSequence";

interface NbLmPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  audioOverview: boolean;
  recommended?: boolean;
}

const PLANS: NbLmPlan[] = [
  {
    id: "standard",
    name: "NotebookLM Enterprise",
    price: 20,
    audioOverview: false,
    features: [
      "ノートブック: 最大 1,000 / ユーザー",
      "1 ノートブックあたり最大 100 ソース",
      "PDF / Drive / SharePoint / Web 取込み",
      "Workforce Identity Federation 連携",
      "Audit Log / Access Transparency 対応",
    ],
  },
  {
    id: "plus",
    name: "NotebookLM Enterprise Plus",
    price: 35,
    audioOverview: true,
    features: [
      "Standard の全機能",
      "🎙 Audio Overview (ポッドキャスト風要約)",
      "多言語強化 (日 ⇆ 英 自動切替)",
      "高度な引用根拠 + ファクトチェック",
      "Premium サポート",
    ],
    recommended: true,
  },
];

const FX_JPY = 155;

export function Step15_NotebookLmSubscription() {
  const [planId, setPlanId] = useState<string>("standard");
  const [seats, setSeats] = useState(15);
  const [residency, setResidency] = useState<"asia-northeast1" | "global">(
    "global",
  );
  const [agreeTos, setAgreeTos] = useState(false);

  useStepAutoSequence(
    [
      // 1. ロケーションを日本に切替
      () => setResidency("asia-northeast1"),
      // 2. Plus へ切替 (Audio Overview 訴求)
      () => setPlanId("plus"),
      // 3. シート数を 15 → 30 と段階増
      () => setSeats(30),
      // 4. 規約同意
      () => setAgreeTos(true),
    ],
    { intervalMs: 1200, startDelayMs: 700 },
  );

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const monthlyJpy = plan.price * seats * FX_JPY;
  const annualJpy = monthlyJpy * 12;

  return (
    <GcpConsoleShell
      navHighlightId="vertex"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={[
        "Vertex AI",
        "NotebookLM Enterprise",
        "サブスクリプションの管理",
        "新規購入",
      ]}
      title="NotebookLM Enterprise サブスクリプションを購入"
      description="Gemini Enterprise (横断検索) とは別ライセンス。研究・調査・要約に特化した Notebook 型 AI を購入します。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          サブスクリプション一覧
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          {/* Plans */}
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
                      <BookOpen size={14} className="text-[#1A73E8]" />
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
                    {p.audioOverview && (
                      <div className="mt-3 pt-2 border-t border-[#DADCE0] flex items-center gap-1.5 text-[10px] text-[#1A73E8] font-medium">
                        <Headphones size={11} />
                        Audio Overview 利用可
                      </div>
                    )}
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
                max={300}
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
                      Math.max(1, Math.min(1000, Number(e.target.value))),
                    )
                  }
                  className="w-16 text-right text-[14px] outline-none bg-transparent"
                />
                <span className="text-[12px] text-[#5F6368]">名</span>
              </div>
            </div>
            <div className="text-[11px] text-[#5F6368] mt-2">
              法務・経営企画・R&D
              など「資料を構造化して深く読み込む業務」のメンバー想定で 10〜30
              名から開始がオススメ。
            </div>
          </Section>

          {/* Data residency */}
          <Section title="データレジデンシー">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setResidency("global")}
                className={cn(
                  "text-left rounded-lg border-2 p-3 transition-all",
                  residency === "global"
                    ? "border-[#1A73E8] bg-[#E8F0FE]/40"
                    : "border-[#DADCE0] hover:border-[#1A73E8]/40",
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Globe size={13} className="text-[#1A73E8]" />
                  <span className="text-[13px] font-medium">global</span>
                </div>
                <div className="text-[11px] text-[#5F6368]">
                  最も高機能。Audio Overview など全機能対応。
                </div>
              </button>
              <button
                onClick={() => setResidency("asia-northeast1")}
                className={cn(
                  "text-left rounded-lg border-2 p-3 transition-all",
                  residency === "asia-northeast1"
                    ? "border-[#34A853] bg-[#E6F4EA]/50"
                    : "border-[#DADCE0] hover:border-[#34A853]/40",
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Lock size={13} className="text-[#137333]" />
                  <span className="text-[13px] font-medium">
                    asia-northeast1 (東京)
                  </span>
                </div>
                <div className="text-[11px] text-[#5F6368]">
                  データ国内保管。金融・公共向け。一部機能制約あり。
                </div>
              </button>
            </div>
          </Section>

          {/* Billing */}
          <Section title="請求アカウント">
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-[#34A853]/40 bg-[#E6F4EA]">
              <div>
                <div className="text-[13px] font-medium">
                  ge-billing-primary
                </div>
                <div className="text-[11px] text-[#5F6368]">
                  JPY · リセラー請求書払い · GE と同じアカウント
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
                NotebookLM Enterprise 利用規約
              </span>{" "}
              と{" "}
              <span className="text-[#1A73E8] hover:underline">
                データ取扱い特約
              </span>{" "}
              に同意します。
            </span>
          </label>

          <div className="flex justify-end gap-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton
              variant="filled"
              disabled={!agreeTos}
              className={cn(
                agreeTos && "ring-4 ring-[#1A73E8]/30 animate-pulse",
              )}
            >
              {agreeTos ? "NotebookLM Enterprise を購入" : "規約への同意が必要"}
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

          {/* GE + NotebookLM total */}
          <div className="border-t border-[#DADCE0] pt-3">
            <div className="text-[10px] text-[#5F6368] uppercase tracking-wider mb-1">
              GE Standard (50 名) との合算
            </div>
            <div className="text-[12px] text-[#5F6368] flex items-center justify-between">
              <span>GE</span>
              <span className="tabular-nums">
                ¥{(30 * 50 * FX_JPY).toLocaleString()}
              </span>
            </div>
            <div className="text-[12px] text-[#5F6368] flex items-center justify-between">
              <span>NotebookLM</span>
              <span className="tabular-nums">
                ¥{monthlyJpy.toLocaleString()}
              </span>
            </div>
            <div className="text-[13px] font-medium text-[#202124] flex items-center justify-between mt-1 pt-1 border-t border-[#DADCE0]">
              <span>月額合計</span>
              <span className="tabular-nums">
                ¥{(30 * 50 * FX_JPY + monthlyJpy).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t border-[#DADCE0] pt-3 text-[11px] text-[#5F6368] leading-relaxed">
            GE と NotebookLM は別 SKU
            課金。両方使うユーザーには両方のシートが必要なため、対象ユーザー区分を
            Step 23 のチェンジマネジメントで明確化しましょう。
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
