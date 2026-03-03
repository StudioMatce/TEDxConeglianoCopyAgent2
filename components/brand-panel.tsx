"use client";

import { useState } from "react";
import type { BrandGuidelines, EditionTheme } from "@/types";
import { TEDX_CONEGLIANO_PRESET, EMPTY_GUIDELINES, BRAND_FIELDS } from "@/lib/brand/guidelines";
import { CURRENT_EDITION } from "@/lib/brand/edition";

interface BrandPanelProps {
  guidelines: BrandGuidelines;
  onGuidelinesChange: (g: BrandGuidelines) => void;
  editionTheme: EditionTheme;
  onEditionThemeChange: (e: EditionTheme) => void;
}

export function BrandPanel({
  guidelines,
  onGuidelinesChange,
  editionTheme,
  onEditionThemeChange,
}: BrandPanelProps) {
  const [open, setOpen] = useState(false);
  const hasBrand = Object.values(guidelines).some((v) => v.trim());

  const loadPreset = () => {
    onGuidelinesChange({ ...TEDX_CONEGLIANO_PRESET });
    onEditionThemeChange({ ...CURRENT_EDITION, active: editionTheme.active });
  };

  const clearAll = () => {
    onGuidelinesChange({ ...EMPTY_GUIDELINES });
    onEditionThemeChange({ active: false, titolo: "", descrizione: "" });
  };

  const updateField = (key: keyof BrandGuidelines, value: string) => {
    onGuidelinesChange({ ...guidelines, [key]: value });
  };

  return (
    <div>
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-3.5 px-5 cursor-pointer"
        style={{ background: "none", border: "none" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: hasBrand ? "#444" : "#ddd" }}
          />
          <span className="text-xs font-medium text-[#444]">Brand Guidelines</span>
          {hasBrand && (
            <span className="text-xs text-[#aaa]">— {guidelines.nome}</span>
          )}
        </div>
        <span
          className="text-xs text-[#bbb] transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          ▾
        </span>
      </button>

      {/* Content */}
      {open && (
        <div
          className="px-5 pb-5"
          style={{ borderTop: "1px solid #f0f0ee", animation: "fadeIn 0.15s ease" }}
        >
          {/* Preset buttons */}
          <div className="flex gap-1.5 my-3.5">
            <button
              onClick={loadPreset}
              className="px-3 py-1.5 text-[11px] text-[#555] cursor-pointer"
              style={{ background: "#f5f5f3", border: "1px solid #e0e0de", borderRadius: "6px" }}
            >
              ↺ Carica TEDxConegliano
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 text-[11px] text-[#bbb] cursor-pointer"
              style={{ background: "white", border: "1px solid #eee", borderRadius: "6px" }}
            >
              Svuota
            </button>
          </div>

          {/* Brand fields */}
          <div
            className="grid gap-2.5"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {BRAND_FIELDS.map((field) => (
              <div
                key={field.key}
                style={
                  field.key !== "nome"
                    ? { gridColumn: "span 2" }
                    : undefined
                }
              >
                <label className="block text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-1.5">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={guidelines[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-full text-xs text-[#333] outline-none"
                  style={{
                    background: "#fafaf9",
                    border: "1px solid #e8e8e6",
                    borderRadius: "6px",
                    padding: "8px 10px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Tema toggle */}
          <div
            className="mt-4 overflow-hidden"
            style={{ border: "1px solid #f0f0ee", borderRadius: "8px" }}
          >
            <div
              onClick={() =>
                onEditionThemeChange({ ...editionTheme, active: !editionTheme.active })
              }
              className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer"
              style={{ background: editionTheme.active ? "#fafaf9" : "white" }}
            >
              <div className="flex items-center gap-2.5">
                {/* Custom toggle */}
                <div
                  className="relative flex-shrink-0"
                  style={{
                    width: "32px",
                    height: "18px",
                    borderRadius: "9px",
                    background: editionTheme.active ? "#222" : "#e0e0de",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    className="absolute rounded-full bg-white"
                    style={{
                      width: "12px",
                      height: "12px",
                      top: "3px",
                      left: editionTheme.active ? "17px" : "3px",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: editionTheme.active ? "#222" : "#aaa" }}
                >
                  Tema dell&apos;edizione
                </span>
              </div>
              <span className="text-[10px] tracking-[0.06em]" style={{ color: editionTheme.active ? "#888" : "#ccc" }}>
                {editionTheme.active ? "ATTIVO" : "DISATTIVO"}
              </span>
            </div>

            {editionTheme.active && (
              <div
                className="px-3.5 pb-3.5"
                style={{ borderTop: "1px solid #f0f0ee", animation: "fadeIn 0.15s ease" }}
              >
                <div className="mt-3">
                  <label className="block text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-1.5">
                    Titolo del Tema
                  </label>
                  <input
                    type="text"
                    value={editionTheme.titolo}
                    onChange={(e) =>
                      onEditionThemeChange({ ...editionTheme, titolo: e.target.value })
                    }
                    placeholder="es. Invisibile"
                    className="w-full text-xs text-[#333] outline-none"
                    style={{
                      background: "#fafaf9",
                      border: "1px solid #e8e8e6",
                      borderRadius: "6px",
                      padding: "8px 10px",
                    }}
                  />
                </div>
                <div className="mt-2.5">
                  <label className="block text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-1.5">
                    Descrizione del Tema
                  </label>
                  <textarea
                    value={editionTheme.descrizione}
                    onChange={(e) =>
                      onEditionThemeChange({ ...editionTheme, descrizione: e.target.value })
                    }
                    placeholder="es. Un invito a guardare oltre ciò che si vede..."
                    rows={3}
                    className="w-full text-xs text-[#333] outline-none resize-none"
                    style={{
                      background: "#fafaf9",
                      border: "1px solid #e8e8e6",
                      borderRadius: "6px",
                      padding: "8px 10px",
                      lineHeight: 1.6,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
