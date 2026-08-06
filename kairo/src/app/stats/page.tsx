"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Target, Clock, Trophy, ListChecks } from "lucide-react";
import { useKairoStore } from "@/lib/store/useKairoStore";
import { xpRequiredForLevel } from "@/lib/xp";

export default function StatsPage() {
  const router = useRouter();
  const progress = useKairoStore((s) => s.progress);
  const loadFromStorage = useKairoStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const xpNeededForNext = xpRequiredForLevel(progress.level);
  const xpProgressWithinLevel = progress.xp % xpNeededForNext;
  const percentToNextLevel = Math.round(
    (xpProgressWithinLevel / xpNeededForNext) * 100
  );

  const stats = [
    {
      icon: Target,
      label: "Missions completed",
      value: progress.totalMissionsCompleted,
    },
    {
      icon: Clock,
      label: "Focus minutes",
      value: progress.totalFocusMinutes,
    },
    {
      icon: Flame,
      label: "Current streak",
      value: `${progress.currentStreak} ${progress.currentStreak === 1 ? "day" : "days"}`,
    },
    {
      icon: Trophy,
      label: "Longest streak",
      value: `${progress.longestStreak} ${progress.longestStreak === 1 ? "day" : "days"}`,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl flex flex-col gap-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#2D3436] w-fit"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-display text-3xl font-bold">Your journey so far</h1>
          <p className="text-[#6B7280]">
            Every small step you&apos;ve taken, added up.
          </p>
        </div>

        <div className="rounded-3xl bg-white shadow-sm border border-black/5 p-8 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#2F6F5E] flex items-center justify-center text-white font-display text-2xl font-bold">
            {progress.level}
          </div>
          <p className="text-[#6B7280] text-sm">Level {progress.level}</p>

          <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#F2994A]"
              animate={{ width: `${percentToNextLevel}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-[#6B7280]">
            {xpProgressWithinLevel} / {xpNeededForNext} XP to next level
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white shadow-sm border border-black/5 p-6 flex flex-col gap-2"
            >
              <stat.icon size={20} className="text-[#2F6F5E]" />
              <span className="font-display text-2xl font-bold">
                {stat.value}
              </span>
              <span className="text-sm text-[#6B7280]">{stat.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/history")}
          className="flex items-center justify-center gap-2 rounded-2xl border border-black/10
                     text-[#2D3436] font-medium py-3 hover:bg-black/5 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-[#2F6F5E]"
        >
          <ListChecks size={18} />
          View mission history
        </button>

        {progress.totalMissionsCompleted === 0 && (
          <p className="text-center text-[#6B7280] text-sm">
            No missions yet your first completed step will show up here.
          </p>
        )}
      </div>
    </main>
  );
}