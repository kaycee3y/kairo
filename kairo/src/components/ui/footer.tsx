// src/components/ui/Footer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/mission") return null; // keep focus mode distraction-free

  return (
    <footer className="w-full max-w-xl mx-auto px-6 py-8 flex flex-col items-center gap-2 text-center">
      <p className="text-sm text-[#6B7280]">Small steps, real progress.</p>
      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
        <Link href="/terms" className="hover:text-[#2D3436] underline underline-offset-2">
          Terms &amp; Conditions
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacy" className="hover:text-[#2D3436] underline underline-offset-2">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}