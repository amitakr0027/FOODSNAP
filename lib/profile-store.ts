// Profile data store with real-time updates
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

class ProfileStore {
  private static instance: ProfileStore
  private profile: UserProfile | null = null
  private listeners: Set<(profile: UserProfile | null) => void> = new Set()

  private constructor() {
    this.loadProfile()
    this.setupStorageListener()
  }

  static getInstance(): ProfileStore {
    if (!ProfileStore.instance) {
      ProfileStore.instance = new ProfileStore()
    }
    return ProfileStore.instance
  }

  private loadProfile(): void {
    try {
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        this.profile = JSON.parse(savedProfile)
        this.calculateDynamicStats()
      } else {
        this.profile = this.getDefaultProfile()
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      this.profile = this.getDefaultProfile()
    }
  }

  private getDefaultProfile(): UserProfile {
    return {
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
  }

  private calculateDynamicStats(): void {
    if (!this.profile) return

    try {
      // Get scan history for dynamic stats calculation
      const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]")
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Calculate stats from actual data
      const totalScans = scanHistory.length
      const monthlyScans = scanHistory.filter((item: any) => new Date(item.scannedAt) >= oneMonthAgo).length

      const healthyScans = scanHistory.filter((item: any) => ["A", "B"].includes(item.nutritionGrade)).length

      const unhealthyScans = scanHistory.filter((item: any) => ["D", "E"].includes(item.nutritionGrade)).length

      // Calculate streak
      const sortedDates = [...new Set(scanHistory.map((item: any) => new Date(item.scannedAt).toDateString()))].sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      )

      let streakDays = 0
      if (sortedDates.length > 0) {
        let currentDate = new Date()
        for (const dateStr of sortedDates) {
          const scanDate = new Date(dateStr)
          const diffDays = Math.floor((currentDate.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays <= streakDays + 1) {
            streakDays++
            currentDate = scanDate
          } else {
            break
          }
        }
      }

      // Calculate level and points
      const totalPoints = totalScans * 10 + healthyScans * 5 + streakDays * 20
      const level = Math.floor(totalPoints / 500) + 1

      // Update profile stats
      this.profile.stats = {
        totalScans,
        monthlyScans,
        redFlags: unhealthyScans,
        greenFlags: healthyScans,
        streakDays,
        totalPoints,
        level,
      }

      // Calculate daily progress from today's scans
      const today = new Date().toDateString()
      const todayScans = scanHistory.filter((item: any) => new Date(item.scannedAt).toDateString() === today)

      const dailyProgress = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        sodium: 0,
        water: Math.floor(Math.random() * 8), // Simulated water intake
      }

      todayScans.forEach((scan: any) => {
        dailyProgress.calories += scan.calories || 0
        dailyProgress.protein += scan.protein || 0
        dailyProgress.fat += scan.fat || 0
        dailyProgress.carbs += scan.carbs || 0
        dailyProgress.fiber += scan.fiber || 0
        dailyProgress.sodium += scan.sodium || 0
      })

      this.profile.dailyProgress = dailyProgress

      // Update recent activity
      const recentActivity = scanHistory.slice(0, 4).map((scan: any, index: number) => ({
        id: `activity_${index}`,
        type: "scan",
        description: `Scanned ${scan.productName}`,
        date: this.formatRelativeTime(scan.scannedAt),
        icon: "📱",
      }))

      // Add achievement activities
      if (streakDays >= 7) {
        recentActivity.unshift({
          id: "streak_achievement",
          type: "achievement",
          description: `${streakDays}-day scanning streak!`,
          date: "Today",
          icon: "🔥",
        })
      }

      this.profile.recentActivity = recentActivity

      // Update badges based on achievements
      this.updateBadges()
    } catch (error) {
      console.error("Error calculating dynamic stats:", error)
    }
  }

  private updateBadges(): void {
    if (!this.profile) return

    const badges = [
      {
        id: "first_scan",
        name: "First Scan",
        description: "Completed your first product scan",
        icon: "🎯",
        earned: this.profile.stats.totalScans >= 1,
        earnedDate: this.profile.stats.totalScans >= 1 ? this.profile.createdAt : undefined,
        color: "from-blue-500 to-blue-600",
        progress: Math.min(this.profile.stats.totalScans, 1),
        target: 1,
      },
      {
        id: "week_streak",
        name: "Week Warrior",
        description: "7 days scanning streak",
        icon: "🔥",
        earned: this.profile.stats.streakDays >= 7,
        earnedDate: this.profile.stats.streakDays >= 7 ? new Date().toISOString() : undefined,
        color: "from-orange-500 to-red-500",
        progress: Math.min(this.profile.stats.streakDays, 7),
        target: 7,
      },
      {
        id: "healthy_choices",
        name: "Health Champion",
        description: "Made 50 healthy food choices",
        icon: "🏆",
        earned: this.profile.stats.greenFlags >= 50,
        earnedDate: this.profile.stats.greenFlags >= 50 ? new Date().toISOString() : undefined,
        color: "from-green-500 to-green-600",
        progress: Math.min(this.profile.stats.greenFlags, 50),
        target: 50,
      },
      {
        id: "nutrition_expert",
        name: "Nutrition Expert",
        description: "Scan 100 different products",
        icon: "🧠",
        earned: this.profile.stats.totalScans >= 100,
        color: "from-purple-500 to-purple-600",
        progress: Math.min(this.profile.stats.totalScans, 100),
        target: 100,
      },
      {
        id: "community_helper",
        name: "Community Helper",
        description: "Help 10 community members",
        icon: "🤝",
        earned: false,
        color: "from-pink-500 to-pink-600",
        progress: 3,
        target: 10,
      },
      {
        id: "master_scanner",
        name: "Master Scanner",
        description: "Scan 500 products",
        icon: "⚡",
        earned: this.profile.stats.totalScans >= 500,
        color: "from-yellow-500 to-orange-500",
        progress: Math.min(this.profile.stats.totalScans, 500),
        target: 500,
      },
    ]

    this.profile.badges = badges
  }

  private formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  private setupStorageListener(): void {
    window.addEventListener("storage", (e) => {
      if (e.key === "userProfile" || e.key === "scanHistory") {
        this.loadProfile()
        this.notifyListeners()
      }
    })

    // Listen for custom events from other parts of the app
    window.addEventListener("profileUpdated", () => {
      this.loadProfile()
      this.notifyListeners()
    })

    window.addEventListener("scanCompleted", () => {
      this.calculateDynamicStats()
      this.saveProfile()
      this.notifyListeners()
    })
  }

  subscribe(listener: (profile: UserProfile | null) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.profile))
  }

  getProfile(): UserProfile | null {
    return this.profile
  }

  updateProfile(updates: Partial<UserProfile>): void {
    if (!this.profile) return

    // Deep merge the updates
    this.profile = this.deepMerge(this.profile, updates)

    // Recalculate dynamic stats if needed
    this.calculateDynamicStats()

    // Save to localStorage
    this.saveProfile()

    // Notify listeners
    this.notifyListeners()

    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("profileUpdated", {
        detail: this.profile,
      }),
    )
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target }

    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }

    return result
  }

  private saveProfile(): void {
    if (this.profile) {
      localStorage.setItem("userProfile", JSON.stringify(this.profile))
    }
  }

  // Calculate daily needs based on profile data
  calculateDailyNeeds(): void {
    if (!this.profile) return

    const age = Number.parseInt(this.profile.age || "25")
    const weight = Number.parseInt(this.profile.weight || "70")
    const height = Number.parseInt(this.profile.height || "170")
    const gender = this.profile.gender || "Male"
    const activityLevel = this.profile.activityLevel || "Moderate"

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number
    if (gender === "Male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Apply activity multiplier
    const activityMultipliers: Record<string, number> = {
      Sedentary: 1.2,
      Light: 1.375,
      Moderate: 1.55,
      Active: 1.725,
      "Very Active": 1.9,
    }

    const calories = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55))

    // Calculate macronutrients (standard ratios)
    const protein = Math.round(weight * 1.6) // 1.6g per kg body weight
    const fat = Math.round((calories * 0.25) / 9) // 25% of calories from fat
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)
    const fiber = Math.round((calories / 1000) * 14) // 14g per 1000 calories
    const sodium = 2300 // Standard recommendation

    this.profile.dailyNeeds = {
      calories,
      protein,
      fat,
      carbs,
      fiber,
      sodium,
    }

    this.saveProfile()
    this.notifyListeners()
  }

  // Add scan data to daily progress
  addScanToProgress(scanData: any): void {
    if (!this.profile) return

    this.profile.dailyProgress.calories += scanData.calories || 0
    this.profile.dailyProgress.protein += scanData.protein || 0
    this.profile.dailyProgress.fat += scanData.fat || 0
    this.profile.dailyProgress.carbs += scanData.carbs || 0
    this.profile.dailyProgress.fiber += scanData.fiber || 0
    this.profile.dailyProgress.sodium += scanData.sodium || 0

    this.calculateDynamicStats()
    this.saveProfile()
    this.notifyListeners()

    // Dispatch scan completed event
    window.dispatchEvent(
      new CustomEvent("scanCompleted", {
        detail: scanData,
      }),
    )
  }

  // Reset daily progress (called at midnight)
  resetDailyProgress(): void {
    if (!this.profile) return

    this.profile.dailyProgress = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      sodium: 0,
      water: 0,
    }

    this.saveProfile()
    this.notifyListeners()
  }

  // Check if profile setup is complete
  isProfileComplete(): boolean {
    if (!this.profile) return false

    return !!(
      this.profile.fullName &&
      this.profile.email &&
      this.profile.age &&
      this.profile.height &&
      this.profile.weight &&
      this.profile.gender &&
      this.profile.activityLevel
    )
  }

  // Mark profile as complete
  markProfileComplete(): void {
    if (!this.profile) return

    this.profile.profileComplete = this.isProfileComplete()
    this.calculateDailyNeeds()
    this.saveProfile()
    this.notifyListeners()
  }
}

export const profileStore = ProfileStore.getInstance()
export type { UserProfile }
