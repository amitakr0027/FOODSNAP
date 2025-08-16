"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Award,
  Trophy,
  Star,
  Target,
  Heart,
  Calendar,
  Camera,
  Users,
  BookOpen,
  Shield,
  Crown,
  Flame,
  CheckCircle,
  Lock,
  Share2,
  Search,
  TrendingUp,
  Gift,
  Medal,
  Filter,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Badge {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  category: string
  points: number
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  rarity: "common" | "rare" | "epic" | "legendary"
  color: string
}

const badgeCategories = [
  { id: "all", name: "All Badges", icon: Award },
  { id: "health", name: "Health", icon: Heart },
  { id: "scanning", name: "Scanning", icon: Camera },
  { id: "social", name: "Social", icon: Users },
  { id: "knowledge", name: "Knowledge", icon: BookOpen },
  { id: "achievement", name: "Achievement", icon: Trophy },
]

const filterOptions = [
  { id: "all", name: "All" },
  { id: "unlocked", name: "Unlocked" },
  { id: "locked", name: "Locked" },
]

export default function BadgesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [userStats, setUserStats] = useState({
    totalPoints: 2450,
    totalBadges: 24,
    unlockedBadges: 18,
    currentStreak: 12,
  })

  // Sample badges data
  const [badges] = useState<Badge[]>([
    {
      id: "first-scan",
      title: "First Scan",
      description: "Completed your first food scan",
      icon: Camera,
      category: "scanning",
      points: 50,
      unlocked: true,
      unlockedAt: "2024-01-15",
      rarity: "common",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "health-warrior",
      title: "Health Warrior",
      description: "Scanned 50 healthy food items",
      icon: Shield,
      category: "health",
      points: 200,
      unlocked: true,
      unlockedAt: "2024-02-10",
      progress: 50,
      maxProgress: 50,
      rarity: "rare",
      color: "from-green-500 to-green-600",
    },
    {
      id: "scan-master",
      title: "Scan Master",
      description: "Completed 100 successful scans",
      icon: Target,
      category: "scanning",
      points: 300,
      unlocked: true,
      unlockedAt: "2024-02-20",
      progress: 100,
      maxProgress: 100,
      rarity: "epic",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "knowledge-seeker",
      title: "Knowledge Seeker",
      description: "Read 25 nutrition articles",
      icon: BookOpen,
      category: "knowledge",
      points: 150,
      unlocked: true,
      unlockedAt: "2024-02-05",
      progress: 25,
      maxProgress: 25,
      rarity: "rare",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "streak-champion",
      title: "Streak Champion",
      description: "Maintained a 30-day scanning streak",
      icon: Flame,
      category: "achievement",
      points: 500,
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      rarity: "legendary",
      color: "from-red-500 to-red-600",
    },
    {
      id: "social-butterfly",
      title: "Social Butterfly",
      description: "Shared 10 food analyses with friends",
      icon: Users,
      category: "social",
      points: 100,
      unlocked: true,
      unlockedAt: "2024-01-28",
      progress: 10,
      maxProgress: 10,
      rarity: "common",
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "nutrition-expert",
      title: "Nutrition Expert",
      description: "Analyzed nutrition for 200+ products",
      icon: Star,
      category: "knowledge",
      points: 400,
      unlocked: false,
      progress: 156,
      maxProgress: 200,
      rarity: "epic",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Scanned breakfast items 7 days in a row",
      icon: Calendar,
      category: "health",
      points: 120,
      unlocked: true,
      unlockedAt: "2024-02-12",
      rarity: "common",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "legend",
      title: "FoodSnap Legend",
      description: "Reached 5000 total points",
      icon: Crown,
      category: "achievement",
      points: 1000,
      unlocked: false,
      progress: 2450,
      maxProgress: 5000,
      rarity: "legendary",
      color: "from-amber-500 to-amber-600",
    },
  ])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const filteredBadges = badges.filter((badge) => {
    const matchesCategory = selectedCategory === "all" || badge.category === selectedCategory
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "unlocked" && badge.unlocked) ||
      (selectedFilter === "locked" && !badge.unlocked)
    const matchesSearch =
      badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesFilter && matchesSearch
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-50 dark:bg-gray-800"
      case "rare":
        return "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
      case "epic":
        return "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
      case "legendary":
        return "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
      default:
        return "border-gray-400 bg-gray-50 dark:bg-gray-800"
    }
  }

  const handleShare = (badge: Badge) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${badge.title} badge!`,
        text: `Check out my achievement in FoodSnap: ${badge.description}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`I earned the ${badge.title} badge in FoodSnap! ${badge.description}`)
      alert("Achievement copied to clipboard!")
    }
  }

  const getSelectedCategoryName = () => {
    const category = badgeCategories.find((cat) => cat.id === selectedCategory)
    return category ? category.name : "All Badges"
  }

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
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2 min-w-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold truncate">Badges & Achievements</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-orange-500">{userStats.totalPoints}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Points</p>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-500">
                {userStats.unlockedBadges}/{userStats.totalBadges}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Badges</p>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-500">{userStats.currentStreak}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-purple-500">75%</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Completion</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-3 sm:px-4 pb-4 sm:pb-6">
        <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search badges..."
              className={`pl-9 sm:pl-10 text-sm sm:text-base ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between sm:hidden">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Category:</span>
              <span className="text-sm text-orange-500 font-medium">{getSelectedCategoryName()}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`${isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>

          {/* Mobile Filter Modal */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 sm:hidden"
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 500 }}
                  className={`absolute bottom-0 left-0 right-0 rounded-t-2xl p-4 pb-8 max-h-[80vh] overflow-y-auto ${
                    isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                  } border-t`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filter Badges</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileFilters(false)}
                      className="rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Category Filters */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Categories</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {badgeCategories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setShowMobileFilters(false)
                          }}
                          className={`flex items-center justify-start space-x-2 h-12 ${
                            selectedCategory === category.id
                              ? "bg-gradient-to-r from-orange-500 to-lime-500 text-white"
                              : isDarkMode
                                ? "border-gray-700 hover:bg-gray-800"
                                : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <category.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate">{category.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Status</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {filterOptions.map((filter) => (
                        <Button
                          key={filter.id}
                          variant={selectedFilter === filter.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedFilter(filter.id)
                            setShowMobileFilters(false)
                          }}
                          className={`h-10 ${
                            selectedFilter === filter.id
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : isDarkMode
                                ? "border-gray-700 hover:bg-gray-800"
                                : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-sm">{filter.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Category Filters */}
          <div className="hidden sm:flex overflow-x-auto space-x-2 pb-2">
            {badgeCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-500 to-lime-500 text-white"
                    : isDarkMode
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Desktop Status Filters */}
          <div className="hidden sm:flex space-x-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={`${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : isDarkMode
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Badges Grid */}
      <main className="px-3 sm:px-4 pb-32 max-w-6xl mx-auto">
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${getRarityColor(
                  badge.rarity,
                )} ${badge.unlocked ? "" : "opacity-60"}`}
              >
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    {/* Badge Icon */}
                    <div className="relative mb-3 sm:mb-4">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center shadow-lg`}
                      >
                        <badge.icon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                      </div>
                      {badge.unlocked ? (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      ) : (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gray-500 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Badge Info */}
                    <div className="text-center mb-3 sm:mb-4">
                      <h3 className="font-bold text-base sm:text-lg mb-1">{badge.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {badge.description}
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                        <span className="text-xs sm:text-sm font-medium text-orange-500">{badge.points} pts</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {badge.maxProgress && (
                      <div className="mb-3 sm:mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>
                            {badge.progress}/{badge.maxProgress}
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${badge.color} transition-all duration-300`}
                            style={{ width: `${((badge.progress || 0) / badge.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Unlock Date */}
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-xs text-gray-500 text-center mb-3">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}

                    {/* Actions */}
                    {badge.unlocked && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(badge)}
                          className="flex-1 text-xs h-8"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    )}

                    {/* Rarity Indicator */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          badge.rarity === "common"
                            ? "bg-gray-200 text-gray-800"
                            : badge.rarity === "rare"
                              ? "bg-blue-200 text-blue-800"
                              : badge.rarity === "epic"
                                ? "bg-purple-200 text-purple-800"
                                : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No badges found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </main>
    </div>
  )
}
