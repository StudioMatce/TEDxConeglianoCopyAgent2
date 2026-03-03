import { NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic, MODEL_ID } from "@/lib/ai/provider";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/system";
import { getTopExamples } from "@/lib/feedback/queries";
import { readRows, writeCopy, isConfigured } from "@/lib/google/sheets";
import { TEDX_CONEGLIANO_PRESET } from "@/lib/brand/guidelines";
import { CURRENT_EDITION } from "@/lib/brand/edition";
import { DEFAULT_STYLE_PARAMS, DEFAULT_OUTPUT_OPTIONS } from "@/types";
import type { Platform } from "@/types";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Google Sheets non configurato. Aggiungi le env vars." },
      { status: 503 }
    );
  }

  try {
    const rows = await readRows();
    return NextResponse.json({ rows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore lettura foglio";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Google Sheets non configurato." },
      { status: 503 }
    );
  }

  const { rowIndex, topic, platform } = (await req.json()) as {
    rowIndex: number;
    topic: string;
    platform: Platform;
  };

  if (!rowIndex || !topic || !platform) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  try {
    const examples = await getTopExamples(platform, 3);

    const brandGuidelines = TEDX_CONEGLIANO_PRESET;
    const editionTheme = CURRENT_EDITION.active ? CURRENT_EDITION : null;

    const systemPrompt = buildSystemPrompt(
      platform,
      brandGuidelines,
      editionTheme,
      examples
    );

    // For sheets, generate just the main copy — no hashtag/CTA extras
    const outputOptions = {
      ...DEFAULT_OUTPUT_OPTIONS,
      secondaVersione: false,
      noteStrategiche: false,
    };

    const userPrompt = buildUserPrompt(
      topic,
      platform,
      DEFAULT_STYLE_PARAMS,
      outputOptions
    );

    const result = await generateText({
      model: anthropic(MODEL_ID),
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      maxOutputTokens: 1400,
    });

    const copy = result.text;

    // Write back to Google Sheets
    await writeCopy(rowIndex, copy);

    return NextResponse.json({ copy, rowIndex });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore generazione";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
