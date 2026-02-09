// import { GoogleGenAI } from "@google/genai"
// import { NextResponse } from "next/server"

// export const runtime = "nodejs"

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY!,
// })

// export async function POST(req: Request) {
//   try {
//     const {
//       productName,
//       ingredients,
//       healthScore,
//       userMessage,
//       conversationHistory = [],
//     } = await req.json()

//     if (!userMessage || !productName) {
//       return NextResponse.json(
//         { success: false, error: "Missing chat input" },
//         { status: 400 },
//       )
//     }

//     const historyText = conversationHistory
//       .map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
//       .join("\n")

//     const prompt = `
// You are Gemini, a food & nutrition expert.

// Product: ${productName}
// Ingredients: ${ingredients}
// AI Health Score: ${healthScore}/100

// Conversation so far:
// ${historyText}

// User question:
// ${userMessage}

// Answer clearly, scientifically, and briefly.
// Avoid medical diagnosis.
// `

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: prompt,
//     })

//     return NextResponse.json({
//       success: true,
//       response: response.text,
//     })
//   } catch (error) {
//     console.error("Gemini chat error:", error)
//     return NextResponse.json(
//       { success: false, error: "Chat failed" },
//       { status: 500 },
//     )
//   }
// }




// import { GoogleGenAI } from "@google/genai"
// import { NextResponse } from "next/server"

// export const runtime = "nodejs"

// // Initialize Gemini
// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY!,
// })

// export async function POST(req: Request) {
//   try {
//     const {
//       productName,
//       ingredients,
//       healthScore,
//       userMessage,
//       conversationHistory = [],
//     } = await req.json()

//     // 🔐 Validation
//     if (!userMessage || !productName) {
//       return NextResponse.json(
//         { success: false, error: "Missing chat input" },
//         { status: 400 },
//       )
//     }

//     // 🧠 Conversation memory (lightweight)
//     const historyText = conversationHistory
//       .slice(-6) // keep last 6 turns only
//       .map(
//         (m: any) =>
//           `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`,
//       )
//       .join("\n")

//     // 🧠 Structured Gemini Prompt
//     const prompt = `
// You are Gemini, a food & nutrition expert AI.

// Answer the user's question based ONLY on food science and public health.
// Do NOT provide medical diagnosis.

// Product Name: ${productName}
// Ingredients: ${ingredients}
// AI Health Score: ${healthScore}/100

// Conversation so far:
// ${historyText}

// User Question:
// ${userMessage}

// Return STRICT JSON ONLY in this exact structure.
// Do NOT include markdown, bullet symbols, or extra text.

// {
//   "verdict": "Yes | No | Occasionally",
//   "summary": "1-line clear answer for normal users",
//   "reasons": [
//     {
//       "title": "Short heading",
//       "description": "Simple, non-technical explanation"
//     }
//   ],
//   "recommendation": "Practical advice (how often or safer alternative)"
// }
// `

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview", // ✅ Free tier
//       contents: prompt,
//     })

//     const rawText = response.text || ""

//     // 🧹 Safety cleanup
//     const cleanJson = rawText
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim()

//     let parsed
//     try {
//       parsed = JSON.parse(cleanJson)
//     } catch (err) {
//       console.error("❌ Gemini JSON parse failed:", cleanJson)
//       return NextResponse.json(
//         { success: false, error: "Invalid AI response format" },
//         { status: 500 },
//       )
//     }

//     // 🛡️ Hard defaults (frontend never crashes)
//     parsed.verdict ??= "Occasionally"
//     parsed.summary ??= "Consume in moderation."
//     parsed.reasons ??= []
//     parsed.recommendation ??= "Balance with whole foods."

//     return NextResponse.json({
//       success: true,
//       data: parsed,
//     })
//   } catch (error) {
//     console.error("❌ Gemini chat error:", error)

//     return NextResponse.json(
//       { success: false, error: "Chat failed" },
//       { status: 500 },
//     )
//   }
// }



import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const {
      productName,
      ingredients,
      healthScore,
      userMessage,
      userContext = {}, // 👈 NEW
      conversationHistory = [],
    } = await req.json()

    if (!userMessage || !productName) {
      return NextResponse.json(
        { success: false, error: "Missing chat input" },
        { status: 400 },
      )
    }

    const historyText = conversationHistory
      .slice(-6)
      .map(
        (m: any) =>
          `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`,
      )
      .join("\n")

    const prompt = `
You are Gemini, a friendly, empathetic food & nutrition expert.

Your goal:
- Answer like a HUMAN expert, not a textbook
- Be empathetic and reassuring
- Personalize advice based on the user's situation
- Avoid medical diagnosis
- Use simple language

USER CONTEXT:
Age Group: ${userContext.ageGroup || "Unknown"}
Health Conditions: ${userContext.conditions?.join(", ") || "None"}
Diet Goal: ${userContext.goal || "General health"}

PRODUCT DETAILS:
Name: ${productName}
Ingredients: ${ingredients}
AI Health Score: ${healthScore}/100

Conversation so far:
${historyText}

User question:
"${userMessage}"

RESPONSE RULES:
- Start with a clear, friendly answer
- Explain WHY in simple terms
- Give practical advice
- Be supportive, not judgmental

Return JSON ONLY in this format:

{
  "tone": "friendly | cautionary | positive",
  "opening": "1 empathetic sentence",
  "mainAnswer": "Clear human explanation (2–3 sentences)",
  "keyPoints": [
    "short point 1",
    "short point 2"
  ],
  "practicalTip": "What the user can do instead or how to consume safely"
}
`

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    })

    const cleanJson = (response.text || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(cleanJson)

    return NextResponse.json({
      success: true,
      data: parsed,
    })
  } catch (err) {
    console.error("Gemini chat error:", err)
    return NextResponse.json(
      { success: false, error: "Chat failed" },
      { status: 500 },
    )
  }
}
