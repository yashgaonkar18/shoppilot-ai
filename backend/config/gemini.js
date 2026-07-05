import { GoogleGenAI } from "@google/genai";

// ✅ Lazy initialization — only creates client when first used
// Prevents crash on startup if GEMINI_API_KEY is not set yet
let _ai = null;

const getAI = () => {
  if (!_ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
};

// Proxy object so existing code using `ai.models.generateContent` still works
const ai = new Proxy({}, {
  get(_, prop) {
    return getAI()[prop];
  }
});

export default ai;