"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { BrandPanel } from "@/components/brand-panel";
import { ContentInput } from "@/components/content-input";
import { StyleSliders } from "@/components/style-sliders";
import { OutputOptionsPanel } from "@/components/output-options";
import { GenerateButton } from "@/components/generate-button";
import { OutputTabs } from "@/components/output-tabs";
import { TEDX_CONEGLIANO_PRESET } from "@/lib/brand/guidelines";
import { CURRENT_EDITION } from "@/lib/brand/edition";
import type {
  Platform,
  PlatformStatus,
  StyleParams,
  OutputOptions,
  BrandGuidelines,
  EditionTheme,
} from "@/types";
import { DEFAULT_STYLE_PARAMS, DEFAULT_OUTPUT_OPTIONS } from "@/types";

const ALL_PLATFORMS: Platform[] = ["instagram", "facebook", "linkedin", "email"];

const DEFAULT_ACTIVE_PLATFORMS: Record<Platform, boolean> = {
  instagram: true,
  facebook: true,
  linkedin: true,
  email: false,
};

function emptyStatuses(): Record<Platform, PlatformStatus> {
  return { instagram: "idle", facebook: "idle", linkedin: "idle", email: "idle" };
}

function emptyOutputs(): Record<Platform, string> {
  return { instagram: "", facebook: "", linkedin: "", email: "" };
}

function emptyIds(): Record<Platform, string | null> {
  return { instagram: null, facebook: null, linkedin: null, email: null };
}

const cardStyle = {
  background: "white",
  border: "1px solid #e8e8e6",
  borderRadius: "10px",
  padding: "20px",
};

export default function Home() {
  const [guidelines, setGuidelines] = useState<BrandGuidelines>({
    ...TEDX_CONEGLIANO_PRESET,
  });
  const [editionTheme, setEditionTheme] = useState<EditionTheme>({
    ...CURRENT_EDITION,
  });
  const [topic, setTopic] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [styleParams, setStyleParams] = useState<StyleParams>({
    ...DEFAULT_STYLE_PARAMS,
  });
  const [outputOptions, setOutputOptions] = useState<OutputOptions>({
    ...DEFAULT_OUTPUT_OPTIONS,
  });
  const [statuses, setStatuses] = useState(emptyStatuses);
  const [outputs, setOutputs] = useState(emptyOutputs);
  const [generationIds, setGenerationIds] = useState(emptyIds);
  const [activePlatforms, setActivePlatforms] = useState(DEFAULT_ACTIVE_PLATFORMS);

  const enabledPlatforms = ALL_PLATFORMS.filter((p) => activePlatforms[p]);
  const isAnyLoading = Object.values(statuses).some((s) => s === "loading");

  const generateForPlatform = useCallback(
    async (platform: Platform) => {
      setStatuses((prev) => ({ ...prev, [platform]: "loading" as const }));
      setOutputs((prev) => ({ ...prev, [platform]: "" }));
      setGenerationIds((prev) => ({ ...prev, [platform]: null }));

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            platform,
            styleParams,
            outputOptions,
            brandGuidelines: guidelines.nome ? guidelines : null,
            editionTheme: editionTheme.active ? editionTheme : null,
            imageData,
          }),
        });

        if (!res.ok) throw new Error("Generation failed");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setOutputs((prev) => ({ ...prev, [platform]: fullText }));
        }

        setStatuses((prev) => ({ ...prev, [platform]: "done" as const }));

        // Save generation to Supabase and get ID for feedback
        try {
          const saveRes = await fetch("/api/save-generation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic,
              platform,
              styleParams,
              outputOptions,
              editionThemeActive: editionTheme.active,
              generatedCopy: fullText,
            }),
          });
          const { id } = await saveRes.json();
          if (id) {
            setGenerationIds((prev) => ({ ...prev, [platform]: id }));
          }
        } catch {
          // Supabase not configured — that's fine
        }
      } catch {
        setStatuses((prev) => ({ ...prev, [platform]: "error" as const }));
      }
    },
    [topic, styleParams, outputOptions, guidelines, editionTheme, imageData]
  );

  const handleGenerate = () => {
    enabledPlatforms.forEach((p) => generateForPlatform(p));
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#f5f5f3", padding: "0 20px 64px" }}>
      <Header />

      <div className="w-full" style={{ maxWidth: "1040px" }}>
        {/* Brand Panel — full width above grid */}
        <div style={{ ...cardStyle, marginBottom: "12px", padding: "0", overflow: "hidden" }}>
          <div className="px-5 py-0">
            <BrandPanel
              guidelines={guidelines}
              onGuidelinesChange={setGuidelines}
              editionTheme={editionTheme}
              onEditionThemeChange={setEditionTheme}
            />
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-3">
          {/* Left Panel */}
          <div className="flex flex-col gap-3">
            <div style={cardStyle}>
              <ContentInput
                value={topic}
                onChange={setTopic}
                imageData={imageData}
                onImageChange={setImageData}
              />
            </div>

            <div style={cardStyle}>
              <StyleSliders params={styleParams} onChange={setStyleParams} />
            </div>

            <div style={cardStyle}>
              <OutputOptionsPanel
                options={outputOptions}
                onChange={setOutputOptions}
                activePlatforms={activePlatforms}
                onPlatformsChange={setActivePlatforms}
              />
            </div>

            <div style={cardStyle}>
              <GenerateButton
                onClick={handleGenerate}
                disabled={!topic.trim() && !imageData}
                loading={isAnyLoading}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ ...cardStyle, padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <OutputTabs
              platforms={enabledPlatforms}
              outputs={outputs}
              statuses={statuses}
              generationIds={generationIds}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 text-[11px] text-[#ccc]">
        Powered by Claude · Anthropic
      </div>
    </div>
  );
}
