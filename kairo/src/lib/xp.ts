// src/lib/xp.ts

const XP_PER_STEP = 10;
const XP_MISSION_BONUS = 25;

// XP required to reach a given level (simple increasing curve)
export function xpRequiredForLevel(level: number): number {
  return level * 100;
}

export function calculateLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = xpRequiredForLevel(level);
  let remaining = totalXp;

  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level += 1;
    xpNeeded = xpRequiredForLevel(level);
  }
  return level;
}

export function xpForCompletingStep(): number {
  return XP_PER_STEP;
}

export function xpForCompletingMission(): number {
  return XP_MISSION_BONUS;
}
// --- Streak logic ---

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(a: Date, b: Date): boolean {
  const yesterday = new Date(b);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(a, yesterday);
}

export function calculateUpdatedStreak(
  lastActiveDate: string | null,
  currentStreak: number
): number {
  const today = new Date();

  if (!lastActiveDate) return 1; // first mission ever

  const last = new Date(lastActiveDate);

  if (isSameDay(last, today)) {
    return currentStreak; // already active today, streak unchanged
  }

  if (isYesterday(last, today)) {
    return currentStreak + 1; // consecutive day, streak continues
  }

  return 1; // gap of 2+ days, streak resets
}