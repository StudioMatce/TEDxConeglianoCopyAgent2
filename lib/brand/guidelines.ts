import type { BrandGuidelines } from "@/types";

export const TEDX_CONEGLIANO_PRESET: BrandGuidelines = {
  nome: "TEDxConegliano",
  settore: "Evento culturale indipendente TEDx, comunità di Conegliano (Treviso)",
  target: "Curiosi, professionisti, studenti 20-55 anni, area Treviso e oltre",
  valori:
    "Diffondere idee di valore, crescita culturale, comunità, ispirazione, connessione tra passato e futuro",
  tono: "Ispirazionale e poetico, evocativo, riflessivo ma non elitario. Mai freddo o promozionale.",
  evitare:
    "Linguaggio commerciale aggressivo, slogan vuoti, tono burocratico, frasi generiche senza anima",
};

export const EMPTY_GUIDELINES: BrandGuidelines = {
  nome: "",
  settore: "",
  target: "",
  valori: "",
  tono: "",
  evitare: "",
};

export const BRAND_FIELDS: {
  key: keyof BrandGuidelines;
  label: string;
}[] = [
  { key: "nome", label: "Nome Brand" },
  { key: "settore", label: "Settore / Industria" },
  { key: "target", label: "Pubblico Target" },
  { key: "valori", label: "Valori del Brand" },
  { key: "tono", label: "Tono di Voce Base" },
  { key: "evitare", label: "Cose da Evitare" },
];
