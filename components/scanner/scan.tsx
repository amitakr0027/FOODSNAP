
"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, RotateCcw, ArrowRight, ArrowLeft, Check, AlertCircle, Volume2, VolumeX, Scan, Zap, Eye, FileText, X, Info, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Tesseract from "tesseract.js"
import { BrowserMultiFormatReader, NotFoundException, BarcodeFormat, DecodeHintType } from '@zxing/library'

interface ScanStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

interface OCRResult {
  text: string
  confidence?: number
  type: "barcode" | "label" | "nutrition"
  method?: string
}

interface Product {
  product_name?: string
  brands?: string
  nutriments?: Record<string, number>
  ingredients_text?: string
  nutrition_grades_tags?: string[]
  [key: string]: any
}

interface ManualNutritionData {
  calories?: number
  fat?: number
  saturatedFat?: number
  carbs?: number
  sugars?: number
  fiber?: number
  protein?: number
  sodium?: number
  ingredients?: string
}

interface LabelStructureData {
  productName: string | null
  brand: string | null
  ingredients: string | null
  confidence: "high" | "medium" | "low"
}

// OpenFoodFacts resolver function
async function fetchFromOFF(barcode: string) {
  const endpoints = [
    "https://world.openfoodfacts.org/api/v0/product/",
    "https://in.openfoodfacts.org/api/v0/product/",
  ]

  for (const base of endpoints) {
    try {
      const res = await fetch(`${base}${barcode}.json`)
      const data = await res.json()

      if (data.status === 1) {
        return {
          product: data.product,
          source: base.includes("in.") ? "IN" : "GLOBAL",
        }
      }
    } catch {
      continue
    }
  }

  return null
}

export default function ScanComponent() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [scanAnimation, setScanAnimation] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualData, setManualData] = useState<ManualNutritionData>({})
  const [productName, setProductName] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info")

  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  const scanSteps: ScanStep[] = [
    {
      id: 0,
      title: "Scan Barcode",
      description: "Point your camera at the product barcode for instant product lookup",
      icon: <Scan className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "from-orange-500 to-red-500",
    },
    {
      id: 1,
      title: "Scan Label",
      description: "Capture the product label to extract ingredient information",
      icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 2,
      title: "Manual Entry",
      description: "Enter nutritional information manually if scanning fails",
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "from-lime-500 to-green-500",
    },
  ]

  // Initialize ZXing code reader with optimized settings
  useEffect(() => {
    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_93,
    ])
    hints.set(DecodeHintType.TRY_HARDER, true)
    
    codeReaderRef.current = new BrowserMultiFormatReader(hints)
    
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
      }
    }
  }, [])

  // Voice guidance
  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled || !("speechSynthesis" in window)) return

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    },
    [voiceEnabled],
  )

  // Vibration feedback
  const vibrate = useCallback((pattern: number | number[] = 100) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  // Show status message
  const showStatusMessage = useCallback((message: string, type: "info" | "error" | "success" = "info") => {
    setStatusMessage(message)
    setMessageType(type)
    setTimeout(() => setStatusMessage(null), 5000)
  }, [])

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasCamera(true)
        setIsScanning(true)

        speak(`Camera ready. ${scanSteps[currentStep].description}`)
      }
    } catch (error) {
      console.error("Camera access failed:", error)
      setHasCamera(false)
      speak("Camera access failed. Please use the upload option.")
      showStatusMessage("Camera access denied. Please upload an image instead.", "error")
    }
  }, [currentStep, speak, showStatusMessage, scanSteps])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
    }
    setIsScanning(false)
  }, [])

  // Capture image from video
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL("image/jpeg", 0.95)
  }, [])

  // Redirect to analysis page with product data
  const redirectToAnalysis = useCallback((productData: Product) => {
    setIsRedirecting(true)

    const productWithScanInfo = {
      ...productData,
      _scanMethod: currentStep === 0 ? "barcode" : currentStep === 1 ? "label" : "manual",
      _scannedAt: new Date().toISOString(),
    }

    localStorage.setItem("selectedProduct", JSON.stringify(productWithScanInfo))
    localStorage.setItem("isRedirecting", "true")
    speak("Redirecting to analysis.")

    router.push("/analysis")
  }, [currentStep, router, speak])

  // Create product from manual data
  const createManualProduct = (): Product => {
    return {
      product_name: productName || "Manual Entry Product",
      brands: brandName || "Unknown Brand",
      nutriments: {
        "energy-kcal_100g": manualData.calories || 0,
        fat_100g: manualData.fat || 0,
        "saturated-fat_100g": manualData.saturatedFat || 0,
        carbohydrates_100g: manualData.carbs || 0,
        sugars_100g: manualData.sugars || 0,
        fiber_100g: manualData.fiber || 0,
        proteins_100g: manualData.protein || 0,
        sodium_100g: (manualData.sodium || 0) / 1000,
      },
      ingredients_text: manualData.ingredients || "Ingredients not specified",
      nutrition_grades_tags: ["c"],
      _manual_entry: true,
    }
  }

  // Enhanced image preprocessing with multiple techniques
  const preprocessImage = async (imageData: string, technique: 'contrast' | 'grayscale' | 'sharpen' | 'binary'): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(imageData)
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageDataObj.data

        if (technique === 'contrast') {
          // High contrast enhancement
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
            const contrast = 2.0
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
            const enhanced = factor * (gray - 128) + 128
            data[i] = data[i + 1] = data[i + 2] = enhanced
          }
        } else if (technique === 'grayscale') {
          // Simple grayscale
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
            data[i] = data[i + 1] = data[i + 2] = gray
          }
        } else if (technique === 'sharpen') {
          // Sharpening filter
          const tempData = new Uint8ClampedArray(data)
          for (let i = 0; i < data.length; i += 4) {
            if (i > canvas.width * 4 && i < data.length - canvas.width * 4) {
              const gray = tempData[i] * 0.299 + tempData[i + 1] * 0.587 + tempData[i + 2] * 0.114
              const sharpened = gray * 9 - (tempData[i - 4] + tempData[i + 4] + tempData[i - canvas.width * 4] + tempData[i + canvas.width * 4]) * 2
              data[i] = data[i + 1] = data[i + 2] = Math.min(255, Math.max(0, sharpened))
            }
          }
        } else if (technique === 'binary') {
          // Binary thresholding
          const threshold = 128
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
            const binary = gray > threshold ? 255 : 0
            data[i] = data[i + 1] = data[i + 2] = binary
          }
        }

        ctx.putImageData(imageDataObj, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.95))
      }
      img.src = imageData
    })
  }

  // Multi-method barcode extraction with all available techniques
  const extractBarcodeFromImage = async (imageData: string): Promise<OCRResult> => {
    try {
      console.log("🔍 Starting comprehensive barcode detection...")
      
      // Method 1: ZXing on original image
      try {
        console.log("📷 Method 1: ZXing on original image...")
        if (!codeReaderRef.current) {
          const hints = new Map()
          hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, 
            BarcodeFormat.UPC_E, BarcodeFormat.CODE_128, BarcodeFormat.CODE_39,
          ])
          hints.set(DecodeHintType.TRY_HARDER, true)
          codeReaderRef.current = new BrowserMultiFormatReader(hints)
        }

        const img = new Image()
        img.src = imageData
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })

        const result = await codeReaderRef.current.decodeFromImageElement(img)
        if (result && result.getText()) {
          console.log("✅ ZXing (original) detected:", result.getText())
          return { text: result.getText(), confidence: 0.95, type: "barcode", method: "ZXing-Original" }
        }
      } catch (error) {
        console.log("❌ ZXing (original) failed:", error instanceof NotFoundException ? "Not found" : error)
      }

      // Method 2: ZXing on contrast-enhanced image
      try {
        console.log("📷 Method 2: ZXing on contrast-enhanced image...")
        const contrastImage = await preprocessImage(imageData, 'contrast')
        const img2 = new Image()
        img2.src = contrastImage
        await new Promise((resolve, reject) => {
          img2.onload = resolve
          img2.onerror = reject
        })

        if (codeReaderRef.current) {
          const result2 = await codeReaderRef.current.decodeFromImageElement(img2)
          if (result2 && result2.getText()) {
            console.log("✅ ZXing (contrast) detected:", result2.getText())
            return { text: result2.getText(), confidence: 0.92, type: "barcode", method: "ZXing-Contrast" }
          }
        }
      } catch (error) {
        console.log("❌ ZXing (contrast) failed")
      }

      // Method 3: ZXing on grayscale image
      try {
        console.log("📷 Method 3: ZXing on grayscale image...")
        const grayImage = await preprocessImage(imageData, 'grayscale')
        const img3 = new Image()
        img3.src = grayImage
        await new Promise((resolve, reject) => {
          img3.onload = resolve
          img3.onerror = reject
        })

        if (codeReaderRef.current) {
          const result3 = await codeReaderRef.current.decodeFromImageElement(img3)
          if (result3 && result3.getText()) {
            console.log("✅ ZXing (grayscale) detected:", result3.getText())
            return { text: result3.getText(), confidence: 0.90, type: "barcode", method: "ZXing-Grayscale" }
          }
        }
      } catch (error) {
        console.log("❌ ZXing (grayscale) failed")
      }

      // Method 4: Tesseract OCR on binary thresholded image (optimized for barcodes)
      try {
        console.log("📷 Method 4: Tesseract on binary image...")
        const binaryImage = await preprocessImage(imageData, 'binary')
        const response = await fetch(binaryImage)
        const blob = await response.blob()

        const { data } = await Tesseract.recognize(blob, "eng", {
          logger: (m) => console.log("Tesseract:", m.status),
          tessedit_char_whitelist: '0123456789',
        })

        const digitsOnly = data.text.replace(/\D/g, '')
        console.log("Tesseract found digits:", digitsOnly)
        
        // Look for valid barcode patterns
        const patterns = [
          digitsOnly.match(/\d{13}/),  // EAN-13
          digitsOnly.match(/\d{12}/),  // UPC-A
          digitsOnly.match(/\d{8}/),   // EAN-8
        ]

        for (const match of patterns) {
          if (match) {
            console.log("✅ Tesseract detected barcode:", match[0])
            return { text: match[0], confidence: 0.75, type: "barcode", method: "Tesseract-Binary" }
          }
        }
      } catch (error) {
        console.error("❌ Tesseract failed:", error)
      }

      // Method 5: Groq AI Vision (if API key available)
      if (process.env.NEXT_PUBLIC_GROQ_API_KEY) {
        try {
          console.log("📷 Method 5: Groq AI Vision...")
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: "llama-3.2-90b-vision-preview",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "Find the barcode number in this image. Return ONLY the digits (8-13 digits) or 'NO_BARCODE' if not found.",
                    },
                    { type: "image_url", image_url: { url: imageData } },
                  ],
                },
              ],
              temperature: 0,
              max_tokens: 50,
            }),
          })

          const data = await response.json()
          const extractedText = data?.choices?.[0]?.message?.content?.trim() || "NO_BARCODE"
          
          if (extractedText !== "NO_BARCODE") {
            const barcodeMatch = extractedText.match(/\d{8,13}/)
            if (barcodeMatch) {
              console.log("✅ Groq AI detected barcode:", barcodeMatch[0])
              return { text: barcodeMatch[0], confidence: 0.85, type: "barcode", method: "Groq-AI" }
            }
          }
        } catch (error) {
          console.log("❌ Groq AI failed:", error)
        }
      }

      console.log("❌ All barcode detection methods failed")
      return { text: "NO_BARCODE", confidence: 0, type: "barcode", method: "None" }
    } catch (error) {
      console.error("Barcode extraction error:", error)
      return { text: "NO_BARCODE", confidence: 0, type: "barcode", method: "Error" }
    }
  }

  // Enhanced label extraction with Tesseract
  const extractLabelFromImage = async (imageData: string): Promise<OCRResult> => {
    try {
      console.log("📝 Extracting label with Tesseract...")
      const response = await fetch(imageData)
      const blob = await response.blob()

      const { data } = await Tesseract.recognize(blob, "eng", {
        logger: (m) => console.log("Tesseract:", m.status),
      })

      console.log("✅ Label extracted, confidence:", data.confidence)
      return {
        text: data.text,
        confidence: data.confidence / 100,
        type: "label",
        method: "Tesseract"
      }
    } catch (error) {
      console.error("Label extraction failed:", error)
      return {
        text: "Extraction failed",
        confidence: 0,
        type: "label",
        method: "Error"
      }
    }
  }

  // Structure label data using Gemini API
  const structureLabelData = async (rawText: string): Promise<LabelStructureData | null> => {
    try {
      const res = await fetch("/api/gemini/structure-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      })

      const result = await res.json()

      if (result.success) {
        return result.data
      }

      return null
    } catch (error) {
      console.error("Label structuring failed:", error)
      return null
    }
  }

  // Auto-process image when captured or uploaded
  const autoProcessImage = useCallback(
    async (imageData: string) => {
      setIsProcessing(true)
      setScanAnimation(true)
      vibrate([100, 50, 100])

      try {
        if (currentStep === 0) {
          // BARCODE SCAN
          speak("Detecting barcode with multiple methods...")
          showStatusMessage("Scanning barcode with advanced detection...", "info")

          const result = await extractBarcodeFromImage(imageData)
          setOcrResult(result)

          if (result.text !== "NO_BARCODE" && result.confidence && result.confidence > 0.5) {
            vibrate([200, 100, 200])
            speak("Barcode detected. Looking up product...")
            showStatusMessage(`Barcode ${result.text} found using ${result.method}! Looking up...`, "success")

            const productData = await fetchFromOFF(result.text)

            if (productData) {
              speak("Product found. Redirecting to analysis.")
              showStatusMessage(`Product found from ${productData.source}! Loading analysis...`, "success")
              redirectToAnalysis(productData.product)
              return
            } else {
              speak("Product not found in database. Try label scan or manual entry.")
              showStatusMessage(`Barcode ${result.text} not in database. Try label scan or manual entry.`, "error")
              vibrate([300, 100, 300])
            }
          } else {
            speak("No barcode detected. Please try again, reposition, or use label scan.")
            showStatusMessage("No barcode found. Try repositioning the image or use label scan.", "error")
            vibrate([300, 100, 300])
          }
        } else if (currentStep === 1) {
          // LABEL SCAN
          speak("Extracting label information...")
          showStatusMessage("Scanning label...", "info")

          const result = await extractLabelFromImage(imageData)
          setOcrResult(result)

          if (result.confidence && result.confidence < 0.6) {
            speak("Label unclear. Please try manual entry.")
            showStatusMessage("Unable to read label clearly. Please use manual entry.", "error")
            vibrate([300, 100, 300])
            setCurrentStep(2)
            setShowManualEntry(true)
            return
          }

          vibrate([200, 100, 200])
          speak("Label extracted. Structuring information...")
          showStatusMessage("Label scanned! Extracting information...", "success")

          const structured = await structureLabelData(result.text)

          if (structured && structured.productName) {
            setProductName(structured.productName)
            setBrandName(structured.brand || "")
            if (structured.ingredients) {
              setManualData((prev) => ({ ...prev, ingredients: structured.ingredients || "" }))
            }

            speak("Label information extracted. Please review and add nutritional details.")
            showStatusMessage("Label information extracted! Please complete nutritional details.", "success")
            vibrate([100, 50, 100, 50, 100])
            setCurrentStep(2)
            setShowManualEntry(true)
          } else {
            speak("Unable to extract clear information. Please try manual entry.")
            showStatusMessage("Unable to extract label information. Please use manual entry.", "error")
            vibrate([300, 100, 300])
            setCurrentStep(2)
            setShowManualEntry(true)
          }
        } else {
          // MANUAL ENTRY
          speak("Please enter product information manually.")
          showStatusMessage("Please enter product details manually.", "info")
          setShowManualEntry(true)
        }
      } catch (error) {
        console.error("Scan processing failed:", error)
        speak("Scan failed. Please try again.")
        showStatusMessage("Processing failed. Please try again.", "error")
        vibrate([300, 100, 300])
      } finally {
        setIsProcessing(false)
        setScanAnimation(false)
      }
    },
    [currentStep, vibrate, speak, showStatusMessage, redirectToAnalysis],
  )

  // Process scan - captures image and auto-processes
  const processScan = useCallback(async () => {
    if (!isScanning && !capturedImage) {
      await initCamera()
      return
    }

    if (capturedImage) {
      await autoProcessImage(capturedImage)
    } else {
      const captured = captureImage()
      if (!captured) {
        showStatusMessage("Failed to capture image. Please try again.", "error")
        return
      }
      setCapturedImage(captured)
      stopCamera()
      await autoProcessImage(captured)
    }
  }, [isScanning, capturedImage, initCamera, captureImage, stopCamera, autoProcessImage, showStatusMessage])

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith("image/")) {
        speak("Please select an image file.")
        showStatusMessage("Please select a valid image file.", "error")
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setCapturedImage(result)
        stopCamera()
        vibrate(100)
        speak("Image uploaded successfully. Processing...")
        showStatusMessage("Image uploaded successfully! Processing...", "success")
        await autoProcessImage(result)
      }
      reader.readAsDataURL(file)
    },
    [stopCamera, vibrate, speak, showStatusMessage, autoProcessImage],
  )

  // Reset scan
  const resetScan = useCallback(() => {
    setCapturedImage(null)
    setOcrResult(null)
    setStatusMessage(null)
    vibrate(50)
    speak("Resetting scan.")
  }, [vibrate, speak])

  // Next step
  const nextStep = useCallback(() => {
    if (currentStep < scanSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      resetScan()
      vibrate([100, 50, 100])
      speak(`Moving to step ${currentStep + 2}: ${scanSteps[currentStep + 1].title}`)
    } else {
      setShowManualEntry(true)
      speak("Please enter the product information manually.")
    }
  }, [currentStep, scanSteps, resetScan, vibrate, speak])

  // Handle manual data submission
  const handleManualSubmit = () => {
    if (!productName.trim()) {
      alert("Please enter a product name")
      return
    }

    const manualProduct = createManualProduct()
    redirectToAnalysis(manualProduct)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
      {/* Sticky Header */}
      <motion.header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg">
              <Scan className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold foodsnap-text-gradient">FoodSnap Scanner</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Enhanced Redirecting Animation */}
        <AnimatePresence>
          {isRedirecting && (
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

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <BarChart3 className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/60 transform -translate-y-1/2" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/60 transform -translate-x-1/2" />
                  </motion.div>

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
                    Analyzing Product
                  </motion.h3>
                  <motion.p
                    className="text-lg text-white/90 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Preparing nutritional insights...
                  </motion.p>

                  <div className="w-48 h-1 bg-white/20 rounded-full mx-auto mb-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </div>

                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Message */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg border-l-4 ${
                messageType === "success"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 text-green-800"
                  : messageType === "error"
                    ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-500 text-red-800"
                    : "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-500 text-orange-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium leading-relaxed">{statusMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Entry Modal */}
        <AnimatePresence>
          {showManualEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                  <h3 className="text-base sm:text-lg font-semibold">Manual Entry</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowManualEntry(false)} className="h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter product name"
                      required
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                    <Input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Enter brand name"
                      className="text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Calories (per 100g)</label>
                      <Input
                        type="number"
                        value={manualData.calories || ""}
                        onChange={(e) => setManualData({ ...manualData, calories: Number(e.target.value) })}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Fat (g)</label>
                      <Input
                        type="number"
                        value={manualData.fat || ""}
                        onChange={(e) => setManualData({ ...manualData, fat: Number(e.target.value) })}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Carbs (g)</label>
                      <Input
                        type="number"
                        value={manualData.carbs || ""}
                        onChange={(e) => setManualData({ ...manualData, carbs: Number(e.target.value) })}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Protein (g)</label>
                      <Input
                        type="number"
                        value={manualData.protein || ""}
                        onChange={(e) => setManualData({ ...manualData, protein: Number(e.target.value) })}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Sugars (g)</label>
                      <Input
                        type="number"
                        value={manualData.sugars || ""}
                        onChange={(e) => setManualData({ ...manualData, sugars: Number(e.target.value) })}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Sodium (mg)</label>
                      <Input
                        type="number"
                        value={manualData.sodium || ""}
                        onChange={(e) => setManualData({ ...manualData, sodium: Number(e.target.value) })}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
                      rows={3}
                      value={manualData.ingredients || ""}
                      onChange={(e) => setManualData({ ...manualData, ingredients: e.target.value })}
                      placeholder="List ingredients separated by commas"
                    />
                  </div>

                  <Button
                    onClick={handleManualSubmit}
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    Analyze Product
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Indicator */}
        <motion.div
          className="flex justify-between items-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {scanSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              {index < scanSteps.length - 1 && (
                <div
                  className={`absolute top-4 sm:top-6 left-6 sm:left-8 w-12 sm:w-16 h-0.5 transition-colors duration-500 ${
                    currentStep > index ? "bg-gradient-to-r from-orange-500 to-lime-500" : "bg-gray-300"
                  }`}
                />
              )}

              <motion.div
                className={`relative w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 cursor-pointer ${
                  currentStep >= index ? `bg-gradient-to-r ${step.color} text-white` : "bg-gray-200 text-gray-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setShowTooltip(index)}
                onHoverEnd={() => setShowTooltip(null)}
                onClick={() => {
                  setCurrentStep(index)
                  resetScan()
                  speak(`Switched to ${step.title}`)
                }}
              >
                {currentStep > index ? <Check className="w-4 h-4 sm:w-6 sm:h-6" /> : step.icon}

                <AnimatePresence>
                  {showTooltip === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute -top-12 sm:-top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-lg whitespace-nowrap z-10 max-w-48"
                    >
                      {step.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <span
                className={`text-xs mt-1 sm:mt-2 font-medium transition-colors duration-300 text-center ${
                  currentStep >= index ? "text-orange-600" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Current Step Info */}
        <motion.div
          className="text-center mb-4 sm:mb-6"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{scanSteps[currentStep].title}</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            {scanSteps[currentStep].description}
          </p>
        </motion.div>

        {/* Enhanced Scan Container */}
        <Card className="mb-4 sm:mb-6 overflow-hidden shadow-2xl bg-white border-0 rounded-3xl">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover rounded-3xl transition-opacity duration-500 ${
                    isScanning && !capturedImage ? "opacity-100" : "opacity-0"
                  }`}
                />

                {capturedImage && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black rounded-3xl overflow-hidden"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured scan"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </motion.div>
                )}

                {!isScanning && !capturedImage && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center">
                      <Camera className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 mx-auto text-gray-500" />
                      <p className="text-sm sm:text-base font-medium text-gray-600 mb-2">Ready to Scan</p>
                      <p className="text-xs sm:text-sm text-gray-500 px-4">Tap camera button or upload image</p>
                    </div>
                  </motion.div>
                )}

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 sm:inset-6">
                    <div className="absolute -top-1 -left-1 w-6 h-6 sm:w-8 sm:h-8">
                      <div className="w-full h-full border-t-4 border-l-4 border-orange-500 rounded-tl-2xl shadow-lg shadow-orange-500/50" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8">
                      <div className="w-full h-full border-t-4 border-r-4 border-orange-500 rounded-tr-2xl shadow-lg shadow-orange-500/50" />
                    </div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 sm:w-8 sm:h-8">
                      <div className="w-full h-full border-b-4 border-l-4 border-orange-500 rounded-bl-2xl shadow-lg shadow-orange-500/50" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8">
                      <div className="w-full h-full border-b-4 border-r-4 border-orange-500 rounded-br-2xl shadow-lg shadow-orange-500/50" />
                    </div>

                    <AnimatePresence>
                      {(isScanning || scanAnimation) && (
                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-lg shadow-orange-500/50"
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-3xl"
                      >
                        <div className="text-center text-white">
                          <motion.div
                            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/20 border-t-orange-500 rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          <p className="text-sm sm:text-base font-semibold mb-1">Processing Scan</p>
                          <p className="text-xs sm:text-sm text-white/80">Analyzing with advanced detection...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="absolute top-4 left-4 right-4">
                  <div className="flex justify-center">
                    <div className="bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/20">
                      {isScanning ? "Camera Active" : capturedImage ? "Image Ready" : "Camera Inactive"}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-center">
                    <div className="bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-4 py-2 rounded-full border border-white/20 inline-block">
                      {isScanning
                        ? "Position item in frame and capture"
                        : capturedImage
                          ? "Image captured successfully"
                          : "Start camera or upload image to begin"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Option */}
        <motion.div className="text-center mb-4 sm:mb-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white/50 backdrop-blur-sm text-orange-600 hover:bg-orange-50 transition-all duration-300 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image Instead
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-2 sm:gap-4"
        >
          <Button
            onClick={resetScan}
            variant="outline"
            className="h-10 sm:h-12 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm bg-transparent"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Reset
          </Button>

          <Button
            onClick={processScan}
            disabled={isProcessing}
            className="h-10 sm:h-12 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
          >
            <motion.div className="flex items-center justify-center" whileTap={{ scale: 0.95 }}>
              {isProcessing ? (
                <>
                  <motion.div
                    className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full mr-1 sm:mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <span className="hidden sm:inline">Processing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {isScanning ? "Capture" : "Camera"}
                </>
              )}
            </motion.div>
          </Button>

          <Button
            onClick={nextStep}
            variant="outline"
            className="h-10 sm:h-12 border-2 border-lime-300 text-lime-600 hover:bg-lime-50 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm bg-transparent"
          >
            {currentStep === scanSteps.length - 1 ? (
              <>
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Manual
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-2" />
              </>
            )}
          </Button>
        </motion.div>

        {/* OCR Results */}
        <AnimatePresence>
          {ocrResult && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mt-4 sm:mt-6 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-green-800">
                      {ocrResult.type === "barcode"
                        ? "Barcode Detected"
                        : ocrResult.type === "label"
                          ? "Label Information"
                          : "Nutritional Information"}
                    </h3>
                  </div>

                  <div className="bg-white/70 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <pre className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                      {ocrResult.text}
                    </pre>
                  </div>

                  <div className="mt-4 space-y-2">
                    {ocrResult.confidence !== undefined && (
                      <div className="flex items-center text-xs sm:text-sm text-green-600">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Confidence: {Math.round(ocrResult.confidence * 100)}%
                      </div>
                    )}
                    {ocrResult.method && (
                      <div className="flex items-center text-xs sm:text-sm text-green-600">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Method: {ocrResult.method}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Canvas for Image Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}