"use client";

import { useState } from "react";
import type { SheetRow, Platform } from "@/types";

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  email: "Email",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  vuoto: { bg: "#f0f0ee", text: "#999", label: "Vuoto" },
  generato: { bg: "#e8f5e9", text: "#2e7d32", label: "Generato" },
  approvato: { bg: "#e3f2fd", text: "#1565c0", label: "Approvato" },
  generating: { bg: "#fff8e1", text: "#f57f17", label: "Genera..." },
  error: { bg: "#ffebee", text: "#c62828", label: "Errore" },
};

interface SheetsTableProps {
  rows: SheetRow[];
  onGenerate: (rowIndex: number) => Promise<void>;
  generatingRows: Set<number>;
  errorRows: Set<number>;
}

export function SheetsTable({
  rows,
  onGenerate,
  generatingRows,
  errorRows,
}: SheetsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const getRowStatus = (row: SheetRow) => {
    if (generatingRows.has(row.rowIndex)) return "generating";
    if (errorRows.has(row.rowIndex)) return "error";
    return row.stato;
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr
            style={{
              borderBottom: "2px solid #e8e8e6",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "10px 12px", fontWeight: 600, color: "#555", width: "100px" }}>
              Data
            </th>
            <th style={{ padding: "10px 12px", fontWeight: 600, color: "#555" }}>
              Argomento
            </th>
            <th style={{ padding: "10px 12px", fontWeight: 600, color: "#555", width: "110px" }}>
              Piattaforma
            </th>
            <th style={{ padding: "10px 12px", fontWeight: 600, color: "#555", width: "90px" }}>
              Stato
            </th>
            <th style={{ padding: "10px 12px", fontWeight: 600, color: "#555", width: "100px", textAlign: "center" }}>
              Azioni
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = getRowStatus(row);
            const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.vuoto;
            const isExpanded = expandedRow === row.rowIndex;
            const hasCopy = row.copy.trim().length > 0;

            return (
              <tr
                key={row.rowIndex}
                style={{
                  borderBottom: "1px solid #e8e8e6",
                  background: isExpanded ? "#fafaf8" : "transparent",
                  cursor: hasCopy ? "pointer" : "default",
                }}
                onClick={() => {
                  if (hasCopy) setExpandedRow(isExpanded ? null : row.rowIndex);
                }}
              >
                <td style={{ padding: "10px 12px", color: "#666", whiteSpace: "nowrap" }}>
                  {row.data}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontWeight: 500, color: "#222" }}>{row.argomento}</div>
                  {isExpanded && hasCopy && (
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "10px 12px",
                        background: "white",
                        border: "1px solid #e8e8e6",
                        borderRadius: "6px",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        color: "#444",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {row.copy}
                    </div>
                  )}
                </td>
                <td style={{ padding: "10px 12px", color: "#555" }}>
                  {PLATFORM_LABELS[row.piattaforma]}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 500,
                      background: statusStyle.bg,
                      color: statusStyle.text,
                    }}
                  >
                    {statusStyle.label}
                  </span>
                </td>
                <td
                  style={{ padding: "10px 12px", textAlign: "center" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {status !== "approvato" && (
                    <button
                      onClick={() => onGenerate(row.rowIndex)}
                      disabled={generatingRows.has(row.rowIndex)}
                      style={{
                        padding: "5px 14px",
                        fontSize: "12px",
                        fontWeight: 500,
                        borderRadius: "6px",
                        border: "none",
                        cursor: generatingRows.has(row.rowIndex)
                          ? "not-allowed"
                          : "pointer",
                        background: generatingRows.has(row.rowIndex)
                          ? "#e8e8e6"
                          : "#E62B1E",
                        color: generatingRows.has(row.rowIndex) ? "#999" : "white",
                        transition: "background 0.15s",
                      }}
                    >
                      {generatingRows.has(row.rowIndex)
                        ? "..."
                        : hasCopy
                          ? "Rigenera"
                          : "Genera"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#999",
            fontSize: "14px",
          }}
        >
          Nessuna riga trovata nel foglio. Verifica la configurazione.
        </div>
      )}
    </div>
  );
}
