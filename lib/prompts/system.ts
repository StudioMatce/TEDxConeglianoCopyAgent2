import type {
  BrandGuidelines,
  EditionTheme,
  OutputOptions,
  Platform,
  StyleParams,
} from "@/types";
import { PLATFORM_RULES } from "./platform-rules";
import { styleParamsToText } from "./style-params";
import type { Generation } from "@/types";

function buildBrandSection(guidelines: BrandGuidelines | null): string {
  if (!guidelines || !guidelines.nome) return "";
  return `## LINEE GUIDA DEL BRAND — Priorità assoluta
- **Nome:** ${guidelines.nome}
- **Settore:** ${guidelines.settore}
- **Pubblico target:** ${guidelines.target}
- **Valori:** ${guidelines.valori}
- **Tono di voce:** ${guidelines.tono}
- **Da evitare:** ${guidelines.evitare}`;
}

function buildEditionSection(theme: EditionTheme | null): string {
  if (!theme || !theme.active) return "";
  return `## TEMA DELL'EDIZIONE
**${theme.titolo}**
${theme.descrizione}

Integra il tema dell'edizione nel copy in modo naturale e evocativo.`;
}

function buildOutputSection(options: OutputOptions): string {
  const sections = ["1. **Copy principale** — il testo pronto per la pubblicazione"];
  let n = 2;
  if (options.secondaVersione) {
    sections.push(
      `${n}. **Seconda versione** — un approccio alternativo allo stesso tema`
    );
    n++;
  }
  if (options.cta) {
    sections.push(
      `${n}. **CTA** — una call-to-action efficace per la piattaforma`
    );
    n++;
  }
  if (options.hashtag) {
    sections.push(
      `${n}. **Hashtag** — hashtag rilevanti, rispettando le regole della piattaforma`
    );
    n++;
  }
  if (options.noteStrategiche) {
    sections.push(
      `${n}. **Note strategiche** — 2-3 osservazioni su perché il copy funziona`
    );
  }
  const excluded: string[] = [];
  if (!options.secondaVersione) excluded.push("seconda versione");
  if (!options.cta) excluded.push("CTA");
  if (!options.hashtag) excluded.push("hashtag");
  if (!options.noteStrategiche) excluded.push("note strategiche");

  let text = `## OUTPUT RICHIESTO
${sections.join("\n")}`;

  if (excluded.length) {
    text += `\n\nNON includere: ${excluded.join(", ")}. Omettili completamente dal copy.`;
  }

  return text;
}

function buildFewShotSection(examples: Generation[]): string {
  if (!examples.length) return "";

  const exampleTexts = examples.map(
    (ex, i) =>
      `### Esempio ${i + 1} (rating: ${ex.rating}/5)
**Tema:** ${ex.topic}
**Copy:**
${ex.generated_copy}`
  );

  let section = `## ESEMPI DI COPY CHE CI PIACCIONO
${exampleTexts.join("\n\n")}`;

  const corrections = examples
    .filter((ex) => ex.correction)
    .map((ex) => `- Tema "${ex.topic}": ${ex.correction}`);

  if (corrections.length) {
    section += `\n\n## CORREZIONI FREQUENTI
${corrections.join("\n")}`;
  }

  return section;
}

export function buildSystemPrompt(
  platform: Platform,
  brandGuidelines: BrandGuidelines | null,
  editionTheme: EditionTheme | null,
  examples: Generation[] = []
): string {
  const parts = [
    "Sei un copywriter esperto specializzato in comunicazione per eventi TEDx. Scrivi in italiano.",
    buildBrandSection(brandGuidelines),
    buildEditionSection(editionTheme),
    PLATFORM_RULES[platform],
    buildFewShotSection(examples),
  ].filter(Boolean);

  return parts.join("\n\n");
}

export function buildUserPrompt(
  topic: string,
  platform: Platform,
  styleParams: StyleParams,
  outputOptions: OutputOptions
): string {
  return `## TASK
Scrivi un copy ottimizzato per ${platform.charAt(0).toUpperCase() + platform.slice(1)} sul tema: "${topic}"

## PARAMETRI DI STILE — RISPETTALI CON PRECISIONE
I parametri qui sotto sono impostati dall'utente. Ogni valore va da 0 a 100. Adatta il copy esattamente a questi valori:
${styleParamsToText(styleParams)}

IMPORTANTE: La lunghezza del copy principale DEVE corrispondere a quanto indicato. Se il valore è basso, scrivi poche righe. Se è alto, sviluppa di più.

${buildOutputSection(outputOptions)}

Scrivi direttamente il copy, senza premesse o spiegazioni meta. Usa i titoli in grassetto (**Titolo**) per separare le sezioni dell'output.`;
}
