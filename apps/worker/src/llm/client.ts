import { GoogleGenAI } from "@google/genai";

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
}

let _genAI: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    _genAI = new GoogleGenAI({ apiKey });
  }
  return _genAI;
}
