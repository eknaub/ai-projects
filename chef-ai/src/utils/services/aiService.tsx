import { GoogleGenAI } from "@google/genai";
import { environment } from "../../environments/environment";

export const genAi = new GoogleGenAI({ apiKey: environment.geminiApiKey });
