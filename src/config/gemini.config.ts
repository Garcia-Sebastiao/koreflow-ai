import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const modelId = "gemini-3-flash-preview";

export const koreFlowConfig = {
  temperature: 0.3,
};

export { ai };
