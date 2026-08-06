"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SUGGESTIONS = ["Clean my room", "Study for chemistry", "Prep for an interview"];

const FEATURES = [
  { Icon: StepsIcon, label: "3–6 gentle steps", sublabel: "broken down for you" },
  { Icon: OpenTimeIcon, label: "Time that stretches", sublabel: "never counts you down" },
  { Icon: SoftHeartIcon, label: "Never judged", sublabel: "every attempt counts" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col px-6 py-10 max-w-xl mx-auto w-full gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-[2.5rem] bg-white shadow-sm border border-black/5 p-8 flex flex-col gap-6 items-center text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-full bg-[#2F6F5E]"
          aria-hidden="true"
        />

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          Turn overwhelming into doable.
        </h1>

        <p className="text-[#6B7280] text-base max-w-sm">
          Kairo breaks any task into small, calm steps and stays with you
          when it gets hard.
        </p>

        <Link
          href="/start"
          className="inline-flex items-center justify-center gap-2 rounded-full
                     bg-[#2F6F5E] text-white font-display font-semibold text-base
                     py-3.5 px-8 w-full hover:opacity-90 transition-opacity
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F6F5E]"
        >
          Get started
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex flex-col gap-3"
      >
        <p className="text-sm text-[#6B7280] px-2">Or jump right in:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s}
              href="/start"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm
                         text-[#2D3436] hover:bg-black/5 transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="grid grid-cols-3 gap-3"
      >
        {FEATURES.map((f) => (
          <div
            key={f.label}
            className="rounded-2xl bg-[#1F3A38] text-white p-4 flex flex-col gap-2 items-start"
          >
            <f.Icon />
            <span className="font-display font-bold text-sm leading-tight">{f.label}</span>
            <span className="text-xs text-white/70 leading-tight">{f.sublabel}</span>
          </div>
        ))}
      </motion.div>
    </main>
  );
}

function StepsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="16" width="6" height="6" rx="2" fill="#F2994A" />
      <rect x="9" y="10" width="6" height="12" rx="2" fill="#F2994A" opacity="0.75" />
      <rect x="16" y="4" width="6" height="18" rx="2" fill="#F2994A" opacity="0.5" />
    </svg>
  );
}

function OpenTimeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 6.2 15.6" stroke="#F2994A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="12" r="2" fill="#F2994A" />
    </svg>
  );
}

function SoftHeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.35-9.5-9C1 7.5 3 4 6.5 4c2 0 3.5 1.2 4.2 2.6C11.4 5.2 13 4 15 4c3.5 0 5.5 3.5 4 7-2.5 4.65-7 9-7 9z"
        fill="#F2994A"
      />
    </svg>
  );
}