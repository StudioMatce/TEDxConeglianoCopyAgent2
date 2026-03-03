import { streamText } from "ai";
import { anthropic, MODEL_ID } from "@/lib/ai/provider";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/system";
import { getTopExamples } from "@/lib/feedback/queries";
import type { GenerateRequest } from "@/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body: GenerateRequest = await req.json();
  const {
    topic,
    platform,
    styleParams,
    outputOptions,
    brandGuidelines,
    editionTheme,
    imageData,
  } = body;

  // Fetch few-shot examples from Supabase (gracefully handles missing config)
  const examples = await getTopExamples(platform, 3);

  const systemPrompt = buildSystemPrompt(
    platform,
    brandGuidelines,
    editionTheme,
    examples
  );
  const userPrompt = buildUserPrompt(topic, platform, styleParams, outputOptions);

  // Build message content: text + optional image
  const content: Array<{ type: "text"; text: string } | { type: "image"; image: string }> = [];

  if (imageData) {
    content.push({ type: "image", image: imageData });
    content.push({
      type: "text",
      text: topic.trim()
        ? `L'utente ha caricato l'immagine del post qui sopra. Usala come contesto visivo per scrivere il copy.\n\n${userPrompt}`
        : `L'utente ha caricato l'immagine del post qui sopra. Analizzala e genera il copy basandoti su quello che vedi.\n\n${userPrompt}`,
    });
  } else {
    content.push({ type: "text", text: userPrompt });
  }

  const result = streamText({
    model: anthropic(MODEL_ID),
    system: systemPrompt,
    messages: [{ role: "user", content }],
    maxOutputTokens: 1400,
  });

  return result.toTextStreamResponse();
}
