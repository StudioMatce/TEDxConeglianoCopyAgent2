"use client";

import type { StyleParams } from "@/types";
import { SLIDER_META } from "@/lib/prompts/style-params";

interface StyleSlidersProps {
  params: StyleParams;
  onChange: (params: StyleParams) => void;
}

export function StyleSliders({ params, onChange }: StyleSlidersProps) {
  const updateParam = (key: keyof StyleParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div>
      <div className="text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-4">
        Stile
      </div>
      <div className="space-y-[18px]">
        {SLIDER_META.map((slider) => (
          <div key={slider.key}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[11px] font-medium text-[#444]">
                {slider.label}
              </span>
              <span className="text-[10px] text-[#aaa] tabular-nums">
                {params[slider.key]}
              </span>
            </div>
            <div className="relative h-5 flex items-center">
              <div className="absolute w-full h-[2px] bg-[#e8e8e8] rounded-sm" />
              <div
                className="absolute h-[2px] bg-[#555] rounded-sm"
                style={{ width: `${params[slider.key]}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={params[slider.key]}
                onChange={(e) =>
                  updateParam(slider.key, Number(e.target.value))
                }
                className="relative w-full appearance-none bg-transparent cursor-pointer z-[1] slider-thumb"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#bbb]">{slider.min}</span>
              <span className="text-[10px] text-[#bbb]">{slider.max}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
