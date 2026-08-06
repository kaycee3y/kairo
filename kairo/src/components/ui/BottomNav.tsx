"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Plus, BarChart3 } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/mission") return null; // keep focus mode distraction-free

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40
                 flex items-center gap-2 bg-white rounded-full
                 shadow-lg border border-black/5 px-3 py-2"
    >
      <Link
        href="/"
        aria-label="Home"
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors
                    ${isActive("/") ? "bg-[#2F6F5E]/10 text-[#2F6F5E]" : "text-[#6B7280] hover:bg-black/5"}`}
      >
        <Home size={20} />
      </Link>

      <Link
        href="/history"
        aria-label="Mission history"
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors
                    ${isActive("/history") ? "bg-[#2F6F5E]/10 text-[#2F6F5E]" : "text-[#6B7280] hover:bg-black/5"}`}
      >
        <ListChecks size={20} />
      </Link>

      <Link
        href="/start"
        aria-label="Start a new mission"
        className="flex items-center justify-center w-14 h-14 rounded-full
                   bg-[#F2994A] text-white shadow-md -translate-y-3
                   hover:opacity-90 transition-opacity"
      >
        <Plus size={24} />
      </Link>

      <Link
        href="/stats"
        aria-label="Your progress"
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors
                    ${isActive("/stats") ? "bg-[#2F6F5E]/10 text-[#2F6F5E]" : "text-[#6B7280] hover:bg-black/5"}`}
      >
        <BarChart3 size={20} />
      </Link>
    </nav>
  );
}