"use client";

import { motion } from "framer-motion";
import { MonitorPlay } from "lucide-react";
import { DemoFrame } from "@/components/google-enterprise/console-demo/DemoFrame";

export default function HandsOnPage() {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <MonitorPlay size={14} />
            <span className="font-semibold uppercase tracking-wider">
              Google Cloud · 導入デモ
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold leading-tight">
            Gemini Enterprise 導入の全工程をリアルに体感
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Google アカウント作成 → Cloud Identity → 組織 / Billing / API → WIF
            → サブスクリプション購入 → データストア → 検索デモまで 15
            ステップを実機画面で再現
          </p>
        </div>
      </motion.div>

      <DemoFrame />
    </div>
  );
}
