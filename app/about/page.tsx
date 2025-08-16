"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Info,
  Heart,
  Shield,
  Zap,
  Users,
  Camera,
  BarChart3,
  Mail,
  MessageCircle,
  HelpCircle,
  Star,
  Target,
  Globe,
  Smartphone,
  Brain,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const navigationSections = [
  { id: "overview", name: "Overview", icon: Info },
  { id: "features", name: "Features", icon: Zap },
  { id: 'team", name: Team', icon: Users },
  { id: "contact", name: "Contact", icon: Mail },
  { id: "info", name: "App Info", icon: Smartphone },
]

const appFeatures = [
  {
    icon: Camera,
    title: "Smart Food Scanning",
    description:
      "Advanced AI-powered food recognition technology that instantly identifies ingredients and nutritional content from photos.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Nutrition Analytics",
    description:
      "Comprehensive nutritional analysis with detailed breakdowns of calories, macros, vitamins, and minerals.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Heart,
    title: "Health Tracking",
    description:
      "Monitor your dietary habits, track health goals, and receive personalized recommendations for better nutrition.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Allergen Detection",
    description: "Automatically detect potential allergens and dietary restrictions to keep you safe and informed.",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Users,
    title: "Community Sharing",
    description: "Connect with health-conscious individuals, share discoveries, and learn from the community.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Target,
    title: "Goal Achievement",
    description: "Set and track personalized nutrition goals with our intelligent progress monitoring system.",
    color: "from-teal-500 to-blue-500",
  },
]

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Nutrition expert with 10+ years in health tech. Passionate about making healthy eating accessible to everyone.",
    image: "/placeholder.svg?height=120&width=120",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Dr. Michael Chen",
    role: "CTO & Co-Founder",
    bio: "AI researcher specializing in computer vision and machine learning. Former Google AI engineer.",
    image: "/placeholder.svg?height=120&width=120",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    bio: "UX/UI designer focused on creating intuitive health applications. Award-winning design professional.",
    image: "/placeholder.svg?height=120&width=120",
    social: {
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Dr. James Wilson",
    role: "Chief Nutritionist",
    bio: "Registered dietitian and nutrition researcher. Ensures all our recommendations are scientifically backed.",
    image: "/placeholder.svg?height=120&width=120",
    social: {
      linkedin: "#",
    },
  },
]

const missionValues = [
  {
    icon: Heart,
    title: "Health First",
    description:
      "We prioritize user health and well-being above all else, ensuring every feature contributes to better nutrition.",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your personal health data is protected with enterprise-grade security and complete privacy controls.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "Continuously pushing the boundaries of food technology to provide the most accurate and helpful insights.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "Making healthy eating knowledge accessible to everyone, regardless of background or technical expertise.",
  },
]

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
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
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              <h1 className="text-lg sm:text-xl font-bold">About FoodSnap</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav
        className={`sticky top-16 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="flex overflow-x-auto px-3 sm:px-4 py-2 space-x-1 sm:space-x-2 max-w-6xl mx-auto">
          {navigationSections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-orange-500 to-lime-500 text-white"
                  : isDarkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100"
              }`}
            >
              <section.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{section.name}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="px-3 sm:px-4 pb-32 max-w-6xl mx-auto">
        {/* Overview Section */}
        <section id="overview" className="py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Hero Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-500">500K+</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">10M+</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Foods Scanned</p>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-orange-500">98.5%</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</p>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-purple-500">4.9</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">App Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Mission Statement */}
            <Card
              className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg mb-6 sm:mb-8`}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  At FoodSnap, we believe that everyone deserves access to accurate, instant nutritional information.
                  Our mission is to empower individuals to make informed dietary choices through cutting-edge AI
                  technology, comprehensive nutrition analysis, and a supportive community.
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  We're not just building an app – we're creating a movement towards healthier living, one scan at a
                  time. By combining advanced computer vision, nutritional science, and user-friendly design, we make
                  healthy eating accessible, enjoyable, and sustainable for everyone.
                </p>
              </CardContent>
            </Card>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {missionValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg h-full hover:shadow-xl transition-shadow duration-300`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg mb-2">{value.title}</h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Powerful Features</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover the comprehensive suite of tools designed to transform your relationship with food and
                nutrition.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {appFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card
                    className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="text-center mb-4">
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}
                        >
                          <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Meet Our Team</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                The passionate experts behind FoodSnap, dedicated to revolutionizing how you understand and interact
                with food.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card
                    className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-lime-500 p-1 mb-3 sm:mb-4">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover bg-gray-200"
                        />
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1">{member.name}</h3>
                      <p className="text-sm text-orange-500 font-medium mb-2 sm:mb-3">{member.role}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
                        {member.bio}
                      </p>
                      <div className="flex justify-center space-x-2 sm:space-x-3">
                        {member.social.twitter && (
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                            <Twitter className="w-4 h-4" />
                          </Button>
                        )}
                        {member.social.linkedin && (
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                            <Linkedin className="w-4 h-4" />
                          </Button>
                        )}
                        {member.social.github && (
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                            <Github className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Get in Touch</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Have questions, feedback, or need support? We'd love to hear from you. Choose your preferred way to
                connect.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Email Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                    Get detailed help with any questions or issues
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => window.open("mailto:support@foodsnap.com")}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </Button>
                </CardContent>
              </Card>

              <Card
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Live Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Help Center</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                    Browse our comprehensive FAQ and guides
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Visit Help Center
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>

        {/* App Info Section */}
        <section id="info" className="py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">App Information</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Technical details, version information, and important app-related information.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    <span>Version Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">App Version:</span>
                    <span className="text-sm font-medium">2.1.4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Build Number:</span>
                    <span className="text-sm font-medium">2024.03.15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="text-sm font-medium">March 15, 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Platform:</span>
                    <span className="text-sm font-medium">iOS & Android</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>Technology Stack</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI Engine:</span>
                    <span className="text-sm font-medium">TensorFlow 2.13</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Database:</span>
                    <span className="text-sm font-medium">USDA FoodData Central</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Recognition Accuracy:</span>
                    <span className="text-sm font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Supported Languages:</span>
                    <span className="text-sm font-medium">15+</span>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg sm:col-span-2`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Recent Updates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium mb-1">Enhanced AI Recognition (v2.1.4)</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Improved accuracy for packaged foods and international cuisines
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium mb-1">New Badge System (v2.1.0)</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Gamification features to encourage healthy eating habits
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium mb-1">Community Features (v2.0.8)</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Share discoveries and connect with health-conscious users
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg sm:col-span-2`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span>Coming Soon</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Web Platform</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Access FoodSnap from any browser</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Health Integration</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Sync with Apple Health & Google Fit</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">AI Meal Planning</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Personalized meal recommendations</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Family Sharing</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Share nutrition goals with family</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Legal Links */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <Button variant="link" className="p-0 h-auto text-orange-500 hover:text-orange-600">
                  Privacy Policy
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button variant="link" className="p-0 h-auto text-orange-500 hover:text-orange-600">
                  Terms of Service
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button variant="link" className="p-0 h-auto text-orange-500 hover:text-orange-600">
                  Cookie Policy
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button variant="link" className="p-0 h-auto text-orange-500 hover:text-orange-600">
                  Open Source Licenses
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">© 2024 FoodSnap Technologies Inc. All rights reserved.</p>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
