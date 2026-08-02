"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useKairoStore } from "@/lib/store/useKairoStore";
import { BreakdownResponse, Mission, Step } from "@/lib/types";

export default function StartPage() {
  const router = useRouter();
  const setActiveMission = useKairoStore((s) => s.setActiveMission);

  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    if (!task.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "breakdown", task: task.trim() }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data: BreakdownResponse = await res.json();

      const steps: Step[] = data.steps.map((s) => ({
        id: crypto.randomUUID(),
        title: s.step_title,
        description: s.step_description,
        completed: false,
      }));

      const mission: Mission = {
        id: crypto.randomUUID(),
        taskInput: task.trim(),
        coachMessage: data.coach_message,
        estimatedTotalMinutes: data.estimated_total_minutes,
        steps,
        currentStepIndex: 0,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      setActiveMission(mission);
      router.push("/mission");
    } catch (err) {
      console.error(err);
      setError(
        "No worries — something didn't connect right. Let's try that again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl flex flex-col items-center text-center gap-8"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-[#2F6F5E]"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            What&apos;s on your mind?
          </h1>
          <p className="text-[#6B7280] text-lg">
            Tell me anything you&apos;re trying to get done — I&apos;ll help
            you find the smallest first step.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g. Clean my room, study for chemistry, prep for an interview..."
            rows={3}
            className="w-full rounded-2xl border border-black/10 bg-white p-4 text-lg
                       placeholder:text-[#6B7280]/70 focus:outline-none focus:ring-2
                       focus:ring-[#2F6F5E] resize-none shadow-sm"
          />

          {error && (
            <p className="text-sm text-[#B45309] text-left" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleStart}
            disabled={loading || !task.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl
                       bg-[#2F6F5E] text-white font-display font-semibold text-lg
                       py-4 transition-opacity disabled:opacity-40
                       hover:opacity-90 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-[#2F6F5E]"
          >
            {loading ? "Finding your first step..." : "Start mission"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
