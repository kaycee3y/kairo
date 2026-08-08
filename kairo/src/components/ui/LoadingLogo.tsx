"use client";

import { motion } from "framer-motion";
import { KairoLogo } from "./KairoLogo";

interface LoadingLogoProps {
  size?: number;
  message?: string;
}

export function LoadingLogo({ size = 64, message }: LoadingLogoProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <KairoLogo size={size} />
      </motion.div>
      {message && <p className="text-[#6B7280] text-sm">{message}</p>}
    </div>
  );
}