"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpInput } from "../primitives/GcpInput";
import { GcpSelect } from "../primitives/GcpSelect";
import { GcpButton } from "../primitives/GcpButton";
import { GcpRadioGroup } from "../primitives/GcpRadio";
import { GcpChip } from "../primitives/GcpChip";
import { ChevronLeft, CreditCard } from "lucide-react";

export function Step05_BillingCreate() {
  const [accountName, setAccountName] = useState("ge-billing-primary");
  const [country, setCountry] = useState("JP");
  const [currency, setCurrency] = useState("JPY");
  const [method, setMethod] = useState("reseller");

  return (
    <GcpConsoleShell
      navHighlightId="billing"
      projectLabel="プロジェクトを選択"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["お支払い", "アカウント管理", "請求アカウントを作成"]}
      title="請求アカウントを作成"
      description="Google Cloud のリソースに対する請求先を設定します。組織内の複数プロジェクトで共有できます。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          請求アカウント一覧へ戻る
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: form */}
        <div className="space-y-6">
          {/* Account name */}
          <Section title="基本情報">
            <GcpInput
              label="請求アカウント名"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              helperText="組織内で識別できる名前を付けます (例: prod-billing, ge-billing-primary)"
              required
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <GcpSelect
                label="国 / 地域"
                value={country}
                onChange={setCountry}
                options={[
                  { value: "JP", label: "日本" },
                  { value: "US", label: "アメリカ合衆国" },
                ]}
              />
              <GcpSelect
                label="通貨"
                value={currency}
                onChange={setCurrency}
                options={[
                  { value: "JPY", label: "JPY - 日本円" },
                  { value: "USD", label: "USD - 米ドル" },
                ]}
                helperText="作成後は変更できません"
              />
            </div>
          </Section>

          {/* Payment method */}
          <Section title="支払い方法">
            <GcpRadioGroup
              name="billing-method"
              value={method}
              onChange={setMethod}
              options={[
                {
                  value: "reseller",
                  label: "Google Cloud パートナー経由 (リセラー請求書払い)",
                  description:
                    "月次・日本円・請求書払い。エンタープライズ案件で最も多い。事前にパートナー契約が必要。",
                },
                {
                  value: "invoice",
                  label: "Google 直の銀行振替 (請求書払い)",
                  description: "事前申請が必要。審査に2週間程度。",
                },
                {
                  value: "card",
                  label: "クレジットカード / デビットカード",
                  description: "即時利用開始可能。検証や個人開発向け。",
                },
              ]}
            />
          </Section>

          {/* Tax */}
          <Section title="納税者情報">
            <GcpInput
              label="法人名 / 個人名"
              value="大和精機工業株式会社"
              onChange={() => {}}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <GcpInput
                label="法人番号"
                value="1234567890123"
                onChange={() => {}}
              />
              <GcpInput label="郵便番号" value="100-0005" onChange={() => {}} />
            </div>
          </Section>

          <div className="flex items-center justify-end gap-2 pt-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton variant="filled">送信して有効化</GcpButton>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white mb-3 flex items-center gap-2">
            <CreditCard size={14} className="text-[#1A73E8]" />
            アカウント概要
          </div>
          <dl className="text-[12px] space-y-2">
            <SummaryRow label="名前" value={accountName} />
            <SummaryRow
              label="国"
              value={country === "JP" ? "日本" : country}
            />
            <SummaryRow
              label="通貨"
              value={
                <>
                  {currency}
                  <GcpChip tone="yellow" className="ml-1.5">
                    変更不可
                  </GcpChip>
                </>
              }
            />
            <SummaryRow
              label="支払い方法"
              value={
                method === "reseller"
                  ? "リセラー請求書払い"
                  : method === "invoice"
                    ? "Google 直 請求書払い"
                    : "クレジットカード"
              }
            />
            <SummaryRow label="紐付け予定" value="プロジェクト未作成" muted />
          </dl>
          <div className="mt-3 text-[11px] text-[#5F6368] leading-relaxed border-t border-[#DADCE0] pt-3">
            送信後、組織配下の任意のプロジェクトにこの請求アカウントを紐付けて課金可能になります。
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

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <dt className="text-[#5F6368] shrink-0">{label}</dt>
      <dd
        className={`text-right ${muted ? "text-[#5F6368] italic" : "text-[#202124] dark:text-white font-medium"}`}
      >
        {value}
      </dd>
    </div>
  );
}
