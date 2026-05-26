"use client";

import { useEffect, useRef } from "react";

interface Options {
  /** 各アクション間の間隔 (ms) */
  intervalMs?: number;
  /** 最初のアクションまでの待機 (ms) */
  startDelayMs?: number;
  /** 動作を有効化するか (デフォルト true) */
  enabled?: boolean;
  /** ループ実行するか (デフォルト false) */
  loop?: boolean;
}

/**
 * ステップ画面マウント時に、アクション配列を時間差で実行するフック。
 * 「画面が自動で動く」演出を簡単に書けるようにする。
 */
export function useStepAutoSequence(
  actions: Array<() => void>,
  options: Options = {},
) {
  const {
    intervalMs = 1400,
    startDelayMs = 600,
    enabled = true,
    loop = false,
  } = options;

  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    if (!enabled || actionsRef.current.length === 0) return;
    let i = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const list = actionsRef.current;
      if (list.length === 0) return;
      if (i >= list.length) {
        if (loop) i = 0;
        else return;
      }
      list[i]();
      i++;
      timerId = setTimeout(tick, intervalMs);
    };

    timerId = setTimeout(tick, startDelayMs);

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [enabled, intervalMs, startDelayMs, loop]);
}
