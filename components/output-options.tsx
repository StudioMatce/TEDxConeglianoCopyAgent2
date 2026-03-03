"use client";

import type { OutputOptions, Platform } from "@/types";
import { PLATFORM_LABELS } from "@/lib/prompts/platform-rules";

interface OutputOptionsProps {
  options: OutputOptions;
  onChange: (options: OutputOptions) => void;
  activePlatforms: Record<Platform, boolean>;
  onPlatformsChange: (platforms: Record<Platform, boolean>) => void;
}

const PLATFORM_ORDER: Platform[] = ["instagram", "facebook", "linkedin", "email"];

const OPTIONS_META: { key: keyof OutputOptions; label: string }[] = [
  { key: "secondaVersione", label: "Seconda versione" },
  { key: "cta", label: "CTA" },
  { key: "hashtag", label: "Hashtag" },
  { key: "noteStrategiche", label: "Note strategiche" },
];

function CustomCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={onToggle}
        className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all"
        style={{
          background: checked ? "#444" : "white",
          border: checked ? "none" : "1.5px solid #ccc",
          borderRadius: "4px",
        }}
      >
        {checked && (
          <span className="text-white text-[10px] leading-none">✓</span>
        )}
      </div>
      <span className="text-xs text-[#555]">{label}</span>
    </label>
  );
}

export function OutputOptionsPanel({
  options,
  onChange,
  activePlatforms,
  onPlatformsChange,
}: OutputOptionsProps) {
  const toggleOption = (key: keyof OutputOptions) => {
    onChange({ ...options, [key]: !options[key] });
  };

  const togglePlatform = (p: Platform) => {
    onPlatformsChange({ ...activePlatforms, [p]: !activePlatforms[p] });
  };

  return (
    <div>
      <div className="text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-3.5">
        Includi nell&apos;output
      </div>

      {/* Platforms */}
      <div className="flex flex-col gap-2.5 mb-4">
        {PLATFORM_ORDER.map((p) => (
          <CustomCheckbox
            key={p}
            checked={activePlatforms[p]}
            onToggle={() => togglePlatform(p)}
            label={PLATFORM_LABELS[p]}
          />
        ))}
      </div>

      <div className="border-t border-[#f0f0ee] pt-3 flex flex-col gap-2.5">
        {OPTIONS_META.map((opt) => (
          <CustomCheckbox
            key={opt.key}
            checked={options[opt.key]}
            onToggle={() => toggleOption(opt.key)}
            label={opt.label}
          />
        ))}
      </div>
    </div>
  );
}
