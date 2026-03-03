import { createAnthropic } from "@ai-sdk/anthropic";

export const anthropic = createAnthropic({
  // API key is read from ANTHROPIC_API_KEY env var automatically
});

export const MODEL_ID = "claude-sonnet-4-20250514";
