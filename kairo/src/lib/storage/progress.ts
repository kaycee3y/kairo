// src/lib/storage/progress.ts
import { Progress } from "@/lib/types";

const PROGRESS_KEY = "kairo_progress";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const DEFAULT_PROGRESS: Progress = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalMissionsCompleted: 0,
  totalFocusMinutes: 0,
  achievements: [],
};

export function getProgress(): Progress {
  if (!isBrowser()) return DEFAULT_PROGRESS;
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return DEFAULT_PROGRESS;
  try {
    return JSON.parse(raw) as Progress;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Progress): void {
  if (!isBrowser()) return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}