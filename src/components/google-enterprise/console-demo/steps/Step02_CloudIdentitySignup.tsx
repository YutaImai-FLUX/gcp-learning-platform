"use client";

import { useState } from "react";
import { WorkspaceSignupShell } from "../shell/WorkspaceSignupShell";
import { GcpInput } from "../primitives/GcpInput";
import { GcpSelect } from "../primitives/GcpSelect";
import { GcpButton } from "../primitives/GcpButton";
import { GcpRadioGroup } from "../primitives/GcpRadio";
import { ShieldCheck } from "lucide-react";

export function Step02_CloudIdentitySignup() {
  const [companyName, setCompanyName] = useState("大和精機工業株式会社");
  const [employees, setEmployees] = useState("1000+");
  const [domain, setDomain] = useState("yamatoseiki.co.jp");
  const [country, setCountry] = useState("JP");
  const [plan, setPlan] = useState("free");
  return (
    <WorkspaceSignupShell
      step={2}
      totalSteps={4}
      stepLabel="ビジネス情報の入力"
      title="Cloud Identity でアイデンティティ管理を始めましょう"
      description="既存のドメインを使って、Google Cloud リソースを統制するための組織テナントを構築します。"
    >
      <div className="space-y-5 max-w-xl">
        <GcpInput
          label="会社名"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <GcpSelect
            label="従業員数"
            value={employees}
            onChange={setEmployees}
            options={[
              { value: "1-9", label: "1〜9 名" },
              { value: "10-99", label: "10〜99 名" },
              { value: "100-299", label: "100〜299 名" },
              { value: "300-999", label: "300〜999 名" },
              { value: "1000+", label: "1,000 名以上" },
            ]}
          />
          <GcpSelect
            label="国 / 地域"
            value={country}
            onChange={setCountry}
            options={[
              { value: "JP", label: "日本" },
              { value: "US", label: "アメリカ合衆国" },
              { value: "UK", label: "イギリス" },
            ]}
          />
        </div>
        <GcpInput
          label="所有しているカスタムドメイン"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          helperText="このドメインがそのままユーザーの メールアドレスのドメイン部分になります"
          required
        />
        <div>
          <div className="text-[12px] text-[#5F6368] mb-2 mt-2">
            プランの選択
          </div>
          <GcpRadioGroup
            value={plan}
            onChange={setPlan}
            options={[
              {
                value: "free",
                label: "Cloud Identity Free",
                description:
                  "無償。ユーザー上限あり。Google Cloud の組織機能はフル利用可能。",
              },
              {
                value: "premium",
                label: "Cloud Identity Premium ($6/user/月)",
                description:
                  "高度なセキュリティ機能 (Endpoint管理 / Vault連携) を含む。",
              },
            ]}
          />
        </div>
        <div className="rounded border-l-4 border-[#1A73E8] bg-[#E8F0FE] dark:bg-[#1A73E8]/10 px-3 py-2.5 flex gap-2">
          <ShieldCheck size={16} className="text-[#1A73E8] shrink-0 mt-0.5" />
          <p className="text-[12px] leading-relaxed text-[#202124] dark:text-white">
            次のステップで、このドメインに対する所有権を DNS の TXT
            レコードで証明します。DNS の編集権限を持つ担当者を準備してください。
          </p>
        </div>
        <div className="flex justify-end pt-2">
          <GcpButton variant="filled">次へ進む</GcpButton>
        </div>
      </div>
    </WorkspaceSignupShell>
  );
}
