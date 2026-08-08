"use client";

export function KairoLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="kairoLogoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2F6F5E" />
          <stop offset="100%" stopColor="#F2994A" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#kairoLogoGradient)" />
      <rect x="10" y="22" width="5" height="8" rx="1.5" fill="white" />
      <rect x="17.5" y="16" width="5" height="14" rx="1.5" fill="white" opacity="0.85" />
      <rect x="25" y="9" width="5" height="21" rx="1.5" fill="white" opacity="0.7" />
    </svg>
  );
}