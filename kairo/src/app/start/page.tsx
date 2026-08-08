"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mic, MicOff } from "lucide-react";
import { useKairoStore } from "@/lib/store/useKairoStore";
import { BreakdownResponse, Mission, Step } from "@/lib/types";
import { AIOrb } from "@/components/ui/AIOrb";
import { LoadingLogo } from "@/components/ui/LoadingLogo";

export default function StartPage() {
  const router = useRouter();
  const setActiveMission = useKairoStore((s) => s.setActiveMission);

  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTask((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  function toggleMic() {
    if (!micSupported || !recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

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
        <AIOrb size={96} />

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            What&apos;s on your mind?
          </h1>
          <p className="text-[#6B7280] text-base">
            Tell me anything you&apos;re trying to get done.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex items-start gap-3 rounded-3xl border border-black/10
                          bg-white px-5 py-4 shadow-sm focus-within:ring-2 focus-within:ring-[#2F6F5E]">
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Ask anything, like 'clean my room'..."
              rows={2}
              className="flex-1 bg-transparent outline-none text-base resize-none
                         placeholder:text-[#6B7280]/70"
            />
            {micSupported ? (
              <button
                type="button"
                onClick={toggleMic}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                className={`mt-1 shrink-0 rounded-full p-1.5 transition-colors
                            ${listening ? "bg-[#F2994A] text-white animate-pulse" : "text-[#6B7280] hover:bg-black/5"}`}
              >
                <Mic size={18} />
              </button>
            ) : (
              <MicOff size={18} className="text-[#6B7280]/40 mt-1 shrink-0" aria-hidden="true" />
            )}
          </div>

          {error && (
            <p className="text-sm text-[#B45309] text-left" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleStart}
            disabled={loading || !task.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-full
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

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FAF9F6]/90 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <LoadingLogo size={72} message="Finding your first step..." />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}