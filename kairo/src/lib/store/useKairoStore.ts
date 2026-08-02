// src/lib/store/useKairoStore.ts
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
} from "@/lib/xp";

interface KairoState {
  activeMission: Mission | null;
  progress: Progress;

  loadFromStorage: () => void;
  setActiveMission: (mission: Mission) => void;
  completeStep: (stepId: string) => void;
  completeMission: () => void;
}

export const useKairoStore = create<KairoState>((set, get) => ({
  activeMission: null,
  progress: getProgress(),

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
    const updatedProgress: Progress = {
      ...currentProgress,
      xp: newXp,
      level: calculateLevel(newXp),
      totalMissionsCompleted: currentProgress.totalMissionsCompleted + 1,
      totalFocusMinutes:
        currentProgress.totalFocusMinutes + mission.estimatedTotalMinutes,
    };

    persistProgress(updatedProgress);
    set({ progress: updatedProgress });
  },
}));