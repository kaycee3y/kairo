"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ListChecks, Plus, BarChart3 } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/history", label: "Mission history", Icon: ListChecks },
  { href: "/stats", label: "Your progress", Icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/mission") return null;

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40
                 flex items-center gap-1 bg-white rounded-full
                 shadow-lg border border-black/5 px-2 py-2"
    >
      {TABS.slice(0, 2).map((tab) => (
        <NavTab key={tab.href} {...tab} active={pathname === tab.href} />
      ))}

      <Link
        href="/start"
        aria-label="Start a new mission"
        className={`relative flex items-center justify-center w-14 h-14 rounded-full mx-1
                   bg-[#F2994A] text-white shadow-md -translate-y-3
                   hover:opacity-90 transition-opacity
                   ${pathname === "/start" ? "ring-4 ring-[#F2994A]/30" : ""}`}
      >
        <Plus size={24} />
      </Link>

      {TABS.slice(2).map((tab) => (
        <NavTab key={tab.href} {...tab} active={pathname === tab.href} />
      ))}
    </nav>
  );
}

function NavTab({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link href={href} aria-label={label} className="relative flex items-center justify-center w-12 h-12">
      {active && (
        <motion.div
          layoutId="bottomNavActivePill"
          className="absolute inset-0 rounded-full bg-[#2F6F5E]/10"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <Icon size={20} className={`relative z-10 ${active ? "text-[#2F6F5E]" : "text-[#6B7280]"}`} />
    </Link>
  );
}