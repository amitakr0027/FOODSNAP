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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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

export default function AnalysisComponent() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [servingSize, setServingSize] = useState<string>("")
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [ingredientAnalysis, setIngredientAnalysis] = useState<IngredientAnalysis[]>([])
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [audioTranscript, setAudioTranscript] = useState("")

  // Replace the audio ref and related state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechProgress, setSpeechProgress] = useState(0)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

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

  // Utility functions for history saving
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

  const calculateHealthScore = (product: Product): number => {
    const nutriments = product.nutriments || {}
    let score = 100

    // Deduct points for high calories
    const calories = nutriments["energy-kcal_100g"] || 0
    if (calories > 400) score -= 20
    else if (calories > 250) score -= 10

    // Deduct points for high sugar
    const sugar = nutriments.sugars_100g || 0
    if (sugar > 15) score -= 25
    else if (sugar > 10) score -= 15
    else if (sugar > 5) score -= 5

    // Deduct points for high sodium
    const sodium = (nutriments.sodium_100g || 0) * 1000 // Convert to mg
    if (sodium > 600) score -= 20
    else if (sodium > 400) score -= 10

    // Deduct points for high saturated fat
    const satFat = nutriments["saturated-fat_100g"] || 0
    if (satFat > 5) score -= 15
    else if (satFat > 3) score -= 8

    // Add points for fiber
    const fiber = nutriments.fiber_100g || 0
    if (fiber > 5) score += 10
    else if (fiber > 3) score += 5

    // Add points for protein
    const protein = nutriments.proteins_100g || 0
    if (protein > 10) score += 10
    else if (protein > 5) score += 5

    return Math.max(0, Math.min(100, score))
  }

  const determineNutritionGrade = (healthScore: number): "A" | "B" | "C" | "D" | "E" => {
    if (healthScore >= 80) return "A"
    if (healthScore >= 65) return "B"
    if (healthScore >= 50) return "C"
    if (healthScore >= 35) return "D"
    return "E"
  }

  // Enhanced function to calculate nutrition grade from multiple sources
  const calculateNutritionGrade = (product: Product): "A" | "B" | "C" | "D" | "E" => {
    // First, try to get grade from OpenFoodFacts nutrition_grades_tags
    if (product.nutrition_grades_tags && product.nutrition_grades_tags.length > 0) {
      const gradeTag = product.nutrition_grades_tags[0]
      // Extract grade from tags like "en:a", "en:b", etc.
      const gradeMatch = gradeTag.match(/[a-e]/i)
      if (gradeMatch) {
        const grade = gradeMatch[0].toUpperCase() as "A" | "B" | "C" | "D" | "E"
        // Validate it's a proper grade
        if (["A", "B", "C", "D", "E"].includes(grade)) {
          return grade
        }
      }
    }

    // If no valid grade from OpenFoodFacts, calculate our own based on health score
    const healthScore = calculateHealthScore(product)
    return determineNutritionGrade(healthScore)
  }

  const generateWarningsAndBenefits = (product: Product) => {
    const nutriments = product.nutriments || {}
    const warnings: string[] = []
    const benefits: string[] = []

    // Check for warnings
    const sugar = nutriments.sugars_100g || 0
    if (sugar > 15) warnings.push("Very high sugar content")
    else if (sugar > 10) warnings.push("High sugar content")

    const sodium = (nutriments.sodium_100g || 0) * 1000
    if (sodium > 600) warnings.push("Very high sodium")
    else if (sodium > 400) warnings.push("High sodium")

    const calories = nutriments["energy-kcal_100g"] || 0
    if (calories > 400) warnings.push("High calorie content")

    const satFat = nutriments["saturated-fat_100g"] || 0
    if (satFat > 5) warnings.push("High saturated fat")

    // Check for benefits
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
  }

  // Save complete analysis to history - FIXED VERSION
  const saveCompleteAnalysisToHistory = useCallback(() => {
    if (!product) return

    const healthScore = calculateHealthScore(product)
    const nutritionGrade = calculateNutritionGrade(product) // Use the enhanced function
    const { warnings, benefits } = generateWarningsAndBenefits(product)
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
      sodium: Math.round((product.nutriments?.sodium_100g || 0) * 1000), // Convert to mg
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
      // Complete nutriments data
      nutriments: product.nutriments || {},
      // Analysis data
      ingredientAnalysis: ingredientAnalysis,
      dietaryPreferences: dietaryPreferences,
      dangerousNutrients: nutrients
        .filter((nutrient) => isDangerous(nutrient, product.nutriments?.[nutrient.key]))
        .map((n) => n.key),
      safeNutrients: nutrients
        .filter((nutrient) => !isDangerous(nutrient, product.nutriments?.[nutrient.key]))
        .map((n) => n.key),
    }

    // Get existing history
    const existingHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]")

    // Check if this product was recently added (within 10 minutes) to avoid duplicates
    const recentTimeThreshold = Date.now() - 10 * 60 * 1000 // 10 minutes ago
    const existingIndex = existingHistory.findIndex(
      (item: HistoryItem) =>
        item.productName === analysisData.productName && new Date(item.scannedAt).getTime() > recentTimeThreshold,
    )

    if (existingIndex !== -1) {
      // Update existing item with complete analysis
      existingHistory[existingIndex] = {
        ...existingHistory[existingIndex],
        ...analysisData,
        id: existingHistory[existingIndex].id, // Keep original ID
        scannedAt: existingHistory[existingIndex].scannedAt, // Keep original scan time
      }
      console.log("Updated existing history item with complete analysis:", analysisData.productName)
    } else {
      // Add new item to beginning of array
      existingHistory.unshift(analysisData)
      console.log("Added new complete analysis to history:", analysisData.productName)
    }

    // Keep only last 100 items
    const updatedHistory = existingHistory.slice(0, 100)
    localStorage.setItem("scanHistory", JSON.stringify(updatedHistory))

    // Also save to recentAnalysisResult for real-time updates
    localStorage.setItem("recentAnalysisResult", JSON.stringify(analysisData))

    console.log("Complete analysis data saved to history for:", product.product_name)
  }, [product, ingredientAnalysis, dietaryPreferences, nutrients])

  // Load product data on component mount
  useEffect(() => {
    // Check for redirection flag immediately on client-side mount
    const selectedProduct = localStorage.getItem("selectedProduct")
    const isRedirecting = localStorage.getItem("isRedirecting")

    if (selectedProduct) {
      try {
        const productData = JSON.parse(selectedProduct)

        // Show loading animation if coming from redirection
        if (isRedirecting) {
          setIsInitialLoading(true)
          // Reduced delay for smoother transition
          setTimeout(() => {
            setProduct(productData)
            setIsInitialLoading(false)
            localStorage.removeItem("selectedProduct")
            localStorage.removeItem("isRedirecting")
            generateAudioSummary(productData)
            console.log(
              "Product loaded for analysis:",
              productData.product_name,
              "Scan method:",
              productData._scanMethod,
            )
          }, 600) // Reduced from 1200ms to 600ms
        } else {
          // Direct access, load immediately
          setProduct(productData)
          setIsInitialLoading(false)
          localStorage.removeItem("selectedProduct")
          generateAudioSummary(productData)
          console.log("Product loaded for analysis:", productData.product_name, "Scan method:", productData._scanMethod)
        }
      } catch (error) {
        console.error("Error parsing product data:", error)
        setIsInitialLoading(false)
      }
    } else {
      setIsInitialLoading(false)
    }
  }, [])

  // Analyze ingredients when product changes
  useEffect(() => {
    if (product?.ingredients_text) {
      analyzeIngredients(product.ingredients_text)
      analyzeDietaryPreferences(product.ingredients_text)
    }
  }, [product])

  // Save analysis when complete - FIXED TRIGGER
  useEffect(() => {
    // Only save when we have product and analysis is complete
    if (product && ingredientAnalysis.length > 0 && dietaryPreferences.length > 0 && !isAnalyzing) {
      // Small delay to ensure all analysis is complete
      const timer = setTimeout(() => {
        saveCompleteAnalysisToHistory()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [product, ingredientAnalysis, dietaryPreferences, isAnalyzing, saveCompleteAnalysisToHistory])

  // Handle serving size changes
  const handleServingSizeChange = useCallback((value: string) => {
    setServingSize(value)
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setServingMultiplier(numValue / 100) // Assuming base values are per 100g
    } else {
      setServingMultiplier(1)
    }
  }, [])

  // Generate audio summary
  const generateAudioSummary = useCallback(
    async (productData: Product) => {
      const grade = calculateNutritionGrade(productData) // Use the enhanced function
      const calories = Math.round(productData.nutriments?.["energy-kcal_100g"] || 0)
      const protein = Math.round((productData.nutriments?.proteins_100g || 0) * 10) / 10
      const sugar = Math.round((productData.nutriments?.sugars_100g || 0) * 10) / 10
      const sodium = Math.round((productData.nutriments?.sodium_100g || 0) * 1000)

      const dangerousNutrients = nutrients.filter((nutrient) =>
        isDangerous(nutrient, productData.nutriments?.[nutrient.key]),
      )

      const summary = `Analysis complete for ${productData.product_name || "this product"}. 
${productData.brands ? `Brand: ${productData.brands}.` : ""} 
This product has a nutrition grade of ${grade}. 
Nutritional information per 100 grams: ${calories} calories, ${protein} grams protein, ${sugar} grams sugar, and ${sodium} milligrams sodium.
${dangerousNutrients.length > 0 ? `Warning: This product contains high levels of ${dangerousNutrients.map((n) => n.label).join(", ")}.` : ""}
Complete ingredient analysis and dietary compatibility information are now available for review.`

      setAudioTranscript(summary)
    },
    [nutrients],
  )

  // Analyze ingredients using intelligent analysis
  const analyzeIngredients = useCallback(async (ingredientsText: string) => {
    setIsAnalyzing(true)
    try {
      // Simulate API processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Split ingredients and clean them - ANALYZE ALL INGREDIENTS
      const ingredients = ingredientsText
        .split(/[,;]/)
        .map((ingredient) => ingredient.trim())
        .filter((ingredient) => ingredient.length > 0)
      // Remove the slice limit to analyze ALL ingredients

      const analysisResults: IngredientAnalysis[] = ingredients.map((ingredient) => {
        const lowerIngredient = ingredient.toLowerCase()

        // Define ingredient categories and their analysis
        const ingredientAnalysis = analyzeIndividualIngredient(lowerIngredient, ingredient)

        return ingredientAnalysis
      })

      // Sort results: good first, then moderate, then bad for better UX
      const sortedResults = analysisResults.sort((a, b) => {
        const statusOrder = { good: 0, moderate: 1, bad: 2 }
        return statusOrder[a.status] - statusOrder[b.status]
      })

      setIngredientAnalysis(sortedResults)
      console.log("Ingredient analysis complete:", sortedResults.length, "ingredients analyzed")
    } catch (error) {
      console.error("Error analyzing ingredients:", error)
      // Fallback analysis if something goes wrong
      const fallbackAnalysis: IngredientAnalysis[] = [
        {
          ingredient: "Analysis Error",
          status: "moderate",
          reason: "Unable to analyze ingredients at this time",
        },
      ]
      setIngredientAnalysis(fallbackAnalysis)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  // Helper function to analyze individual ingredients
  const analyzeIndividualIngredient = (lowerIngredient: string, originalIngredient: string): IngredientAnalysis => {
    // FOCUS ON LESSER-KNOWN HARMFUL INGREDIENTS FIRST
    const dangerousHiddenIngredients = {
      // Carcinogenic and highly toxic compounds
      "4-methylimidazole": "Carcinogenic compound formed in caramel coloring, linked to cancer",
      "4-mei": "Carcinogenic byproduct of caramel color manufacturing",
      acrylamide: "Neurotoxic and carcinogenic compound, damages nervous system",
      benzopyrene: "Highly carcinogenic compound, causes DNA damage",
      formaldehyde: "Known carcinogen, toxic to respiratory system",

      // Endocrine disruptors
      "bisphenol a": "Endocrine disruptor, mimics estrogen, affects hormones",
      bpa: "Hormone disruptor linked to reproductive issues and cancer",
      phthalates: "Endocrine disruptors, affect reproductive development",
      parabens: "Hormone disruptors that mimic estrogen",
      propylparaben: "Endocrine disruptor, accumulates in breast tissue",
      methylparaben: "Hormone disruptor, linked to breast cancer",

      // Neurotoxic compounds
      "aluminum sulfate": "Neurotoxin linked to Alzheimer's disease",
      "aluminum phosphate": "Neurotoxic compound, accumulates in brain tissue",
      "lead acetate": "Highly toxic heavy metal, causes brain damage",
      "mercury compounds": "Neurotoxic heavy metal, damages nervous system",

      // Inflammatory and allergenic compounds
      carrageenan: "Causes severe intestinal inflammation and digestive issues",
      "polysorbate 80": "Disrupts gut bacteria, increases intestinal permeability",
      "polysorbate 20": "Emulsifier that damages gut lining and immune system",
      "sodium stearoyl lactylate": "Synthetic emulsifier, causes gut inflammation",
      datem: "Diacetyl tartaric acid esters, linked to respiratory issues",

      // Genotoxic and mutagenic compounds
      "potassium bromate": "Banned carcinogen that damages DNA and causes cancer",
      bromate: "Genotoxic compound, causes genetic mutations",
      azodicarbonamide: "Respiratory toxin, banned in many countries",
      "benzoyl peroxide": "Mutagenic bleaching agent, causes DNA damage",

      // Metabolic disruptors
      "propylene glycol alginate": "Synthetic thickener, disrupts metabolism",
      "calcium disodium edta": "Chelating agent that removes essential minerals",
      "disodium edta": "Synthetic preservative, depletes vital minerals",
      "tetrasodium edta": "Industrial chelator, removes calcium and magnesium",

      // Liver and kidney toxins
      "butylated hydroxytoluene": "Liver toxin, accumulates in organs",
      "butylated hydroxyanisole": "Carcinogenic antioxidant, damages liver",
      "tertiary butylhydroquinone": "Industrial preservative, causes liver damage",
      ethoxyquin: "Pesticide preservative, highly toxic to liver",

      // Respiratory and skin toxins
      "sulfur dioxide": "Respiratory irritant, triggers asthma attacks",
      "sodium metabisulfite": "Severe allergic reactions, respiratory distress",
      "potassium metabisulfite": "Causes breathing difficulties and skin reactions",
      "calcium sulfite": "Respiratory irritant, triggers allergic responses",

      // Digestive system toxins
      "titanium dioxide": "Nanoparticles damage intestinal lining, potential carcinogen",
      "silicon dioxide": "Industrial additive, causes digestive inflammation",
      "magnesium stearate": "Synthetic lubricant, impairs nutrient absorption",
      "stearic acid": "Industrial fatty acid, disrupts digestion",

      // Cardiovascular toxins
      "sodium aluminum phosphate": "Linked to heart disease and bone disorders",
      "aluminum sodium sulfate": "Cardiovascular toxin, affects heart rhythm",
      "potassium aluminum sulfate": "Toxic to cardiovascular system",

      // Reproductive toxins
      "diethyl phthalate": "Reproductive toxin, affects fertility",
      "benzyl butyl phthalate": "Developmental toxin, harms reproductive system",
      "di-n-butyl phthalate": "Endocrine disruptor affecting reproduction",
    }

    // Check for dangerous hidden ingredients first
    for (const [key, reason] of Object.entries(dangerousHiddenIngredients)) {
      if (lowerIngredient.includes(key)) {
        return {
          ingredient: originalIngredient,
          status: "bad",
          reason: reason,
        }
      }
    }

    // Common harmful ingredients users might know
    const commonBadIngredients = {
      "high fructose corn syrup": "Highly processed sweetener, linked to obesity and diabetes",
      "monosodium glutamate": "Artificial flavor enhancer, may cause headaches and nausea",
      "sodium nitrite": "Preservative linked to cancer and cardiovascular disease",
      "artificial colors": "Synthetic dyes linked to hyperactivity and behavioral issues",
      "hydrogenated oil": "Trans fats that increase heart disease risk",
      aspartame: "Artificial sweetener linked to neurological issues",
      "sodium benzoate": "Preservative that forms carcinogenic benzene",
    }

    // Check common bad ingredients
    for (const [key, reason] of Object.entries(commonBadIngredients)) {
      if (lowerIngredient.includes(key)) {
        return {
          ingredient: originalIngredient,
          status: "bad",
          reason: reason,
        }
      }
    }

    // Moderate ingredients (processed but common)
    const moderateIngredients = {
      "natural flavors": "Can contain up to 100 different chemicals, often highly processed",
      "caramel color": "May contain carcinogenic 4-methylimidazole depending on type",
      "modified corn starch": "Heavily processed thickener, empty calories",
      "corn syrup": "Highly processed sweetener, spikes blood sugar rapidly",
      "palm oil": "Highly processed oil, environmental concerns, inflammatory",
      "soybean oil": "Heavily processed, high in inflammatory omega-6 fatty acids",
      "canola oil": "Chemically extracted oil, often from GMO crops",
      "citric acid": "Usually synthetic, not from citrus fruits as name suggests",
      "sodium phosphate": "Synthetic preservative, high sodium content",
      "calcium carbonate": "Industrial chalk used as filler",
      lecithin: "Emulsifier, often chemically extracted",
      "xanthan gum": "Fermented sugar, generally safe but highly processed",
      "guar gum": "Natural thickener but can cause digestive issues",
      maltodextrin: "Highly processed carbohydrate, spikes blood sugar",
      dextrose: "Simple sugar that rapidly increases blood glucose",
    }

    // Check moderate ingredients
    for (const [key, reason] of Object.entries(moderateIngredients)) {
      if (lowerIngredient.includes(key)) {
        return {
          ingredient: originalIngredient,
          status: "moderate",
          reason: reason,
        }
      }
    }

    // Good ingredients (natural, beneficial)
    const goodIngredients = {
      organic: "Certified organic, minimal processing and no synthetic pesticides",
      water: "Essential for hydration and bodily functions",
      "sea salt": "Natural mineral source, contains trace minerals",
      "himalayan salt": "Natural pink salt with beneficial minerals",
      "coconut oil": "Natural saturated fat with antimicrobial properties",
      "olive oil": "Rich in healthy monounsaturated fats and antioxidants",
      "avocado oil": "High in healthy fats and vitamin E",
      butter: "Natural dairy fat, source of fat-soluble vitamins",
      eggs: "Complete protein with all essential amino acids",
      milk: "Natural source of calcium, protein, and vitamins",
      honey: "Natural sweetener with antimicrobial properties",
      "maple syrup": "Natural sweetener with minerals and antioxidants",
      "vanilla extract": "Natural flavoring from vanilla beans",
      "lemon juice": "Natural citrus, rich in vitamin C",
      garlic: "Natural antimicrobial and cardiovascular benefits",
      turmeric: "Anti-inflammatory spice with curcumin",
      ginger: "Natural anti-inflammatory and digestive aid",
      cinnamon: "Natural spice that helps regulate blood sugar",
      "black pepper": "Natural spice that enhances nutrient absorption",
      rosemary: "Natural antioxidant herb with preservative properties",
      thyme: "Natural antimicrobial herb",
      oregano: "Natural herb with antioxidant properties",
      basil: "Natural herb rich in antioxidants",
      "apple cider vinegar": "Natural fermented vinegar with probiotics",
      "coconut flour": "Natural gluten-free flour alternative",
      "almond flour": "Natural nut flour, high in protein and healthy fats",
      quinoa: "Complete protein grain with all amino acids",
      "chia seeds": "Natural source of omega-3 fatty acids and fiber",
      "flax seeds": "Rich in omega-3s and lignans",
      "pumpkin seeds": "Natural source of minerals and healthy fats",
      "sunflower seeds": "Natural source of vitamin E and healthy fats",
      cocoa: "Natural antioxidant, rich in flavonoids",
      "green tea": "Natural antioxidant with beneficial polyphenols",
    }

    // Check for good ingredients
    for (const [key, reason] of Object.entries(goodIngredients)) {
      if (lowerIngredient.includes(key)) {
        return {
          ingredient: originalIngredient,
          status: "good",
          reason: reason,
        }
      }
    }

    // Pattern-based analysis for unknown ingredients
    if (lowerIngredient.includes("artificial") || lowerIngredient.includes("synthetic")) {
      return {
        ingredient: originalIngredient,
        status: "bad",
        reason: "Artificial compound, potential health risks from synthetic chemicals",
      }
    }

    if (lowerIngredient.includes("extract") && !lowerIngredient.includes("artificial")) {
      return {
        ingredient: originalIngredient,
        status: "good",
        reason: "Natural extract, concentrated beneficial compounds",
      }
    }

    if (lowerIngredient.includes("vitamin") || lowerIngredient.includes("mineral")) {
      return {
        ingredient: originalIngredient,
        status: "good",
        reason: "Added essential nutrient, beneficial for health",
      }
    }

    if (
      lowerIngredient.includes("acid") &&
      !lowerIngredient.includes("ascorbic") &&
      !lowerIngredient.includes("citric")
    ) {
      return {
        ingredient: originalIngredient,
        status: "moderate",
        reason: "Chemical compound, generally safe but synthetic",
      }
    }

    if (lowerIngredient.includes("sodium") && lowerIngredient.length > 10) {
      return {
        ingredient: originalIngredient,
        status: "moderate",
        reason: "Sodium-based preservative, adds to daily sodium intake",
      }
    }

    // Default for unknown ingredients
    if (lowerIngredient.length > 20 || /[0-9]/.test(lowerIngredient)) {
      return {
        ingredient: originalIngredient,
        status: "moderate",
        reason: "Complex chemical name suggests industrial processing",
      }
    }

    // If we can't classify it, assume it's a basic ingredient
    return {
      ingredient: originalIngredient,
      status: "moderate",
      reason: "Common food ingredient, likely processed",
    }
  }

  // Analyze dietary preferences using GroqAI
  const analyzeDietaryPreferences = useCallback(
    async (ingredientsText: string) => {
      try {
        setIsAnalyzing(true)

        // Prepare the analysis prompt
        const analysisPrompt = `
    Analyze the following food product ingredients and determine dietary compatibility:
    
    Product: ${product?.product_name || "Unknown Product"}
    Brand: ${product?.brands || "Unknown Brand"}
    Ingredients: ${ingredientsText}
    
    Please analyze if this product is suitable for the following dietary preferences and provide a brief reason:
    
    1. Vegetarian (no meat, fish, or poultry)
    2. Vegan (no animal products including dairy, eggs, honey)
    3. Gluten-Free (no wheat, barley, rye, or gluten-containing ingredients)
    4. Dairy-Free (no milk, cheese, butter, or dairy derivatives)
    5. Nut-Free (no tree nuts or peanuts)
    6. Organic (made with organic ingredients)
    
    Respond in JSON format:
    {
      "vegetarian": {"suitable": boolean, "reason": "brief explanation"},
      "vegan": {"suitable": boolean, "reason": "brief explanation"},
      "glutenFree": {"suitable": boolean, "reason": "brief explanation"},
      "dairyFree": {"suitable": boolean, "reason": "brief explanation"},
      "nutFree": {"suitable": boolean, "reason": "brief explanation"},
      "organic": {"suitable": boolean, "reason": "brief explanation"}
    }
    `

        // Simulate GroqAI API call (replace with actual API call when available)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // For now, we'll do intelligent analysis based on ingredients
        const lowerIngredients = ingredientsText.toLowerCase()

        const analysisResults = {
          vegetarian: {
            suitable: !/(meat|beef|pork|chicken|fish|seafood|gelatin|lard|tallow)/i.test(lowerIngredients),
            reason: /(meat|beef|pork|chicken|fish|seafood|gelatin|lard|tallow)/i.test(lowerIngredients)
              ? "Contains animal-derived ingredients"
              : "No meat or fish ingredients detected",
          },
          vegan: {
            suitable:
              !/(meat|beef|pork|chicken|fish|seafood|milk|dairy|cheese|butter|cream|egg|honey|gelatin|whey|casein|lactose)/i.test(
                lowerIngredients,
              ),
            reason:
              /(meat|beef|pork|chicken|fish|seafood|milk|dairy|cheese|butter|cream|egg|honey|gelatin|whey|casein|lactose)/i.test(
                lowerIngredients,
              )
                ? "Contains animal products or derivatives"
                : "No animal products detected",
          },
          glutenFree: {
            suitable: !/(wheat|barley|rye|gluten|malt|flour|bread|pasta)/i.test(lowerIngredients),
            reason: /(wheat|barley|rye|gluten|malt|flour|bread|pasta)/i.test(lowerIngredients)
              ? "Contains gluten or gluten-containing grains"
              : "No gluten-containing ingredients found",
          },
          dairyFree: {
            suitable: !/(milk|dairy|cheese|butter|cream|whey|casein|lactose|yogurt)/i.test(lowerIngredients),
            reason: /(milk|dairy|cheese|butter|cream|whey|casein|lactose|yogurt)/i.test(lowerIngredients)
              ? "Contains dairy or milk derivatives"
              : "No dairy ingredients detected",
          },
          nutFree: {
            suitable: !/(almond|walnut|pecan|cashew|pistachio|hazelnut|peanut|tree nut|nut oil)/i.test(
              lowerIngredients,
            ),
            reason: /(almond|walnut|pecan|cashew|pistachio|hazelnut|peanut|tree nut|nut oil)/i.test(lowerIngredients)
              ? "Contains nuts or nut-derived ingredients"
              : "No nuts or nut products found",
          },
          organic: {
            suitable:
              /organic/i.test(lowerIngredients) ||
              /organic/i.test(product?.product_name || "") ||
              /organic/i.test(product?.brands || ""),
            reason:
              /organic/i.test(lowerIngredients) ||
              /organic/i.test(product?.product_name || "") ||
              /organic/i.test(product?.brands || "")
                ? "Product contains organic ingredients"
                : "No organic certification or ingredients mentioned",
          },
        }

        // Map results to the expected format
        const preferences = [
          {
            name: "Vegetarian",
            icon: "🌱",
            found: analysisResults.vegetarian.suitable,
            reason: analysisResults.vegetarian.reason,
          },
          {
            name: "Vegan",
            icon: "🥬",
            found: analysisResults.vegan.suitable,
            reason: analysisResults.vegan.reason,
          },
          {
            name: "Gluten-Free",
            icon: "🌾",
            found: analysisResults.glutenFree.suitable,
            reason: analysisResults.glutenFree.reason,
          },
          {
            name: "Dairy-Free",
            icon: "🥛",
            found: analysisResults.dairyFree.suitable,
            reason: analysisResults.dairyFree.reason,
          },
          {
            name: "Nut-Free",
            icon: "🥜",
            found: analysisResults.nutFree.suitable,
            reason: analysisResults.nutFree.reason,
          },
          {
            name: "Organic",
            icon: "🌿",
            found: analysisResults.organic.suitable,
            reason: analysisResults.organic.reason,
          },
        ]

        setDietaryPreferences(preferences)
        console.log("Dietary preferences analysis complete:", preferences.length, "preferences analyzed")
      } catch (error) {
        console.error("Error analyzing dietary preferences:", error)
        // Fallback to basic analysis if API fails
        const basicPreferences = [
          { name: "Vegetarian", icon: "🌱", found: false, reason: "Analysis unavailable" },
          { name: "Vegan", icon: "🥬", found: false, reason: "Analysis unavailable" },
          { name: "Gluten-Free", icon: "🌾", found: false, reason: "Analysis unavailable" },
          { name: "Dairy-Free", icon: "🥛", found: false, reason: "Analysis unavailable" },
          { name: "Nut-Free", icon: "🥜", found: false, reason: "Analysis unavailable" },
          { name: "Organic", icon: "🌿", found: false, reason: "Analysis unavailable" },
        ]
        setDietaryPreferences(basicPreferences)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [product],
  )

  // Get nutrition grade color
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

  // Get grade position for rating bar
  const getGradePosition = (grade: string) => {
    const positions = { A: "90%", B: "75%", C: "50%", D: "25%", E: "10%" }
    return positions[grade?.toUpperCase() as keyof typeof positions] || "50%"
  }

  // Calculate adjusted nutrition value
  const getAdjustedValue = (value: number | undefined) => {
    if (value === undefined) return "N/A"
    return (value * servingMultiplier).toFixed(1)
  }

  // Check if nutrient is in danger zone
  const isDangerous = (nutrient: NutrientInfo, value: number | undefined) => {
    if (!nutrient.dangerLimit || value === undefined) return false
    const adjustedValue = value * servingMultiplier
    return adjustedValue > nutrient.dangerLimit
  }

  // Toggle audio player
  const toggleAudioPlayer = () => {
    setShowAudioPlayer(!showAudioPlayer)
  }

  // Toggle speech with better error handling and state management
  const toggleSpeech = useCallback(() => {
    if (!audioTranscript) {
      console.log("No audio transcript available")
      return
    }

    if (isSpeaking) {
      // Stop speech
      try {
        speechSynthesis.cancel()
        setIsSpeaking(false)
        setSpeechProgress(0)
        console.log("Speech cancelled by user")
      } catch (error) {
        console.error("Error cancelling speech:", error)
        setIsSpeaking(false)
        setSpeechProgress(0)
      }
    } else {
      // Start speech with improved error handling
      if ("speechSynthesis" in window) {
        // Ensure clean state
        speechSynthesis.cancel()

        // Wait a bit to ensure cancellation is complete
        setTimeout(() => {
          try {
            const utterance = new SpeechSynthesisUtterance(audioTranscript)
            utterance.rate = 0.8
            utterance.pitch = 1
            utterance.volume = 0.8

            // Get available voices and set a preferred one
            const voices = speechSynthesis.getVoices()
            if (voices.length > 0) {
              // Try to find an English voice, fallback to first available
              const englishVoice = voices.find((voice) => voice.lang.startsWith("en")) || voices[0]
              utterance.voice = englishVoice
              console.log("Using voice:", englishVoice.name)
            }

            let progressInterval: NodeJS.Timeout | null = null
            let hasStarted = false
            let isCompleted = false

            utterance.onstart = () => {
              console.log("Speech started successfully")
              hasStarted = true
              isCompleted = false
              setIsSpeaking(true)
              setSpeechProgress(0)

              // Estimate speech duration and update progress
              const estimatedDuration = audioTranscript.length * 60 // ~60ms per character
              const updateInterval = Math.max(100, estimatedDuration / 100) // Update every 100ms minimum

              progressInterval = setInterval(() => {
                setSpeechProgress((prev) => {
                  if (prev >= 95) {
                    return prev
                  }
                  return prev + 1
                })
              }, updateInterval)
            }

            utterance.onend = () => {
              console.log("Speech completed successfully")
              isCompleted = true
              setIsSpeaking(false)
              setSpeechProgress(100)
              if (progressInterval) {
                clearInterval(progressInterval)
                progressInterval = null
              }
            }

            utterance.onerror = (event) => {
              // Clean up progress interval first
              if (progressInterval) {
                clearInterval(progressInterval)
                progressInterval = null
              }

              // Handle different types of errors
              if (event.error === "interrupted") {
                // This is normal when user stops speech or starts new speech
                console.log("Speech was interrupted - this is normal behavior")
                setIsSpeaking(false)
                setSpeechProgress(0)
                // Don't show any error message for interrupted speech
                return
              }

              // Log other errors but handle them gracefully
              console.warn("Speech synthesis error:", event.error)

              if (event.error === "network") {
                setIsSpeaking(false)
                setSpeechProgress(0)
                alert("Network error occurred during speech synthesis. Please check your connection and try again.")
              } else if (event.error === "synthesis-failed") {
                setIsSpeaking(false)
                setSpeechProgress(0)
                alert("Speech synthesis failed. Please try again or check if your browser supports text-to-speech.")
              } else if (event.error === "language-not-supported") {
                setIsSpeaking(false)
                setSpeechProgress(0)
                alert("Language not supported for speech synthesis.")
              } else if (event.error === "voice-unavailable") {
                setIsSpeaking(false)
                setSpeechProgress(0)
                alert("Selected voice is unavailable. Please try again.")
              } else {
                // For any other errors, reset state but don't show alert if speech had started
                setIsSpeaking(false)
                setSpeechProgress(0)

                if (!hasStarted && !isCompleted) {
                  // Only show error if speech never started
                  alert(`Unable to start speech synthesis. Error: ${event.error}`)
                }
              }
            }

            // Store reference for cleanup
            speechRef.current = utterance

            // Start speaking
            console.log("Starting speech synthesis...")
            speechSynthesis.speak(utterance)

            // Fallback timeout in case onstart never fires
            setTimeout(() => {
              if (!hasStarted && !isCompleted && !isSpeaking) {
                console.log("Speech didn't start within 3 seconds, assuming failure")
                setIsSpeaking(false)
                setSpeechProgress(0)
                if (progressInterval) {
                  clearInterval(progressInterval)
                  progressInterval = null
                }
                alert("Speech synthesis failed to start. Please try again.")
              }
            }, 3000) // Increased to 3 seconds
          } catch (error) {
            console.error("Error creating or starting speech:", error)
            setIsSpeaking(false)
            setSpeechProgress(0)
            alert("Unable to start speech synthesis. Please try again.")
          }
        }, 300) // Increased delay to 300ms for better stability
      } else {
        alert("Text-to-speech is not supported in your browser")
      }
    }
  }, [audioTranscript, isSpeaking])

  // Cleanup speech on unmount and modal close
  useEffect(() => {
    if (!showAudioPlayer && isSpeaking) {
      console.log("Audio player closed, stopping speech")
      try {
        speechSynthesis.cancel()
        setIsSpeaking(false)
        setSpeechProgress(0)
      } catch (error) {
        console.warn("Error stopping speech on modal close:", error)
        setIsSpeaking(false)
        setSpeechProgress(0)
      }
    }

    return () => {
      console.log("Component unmounting, cleaning up speech")
      try {
        speechSynthesis.cancel()
        setIsSpeaking(false)
      } catch (error) {
        console.warn("Error cleaning up speech on unmount:", error)
      }
    }
  }, [showAudioPlayer, isSpeaking])

  // Ensure speech synthesis voices are loaded and handle page visibility
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Load voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices()
        console.log("Available voices loaded:", voices.length)
      }

      // Voices might load asynchronously
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener("voiceschanged", loadVoices)
      } else {
        loadVoices()
      }

      // Handle page visibility changes to prevent speech interruption
      const handleVisibilityChange = () => {
        if (document.hidden && isSpeaking) {
          console.log("Page became hidden while speaking - speech may be interrupted by browser")
          // Don't manually cancel, let browser handle it
        } else if (!document.hidden && speechRef.current && !isSpeaking) {
          console.log("Page became visible again")
        }
      }

      // Handle beforeunload to clean up speech
      const handleBeforeUnload = () => {
        try {
          speechSynthesis.cancel()
        } catch (error) {
          console.warn("Error cancelling speech on page unload:", error)
        }
      }

      document.addEventListener("visibilitychange", handleVisibilityChange)
      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices)
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [isSpeaking])

  if (isInitialLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center">
        {isInitialLoading ? (
          // Enhanced Loading Animation
          <motion.div
            className="text-center max-w-sm mx-auto px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Loading Icon */}
            <motion.div
              className="relative w-32 h-32 mx-auto mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Outer Gradient Ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 p-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 rounded-full" />
              </motion.div>

              {/* Inner Analysis Ring */}
              <motion.div
                className="absolute inset-4 border-4 border-gradient-to-r from-orange-400 to-lime-400 rounded-full border-dashed"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                style={{ borderImage: "linear-gradient(45deg, #f97316, #84cc16) 1" }}
              />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Floating Analysis Dots */}
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

            {/* Loading Text */}
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

              {/* Analysis Steps */}
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

              {/* Progress Indicator */}
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
          // No Product Data State
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

  // Use the enhanced function to get the grade
  const grade = calculateNutritionGrade(product)
  const dangerousNutrients = nutrients.filter((nutrient) => isDangerous(nutrient, product.nutriments?.[nutrient.key]))
  const safeNutrients = nutrients.filter((nutrient) => !isDangerous(nutrient, product.nutriments?.[nutrient.key]))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
      {/* Header */}
      <motion.header
        className="bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 text-white p-6 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">{product.product_name || "Unknown Product"}</h1>
              {product.brands && <p className="text-orange-100 text-sm lg:text-base">{product.brands}</p>}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudioPlayer}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Serving Size Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <Weight className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Serving Size</h2>
              </div>
              <Input
                type="number"
                placeholder="Enter serving size (g/ml)"
                value={servingSize}
                onChange={(e) => handleServingSizeChange(e.target.value)}
                className="mb-2"
                min="1"
              />
              <p className="text-sm text-gray-600">
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
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-lime-500 rounded-full flex items-center justify-center mr-3">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Overall Product Rating</h2>
              </div>

              <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Rating Circle */}
                <div className="relative">
                  <div
                    className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r ${getGradeColor(grade)} flex items-center justify-center shadow-lg`}
                  >
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl lg:text-3xl font-bold text-gray-800">{grade}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Scale */}
                <div className="flex-1 w-full">
                  <p className="text-center lg:text-left font-medium mb-3">Nutritional Quality</p>
                  <div className="relative h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-gray-800 rounded-full transform -translate-y-1 -translate-x-2 shadow-lg transition-all duration-500"
                      style={{ left: getGradePosition(grade) }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
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

        {/* Warning Section */}
        <AnimatePresence>
          {dangerousNutrients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-lg bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-red-800">Warnings</h2>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {dangerousNutrients.map((nutrient) => (
                      <div key={nutrient.key} className="bg-white/70 rounded-lg p-4 border-l-4 border-red-500">
                        <div className="font-medium text-red-800 text-sm mb-1">{nutrient.label}</div>
                        <div className="text-lg font-bold text-red-600 mb-1">
                          {getAdjustedValue(product.nutriments?.[nutrient.key])} {nutrient.unit}
                        </div>
                        <div className="text-xs text-red-600">High content</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nutritional Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Nutritional Facts Analysis</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {safeNutrients.map((nutrient) => (
                  <div key={nutrient.key} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium text-gray-800 text-sm mb-1">{nutrient.label}</div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {getAdjustedValue(product.nutriments?.[nutrient.key])} {nutrient.unit}
                    </div>
                    <div className="text-xs text-gray-600">{servingSize ? "Per serving" : "Per 100g"}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ingredient Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Ingredient Analysis</h2>
              </div>

              {product.ingredients_text && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Ingredients</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{product.ingredients_text}</p>
                </div>
              )}

              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Analyzing ingredients...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {ingredientAnalysis.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-800">{item.ingredient}</span>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "good"
                            ? "bg-green-100 text-green-800"
                            : item.status === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status} - {item.reason}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Dietary Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Dietary Preferences</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {dietaryPreferences.map((pref, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex flex-col p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-3">{pref.icon}</span>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 text-sm">{pref.name}</span>
                      </div>
                      {pref.found ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {pref.reason && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{pref.reason}</p>}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center py-6"
        >
          <p className="text-sm text-gray-600">
            This analysis is for informational purposes only and should not replace professional medical advice.
          </p>
        </motion.div>
      </div>

      {/* Audio Player Modal */}
      <AnimatePresence>
        {showAudioPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50 p-4"
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
                <h3 className="text-lg font-semibold">Audio Summary</h3>
                <Button variant="ghost" size="icon" onClick={toggleAudioPlayer}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Button variant="outline" size="icon" onClick={toggleSpeech} className="rounded-full bg-transparent">
                    {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full transition-all duration-300"
                        style={{ width: `${speechProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{isSpeaking ? "Speaking..." : "Ready"}</span>
                      <span>Text-to-Speech</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-sm">Transcript:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{audioTranscript}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
