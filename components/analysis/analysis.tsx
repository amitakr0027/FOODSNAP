
"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Volume2,
  Star,
  AlertTriangle,
  BarChart3,
  Search,
  Utensils,
  Weight,
  X,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Lightbulb,
  MessageCircle,
  Send,
  Sparkles,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

interface Product {
  product_name?: string
  brands?: string
  nutriments?: Record<string, number>
  ingredients_text?: string
  nutrition_grades_tags?: string[]
  [key: string]: any
  _scanMethod?: string
  _scannedAt?: string
}

interface NutrientInfo {
  key: string
  label: string
  unit: string
  dangerLimit?: number
}

interface IngredientAnalysis {
  ingredient: string
  status: "good" | "moderate" | "bad"
  reason: string
}

interface DietaryPreference {
  name: string
  icon: string
  found: boolean
  reason?: string
}

interface HistoryItem {
  id: string
  productName: string
  brand?: string
  image?: string
  scannedAt: string
  scanMethod: "barcode" | "search" | "voice" | "manual"
  nutritionGrade: "A" | "B" | "C" | "D" | "E"
  isFavorite: boolean
  category: string
  calories: number
  protein: number
  fat: number
  carbs: number
  sugar: number
  sodium: number
  fiber: number
  saturatedFat: number
  tags: string[]
  location?: string
  notes?: string
  analysisComplete: boolean
  healthScore: number
  warnings: string[]
  benefits: string[]
  barcode?: string
  ingredientAnalysis: Array<{
    ingredient: string
    status: "good" | "moderate" | "bad"
    reason: string
  }>
  dietaryPreferences: Array<{
    name: string
    icon: string
    found: boolean
    reason?: string
  }>
  nutriments: {
    "energy-kcal_100g"?: number
    proteins_100g?: number
    fat_100g?: number
    carbohydrates_100g?: number
    sugars_100g?: number
    fiber_100g?: number
    sodium_100g?: number
    "saturated-fat_100g"?: number
    salt_100g?: number
  }
  dangerousNutrients: string[]
  safeNutrients: string[]
}

// AI Analysis Response Interface
interface AIAnalysisData {
  ingredientAnalysis: IngredientAnalysis[]
  dietaryPreferences: DietaryPreference[]
  audioSummary: string
  healthScore: number
  warnings: string[]
  benefits: string[]
  scoreExplanation?: string[]
  personalizedInsights?: {
    comparisonToHistory: string
    trendAnalysis: string
    smartRecommendation: string
  }
  alternatives?: string[]
  dailyConsumptionAdvice?: string
  hiddenConcerns?: string[]
  nutritionalInsights?: string[]
  translations?: Record<string, string>
}

// Updated Chat Message Types - EMPATHETIC STRUCTURE
interface GeminiChatResponse {
  tone: "empathetic" | "cautionary" | "encouraging" | "neutral"
  opening: string
  mainAnswer: string
  keyPoints?: string[]
  practicalTip?: string
  followUp?: string
}

type ChatMessage =
  | { role: "user"; content: string; timestamp: number }
  | { role: "assistant"; content: GeminiChatResponse; timestamp: number }

// Language options
const POPULAR_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
]

export default function AnalysisComponent() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [servingSize, setServingSize] = useState<string>("")
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisData | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Audio State
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechProgress, setSpeechProgress] = useState(0)
  const isSpeakingRef = useRef(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Chat State
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // AI Analysis Guard
  const hasAnalyzedRef = useRef(false)

  const nutrients: NutrientInfo[] = [
    { key: "energy-kcal_100g", label: "Calories", unit: "kcal" },
    { key: "fat_100g", label: "Total Fat", unit: "g", dangerLimit: 78 },
    { key: "saturated-fat_100g", label: "Saturated Fat", unit: "g" },
    { key: "carbohydrates_100g", label: "Carbohydrates", unit: "g" },
    { key: "sugars_100g", label: "Sugars", unit: "g", dangerLimit: 25 },
    { key: "fiber_100g", label: "Fiber", unit: "g" },
    { key: "proteins_100g", label: "Proteins", unit: "g" },
    { key: "salt_100g", label: "Salt", unit: "g" },
    { key: "sodium_100g", label: "Sodium", unit: "mg", dangerLimit: 2.3 },
  ]

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem("analysisLang")
    if (saved) setSelectedLanguage(saved)
  }, [])

  // Save language preference
  useEffect(() => {
    localStorage.setItem("analysisLang", selectedLanguage)
  }, [selectedLanguage])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Gemini AI Analysis Function
  async function runGeminiAnalysis(productData: Product) {
    setAiLoading(true)
    setAiError(null)

    try {
      // Get scan history from localStorage
      const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]")

      const res = await fetch("/api/gemini/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productData.product_name,
          brand: productData.brands,
          ingredients: productData.ingredients_text,
          nutriments: productData.nutriments,
          scanHistory: scanHistory.slice(0, 10), // Send last 10 scans
        }),
      })

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.error || "Gemini AI analysis failed")
      }

      // Defensive validation
      const validatedData: AIAnalysisData = {
        ...json.data,
        ingredientAnalysis: (json.data.ingredientAnalysis || []).map((item: any) => ({
          ingredient: item.ingredient || "Unknown",
          status: ["good", "moderate", "bad"].includes(item.status) ? item.status : "moderate",
          reason: item.reason || "No analysis available",
        })),
        dietaryPreferences: (json.data.dietaryPreferences || []).map((pref: any) => ({
          name: pref.name || "Unknown",
          icon: pref.icon || "❓",
          found: Boolean(pref.found),
          reason: pref.reason || "",
        })),
        healthScore: typeof json.data.healthScore === "number" 
          ? Math.max(0, Math.min(100, json.data.healthScore))
          : 50,
        warnings: Array.isArray(json.data.warnings) ? json.data.warnings : [],
        benefits: Array.isArray(json.data.benefits) ? json.data.benefits : [],
        audioSummary: json.data.audioSummary || "Analysis complete.",
        scoreExplanation: Array.isArray(json.data.scoreExplanation) ? json.data.scoreExplanation : [],
        personalizedInsights: json.data.personalizedInsights,
        alternatives: json.data.alternatives,
        dailyConsumptionAdvice: json.data.dailyConsumptionAdvice,
        hiddenConcerns: json.data.hiddenConcerns,
        nutritionalInsights: Array.isArray(json.data.nutritionalInsights) ? json.data.nutritionalInsights : [],
        translations: json.data.translations || {},
      }

      setAiAnalysis(validatedData)
      console.log("✅ Gemini AI analysis complete:", validatedData)
    } catch (err: any) {
      console.error("❌ Gemini AI error:", err)
      setAiError(err.message || "Failed to analyze product. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  // FIXED: Chat with Gemini - Now with proper conversation history
  async function sendChatMessage(message: string) {
    if (!message.trim() || !product || !aiAnalysis) return

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    }

    // Build history BEFORE updating state
    const currentHistory = [...chatMessages, userMessage].slice(-6)

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setChatLoading(true)

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.product_name,
          ingredients: product.ingredients_text,
          healthScore: aiAnalysis.healthScore,
          userMessage: message,
          conversationHistory: currentHistory, // FIXED: Use pre-built history
        }),
      })

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.error || "Chat failed")
      }

      // Validate response structure
      const validatedResponse: GeminiChatResponse = {
        tone: json.data.tone || "neutral",
        opening: json.data.opening || "Let me help you with that.",
        mainAnswer: json.data.mainAnswer || json.data.summary || "I'm not sure about that.",
        keyPoints: Array.isArray(json.data.keyPoints) ? json.data.keyPoints : [],
        practicalTip: json.data.practicalTip || json.data.recommendation,
        followUp: json.data.followUp,
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: validatedResponse,
        timestamp: Date.now(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      console.error("❌ Chat error:", err)
      // Empathetic error message
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: {
          tone: "empathetic",
          opening: "I apologize for the technical hiccup.",
          mainAnswer: "I'm having trouble processing your question right now. This could be due to a temporary connection issue.",
          keyPoints: [
            "Your question was received, but I couldn't generate a proper response",
            "Please try rephrasing or asking again in a moment"
          ],
          practicalTip: "If this continues, try refreshing the page or checking your internet connection.",
        },
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  // Utility functions
  const determineCategory = (product: Product): string => {
    const name = product.product_name?.toLowerCase() || ""
    const brands = product.brands?.toLowerCase() || ""

    if (name.includes("milk") || name.includes("cheese") || name.includes("yogurt") || brands.includes("dairy")) {
      return "Dairy"
    } else if (name.includes("juice") || name.includes("water") || name.includes("soda") || name.includes("drink")) {
      return "Beverages"
    } else if (name.includes("bread") || name.includes("rice") || name.includes("pasta") || name.includes("cereal")) {
      return "Grains"
    } else if (name.includes("fruit") || name.includes("vegetable") || name.includes("salad")) {
      return "Fresh Foods"
    } else if (
      name.includes("chip") ||
      name.includes("cookie") ||
      name.includes("candy") ||
      name.includes("chocolate")
    ) {
      return "Snacks"
    } else {
      return "Packaged Foods"
    }
  }

  const determineNutritionGrade = (healthScore: number): "A" | "B" | "C" | "D" | "E" => {
    if (healthScore >= 80) return "A"
    if (healthScore >= 65) return "B"
    if (healthScore >= 50) return "C"
    if (healthScore >= 35) return "D"
    return "E"
  }

  const calculateNutritionGrade = (product: Product, aiHealthScore?: number): "A" | "B" | "C" | "D" | "E" => {
    if (product.nutrition_grades_tags && product.nutrition_grades_tags.length > 0) {
      const gradeTag = product.nutrition_grades_tags[0]
      const gradeMatch = gradeTag.match(/[a-e]/i)
      if (gradeMatch) {
        const grade = gradeMatch[0].toUpperCase() as "A" | "B" | "C" | "D" | "E"
        if (["A", "B", "C", "D", "E"].includes(grade)) {
          return grade
        }
      }
    }

    if (aiHealthScore !== undefined && aiHealthScore !== null) {
      return determineNutritionGrade(aiHealthScore)
    }

    return "C"
  }

  const saveCompleteAnalysisToHistory = useCallback(() => {
    if (!product || !aiAnalysis) return

    const healthScore = aiAnalysis.healthScore
    const nutritionGrade = calculateNutritionGrade(product, healthScore)
    const warnings = aiAnalysis.warnings
    const benefits = aiAnalysis.benefits
    const category = determineCategory(product)
    const scanMethod = product._scanMethod || "search"

    const analysisData: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productName: product.product_name || "Unknown Product",
      brand: product.brands || undefined,
      image: product.image_thumb_url || product.image_url || undefined,
      scannedAt: product._scannedAt || new Date().toISOString(),
      scanMethod: scanMethod as "barcode" | "search" | "voice" | "manual",
      nutritionGrade,
      isFavorite: false,
      category,
      calories: Math.round(product.nutriments?.["energy-kcal_100g"] || 0),
      protein: Math.round((product.nutriments?.proteins_100g || 0) * 10) / 10,
      fat: Math.round((product.nutriments?.fat_100g || 0) * 10) / 10,
      carbs: Math.round((product.nutriments?.carbohydrates_100g || 0) * 10) / 10,
      sugar: Math.round((product.nutriments?.sugars_100g || 0) * 10) / 10,
      sodium: Math.round((product.nutriments?.sodium_100g || 0) * 1000),
      fiber: Math.round((product.nutriments?.fiber_100g || 0) * 10) / 10,
      saturatedFat: Math.round((product.nutriments?.["saturated-fat_100g"] || 0) * 10) / 10,
      tags: [
        category.toLowerCase(),
        nutritionGrade.toLowerCase() + "-grade",
        ...(healthScore > 70 ? ["healthy"] : []),
        ...(warnings.length > 0 ? ["high-risk"] : []),
        ...(benefits.length > 2 ? ["nutritious"] : []),
      ],
      location: undefined,
      notes: undefined,
      analysisComplete: true,
      healthScore,
      warnings,
      benefits,
      barcode: product.code || undefined,
      nutriments: product.nutriments || {},
      ingredientAnalysis: aiAnalysis.ingredientAnalysis,
      dietaryPreferences: aiAnalysis.dietaryPreferences,
      dangerousNutrients: nutrients
        .filter((nutrient) => isDangerous(nutrient, product.nutriments?.[nutrient.key]))
        .map((n) => n.key),
      safeNutrients: nutrients
        .filter((nutrient) => !isDangerous(nutrient, product.nutriments?.[nutrient.key]))
        .map((n) => n.key),
    }

    const existingHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]")
    const recentTimeThreshold = Date.now() - 10 * 60 * 1000
    const existingIndex = existingHistory.findIndex(
      (item: HistoryItem) =>
        item.productName === analysisData.productName && new Date(item.scannedAt).getTime() > recentTimeThreshold,
    )

    if (existingIndex !== -1) {
      existingHistory[existingIndex] = {
        ...existingHistory[existingIndex],
        ...analysisData,
        id: existingHistory[existingIndex].id,
        scannedAt: existingHistory[existingIndex].scannedAt,
      }
      console.log("📝 Updated existing history item with AI analysis:", analysisData.productName)
    } else {
      existingHistory.unshift(analysisData)
      console.log("📝 Added new AI analysis to history:", analysisData.productName)
    }

    const updatedHistory = existingHistory.slice(0, 100)
    localStorage.setItem("scanHistory", JSON.stringify(updatedHistory))
    localStorage.setItem("recentAnalysisResult", JSON.stringify(analysisData))

    console.log("💾 Complete AI analysis data saved to history for:", product.product_name)
  }, [product, aiAnalysis, nutrients])

  // Load product data
  useEffect(() => {
    const selectedProduct = localStorage.getItem("selectedProduct")
    const isRedirecting = localStorage.getItem("isRedirecting")

    if (selectedProduct) {
      try {
        const productData = JSON.parse(selectedProduct)

        if (isRedirecting) {
          setIsInitialLoading(true)
          setTimeout(() => {
            setProduct(productData)
            setIsInitialLoading(false)
            localStorage.removeItem("selectedProduct")
            localStorage.removeItem("isRedirecting")
            console.log("📦 Product loaded for AI analysis:", productData.product_name)
          }, 600)
        } else {
          setProduct(productData)
          setIsInitialLoading(false)
          localStorage.removeItem("selectedProduct")
          console.log("📦 Product loaded for AI analysis:", productData.product_name)
        }
      } catch (error) {
        console.error("❌ Error parsing product data:", error)
        setIsInitialLoading(false)
      }
    } else {
      setIsInitialLoading(false)
    }
  }, [])

  // Trigger AI analysis
  useEffect(() => {
    if (!product || !product.ingredients_text) return
    if (hasAnalyzedRef.current) return

    hasAnalyzedRef.current = true
    console.log("🤖 Triggering Gemini AI analysis...")
    runGeminiAnalysis(product)
  }, [product])

  // Save analysis
  useEffect(() => {
    if (product && aiAnalysis && !aiLoading) {
      const timer = setTimeout(() => {
        saveCompleteAnalysisToHistory()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [product, aiAnalysis, aiLoading, saveCompleteAnalysisToHistory])

  const handleServingSizeChange = useCallback((value: string) => {
    setServingSize(value)
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setServingMultiplier(numValue / 100)
    } else {
      setServingMultiplier(1)
    }
  }, [])

  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case "A":
        return "from-green-500 to-emerald-500"
      case "B":
        return "from-lime-500 to-green-500"
      case "C":
        return "from-yellow-500 to-lime-500"
      case "D":
        return "from-orange-500 to-yellow-500"
      case "E":
        return "from-red-500 to-orange-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getGradePosition = (grade: string) => {
    const positions = { A: "90%", B: "75%", C: "50%", D: "25%", E: "10%" }
    return positions[grade?.toUpperCase() as keyof typeof positions] || "50%"
  }

  const getAdjustedValue = (value: number | undefined) => {
    if (value === undefined) return "N/A"
    return (value * servingMultiplier).toFixed(1)
  }

  const isDangerous = (nutrient: NutrientInfo, value: number | undefined) => {
    if (!nutrient.dangerLimit || value === undefined) return false
    const adjustedValue = value * servingMultiplier
    return adjustedValue > nutrient.dangerLimit
  }

  const toggleAudioPlayer = () => {
    setShowAudioPlayer(!showAudioPlayer)
  }

  const toggleChat = () => {
    setShowChat(!showChat)
  }

  // FIXED: Audio playback with better fallback
  const handlePlayAudio = useCallback(() => {
    // Safe fallback for translated audio
    const audioTranscript = selectedLanguage !== "en"
      ? (aiAnalysis?.translations?.[selectedLanguage] ?? aiAnalysis?.audioSummary)
      : aiAnalysis?.audioSummary

    if (!audioTranscript) {
      console.log("❌ No audio transcript available")
      alert("Audio summary not available for this product")
      return
    }

    if (isSpeakingRef.current) {
      console.log("⏹️ Stopping current speech")
      speechSynthesis.cancel()
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      isSpeakingRef.current = false
      setIsSpeaking(false)
      setSpeechProgress(0)
      return
    }

    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser")
      return
    }

    console.log("▶️ Starting speech playback in language:", selectedLanguage)
    
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(audioTranscript)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8

    // Language-aware voice mapping
    const voices = speechSynthesis.getVoices()
    if (voices.length > 0) {
      const voiceMap: Record<string, (v: SpeechSynthesisVoice) => boolean> = {
        en: (v) => v.lang.startsWith("en"),
        hi: (v) => v.lang.startsWith("hi") || v.lang === "hi-IN",
        fr: (v) => v.lang.startsWith("fr"),
        es: (v) => v.lang.startsWith("es"),
        de: (v) => v.lang.startsWith("de"),
        ja: (v) => v.lang.startsWith("ja"),
        zh: (v) => v.lang.startsWith("zh"),
        ar: (v) => v.lang.startsWith("ar"),
      }

      const selectedVoice =
        voices.find(voiceMap[selectedLanguage]) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0]

      utterance.voice = selectedVoice
      console.log("🎙️ Using voice:", selectedVoice.name, "for language:", selectedLanguage)
    }

    utterance.onstart = () => {
      console.log("✅ Speech started")
      isSpeakingRef.current = true
      setIsSpeaking(true)
      setSpeechProgress(0)

      const estimatedDuration = audioTranscript.length * 60
      const updateInterval = Math.max(100, estimatedDuration / 100)

      progressIntervalRef.current = setInterval(() => {
        setSpeechProgress((prev) => {
          if (prev >= 95) return prev
          return prev + 1
        })
      }, updateInterval)
    }

    utterance.onend = () => {
      console.log("✅ Speech completed")
      isSpeakingRef.current = false
      setIsSpeaking(false)
      setSpeechProgress(100)
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }

    utterance.onerror = (event) => {
      console.warn("⚠️ Speech error:", event.error)
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      isSpeakingRef.current = false
      setIsSpeaking(false)
      setSpeechProgress(0)

      if (event.error !== "interrupted" && event.error !== "canceled") {
        alert(`Speech synthesis error: ${event.error}`)
      }
    }

    speechSynthesis.speak(utterance)
  }, [aiAnalysis?.audioSummary, aiAnalysis?.translations, selectedLanguage])

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices()
        console.log("🎙️ Available voices loaded:", voices.length)
      }

      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener("voiceschanged", loadVoices)
      } else {
        loadVoices()
      }

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      }
    }
  }, [])

  // Loading State
  if (isInitialLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center">
        {isInitialLoading ? (
          <motion.div
            className="text-center max-w-sm mx-auto px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative w-32 h-32 mx-auto mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 p-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 rounded-full" />
              </motion.div>

              <motion.div
                className="absolute inset-4 border-4 border-gradient-to-r from-orange-400 to-lime-400 rounded-full border-dashed"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                style={{ borderImage: "linear-gradient(45deg, #f97316, #84cc16) 1" }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-lime-400 rounded-full"
                  style={{
                    top: `${50 + Math.sin((i * 45 * Math.PI) / 180) * 40}%`,
                    left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.h2
                className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Analyzing Your Product
              </motion.h2>
              <motion.p
                className="text-base lg:text-lg text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Preparing comprehensive nutritional insights...
              </motion.p>

              <div className="space-y-3 mb-6">
                {[
                  "Processing ingredients",
                  "Calculating nutrition score",
                  "Checking dietary preferences",
                  "Generating recommendations",
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.3,
                      }}
                    />
                    <span className="text-sm text-gray-600">{step}</span>
                  </motion.div>
                ))}
              </div>

              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Product Data</h2>
            <p className="text-gray-600 mb-4">Please scan or search for a product first.</p>
            <Link href="/home">
              <Button className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white">
                Go Back Home
              </Button>
            </Link>
          </div>
        )}
      </div>
    )
  }

  // AI Loading State
  if (aiLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="w-full h-full border-4 border-orange-500 border-t-transparent rounded-full" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">AI Analysis in Progress</h2>
          <p className="text-gray-600 mb-4">
            Gemini AI is analyzing ingredients and generating insights...
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span>This may take a few seconds</span>
          </div>
        </motion.div>
      </div>
    )
  }

  // AI Error State
  if (aiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis Failed</h2>
          <p className="text-gray-600 mb-4">{aiError}</p>
          <div className="space-x-3">
            <Button
              onClick={() => {
                hasAnalyzedRef.current = false
                product && runGeminiAnalysis(product)
              }}
              className="bg-gradient-to-r from-orange-500 to-lime-500 text-white"
            >
              Retry Analysis
            </Button>
            <Link href="/home">
              <Button variant="outline">Go Back</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const grade = calculateNutritionGrade(product, aiAnalysis?.healthScore)
  const dangerousNutrients = nutrients.filter((nutrient) => isDangerous(nutrient, product.nutriments?.[nutrient.key]))
  const safeNutrients = nutrients.filter((nutrient) => !isDangerous(nutrient, product.nutriments?.[nutrient.key]))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 pb-20">
      {/* Header */}
      <motion.header
        className="bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 text-white p-4 lg:p-6 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-2xl font-bold truncate">{product.product_name || "Unknown Product"}</h1>
              {product.brands && <p className="text-orange-100 text-xs lg:text-base truncate">{product.brands}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudioPlayer}
              className="text-white hover:bg-white/20 rounded-full"
              disabled={!aiAnalysis?.audioSummary}
            >
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Serving Size Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <Weight className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">Serving Size</h2>
              </div>
              <Input
                type="number"
                placeholder="Enter serving size (g/ml)"
                value={servingSize}
                onChange={(e) => handleServingSizeChange(e.target.value)}
                className="mb-2"
                min="1"
              />
              <p className="text-xs lg:text-sm text-gray-600">
                {servingSize ? `Calculations based on ${servingSize}g serving` : "Enter serving size to calculate"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overall Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-lime-500 rounded-full flex items-center justify-center mr-3">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">Overall Product Rating</h2>
              </div>

              <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r ${getGradeColor(grade)} flex items-center justify-center shadow-lg`}
                  >
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl lg:text-3xl font-bold text-gray-800">{grade}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <p className="text-center lg:text-left font-medium mb-3 text-sm lg:text-base">
                    AI Health Score: {aiAnalysis ? aiAnalysis.healthScore : "—"}/100
                  </p>
                  <div className="relative h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-gray-800 rounded-full transform -translate-y-1 -translate-x-2 shadow-lg transition-all duration-500"
                      style={{ left: getGradePosition(grade) }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] lg:text-xs text-gray-600 mt-2">
                    <span>Very Bad</span>
                    <span>Bad</span>
                    <span>Good</span>
                    <span>Very Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FIXED: AI Health Insights - Now using AI-generated content */}
        {aiAnalysis && aiAnalysis.scoreExplanation && aiAnalysis.scoreExplanation.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                    🧠 AI Health Insights
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* AI-Generated Overall Interpretation */}
                  {aiAnalysis.scoreExplanation[0] && (
                    <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                      <p className="text-xs font-medium text-purple-600 mb-1">
                        Overall Interpretation
                      </p>
                      <p className="text-xs lg:text-sm text-gray-800">
                        {aiAnalysis.scoreExplanation[0]}
                      </p>
                    </div>
                  )}

                  {/* AI-Generated Nutrition Advice */}
                  {aiAnalysis.scoreExplanation[1] && (
                    <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                      <p className="text-xs font-medium text-purple-600 mb-1">
                        Nutrition Advice
                      </p>
                      <p className="text-xs lg:text-sm text-gray-800">
                        {aiAnalysis.scoreExplanation[1]}
                      </p>
                    </div>
                  )}

                  {/* AI-Generated Smart Tip */}
                  {aiAnalysis.scoreExplanation[2] && (
                    <div className="bg-gray-50 rounded-lg p-3 lg:p-4 border-l-4 border-purple-500">
                      <p className="text-xs font-medium text-purple-600 mb-1">
                        💡 Smart AI Tip
                      </p>
                      <p className="text-xs lg:text-sm font-medium text-gray-800">
                        {aiAnalysis.scoreExplanation[2]}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Daily Consumption Advice */}
        {aiAnalysis?.dailyConsumptionAdvice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <Utensils className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base lg:text-lg font-semibold text-gray-900">📅 Can I Eat This Daily?</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                  <p className="text-xs lg:text-sm text-gray-800 leading-relaxed">{aiAnalysis.dailyConsumptionAdvice}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Hidden Concerns */}
        {aiAnalysis?.hiddenConcerns && aiAnalysis.hiddenConcerns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base lg:text-lg font-semibold text-gray-900">🔍 What Labels Hide</h2>
                </div>
                <div className="space-y-2">
                  {aiAnalysis.hiddenConcerns.map((concern, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-orange-500">
                      <p className="text-xs lg:text-sm text-gray-800">{concern}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">
                  AI-detected concerns that aren't obvious from packaging
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Nutritional Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">Nutritional Facts Analysis</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                {nutrients.map((nutrient) => {
                  const value = product.nutriments?.[nutrient.key]
                  const dangerous = isDangerous(nutrient, value)
                  return (
                    <div
                      key={nutrient.key}
                      className={`rounded-lg p-3 lg:p-4 ${dangerous ? "bg-red-50 border-l-4 border-red-500" : "bg-gray-50"}`}
                    >
                      <div className={`font-medium text-xs lg:text-sm mb-1 ${dangerous ? "text-red-800" : "text-gray-800"}`}>
                        {nutrient.label}
                      </div>
                      <div className={`text-base lg:text-lg font-bold mb-1 ${dangerous ? "text-red-600" : "text-gray-900"}`}>
                        {getAdjustedValue(value)} {nutrient.unit}
                      </div>
                      <div className={`text-[10px] lg:text-xs ${dangerous ? "text-red-600" : "text-gray-600"}`}>
                        {dangerous ? "High content" : servingSize ? "Per serving" : "Per 100g"}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* AI Nutritional Insights */}
              {aiAnalysis?.nutritionalInsights && aiAnalysis.nutritionalInsights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm lg:text-base font-semibold text-gray-900">🤖 AI Nutritional Insights</h3>
                  </div>
                  <div className="space-y-2">
                    {aiAnalysis.nutritionalInsights.slice(0, 5).map((insight, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-500">
                        <p className="text-xs lg:text-sm text-gray-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    AI-powered analysis of nutritional content
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Ingredient Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">AI Ingredient Analysis</h2>
              </div>

              {product.ingredients_text && (
                <div className="mb-6">
                  <h3 className="font-medium text-sm lg:text-base text-gray-800 mb-2">Ingredients</h3>
                  <p className="text-xs lg:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{product.ingredients_text}</p>
                </div>
              )}

              {aiAnalysis?.ingredientAnalysis && aiAnalysis.ingredientAnalysis.length > 0 ? (
                <div className="space-y-3">
                  {aiAnalysis.ingredientAnalysis.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex flex-col p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-xs lg:text-sm text-gray-800">{item.ingredient}</span>
                        <div
                          className={`px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-medium ${
                            item.status === "good"
                              ? "bg-green-100 text-green-800"
                              : item.status === "moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600">{item.reason}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xs lg:text-sm text-gray-500 text-center py-4">No ingredient analysis available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Dietary Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">AI Dietary Compatibility</h2>
              </div>
              {aiAnalysis?.dietaryPreferences && aiAnalysis.dietaryPreferences.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {aiAnalysis.dietaryPreferences.map((pref, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex flex-col p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-base lg:text-lg mr-3">{pref.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-800 text-xs lg:text-sm truncate">{pref.name}</span>
                        </div>
                        {pref.found ? (
                          <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      {pref.reason && <p className="text-[10px] lg:text-xs text-gray-600 mt-1 leading-relaxed">{pref.reason}</p>}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xs lg:text-sm text-gray-500 text-center py-4">No dietary analysis available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* How Gemini Calculated This Score */}
        {aiAnalysis?.scoreExplanation && aiAnalysis.scoreExplanation.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                    🤖 How Gemini Calculated This Score
                  </h2>
                </div>

                <div className="space-y-3">
                  {aiAnalysis.scoreExplanation.slice(3).map((reason, i) => (
                    <div
                      key={i}
                      className="flex items-start bg-gray-50 rounded-lg p-3"
                    >
                      <span className="text-amber-500 mr-2 mt-0.5 flex-shrink-0">•</span>
                      <p className="text-xs lg:text-sm text-gray-800 leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-4 italic">
                  Generated using Gemini reasoning over ingredients & nutrition science
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center py-6"
        >
          <p className="text-xs lg:text-sm text-gray-600">
            Analysis powered by Gemini AI. This is for informational purposes only and should not replace professional
            medical advice.
          </p>
        </motion.div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-orange-500 to-lime-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
      </motion.button>

      {/* FIXED: Chat Modal with Empathetic Rendering */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50 p-0 lg:p-4"
            onClick={toggleChat}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl lg:rounded-2xl w-full lg:max-w-2xl h-[85vh] lg:h-[600px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 text-white p-4 lg:p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg font-bold">Ask Gemini</h3>
                    <p className="text-xs text-orange-100">Your nutrition expert</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/20 rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-gradient-to-br from-orange-50/30 via-yellow-50/30 to-lime-50/30">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8 lg:py-12">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <h4 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">Ask me anything!</h4>
                    <p className="text-xs lg:text-sm text-gray-600 mb-6 max-w-sm mx-auto px-4">
                      I can answer questions about {product.product_name}'s ingredients, nutrition, and health impact.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 max-w-md mx-auto px-4">
                      {[
                        "Is this good for weight loss?",
                        "What are the main concerns?",
                        "Any healthier alternatives?",
                        "Can kids eat this daily?",
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => sendChatMessage(suggestion)}
                          className="bg-white hover:bg-gray-50 text-gray-700 text-xs lg:text-sm p-3 rounded-lg border border-gray-200 transition-colors text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* EMPATHETIC MESSAGE RENDERING */}
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "user" ? (
                      <div className="max-w-[85%] lg:max-w-[75%] rounded-2xl p-3 lg:p-4 bg-gradient-to-r from-orange-500 to-lime-500 text-white">
                        <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="max-w-[90%] bg-white rounded-xl p-4 shadow-md border border-gray-100 space-y-3">
                        {/* Opening (empathetic greeting) */}
                        <p className="text-sm text-gray-800 font-medium">
                          {msg.content.opening}
                        </p>

                        {/* Main Answer */}
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {msg.content.mainAnswer}
                        </p>

                        {/* Key Points */}
                        {msg.content.keyPoints && msg.content.keyPoints.length > 0 && (
                          <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                            {msg.content.keyPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        )}

                        {/* Practical Tip */}
                        {msg.content.practicalTip && (
                          <div className="bg-lime-50 border-l-4 border-lime-500 p-3 rounded">
                            <p className="text-xs font-medium text-lime-800">
                              💡 {msg.content.practicalTip}
                            </p>
                          </div>
                        )}

                        {/* Follow-up Question */}
                        {msg.content.followUp && (
                          <p className="text-xs text-gray-500 italic">
                            {msg.content.followUp}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {chatLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 lg:p-6 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendChatMessage(chatInput)
                      }
                    }}
                    placeholder="Ask about this product..."
                    className="flex-1 text-sm lg:text-base"
                    disabled={chatLoading}
                  />
                  <Button
                    onClick={() => sendChatMessage(chatInput)}
                    disabled={!chatInput.trim() || chatLoading}
                    className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center flex-shrink-0"
                  >
                    <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player Modal */}
      <AnimatePresence>
        {showAudioPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50 p-0 lg:p-4"
            onClick={toggleAudioPlayer}
          >
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl lg:rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-base lg:text-lg font-semibold">AI Audio Summary</h3>
                <Button variant="ghost" size="icon" onClick={toggleAudioPlayer}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {/* Language Selector */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Language</span>
                  </div>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-[140px] h-9 bg-white text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code} className="text-xs">
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Audio Player */}
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePlayAudio} 
                    className="rounded-full bg-transparent flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12"
                  >
                    {isSpeaking ? <Pause className="w-4 h-4 lg:w-5 lg:h-5" /> : <Play className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full transition-all duration-300"
                        style={{ width: `${speechProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] lg:text-xs text-gray-500 mt-1">
                      <span>{isSpeaking ? "Speaking..." : "Ready"}</span>
                      <span>
                        {selectedLanguage !== "en" 
                          ? POPULAR_LANGUAGES.find(l => l.code === selectedLanguage)?.label || "Translated"
                          : "English"
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary Text */}
                <div className="bg-gray-50 rounded-lg p-3 lg:p-4 max-h-[40vh] overflow-y-auto">
                  <h4 className="font-medium mb-2 text-xs lg:text-sm">AI-Generated Summary:</h4>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {selectedLanguage === "en"
                      ? aiAnalysis?.audioSummary
                      : aiAnalysis?.translations?.[selectedLanguage] || aiAnalysis?.audioSummary || "No audio summary available"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}