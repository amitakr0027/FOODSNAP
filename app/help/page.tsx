"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Search,
  BookOpen,
  Camera,
  User,
  Award,
  Shield,
  Settings,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  Mail,
  Clock,
  CheckCircle,
  FileText,
  Eye,
  MessageSquare,
  Zap,
  Globe,
  Star,
  Users,
  AlertCircle,
  ExternalLink,
  Bot,
  Headphones,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
}

interface HelpCategory {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  articles: number
}

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  priority: string
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const helpCategories: HelpCategory[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of using FoodSnap",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      articles: 8,
    },
    {
      id: "scanning",
      title: "Scanning & History",
      description: "How to scan products and view history",
      icon: Camera,
      color: "from-green-500 to-green-600",
      articles: 12,
    },
    {
      id: "profile",
      title: "Profile & Preferences",
      description: "Manage your account and settings",
      icon: User,
      color: "from-purple-500 to-purple-600",
      articles: 10,
    },
    {
      id: "badges",
      title: "Badges & Achievements",
      description: "Understanding rewards and progress",
      icon: Award,
      color: "from-yellow-500 to-orange-500",
      articles: 6,
    },
    {
      id: "privacy",
      title: "Data & Privacy",
      description: "Your data security and privacy controls",
      icon: Shield,
      color: "from-red-500 to-pink-500",
      articles: 7,
    },
    {
      id: "technical",
      title: "Technical Issues",
      description: "Troubleshooting and technical support",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
      articles: 15,
    },
  ]

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I scan a product?",
      answer:
        "To scan a product, tap the Scan button in the bottom navigation, point your camera at the product's barcode, and wait for the app to recognize it. Make sure the barcode is clearly visible and well-lit for best results.",
      category: "scanning",
      helpful: 45,
      notHelpful: 2,
    },
    {
      id: "2",
      question: "How do I reset my password?",
      answer:
        "Go to the login page and tap 'Forgot Password'. Enter your email address and we'll send you a reset link. Check your spam folder if you don't see the email within a few minutes.",
      category: "profile",
      helpful: 32,
      notHelpful: 1,
    },
    {
      id: "3",
      question: "Where can I view my badges?",
      answer:
        "You can view your badges by going to your Profile page and tapping on 'Achievements' or by accessing the Badges page from the main menu. Here you'll see all earned and available badges.",
      category: "badges",
      helpful: 28,
      notHelpful: 0,
    },
    {
      id: "4",
      question: "Why isn't my barcode scanning?",
      answer:
        "Make sure your camera has permission to access the camera, the barcode is clean and well-lit, and you're holding the phone steady. Try cleaning your camera lens and ensuring good lighting conditions.",
      category: "technical",
      helpful: 67,
      notHelpful: 5,
    },
    {
      id: "5",
      question: "How do I change my dietary preferences?",
      answer:
        "Go to your Profile page, tap 'Edit', scroll to the Dietary Preferences section, and select or deselect your preferences. Don't forget to save your changes.",
      category: "profile",
      helpful: 23,
      notHelpful: 1,
    },
    {
      id: "6",
      question: "Is my data secure?",
      answer:
        "Yes, we take data security seriously. All your personal information is encrypted and stored securely. We never share your personal data with third parties without your consent. You can review our privacy policy for more details.",
      category: "privacy",
      helpful: 41,
      notHelpful: 0,
    },
    {
      id: "7",
      question: "How do I earn badges?",
      answer:
        "Badges are earned by completing various activities like scanning products, maintaining streaks, making healthy choices, and engaging with the community. Check the Badges page to see available achievements and your progress.",
      category: "badges",
      helpful: 35,
      notHelpful: 2,
    },
    {
      id: "8",
      question: "Can I export my scan history?",
      answer:
        "Yes! Go to your Profile page, scroll to the Privacy & Data section, and tap 'Export My Data'. This will download a file containing all your profile and scan history data.",
      category: "privacy",
      helpful: 19,
      notHelpful: 0,
    },
  ]

  const quickLinks = [
    { title: "Terms & Conditions", href: "/terms", icon: FileText },
    { title: "Privacy Policy", href: "/privacy", icon: Eye },
    { title: "Feedback Form", href: "/feedback", icon: MessageSquare },
    { title: "Community Guidelines", href: "/community-guidelines", icon: Users },
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

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setContactForm({ name: "", email: "", subject: "", message: "", priority: "medium" })

    setTimeout(() => {
      setSubmitSuccess(false)
      setShowContactForm(false)
    }, 3000)
  }

  const handleFAQVote = (faqId: string, helpful: boolean) => {
    // In a real app, this would update the database
    console.log(`FAQ ${faqId} voted as ${helpful ? "helpful" : "not helpful"}`)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Simple Header - Matching Other Pages */}
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/home"
            className={`flex items-center transition-colors ${
              darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-600"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-lime-600 bg-clip-text text-transparent">
            Help Center
          </h1>

          <div className="w-5"></div>
        </motion.header>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-full border-2 transition-all duration-300 focus:border-orange-500 focus:ring-orange-500 ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {[
              { label: "Articles", value: "58", icon: FileText },
              { label: "Categories", value: "6", icon: BookOpen },
              { label: "Avg Response", value: "2h", icon: Clock },
              { label: "Satisfaction", value: "98%", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-3 sm:p-4 rounded-xl ${
                  darkMode ? "bg-gray-800/50" : "bg-white/70"
                } backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
              >
                <stat.icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                />
                <div className="text-lg sm:text-xl font-bold">{stat.value}</div>
                <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Browse by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id ? "scale-105" : ""
                }`}
              >
                <Card
                  className={`h-full shadow-lg border-0 transition-all duration-300 ${
                    darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
                  } ${selectedCategory === category.id ? "ring-2 ring-orange-500" : ""}`}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm sm:text-base mb-2">{category.title}</h4>
                    <p className={`text-xs sm:text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {category.description}
                    </p>
                    <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      {category.articles} articles
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => setSelectedCategory("all")}
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className={`text-xs sm:text-sm transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                  : darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Categories
            </Button>
            {helpCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`text-xs sm:text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                    : darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category.title}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* FAQs Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold">Frequently Asked Questions</h3>
            <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {filteredFAQs.length} questions
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`shadow-md border-0 transition-all duration-300 hover:shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                    >
                      <span className="font-medium text-sm sm:text-base pr-4">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className={`border-t pt-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                              <p
                                className={`text-sm sm:text-base mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                              >
                                {faq.answer}
                              </p>

                              {/* Helpful Voting */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <span
                                    className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    Was this helpful?
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() => handleFAQVote(faq.id, true)}
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-auto hover:bg-green-100 dark:hover:bg-green-900/20"
                                    >
                                      <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                    </Button>
                                    <span className="text-xs text-green-600">{faq.helpful}</span>
                                    <Button
                                      onClick={() => handleFAQVote(faq.id, false)}
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-auto hover:bg-red-100 dark:hover:bg-red-900/20"
                                    >
                                      <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                    </Button>
                                    <span className="text-xs text-red-600">{faq.notHelpful}</span>
                                  </div>
                                </div>

                                <div
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    faq.category === "scanning"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                      : faq.category === "profile"
                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                                        : faq.category === "badges"
                                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                          : faq.category === "privacy"
                                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                            : faq.category === "technical"
                                              ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                  }`}
                                >
                                  {helpCategories.find((cat) => cat.id === faq.category)?.title || faq.category}
                                </div>
                              </div>
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

          {filteredFAQs.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 sm:py-12">
              <AlertCircle
                className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}
              />
              <h4 className="text-base sm:text-lg font-medium mb-2">No results found</h4>
              <p className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Try adjusting your search or browse our categories above
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Contact Support Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8 sm:mb-12"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center text-lg sm:text-xl">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                Still Need Help?
              </CardTitle>
              <p className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Can't find what you're looking for? We're here to help!
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Contact Options */}
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-sm sm:text-base mb-2">Email Support</h4>
                  <p className={`text-xs sm:text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Get detailed help via email
                  </p>
                  <Button
                    onClick={() => setShowContactForm(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                  >
                    Send Message
                  </Button>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-sm sm:text-base mb-2">Live Chat</h4>
                  <p className={`text-xs sm:text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Chat with our support team
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs sm:text-sm bg-transparent"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 sm:col-span-2 lg:col-span-1">
                  <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-sm sm:text-base mb-2">AI Assistant</h4>
                  <p className={`text-xs sm:text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Get instant AI-powered help
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-xs sm:text-sm bg-transparent"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </div>
              </div>

              {/* Response Time Info */}
              <div className={`text-center p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex items-center justify-center space-x-4 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Avg. Response: 2 hours</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-green-500" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Quick Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Quick Links</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={link.href}>
                  <Card
                    className={`h-full shadow-md border-0 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
                      darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <link.icon
                        className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${
                          darkMode ? "text-orange-400" : "text-orange-600"
                        }`}
                      />
                      <h4 className="font-medium text-xs sm:text-sm">{link.title}</h4>
                      <ExternalLink
                        className={`w-3 h-3 sm:w-4 sm:h-4 mx-auto mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                      />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={`text-center pt-8 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <p>© 2024 FoodSnap. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Powered by</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                <span className="font-medium text-orange-600">GroqAI</span>
              </div>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>&</span>
              <div className="flex items-center space-x-1">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="font-medium text-green-600">OpenFoodFacts</span>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactForm(false)}
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
                  <h3 className="text-lg sm:text-xl font-semibold">Contact Support</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowContactForm(false)} className="p-1">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Message Sent!</h4>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      We'll get back to you within 2 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Name *
                      </label>
                      <Input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                        className={`${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                        className={`${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Priority
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, priority: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-orange-500 ${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - App not working</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Subject *
                      </label>
                      <Input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                        className={`${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-orange-500 resize-none ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
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
