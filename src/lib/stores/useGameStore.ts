"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GameStore, GameState, CertProgressExtended, GameNotification } from "./types"
import type { CertificationId } from "@/lib/types/quiz"
import { levelFromXP, XP_REWARDS } from "@/lib/game/xp-config"
import { todayString, updateStreak, updateActivityLog, streakBonusXP, generateNotificationId } from "@/lib/game/xp-utils"
import { ACHIEVEMENTS } from "@/lib/game/achievements"

const INITIAL_STATE: GameState = {
  version: 1,
  profile: null,
  xp: 0,
  level: 1,
  certProgress: {},
  activityLog: [],
  streaks: { currentStreak: 0, longestStreak: 0, lastActiveDate: "" },
  unlockedAchievements: [],
  quizHistory: [],
  demoCompletions: {},
  dungeonProgress: {},
  notifications: [],
  lastActiveAt: Date.now(),
  createdAt: Date.now(),
}

function ensureCertProgress(state: GameState, certId: CertificationId): CertProgressExtended {
  return state.certProgress[certId] ?? {
    certId,
    completedModuleSectionIds: [],
    completedLabIds: [],
    completedLabStepIds: [],
    quizHighScore: 0,
    quizAttempts: 0,
    domainScores: {},
    lastStudiedAt: Date.now(),
  }
}

function pushNotification(
  notifications: GameNotification[],
  type: GameNotification["type"],
  payload: GameNotification["payload"]
): GameNotification[] {
  const maxNotifications = 10
  const notif: GameNotification = {
    id: generateNotificationId(),
    type,
    payload,
    timestamp: Date.now(),
  }
  const updated = [...notifications, notif]
  return updated.length > maxNotifications ? updated.slice(-maxNotifications) : updated
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      addXP: (amount, _source) => {
        const state = get()
        const today = todayString()
        const newStreaks = updateStreak(state.streaks, today)
        const bonus = newStreaks.currentStreak > state.streaks.currentStreak
          ? streakBonusXP(newStreaks.currentStreak)
          : 0
        const totalGain = amount + bonus
        const newXP = state.xp + totalGain
        const newLevel = levelFromXP(newXP)
        const oldLevel = state.level

        let notifications = pushNotification(state.notifications, "xp", { xp: totalGain })

        if (newLevel > oldLevel) {
          notifications = pushNotification(notifications, "level_up", { level: newLevel })
        }

        if (bonus > 0 && newStreaks.currentStreak > state.streaks.currentStreak) {
          notifications = pushNotification(notifications, "streak", { streakDays: newStreaks.currentStreak })
        }

        set({
          xp: newXP,
          level: newLevel,
          streaks: newStreaks,
          activityLog: updateActivityLog(state.activityLog, totalGain),
          notifications,
          lastActiveAt: Date.now(),
        })

        // Check achievements after state update
        setTimeout(() => get().checkAndUnlockAchievements(), 0)
      },

      completeModuleSection: (certId, sectionId) => {
        const state = get()
        const cp = ensureCertProgress(state, certId)
        if (cp.completedModuleSectionIds.includes(sectionId)) return

        set({
          certProgress: {
            ...state.certProgress,
            [certId]: {
              ...cp,
              completedModuleSectionIds: [...cp.completedModuleSectionIds, sectionId],
              lastStudiedAt: Date.now(),
            },
          },
        })
        get().addXP(XP_REWARDS.moduleSectionComplete, "module")
      },

      completeLab: (certId, labId) => {
        const state = get()
        const cp = ensureCertProgress(state, certId)
        if (cp.completedLabIds.includes(labId)) return

        set({
          certProgress: {
            ...state.certProgress,
            [certId]: {
              ...cp,
              completedLabIds: [...cp.completedLabIds, labId],
              lastStudiedAt: Date.now(),
            },
          },
        })
        get().addXP(XP_REWARDS.labFullComplete, "lab")
      },

      completeLabStep: (certId, stepId) => {
        const state = get()
        const cp = ensureCertProgress(state, certId)
        if (cp.completedLabStepIds.includes(stepId)) return

        set({
          certProgress: {
            ...state.certProgress,
            [certId]: {
              ...cp,
              completedLabStepIds: [...cp.completedLabStepIds, stepId],
              lastStudiedAt: Date.now(),
            },
          },
        })
        get().addXP(XP_REWARDS.labStepComplete, "lab-step")
      },

      updateQuizScore: (certId, score, domainScores) => {
        const state = get()
        const cp = ensureCertProgress(state, certId)

        set({
          certProgress: {
            ...state.certProgress,
            [certId]: {
              ...cp,
              quizHighScore: Math.max(cp.quizHighScore, score),
              quizAttempts: cp.quizAttempts + 1,
              domainScores: { ...cp.domainScores, ...domainScores },
              lastStudiedAt: Date.now(),
            },
          },
        })
      },

      addQuizAttempt: (attempt) => {
        const state = get()
        set({
          quizHistory: [
            ...state.quizHistory,
            { ...attempt, timestamp: Date.now() },
          ],
        })
      },

      trackDemoInteraction: (demoId) => {
        const state = get()
        const existing = state.demoCompletions[demoId]

        if (existing) {
          set({
            demoCompletions: {
              ...state.demoCompletions,
              [demoId]: { ...existing, interactionCount: existing.interactionCount + 1 },
            },
          })
          return
        }

        set({
          demoCompletions: {
            ...state.demoCompletions,
            [demoId]: {
              demoId,
              firstInteractionAt: Date.now(),
              interactionCount: 1,
              challengeCompleted: false,
            },
          },
        })
        get().addXP(XP_REWARDS.demoFirstInteraction, "demo")
      },

      clearDungeonRoom: (certId, roomId, score) => {
        const state = get()
        if (state.dungeonProgress[roomId]?.cleared) return

        set({
          dungeonProgress: {
            ...state.dungeonProgress,
            [roomId]: {
              roomId,
              certId,
              cleared: true,
              clearedAt: Date.now(),
              bestScore: score,
            },
          },
        })
      },

      recordActivity: (xpEarned) => {
        const state = get()
        set({
          activityLog: updateActivityLog(state.activityLog, xpEarned),
          lastActiveAt: Date.now(),
        })
      },

      checkAndUnlockAchievements: () => {
        const state = get()
        const newUnlocks: string[] = []

        for (const achievement of ACHIEVEMENTS) {
          if (state.unlockedAchievements.includes(achievement.id)) continue
          if (achievement.condition(state)) {
            newUnlocks.push(achievement.id)
          }
        }

        if (newUnlocks.length === 0) return

        let notifications = state.notifications
        for (const id of newUnlocks) {
          notifications = pushNotification(notifications, "achievement", { achievementId: id })
        }

        set({
          unlockedAchievements: [...state.unlockedAchievements, ...newUnlocks],
          notifications,
        })

        // Add XP for each achievement
        const totalAchievementXP = newUnlocks.reduce((sum, id) => {
          const a = ACHIEVEMENTS.find((x) => x.id === id)
          return sum + (a?.xpReward ?? 0)
        }, 0)

        if (totalAchievementXP > 0) {
          const current = get()
          const newXP = current.xp + totalAchievementXP
          set({ xp: newXP, level: levelFromXP(newXP) })
        }
      },

      dismissNotification: (id) => {
        set({ notifications: get().notifications.filter((n) => n.id !== id) })
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      setProfile: (profile) => {
        set({ profile })
      },

      resetAll: () => {
        set({ ...INITIAL_STATE, createdAt: Date.now() })
      },
    }),
    {
      name: "gcp_study_progress_v1",
      partialize: (state) => ({
        version: state.version,
        profile: state.profile,
        xp: state.xp,
        level: state.level,
        certProgress: state.certProgress,
        activityLog: state.activityLog,
        streaks: state.streaks,
        unlockedAchievements: state.unlockedAchievements,
        quizHistory: state.quizHistory,
        demoCompletions: state.demoCompletions,
        dungeonProgress: state.dungeonProgress,
        lastActiveAt: state.lastActiveAt,
        createdAt: state.createdAt,
      }),
    }
  )
)
