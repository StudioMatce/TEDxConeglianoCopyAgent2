export type Platform = "instagram" | "facebook" | "linkedin" | "email";

export interface StyleParams {
  lunghezza: number;
  tonoSimpatico: number;
  mistero: number;
  registro: number;
  emozione: number;
  creativita: number;
}

export const DEFAULT_STYLE_PARAMS: StyleParams = {
  lunghezza: 40,
  tonoSimpatico: 55,
  mistero: 60,
  registro: 35,
  emozione: 70,
  creativita: 65,
};

export interface BrandGuidelines {
  nome: string;
  settore: string;
  target: string;
  valori: string;
  tono: string;
  evitare: string;
}

export interface EditionTheme {
  active: boolean;
  titolo: string;
  descrizione: string;
}

export interface OutputOptions {
  secondaVersione: boolean;
  cta: boolean;
  hashtag: boolean;
  noteStrategiche: boolean;
}

export const DEFAULT_OUTPUT_OPTIONS: OutputOptions = {
  secondaVersione: false,
  cta: true,
  hashtag: true,
  noteStrategiche: false,
};

export interface GenerateRequest {
  topic: string;
  platform: Platform;
  styleParams: StyleParams;
  outputOptions: OutputOptions;
  brandGuidelines: BrandGuidelines | null;
  editionTheme: EditionTheme | null;
  imageData: string | null; // base64 data URL
}

export interface Generation {
  id: string;
  created_at: string;
  topic: string;
  platform: Platform;
  style_params: StyleParams;
  edition_theme_active: boolean;
  output_options: OutputOptions;
  generated_copy: string;
  rating: number | null;
  correction: string | null;
  model: string;
}

export type PlatformStatus = "idle" | "loading" | "done" | "error";

// --- Google Sheets / Piano Editoriale ---

export type SheetRowStatus = "vuoto" | "generato" | "approvato";

export interface SheetRow {
  rowIndex: number; // 1-based row in the sheet (header = row 1)
  data: string;
  argomento: string;
  piattaforma: Platform;
  copy: string;
  stato: SheetRowStatus;
}

export interface SheetConfig {
  columns: {
    data: string;        // e.g. "A"
    argomento: string;   // e.g. "B"
    piattaforma: string; // e.g. "C"
    copy: string;        // e.g. "D"
    stato: string;       // e.g. "E"
  };
  headerRow: number;     // usually 1
  sheetName: string;     // e.g. "Piano Editoriale"
}
