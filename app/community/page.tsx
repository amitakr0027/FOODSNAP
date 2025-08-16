"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Users,
  MessageSquare,
  BookOpen,
  BarChart3,
  ChefHat,
  HelpCircle,
  Trophy,
  Calendar,
  MessageCircle,
  Zap,
  TrendingUp,
  Star,
  Flame,
  Heart,
  Share2,
  Plus,
  Search,
  Bell,
  Crown,
  Clock,
  Eye,
  Send,
  ImageIcon,
  MoreHorizontal,
  Pin,
  X,
  Globe,
  Activity,
  Shield,
  UserPlus,
  Menu,
  Filter,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
    level: number
    badge: string
    verified: boolean
  }
  content: string
  type: "discussion" | "recipe" | "story" | "poll" | "challenge"
  timestamp: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  trending: boolean
  pinned: boolean
  image?: string
}

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  points: number
  level: number
  badge: string
  streak: number
  contributions: number
  reviewsHelped: number
}

interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  duration: string
  reward: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  progress: number
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "webinar" | "challenge" | "qa" | "workshop"
  attendees: number
  host: string
}

interface SuggestedFriend {
  id: string
  name: string
  avatar: string
  level: number
  badge: string
  mutualFriends: number
  isConnected: boolean
  bio: string
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showLiveChat, setShowLiveChat] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showFindFriends, setShowFindFriends] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [friendSearchQuery, setFriendSearchQuery] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Sarah", message: "Just tried the quinoa salad recipe! Amazing!", time: "2m ago", avatar: "👩‍🦰" },
    { id: 2, user: "Mike", message: "Anyone know good protein sources for vegans?", time: "5m ago", avatar: "👨‍💼" },
    {
      id: 3,
      user: "Lisa",
      message: "Completed day 15 of the healthy eating challenge! 💪",
      time: "8m ago",
      avatar: "👩‍🎓",
    },
  ])
  const [newChatMessage, setNewChatMessage] = useState("")

  const communityStats = {
    totalMembers: 12847,
    activeToday: 1234,
    postsToday: 89,
    recipesShared: 2456,
    challengesCompleted: 5678,
  }

  const trendingTopics = [
    { tag: "HealthyMeals", posts: 234, growth: "+12%" },
    { tag: "VeganRecipes", posts: 189, growth: "+8%" },
    { tag: "MealPrep", posts: 156, growth: "+15%" },
    { tag: "WeightLoss", posts: 134, growth: "+6%" },
    { tag: "Keto", posts: 98, growth: "+10%" },
  ]

  const leaderboard: LeaderboardUser[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "👩‍🦰",
      points: 2450,
      level: 8,
      badge: "Nutrition Expert",
      streak: 45,
      contributions: 127,
      reviewsHelped: 89,
    },
    {
      id: "2",
      name: "Mike Johnson",
      avatar: "👨‍💼",
      points: 2234,
      level: 7,
      badge: "Recipe Master",
      streak: 32,
      contributions: 98,
      reviewsHelped: 76,
    },
    {
      id: "3",
      name: "Lisa Wang",
      avatar: "👩‍🎓",
      points: 2156,
      level: 7,
      badge: "Health Champion",
      streak: 28,
      contributions: 89,
      reviewsHelped: 65,
    },
    {
      id: "4",
      name: "David Kim",
      avatar: "👨‍🍳",
      points: 1987,
      level: 6,
      badge: "Meal Prep Pro",
      streak: 21,
      contributions: 76,
      reviewsHelped: 54,
    },
    {
      id: "5",
      name: "Emma Davis",
      avatar: "👩‍⚕️",
      points: 1876,
      level: 6,
      badge: "Wellness Guide",
      streak: 19,
      contributions: 65,
      reviewsHelped: 43,
    },
  ]

  const activeChallenges: Challenge[] = [
    {
      id: "1",
      title: "30 Days of Healthy Eating",
      description: "Commit to making healthier food choices for 30 consecutive days",
      participants: 1234,
      duration: "30 days",
      reward: "500 XP + Healthy Eater Badge",
      difficulty: "Medium",
      category: "Nutrition",
      progress: 67,
    },
    {
      id: "2",
      title: "Plant-Based Week",
      description: "Try plant-based meals for 7 days and share your experience",
      participants: 567,
      duration: "7 days",
      reward: "200 XP + Plant Pioneer Badge",
      difficulty: "Easy",
      category: "Diet",
      progress: 23,
    },
    {
      id: "3",
      title: "Sugar-Free Challenge",
      description: "Eliminate added sugars from your diet for 14 days",
      participants: 890,
      duration: "14 days",
      reward: "350 XP + Sugar Warrior Badge",
      difficulty: "Hard",
      category: "Health",
      progress: 45,
    },
  ]

  const upcomingEvents: Event[] = [
    {
      id: "1",
      title: "Nutrition Q&A with Dr. Smith",
      description: "Ask questions about nutrition and get expert answers",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "qa",
      attendees: 234,
      host: "Dr. Sarah Smith",
    },
    {
      id: "2",
      title: "Meal Prep Workshop",
      description: "Learn efficient meal preparation techniques",
      date: "Friday",
      time: "6:00 PM",
      type: "workshop",
      attendees: 156,
      host: "Chef Mike Johnson",
    },
    {
      id: "3",
      title: "Healthy Cooking Webinar",
      description: "Discover new healthy cooking methods and recipes",
      date: "Sunday",
      time: "11:00 AM",
      type: "webinar",
      attendees: 345,
      host: "Lisa Chen",
    },
  ]

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        avatar: "👩‍🦰",
        level: 8,
        badge: "Nutrition Expert",
        verified: true,
      },
      content:
        "Just discovered this amazing quinoa bowl recipe! Perfect balance of protein and nutrients. Who else loves experimenting with ancient grains? 🌾",
      type: "recipe",
      timestamp: "2 hours ago",
      likes: 45,
      comments: 12,
      shares: 8,
      tags: ["quinoa", "healthy", "protein"],
      trending: true,
      pinned: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      author: {
        name: "Mike Johnson",
        avatar: "👨‍💼",
        level: 7,
        badge: "Recipe Master",
        verified: false,
      },
      content:
        "Day 15 of my sugar-free journey! The cravings are finally subsiding. For anyone struggling, remember that your taste buds adapt. Keep going! 💪",
      type: "story",
      timestamp: "4 hours ago",
      likes: 67,
      comments: 23,
      shares: 15,
      tags: ["sugarfree", "motivation", "health"],
      trending: false,
      pinned: true,
    },
    {
      id: "3",
      author: {
        name: "Lisa Wang",
        avatar: "👩‍🎓",
        level: 7,
        badge: "Health Champion",
        verified: true,
      },
      content:
        "Poll: What's your biggest challenge with meal planning? A) Time constraints B) Recipe ideas C) Budget D) Family preferences",
      type: "poll",
      timestamp: "6 hours ago",
      likes: 34,
      comments: 45,
      shares: 6,
      tags: ["mealplanning", "poll", "community"],
      trending: true,
      pinned: false,
    },
  ])

  const [suggestedFriends, setSuggestedFriends] = useState<SuggestedFriend[]>([
    {
      id: "1",
      name: "Alex Rodriguez",
      avatar: "👨‍⚕️",
      level: 6,
      badge: "Fitness Guru",
      mutualFriends: 5,
      isConnected: false,
      bio: "Passionate about healthy living and fitness. Love sharing workout tips!",
    },
    {
      id: "2",
      name: "Maria Santos",
      avatar: "👩‍🍳",
      level: 7,
      badge: "Vegan Chef",
      mutualFriends: 3,
      isConnected: false,
      bio: "Plant-based cooking enthusiast. Always experimenting with new recipes.",
    },
    {
      id: "3",
      name: "James Wilson",
      avatar: "👨‍💻",
      level: 5,
      badge: "Meal Planner",
      mutualFriends: 8,
      isConnected: false,
      bio: "Tech professional who loves efficient meal prep and nutrition tracking.",
    },
    {
      id: "4",
      name: "Sophie Turner",
      avatar: "👩‍🎓",
      level: 8,
      badge: "Nutritionist",
      mutualFriends: 12,
      isConnected: false,
      bio: "Certified nutritionist helping people achieve their health goals.",
    },
    {
      id: "5",
      name: "Carlos Martinez",
      avatar: "👨‍🏫",
      level: 6,
      badge: "Wellness Coach",
      mutualFriends: 7,
      isConnected: false,
      bio: "Holistic wellness coach focusing on sustainable lifestyle changes.",
    },
  ])

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode === "true") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const newPost: CommunityPost = {
        id: (communityPosts.length + 1).toString(),
        author: {
          name: "You",
          avatar: "👤",
          level: 5,
          badge: "Health Enthusiast",
          verified: false,
        },
        content: newPostContent,
        type: "discussion",
        timestamp: "now",
        likes: 0,
        comments: 0,
        shares: 0,
        tags: [],
        trending: false,
        pinned: false,
      }
      setCommunityPosts([newPost, ...communityPosts])
      setNewPostContent("")
      setShowCreatePost(false)
    }
  }

  const handleSendChatMessage = () => {
    if (newChatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: "You",
        message: newChatMessage,
        time: "now",
        avatar: "👤",
      }
      setChatMessages([...chatMessages, newMessage])
      setNewChatMessage("")
    }
  }

  const handleConnectFriend = (friendId: string) => {
    setSuggestedFriends((prev) =>
      prev.map((friend) => (friend.id === friendId ? { ...friend, isConnected: true } : friend)),
    )
  }

  const filteredFriends = suggestedFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
      friend.badge.toLowerCase().includes(friendSearchQuery.toLowerCase()),
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100 dark:bg-green-900/30"
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
      case "Hard":
        return "text-red-600 bg-red-100 dark:bg-red-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "webinar":
        return <Globe className="w-4 h-4" />
      case "challenge":
        return <Trophy className="w-4 h-4" />
      case "qa":
        return <HelpCircle className="w-4 h-4" />
      case "workshop":
        return <BookOpen className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const tabs = [
    { id: "feed", label: "Feed", icon: MessageSquare },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "leaderboard", label: "Leaderboard", icon: Crown },
    { id: "events", label: "Events", icon: Calendar },
    { id: "recipes", label: "Recipes", icon: ChefHat },
  ]

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
        <div className="w-full px-3 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Link
                href="/home"
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-lime-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base font-bold foodsnap-text-gradient truncate">Community</h1>
                  <p className="text-xs text-gray-500 truncate hidden sm:block">
                    {communityStats.totalMembers.toLocaleString()} members
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              {/* Chat Button - Always visible */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLiveChat(true)}
                className="w-8 h-8 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700 relative"
              >
                <MessageCircle className="w-4 h-4" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(true)}
                className="md:hidden w-8 h-8 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-4 h-4" />
              </Button>

              {/* Desktop Actions - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700"
                >
                  <Bell className="w-5 h-5" />
                </Button>

                {/* Find Friends */}
                <Button
                  variant="outline"
                  onClick={() => setShowFindFriends(true)}
                  className="flex items-center space-x-2 text-sm border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-gray-600 dark:hover:bg-gray-700 px-3 py-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Find Friends</span>
                </Button>
              </div>

              {/* Create Post Button */}
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white font-semibold px-3 py-1.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-xs min-w-[60px]"
              >
                <Plus className="w-3 h-3 mr-1" />
                <span>Post</span>
              </Button>
            </div>
          </div>

          {/* Mobile Stats Bar - Only visible on mobile, simplified for small screens */}
          <div className="md:hidden mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="hidden xs:inline">{communityStats.activeToday.toLocaleString()}</span>
                <span className="xs:hidden">{(communityStats.activeToday / 1000).toFixed(1)}k</span>
                <span className="hidden xs:inline">active</span>
              </div>
              <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3 text-blue-500" />
                <span>{communityStats.postsToday}</span>
                <span className="hidden xs:inline">posts</span>
              </div>
              <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-3 h-3 text-yellow-500" />
                <span>{(communityStats.challengesCompleted / 1000).toFixed(1)}k</span>
                <span className="hidden xs:inline">done</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6"
        >
          {[
            { label: "Active Today", value: communityStats.activeToday, icon: Activity, color: "text-green-500" },
            { label: "Posts Today", value: communityStats.postsToday, icon: MessageSquare, color: "text-blue-500" },
            { label: "Recipes Shared", value: communityStats.recipesShared, icon: ChefHat, color: "text-orange-500" },
            {
              label: "Challenges Done",
              value: communityStats.challengesCompleted,
              icon: Trophy,
              color: "text-yellow-500",
            },
            { label: "Total Members", value: communityStats.totalMembers, icon: Users, color: "text-purple-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="col-span-1"
            >
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <CardContent className="p-2 sm:p-3 lg:p-4 text-center">
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mx-auto mb-1 sm:mb-2 ${stat.color}`} />
                  <p className="text-sm sm:text-lg lg:text-2xl font-bold">
                    {stat.value > 999 ? `${(stat.value / 1000).toFixed(1)}k` : stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-md font-medium transition-all duration-300 whitespace-nowrap text-xs sm:text-sm ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-lime-500 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="xs-inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "feed" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Search and Filter */}
                <Card
                  className={`shadow-lg border-0 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search discussions, recipes, stories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 text-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                          className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                        >
                          <option value="all">All Posts</option>
                          <option value="discussion">Discussions</option>
                          <option value="recipe">Recipes</option>
                          <option value="story">Stories</option>
                          <option value="poll">Polls</option>
                        </select>
                        <Button variant="outline" size="icon" className="sm:hidden bg-transparent">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Posts */}
                <div className="space-y-3 sm:space-y-4">
                  {communityPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`shadow-lg border-0 transition-colors duration-300 hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                      >
                        <CardContent className="p-3 sm:p-4 lg:p-6">
                          {/* Post Header */}
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                              <div className="text-lg sm:text-2xl flex-shrink-0">{post.author.avatar}</div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                                  <h3 className="font-semibold text-sm sm:text-base truncate">{post.author.name}</h3>
                                  {post.author.verified && (
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                                  <span
                                    className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-lime-100 dark:from-orange-900/30 dark:to-lime-900/30 text-orange-700 dark:text-orange-300`}
                                  >
                                    {post.author.badge}
                                  </span>
                                  <span className="hidden sm:inline">Level {post.author.level}</span>
                                  <span className="hidden sm:inline">•</span>
                                  <span>{post.timestamp}</span>
                                  {post.trending && (
                                    <>
                                      <span className="hidden sm:inline">•</span>
                                      <div className="flex items-center space-x-1 text-orange-500">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="text-xs">Trending</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                              {post.pinned && <Pin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />}
                              <Button variant="ghost" size="sm" className="w-6 h-6 sm:w-8 sm:h-8">
                                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="mb-3 sm:mb-4">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base">
                              {post.content}
                            </p>
                            {post.image && (
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt="Post image"
                                className="mt-3 rounded-lg w-full max-w-md object-cover"
                              />
                            )}
                          </div>

                          {/* Post Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer transition-colors"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-4 sm:space-x-6">
                              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">{post.comments}</span>
                              </button>
                              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm hidden sm:inline">{post.shares}</span>
                              </button>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">{Math.floor(Math.random() * 500) + 100}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "challenges" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {activeChallenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`shadow-lg border-0 transition-colors duration-300 hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-lime-500 rounded-lg flex items-center justify-center">
                                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-base sm:text-lg leading-tight">{challenge.title}</h3>
                                <span
                                  className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
                                >
                                  {challenge.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                            {challenge.description}
                          </p>

                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{challenge.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-lime-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${challenge.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-gray-500">Participants</p>
                              <p className="font-semibold">{challenge.participants.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Duration</p>
                              <p className="font-semibold">{challenge.duration}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-500 text-sm">Reward</p>
                            <p className="font-semibold text-orange-600 text-sm">{challenge.reward}</p>
                          </div>

                          <Button className="w-full bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white text-sm sm:text-base">
                            Join Challenge
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "leaderboard" && (
              <Card
                className={`shadow-lg border-0 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <span>Community Leaderboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="space-y-2 sm:space-y-4">
                    {leaderboard.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          index < 3
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                    ? "bg-orange-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="text-base sm:text-2xl">{user.avatar}</div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                            <span className="font-medium text-sm sm:text-base truncate">{user.name}</span>
                            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gradient-to-r from-orange-100 to-lime-100 dark:from-orange-900/30 dark:to-lime-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium flex-shrink-0 hidden sm:inline-block">
                              {user.badge}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs text-gray-500">
                            <span>Lv.{user.level}</span>
                            <span className="flex items-center space-x-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span>{user.streak}d</span>
                            </span>
                            <span className="hidden sm:block">{user.contributions} posts</span>
                            <span className="hidden sm:block">{user.reviewsHelped} reviews</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm sm:text-lg">
                            {user.points > 999 ? `${(user.points / 1000).toFixed(1)}k` : user.points.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">XP</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "events" && (
              <div className="space-y-3 sm:space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`shadow-lg border-0 transition-colors duration-300 hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-base sm:text-lg leading-tight">{event.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                                  {event.description}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 text-xs sm:text-sm bg-transparent"
                              >
                                Join Event
                              </Button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{event.attendees} attending</span>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Hosted by {event.host}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "recipes" && (
              <div className="text-center py-8 sm:py-12">
                <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Recipe Sharing Coming Soon!</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  We're working on an amazing recipe sharing feature. Stay tuned!
                </p>
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Trending Topics */}
            <Card
              className={`shadow-lg border-0 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span>Trending Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={topic.tag}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="font-medium">#{topic.tag}</p>
                        <p className="text-sm text-gray-500">{topic.posts} posts</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">{topic.growth}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card
              className={`shadow-lg border-0 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Share Recipe", icon: ChefHat, color: "from-orange-500 to-red-500" },
                    { label: "Start Discussion", icon: MessageSquare, color: "from-blue-500 to-purple-500" },
                    { label: "Create Poll", icon: BarChart3, color: "from-green-500 to-teal-500" },
                    { label: "Share Story", icon: BookOpen, color: "from-purple-500 to-pink-500" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className={`w-full p-3 rounded-lg bg-gradient-to-r ${action.color} text-white font-medium hover:scale-105 transition-transform duration-200 flex items-center space-x-2`}
                    >
                      <action.icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Find Friends */}
            <Card
              className={`shadow-lg border-0 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <UserPlus className="w-5 h-5 text-purple-500" />
                  <span>Connect & Grow</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect with like-minded health enthusiasts and expand your nutrition network.
                  </p>
                  <Button
                    onClick={() => setShowFindFriends(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Friends
                  </Button>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs text-gray-500">
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">1,234</p>
                      <p>Active Users</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">567</p>
                      <p>New Today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card
              className={`shadow-lg border-0 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Community Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Be respectful and kind to all members</p>
                  <p>• Share accurate nutrition information</p>
                  <p>• No spam or promotional content</p>
                  <p>• Keep discussions food and health related</p>
                  <p>• Report inappropriate content</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  Read Full Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto"
            >
              <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-orange-500 to-lime-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Community Hub</h3>
                      <p className="text-xs text-white/80">{communityStats.totalMembers.toLocaleString()} members</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Quick Actions</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        setShowSidebar(false)
                        setShowFindFriends(true)
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-sm h-12 flex flex-col space-y-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Find Friends</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 flex flex-col space-y-1 text-sm border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-gray-600 dark:hover:bg-gray-700 bg-transparent"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </Button>
                  </div>
                </div>

                {/* Create Content */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Create Content</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Recipe", icon: ChefHat, color: "from-orange-500 to-red-500" },
                      { label: "Discussion", icon: MessageSquare, color: "from-blue-500 to-purple-500" },
                      { label: "Poll", icon: BarChart3, color: "from-green-500 to-teal-500" },
                      { label: "Story", icon: BookOpen, color: "from-purple-500 to-pink-500" },
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => {
                          setShowSidebar(false)
                          setShowCreatePost(true)
                        }}
                        className={`p-3 rounded-lg bg-gradient-to-r ${action.color} text-white font-medium hover:scale-105 transition-transform duration-200 flex flex-col items-center space-y-1 text-xs`}
                      >
                        <action.icon className="w-4 h-4" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Topics */}
                <Card className={`shadow-lg border-0 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold">Trending Topics</span>
                    </div>
                    <div className="space-y-2">
                      {trendingTopics.slice(0, 4).map((topic) => (
                        <div
                          key={topic.tag}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm">#{topic.tag}</p>
                            <p className="text-xs text-gray-500">{topic.posts} posts</p>
                          </div>
                          <span className="text-green-600 text-xs font-medium">{topic.growth}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Stats */}
                <Card className={`shadow-lg border-0 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Community Stats</h4>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-orange-600">
                          {(communityStats.recipesShared / 1000).toFixed(1)}k
                        </p>
                        <p className="text-xs text-gray-500">Recipes Shared</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          {communityStats.activeToday.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Active Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Find Friends Modal */}
      <AnimatePresence>
        {showFindFriends && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowFindFriends(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Find Friends</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Connect with health enthusiasts like you</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowFindFriends(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or expertise..."
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Suggested Friends */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Suggested for You</h4>
                <div className="grid grid-cols-1 gap-4">
                  {filteredFriends.map((friend) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border transition-colors ${
                        isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{friend.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-semibold text-base">{friend.name}</h5>
                            <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-lime-100 dark:from-orange-900/30 dark:to-lime-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                              {friend.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{friend.bio}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Level {friend.level}</span>
                            <span>{friend.mutualFriends} mutual friends</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {friend.isConnected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                              disabled
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Connected
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleConnectFriend(friend.id)}
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredFriends.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-semibold mb-2">No friends found</h4>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Post</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreatePost(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">👤</div>
                  <div>
                    <p className="font-medium">You</p>
                    <p className="text-sm text-gray-500">Level 5 • Health Enthusiast</p>
                  </div>
                </div>

                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts, recipes, or health journey..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Create Poll
                  </Button>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setShowCreatePost(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Chat Modal */}
      <AnimatePresence>
        {showLiveChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowLiveChat(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md h-96 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold">Live Community Chat</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowLiveChat(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-2">
                    <div className="text-lg">{message.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{message.user}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendChatMessage()}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSendChatMessage}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600"
                  >
                    <Send className="w-4 h-4" />
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
