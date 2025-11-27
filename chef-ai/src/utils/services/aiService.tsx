import { GoogleGenAI } from "@google/genai";

export const genAi = new GoogleGenAI({
  apiKey: import.meta.env.VITE_AI_API_KEY,
});
