// src/lib/types.ts

// A single step within a mission's roadmap
export interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// A full mission = one task broken into steps
export interface Mission {
  id: string;
  taskInput: string;          // what the user originally typed, e.g. "Clean my room"
  coachMessage: string;       // warm welcome note from the AI
  estimatedTotalMinutes: number;
  steps: Step[];
  currentStepIndex: number;
  createdAt: string;          // ISO date string
  completedAt: string | null;
}

// The five reasons a user might be stuck (matches your system prompt)
export type StuckReason =
  | "too_big"
  | "distracted"
  | "tired"
  | "dont_understand"
  | "something_else";

// What the AI returns when generating a new mission
export interface BreakdownResponse {
  mode: "breakdown";
  coach_message: string;
  estimated_total_minutes: number;
  steps: {
    step_title: string;
    step_description: string;
  }[];
}

// What the AI returns when the user is stuck
export interface EmpathyRestructureResponse {
  mode: "empathy_restructure";
  empathy_message: string;
  suggest_break: boolean;
  new_micro_steps: {
    step_title: string;
    step_description: string;
  }[];
}

// User's persistent progress (stored in Local Storage)
export interface Progress {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // ISO date, used to calculate streaks
  totalMissionsCompleted: number;
  totalFocusMinutes: number;
  achievements: string[]; // achievement IDs unlocked
}