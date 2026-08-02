// src/components/ui/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, BarChart3 } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/mission") return null; // keep focus mode distraction-free

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 max-w-xl mx-auto">
      <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
        <Sparkles size={20} className="text-[#2F6F5E]" />
        Kairo
      </Link>
      <Link
        href="/stats"
        className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#2D3436]"
      >
        <BarChart3 size={18} />
        Progress
      </Link>
    </header>
  );
}