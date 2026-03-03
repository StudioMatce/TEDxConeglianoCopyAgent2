"use client";

import type { Platform, PlatformStatus } from "@/types";
import { PLATFORM_LABELS } from "@/lib/prompts/platform-rules";

interface PlatformStatusProps {
  statuses: Record<Platform, PlatformStatus>;
  platforms: Platform[];
}

const SHORT_LABELS: Record<Platform, string> = {
  instagram: "IG",
  facebook: "FB",
  linkedin: "LI",
  email: "EM",
};

export function PlatformStatusPanel({ statuses, platforms }: PlatformStatusProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {platforms.map((p) => (
        <div
          key={p}
          className="flex items-center justify-between px-3 py-2 rounded-md"
          style={{ background: "#fafaf9", border: "1px solid #f0f0ee" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-[#bbb] tracking-wide">
              {SHORT_LABELS[p]}
            </span>
            <span className="text-xs text-[#666]">{PLATFORM_LABELS[p]}</span>
          </div>
          <span className="text-[11px]">
            {statuses[p] === "loading" && (
              <span className="text-[#bbb] animate-pulse">●</span>
            )}
            {statuses[p] === "done" && (
              <span className="text-[#888]">✓</span>
            )}
            {statuses[p] === "error" && (
              <span className="text-red-500">✗</span>
            )}
            {statuses[p] === "idle" && (
              <span className="text-[#e0e0e0]">○</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
