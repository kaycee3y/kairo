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