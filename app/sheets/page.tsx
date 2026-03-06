"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { SheetsTable } from "@/components/sheets-table";
import type { SheetRow } from "@/types";

const cardStyle = {
  background: "white",
  border: "1px solid #e8e8e6",
  borderRadius: "10px",
  padding: "20px",
};

export default function SheetsPage() {
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [generatingRows, setGeneratingRows] = useState<Set<number>>(new Set());
  const [errorRows, setErrorRows] = useState<Set<number>>(new Set());
  const [generatingAll, setGeneratingAll] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotConfigured(false);
    try {
      const res = await fetch("/api/sheets");
      const data = await res.json();
      if (res.status === 503) {
        setNotConfigured(true);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setRows(data.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const generateForRow = useCallback(async (rowIndex: number) => {
    const row = rows.find((r) => r.rowIndex === rowIndex);
    if (!row) return;

    setGeneratingRows((prev) => new Set(prev).add(rowIndex));
    setErrorRows((prev) => {
      const next = new Set(prev);
      next.delete(rowIndex);
      return next;
    });

    try {
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rowIndex,
          topic: row.argomento,
          platform: row.piattaforma,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update the row locally with the new copy
      setRows((prev) =>
        prev.map((r) =>
          r.rowIndex === rowIndex
            ? { ...r, copy: data.copy, stato: "generato" as const }
            : r
        )
      );
    } catch {
      setErrorRows((prev) => new Set(prev).add(rowIndex));
    } finally {
      setGeneratingRows((prev) => {
        const next = new Set(prev);
        next.delete(rowIndex);
        return next;
      });
    }
  }, [rows]);

  const generateAll = useCallback(async () => {
    const emptyRows = rows.filter(
      (r) => r.copy.trim() === "" && r.stato !== "approvato"
    );
    if (emptyRows.length === 0) return;

    setGeneratingAll(true);

    // Generate sequentially to avoid API rate limits
    for (const row of emptyRows) {
      await generateForRow(row.rowIndex);
    }

    setGeneratingAll(false);
  }, [rows, generateForRow]);

  const emptyCount = rows.filter(
    (r) => r.copy.trim() === "" && r.stato !== "approvato"
  ).length;
  const totalCount = rows.length;
  const generatedCount = rows.filter((r) => r.stato === "generato").length;
  const approvedCount = rows.filter((r) => r.stato === "approvato").length;

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#f5f5f3", padding: "0 20px 64px" }}
    >
      <Header />

      <div className="w-full" style={{ maxWidth: "1040px" }}>
        {notConfigured ? (
          <div style={{ ...cardStyle, maxWidth: "600px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#222",
                marginBottom: "16px",
              }}
            >
              Configura Google Sheets
            </h2>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
              Per collegare il piano editoriale, servono 3 variabili d&apos;ambiente nel file{" "}
              <code
                style={{
                  background: "#f0f0ee",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "13px",
                }}
              >
                .env.local
              </code>
              :
            </p>
            <div
              style={{
                background: "#f8f8f6",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "13px",
                fontFamily: "monospace",
                lineHeight: "1.8",
                color: "#444",
                marginBottom: "20px",
                overflowX: "auto",
              }}
            >
              <div>GOOGLE_SERVICE_ACCOUNT_EMAIL=...@...iam.gserviceaccount.com</div>
              <div>GOOGLE_PRIVATE_KEY=&quot;-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n&quot;</div>
              <div>GOOGLE_SHEET_ID=1aBcDeFg...</div>
            </div>
            <ol
              style={{
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.8",
                paddingLeft: "20px",
                marginBottom: "20px",
              }}
            >
              <li>
                Crea un <strong>Service Account</strong> su{" "}
                <a
                  href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#E62B1E" }}
                >
                  Google Cloud Console
                </a>{" "}
                (gratuito)
              </li>
              <li>Abilita la <strong>Google Sheets API</strong> nel progetto</li>
              <li>Crea una chiave JSON e copia email + private key nelle env vars</li>
              <li>
                Condividi il foglio Google Sheets con l&apos;email del service account (come <strong>Editor</strong>)
              </li>
              <li>Copia l&apos;ID del foglio dall&apos;URL e mettilo in GOOGLE_SHEET_ID</li>
              <li>Riavvia il server dev</li>
            </ol>
            <p style={{ fontSize: "13px", color: "#999" }}>
              Struttura colonne di default: A=data, B=argomento, C=piattaforma, D=copy, E=stato
            </p>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div
              style={{
                ...cardStyle,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#666" }}>
                <span>
                  <strong style={{ color: "#222" }}>{totalCount}</strong> righe
                </span>
                <span>
                  <strong style={{ color: "#2e7d32" }}>{generatedCount}</strong> generati
                </span>
                <span>
                  <strong style={{ color: "#1565c0" }}>{approvedCount}</strong> approvati
                </span>
                <span>
                  <strong style={{ color: "#999" }}>{emptyCount}</strong> da generare
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={fetchRows}
                  disabled={loading}
                  style={{
                    padding: "7px 16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    borderRadius: "6px",
                    border: "1px solid #e8e8e6",
                    background: "white",
                    color: "#555",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Caricamento..." : "Aggiorna"}
                </button>

                <button
                  onClick={generateAll}
                  disabled={generatingAll || emptyCount === 0}
                  style={{
                    padding: "7px 16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    borderRadius: "6px",
                    border: "none",
                    background:
                      generatingAll || emptyCount === 0 ? "#e8e8e6" : "#E62B1E",
                    color: generatingAll || emptyCount === 0 ? "#999" : "white",
                    cursor:
                      generatingAll || emptyCount === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {generatingAll
                    ? `Generazione in corso... (${generatingRows.size}/${emptyCount})`
                    : `Genera tutti (${emptyCount})`}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  ...cardStyle,
                  marginBottom: "12px",
                  background: "#ffebee",
                  border: "1px solid #ffcdd2",
                  color: "#c62828",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            {/* Table */}
            <div style={{ ...cardStyle, padding: "0", overflow: "hidden" }}>
              {loading && rows.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  Caricamento piano editoriale...
                </div>
              ) : (
                <SheetsTable
                  rows={rows}
                  onGenerate={generateForRow}
                  generatingRows={generatingRows}
                  errorRows={errorRows}
                />
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-10 text-[11px] text-[#ccc]">
        Powered by Mattia - studiomatce
      </div>
    </div>
  );
}
