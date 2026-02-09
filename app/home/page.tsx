


"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, Suspense, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Mic,
  X,
  Heart,
  History,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  User,
  Award,
  Info,
  LogOut,
  Home,
  Camera,
  Users,
  Scan,
  Sun,
  Moon,
  Zap,
  Download,
  BarChart3,
  MessageCircle,
  Bot,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Import the new search engine
import { smartSearch } from "@/lib/searchEngine"
import { debounce } from "@/lib/search/debounce"
import type { OFFProduct } from "@/lib/openFoodFacts"

interface Product extends OFFProduct {
  [key: string]: any
}

interface RecentItem extends Product {
  scannedAt?: string
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

interface ChatMessage {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  options?: ChatOption[]
  isTyping?: boolean
}

interface ChatOption {
  id: string
  text: string
  action: string
  nextStep?: string
  link?: string
}

interface ChatStep {
  id: string
  message: string
  options: ChatOption[]
  category: "welcome" | "basic" | "intermediate" | "advanced" | "exploration"
  icon: string
}

// Lazy loaded components
const PoweredBySection = React.lazy(() => import("@/components/home/PoweredBySection"))

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [currentTip, setCurrentTip] = useState("")
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0)
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0)
  const [showPWAPrompt, setShowPWAPrompt] = useState(false)
  const [showQuickTip, setShowQuickTip] = useState(false)
  const [currentQuickTip, setCurrentQuickTip] = useState("")
  const [isRedirectingToAnalysis, setIsRedirectingToAnalysis] = useState(false)

  // Chatbot states
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentChatStep, setCurrentChatStep] = useState("welcome")
  const [isTyping, setIsTyping] = useState(false)
  const [userProgress, setUserProgress] = useState({
    completedSteps: [] as string[],
    currentLevel: "basic" as "basic" | "intermediate" | "advanced",
    exploredSections: [] as string[],
  })

  const router = useRouter()
  const deferredPrompt = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Memoized constants
  const welcomeMessages = useMemo(
    () => [
      "Scan. Analyze. Choose wisely.",
      "Healthy choices start here.",
      "Powered by AI and OpenFoodFacts.",
      "Your personal nutrition assistant.",
    ],
    [],
  )

  const healthTips = useMemo(
    () => [
      "Aim for at least 5 servings of fruits and vegetables daily for optimal nutrition.",
      "Stay hydrated! Drink at least 8 glasses of water per day.",
      "Choose whole grains over refined carbs for sustained energy.",
      "Limit added sugars to less than 10% of your daily calorie intake.",
      "Include protein with every meal to help maintain muscle mass.",
    ],
    [],
  )

  const quickTips = useMemo(
    () => [
      "Did you know? Sugar content above 15g per 100g is considered high.",
      "Foods with more than 5 ingredients are often highly processed.",
      "Look for the fiber content - aim for at least 3g per serving.",
      "Sodium should be less than 600mg per serving for heart health.",
      "Trans fats should always be 0g - check the nutrition label!",
    ],
    [],
  )

  const knowledgeArticles = useMemo(
    () => [
      {
        title: "Understanding Labels",
        content: "Food labels provide essential information about the nutritional content of packaged foods.",
        readTime: "3 min read",
        color: "from-orange-100 to-orange-200",
      },
      {
        title: "Processed Foods",
        content: "Discover how processed foods affect your body and what alternatives you can choose.",
        readTime: "4 min read",
        color: "from-yellow-100 to-yellow-200",
      },
      {
        title: "Hidden Sugars",
        content: "Sugar can hide under many names in ingredient lists. Learn how to identify them.",
        readTime: "2 min read",
        color: "from-lime-100 to-lime-200",
      },
    ],
    [],
  )

  // Chatbot conversation flow (keeping your existing chatSteps)
  const chatSteps: Record<string, ChatStep> = useMemo(
    () => ({
      welcome: {
        id: "welcome",
        message:
          "👋 Hi there! I'm FoodSnap Assistant, your personal nutrition guide. I'm here to help you master our app and make healthier food choices. What would you like to learn about?",
        options: [
          { id: "getting_started", text: "🚀 Getting Started", action: "navigate", nextStep: "getting_started" },
          { id: "app_features", text: "✨ App Features", action: "navigate", nextStep: "app_features" },
          { id: "scanning_guide", text: "📱 How to Scan", action: "navigate", nextStep: "scanning_guide" },
          {
            id: "understanding_results",
            text: "📊 Understanding Results",
            action: "navigate",
            nextStep: "understanding_results",
          },
        ],
        category: "welcome",
        icon: "👋",
      },
      // ... rest of your chatSteps remain the same
      getting_started: {
        id: "getting_started",
        message:
          "🚀 Perfect! Let's get you started with FoodSnap. We analyze food products using AI and the world's largest food database (OpenFoodFacts). Our mission is to help you make informed, healthier food choices. What's your main goal?",
        options: [
          { id: "healthier_eating", text: "🥗 Eat Healthier", action: "navigate", nextStep: "healthier_eating" },
          { id: "understand_labels", text: "🏷️ Understand Labels", action: "navigate", nextStep: "understand_labels" },
          { id: "track_nutrition", text: "📈 Track Nutrition", action: "navigate", nextStep: "track_nutrition" },
          { id: "explore_features", text: "🔍 Explore All Features", action: "navigate", nextStep: "app_features" },
        ],
        category: "basic",
        icon: "🚀",
      },
      app_features: {
        id: "app_features",
        message:
          "✨ FoodSnap has powerful features to help you make informed food choices. Here's what makes us special:\n\n📱 Smart Scanner - Multiple ways to find products\n🧪 AI Analysis - Detailed nutritional breakdown\n📚 History Tracking - Monitor your choices\n👥 Community - Share and learn together\n\nWhich feature interests you most?",
        options: [
          { id: "scanner_feature", text: "📷 Smart Scanner", action: "navigate", nextStep: "scanner_feature" },
          { id: "analysis_feature", text: "🧪 AI Analysis", action: "navigate", nextStep: "analysis_feature" },
          { id: "history_feature", text: "📚 Scan History", action: "navigate", nextStep: "history_feature" },
          { id: "community_feature", text: "👥 Community", action: "navigate", nextStep: "community_feature" },
        ],
        category: "basic",
        icon: "✨",
      },
      scanning_guide: {
        id: "scanning_guide",
        message:
          "📱 Scanning is the heart of FoodSnap! We offer multiple ways to find products:\n\n📊 Barcode Scanning - Point and scan instantly\n🎤 Voice Search - Just speak the product name\n🔍 Text Search - Type to find products\n\nEach method gives you the same detailed analysis. Which method would you like to learn about?",
        options: [
          { id: "barcode_scanning", text: "📊 Barcode Scanning", action: "navigate", nextStep: "barcode_scanning" },
          { id: "voice_search", text: "🎤 Voice Search", action: "navigate", nextStep: "voice_search" },
          { id: "text_search", text: "🔍 Text Search", action: "navigate", nextStep: "text_search" },
          { id: "try_scanning", text: "🚀 Try Scanning Now", action: "link", link: "/scan" },
        ],
        category: "basic",
        icon: "📱",
      },
      scanner_feature: {
        id: "scanner_feature",
        message:
          "📷 Our Smart Scanner is your gateway to nutrition insights! It supports:\n\n✅ Barcode scanning for instant results\n✅ Voice search for hands-free operation\n✅ Text search for finding specific products\n✅ Works with 2M+ products worldwide\n\nReady to try it?",
        options: [
          { id: "how_to_scan", text: "❓ How to Scan", action: "navigate", nextStep: "how_to_scan" },
          { id: "scan_tips", text: "💡 Scanning Tips", action: "navigate", nextStep: "scan_tips" },
          { id: "go_scan", text: "📱 Start Scanning", action: "link", link: "/scan" },
          { id: "back_features", text: "⬅️ Back to Features", action: "navigate", nextStep: "app_features" },
        ],
        category: "intermediate",
        icon: "📷",
      },
      // Add more chat steps as needed from your original code
    }),
    [],
  )

  // ============================================
  // PROFESSIONAL SEARCH IMPLEMENTATION
  // ============================================

  // Debounced search function - created once
  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value.trim().length < 2) {
          setSuggestions([])
          setIsSearching(false)
          setSearchError(null)
          return
        }

        setIsSearching(true)
        setSearchError(null)

        try {
          const results = await smartSearch(value)

          setSuggestions(results)
          setIsSearching(false)

          // Smart empty state messaging
          if (results.length === 0) {
            const isBarcode = /^\d{8,14}$/.test(value.trim())
            if (isBarcode) {
              setSearchError("Barcode not found. Try scanning the product label instead.")
            } else {
              setSearchError("No packaged product found. You can still analyze by entering ingredients manually.")
            }
          }
        } catch (error) {
          console.error("Search error:", error)
          setIsSearching(false)
          setSearchError("Search failed. Please check your connection and try again.")
          setSuggestions([])
        }
      }, 400),
    [],
  )

  // Clean search input handler
  const handleSearchInput = useCallback(
    (value: string) => {
      setSearchQuery(value)
      setShowSuggestions(true)

      if (value.trim().length >= 2) {
        debouncedSearch(value)
      } else {
        setSuggestions([])
        setSearchError(null)
        setIsSearching(false)
      }
    },
    [debouncedSearch],
  )

  const clearSearchHandler = useCallback(() => {
    setSearchQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    setIsSearching(false)
    setSearchError(null)
  }, [])

  // ============================================
  // UTILITY FUNCTIONS (keeping your existing logic)
  // ============================================

  const determineCategory = useCallback((product: Product): string => {
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
  }, [])

  const calculateHealthScore = useCallback((product: Product): number => {
    const nutriments = product.nutriments || {}
    let score = 100

    const calories = nutriments.energy_kcal_100g || nutriments["energy-kcal_100g"] || 0
    if (calories > 400) score -= 20
    else if (calories > 250) score -= 10

    const sugar = nutriments.sugars_100g || 0
    if (sugar > 15) score -= 25
    else if (sugar > 10) score -= 15
    else if (sugar > 5) score -= 5

    const sodium = (nutriments.sodium_100g || 0) * 1000
    if (sodium > 600) score -= 20
    else if (sodium > 400) score -= 10

    const satFat = nutriments["saturated-fat_100g"] || 0
    if (satFat > 5) score -= 15
    else if (satFat > 3) score -= 8

    const fiber = nutriments.fiber_100g || 0
    if (fiber > 5) score += 10
    else if (fiber > 3) score += 5

    const protein = nutriments.proteins_100g || 0
    if (protein > 10) score += 10
    else if (protein > 5) score += 5

    return Math.max(0, Math.min(100, score))
  }, [])

  const determineNutritionGrade = useCallback((healthScore: number): "A" | "B" | "C" | "D" | "E" => {
    if (healthScore >= 80) return "A"
    if (healthScore >= 65) return "B"
    if (healthScore >= 50) return "C"
    if (healthScore >= 35) return "D"
    return "E"
  }, [])

  const generateWarningsAndBenefits = useCallback((product: Product) => {
    const nutriments = product.nutriments || {}
    const warnings: string[] = []
    const benefits: string[] = []

    const sugar = nutriments.sugars_100g || 0
    if (sugar > 15) warnings.push("Very high sugar content")
    else if (sugar > 10) warnings.push("High sugar content")

    const sodium = (nutriments.sodium_100g || 0) * 1000
    if (sodium > 600) warnings.push("Very high sodium")
    else if (sodium > 400) warnings.push("High sodium")

    const calories = nutriments.energy_kcal_100g || nutriments["energy-kcal_100g"] || 0
    if (calories > 400) warnings.push("High calorie content")

    const satFat = nutriments["saturated-fat_100g"] || 0
    if (satFat > 5) warnings.push("High saturated fat")

    const fiber = nutriments.fiber_100g || 0
    if (fiber > 5) benefits.push("High fiber content")
    else if (fiber > 3) benefits.push("Good source of fiber")

    const protein = nutriments.proteins_100g || 0
    if (protein > 10) benefits.push("High protein content")
    else if (protein > 5) benefits.push("Good source of protein")

    if (calories < 100) benefits.push("Low calorie")
    if (sugar < 5) benefits.push("Low sugar")
    if (sodium < 200) benefits.push("Low sodium")

    return { warnings, benefits }
  }, [])

  const saveToHistory = useCallback(
    (product: Product, scanMethod: "search" | "voice" | "barcode" | "manual", location?: string) => {
      const healthScore = calculateHealthScore(product)
      const nutritionGrade = determineNutritionGrade(healthScore)
      const { warnings, benefits } = generateWarningsAndBenefits(product)
      const category = determineCategory(product)

      const historyItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productName: product.product_name || "Unknown Product",
        brand: product.brands || undefined,
        image: product.image_thumb_url || product.image_url || undefined,
        scannedAt: new Date().toISOString(),
        scanMethod,
        nutritionGrade,
        isFavorite: false,
        category,
        calories: Math.round(product.nutriments?.["energy-kcal_100g"] || product.nutriments?.energy_kcal_100g || 0),
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
        location,
        analysisComplete: false,
        healthScore,
        warnings,
        benefits,
        barcode: product.code || undefined,
        nutriments: product.nutriments || {},
        ingredientAnalysis: [],
        dietaryPreferences: [],
        dangerousNutrients: [],
        safeNutrients: [],
      }

      try {
        const existingHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]") as HistoryItem[]
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
        const isDuplicate = existingHistory.some(
          (item) => item.productName === historyItem.productName && item.scannedAt > oneHourAgo,
        )

        if (!isDuplicate) {
          const updatedHistory = [historyItem, ...existingHistory].slice(0, 100)
          localStorage.setItem("scanHistory", JSON.stringify(updatedHistory))
        }
      } catch (error) {
        console.error("Error saving to history:", error)
      }
    },
    [calculateHealthScore, determineNutritionGrade, generateWarningsAndBenefits, determineCategory],
  )

  const handleProductSelect = useCallback(
    (product: Product) => {
      setIsRedirectingToAnalysis(true)

      const isBarcode = /^\d{8,14}$/.test(searchQuery.trim())
      const scanMethod = isBarcode ? "barcode" : "search"

      const productWithScanInfo = {
        ...product,
        _scanMethod: scanMethod,
        _scannedAt: new Date().toISOString(),
      }

      saveToHistory(product, scanMethod)

      const newRecentItems = [
        { ...product, scannedAt: new Date().toISOString() },
        ...recentItems.filter((item) => item.product_name !== product.product_name),
      ].slice(0, 5)

      setRecentItems(newRecentItems)

      try {
        localStorage.setItem("recentItems", JSON.stringify(newRecentItems))
        localStorage.setItem("selectedProduct", JSON.stringify(productWithScanInfo))
        localStorage.setItem("isRedirecting", "true")
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      setSearchQuery("")
      setSuggestions([])
      setShowSuggestions(false)

      router.push("/analysis")
    },
    [searchQuery, saveToHistory, recentItems, router],
  )

  const handleRecentItemClick = useCallback(
    (item: RecentItem) => {
      setIsRedirectingToAnalysis(true)

      const productWithScanInfo = {
        ...item,
        _scanMethod: "search",
        _scannedAt: new Date().toISOString(),
      }

      try {
        localStorage.setItem("selectedProduct", JSON.stringify(productWithScanInfo))
        localStorage.setItem("isRedirecting", "true")
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      router.push("/analysis")
    },
    [router],
  )

  const handleVoiceSearch = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported in your browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    setIsListening(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim()
      setSearchQuery(transcript)
      handleSearchInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      alert("Voice search failed. Please try again.")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [handleSearchInput])

  // Chatbot functions (keeping your existing implementation)
  const initializeChatbot = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome-msg",
      type: "bot",
      content: chatSteps.welcome.message,
      timestamp: new Date(),
      options: chatSteps.welcome.options,
    }
    setChatMessages([welcomeMessage])
    setCurrentChatStep("welcome")
  }, [chatSteps])

  const addBotMessage = useCallback(
    (stepId: string) => {
      const step = chatSteps[stepId]
      if (!step) {
        const fallbackMessage: ChatMessage = {
          id: `fallback-${Date.now()}`,
          type: "bot",
          content: "I'm sorry, I don't have information about that topic yet. Let me help you with something else!",
          timestamp: new Date(),
          options: [
            { id: "back_welcome", text: "🏠 Back to Main Menu", action: "navigate", nextStep: "welcome" },
            { id: "try_scanning", text: "📱 Try Scanning", action: "link", link: "/scan" },
          ],
        }
        setChatMessages((prev) => [...prev, fallbackMessage])
        setIsTyping(false)
        return
      }

      setIsTyping(true)

      setTimeout(
        () => {
          const newMessage: ChatMessage = {
            id: `${stepId}-${Date.now()}`,
            type: "bot",
            content: step.message,
            timestamp: new Date(),
            options: step.options,
          }

          setChatMessages((prev) => [...prev, newMessage])
          setCurrentChatStep(stepId)
          setIsTyping(false)

          setUserProgress((prev) => ({
            ...prev,
            completedSteps: [...prev.completedSteps, stepId],
          }))
        },
        1000 + Math.random() * 1000,
      )
    },
    [chatSteps],
  )

  const addUserMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, userMessage])
  }, [])

  const handleChatOption = useCallback(
    (option: ChatOption) => {
      addUserMessage(option.text)

      if (option.action === "navigate" && option.nextStep) {
        addBotMessage(option.nextStep)
      } else if (option.action === "link" && option.link) {
        const linkMessage: ChatMessage = {
          id: `link-${Date.now()}`,
          type: "bot",
          content: `🚀 Great! I'm taking you to ${option.link}. Feel free to come back anytime for more guidance!`,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, linkMessage])

        setTimeout(() => {
          router.push(option.link!)
          setShowChatbot(false)
        }, 1500)
      }
    },
    [addUserMessage, addBotMessage, router],
  )

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const nextArticle = useCallback(() => {
    setCurrentArticleIndex((prev) => (prev + 1) % knowledgeArticles.length)
  }, [knowledgeArticles.length])

  const prevArticle = useCallback(() => {
    setCurrentArticleIndex((prev) => (prev - 1 + knowledgeArticles.length) % knowledgeArticles.length)
  }, [knowledgeArticles.length])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX
      const threshold = 50

      if (touchStartX.current - touchEndX.current > threshold) {
        nextArticle()
      } else if (touchEndX.current - touchStartX.current > threshold) {
        prevArticle()
      }
    },
    [nextArticle, prevArticle],
  )

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      try {
        localStorage.setItem("theme", "dark")
      } catch (error) {
        console.error("Error saving theme:", error)
      }
    } else {
      document.documentElement.classList.remove("dark")
      try {
        localStorage.setItem("theme", "light")
      } catch (error) {
        console.error("Error saving theme:", error)
      }
    }
  }, [isDarkMode])

  const handlePWAInstall = useCallback(async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt()
      const { outcome } = await deferredPrompt.current.userChoice
      if (outcome === "accepted") {
        setShowPWAPrompt(false)
      }
      deferredPrompt.current = null
    }
  }, [])

  // Initialize component
  useEffect(() => {
    try {
      const skipAuth = localStorage.getItem("skipAuth")
      if (skipAuth) {
        console.log("User skipped authentication")
      }

      const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)]
      setCurrentTip(randomTip)

      const storedItems = JSON.parse(localStorage.getItem("recentItems") || "[]")
      setRecentItems(storedItems)

      const savedTheme = localStorage.getItem("theme") || "light"
      if (savedTheme === "dark") {
        setIsDarkMode(true)
        document.documentElement.classList.add("dark")
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error)
    }

    const welcomeInterval = setInterval(() => {
      setCurrentWelcomeIndex((prev) => (prev + 1) % welcomeMessages.length)
    }, 3000)

    const tipInterval = setInterval(() => {
      const randomQuickTip = quickTips[Math.floor(Math.random() * quickTips.length)]
      setCurrentQuickTip(randomQuickTip)
      setShowQuickTip(true)
      setTimeout(() => setShowQuickTip(false), 4000)
    }, 15000)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e
      setShowPWAPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      clearInterval(welcomeInterval)
      clearInterval(tipInterval)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [healthTips, welcomeMessages, quickTips])

  useEffect(() => {
    if (showChatbot && chatMessages.length === 0) {
      initializeChatbot()
    }
  }, [showChatbot, chatMessages.length, initializeChatbot])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isTyping, scrollToBottom])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-orange-100"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold foodsnap-text-gradient">FoodSnap</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-orange-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(true)}
              className="rounded-full hover:bg-orange-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showPWAPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`mx-4 mt-4 p-4 rounded-xl shadow-lg ${
              isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Install FoodSnap</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Add to home screen for quick access</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handlePWAInstall} className="text-xs">
                  Install
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowPWAPrompt(false)} className="text-xs">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL SEARCH BAR */}
      <div
        className={`relative px-4 py-3 shadow-sm transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative">
          <div
            className={`flex items-center rounded-full px-4 py-3 transition-colors duration-300 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search food items by name or barcode..."
              className="flex-1 border-none bg-transparent focus:ring-0 focus:outline-none"
              onFocus={() => searchQuery && setShowSuggestions(true)}
            />
            <div className="flex items-center space-x-2">
              {searchQuery && (
                <Button variant="ghost" size="icon" onClick={clearSearchHandler} className="rounded-full w-8 h-8">
                  <X className="w-4 h-4" />
                </Button>
              )}
              <div className="w-px h-5 bg-gray-300" />
              <Button variant="ghost" size="icon" onClick={handleVoiceSearch} className="rounded-full w-8 h-8 relative">
                <Mic className={`w-4 h-4 ${isListening ? "text-red-500" : ""}`} />
                {isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </Button>
            </div>
          </div>

          {/* PROFESSIONAL SEARCH SUGGESTIONS */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border max-h-64 overflow-y-auto z-50 ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Searching Indian & Global databases...</p>
                  </div>
                ) : searchError ? (
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <p className="text-sm font-medium text-orange-500">No Results</p>
                    </div>
                    <p className="text-xs text-gray-500">{searchError}</p>
                    <div className="mt-3 space-y-2">
                      <Link href="/scan">
                        <Button size="sm" variant="outline" className="w-full">
                          <Camera className="w-4 h-4 mr-2" />
                          Scan Barcode Instead
                        </Button>
                      </Link>
                      <Link href="/analysis">
                        <Button size="sm" variant="outline" className="w-full">
                          Enter Ingredients Manually
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((product, index) => (
                    <div
                      key={`${product.code || product.product_name}-${index}`}
                      onClick={() => handleProductSelect(product)}
                      className={`flex items-center p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                        isDarkMode ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-100"
                      }`}
                    >
                      <img
                        src={product.image_thumb_url || "/placeholder.svg?height=40&width=40"}
                        alt={product.product_name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=40&width=40"
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium block truncate">{product.product_name}</span>
                          {product.source === "IN" && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                              🇮🇳 IN
                            </span>
                          )}
                        </div>
                        {product.brands && (
                          <span className="text-xs text-gray-500 block truncate">{product.brands}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content - keeping all your existing UI */}
      <main className="px-4 lg:px-8 xl:px-12 pb-32 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`my-6 lg:my-12 p-6 lg:p-12 rounded-2xl lg:rounded-3xl shadow-lg transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
              : "bg-gradient-to-r from-orange-100 via-yellow-100 to-lime-100"
          }`}
        >
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-4">Discover What's in Your Food</h2>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentWelcomeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className={`text-lg lg:text-xl xl:text-2xl font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {welcomeMessages[currentWelcomeIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="hidden lg:block lg:flex-1 lg:ml-12">
              <motion.div
                className="relative w-64 h-64 xl:w-80 xl:h-80 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-orange-400 to-lime-400 rounded-full flex items-center justify-center shadow-2xl">
                  <Scan className="w-24 h-24 xl:w-32 xl:h-32 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Quick Tip Popup */}
        <AnimatePresence>
          {showQuickTip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`mb-4 lg:mb-8 p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg border-l-4 border-blue-500 max-w-4xl mx-auto ${
                isDarkMode ? "bg-gray-800" : "bg-blue-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm lg:text-base text-blue-600 dark:text-blue-400">Quick Tip</h4>
                  <p className="text-sm lg:text-base mt-1">{currentQuickTip}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Health Tip */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`mb-6 lg:mb-12 p-4 lg:p-6 border-l-4 border-green-500 rounded-r-xl lg:rounded-r-2xl transition-colors duration-300 max-w-4xl mx-auto ${
            isDarkMode ? "bg-gray-800" : "bg-green-50"
          }`}
        >
          <div className="flex items-center mb-2 lg:mb-3">
            <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 mr-2 lg:mr-3" />
            <h3 className="font-semibold lg:text-lg text-green-600 dark:text-green-400">Tip of the Day</h3>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm lg:text-base leading-relaxed">{currentTip}</p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
          {/* Recently Scanned */}
          <Card
            className={`shadow-lg border-0 transition-colors duration-300 hover:shadow-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <CardContent className="p-6 lg:p-8">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-semibold flex items-center">
                  <History className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 mr-2 lg:mr-3" />
                  Recent Scans
                </h3>
                <Link href="/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-3 lg:space-y-4">
                {recentItems.length > 0 ? (
                  recentItems.map((item, index) => (
                    <motion.div
                      key={`${item.product_name}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleRecentItemClick(item)}
                      className={`p-3 lg:p-4 border rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? "border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                          : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium lg:text-lg">{item.product_name}</span>
                        {item.scannedAt && (
                          <span className="text-xs lg:text-sm text-gray-500">
                            {new Date(item.scannedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 lg:gap-4 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                        <span className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full text-xs lg:text-sm">
                          Calories: {item.nutriments?.energy_kcal_100g ?? item.nutriments?.["energy-kcal_100g"] ?? "N/A"}
                        </span>
                        <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs lg:text-sm">
                          Protein: {item.nutriments?.proteins_100g ?? "N/A"}g
                        </span>
                        <span className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs lg:text-sm">
                          Sugar: {item.nutriments?.sugars_100g ?? "N/A"}g
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 lg:py-16">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 lg:text-lg">No scan history yet</p>
                    <p className="text-sm lg:text-base text-gray-400 mt-1">Start scanning to see your history here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Hub */}
          <Card
            className={`shadow-lg border-0 transition-colors duration-300 hover:shadow-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center mb-4 lg:mb-6">
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 mr-2 lg:mr-3" />
                <h3 className="text-lg lg:text-xl font-semibold">Knowledge Hub</h3>
              </div>

              <div
                className="relative h-48 lg:h-64 mb-4 lg:mb-6"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentArticleIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br ${knowledgeArticles[currentArticleIndex].color} shadow-md hover:shadow-lg transition-shadow duration-300`}
                  >
                    <h4 className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800 mb-2 lg:mb-4">
                      {knowledgeArticles[currentArticleIndex].title}
                    </h4>
                    <p className="text-gray-700 mb-4 lg:mb-6 text-sm lg:text-base leading-relaxed">
                      {knowledgeArticles[currentArticleIndex].content}
                    </p>
                    <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6">
                      <span className="text-xs lg:text-sm text-gray-600 bg-white/50 px-2 py-1 rounded-full">
                        {knowledgeArticles[currentArticleIndex].readTime}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center items-center space-x-4 lg:space-x-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevArticle}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>

                <div className="flex space-x-1 sm:space-x-1.5 lg:space-x-2">
                  {knowledgeArticles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentArticleIndex(index)}
                      className={`rounded-full transition-all duration-300 hover:scale-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                        index === currentArticleIndex
                          ? "bg-blue-500 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 scale-125"
                          : "bg-gray-300 hover:bg-gray-400 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3"
                      }`}
                      style={{
                        minWidth: index === currentArticleIndex ? "8px" : "6px",
                        minHeight: index === currentArticleIndex ? "8px" : "6px",
                      }}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextArticle}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Powered By Section */}
        <Suspense
          fallback={<div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mt-6 lg:mt-12"></div>}
        >
          <div className="mt-6 lg:mt-12">
            <PoweredBySection isDarkMode={isDarkMode} />
          </div>
        </Suspense>
      </main>

      {/* Analysis Redirection Animation */}
      <AnimatePresence>
        {isRedirectingToAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-gradient-to-br from-orange-500/95 via-yellow-500/95 to-lime-500/95 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <div className="text-center text-white max-w-sm mx-auto px-6">
              <motion.div
                className="relative w-28 h-28 mx-auto mb-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 border-4 border-white/20 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="absolute inset-3 border-3 border-white/40 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-6 border-2 border-white/60 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <BarChart3 className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.h3
                  className="text-2xl lg:text-3xl font-bold mb-3"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Preparing Analysis
                </motion.h3>
                <motion.p
                  className="text-lg text-white/90 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Gathering nutritional insights for healthier choices...
                </motion.p>
                <div className="w-48 h-1 bg-white/20 rounded-full mx-auto mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
                <motion.p
                  className="text-sm text-white/80"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  Analyzing ingredients and nutritional data...
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of your existing UI - Chatbot, Bottom Nav, Menu, Footer */}
      {/* ... keeping all existing code for chatbot, navigation, etc. ... */}

      {/* Chatbot FAB */}
      <div className="fixed bottom-28 right-6 z-30">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
          <Button
            size="icon"
            onClick={() => setShowChatbot(true)}
            className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 transition-all duration-300 group"
          >
            <motion.div
              animate={{
                rotate: showChatbot ? 0 : [0, -10, 10, -10, 0],
                scale: showChatbot ? 1.1 : 1,
              }}
              transition={{
                rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 },
                scale: { duration: 0.2 },
              }}
            >
              <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-lime-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              <HelpCircle className="w-2 h-2 text-white" />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 border-t px-4 py-2 z-40 transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-900/95 border-gray-700 backdrop-blur-md"
            : "bg-white/95 border-gray-200 backdrop-blur-md"
        }`}
      >
        <div className="flex justify-around items-center relative">
          <Link href="/home" className="flex flex-col items-center py-2 text-orange-500 transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            href="/history"
            className="flex flex-col items-center py-2 text-gray-500 hover:text-orange-500 transition-colors"
          >
            <History className="w-6 h-6 mb-1" />
            <span className="text-xs">History</span>
          </Link>
          <div className="flex flex-col items-center">
            <Link href="/scan" className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center shadow-lg transform -translate-y-3 hover:scale-105 transition-transform duration-200">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </Link>
            <span className="text-xs text-gray-500 mt-1">Scan</span>
          </div>
          <Link
            href="/community"
            className="flex flex-col items-center py-2 text-gray-500 hover:text-orange-500 transition-colors"
          >
            <Users className="w-6 h-6 mb-1" />
            <span className="text-xs">Community</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center py-2 text-gray-500 hover:text-orange-500 transition-colors"
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Menu Popup */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl w-full max-w-sm shadow-2xl transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`flex justify-between items-center p-6 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3 className="text-lg font-semibold">Menu</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowMenu(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4">
                <Link
                  href="/profile"
                  className={`flex items-center p-3 rounded-xl transition-colors ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <User className="w-5 h-5 text-gray-500 mr-3" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/badges"
                  className={`flex items-center p-3 rounded-xl transition-colors ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <Award className="w-5 h-5 text-gray-500 mr-3" />
                  <span>Badges & Points</span>
                </Link>

                <Link
                  href="/about"
                  className={`flex items-center p-3 rounded-xl transition-colors ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <Info className="w-5 h-5 text-gray-500 mr-3" />
                  <span>About</span>
                </Link>

                <Link
                  href="/"
                  className={`flex items-center p-3 rounded-xl transition-colors text-red-600 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close suggestions */}
      {showSuggestions && <div className="fixed inset-0 z-30" onClick={() => setShowSuggestions(false)} />}
    </div>
  )
}