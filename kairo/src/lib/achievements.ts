export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_mission", title: "First Step Taken", description: "You completed your very first mission." },
  { id: "streak_3", title: "Three in a Row", description: "You showed up three days in a row." },
  { id: "streak_7", title: "Full Week", description: "A whole week of small steps." },
  { id: "missions_5", title: "Five Missions Strong", description: "You've completed five missions." },
];

export function checkNewAchievements(
  totalMissionsCompleted: number,
  currentStreak: number,
  alreadyUnlocked: string[]
): Achievement[] {
  const unlocked: Achievement[] = [];

  function maybeUnlock(id: string) {
    if (!alreadyUnlocked.includes(id)) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) unlocked.push(achievement);
    }
  }

  if (totalMissionsCompleted >= 1) maybeUnlock("first_mission");
  if (totalMissionsCompleted >= 5) maybeUnlock("missions_5");
  if (currentStreak >= 3) maybeUnlock("streak_3");
  if (currentStreak >= 7) maybeUnlock("streak_7");

  return unlocked;
}