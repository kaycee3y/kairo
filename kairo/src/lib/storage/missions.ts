// src/lib/storage/missions.ts
import { Mission } from "@/lib/types";

const MISSIONS_KEY = "kairo_missions";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAllMissions(): Mission[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(MISSIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Mission[];
  } catch {
    return [];
  }
}

export function getActiveMission(): Mission | null {
  const missions = getAllMissions();
  return missions.find((m) => m.completedAt === null) ?? null;
}

export function saveMission(mission: Mission): void {
  if (!isBrowser()) return;
  const missions = getAllMissions();
  const index = missions.findIndex((m) => m.id === mission.id);
  if (index >= 0) {
    missions[index] = mission;
  } else {
    missions.push(mission);
  }
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

export function deleteMission(missionId: string): void {
  if (!isBrowser()) return;
  const missions = getAllMissions().filter((m) => m.id !== missionId);
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}