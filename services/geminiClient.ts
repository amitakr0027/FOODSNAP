import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY, // REQUIRED
});

export async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // FREE TIER
    contents: "Reply with only the word OK",
  });

  console.log(response.text);
}
