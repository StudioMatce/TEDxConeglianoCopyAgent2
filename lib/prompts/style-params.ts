import type { StyleParams } from "@/types";

interface SliderMeta {
  key: keyof StyleParams;
  label: string;
  min: string;
  max: string;
}

export const SLIDER_META: SliderMeta[] = [
  { key: "lunghezza", label: "Lunghezza", min: "Breve", max: "Lungo" },
  { key: "tonoSimpatico", label: "Tono simpatico", min: "Serio", max: "Esilarante" },
  { key: "mistero", label: "Mistero", min: "Diretto", max: "Enigmatico" },
  { key: "registro", label: "Registro", min: "Casual", max: "Formale" },
  { key: "emozione", label: "Emozione", min: "Neutro", max: "Intenso" },
  { key: "creativita", label: "Creatività", min: "Classico", max: "Avanguardia" },
];

type DescriptionFive = [string, string, string, string, string];

const CONTEXTUAL_DESCRIPTIONS: Record<keyof StyleParams, DescriptionFive> = {
  lunghezza: [
    "ultra-breve (1-2 righe, una frase d'impatto)",
    "breve (2-3 righe, vai dritto al punto)",
    "medio (3-4 righe, conciso ma completo)",
    "lungo (4-5 righe, sviluppa il tema restando social)",
    "massimo per social (5-6 righe, il più lungo accettabile per un post social)",
  ],
  tonoSimpatico: [
    "molto serio e professionale, zero ironia",
    "serio con rari tocchi leggeri",
    "equilibrato, naturale con qualche tocco leggero",
    "simpatico e spiritoso, tono amichevole",
    "esilarante, giocoso e divertente",
  ],
  mistero: [
    "completamente diretto e trasparente",
    "chiaro con qualche sfumatura",
    "equilibrio tra chiarezza e intrigo",
    "intrigante, lascia domande aperte",
    "enigmatico e misterioso, suggerisci senza svelare",
  ],
  registro: [
    "molto casual e colloquiale, come parlare a un amico",
    "informale ma curato",
    "semi-formale, accessibile e professionale",
    "formale ed elegante",
    "molto formale, linguaggio ricercato e sofisticato",
  ],
  emozione: [
    "neutro e puramente informativo",
    "leggermente emotivo, accenni di coinvolgimento",
    "moderatamente emotivo",
    "emotivo e coinvolgente",
    "intensamente emotivo, punta alla pancia e al cuore",
  ],
  creativita: [
    "classico e convenzionale, struttura lineare",
    "tradizionale con qualche variazione",
    "moderatamente creativo",
    "creativo, con struttura e linguaggio inaspettati",
    "avanguardistico, struttura sorprendente e linguaggio audace",
  ],
};

function describeParam(key: keyof StyleParams, value: number): string {
  const d = CONTEXTUAL_DESCRIPTIONS[key];
  if (value <= 15) return d[0];
  if (value <= 35) return d[1];
  if (value <= 60) return d[2];
  if (value <= 80) return d[3];
  return d[4];
}

export function styleParamsToText(params: StyleParams): string {
  const lines = SLIDER_META.map((s) => {
    const value = params[s.key];
    const description = describeParam(s.key, value);
    return `- ${s.label} (${value}/100): ${description}`;
  });
  return lines.join("\n");
}
