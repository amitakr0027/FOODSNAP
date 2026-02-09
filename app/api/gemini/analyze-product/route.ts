// import { GoogleGenAI } from "@google/genai"
// import { NextResponse } from "next/server"

// export const runtime = "nodejs"

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY!,
// })

// export async function POST(req: Request) {
//   try {
//     const { productName, brand, ingredients } = await req.json()

//     const prompt = `
// You are a food safety and nutrition expert.

// Analyze the following product and return STRICT JSON only.

// Product: ${productName}
// Brand: ${brand}
// Ingredients: ${ingredients}

// Return JSON in this exact format:

// {
//   "ingredientAnalysis": [
//     {
//       "ingredient": "string",
//       "status": "good | moderate | bad",
//       "reason": "short scientific reason"
//     }
//   ],
//   "dietaryPreferences": [
//     {
//       "name": "Vegetarian | Vegan | Gluten-Free | Dairy-Free | Nut-Free | Organic",
//       "found": true | false,
//       "reason": "short explanation"
//     }
//   ],
//   "audioSummary": "2-3 sentence spoken summary for users"
// }
// `

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: prompt,
//     })

//     const text = response.text

//     // Gemini sometimes wraps JSON in ``` — strip it safely
//     const cleanJson = text
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim()

//     return NextResponse.json({
//       success: true,
//       data: JSON.parse(cleanJson),
//     })
//   } catch (error: any) {
//     console.error("Gemini analysis error:", error)
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 },
//     )
//   }
// }


// 2nd best version of route.ts

// import { GoogleGenAI } from "@google/genai"
// import { NextResponse } from "next/server"

// export const runtime = "nodejs"

// // Initialize Gemini
// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY!,
// })

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { productName, brand, ingredients } = body

//     // Basic validation
//     if (!productName || !ingredients) {
//       return NextResponse.json(
//         { success: false, error: "Missing product data" },
//         { status: 400 },
//       )
//     }

//     // 🔮 Gemini Prompt
//     const prompt = `
// You are a food safety, nutrition, and public health expert.

// Analyze the following packaged food product and return STRICT JSON ONLY.
// DO NOT include markdown, explanation, or extra text.

// Product Name: ${productName}
// Brand: ${brand || "Unknown"}
// Ingredients: ${ingredients}

// Return JSON in EXACTLY this structure:

// {
//   "healthScore": number (0-100),
//   "scoreExplanation": [
//     "clear reason explaining major positive or negative factor",
//     "ingredient or nutrition based justification",
//     "moderation or long-term health advice"
//   ],
//   "ingredientAnalysis": [
//     {
//       "ingredient": "string",
//       "status": "good | moderate | bad",
//       "reason": "short scientific reason"
//     }
//   ],
//   "dietaryPreferences": [
//     {
//       "name": "Vegetarian | Vegan | Gluten-Free | Dairy-Free | Nut-Free | Organic",
//       "found": true | false,
//       "reason": "short explanation"
//     }
//   ],
//   "audioSummary": "2-3 sentence spoken summary for users"
// }
// `

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview", // ✅ Free tier
//       contents: prompt,
//     })

//     const rawText = response.text || ""

//     // 🧹 Safety cleanup (Gemini may wrap JSON)
//     const cleanJson = rawText
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim()

//     let parsed
//     try {
//       parsed = JSON.parse(cleanJson)
//     } catch (jsonError) {
//       console.error("❌ JSON Parse Failed:", cleanJson)
//       return NextResponse.json(
//         { success: false, error: "Invalid AI response format" },
//         { status: 500 },
//       )
//     }

//     // ✅ Hard safety defaults (frontend never breaks)
//     parsed.healthScore ??= 50
//     parsed.scoreExplanation ??= []
//     parsed.ingredientAnalysis ??= []
//     parsed.dietaryPreferences ??= []
//     parsed.audioSummary ??= "No summary available."

//     return NextResponse.json({
//       success: true,
//       data: parsed,
//     })
//   } catch (error) {
//     console.error("❌ Gemini analysis error:", error)

//     return NextResponse.json(
//       { success: false, error: "AI analysis failed" },
//       { status: 500 },
//     )
//   }
// }


// // 3rd best version or route.ts
// import { GoogleGenAI } from "@google/genai"
// import { NextResponse } from "next/server"

// export const runtime = "nodejs"

// // Initialize Gemini
// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY!,
// })

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { productName, brand, ingredients } = body

//     // Basic validation
//     if (!productName || !ingredients) {
//       return NextResponse.json(
//         { success: false, error: "Missing product data" },
//         { status: 400 },
//       )
//     }

//     // 🔮 Gemini Prompt (ANALYSIS + MULTI-LANGUAGE)
//     const prompt = `
// You are a food safety, nutrition, and public health expert.

// Analyze the following packaged food product and return STRICT JSON ONLY.
// DO NOT include markdown, explanations, or extra text.

// Product Name: ${productName}
// Brand: ${brand || "Unknown"}
// Ingredients: ${ingredients}

// Return JSON in EXACTLY this structure:

// {
//   "healthScore": number,
//   "scoreExplanation": [
//     "key negative or positive factor",
//     "ingredient-based reasoning",
//     "long-term or moderation advice"
//   ],
//   "ingredientAnalysis": [
//     {
//       "ingredient": "string",
//       "status": "good | moderate | bad",
//       "reason": "short scientific reason"
//     }
//   ],
//   "dietaryPreferences": [
//     {
//       "name": "Vegetarian | Vegan | Gluten-Free | Dairy-Free | Nut-Free | Organic",
//       "found": true | false,
//       "reason": "short explanation"
//     }
//   ],
//   "audioSummary": "2-3 sentence spoken summary in English",
//   "translations": {
//     "hi": "Hindi summary",
//     "bn": "Bengali summary",
//     "ta": "Tamil summary",
//     "te": "Telugu summary",
//     "mr": "Marathi summary",
//     "gu": "Gujarati summary",
//     "pa": "Punjabi summary",
//     "ur": "Urdu summary",
//     "ml": "Malayalam summary",
//     "kn": "Kannada summary",
//     "or": "Odia summary",
//     "as": "Assamese summary",
//     "es": "Spanish summary",
//     "fr": "French summary",
//     "de": "German summary",
//     "pt": "Portuguese summary",
//     "ru": "Russian summary",
//     "ja": "Japanese summary",
//     "ko": "Korean summary",
//     "zh": "Chinese summary",
//     "ar": "Arabic summary"
//   }
// }
// `

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview", // ✅ Free tier
//       contents: prompt,
//     })

//     const rawText = response.text || ""

//     // 🧹 Cleanup (Gemini sometimes wraps JSON)
//     const cleanJson = rawText
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim()

//     let parsed: any
//     try {
//       parsed = JSON.parse(cleanJson)
//     } catch {
//       console.error("❌ JSON Parse Failed:", cleanJson)
//       return NextResponse.json(
//         { success: false, error: "Invalid AI response format" },
//         { status: 500 },
//       )
//     }

//     // 🛡️ Hard safety defaults (frontend never crashes)
//     parsed.healthScore ??= 50
//     parsed.scoreExplanation ??= []
//     parsed.ingredientAnalysis ??= []
//     parsed.dietaryPreferences ??= []
//     parsed.audioSummary ??= "No summary available."
//     parsed.translations ??= {}

//     return NextResponse.json({
//       success: true,
//       data: parsed,
//     })
//   } catch (error) {
//     console.error("❌ Gemini analysis error:", error)

//     return NextResponse.json(
//       { success: false, error: "AI analysis failed" },
//       { status: 500 },
//     )
//   }
// }


import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productName, brand, ingredients } = body

    // Basic validation
    if (!productName || !ingredients) {
      return NextResponse.json(
        { success: false, error: "Missing product data" },
        { status: 400 },
      )
    }

    // 🔮 Gemini Prompt (UPDATED – minimal but powerful)
    const prompt = `
You are a food safety, nutrition, and public health expert.

Analyze the packaged food product and return STRICT JSON ONLY.
NO markdown. NO extra text.

Product Name: ${productName}
Brand: ${brand || "Unknown"}
Ingredients: ${ingredients}

Return JSON in EXACTLY this structure:

{
  "healthScore": number (0-100),
  "scoreGrade": "A | B | C | D | E",

  "benefits": [
    "short positive health aspect",
    "ingredient-based benefit"
  ],

  "warnings": [
    "key health concern",
    "ingredient or processing risk"
  ],

  "dailyConsumption": "Yes | No | Occasionally with reason",

  "scoreExplanation": [
    "main factor affecting score",
    "ingredient-based reasoning",
    "long-term moderation advice"
  ],

  "ingredientAnalysis": [
    {
      "ingredient": "string",
      "status": "good | moderate | bad",
      "reason": "short scientific reason"
    }
  ],

  "dietaryPreferences": [
    {
      "name": "Vegetarian | Vegan | Gluten-Free | Dairy-Free | Nut-Free | Organic",
      "found": true | false,
      "reason": "short explanation"
    }
  ],

  "audioSummary": "2-3 sentence spoken summary in English",

  "translations": {
    "hi": "Hindi summary",
    "bn": "Bengali summary",
    "ta": "Tamil summary",
    "te": "Telugu summary",
    "mr": "Marathi summary",
    "gu": "Gujarati summary",
    "pa": "Punjabi summary",
    "ur": "Urdu summary",
    "ml": "Malayalam summary",
    "kn": "Kannada summary",
    "or": "Odia summary",
    "as": "Assamese summary",
    "es": "Spanish summary",
    "fr": "French summary",
    "de": "German summary",
    "pt": "Portuguese summary",
    "ru": "Russian summary",
    "ja": "Japanese summary",
    "ko": "Korean summary",
    "zh": "Chinese summary",
    "ar": "Arabic summary"
  }
}
`

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // ✅ Free tier
      contents: prompt,
    })

    const rawText = response.text || ""

    // 🧹 Cleanup (Gemini safety)
    const cleanJson = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    let parsed: any
    try {
      parsed = JSON.parse(cleanJson)
    } catch {
      console.error("❌ JSON Parse Failed:", cleanJson)
      return NextResponse.json(
        { success: false, error: "Invalid AI response format" },
        { status: 500 },
      )
    }

    // 🛡️ Hard defaults (frontend NEVER breaks)
    parsed.healthScore ??= 50
    parsed.scoreGrade ??= "C"
    parsed.benefits ??= []
    parsed.warnings ??= []
    parsed.dailyConsumption ??= "Consume in moderation."
    parsed.scoreExplanation ??= []
    parsed.ingredientAnalysis ??= []
    parsed.dietaryPreferences ??= []
    parsed.audioSummary ??= "No summary available."
    parsed.translations ??= {}

    return NextResponse.json({
      success: true,
      data: parsed,
    })
  } catch (error) {
    console.error("❌ Gemini analysis error:", error)

    return NextResponse.json(
      { success: false, error: "AI analysis failed" },
      { status: 500 },
    )
  }
}
