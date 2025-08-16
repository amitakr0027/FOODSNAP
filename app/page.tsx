"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  Scan,
  Zap,
  Shield,
  Heart,
  Star,
  CheckCircle,
  Menu,
  X,
  BarChart3,
  History,
  Bookmark,
  Users,
  Smartphone,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const features = [
    {
      icon: <Scan className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Instant Scanning",
      description: "Simply scan any barcode to get detailed nutritional information in seconds",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "AI Analysis",
      description: "Get intelligent health insights powered by advanced AI technology",
      color: "from-yellow-500 to-lime-500",
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Allergen Alerts",
      description: "Set dietary restrictions and receive immediate allergen warnings",
      color: "from-lime-500 to-green-500",
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Health Scoring",
      description: "Understand product healthiness with our comprehensive scoring system",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <History className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Scan History",
      description: "Track your scanning history and monitor your food choices over time",
      color: "from-blue-500 to-lime-500",
    },
    {
      icon: <Bookmark className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Favorites",
      description: "Save your favorite healthy products for quick access and comparison",
      color: "from-purple-500 to-orange-500",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Scan Barcode",
      description: "Point your camera at any product barcode for instant recognition",
      icon: <Scan className="w-10 h-10 sm:w-12 sm:h-12" />,
      color: "from-orange-500 to-yellow-500",
    },
    {
      number: "02",
      title: "Analyze Nutrition",
      description: "Our AI instantly processes nutritional data and ingredients",
      icon: <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12" />,
      color: "from-yellow-500 to-lime-500",
    },
    {
      number: "03",
      title: "Choose Better",
      description: "Get personalized recommendations for healthier alternatives",
      icon: <Heart className="w-10 h-10 sm:w-12 sm:h-12" />,
      color: "from-lime-500 to-green-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Health Enthusiast",
      content:
        "FoodSnap has completely changed how I shop for groceries. I can finally make informed decisions about what I eat!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mike Chen",
      role: "Fitness Coach",
      content:
        "I recommend FoodSnap to all my clients. It's the easiest way to track nutrition and avoid harmful ingredients.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emma Davis",
      role: "Busy Mom",
      content:
        "With food allergies in the family, FoodSnap is a lifesaver. Quick scanning saves us so much time and worry.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const menuItems = [
    {
      href: "#features",
      label: "Features",
      icon: <Zap className="w-5 h-5" />,
      description: "Explore powerful scanning features",
    },
    {
      href: "#how-it-works",
      label: "How it Works",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Learn the simple 3-step process",
    },
    {
      href: "#demo",
      label: "Demo",
      icon: <Play className="w-5 h-5" />,
      description: "See FoodSnap in action",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2 sm:space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg">
                <Scan className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold foodsnap-text-gradient">FoodSnap</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                How it Works
              </a>
              <a href="#demo" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Demo
              </a>
              <Link href="/login">
                <Button className="foodsnap-button">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b-4 border-orange-500"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="px-4 py-6">
              {/* Menu Header */}
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Menu</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full mx-auto"></div>
              </div>

              {/* Menu Items */}
              <div className="space-y-3 mb-6">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gradient-to-r hover:from-orange-100 hover:to-lime-100 transition-all duration-300 group border-2 border-gray-100 hover:border-orange-300 shadow-sm hover:shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-lime-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors mb-1">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-600 group-hover:text-gray-700 leading-tight">
                        {item.description}
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
                  </motion.a>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t-2 border-gray-200 my-6"></div>

              {/* CTA Section */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="mb-4 bg-gradient-to-r from-orange-50 to-lime-50 p-4 rounded-2xl border-2 border-orange-200">
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Ready to get started?</h4>
                  <p className="text-sm text-gray-700 mb-4">Join thousands making healthier food choices every day</p>

                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full foodsnap-button min-h-[56px] text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <Scan className="mr-3 w-6 h-6" />
                      Get Started Free
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators in mobile menu */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-lime-500 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">Free Forever</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-orange-500 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">10k+ Users</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-lime-500 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">Privacy First</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center items-center mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex space-x-1 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">4.9/5 from 10k+ users</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        <motion.div style={{ y }} className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-lime-400 to-lime-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-r from-yellow-400 to-orange-300 rounded-full blur-2xl animate-pulse delay-500"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left px-2 sm:px-0"
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover What's <span className="foodsnap-text-gradient">In Your Food</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Scan products to instantly access nutrition facts, ingredients, allergens, and more - making healthy
                choices has never been easier.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto foodsnap-button text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 min-h-[48px]"
                  >
                    Start Scanning Now
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-lime-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] bg-transparent"
                >
                  <Smartphone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-lime-500" />
                  <span>10,000+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  <span>Privacy Focused</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-lime-500" />
                  <span>Free to Use</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Animated Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-br from-orange-500 via-yellow-500 to-lime-500 p-1 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl">
                  <div className="bg-black rounded-[2.3rem] sm:rounded-[2.8rem] p-1.5 sm:p-2">
                    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 w-64 sm:w-72 md:w-80 h-[480px] sm:h-[520px] md:h-[600px] overflow-hidden">
                      {/* Phone Screen Content */}
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 via-yellow-50 to-lime-100 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-lime-200/30 animate-pulse"></div>

                        {/* Scanning Animation */}
                        <motion.div
                          className="relative z-10 flex flex-col items-center"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                            <Scan className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                          </div>
                          <div className="text-center px-4">
                            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                              Scanning Product...
                            </div>
                            <div className="w-32 sm:w-40 md:w-48 bg-gradient-to-r from-orange-100 to-lime-100 rounded-full h-2 sm:h-3 overflow-hidden">
                              <motion.div
                                className="bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 h-2 sm:h-3 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                          className="absolute top-16 sm:top-20 left-6 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-400 rounded-full opacity-60"
                          animate={{ y: [0, -20, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                        />
                        <motion.div
                          className="absolute bottom-24 sm:bottom-32 right-6 sm:right-8 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-lime-400 rounded-full opacity-60"
                          animate={{ y: [0, -15, 0] }}
                          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Icons */}
                <motion.div
                  className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is FoodSnap Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              What is <span className="foodsnap-text-gradient">FoodSnap</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4 sm:px-0">
              FoodSnap is your personal nutritional assistant, helping you make informed decisions about the food you
              consume with just a simple scan. Transform your shopping experience with AI-powered insights.
            </p>

            {/* App Purpose - Scan → Analyze → Choose Better */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Scan className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Scan</h3>
                <p className="text-sm sm:text-base text-gray-600">Point and scan any product barcode instantly</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-lime-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Analyze</h3>
                <p className="text-sm sm:text-base text-gray-600">Get detailed nutrition and ingredient analysis</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-lime-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Choose Better</h3>
                <p className="text-sm sm:text-base text-gray-600">Make informed, healthier food decisions</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              How It <span className="foodsnap-text-gradient">Works</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Get nutritional insights in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="mb-4 sm:mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${step.color} rounded-full text-white mb-3 sm:mb-4 shadow-lg`}
                      >
                        {step.icon}
                      </div>
                      <div className="text-xs sm:text-sm font-bold foodsnap-text-gradient mb-2">STEP {step.number}</div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Powerful <span className="foodsnap-text-gradient">Features</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Everything you need to make informed food choices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group bg-gradient-to-br from-white to-orange-50/30">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-full text-white mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section
        id="demo"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              See FoodSnap in <span className="foodsnap-text-gradient">Action</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
              Watch how easy it is to scan, analyze, and make better food choices
            </p>

            {/* Demo Video Placeholder */}
            <motion.div
              className="relative max-w-4xl mx-auto bg-gradient-to-br from-orange-500 via-yellow-500 to-lime-500 p-1 rounded-2xl sm:rounded-3xl shadow-2xl"
              whileInView={{ scale: [0.9, 1] }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="aspect-video bg-gradient-to-br from-orange-100 via-yellow-50 to-lime-100 rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-lime-200/30 animate-pulse"></div>
                  <motion.div
                    className="relative z-10 text-center px-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Interactive Demo</h3>
                    <p className="text-sm sm:text-base text-gray-600">Click to see FoodSnap in action</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              What Our <span className="foodsnap-text-gradient">Users Say</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Join thousands of satisfied users making healthier choices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-lime-400 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <span className="text-white font-bold text-sm sm:text-lg">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Elements Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Trusted by Food Lovers Everywhere
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <span className="font-semibold text-gray-800 text-sm sm:text-base">Powered by OpenFoodFacts</span>
                <span className="text-xs sm:text-sm text-gray-600">Comprehensive food database</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-yellow-500 to-lime-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <span className="font-semibold text-gray-800 text-sm sm:text-base">AI by GroqAI</span>
                <span className="text-xs sm:text-sm text-gray-600">Advanced analysis engine</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-lime-500 to-green-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <span className="font-semibold text-gray-800 text-sm sm:text-base">Privacy Focused</span>
                <span className="text-xs sm:text-sm text-gray-600">Your data stays secure</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <span className="font-semibold text-gray-800 text-sm sm:text-base">10,000+ Users</span>
                <span className="text-xs sm:text-sm text-gray-600">Growing community</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 font-medium text-sm sm:text-base">
                4.9/5 from 10,000+ food enthusiasts
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 via-yellow-500 to-lime-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Food Journey?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
              Join thousands of food lovers who are already making smarter, healthier choices with FoodSnap
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 min-h-[48px]"
              >
                Start Your Food Journey
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="sm:col-span-2 md:col-span-2">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Scan className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold">FoodSnap</span>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                Making healthy food choices easier with AI-powered nutritional analysis and smart barcode scanning
                technology.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-xs sm:text-sm font-bold">f</span>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-xs sm:text-sm font-bold">t</span>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-xs sm:text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Product</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="#features" className="hover:text-orange-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-orange-400 transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/scan" className="hover:text-orange-400 transition-colors">
                    Scanner
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-orange-400 transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/about" className="hover:text-lime-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-lime-400 transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-lime-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-lime-400 transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              © 2025 FoodSnap. All rights reserved. Made with ❤️ for healthier eating.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
