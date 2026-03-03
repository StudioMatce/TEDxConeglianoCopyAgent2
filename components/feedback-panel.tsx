"use client";

import { useState } from "react";
import type { Platform } from "@/types";

interface FeedbackPanelProps {
  platform: Platform;
  generationId: string | null;
  generatedCopy: string;
}

export function FeedbackPanel({
  generationId,
}: FeedbackPanelProps) {
  const [rating, setRating] = useState(0);
  const [correction, setCorrection] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (rating === 0) return;
    setSaving(true);
    try {
      if (generationId) {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ generationId, rating, correction: correction || null }),
        });
      }
      setSaved(true);
    } catch {
      // Supabase not configured — still mark as saved locally
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-[#888]">✓ Feedback salvato</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase whitespace-nowrap">
          Quanto ti piace?
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n <= rating;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="w-6 h-6 flex items-center justify-center rounded transition-all cursor-pointer"
                style={{
                  background: active ? "#222" : "transparent",
                  color: active ? "white" : "#ccc",
                  fontSize: "11px",
                  fontWeight: 600,
                  border: active ? "none" : "1px solid #e0e0de",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Commento — sempre visibile */}
      <textarea
        placeholder="Note, correzioni, cosa cambieresti..."
        value={correction}
        onChange={(e) => setCorrection(e.target.value)}
        rows={2}
        className="w-full text-xs text-[#333] resize-none outline-none"
        style={{
          background: "#fafaf9",
          border: "1px solid #e8e8e6",
          borderRadius: "6px",
          padding: "8px 10px",
          lineHeight: 1.6,
        }}
      />

      {/* Salva */}
      <button
        type="button"
        onClick={handleSave}
        disabled={rating === 0 || saving}
        className="px-3.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer"
        style={{
          background: rating === 0 || saving ? "#f0f0ee" : "#222",
          color: rating === 0 || saving ? "#bbb" : "white",
          border: "none",
          cursor: rating === 0 ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Salvataggio..." : "Salva feedback"}
      </button>
    </div>
  );
}
