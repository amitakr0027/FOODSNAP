"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Users,
  Heart,
  Shield,
  CheckCircle,
  XCircle,
  Flag,
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Ban,
  Target,
  TrendingUp,
  Calendar,
  Send,
  X,
  Info,
  Lightbulb,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Guideline {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  importance: "high" | "medium" | "low"
  examples: {
    good: string[]
    bad: string[]
  }
}

interface CommunityStats {
  totalMembers: number
  activeToday: number
  postsToday: number
  moderationActions: number
  satisfactionRate: number
}

interface ReportForm {
  type: string
  description: string
  url: string
  priority: string
}

export default function CommunityGuidelinesPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [expandedGuideline, setExpandedGuideline] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportForm, setReportForm] = useState<ReportForm>({
    type: "",
    description: "",
    url: "",
    priority: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const lastUpdated = "January 15, 2024"

  const communityStats: CommunityStats = {
    totalMembers: 125000,
    activeToday: 8500,
    postsToday: 2400,
    moderationActions: 12,
    satisfactionRate: 96,
  }

  const guidelines: Guideline[] = [
    {
      id: "respect",
      title: "Be Respectful and Kind",
      description:
        "Treat all community members with respect, kindness, and empathy. We're all here to learn and grow together.",
      icon: Heart,
      importance: "high",
      examples: {
        good: [
          "Thanks for sharing your experience! That's really helpful.",
          "I respectfully disagree, but I understand your perspective.",
          "Great question! Here's what worked for me...",
        ],
        bad: [
          "That's a stupid question, just Google it.",
          "You're wrong and clearly don't know what you're talking about.",
          "Why would anyone eat that garbage?",
        ],
      },
    },
    {
      id: "helpful",
      title: "Share Helpful and Accurate Information",
      description: "Provide accurate, helpful information and cite sources when sharing health or nutrition advice.",
      icon: Lightbulb,
      importance: "high",
      examples: {
        good: [
          "According to the FDA, this ingredient is generally recognized as safe.",
          "I found this product at Target for $3.99 last week.",
          "Here's a link to the study I mentioned: [source]",
        ],
        bad: [
          "This product will cure your diabetes (without any evidence).",
          "All processed foods are poison and will kill you.",
          "I heard from someone that this causes cancer.",
        ],
      },
    },
    {
      id: "privacy",
      title: "Respect Privacy and Personal Information",
      description: "Don't share personal information about yourself or others. Keep private conversations private.",
      icon: Lock,
      importance: "high",
      examples: {
        good: [
          "I prefer not to share my specific location, but I'm in the Northeast US.",
          "You can message me privately if you want more details.",
          "I'd rather not discuss my medical history publicly.",
        ],
        bad: [
          "Here's my phone number: 555-123-4567, call me!",
          "John Smith from 123 Main Street posted this...",
          "My doctor said I have [specific medical condition].",
        ],
      },
    },
    {
      id: "spam",
      title: "No Spam or Self-Promotion",
      description: "Don't post spam, excessive self-promotion, or unrelated content. Focus on community value.",
      icon: Ban,
      importance: "medium",
      examples: {
        good: [
          "I found this article helpful for understanding nutrition labels.",
          "Has anyone tried the new organic section at Whole Foods?",
          "Here's a recipe I love that uses this ingredient.",
        ],
        bad: [
          "Buy my amazing weight loss supplements! Link in bio!",
          "Check out my blog/YouTube channel (repeated posts).",
          "Join my MLM business opportunity!",
        ],
      },
    },
    {
      id: "content",
      title: "Keep Content Appropriate and On-Topic",
      description: "Share content related to food, nutrition, and health. Keep it family-friendly and appropriate.",
      icon: Eye,
      importance: "medium",
      examples: {
        good: [
          "This product has great nutritional value for the price.",
          "I love how this app helps me track my daily nutrition.",
          "Anyone have recommendations for gluten-free alternatives?",
        ],
        bad: [
          "Check out this political meme (off-topic).",
          "Graphic images of food poisoning symptoms.",
          "Inappropriate jokes or offensive content.",
        ],
      },
    },
    {
      id: "constructive",
      title: "Provide Constructive Feedback",
      description: "When giving feedback or criticism, be constructive and helpful rather than just negative.",
      icon: Target,
      importance: "medium",
      examples: {
        good: [
          "The photo is a bit blurry - try getting closer to the barcode.",
          "This product might not be the best choice because of the high sodium content.",
          "Have you considered trying the organic version instead?",
        ],
        bad: [
          "Your photo sucks, take a better one.",
          "This product is trash, don't buy it.",
          "You're doing everything wrong.",
        ],
      },
    },
    {
      id: "reporting",
      title: "Report Inappropriate Content",
      description: "Help keep our community safe by reporting content that violates these guidelines.",
      icon: Flag,
      importance: "low",
      examples: {
        good: [
          "Reporting spam or promotional content.",
          "Flagging harassment or bullying behavior.",
          "Reporting misinformation about health claims.",
        ],
        bad: [
          "Reporting content just because you disagree with it.",
          "False reporting to get someone in trouble.",
          "Reporting every minor issue instead of addressing it directly.",
        ],
      },
    },
  ]

  const reportTypes = [
    { value: "spam", label: "Spam or Self-Promotion" },
    { value: "harassment", label: "Harassment or Bullying" },
    { value: "misinformation", label: "False or Misleading Information" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "privacy", label: "Privacy Violation" },
    { value: "other", label: "Other" },
  ]

  const quickActions = [
    {
      title: "Report Content",
      description: "Report inappropriate posts or behavior",
      icon: Flag,
      action: () => setShowReportModal(true),
      color: "from-red-500 to-red-600",
    },
    {
      title: "Community Stats",
      description: "View community health metrics",
      icon: TrendingUp,
      action: () => {},
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Moderation Log",
      description: "See recent moderation actions",
      icon: Shield,
      action: () => {},
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Help Center",
      description: "Get help with community features",
      icon: MessageCircle,
      action: () => {},
      color: "from-green-500 to-green-600",
    },
  ]

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)

    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setReportForm({ type: "", description: "", url: "", priority: "medium" })

    setTimeout(() => {
      setSubmitSuccess(false)
      setShowReportModal(false)
    }, 3000)
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "from-red-500 to-red-600"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "low":
        return "from-green-500 to-green-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case "high":
        return "Critical"
      case "medium":
        return "Important"
      case "low":
        return "Helpful"
      default:
        return "Standard"
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/help"
            className={`flex items-center transition-colors ${
              darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-600"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-lime-600 bg-clip-text text-transparent">
            Community Guidelines
          </h1>

          <Button
            onClick={() => setShowReportModal(true)}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2"
          >
            <Flag className="w-4 h-4" />
            <span>Report</span>
          </Button>
        </motion.header>

        {/* Community Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">FoodSnap Community Guidelines</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Updated: {lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{communityStats.totalMembers.toLocaleString()} members</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{communityStats.satisfactionRate}% Satisfaction</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Active Today",
                value: communityStats.activeToday.toLocaleString(),
                icon: Users,
                color: "text-blue-500",
              },
              {
                label: "Posts Today",
                value: communityStats.postsToday.toLocaleString(),
                icon: MessageCircle,
                color: "text-green-500",
              },
              {
                label: "Moderation",
                value: communityStats.moderationActions.toString(),
                icon: Shield,
                color: "text-purple-500",
              },
              {
                label: "Satisfaction",
                value: `${communityStats.satisfactionRate}%`,
                icon: Star,
                color: "text-yellow-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-gray-800/50" : "bg-white/70"
                } backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <div className="text-lg font-bold text-center">{stat.value}</div>
                <div className={`text-xs text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome to Our Community!</h3>
                <p className={`text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  FoodSnap is built on the foundation of helping each other make better food choices. These guidelines
                  help us maintain a positive, helpful, and safe environment for everyone.
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${darkMode ? "bg-blue-900/20" : "bg-blue-50"} border border-blue-200 dark:border-blue-800`}
              >
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Our Community Principles:</p>
                    <ul className="space-y-1">
                      <li>• Be kind, respectful, and supportive</li>
                      <li>• Share accurate and helpful information</li>
                      <li>• Respect privacy and personal boundaries</li>
                      <li>• Keep content appropriate and on-topic</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Community Guidelines</h3>
          <div className="space-y-6">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={guideline.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`shadow-lg border-0 transition-all duration-300 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } ${guideline.importance === "high" ? "ring-2 ring-red-500/20" : ""}`}
                >
                  <CardHeader>
                    <CardTitle
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedGuideline(expandedGuideline === guideline.id ? null : guideline.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${getImportanceColor(guideline.importance)}`}
                        >
                          <guideline.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{guideline.title}</h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                guideline.importance === "high"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  : guideline.importance === "medium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              }`}
                            >
                              {getImportanceText(guideline.importance)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {expandedGuideline === guideline.id ? (
                          <Eye className="w-5 h-5 text-gray-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className={`text-sm sm:text-base mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {guideline.description}
                    </p>

                    <AnimatePresence>
                      {expandedGuideline === guideline.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {/* Good Examples */}
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                              <div className="flex items-center space-x-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <h5 className="font-semibold text-green-800 dark:text-green-200">Good Examples</h5>
                              </div>
                              <ul className="space-y-2">
                                {guideline.examples.good.map((example, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-green-700 dark:text-green-300 flex items-start space-x-2"
                                  >
                                    <ThumbsUp className="w-3 h-3 mt-1 flex-shrink-0" />
                                    <span>"{example}"</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Bad Examples */}
                            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                              <div className="flex items-center space-x-2 mb-3">
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <h5 className="font-semibold text-red-800 dark:text-red-200">Avoid These</h5>
                              </div>
                              <ul className="space-y-2">
                                {guideline.examples.bad.map((example, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-red-700 dark:text-red-300 flex items-start space-x-2"
                                  >
                                    <ThumbsDown className="w-3 h-3 mt-1 flex-shrink-0" />
                                    <span>"{example}"</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full shadow-md border-0 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
                    darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={action.action}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{action.title}</h4>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enforcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="w-5 h-5 mr-2 text-red-500" />
                Guideline Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">What Happens When Guidelines Are Violated?</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Warning</p>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          First violation receives a friendly reminder
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Temporary Restriction</p>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Limited posting ability for 24-48 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Account Suspension</p>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Serious or repeated violations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">How to Report Violations</h4>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowReportModal(true)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report Content
                    </Button>
                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <p className="mb-2">You can report:</p>
                      <ul className="space-y-1">
                        <li>• Harassment or bullying</li>
                        <li>• Spam or self-promotion</li>
                        <li>• Misinformation</li>
                        <li>• Inappropriate content</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`text-center pt-8 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <p>© 2024 FoodSnap Community. All rights reserved.</p>
              <p className="text-xs mt-1">Last updated: {lastUpdated}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help">
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
              </Link>
              <Button onClick={() => setShowReportModal(true)} variant="outline" size="sm" className="sm:hidden">
                <Flag className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Report Content</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowReportModal(false)} className="p-1">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Report Submitted!</h4>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Thank you for helping keep our community safe. We'll review this report within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReportSubmit} className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Report Type *
                      </label>
                      <select
                        required
                        value={reportForm.type}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, type: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-orange-500 ${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="">Select a reason...</option>
                        {reportTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Content URL (optional)
                      </label>
                      <Input
                        type="url"
                        value={reportForm.url}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, url: e.target.value }))}
                        className={`${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Link to the content you're reporting"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Priority
                      </label>
                      <select
                        value={reportForm.priority}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, priority: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-orange-500 ${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="low">Low - Minor issue</option>
                        <option value="medium">Medium - Needs attention</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - Immediate action needed</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={reportForm.description}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, description: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-orange-500 resize-none ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        placeholder="Please provide details about what you're reporting..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReportModal(false)}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Report
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
