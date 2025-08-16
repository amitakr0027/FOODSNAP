"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  Upload,
  X,
  Lightbulb,
  TrendingUp,
  Users,
  Heart,
  Zap,
  ImageIcon,
  Paperclip,
  ThumbsUp,
  Eye,
  Clock,
  Search,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface FeedbackForm {
  category: string
  rating: number
  title: string
  description: string
  email: string
  priority: string
  attachments: File[]
}

interface PopularSuggestion {
  id: string
  title: string
  description: string
  votes: number
  category: string
  status: "new" | "under-review" | "planned" | "in-progress" | "completed"
  author: string
  date: string
}

interface FeedbackStats {
  totalSubmissions: number
  avgRating: number
  responseRate: number
  implementedSuggestions: number
}

export default function FeedbackPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    category: "",
    rating: 0,
    title: "",
    description: "",
    email: "",
    priority: "medium",
    attachments: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestionForm, setShowSuggestionForm] = useState(false)

  const feedbackCategories = [
    { value: "bug", label: "Bug Report", icon: "🐛", color: "from-red-500 to-red-600" },
    { value: "feature", label: "Feature Request", icon: "💡", color: "from-blue-500 to-blue-600" },
    { value: "improvement", label: "Improvement", icon: "⚡", color: "from-yellow-500 to-orange-500" },
    { value: "ui", label: "UI/UX Feedback", icon: "🎨", color: "from-purple-500 to-purple-600" },
    { value: "performance", label: "Performance", icon: "🚀", color: "from-green-500 to-green-600" },
    { value: "other", label: "Other", icon: "💬", color: "from-gray-500 to-gray-600" },
  ]

  const feedbackStats: FeedbackStats = {
    totalSubmissions: 2847,
    avgRating: 4.6,
    responseRate: 94,
    implementedSuggestions: 127,
  }

  const popularSuggestions: PopularSuggestion[] = [
    {
      id: "1",
      title: "Dark mode for the entire app",
      description: "Add a system-wide dark mode option that works across all screens",
      votes: 234,
      category: "ui",
      status: "in-progress",
      author: "Sarah M.",
      date: "2024-01-10",
    },
    {
      id: "2",
      title: "Barcode scanning improvements",
      description: "Better recognition for damaged or partially visible barcodes",
      votes: 189,
      category: "feature",
      status: "planned",
      author: "Mike R.",
      date: "2024-01-08",
    },
    {
      id: "3",
      title: "Offline mode support",
      description: "Allow basic functionality when internet connection is unavailable",
      votes: 156,
      category: "feature",
      status: "under-review",
      author: "Alex K.",
      date: "2024-01-05",
    },
    {
      id: "4",
      title: "Export scan history to CSV",
      description: "Add option to export all scan history data to a CSV file",
      votes: 143,
      category: "feature",
      status: "completed",
      author: "Emma L.",
      date: "2023-12-28",
    },
    {
      id: "5",
      title: "Faster app startup time",
      description: "Reduce the time it takes for the app to load on older devices",
      votes: 128,
      category: "performance",
      status: "completed",
      author: "David P.",
      date: "2023-12-20",
    },
    {
      id: "6",
      title: "Voice notes for products",
      description: "Add ability to record voice notes when scanning products",
      votes: 97,
      category: "feature",
      status: "new",
      author: "Lisa T.",
      date: "2024-01-12",
    },
  ]

  const smartCategories = [
    { id: "most-requested", label: "Most Requested", icon: TrendingUp },
    { id: "quick-wins", label: "Quick Wins", icon: Zap },
    { id: "user-experience", label: "User Experience", icon: Heart },
    { id: "technical", label: "Technical", icon: ImageIcon },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFeedbackForm({
      category: "",
      rating: 0,
      title: "",
      description: "",
      email: "",
      priority: "medium",
      attachments: [],
    })

    setTimeout(() => {
      setSubmitSuccess(false)
    }, 5000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFeedbackForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files].slice(0, 5), // Max 5 files
    }))
  }

  const removeAttachment = (index: number) => {
    setFeedbackForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleVote = (suggestionId: string) => {
    // In a real app, this would update the vote count
    console.log(`Voted for suggestion ${suggestionId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "under-review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "planned":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "in-progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
    }
  }

  const filteredSuggestions = popularSuggestions.filter((suggestion) => {
    const matchesSearch =
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || suggestion.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            Feedback & Suggestions
          </h1>

          <Button
            onClick={() => setShowSuggestionForm(!showSuggestionForm)}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Suggest</span>
          </Button>
        </motion.header>

        {/* Feedback Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Total Feedback",
                value: feedbackStats.totalSubmissions.toLocaleString(),
                icon: MessageSquare,
                color: "text-blue-500",
              },
              { label: "Avg Rating", value: `${feedbackStats.avgRating}/5`, icon: Star, color: "text-yellow-500" },
              { label: "Response Rate", value: `${feedbackStats.responseRate}%`, icon: Eye, color: "text-green-500" },
              {
                label: "Implemented",
                value: feedbackStats.implementedSuggestions.toString(),
                icon: CheckCircle,
                color: "text-purple-500",
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

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                Share Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Your feedback has been submitted successfully. We'll review it and get back to you within 48 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Feedback Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {feedbackCategories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFeedbackForm((prev) => ({ ...prev, category: category.value }))}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                            feedbackForm.category === category.value
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                              : darkMode
                                ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Overall Rating *
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackForm((prev) => ({ ...prev, rating }))}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform duration-200 hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= (hoveredRating || feedbackForm.rating)
                                ? "text-yellow-400 fill-current"
                                : darkMode
                                  ? "text-gray-600"
                                  : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className={`ml-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {feedbackForm.rating > 0 && (
                          <>
                            {feedbackForm.rating}/5 -{" "}
                            {feedbackForm.rating === 5
                              ? "Excellent!"
                              : feedbackForm.rating === 4
                                ? "Good"
                                : feedbackForm.rating === 3
                                  ? "Average"
                                  : feedbackForm.rating === 2
                                    ? "Poor"
                                    : "Very Poor"}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Title *
                    </label>
                    <Input
                      type="text"
                      required
                      value={feedbackForm.title}
                      onChange={(e) => setFeedbackForm((prev) => ({ ...prev, title: e.target.value }))}
                      className={`${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Brief summary of your feedback"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackForm.description}
                      onChange={(e) => setFeedbackForm((prev) => ({ ...prev, description: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-orange-500 resize-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="Please provide detailed feedback..."
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Email (optional)
                    </label>
                    <Input
                      type="email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm((prev) => ({ ...prev, email: e.target.value }))}
                      className={`${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="your.email@example.com"
                    />
                    <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      We'll only use this to follow up on your feedback
                    </p>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Priority
                    </label>
                    <select
                      value={feedbackForm.priority}
                      onChange={(e) => setFeedbackForm((prev) => ({ ...prev, priority: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-orange-500 ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="low">Low - General feedback</option>
                      <option value="medium">Medium - Improvement suggestion</option>
                      <option value="high">High - Important issue</option>
                      <option value="critical">Critical - Blocking issue</option>
                    </select>
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Attachments (optional)
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className={`flex items-center space-x-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            darkMode
                              ? "border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300"
                              : "border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700"
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Upload files</span>
                        </label>
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Max 5 files, 10MB each
                        </span>
                      </div>

                      {feedbackForm.attachments.length > 0 && (
                        <div className="space-y-2">
                          {feedbackForm.attachments.map((file, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2 rounded border ${
                                darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Paperclip className="w-4 h-4" />
                                <span className="text-sm">{file.name}</span>
                                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                                className="p-1 h-auto"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                      disabled={
                        isSubmitting ||
                        !feedbackForm.category ||
                        !feedbackForm.rating ||
                        !feedbackForm.title ||
                        !feedbackForm.description
                      }
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Popular Suggestions
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <Input
                      type="text"
                      placeholder="Search suggestions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-10 w-48 ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  onClick={() => setSelectedCategory("all")}
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                      : ""
                  }`}
                >
                  All
                </Button>
                {feedbackCategories.map((category) => (
                  <Button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    className={`text-xs ${
                      selectedCategory === category.value
                        ? "bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                        : ""
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Suggestions List */}
              <div className="space-y-4">
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      darkMode
                        ? "border-gray-700 bg-gray-750 hover:bg-gray-700"
                        : "border-gray-200 bg-gray-50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-sm sm:text-base">{suggestion.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(suggestion.status)}`}>
                            {suggestion.status.replace("-", " ")}
                          </span>
                        </div>
                        <p className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {suggestion.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{suggestion.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(suggestion.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          onClick={() => handleVote(suggestion.id)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1 px-3 py-1"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span className="text-xs">{suggestion.votes}</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredSuggestions.length === 0 && (
                <div className="text-center py-8">
                  <Lightbulb className={`w-12 h-12 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                  <h4 className="text-lg font-medium mb-2">No suggestions found</h4>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-center pt-8 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <p>© 2024 FoodSnap. All rights reserved.</p>
              <p className="text-xs mt-1">Your feedback helps us improve!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowSuggestionForm(!showSuggestionForm)}
                variant="outline"
                size="sm"
                className="sm:hidden"
              >
                <Plus className="w-4 h-4 mr-2" />
                Suggest Feature
              </Button>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
