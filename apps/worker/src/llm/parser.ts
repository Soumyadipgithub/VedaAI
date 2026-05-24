import { GeneratedPaperSchema } from "@veda/shared-types";
import type { GeneratedPaper } from "@veda/shared-types";

export function parseLLMResponse(raw: string): GeneratedPaper {
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch?.[1]) text = fenceMatch[1].trim();

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    text = text.slice(jsonStart, jsonEnd + 1);
  }

  const parsed = JSON.parse(text) as unknown;
  return GeneratedPaperSchema.parse(parsed);
}
