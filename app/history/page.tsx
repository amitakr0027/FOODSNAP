"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search, Calendar, Clock, Trash2, Eye, Volume2, VolumeX, BarChart3, Camera, Mic, Type, Download, RefreshCw, Heart, AlertTriangle, CheckCircle, TrendingUp, X, Grid, List, Package, Apple, Coffee, Utensils, Candy, Milk, Wheat, MapPin, Target, Activity, Sun, Moon, Filter, SortAsc, Sparkles, Award, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOptimizedProfile } from "@/hooks/use-optimized-profile"
import { PerformanceOptimizer } from "@/lib/performance-utils"
import { VirtualizedList } from "@/components/optimized/VirtualizedList"

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

interface HistoryStats {
  totalScans: number
  thisWeek: number
  thisMonth: number
  averageGrade: string
  healthyChoices: number
  unhealthyChoices: number
  favoriteCategory: string
  scanStreak: number
}

export default function HistoryPage() {
  const { profile } = useOptimizedProfile()
  const router = useRouter()
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showAnalysisPopup, setShowAnalysisPopup] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isRedirectingToAnalysis, setIsRedirectingToAnalysis] = useState(false)

  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Memoized constants and calculations
  const categories = useMemo(() => [
    { name: "All", icon: Package, count: 0 },
    { name: "Beverages", icon: Coffee, count: 0 },
    { name: "Dairy", icon: Milk, count: 0 },
    { name: "Fresh Foods", icon: Apple, count: 0 },
    { name: "Packaged Foods", icon: Package, count: 0 },
    { name: "Snacks", icon: Candy, count: 0 },
    { name: "Grains", icon: Wheat, count: 0 },
    { name: "Others", icon: Utensils, count: 0 },
  ], [])

  const scanMethodIcons = useMemo(() => ({
    barcode: Camera,
    search: Search,
    voice: Mic,
    manual: Type,
  }), [])

  const gradeColors = useMemo(() => ({
    A: "from-emerald-500 via-green-500 to-teal-500",
    B: "from-lime-500 via-green-500 to-emerald-500",
    C: "from-yellow-500 via-amber-500 to-orange-500",
    D: "from-orange-500 via-red-500 to-pink-500",
    E: "from-red-500 via-rose-500 to-pink-600",
  }), [])

  const nutritionCardColors = useMemo(() => [
    "from-blue-500/10 to-cyan-500/10 border-blue-200/50",
    "from-purple-500/10 to-pink-500/10 border-purple-200/50",
    "from-green-500/10 to-emerald-500/10 border-green-200/50",
    "from-orange-500/10 to-yellow-500/10 border-orange-200/50",
    "from-rose-500/10 to-pink-500/10 border-rose-200/50",
    "from-indigo-500/10 to-blue-500/10 border-indigo-200/50",
    "from-teal-500/10 to-cyan-500/10 border-teal-200/50",
  ], [])

  // Memoized history stats calculation
  const historyStats = useMemo((): HistoryStats => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const thisWeek = historyItems.filter((item) => new Date(item.scannedAt) >= oneWeekAgo).length
    const thisMonth = historyItems.filter((item) => new Date(item.scannedAt) >= oneMonthAgo).length

    const gradeValues = { A: 5, B: 4, C: 3, D: 2, E: 1 }
    const avgGradeValue =
      historyItems.length > 0 ? historyItems.reduce((sum, item) => sum + gradeValues[item.nutritionGrade], 0) / historyItems.length : 3
    const averageGrade =
      Object.keys(gradeValues).find(
        (grade) => gradeValues[grade as keyof typeof gradeValues] === Math.round(avgGradeValue),
      ) || "C"

    const healthyChoices = historyItems.filter((item) => ["A", "B"].includes(item.nutritionGrade)).length
    const unhealthyChoices = historyItems.filter((item) => ["D", "E"].includes(item.nutritionGrade)).length

    const categoryCount: Record<string, number> = {}
    historyItems.forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
    })
    const favoriteCategory = Object.keys(categoryCount).reduce(
      (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
      "Packaged Foods",
    )

    const sortedDates = [...new Set(historyItems.map((item) => new Date(item.scannedAt).toDateString()))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    )

    let scanStreak = 0
    if (sortedDates.length > 0) {
      let currentDate = new Date()
      for (const dateStr of sortedDates) {
        const scanDate = new Date(dateStr)
        const diffDays = Math.floor((currentDate.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays <= scanStreak + 1) {
          scanStreak++
          currentDate = scanDate
        } else {
          break
        }
      }
    }

    return {
      totalScans: historyItems.length,
      thisWeek,
      thisMonth,
      averageGrade,
      healthyChoices,
      unhealthyChoices,
      favoriteCategory,
      scanStreak,
    }
  }, [historyItems])

  // Optimized data loading
  const loadHistoryData = useCallback(() => {
    const savedHistory = PerformanceOptimizer.getStorageItem("scanHistory", [])
    let loadedItems: HistoryItem[] = []

    if (savedHistory) {
      loadedItems = savedHistory
    }

    const analysisResults = PerformanceOptimizer.getStorageItem("analysisResults", [])
    if (analysisResults.length > 0) {
      loadedItems = loadedItems.map((item) => {
        const analysisResult = analysisResults.find(
          (result: any) =>
            result.productName === item.productName || result.barcode === item.barcode || result.id === item.id,
        )

        if (analysisResult) {
          return {
            ...item,
            analysisComplete: true,
            ingredientAnalysis: analysisResult.ingredientAnalysis || [],
            dietaryPreferences: analysisResult.dietaryPreferences || [],
            dangerousNutrients: analysisResult.dangerousNutrients || [],
            safeNutrients: analysisResult.safeNutrients || [],
            warnings: analysisResult.warnings || item.warnings,
            benefits: analysisResult.benefits || item.benefits,
            healthScore: analysisResult.healthScore || item.healthScore,
            nutritionGrade: analysisResult.nutritionGrade || item.nutritionGrade,
            notes: analysisResult.notes || item.notes,
          }
        }
        return item
      })
    }

    const recentAnalysis = PerformanceOptimizer.getStorageItem("recentAnalysisResult", null)
    if (recentAnalysis) {
      const existingIndex = loadedItems.findIndex(
        (item) =>
          item.productName === recentAnalysis.productName || item.barcode === recentAnalysis.barcode || item.id === recentAnalysis.id,
      )

      if (existingIndex !== -1) {
        loadedItems[existingIndex] = {
          ...loadedItems[existingIndex],
          analysisComplete: true,
          ingredientAnalysis: recentAnalysis.ingredientAnalysis || [],
          dietaryPreferences: recentAnalysis.dietaryPreferences || [],
          dangerousNutrients: recentAnalysis.dangerousNutrients || [],
          safeNutrients: recentAnalysis.safeNutrients || [],
          warnings: recentAnalysis.warnings || loadedItems[existingIndex].warnings,
          benefits: recentAnalysis.benefits || loadedItems[existingIndex].benefits,
          healthScore: recentAnalysis.healthScore || loadedItems[existingIndex].healthScore,
          nutritionGrade: recentAnalysis.nutritionGrade || loadedItems[existingIndex].nutritionGrade,
          notes: recentAnalysis.notes || loadedItems[existingIndex].notes,
        }
      } else {
        const newHistoryItem: HistoryItem = {
          id: recentAnalysis.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productName: recentAnalysis.productName || "Unknown Product",
          brand: recentAnalysis.brand,
          image: recentAnalysis.image,
          scannedAt: recentAnalysis.scannedAt || new Date().toISOString(),
          scanMethod: recentAnalysis.scanMethod || "search",
          nutritionGrade: recentAnalysis.nutritionGrade || "C",
          isFavorite: false,
          category: recentAnalysis.category || "Packaged Foods",
          calories: recentAnalysis.calories || 0,
          protein: recentAnalysis.protein || 0,
          fat: recentAnalysis.fat || 0,
          carbs: recentAnalysis.carbs || 0,
          sugar: recentAnalysis.sugar || 0,
          sodium: recentAnalysis.sodium || 0,
          fiber: recentAnalysis.fiber || 0,
          saturatedFat: recentAnalysis.saturatedFat || 0,
          tags: recentAnalysis.tags || [],
          location: recentAnalysis.location,
          notes: recentAnalysis.notes,
          analysisComplete: true,
          healthScore: recentAnalysis.healthScore || 50,
          warnings: recentAnalysis.warnings || [],
          benefits: recentAnalysis.benefits || [],
          barcode: recentAnalysis.barcode,
          ingredientAnalysis: recentAnalysis.ingredientAnalysis || [],
          dietaryPreferences: recentAnalysis.dietaryPreferences || [],
          nutriments: recentAnalysis.nutriments || {},
          dangerousNutrients: recentAnalysis.dangerousNutrients || [],
          safeNutrients: recentAnalysis.safeNutrients || [],
        }

        loadedItems.unshift(newHistoryItem)
      }

      PerformanceOptimizer.setStorageItem("recentAnalysisResult", null)
    }

    PerformanceOptimizer.setStorageItem("scanHistory", loadedItems)
    setHistoryItems(loadedItems)
    setFilteredItems(loadedItems)
  }, [])

  // Optimized filtering and search
  const applyFilters = useCallback(() => {
    let filtered = [...historyItems]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(query) ||
          item.brand?.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (selectedFilter !== "all") {
      if (selectedFilter === "favorites") {
        filtered = filtered.filter((item) => item.isFavorite)
      } else if (selectedFilter === "healthy") {
        filtered = filtered.filter((item) => ["A", "B"].includes(item.nutritionGrade))
      } else if (selectedFilter === "unhealthy") {
        filtered = filtered.filter((item) => ["D", "E"].includes(item.nutritionGrade))
      } else {
        filtered = filtered.filter((item) => item.category === selectedFilter)
      }
    }

    if (selectedDateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (selectedDateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter((item) => new Date(item.scannedAt) >= filterDate)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
        case "oldest":
          return new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime()
        case "healthiest":
          return b.healthScore - a.healthScore
        case "unhealthiest":
          return a.healthScore - b.healthScore
        case "name":
          return a.productName.localeCompare(b.productName)
        case "calories":
          return b.calories - a.calories
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }, [historyItems, searchQuery, selectedFilter, sortBy, selectedDateRange])

  // Debounced search
  const debouncedSearch = useCallback(
    PerformanceOptimizer.debounce((query: string) => {
      setSearchQuery(query)
    }, 300, 'history-search'),
    []
  )

  const handleSearch = useCallback((query: string) => {
    debouncedSearch(query)
  }, [debouncedSearch])

  // Optimized item actions
  const toggleFavorite = useCallback((id: string) => {
    setHistoryItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      )
      PerformanceOptimizer.setStorageItem("scanHistory", updatedItems)
      return updatedItems
    })
  }, [])

  const deleteItem = useCallback((id: string) => {
    setHistoryItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id)
      PerformanceOptimizer.setStorageItem("scanHistory", updatedItems)
      setShowDeleteConfirm(null)
      return updatedItems
    })
  }, [])

  const bulkDelete = useCallback(() => {
    setHistoryItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => !selectedItems.includes(item.id))
      PerformanceOptimizer.setStorageItem("scanHistory", updatedItems)
      setSelectedItems([])
      return updatedItems
    })
  }, [selectedItems])

  // Enhanced reAnalyze with immediate loading state
  const reAnalyze = useCallback((item: HistoryItem) => {
    // Show loading animation immediately
    setIsRedirectingToAnalysis(true)
    
    const productForAnalysis = {
      product_name: item.productName,
      brands: item.brand,
      code: item.barcode,
      nutriments: {
        "energy-kcal_100g": item.calories,
        proteins_100g: item.protein,
        fat_100g: item.fat,
        carbohydrates_100g: item.carbs,
        sugars_100g: item.sugar,
        sodium_100g: item.sodium / 1000,
        fiber_100g: item.fiber,
      },
      nutrition_grades_tags: [item.nutritionGrade.toLowerCase()],
      image_thumb_url: item.image,
      _scanMethod: item.scanMethod,
      _scannedAt: new Date().toISOString(),
    }

    PerformanceOptimizer.setStorageItem("selectedProduct", productForAnalysis)
    PerformanceOptimizer.setStorageItem("isRedirecting", "true")
    
    // Navigate immediately without delay
    router.push("/analysis")
  }, [router])

  const speakSummary = useCallback((item: HistoryItem) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return

    const summary = `${item.productName} by ${item.brand || "unknown brand"}. 
    Nutrition grade ${item.nutritionGrade}. 
    ${item.calories} calories, ${item.protein} grams protein, ${item.sugar} grams sugar. 
    Health score: ${item.healthScore} out of 100.`

    const utterance = new SpeechSynthesisUtterance(summary)
    utterance.rate = 0.8
    utterance.pitch = 1
    speechSynthesis.speak(utterance)
  }, [voiceEnabled])

  const exportHistory = useCallback(() => {
    const exportData = {
      history: historyItems,
      stats: historyStats,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodsnap-history-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [historyItems, historyStats])

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }, [])

  const getHealthScoreColor = useCallback((score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400"
    if (score >= 60) return "text-lime-600 dark:text-lime-400"
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400"
    if (score >= 20) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }, [])

  // Optimized render function for history items
  const renderHistoryItem = useCallback((item: HistoryItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-4"
    >
      <Card
        className={`shadow-xl border-0 transition-all duration-300 hover:shadow-2xl cursor-pointer backdrop-blur-sm group ${
          isDarkMode
            ? "bg-gray-800/80 hover:bg-gray-750/90 shadow-gray-900/50"
            : "bg-white/80 hover:bg-white/90 shadow-orange-100/50"
        } ${selectedItems.includes(item.id) ? "ring-2 ring-orange-500 shadow-orange-200" : ""} hover:scale-[1.02]`}
        onClick={() => {
          if (selectedItems.length > 0) {
            setSelectedItems((prev) =>
              prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
            )
          }
        }}
      >
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
            {/* Product Image */}
            <div className="relative w-full sm:w-20 md:w-24 aspect-square sm:aspect-auto sm:h-20 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
              <img
                src={item.image || "/placeholder.svg?height=200&width=200&query=food+product"}
                alt={item.productName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/generic-food-product.png"
                }}
              />

              {/* Grade Badge */}
              <div className={`absolute top-2 left-2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r ${gradeColors[item.nutritionGrade]} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-xs sm:text-sm">{item.nutritionGrade}</span>
              </div>

              {/* Scan Method Icon */}
              <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-black/60 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                {React.createElement(scanMethodIcons[item.scanMethod], {
                  className: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white",
                })}
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(item.id)
                }}
                className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
              >
                {item.isFavorite ? (
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-500 fill-current" />
                ) : (
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400" />
                )}
              </button>

              {/* Selection Checkbox */}
              {selectedItems.length > 0 && (
                <div className="absolute bottom-2 left-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-lg">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => {}}
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Product Name and Health Score */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.productName}
                  </h3>
                  {item.brand && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-1">
                      {item.brand}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <div className="text-right">
                    <div className={`text-sm sm:text-lg md:text-xl font-bold ${getHealthScoreColor(item.healthScore)}`}>
                      {item.healthScore}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Health Score</div>
                  </div>
                </div>
              </div>

              {/* Nutrition Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Calories", value: item.calories, unit: "kcal", color: "text-red-600" },
                  { label: "Protein", value: item.protein, unit: "g", color: "text-blue-600" },
                  { label: "Sugar", value: item.sugar, unit: "g", color: "text-purple-600" },
                  { label: "Sodium", value: Math.round(item.sodium), unit: "mg", color: "text-orange-600" },
                ].map((nutrient, idx) => (
                  <div
                    key={nutrient.label}
                    className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${
                      nutritionCardColors[idx % nutritionCardColors.length]
                    } border transition-all duration-300 hover:shadow-md`}
                  >
                    <div className={`text-xs sm:text-sm md:text-base font-bold ${nutrient.color} dark:opacity-90`}>
                      {nutrient.value}
                      <span className="text-xs ml-1">{nutrient.unit}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {nutrient.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Date, Location and Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="whitespace-nowrap">{formatDate(item.scannedAt)}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center min-w-0">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate max-w-24 sm:max-w-32">{item.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 flex-shrink-0">
                  {voiceEnabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        speakSummary(item)
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                    >
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowAnalysisPopup(item.id)
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      reAnalyze(item)
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200"
                  >
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm(item.id)
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ), [isDarkMode, selectedItems, gradeColors, scanMethodIcons, nutritionCardColors, getHealthScoreColor, formatDate, voiceEnabled, toggleFavorite, speakSummary, reAnalyze])

  // Effects
  useEffect(() => {
    loadHistoryData()
  }, [loadHistoryData])

  useEffect(() => {
    if (profile?.accessibility?.darkMode) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }

    setVoiceEnabled(profile?.accessibility?.audioOutput || false)
  }, [profile?.accessibility?.darkMode, profile?.accessibility?.audioOutput])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "recentAnalysisResult" && e.newValue) {
        loadHistoryData()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const recentAnalysis = PerformanceOptimizer.getStorageItem("recentAnalysisResult", null)
        if (recentAnalysis) {
          loadHistoryData()
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      PerformanceOptimizer.cleanup()
    }
  }, [loadHistoryData])

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-lg transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-900/90 border-gray-700/50 shadow-gray-900/20"
            : "bg-white/90 border-orange-100/50 shadow-orange-100/20"
        }`}
      >
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-orange-100 dark:hover:bg-gray-800 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
              <Clock className="w-4 h-4 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-lime-600 bg-clip-text text-transparent truncate">
                <span className="hidden xs:inline">Scan </span>History
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span className="hidden xs:inline">{filteredItems.length} of </span> 
                {historyItems.length} items
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(true)}
              className="sm:hidden rounded-xl hover:bg-orange-100 dark:hover:bg-gray-800 transition-all duration-200 w-8 h-8"
            >
              <Menu className="w-4 h-4" />
            </Button>

            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="rounded-xl hover:bg-orange-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {voiceEnabled ? <Volume2 className="w-5 h-5 text-orange-500" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsDarkMode(!isDarkMode)
                  if (!isDarkMode) {
                    document.documentElement.classList.add("dark")
                  } else {
                    document.documentElement.classList.remove("dark")
                  }
                }}
                className="rounded-xl hover:bg-orange-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStats(!showStats)}
                className="rounded-xl hover:bg-orange-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <BarChart3 className={`w-5 h-5 ${showStats ? "text-orange-500" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportHistory}
                className="items-center space-x-2 bg-transparent border-orange-200 hover:bg-orange-50 dark:border-gray-700 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 sm:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold">Menu</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileMenu(false)}
                    className="rounded-xl w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled)
                      setShowMobileMenu(false)
                    }}
                    className="w-full justify-start rounded-xl p-4 h-auto"
                  >
                    {voiceEnabled ? (
                      <Volume2 className="w-5 h-5 mr-3 text-orange-500" />
                    ) : (
                      <VolumeX className="w-5 h-5 mr-3" />
                    )}
                    <div className="text-left">
                      <div className="font-medium">Voice Summary</div>
                      <div className="text-sm text-gray-500">{voiceEnabled ? "Enabled" : "Disabled"}</div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsDarkMode(!isDarkMode)
                      if (!isDarkMode) {
                        document.documentElement.classList.add("dark")
                      } else {
                        document.documentElement.classList.remove("dark")
                      }
                      setShowMobileMenu(false)
                    }}
                    className="w-full justify-start rounded-xl p-4 h-auto"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5 mr-3 text-yellow-500" /> : <Moon className="w-5 h-5 mr-3" />}
                    <div className="text-left">
                      <div className="font-medium">Theme</div>
                      <div className="text-sm text-gray-500">{isDarkMode ? "Dark Mode" : "Light Mode"}</div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowStats(!showStats)
                      setShowMobileMenu(false)
                    }}
                    className="w-full justify-start rounded-xl p-4 h-auto"
                  >
                    <BarChart3 className={`w-5 h-5 mr-3 ${showStats ? "text-orange-500" : ""}`} />
                    <div className="text-left">
                      <div className="font-medium">Analytics</div>
                      <div className="text-sm text-gray-500">{showStats ? "Hide" : "Show"} stats</div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      exportHistory()
                      setShowMobileMenu(false)
                    }}
                    className="w-full justify-start rounded-xl p-4 h-auto"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Export History</div>
                      <div className="text-sm text-gray-500">Download your data</div>
                    </div>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 sm:mb-8 px-4"
          >
            <Card
              className={`shadow-2xl border-0 transition-all duration-300 backdrop-blur-sm ${
                isDarkMode ? "bg-gray-800/80 shadow-gray-900/50" : "bg-white/80 shadow-orange-100/50"
              }`}
            >
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-base sm:text-xl font-bold">
                      <span className="hidden xs:inline">Your Scanning </span>Analytics
                    </span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStats(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-6">
                  {[
                    {
                      label: "Total Scans",
                      shortLabel: "Total",
                      value: historyStats.totalScans,
                      icon: Target,
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      label: "This Week",
                      shortLabel: "Week",
                      value: historyStats.thisWeek,
                      icon: Calendar,
                      gradient: "from-green-500 to-emerald-500",
                    },
                    {
                      label: "This Month",
                      shortLabel: "Month",
                      value: historyStats.thisMonth,
                      icon: TrendingUp,
                      gradient: "from-purple-500 to-pink-500",
                    },
                    {
                      label: "Avg Grade",
                      shortLabel: "Grade",
                      value: historyStats.averageGrade,
                      icon: Award,
                      gradient: "from-yellow-500 to-orange-500",
                    },
                    {
                      label: "Healthy",
                      shortLabel: "Healthy",
                      value: historyStats.healthyChoices,
                      icon: CheckCircle,
                      gradient: "from-emerald-500 to-teal-500",
                    },
                    {
                      label: "Unhealthy",
                      shortLabel: "Unhealthy",
                      value: historyStats.unhealthyChoices,
                      icon: AlertTriangle,
                      gradient: "from-red-500 to-rose-500",
                    },
                    {
                      label: "Streak",
                      shortLabel: "Streak",
                      value: `${historyStats.scanStreak}d`,
                      icon: Activity,
                      gradient: "from-orange-500 to-red-500",
                    },
                    {
                      label: "Favorites",
                      shortLabel: "Fav",
                      value: historyItems.filter((item) => item.isFavorite).length,
                      icon: Heart,
                      gradient: "from-pink-500 to-rose-500",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center group"
                    >
                      <div
                        className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r ${stat.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                      >
                        <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold mb-1">{stat.value}</p>
                      <p className="text-xs sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span className="sm:hidden">{stat.shortLabel}</span>
                        <span className="hidden sm:inline">{stat.label}</span>
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <Card
        className={`shadow-2xl border-0 transition-all duration-300 mb-6 sm:mb-8 backdrop-blur-sm mx-4 ${
          isDarkMode ? "bg-gray-800/80 shadow-gray-900/50" : "bg-white/80 shadow-orange-100/50"
        }`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Search products..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
              />
            </div>

            <div className="sm:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-between rounded-xl border-gray-300 dark:border-gray-600 h-10"
              >
                <span className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters & Sort
                </span>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                  {selectedFilter !== "all" || sortBy !== "newest" || selectedDateRange !== "all" ? "Active" : "None"}
                </span>
              </Button>
            </div>

            <div className="hidden sm:flex flex-wrap gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 text-sm font-medium min-w-[140px] appearance-none bg-white dark:bg-gray-700"
                >
                  <option value="all">All Categories</option>
                  <option value="favorites">⭐ Favorites</option>
                  <option value="healthy">🥗 Healthy (A-B)</option>
                  <option value="unhealthy">🚫 Unhealthy (D-E)</option>
                  <option value="Beverages">🥤 Beverages</option>
                  <option value="Dairy">🥛 Dairy</option>
                  <option value="Fresh Foods">🥬 Fresh Foods</option>
                  <option value="Packaged Foods">📦 Packaged</option>
                  <option value="Snacks">🍿 Snacks</option>
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 text-sm font-medium min-w-[120px] appearance-none bg-white dark:bg-gray-700"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 text-sm font-medium min-w-[140px] appearance-none bg-white dark:bg-gray-700"
                >
                  <option value="newest">🕐 Newest First</option>
                  <option value="oldest">🕐 Oldest First</option>
                  <option value="healthiest">💚 Healthiest</option>
                  <option value="unhealthiest">❤️ Unhealthiest</option>
                  <option value="name">🔤 Name A-Z</option>
                  <option value="calories">🔥 Highest Calories</option>
                </select>
              </div>

              <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none border-0 px-4 py-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none border-0 px-4 py-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="sm:hidden space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 text-sm appearance-none bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Categories</option>
                      <option value="favorites">⭐ Favorites</option>
                      <option value="healthy">🥗 Healthy (A-B)</option>
                      <option value="unhealthy">🚫 Unhealthy (D-E)</option>
                      <option value="Beverages">🥤 Beverages</option>
                      <option value="Dairy">🥛 Dairy</option>
                      <option value="Fresh Foods">🥬 Fresh Foods</option>
                      <option value="Packaged Foods">📦 Packaged</option>
                      <option value="Snacks">🍿 Snacks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date Range</label>
                    <select
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 text-sm appearance-none bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 text-sm appearance-none bg-white dark:bg-gray-700"
                    >
                      <option value="newest">🕐 Newest First</option>
                      <option value="oldest">🕐 Oldest First</option>
                      <option value="healthiest">💚 Healthiest</option>
                      <option value="unhealthiest">❤️ Unhealthiest</option>
                      <option value="name">🔤 Name A-Z</option>
                      <option value="calories">🔥 Highest Calories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">View Mode</label>
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex-1 rounded-none border-0 py-3"
                      >
                        <List className="w-4 h-4 mr-2" />
                        List
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="flex-1 rounded-none border-0 py-3"
                      >
                        <Grid className="w-4 h-4 mr-2" />
                        Grid
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedFilter("all")
                        setSelectedDateRange("all")
                        setSortBy("newest")
                      }}
                      className="flex-1 rounded-xl"
                    >
                      Clear All
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                    >
                      Apply
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={bulkDelete}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItems([])}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* History Items */}
      <main className="px-4 pb-32">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-24"
          >
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Clock className="w-10 h-10 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              {searchQuery || selectedFilter !== "all" || selectedDateRange !== "all"
                ? "No matching items found"
                : "No scan history yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery || selectedFilter !== "all" || selectedDateRange !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start scanning products to build your personal nutrition history and track your healthy choices over time."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/scan">
                <Button className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Scanning
                </Button>
              </Link>
              {(searchQuery || selectedFilter !== "all" || selectedDateRange !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedFilter("all")
                    setSelectedDateRange("all")
                    setSortBy("newest")
                  }}
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" : "space-y-4"}>
            {/* Use VirtualizedList only on desktop for performance, regular rendering on mobile for proper display */}
            {viewMode === "list" && !isMobile && filteredItems.length > 10 ? (
              <VirtualizedList
                items={filteredItems}
                itemHeight={200}
                containerHeight={600}
                renderItem={renderHistoryItem}
                className="space-y-4"
              />
            ) : (
              filteredItems.map((item, index) => renderHistoryItem(item, index))
            )}
          </div>
        )}
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
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-3 border-3 border-white/40 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-6 border-2 border-white/60 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    <BarChart3 className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 30}%`,
                      left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 30}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.h3
                  className="text-2xl lg:text-3xl font-bold mb-3"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Re-analyzing Product
                </motion.h3>
                <motion.p
                  className="text-lg text-white/90 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Loading detailed nutritional analysis...
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
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Preparing comprehensive insights...
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl w-full max-w-md shadow-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Delete Item</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this item from your scan history?
                </p>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 rounded-xl border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => deleteItem(showDeleteConfirm)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Popup */}
      <AnimatePresence>
        {showAnalysisPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAnalysisPopup(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {(() => {
                const item = historyItems.find((item) => item.id === showAnalysisPopup)
                if (!item) return null

                return (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Quick Analysis</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAnalysisPopup(null)}
                        className="rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg?height=80&width=80&query=food+product"}
                          alt={item.productName}
                          className="w-20 h-20 rounded-xl object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/generic-food-product.png"
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-bold">{item.productName}</h4>
                          {item.brand && (
                            <p className="text-gray-600 dark:text-gray-400">{item.brand}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${
                                gradeColors[item.nutritionGrade]
                              } rounded-lg flex items-center justify-center`}
                            >
                              <span className="text-white font-bold text-sm">{item.nutritionGrade}</span>
                            </div>
                            <span className={`font-bold ${getHealthScoreColor(item.healthScore)}`}>
                              {item.healthScore}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Calories", value: item.calories, unit: "kcal" },
                          { label: "Protein", value: item.protein, unit: "g" },
                          { label: "Fat", value: item.fat, unit: "g" },
                          { label: "Carbs", value: item.carbs, unit: "g" },
                          { label: "Sugar", value: item.sugar, unit: "g" },
                          { label: "Sodium", value: Math.round(item.sodium), unit: "mg" },
                        ].map((nutrient) => (
                          <div
                            key={nutrient.label}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                          >
                            <div className="text-lg font-bold">
                              {nutrient.value}
                              <span className="text-sm ml-1">{nutrient.unit}</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {nutrient.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {item.warnings && item.warnings.length > 0 && (
                        <div>
                          <h5 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Health Warnings
                          </h5>
                          <ul className="space-y-1">
                            {item.warnings.map((warning, idx) => (
                              <li key={idx} className="text-sm text-red-600 dark:text-red-400">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.benefits && item.benefits.length > 0 && (
                        <div>
                          <h5 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Health Benefits
                          </h5>
                          <ul className="space-y-1">
                            {item.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm text-green-600 dark:text-green-400">
                                • {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => {
                            reAnalyze(item)
                            setShowAnalysisPopup(null)
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white rounded-xl"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Full Analysis
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAnalysisPopup(null)}
                          className="flex-1 rounded-xl border-gray-300 dark:border-gray-600"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
