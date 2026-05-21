"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpInput } from "../primitives/GcpInput";
import { GcpButton } from "../primitives/GcpButton";
import { GcpRadioGroup } from "../primitives/GcpRadio";
import { Check, AlertTriangle, ChevronLeft, FileCode2 } from "lucide-react";

export function Step09_ProviderAdd() {
  const [protocol, setProtocol] = useState<"saml" | "oidc">("saml");
  const [providerId, setProviderId] = useState("entra-idp");
  const [providerName, setProviderName] = useState("Microsoft Entra ID");
  const [metadata, setMetadata] = useState(
    "https://login.microsoftonline.com/12345678-90ab-cdef-1234-567890abcdef/federationmetadata/2007-06/federationmetadata.xml",
  );
  const [subjectExpr, setSubjectExpr] = useState(
    "assertion.email.toLowerCase()",
  );
  const [groupsExpr, setGroupsExpr] = useState("assertion.groups");

  const subjectOk =
    /\.toLowerCase\s*\(\s*\)/.test(subjectExpr) &&
    /assertion\.email/.test(subjectExpr);
  const groupsOk = /^assertion\.groups$/.test(groupsExpr.trim());

  return (
    <GcpConsoleShell
      navHighlightId="iam"
      projectLabel="組織レベル"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={[
        "IAM と管理",
        "ID フェデレーション",
        "wif-employees-pool",
        "プロバイダの追加",
      ]}
      title="プロバイダの追加: Microsoft Entra ID"
      description="外部 IdP からの認証アサーションを Google Cloud の Subject にマッピングします。ここの設計が ACL 評価の正確性を決めます。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          プール詳細へ戻る
        </GcpButton>
      }
    >
      <div className="space-y-5">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-[12px]">
          <span className="w-6 h-6 rounded-full bg-[#34A853] text-white flex items-center justify-center">
            <Check size={12} />
          </span>
          <span className="text-[#5F6368]">1. プール設定 (完了)</span>
          <span className="text-[#5F6368]">›</span>
          <span className="w-6 h-6 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-medium">
            2
          </span>
          <span className="text-[#202124] dark:text-white font-medium">
            プロバイダの追加
          </span>
        </div>

        {/* Protocol selection */}
        <Section title="プロトコルの選択">
          <GcpRadioGroup
            value={protocol}
            onChange={(v) => setProtocol(v as "saml" | "oidc")}
            options={[
              {
                value: "saml",
                label: "SAML 2.0",
                description:
                  "Entra ID / Okta / Ping の Enterprise SSO で最も一般的。証跡管理が容易。",
              },
              {
                value: "oidc",
                label: "OpenID Connect (OIDC)",
                description:
                  "モダンな OAuth ベース。Ping や独自 IdP で推奨されることがある。",
              },
            ]}
          />
        </Section>

        {/* Provider info */}
        <Section title="プロバイダ情報">
          <div className="grid grid-cols-2 gap-4">
            <GcpInput
              label="プロバイダ ID"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              helperText="プール内で一意。作成後変更不可。"
              required
            />
            <GcpInput
              label="表示名"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <GcpInput
              label={
                protocol === "saml"
                  ? "SAML メタデータ URL または XML"
                  : "OIDC Discovery エンドポイント"
              }
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              helperText={
                protocol === "saml"
                  ? "Azure Portal > エンタープライズアプリ > シングルサインオン > フェデレーション メタデータ XML"
                  : "{issuer}/.well-known/openid-configuration"
              }
              required
            />
          </div>
        </Section>

        {/* Attribute mapping */}
        <Section title="属性マッピング (CEL 式)">
          <div className="rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 mb-4 flex items-start gap-2 text-[12px] leading-relaxed">
            <AlertTriangle
              size={14}
              className="text-[#B26A00] mt-0.5 shrink-0"
            />
            <div>
              <strong>google.subject</strong>{" "}
              はユーザー一意識別子の必須属性。SharePoint 等 ACL
              が小文字メール定義のとき、
              <code className="font-mono px-1 bg-white rounded">
                .toLowerCase()
              </code>{" "}
              を必ず適用してください（Entra の UPN は大文字混在しがち）。
            </div>
          </div>
          <div className="space-y-3">
            <CelField
              key="subject"
              label="google.subject (必須)"
              value={subjectExpr}
              onChange={setSubjectExpr}
              ok={subjectOk}
              okMsg="✓ メール小文字化が適用されています"
              ngMsg="assertion.email.toLowerCase() の形で記述してください"
            />
            <CelField
              key="groups"
              label="google.groups (任意 - ACL継承用)"
              value={groupsExpr}
              onChange={setGroupsExpr}
              ok={groupsOk}
              okMsg="✓ グループクレームをそのまま渡します"
              ngMsg="assertion.groups と入力してください"
            />
          </div>
          {/* Add row button */}
          <button className="mt-3 text-[12px] text-[#1A73E8] hover:underline font-medium">
            + 属性を追加
          </button>
        </Section>

        {/* Assertion sample */}
        <Section title="期待されるアサーション (参考)">
          <div className="rounded border border-[#DADCE0] overflow-hidden">
            <div className="px-3 py-2 bg-[#F8F9FA] dark:bg-[#28292C] border-b border-[#DADCE0] flex items-center gap-2 text-[12px]">
              <FileCode2 size={13} className="text-[#1A73E8]" />
              <span className="font-mono">SAML Assertion (抜粋)</span>
            </div>
            <pre className="px-3 py-3 text-[11px] font-mono leading-relaxed bg-[#0D1117] text-[#C9D1D9] overflow-x-auto">{`<saml:Subject>
  <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
    User.Name@yamatoseiki.co.jp
  </saml:NameID>
</saml:Subject>
<saml:AttributeStatement>
  <saml:Attribute Name="email">
    <saml:AttributeValue>User.Name@yamatoseiki.co.jp</saml:AttributeValue>
  </saml:Attribute>
  <saml:Attribute Name="groups">
    <saml:AttributeValue>SalesTeam</saml:AttributeValue>
    <saml:AttributeValue>Engineering</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>`}</pre>
          </div>
        </Section>

        <div className="flex justify-end gap-2">
          <GcpButton variant="text">キャンセル</GcpButton>
          <GcpButton variant="outlined">下書き保存</GcpButton>
          <GcpButton variant="filled" disabled={!subjectOk}>
            保存
          </GcpButton>
        </div>

        <ValidationBanner ok={subjectOk && groupsOk} />
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

function CelField({
  label,
  value,
  onChange,
  ok,
  okMsg,
  ngMsg,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ok: boolean;
  okMsg: string;
  ngMsg: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="px-3 py-2 rounded border border-[#DADCE0] bg-[#F8F9FA] text-[12px] font-medium text-[#202124] flex items-center">
          {label}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`px-3 py-2 rounded border bg-white text-[12px] font-mono text-[#202124] focus:outline-none focus:ring-1 ${
            ok
              ? "border-[#34A853] focus:border-[#34A853] focus:ring-[#34A853]"
              : "border-[#EA4335] focus:border-[#EA4335] focus:ring-[#EA4335]"
          }`}
        />
      </div>
      <div
        className={`mt-1 text-[11px] flex items-center gap-1 ${
          ok ? "text-[#137333]" : "text-[#D93025]"
        }`}
      >
        {ok ? <Check size={11} /> : <AlertTriangle size={11} />}
        {ok ? okMsg : ngMsg}
      </div>
    </div>
  );
}

function ValidationBanner({ ok }: { ok: boolean }) {
  if (ok) {
    return (
      <div className="rounded border border-[#34A853]/40 bg-[#E6F4EA] px-3 py-2.5 flex items-start gap-2 text-[12px]">
        <Check size={14} className="text-[#137333] mt-0.5 shrink-0" />
        <div>
          すべての必須項目が正しく設定されています。「保存」を押すとプロバイダが追加され、テストユーザーで
          SSO 検証ができる状態になります。
        </div>
      </div>
    );
  }
  return (
    <div className="rounded border border-[#EA4335]/40 bg-[#FCE8E6] px-3 py-2.5 flex items-start gap-2 text-[12px]">
      <AlertTriangle size={14} className="text-[#D93025] mt-0.5 shrink-0" />
      <div>
        属性マッピングに問題があります。
        <code className="font-mono px-1 bg-white rounded">.toLowerCase()</code>{" "}
        の省略は、Phase 5 で「ファイルが見つからない / 全部見える」障害の原因
        No.1 です。必ず修正してください。
      </div>
    </div>
  );
}
