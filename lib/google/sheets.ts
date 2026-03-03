import { google } from "googleapis";
import type { SheetRow, SheetConfig, Platform, SheetRowStatus } from "@/types";

// Default column mapping — configurable via GOOGLE_SHEET_COLUMNS env var
const DEFAULT_CONFIG: SheetConfig = {
  columns: {
    data: "A",
    argomento: "B",
    piattaforma: "C",
    copy: "D",
    stato: "E",
  },
  headerRow: 1,
  sheetName: "Piano Editoriale",
};

function getConfig(): SheetConfig {
  const envColumns = process.env.GOOGLE_SHEET_COLUMNS;
  if (!envColumns) return DEFAULT_CONFIG;

  try {
    const parsed = JSON.parse(envColumns);
    return {
      columns: { ...DEFAULT_CONFIG.columns, ...parsed.columns },
      headerRow: parsed.headerRow ?? DEFAULT_CONFIG.headerRow,
      sheetName: parsed.sheetName ?? DEFAULT_CONFIG.sheetName,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) return null;

  // The key may have escaped newlines from env
  const key = rawKey.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetId(): string | null {
  return process.env.GOOGLE_SHEET_ID ?? null;
}

const VALID_PLATFORMS: Platform[] = ["instagram", "facebook", "linkedin", "email"];

function parsePlatform(raw: string): Platform {
  const lower = raw.trim().toLowerCase();
  if (VALID_PLATFORMS.includes(lower as Platform)) return lower as Platform;
  // Common aliases
  if (lower === "ig" || lower === "insta") return "instagram";
  if (lower === "fb") return "facebook";
  if (lower === "li" || lower === "in") return "linkedin";
  if (lower === "mail" || lower === "em") return "email";
  return "instagram"; // fallback
}

function parseStatus(raw: string): SheetRowStatus {
  const lower = raw.trim().toLowerCase();
  if (lower === "approvato" || lower === "ok" || lower === "approved") return "approvato";
  if (lower === "generato" || lower === "generated" || lower === "done") return "generato";
  return "vuoto";
}

export async function readRows(): Promise<SheetRow[]> {
  const auth = getAuth();
  const sheetId = getSheetId();
  if (!auth || !sheetId) return [];

  const config = getConfig();
  const sheets = google.sheets({ version: "v4", auth });

  // Read all columns in a single range (from column A to the last configured column)
  const allCols = Object.values(config.columns).sort();
  const firstCol = allCols[0];
  const lastCol = allCols[allCols.length - 1];
  const startRow = config.headerRow + 1; // skip header

  const range = `'${config.sheetName}'!${firstCol}${startRow}:${lastCol}1000`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = res.data.values ?? [];
  const { columns } = config;

  // Convert column letters to 0-based indices relative to firstCol
  const colIndex = (col: string) => col.charCodeAt(0) - firstCol.charCodeAt(0);

  return rows
    .map((row, i) => ({
      rowIndex: startRow + i,
      data: (row[colIndex(columns.data)] ?? "").toString(),
      argomento: (row[colIndex(columns.argomento)] ?? "").toString(),
      piattaforma: parsePlatform((row[colIndex(columns.piattaforma)] ?? "").toString()),
      copy: (row[colIndex(columns.copy)] ?? "").toString(),
      stato: parseStatus((row[colIndex(columns.stato)] ?? "").toString()),
    }))
    .filter((row) => row.argomento.trim() !== ""); // skip empty rows
}

export async function writeCopy(rowIndex: number, copy: string): Promise<void> {
  const auth = getAuth();
  const sheetId = getSheetId();
  if (!auth || !sheetId) return;

  const config = getConfig();
  const sheets = google.sheets({ version: "v4", auth });

  const copyCell = `'${config.sheetName}'!${config.columns.copy}${rowIndex}`;
  const statusCell = `'${config.sheetName}'!${config.columns.stato}${rowIndex}`;

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        { range: copyCell, values: [[copy]] },
        { range: statusCell, values: [["generato"]] },
      ],
    },
  });
}

export function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );
}
