"use client";

import { useState } from "react";
import { FeedbackPanel } from "@/components/feedback-panel";
import type { Platform, PlatformStatus } from "@/types";
import { PLATFORM_LABELS } from "@/lib/prompts/platform-rules";

interface OutputTabsProps {
  platforms: Platform[];
  outputs: Record<Platform, string>;
  statuses: Record<Platform, PlatformStatus>;
  generationIds: Record<Platform, string | null>;
}

const SHORT_LABELS: Record<Platform, string> = {
  instagram: "IG",
  facebook: "FB",
  linkedin: "LI",
  email: "EM",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className="px-4 py-2 rounded-md text-xs transition-all cursor-pointer"
      style={{
        background: copied ? "#f5f5f3" : "white",
        border: "1px solid #e0e0de",
        color: copied ? "#555" : "#888",
      }}
    >
      {copied ? "Copiato ✓" : "Copia testo"}
    </button>
  );
}

export function OutputTabs({ platforms, outputs, statuses, generationIds }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState<Platform>(platforms[0]);
  const anyOutput = Object.values(outputs).some((v) => v);
  const isAnyGenerating = Object.values(statuses).some((s) => s === "loading");

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid #f0f0ee" }}>
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setActiveTab(p)}
            className="flex-1 py-3.5 px-2.5 flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
            style={{
              background: activeTab === p ? "white" : "#fafaf9",
              border: "none",
              borderBottom: activeTab === p ? "2px solid #333" : "2px solid transparent",
              fontWeight: activeTab === p ? 600 : 400,
              color: activeTab === p ? "#222" : "#999",
            }}
          >
            <span
              className="text-[10px] font-semibold"
              style={{ color: activeTab === p ? "#555" : "#ccc" }}
            >
              {SHORT_LABELS[p]}
            </span>
            {PLATFORM_LABELS[p]}
            {statuses[p] === "loading" && (
              <span className="w-[5px] h-[5px] rounded-full bg-[#ccc] animate-pulse inline-block" />
            )}
            {outputs[p] && statuses[p] !== "loading" && (
              <span className="w-[5px] h-[5px] rounded-full bg-[#888] inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-7 flex flex-col min-h-[520px]">
        {!anyOutput && !isAnyGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="text-[13px] text-[#ccc]">Nessun copy generato</div>
            <div className="text-xs text-[#ddd]">
              Inserisci un tema e premi &quot;Genera copy&quot;
            </div>
          </div>
        )}

        {statuses[activeTab] === "loading" && !outputs[activeTab] && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs text-[#bbb] animate-pulse">
              Generando {PLATFORM_LABELS[activeTab]}...
            </span>
          </div>
        )}

        {statuses[activeTab] === "error" && !outputs[activeTab] && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs text-red-500">
              Errore nella generazione. Riprova.
            </span>
          </div>
        )}

        {outputs[activeTab] && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-300">
            <div
              className="text-[13px] text-[#444] leading-[1.85] whitespace-pre-wrap flex-1 overflow-auto"
              dangerouslySetInnerHTML={{
                __html: outputs[activeTab]
                  .replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong style="color:#222;font-weight:600">$1</strong>'
                  )
                  .replace(
                    /^(#{1,3} .+)$/gm,
                    '<span style="display:block;margin-top:20px;margin-bottom:6px;font-size:10px;font-weight:700;color:#999;letter-spacing:0.08em;text-transform:uppercase">$1</span>'
                  )
                  .replace(
                    /^(\d+\. )/gm,
                    '<span style="color:#bbb">$1</span>'
                  ),
              }}
            />
            <div
              className="mt-5 pt-4 flex flex-col gap-4"
              style={{ borderTop: "1px solid #f0f0ee" }}
            >
              <CopyButton text={outputs[activeTab]} />
              {generationIds[activeTab] && (
                <FeedbackPanel
                  platform={activeTab}
                  generationId={generationIds[activeTab]}
                  generatedCopy={outputs[activeTab]}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
