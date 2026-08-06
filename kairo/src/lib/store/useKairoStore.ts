import { create } from "zustand";
import { Mission, Progress, Step } from "@/lib/types";
import {
  getActiveMission,
  saveMission as persistMission,
} from "@/lib/storage/missions";
import {
  getProgress,
  saveProgress as persistProgress,
} from "@/lib/storage/progress";
import {
  calculateLevel,
  xpForCompletingStep,
  xpForCompletingMission,
  calculateUpdatedStreak,
} from "@/lib/xp";
import { Achievement, checkNewAchievements } from "@/lib/achievements";

interface KairoState {
  activeMission: Mission | null;
  progress: Progress;
  lastUnlockedAchievement: Achievement | null;

  loadFromStorage: () => void;
  setActiveMission: (mission: Mission) => void;
  completeStep: (stepId: string) => void;
  completeMission: () => void;
  clearLastUnlockedAchievement: () => void;
}

export const useKairoStore = create<KairoState>((set, get) => ({
  activeMission: null,
  progress: getProgress(),
  lastUnlockedAchievement: null,

  loadFromStorage: () => {
    set({
      activeMission: getActiveMission(),
      progress: getProgress(),
    });
  },

  setActiveMission: (mission: Mission) => {
    persistMission(mission);
    set({ activeMission: mission });
  },

  completeStep: (stepId: string) => {
    const mission = get().activeMission;
    if (!mission) return;

    const updatedSteps: Step[] = mission.steps.map((s) =>
      s.id === stepId ? { ...s, completed: true } : s
    );

    const allCompleted = updatedSteps.every((s) => s.completed);
    const nextIndex = updatedSteps.findIndex((s) => !s.completed);

    const updatedMission: Mission = {
      ...mission,
      steps: updatedSteps,
      currentStepIndex: allCompleted ? mission.currentStepIndex : nextIndex,
      completedAt: allCompleted ? new Date().toISOString() : null,
    };

    const currentProgress = get().progress;
    const newXp = currentProgress.xp + xpForCompletingStep();
    const updatedProgress: Progress = {
      ...currentProgress,
      xp: newXp,
      level: calculateLevel(newXp),
    };

    persistMission(updatedMission);
    persistProgress(updatedProgress);

    set({ activeMission: updatedMission, progress: updatedProgress });
  },

  completeMission: () => {
    const mission = get().activeMission;
    const currentProgress = get().progress;
    if (!mission) return;

    const newXp = currentProgress.xp + xpForCompletingMission();
    const today = new Date().toISOString();
    const newStreak = calculateUpdatedStreak(
      currentProgress.lastActiveDate,
      currentProgress.currentStreak
    );
    const newTotalMissions = currentProgress.totalMissionsCompleted + 1;

    const newlyUnlocked = checkNewAchievements(
      newTotalMissions,
      newStreak,
      currentProgress.achievements
    );

    const updatedProgress: Progress = {
      ...currentProgress,
      xp: newXp,
      level: calculateLevel(newXp),
      totalMissionsCompleted: newTotalMissions,
      totalFocusMinutes:
        currentProgress.totalFocusMinutes + mission.estimatedTotalMinutes,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentProgress.longestStreak),
      lastActiveDate: today,
      achievements: [
        ...currentProgress.achievements,
        ...newlyUnlocked.map((a) => a.id),
      ],
    };

    persistProgress(updatedProgress);
    set({
      progress: updatedProgress,
      lastUnlockedAchievement: newlyUnlocked[0] ?? null,
    });
  },

  clearLastUnlockedAchievement: () => {
    set({ lastUnlockedAchievement: null });
  },
}));