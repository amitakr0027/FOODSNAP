export const runtime = "nodejs";

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY!, // ← now guaranteed
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Reply with only the word OK",
    });

    return NextResponse.json({
      success: true,
      result: response.text,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
