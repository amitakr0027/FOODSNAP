import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json()

    if (!rawText) {
      return NextResponse.json(
        { success: false, error: "No OCR text" },
        { status: 400 },
      )
    }

    const prompt = `
You are given OCR text from a food label.

Extract structured data.
DO NOT guess.
If something is unclear, return null.

Return JSON ONLY:

{
  "productName": string | null,
  "brand": string | null,
  "ingredients": string | null,
  "confidence": "high | medium | low"
}
`

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${prompt}\n\nOCR TEXT:\n${rawText}`,
    })

    const clean = (response.text || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(clean)

    return NextResponse.json({ success: true, data: parsed })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Label structuring failed" },
      { status: 500 },
    )
  }
}
