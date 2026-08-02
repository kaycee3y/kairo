// src/app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, Clock3, Sparkles } from "lucide-react";

const CALLOUTS = [
  { icon: Sparkles, label: "3–6 gentle steps", sublabel: "per mission" },
  { icon: Clock3, label: "No countdowns", sublabel: "time that stretches, not shrinks" },
  { icon: HeartHandshake, label: "Never judged", sublabel: "every attempt counts" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex flex-col justify-center px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6F5E] bg-[#2F6F5E]/10 rounded-full px-4 py-1.5 w-fit">
              Your task coach
            </span>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Turn overwhelming into doable.
            </h1>

            <p className="text-[#6B7280] text-lg max-w-md">
              Kairo breaks any task into small, calm steps — and stays with
              you when it gets hard. Built for brains that start big and
              stall fast.
            </p>

            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 rounded-2xl
                         bg-[#2F6F5E] text-white font-display font-semibold text-lg
                         py-4 px-8 w-fit hover:opacity-90 transition-opacity
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F6F5E]"
            >
              Get started
              <ArrowRight size={20} />
            </Link>
          </motion.div>

          {/* Right: flowing path visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <FlowingPath />
          </motion.div>
        </div>
      </section>

      {/* Callout strip */}
      <section className="px-6 pb-16 max-w-5xl mx-auto w-full">
        <div className="grid sm:grid-cols-3 gap-4">
          {CALLOUTS.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl bg-white border border-black/5 shadow-sm p-6 flex flex-col gap-2"
            >
              <c.icon size={20} className="text-[#2F6F5E]" />
              <span className="font-display font-bold text-lg">{c.label}</span>
              <span className="text-sm text-[#6B7280]">{c.sublabel}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center pb-8 text-sm text-[#6B7280]">
        Small steps, real progress.
      </footer>
    </main>
  );
}

function FlowingPath() {
  const points = [
    { x: 40, y: 200 },
    { x: 120, y: 120 },
    { x: 200, y: 180 },
    { x: 280, y: 90 },
    { x: 340, y: 150 },
  ];

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  return (
    <svg viewBox="0 0 380 260" className="w-full max-w-md" aria-hidden="true">
      <motion.path
        d={pathD}
        fill="none"
        stroke="#2F6F5E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="1 10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 10 : 6}
          fill={i === points.length - 1 ? "#F2994A" : "#2F6F5E"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.25 }}
        />
      ))}
    </svg>
  );
}