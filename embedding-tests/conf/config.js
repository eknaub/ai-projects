import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { environment } from "./environment.js";

if (!environment.GEMINI_API_KEY)
  throw new Error("Gemini API key is missing or invalid.");
export const geminiAi = new GoogleGenAI({
  apiKey: environment.GEMINI_API_KEY,
});

const privateKey = environment.SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = environment.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export const supabase = createClient(url, privateKey);
