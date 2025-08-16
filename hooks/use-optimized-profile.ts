import { useState, useEffect, useCallback, useMemo } from "react"
import { PerformanceOptimizer } from "@/lib/performance-utils"

interface UserProfile {
  uid: string
  email: string
  displayName: string
  fullName: string
  photoURL?: string
  emailVerified: boolean
  profileComplete: boolean
  createdAt: string
  lastLoginAt: string
  phone?: string
  birthdate?: string
  gender?: string
  age?: string
  height?: string
  weight?: string
  activityLevel?: string
  dietaryPreferences?: string[]
  accessibility?: {
    audioOutput: boolean
    audioSpeed: string
    darkMode: boolean
    fontSize: number
    language: string
    notifications: boolean
    voiceAssistant: boolean
  }
  signUpMethod?: string
  stats: {
    totalScans: number
    monthlyScans: number
    redFlags: number
    greenFlags: number
    streakDays: number
    totalPoints: number
    level: number
  }
  dailyNeeds: {
    calories: number
    protein: number
    fat: number
    carbs: number
    fiber: number
    sodium: number
  }
  dailyProgress: {
    calories: number
    protein: number
    fat: number
    carbs: number
    fiber: number
    sodium: number
    water: number
  }
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earned: boolean
    earnedDate?: string
    color: string
    progress?: number
    target?: number
  }>
  healthGoals: {
    targetWeight: number
    weeklyGoal: string
    dailyCalories: number
    waterIntake: number
  }
  privacy: {
    profileVisibility: string
    dataSharing: boolean
    analyticsOptIn: boolean
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    date: string
    icon: string
  }>
}

// Optimized profile hook with memoization and efficient updates
export function useOptimizedProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Memoized profile calculations
  const profileStats = useMemo(() => {
    if (!profile) return null

    const scanHistory = PerformanceOptimizer.getStorageItem("scanHistory", [])
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      totalScans: scanHistory.length,
      thisWeek: scanHistory.filter((item: any) => new Date(item.scannedAt) >= oneWeekAgo).length,
      thisMonth: scanHistory.filter((item: any) => new Date(item.scannedAt) >= oneMonthAgo).length,
      healthyChoices: scanHistory.filter((item: any) => ["A", "B"].includes(item.nutritionGrade)).length,
      unhealthyChoices: scanHistory.filter((item: any) => ["D", "E"].includes(item.nutritionGrade)).length,
    }
  }, [profile?.stats?.totalScans]) // Only recalculate when scan count changes

  // Optimized profile loading
  const loadProfile = useCallback(() => {
    const savedProfile = PerformanceOptimizer.getStorageItem("userProfile", null)
    
    if (savedProfile) {
      setProfile(savedProfile)
    } else {
      // Create default profile only when needed
      const defaultProfile: UserProfile = {
        uid: `user_${Date.now()}`,
        email: "",
        displayName: "",
        fullName: "",
        emailVerified: false,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        accessibility: {
          audioOutput: false,
          audioSpeed: "1",
          darkMode: false,
          fontSize: 16,
          language: "en",
          notifications: true,
          voiceAssistant: false,
        },
        stats: {
          totalScans: 0,
          monthlyScans: 0,
          redFlags: 0,
          greenFlags: 0,
          streakDays: 0,
          totalPoints: 0,
          level: 1,
        },
        dailyNeeds: {
          calories: 2000,
          protein: 50,
          fat: 65,
          carbs: 300,
          fiber: 25,
          sodium: 2300,
        },
        dailyProgress: {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          fiber: 0,
          sodium: 0,
          water: 0,
        },
        badges: [],
        healthGoals: {
          targetWeight: 70,
          weeklyGoal: "Maintain current weight",
          dailyCalories: 2000,
          waterIntake: 8,
        },
        privacy: {
          profileVisibility: "friends",
          dataSharing: true,
          analyticsOptIn: true,
        },
        recentActivity: [],
      }
      setProfile(defaultProfile)
    }
    setLoading(false)
  }, [])

  // Optimized profile update with batching
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prevProfile => {
      if (!prevProfile) return null
      
      const updatedProfile = { ...prevProfile, ...updates }
      
      // Batch the localStorage update
      requestAnimationFrame(() => {
        PerformanceOptimizer.setStorageItem("userProfile", updatedProfile)
      })
      
      return updatedProfile
    })
  }, [])

  // Memoized daily needs calculation
  const calculateDailyNeeds = useCallback(() => {
    if (!profile) return

    const age = parseInt(profile.age || "25")
    const weight = parseInt(profile.weight || "70")
    const height = parseInt(profile.height || "170")
    const gender = profile.gender || "Male"
    const activityLevel = profile.activityLevel || "Moderate"

    // Optimized BMR calculation
    const bmr = gender === "Male" 
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

    const activityMultipliers: Record<string, number> = {
      Sedentary: 1.2,
      Light: 1.375,
      Moderate: 1.55,
      Active: 1.725,
      "Very Active": 1.9,
    }

    const calories = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55))
    const protein = Math.round(weight * 1.6)
    const fat = Math.round((calories * 0.25) / 9)
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)
    const fiber = Math.round((calories / 1000) * 14)
    const sodium = 2300

    updateProfile({
      dailyNeeds: { calories, protein, fat, carbs, fiber, sodium }
    })
  }, [profile?.age, profile?.weight, profile?.height, profile?.gender, profile?.activityLevel, updateProfile])

  const isProfileComplete = useCallback(() => {
    if (!profile) return false
    return !!(
      profile.fullName &&
      profile.email &&
      profile.age &&
      profile.height &&
      profile.weight &&
      profile.gender &&
      profile.activityLevel
    )
  }, [profile])

  const markProfileComplete = useCallback(() => {
    if (!profile) return
    updateProfile({ profileComplete: isProfileComplete() })
  }, [profile, isProfileComplete, updateProfile])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  return {
    profile,
    loading,
    updateProfile,
    calculateDailyNeeds,
    isProfileComplete,
    markProfileComplete,
    profileStats
  }
}
