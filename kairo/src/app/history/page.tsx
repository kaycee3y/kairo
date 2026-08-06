"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { getAllMissions } from "@/lib/storage/missions";
import { Mission } from "@/lib/types";

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function HistoryPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const all = getAllMissions();
    const completed = all
      .filter((m) => m.completedAt !== null)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    setMissions(completed);
  }, []);

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
          <h1 className="font-display text-3xl font-bold">Missions completed</h1>
          <p className="text-[#6B7280]">Every one of these, you finished.</p>
        </div>

        {missions.length === 0 ? (
          <p className="text-center text-[#6B7280] text-sm">
            No missions completed yet — your first one will show up here.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {missions.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`rounded-2xl p-5 flex flex-col gap-3 ${
                  i % 2 === 0 ? "bg-[#FBEEE0]" : "bg-[#E7F1EE]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display font-bold text-lg">{mission.taskInput}</h2>
                  <CheckCircle2 size={20} className="text-[#2F6F5E] shrink-0" />
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    ~{mission.estimatedTotalMinutes} min
                  </span>
                  <span>{mission.steps.length} steps</span>
                  <span>{formatDate(mission.completedAt!)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}