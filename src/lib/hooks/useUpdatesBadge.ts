"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "gcp-updates-last-seen"
const UPDATE_HOUR = 9 // 毎朝9時に更新

/**
 * 最新アップデートの未読バッジを管理するフック
 * - 毎朝9時以降、ユーザーが未閲覧なら未読表示
 * - 閲覧後は同日中はバッジ非表示
 * - 翌日9時以降にリセット
 */
export function useUpdatesBadge() {
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY)
    const now = new Date()

    // 今日の更新時刻（9:00）
    const todayUpdate = new Date(now)
    todayUpdate.setHours(UPDATE_HOUR, 0, 0, 0)

    // 現在時刻が9時より前なら、昨日の9時を基準にする
    const latestUpdate = now < todayUpdate
      ? new Date(todayUpdate.getTime() - 24 * 60 * 60 * 1000)
      : todayUpdate

    if (!lastSeen || new Date(lastSeen) < latestUpdate) {
      setHasNew(true)
    }
  }, [])

  const markAsSeen = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    setHasNew(false)
  }, [])

  return { hasNew, markAsSeen }
}
