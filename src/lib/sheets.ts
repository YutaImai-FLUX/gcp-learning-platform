/**
 * Google Sheets データアクセス層
 * GAS (Google Apps Script) ウェブアプリ経由でスプレッドシートにアクセスする。
 *
 * 必要な環境変数:
 *   GAS_API_URL=https://script.google.com/macros/s/.../exec
 *
 * GAS URLが未設定の場合は空配列/nullを返す（モックデータにフォールバック）。
 */
import type { Project } from "@/lib/types/project"

const GAS_URL = process.env.GAS_API_URL ?? ""

// ─── GAS 呼び出しヘルパー ──────────────────────────────────────────────────────

async function gasGet<T>(action: string): Promise<T | null> {
  if (!GAS_URL) return null
  try {
    const res = await fetch(`${GAS_URL}?action=${action}`, {
      // GAS ウェブアプリはリダイレクトを返す場合があるため follow
      redirect: "follow",
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function gasPost<T>(body: Record<string, unknown>): Promise<T | null> {
  if (!GAS_URL) return null
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      redirect: "follow",
      // GAS doPost は Content-Type に依存しないが text/plain が安定
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const data = await gasGet<Project[]>("getProjects")
  return data ?? []
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt">
): Promise<Project | null> {
  return gasPost<Project>({ action: "createProject", project: data })
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  return gasPost<Project>({ action: "updateProject", id, updates })
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await gasPost<{ success: boolean }>({
    action: "deleteProject",
    id,
  })
  return res?.success ?? false
}
