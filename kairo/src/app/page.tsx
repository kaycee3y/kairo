"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const SUGGESTIONS = ["Clean my room", "Study for chemistry", "Prep for an interview"];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col px-6 py-10 max-w-xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-[2.5rem] bg-white shadow-sm border border-black/5 p-8 flex flex-col gap-6 items-center text-center"
      >
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6F5E] bg-[#2F6F5E]/10 rounded-full px-4 py-1.5 w-fit">
          <Sparkles size={14} />
          Your task coach
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          Turn overwhelming into doable.
        </h1>

        <p className="text-[#6B7280] text-base max-w-sm">
          Kairo breaks any task into small, calm steps — and stays with you
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
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mt-6 flex flex-col gap-3"
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
    </main>
  );
}