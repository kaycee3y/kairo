// src/components/mission/FocusTimer.tsx
"use client";

import { Eye, EyeOff } from "lucide-react";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface FocusTimerProps {
  elapsedSeconds: number;
  targetMinutes: number;
  hidden: boolean;
  onToggleHidden: () => void;
}

export function FocusTimer({
  elapsedSeconds,
  targetMinutes,
  hidden,
  onToggleHidden,
}: FocusTimerProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#6B7280]">
      {hidden ? (
        <span>Taking the time you need — no rush</span>
      ) : (
        <span>
          {formatTime(elapsedSeconds)} of about {targetMinutes} min
        </span>
      )}
      <button
        onClick={onToggleHidden}
        aria-label={hidden ? "Show timer" : "Hide timer"}
        className="text-[#6B7280] hover:text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E] rounded-full p-1"
      >
        {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
}