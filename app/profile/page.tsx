"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  ArrowLeft,
  Edit3,
  Camera,
  Heart,
  Activity,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Globe,
  MessageCircle,
  Settings,
  Save,
  X,
  Upload,
  Zap,
  Scale,
  Ruler,
  Award,
  Trophy,
  Download,
  Cloud,
  Bell,
  BellOff,
  Shield,
  Eye,
  Mic,
  Clock,
  BarChart3,
  Bookmark,
  History,
  HelpCircle,
  FileText,
  Share2,
  CheckCircle,
  ChevronRight,
  Plus,
  Minus,
  Users,
  Flame,
  TargetIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useProfile } from "@/hooks/use-profile"

export default function ProfilePage() {
  const { profile, loading, updateProfile, calculateDailyNeeds, isProfileComplete } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<any>({})
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [showSupportChat, setShowSupportChat] = useState(false)
  const [showDataExport, setShowDataExport] = useState(false)
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "support", time: "Just now" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [currentHealthTip, setCurrentHealthTip] = useState("")
  const [showHealthTip, setShowHealthTip] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const healthTips = [
    "Based on your profile, try to increase your fiber intake to reach your daily goal.",
    "You're doing great with protein! Consider adding more plant-based sources for variety.",
    "Your sodium intake is on track. Keep choosing fresh foods over processed ones.",
    "Hydration tip: Aim for 8 glasses of water daily to support your active lifestyle.",
    "Your BMI is in the healthy range. Maintain your current eating patterns!",
  ]

  const quickActions = [
    {
      title: "Scan History",
      description: "View all your scanned products",
      icon: History,
      href: "/history",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Favorites",
      description: "Your saved healthy products",
      icon: Bookmark,
      href: "/favorites",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Nutrition Tips",
      description: "Personalized health advice",
      icon: Zap,
      href: "/tips",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Help Center",
      description: "Get support and answers",
      icon: HelpCircle,
      href: "/help",
      color: "from-purple-500 to-purple-600",
    },
  ]

  const translations = {
    en: {
      profile: "Profile",
      backToHome: "Back to Home",
      edit: "Edit",
      cancel: "Cancel",
      save: "Save Changes",
      achievements: "Achievements",
      quickActions: "Quick Actions",
      healthSnapshot: "Today's Health Snapshot",
      personalDetails: "Personal Details",
      healthGoals: "Health Goals",
      dietaryPreferences: "Dietary Preferences",
      appPreferences: "App Preferences",
      privacyData: "Privacy & Data",
      getSupport: "Get Support",
      helpCenter: "Help Center",
    },
    hi: {
      profile: "प्रोफ़ाइल",
      backToHome: "होम पर वापस",
      edit: "संपादित करें",
      cancel: "रद्द करें",
      save: "परिवर्तन सहेजें",
      achievements: "उपलब्धियां",
      quickActions: "त्वरित कार्य",
      healthSnapshot: "आज का स्वास्थ्य स्नैपशॉट",
      personalDetails: "व्यक्तिगत विवरण",
      healthGoals: "स्वास्थ्य लक्ष्य",
      dietaryPreferences: "आहार प्राथमिकताएं",
      appPreferences: "ऐप प्राथमिकताएं",
      privacyData: "गोपनीयता और डेटा",
      getSupport: "सहायता प्राप्त करें",
      helpCenter: "सहायता केंद्र",
    },
  }

  const t = translations[currentLanguage as keyof typeof translations] || translations.en

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile)
      setCurrentLanguage(profile.accessibility?.language || "en")

      // Apply saved dark mode
      if (profile.accessibility?.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // Show personalized health tip
      if (profile.dailyNeeds && profile.dailyProgress) {
        const fiberProgress = (profile.dailyProgress.fiber / profile.dailyNeeds.fiber) * 100
        const proteinProgress = (profile.dailyProgress.protein / profile.dailyNeeds.protein) * 100
        const sodiumProgress = (profile.dailyProgress.sodium / profile.dailyNeeds.sodium) * 100

        let tip = healthTips[0] // default
        if (fiberProgress < 50) {
          tip = `Based on your profile, try to increase your fiber intake to reach your daily goal of ${profile.dailyNeeds.fiber}g.`
        } else if (proteinProgress > 80) {
          tip = "You're doing great with protein! Consider adding more plant-based sources for variety."
        } else if (sodiumProgress < 80) {
          tip = "Your sodium intake is on track. Keep choosing fresh foods over processed ones."
        } else if (profile.healthGoals?.waterIntake) {
          tip = `Hydration tip: Aim for ${profile.healthGoals.waterIntake} glasses of water daily to support your active lifestyle.`
        }

        setCurrentHealthTip(tip)
        setShowHealthTip(true)

        // Hide health tip after 5 seconds
        const tipTimer = setTimeout(() => setShowHealthTip(false), 5000)
        return () => clearTimeout(tipTimer)
      }
    }
  }, [profile])

  // Apply dark mode changes immediately
  useEffect(() => {
    if (profile?.accessibility?.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [profile?.accessibility?.darkMode])

  const handleSaveProfile = () => {
    updateProfile(editedProfile)
    setIsEditing(false)

    // Recalculate daily needs if physical stats changed
    if (
      editedProfile.age !== profile?.age ||
      editedProfile.weight !== profile?.weight ||
      editedProfile.height !== profile?.height ||
      editedProfile.gender !== profile?.gender ||
      editedProfile.activityLevel !== profile?.activityLevel
    ) {
      calculateDailyNeeds()
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile || {})
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      const updatedProfile = {
        ...editedProfile,
        [parent]: {
          ...(editedProfile[parent] || {}),
          [child]: value,
        },
      }
      setEditedProfile(updatedProfile)

      // Apply changes immediately for certain fields
      if (field === "accessibility.darkMode") {
        updateProfile(updatedProfile)
      }
    } else {
      const updatedProfile = { ...editedProfile, [field]: value }
      setEditedProfile(updatedProfile)
    }
  }

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang)
    handleInputChange("accessibility.language", lang)
    updateProfile({
      accessibility: {
        ...profile?.accessibility,
        language: lang,
      },
    })
  }

  const handleDietaryPreferenceChange = (preference: string, checked: boolean) => {
    const currentPreferences = editedProfile.dietaryPreferences || []
    const updatedPreferences = checked
      ? [...currentPreferences, preference]
      : currentPreferences.filter((p: string) => p !== preference)

    setEditedProfile({
      ...editedProfile,
      dietaryPreferences: updatedPreferences,
    })
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const updatedProfile = { ...editedProfile, photoURL: result }
        setEditedProfile(updatedProfile)
        updateProfile(updatedProfile)
        setShowPhotoUpload(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: chatMessages.length + 1,
        text: newMessage,
        sender: "user",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setChatMessages((prev) => [...prev, userMessage])
      setNewMessage("")

      // Simulate support response
      setTimeout(() => {
        const supportMessage = {
          id: chatMessages.length + 2,
          text: "Thank you for your message! Our team will get back to you shortly.",
          sender: "support",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setChatMessages((prev) => [...prev, supportMessage])
      }, 1000)
    }
  }

  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return "0.0"
    const heightInM = Number.parseInt(profile.height) / 100
    const weight = Number.parseInt(profile.weight)
    return (weight / (heightInM * heightInM)).toFixed(1)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { text: "Normal", color: "text-green-600" }
    if (bmi < 30) return { text: "Overweight", color: "text-yellow-600" }
    return { text: "Obese", color: "text-red-600" }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const handleDataExport = async () => {
    const exportData = {
      profile: profile,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodsnap-profile-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowDataExport(false)
  }

  const handleVoiceAssistant = () => {
    setShowVoiceAssistant(true)
    setTimeout(() => {
      setShowVoiceAssistant(false)
    }, 3000)
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Profile</h2>
          <p className="text-gray-600">Please wait while we fetch your profile data...</p>
        </div>
      </div>
    )
  }

  const bmi = Number.parseFloat(calculateBMI())
  const bmiCategory = getBMICategory(bmi)

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        profile.accessibility?.darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/home"
            className={`flex items-center transition-colors ${
              profile.accessibility?.darkMode
                ? "text-gray-300 hover:text-orange-400"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-2xl font-bold">{t.profile}</h1>

          <div className="flex items-center space-x-2">
            {/* Voice Assistant Button */}
            <Button
              onClick={handleVoiceAssistant}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-orange-100 dark:hover:bg-gray-700"
            >
              <Mic className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "destructive" : "default"}
              className={
                isEditing ? "" : "bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600"
              }
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  {t.edit}
                </>
              )}
            </Button>
          </div>
        </motion.header>

        {/* AI Health Tip */}
        <AnimatePresence>
          {showHealthTip && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl shadow-lg border-l-4 border-green-500 ${
                profile.accessibility?.darkMode ? "bg-gray-800" : "bg-green-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-green-600 dark:text-green-400">AI Health Tip</h4>
                  <p className="text-sm mt-1">{currentHealthTip}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHealthTip(false)}
                  className="text-green-500 hover:text-green-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={
                        isEditing
                          ? editedProfile.photoURL || "/placeholder.svg?height=96&width=96"
                          : profile.photoURL || "/placeholder.svg?height=96&width=96"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={() => setShowPhotoUpload(true)}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editedProfile.fullName || ""}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="text-center font-semibold"
                        placeholder="Full Name"
                      />
                      <Input
                        type="email"
                        value={editedProfile.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="text-center text-sm"
                        placeholder="Email"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold mb-1">{profile.fullName || "Complete your profile"}</h2>
                      <p className={`text-sm ${profile.accessibility?.darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {profile.email || "No email provided"}
                      </p>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">Level {profile.stats?.level || 1}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">{profile.stats?.totalPoints || 0} points</span>
                      </div>
                    </>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p
                          className={`font-medium ${profile.accessibility?.darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          BMI
                        </p>
                        <p className={`text-lg font-bold ${bmiCategory.color}`}>{bmi}</p>
                        <p className={`text-xs ${bmiCategory.color}`}>{bmiCategory.text}</p>
                      </div>
                      <div>
                        <p
                          className={`font-medium ${profile.accessibility?.darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Streak
                        </p>
                        <p className="text-lg font-bold text-orange-600 flex items-center justify-center">
                          <Flame className="w-4 h-4 mr-1" />
                          {profile.stats?.streakDays || 0}
                        </p>
                        <p className="text-xs text-gray-500">days</p>
                      </div>
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        Last active:{" "}
                        {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString() : "Today"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Zap className="w-5 h-5 mr-2 text-blue-500" />
                    {t.quickActions}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                      <Link key={action.title} href={action.href}>
                        <div
                          className={`p-3 rounded-lg text-center transition-all duration-300 hover:scale-105 bg-gradient-to-br ${action.color} text-white shadow-md`}
                        >
                          <action.icon className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-xs font-medium">{action.title}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Middle Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Snapshot */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                    {t.healthSnapshot}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(profile.dailyProgress || {}).map(([key, value]) => {
                      const target = profile.dailyNeeds?.[key as keyof typeof profile.dailyNeeds] || 8 // Default for water
                      const percentage = getProgressPercentage(value, target)
                      const isWater = key === "water"

                      return (
                        <div key={key} className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-2">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-200 dark:text-gray-700"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={`${
                                  percentage >= 100
                                    ? "text-green-500"
                                    : percentage >= 75
                                      ? "text-lime-500"
                                      : percentage >= 50
                                        ? "text-yellow-500"
                                        : "text-orange-500"
                                }`}
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={`${percentage}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">{Math.round(percentage)}%</span>
                            </div>
                          </div>
                          <div className="text-sm font-medium capitalize">
                            {key === "energy_kcal_100g" ? "Calories" : key}
                          </div>
                          <div className="text-xs text-gray-500">
                            {value}
                            {isWater ? " glasses" : key === "calories" ? " kcal" : "g"} / {target}
                            {isWater ? " glasses" : key === "calories" ? " kcal" : "g"}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    {t.personalDetails}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="mt-1"
                            placeholder="Phone number"
                          />
                        ) : (
                          <p className="mt-1 text-sm">{profile.phone || "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editedProfile.birthdate || ""}
                            onChange={(e) => handleInputChange("birthdate", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm">{profile.birthdate || "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                        {isEditing ? (
                          <select
                            value={editedProfile.gender || ""}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <p className="mt-1 text-sm">{profile.gender || "Not specified"}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <Ruler className="w-4 h-4 mr-1" />
                          Height (cm)
                        </label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedProfile.height || ""}
                            onChange={(e) => handleInputChange("height", e.target.value)}
                            className="mt-1"
                            placeholder="Height in cm"
                          />
                        ) : (
                          <p className="mt-1 text-sm">{profile.height ? `${profile.height} cm` : "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <Scale className="w-4 h-4 mr-1" />
                          Weight (kg)
                        </label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedProfile.weight || ""}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                            className="mt-1"
                            placeholder="Weight in kg"
                          />
                        ) : (
                          <p className="mt-1 text-sm">{profile.weight ? `${profile.weight} kg` : "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          Activity Level
                        </label>
                        {isEditing ? (
                          <select
                            value={editedProfile.activityLevel || ""}
                            onChange={(e) => handleInputChange("activityLevel", e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="">Select activity level</option>
                            <option value="Sedentary">Sedentary</option>
                            <option value="Light">Light</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Active">Active</option>
                            <option value="Very Active">Very Active</option>
                          </select>
                        ) : (
                          <p className="mt-1 text-sm">{profile.activityLevel || "Not specified"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Health Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TargetIcon className="w-5 h-5 mr-2 text-green-500" />
                    {t.healthGoals}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Weight</label>
                      {isEditing ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            value={editedProfile.healthGoals?.targetWeight || ""}
                            onChange={(e) =>
                              handleInputChange("healthGoals.targetWeight", Number.parseInt(e.target.value))
                            }
                            className="flex-1"
                            placeholder="Target weight"
                          />
                          <span className="text-sm text-gray-500">kg</span>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm">
                          {profile.healthGoals?.targetWeight ? `${profile.healthGoals.targetWeight} kg` : "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Goal</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.healthGoals?.weeklyGoal || ""}
                          onChange={(e) => handleInputChange("healthGoals.weeklyGoal", e.target.value)}
                          className="mt-1"
                          placeholder="Weekly goal"
                        />
                      ) : (
                        <p className="mt-1 text-sm">{profile.healthGoals?.weeklyGoal || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Calories</label>
                      {isEditing ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            value={editedProfile.healthGoals?.dailyCalories || ""}
                            onChange={(e) =>
                              handleInputChange("healthGoals.dailyCalories", Number.parseInt(e.target.value))
                            }
                            className="flex-1"
                            placeholder="Daily calories"
                          />
                          <span className="text-sm text-gray-500">kcal</span>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm">
                          {profile.healthGoals?.dailyCalories
                            ? `${profile.healthGoals.dailyCalories} kcal`
                            : profile.dailyNeeds?.calories
                              ? `${profile.dailyNeeds.calories} kcal (calculated)`
                              : "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Water Intake Goal</label>
                      {isEditing ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            value={editedProfile.healthGoals?.waterIntake || ""}
                            onChange={(e) =>
                              handleInputChange("healthGoals.waterIntake", Number.parseInt(e.target.value))
                            }
                            className="flex-1"
                            placeholder="Water intake"
                          />
                          <span className="text-sm text-gray-500">glasses</span>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm">
                          {profile.healthGoals?.waterIntake
                            ? `${profile.healthGoals.waterIntake} glasses`
                            : "8 glasses (default)"}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dietary Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    {t.dietaryPreferences}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        "Vegetarian",
                        "Vegan",
                        "Gluten Free",
                        "Dairy Free",
                        "Nut Free",
                        "Keto",
                        "Paleo",
                        "Low Carb",
                        "Low Fat",
                      ].map((preference) => (
                        <label key={preference} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(editedProfile.dietaryPreferences || []).includes(preference)}
                            onChange={(e) => handleDietaryPreferenceChange(preference, e.target.checked)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm">{preference}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(profile.dietaryPreferences || []).length > 0 ? (
                        profile.dietaryPreferences?.map((preference) => (
                          <span
                            key={preference}
                            className="px-3 py-1 bg-gradient-to-r from-orange-100 to-lime-100 dark:from-orange-900/30 dark:to-lime-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                          >
                            {preference}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No dietary preferences set</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Achievements & Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Achievements/Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    {t.achievements}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(profile.badges || []).slice(0, 4).map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative group cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                          badge.earned ? "opacity-100" : "opacity-60"
                        }`}
                      >
                        <div
                          className={`absolute -inset-1 bg-gradient-to-r ${badge.color} rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${
                            badge.earned ? "opacity-25" : "opacity-10"
                          }`}
                        ></div>
                        <div
                          className={`relative p-3 rounded-lg border transition-all duration-300 ${
                            badge.earned
                              ? `bg-gradient-to-br ${badge.color} text-white shadow-md`
                              : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{badge.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{badge.name}</div>
                              <div
                                className={`text-xs ${
                                  badge.earned ? "text-white/80" : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {badge.description}
                              </div>
                              {!badge.earned && badge.progress && badge.target && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>{badge.progress}</span>
                                    <span>{badge.target}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                    <div
                                      className={`bg-gradient-to-r ${badge.color} h-1.5 rounded-full transition-all duration-500`}
                                      style={{
                                        width: `${Math.min((badge.progress / badge.target) * 100, 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {badge.earned && <CheckCircle className="w-5 h-5 text-white" />}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/badges">
                    <Button variant="ghost" className="w-full mt-3 text-sm">
                      View All Badges
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(profile.recentActivity || []).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="text-lg">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                    {(!profile.recentActivity || profile.recentActivity.length === 0) && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Start scanning to see your activity here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${
                  profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Global Rank</span>
                      <span className="font-bold text-purple-600">
                        #{Math.max(1, 10000 - (profile.stats?.totalPoints || 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Friends</span>
                      <span className="font-bold text-blue-600">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reviews Helped</span>
                      <span className="font-bold text-green-600">
                        {Math.floor((profile.stats?.totalScans || 0) * 1.2)}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full mt-3 bg-transparent">
                      <Users className="w-4 h-4 mr-2" />
                      Find Friends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* App Preferences & Settings - Full Width Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card
            className={`shadow-lg border-0 transition-colors duration-300 ${
              profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="w-5 h-5 mr-2 text-purple-500" />
                {t.appPreferences}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {profile.accessibility?.notifications ? (
                      <Bell className="w-5 h-5 text-green-500" />
                    ) : (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get alerts for health tips and reminders
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.accessibility?.notifications || false}
                      onChange={(e) => handleInputChange("accessibility.notifications", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {/* Voice Assistant */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mic className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Voice Assistant</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable voice commands and responses</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.accessibility?.voiceAssistant || false}
                      onChange={(e) => handleInputChange("accessibility.voiceAssistant", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {/* Audio Output */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {profile.accessibility?.audioOutput ? (
                      <Volume2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">Audio Output</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Convert scan results to audio</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.accessibility?.audioOutput || false}
                      onChange={(e) => handleInputChange("accessibility.audioOutput", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {profile.accessibility?.darkMode ? (
                      <Moon className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable dark color theme</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.accessibility?.darkMode || false}
                      onChange={(e) => handleInputChange("accessibility.darkMode", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {/* Font Size */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-lg font-bold">A</span>
                    </div>
                    <div>
                      <p className="font-medium">Font Size</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Adjust text size for better readability
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleInputChange(
                          "accessibility.fontSize",
                          Math.max(12, (profile.accessibility?.fontSize || 16) - 2),
                        )
                      }
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{profile.accessibility?.fontSize || 16}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleInputChange(
                          "accessibility.fontSize",
                          Math.min(24, (profile.accessibility?.fontSize || 16) + 2),
                        )
                      }
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred language</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={currentLanguage === "en" ? "default" : "outline"}
                      onClick={() => handleLanguageChange("en")}
                      className={currentLanguage === "en" ? "bg-gradient-to-r from-orange-500 to-lime-500" : ""}
                    >
                      English
                    </Button>
                    <Button
                      size="sm"
                      variant={currentLanguage === "hi" ? "default" : "outline"}
                      onClick={() => handleLanguageChange("hi")}
                      className={currentLanguage === "hi" ? "bg-gradient-to-r from-orange-500 to-lime-500" : ""}
                    >
                      हिन्दी
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Data Management - Full Width Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6"
        >
          <Card
            className={`shadow-lg border-0 transition-colors duration-300 ${
              profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                {t.privacyData}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Data Export */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Export My Data</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Download all your profile and scan data
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowDataExport(true)}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Cloud Sync */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cloud className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Cloud Sync</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sync data across devices</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Synced</span>
                  </div>
                </div>

                {/* Profile Visibility */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Who can see your profile</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <select
                      value={editedProfile.privacy?.profileVisibility || "friends"}
                      onChange={(e) => handleInputChange("privacy.profileVisibility", e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  ) : (
                    <span className="text-sm capitalize">{profile.privacy?.profileVisibility || "friends"}</span>
                  )}
                </div>

                {/* Data Sharing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Share2 className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Anonymous Data Sharing</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help improve FoodSnap with anonymous data
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.privacy?.dataSharing || false}
                      onChange={(e) => handleInputChange("privacy.dataSharing", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support & Help - Full Width Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6"
        >
          <Card
            className={`shadow-lg border-0 transition-colors duration-300 ${
              profile.accessibility?.darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowSupportChat(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t.getSupport}
                </Button>
                <Link href="/help">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-semibold transition-all duration-300 bg-transparent"
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    {t.helpCenter}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={`mt-12 pt-8 border-t text-center ${
            profile.accessibility?.darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>FoodSnap v2.1.0</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Today"}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Powered by</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-orange-600">GroqAI</span>
              </div>
              <span>&</span>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600">OpenFoodFacts</span>
              </div>
            </div>
          </div>
        </motion.footer>

        {/* Save/Cancel Buttons for Edit Mode */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 flex space-x-3 z-50"
            >
              <Button onClick={handleCancelEdit} variant="outline" className="shadow-lg bg-transparent">
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {showVoiceAssistant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Mic className="w-10 h-10 text-white" />
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Voice Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                "How can I help you with your nutrition today?"
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPhotoUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-semibold mb-4">Update Profile Photo</h3>
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={editedProfile.photoURL || "/placeholder.svg?height=96&width=96"}
                    alt="Current profile"
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-lime-500 text-white rounded-lg cursor-pointer hover:from-orange-600 hover:to-lime-600 transition-all duration-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose New Photo
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowPhotoUpload(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Export Modal */}
      <AnimatePresence>
        {showDataExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDataExport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-semibold mb-4">Export Your Data</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Profile Data</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Personal info, preferences, goals</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Scan History</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">All scanned products and analysis</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">Achievements</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Badges, points, and progress</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowDataExport(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleDataExport}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Chat Modal */}
      <AnimatePresence>
        {showSupportChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSupportChat(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md h-96 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold">Chat Support</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSupportChat(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-orange-500 to-lime-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-orange-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
