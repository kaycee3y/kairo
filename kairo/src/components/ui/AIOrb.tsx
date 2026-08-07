"use client";

import { motion } from "framer-motion";

export function AIOrb({ size = 96 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }} aria-hidden="true">
      <motion.div
        className="absolute inset-0 rounded-full blur-xl opacity-70"
        style={{ background: "radial-gradient(circle at 30% 30%, #6FE3C4, #2F6F5E 60%)" }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full blur-xl opacity-60"
        style={{ background: "radial-gradient(circle at 70% 60%, #F9C88E, #F2994A 65%)" }}
        animate={{ scale: [1.1, 0.95, 1.1], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute inset-4 rounded-full bg-white/40 blur-md"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative rounded-full bg-white/70 backdrop-blur-sm"
        style={{ width: size * 0.35, height: size * 0.35 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
