"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { useKairoStore } from "@/lib/store/useKairoStore";
import { EmpathyRestructureResponse, Step, StuckReason } from "@/lib/types";
import { FocusTimer } from "@/components/mission/FocusTimer";
import { playGentleChime, speakCalmly } from "@/lib/audio";
import { Achievement } from "@/lib/achievements";

const STUCK_OPTIONS: { label: string; value: StuckReason }[] = [
  { label: "It's too big", value: "too_big" },
  { label: "I'm distracted", value: "distracted" },
  { label: "I'm tired", value: "tired" },
  { label: "I don't understand", value: "dont_understand" },
  { label: "Something else", value: "something_else" },
];

const TIMER_EXTENSION_MINUTES = 3;
const DEFAULT_STEP_MINUTES = 5;

export default function MissionPage() {
  const router = useRouter();
  const activeMission = useKairoStore((s) => s.activeMission);
  const loadFromStorage = useKairoStore((s) => s.loadFromStorage);
  const completeStep = useKairoStore((s) => s.completeStep);
  const completeMission = useKairoStore((s) => s.completeMission);
  const lastUnlockedAchievement = useKairoStore((s) => s.lastUnlockedAchievement);
  const clearLastUnlockedAchievement = useKairoStore((s) => s.clearLastUnlockedAchievement);

  const [needMoreTimeCount, setNeedMoreTimeCount] = useState(0);
  const [showStuckPrompt, setShowStuckPrompt] = useState(false);
  const [empathyMessage, setEmpathyMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(DEFAULT_STEP_MINUTES);
  const [timerHidden, setTimerHidden] = useState(false);
  const hasChimedRef = useRef(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (activeMission === null) {
      const timeout = setTimeout(() => {
        if (!useKairoStore.getState().activeMission) {
          router.push("/");
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [activeMission, router]);

  const currentStep: Step | undefined = activeMission?.steps[activeMission.currentStepIndex];

  useEffect(() => {
    setElapsedSeconds(0);
    setTargetMinutes(DEFAULT_STEP_MINUTES);
    setNeedMoreTimeCount(0);
    hasChimedRef.current = false;

    if (currentStep && voiceEnabled && !activeMission?.completedAt) {
      const timeout = setTimeout(() => {
        speakCalmly(`${currentStep.title}. ${currentStep.description}`);
      }, 500);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep?.id]);

  useEffect(() => {
    if (!currentStep || activeMission?.completedAt) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, activeMission?.completedAt]);

  useEffect(() => {
    if (hasChimedRef.current) return;
    if (elapsedSeconds >= targetMinutes * 60) {
      hasChimedRef.current = true;
      playGentleChime();
      if (voiceEnabled) {
        speakCalmly("No rush at all — but whenever you're ready, this could be a good moment to wrap up.");
      }
    }
  }, [elapsedSeconds, targetMinutes, voiceEnabled]);

  if (!activeMission) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[#6B7280]">Loading your mission...</p>
      </main>
    );
  }

  const isMissionComplete = activeMission.completedAt !== null;
  const completedCount = activeMission.steps.filter((s) => s.completed).length;

  function handleCompleteStep() {
    if (!currentStep) return;
    completeStep(currentStep.id);
    setEmpathyMessage(null);

    const willBeComplete =
      activeMission!.steps.filter((s) => s.completed).length + 1 ===
      activeMission!.steps.length;

    if (willBeComplete) {
      completeMission();
      playGentleChime();
      if (voiceEnabled) {
        speakCalmly("You did it — every step, done. That took real effort, and you showed up for it.");
      }
    }
  }

  function handleNeedMoreTime() {
    const nextCount = needMoreTimeCount + 1;
    setNeedMoreTimeCount(nextCount);

    if (nextCount < 3) {
      setTargetMinutes((m) => m + TIMER_EXTENSION_MINUTES);
      const message =
        nextCount === 1
          ? "Sure — let's give this a little more room. Take your time."
          : "No worries at all, we've added a bit more time again.";
      setEmpathyMessage(message);
      if (voiceEnabled) speakCalmly(message);
      hasChimedRef.current = false;
    } else {
      setShowStuckPrompt(true);
    }
  }

  async function handleStuckReason(reason: StuckReason) {
    if (!currentStep) return;
    setLoading(true);
    setShowStuckPrompt(false);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "empathy_restructure",
          reason,
          currentStepTitle: currentStep.title,
          currentStepDescription: currentStep.description,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data: EmpathyRestructureResponse = await res.json();
      setEmpathyMessage(data.empathy_message);
      if (voiceEnabled) speakCalmly(data.empathy_message);
      setNeedMoreTimeCount(0);
      setTargetMinutes(DEFAULT_STEP_MINUTES);
      setElapsedSeconds(0);
      hasChimedRef.current = false;

      const newSteps: Step[] = data.new_micro_steps.map((s) => ({
        id: crypto.randomUUID(),
        title: s.step_title,
        description: s.step_description,
        completed: false,
      }));

      const updatedSteps = [
        ...activeMission!.steps.slice(0, activeMission!.currentStepIndex),
        ...newSteps,
        ...activeMission!.steps.slice(activeMission!.currentStepIndex + 1),
      ];

      useKairoStore.getState().setActiveMission({
        ...activeMission!,
        steps: updatedSteps,
      });
    } catch (err) {
      console.error(err);
      const fallback =
        "No worries — let's just take a breath and try the next small piece when you're ready.";
      setEmpathyMessage(fallback);
      if (voiceEnabled) speakCalmly(fallback);
    } finally {
      setLoading(false);
    }
  }

  function handleDoneViewingCompletion() {
    clearLastUnlockedAchievement();
    router.push("/");
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-black/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#2F6F5E]"
              animate={{
                width: `${(completedCount / activeMission.steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm text-[#6B7280] whitespace-nowrap">
            {completedCount}/{activeMission.steps.length} steps
          </span>
        </div>

        {isMissionComplete ? (
          <MissionCompleteCard
            onDone={handleDoneViewingCompletion}
            achievement={lastUnlockedAchievement}
          />
        ) : (
          <>
            <p className="text-[#6B7280] text-center">{activeMission.coachMessage}</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl bg-white shadow-sm border border-black/5 p-8 flex flex-col gap-6 items-center text-center"
              >
                <div className="flex items-center justify-between w-full">
                  <FocusTimer
                    elapsedSeconds={elapsedSeconds}
                    targetMinutes={targetMinutes}
                    hidden={timerHidden}
                    onToggleHidden={() => setTimerHidden((h) => !h)}
                  />
                  <button
                    onClick={() => setVoiceEnabled((v) => !v)}
                    aria-label={voiceEnabled ? "Turn off calm voice" : "Turn on calm voice"}
                    className="text-[#6B7280] hover:text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E] rounded-full p-1.5"
                  >
                    {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                </div>

                <h2 className="font-display text-2xl font-bold">
                  {currentStep?.title}
                </h2>
                <p className="text-[#6B7280]">{currentStep?.description}</p>

                {empathyMessage && (
                  <p className="text-[#2F6F5E] bg-[#2F6F5E]/10 rounded-xl p-4 text-sm">
                    {empathyMessage}
                  </p>
                )}

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={handleCompleteStep}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl
                               bg-[#2F6F5E] text-white font-display font-semibold text-lg
                               py-4 hover:opacity-90 focus:outline-none focus:ring-2
                               focus:ring-offset-2 focus:ring-[#2F6F5E]"
                  >
                    <CheckCircle2 size={20} />
                    Done with this step
                  </button>

                  <button
                    onClick={handleNeedMoreTime}
                    disabled={loading}
                    className="w-full rounded-2xl border border-black/10 text-[#2D3436]
                               font-medium py-3 hover:bg-black/5 focus:outline-none
                               focus:ring-2 focus:ring-offset-2 focus:ring-[#2F6F5E]"
                  >
                    {loading ? "One moment..." : "Need more time"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence>
        {showStuckPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col gap-5"
            >
              <h3 className="font-display text-xl font-bold text-center">
                It looks like this step has been difficult. That&apos;s
                completely okay.
              </h3>
              <p className="text-[#6B7280] text-center text-sm">
                What&apos;s making it hard right now?
              </p>
              <div className="flex flex-col gap-2">
                {STUCK_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStuckReason(opt.value)}
                    className="rounded-xl border border-black/10 py-3 px-4 text-left
                               hover:bg-black/5 focus:outline-none focus:ring-2
                               focus:ring-[#2F6F5E]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function MissionCompleteCard({
  onDone,
  achievement,
}: {
  onDone: () => void;
  achievement: Achievement | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white shadow-sm border border-black/5 p-10 flex flex-col items-center gap-4 text-center"
    >
      {achievement ? (
        <div className="relative flex items-center justify-center w-24 h-24 mb-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-[#F2994A]/40"
              initial={{ width: 40, height: 40, opacity: 0.6 }}
              animate={{ width: 100 + i * 26, height: 100 + i * 26, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            />
          ))}
          <div className="relative w-16 h-16 rounded-full bg-[#F2994A] flex items-center justify-center text-white text-2xl">
            🏅
          </div>
        </div>
      ) : (
        <div className="text-5xl">🎉</div>
      )}

      <h2 className="font-display text-2xl font-bold">
        {achievement ? "New badge unlocked!" : "You did it — every step, done."}
      </h2>

      {achievement && (
        <p className="font-display font-semibold text-[#2F6F5E]">{achievement.title}</p>
      )}

      <p className="text-[#6B7280]">
        {achievement
          ? achievement.description
          : "That took real effort, and you showed up for it. Nice work."}
      </p>

      <button
        onClick={onDone}
        className="w-full rounded-2xl bg-[#F2994A] text-white font-display
                   font-semibold text-lg py-4 hover:opacity-90 focus:outline-none
                   focus:ring-2 focus:ring-offset-2 focus:ring-[#F2994A]"
      >
        Back to Kairo
      </button>
    </motion.div>
  );
}