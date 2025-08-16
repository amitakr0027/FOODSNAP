"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Download,
  Trash2,
  Settings,
  Globe,
  Database,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Clock,
  FileText,
  Users,
  Smartphone,
  Share2,
  BarChart3,
  Cookie,
  Mail,
  MapPin,
  Fingerprint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface PrivacySection {
  id: string
  title: string
  icon: React.ComponentType<any>
  content: string[]
  important?: boolean
}

interface DataCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  collected: boolean
  purpose: string[]
  retention: string
}

export default function PrivacyPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showDataExport, setShowDataExport] = useState(false)
  const [showDataDeletion, setShowDataDeletion] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [privacyControls, setPrivacyControls] = useState({
    analytics: true,
    marketing: false,
    personalization: true,
    thirdParty: false,
  })

  const lastUpdated = "January 15, 2024"
  const effectiveDate = "January 15, 2024"

  const dataCategories: DataCategory[] = [
    {
      id: "personal",
      name: "Personal Information",
      description: "Basic identity and contact information",
      icon: UserCheck,
      collected: true,
      purpose: ["Account creation", "Communication", "Support"],
      retention: "Until account deletion",
    },
    {
      id: "health",
      name: "Health & Nutrition Data",
      description: "Dietary preferences, health goals, scan history",
      icon: BarChart3,
      collected: true,
      purpose: ["Personalized recommendations", "Health insights", "Progress tracking"],
      retention: "3 years after last activity",
    },
    {
      id: "device",
      name: "Device Information",
      description: "Device type, OS version, app version",
      icon: Smartphone,
      collected: true,
      purpose: ["App functionality", "Bug fixes", "Performance optimization"],
      retention: "2 years",
    },
    {
      id: "usage",
      name: "Usage Analytics",
      description: "App interactions, feature usage, crash reports",
      icon: BarChart3,
      collected: true,
      purpose: ["Product improvement", "Feature development", "Bug detection"],
      retention: "1 year",
    },
    {
      id: "location",
      name: "Location Data",
      description: "Approximate location for local recommendations",
      icon: MapPin,
      collected: false,
      purpose: ["Local product recommendations", "Store finder"],
      retention: "30 days",
    },
    {
      id: "biometric",
      name: "Biometric Data",
      description: "Fingerprint, face ID for app security",
      icon: Fingerprint,
      collected: false,
      purpose: ["App security", "Quick authentication"],
      retention: "Stored locally only",
    },
  ]

  const privacySections: PrivacySection[] = [
    {
      id: "overview",
      title: "Privacy Overview",
      icon: Shield,
      important: true,
      content: [
        "At FoodSnap, we are committed to protecting your privacy and ensuring the security of your personal information.",
        "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.",
        "We follow privacy-by-design principles and comply with GDPR, CCPA, and other applicable privacy regulations.",
        "Your trust is important to us, and we are transparent about our data practices.",
      ],
    },
    {
      id: "collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        "We collect information you provide directly, such as when you create an account, update your profile, or contact us for support.",
        "Automatically collected information includes device information, usage data, and app performance metrics.",
        "We may collect health and nutrition data when you use our scanning and tracking features.",
        "Location data is only collected with your explicit consent and can be disabled at any time.",
        "We do not collect sensitive personal information unless necessary for app functionality.",
      ],
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: Settings,
      content: [
        "To provide, maintain, and improve our services and develop new features.",
        "To personalize your experience and provide customized recommendations.",
        "To communicate with you about your account, updates, and support requests.",
        "To analyze usage patterns and improve app performance and user experience.",
        "To comply with legal obligations and protect our rights and the rights of others.",
      ],
    },
    {
      id: "sharing",
      title: "Information Sharing and Disclosure",
      icon: Share2,
      important: true,
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "We may share aggregated, non-personally identifiable information for research and analytics.",
        "Information may be disclosed to service providers who assist us in operating our app.",
        "We may disclose information if required by law or to protect our rights and safety.",
        "In case of a business transfer, user information may be transferred as part of the transaction.",
      ],
    },
    {
      id: "security",
      title: "Data Security",
      icon: Lock,
      important: true,
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information.",
        "Data is encrypted in transit and at rest using industry-standard encryption protocols.",
        "Access to personal information is restricted to authorized personnel only.",
        "We regularly review and update our security practices to address emerging threats.",
        "While we strive to protect your information, no method of transmission over the internet is 100% secure.",
      ],
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: Clock,
      content: [
        "We retain personal information only as long as necessary to fulfill the purposes outlined in this policy.",
        "Account information is retained until you delete your account or request deletion.",
        "Usage and analytics data is typically retained for 1-3 years depending on the type of data.",
        "Some information may be retained longer if required by law or for legitimate business purposes.",
        "You can request deletion of your data at any time through your account settings or by contacting us.",
      ],
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      icon: UserCheck,
      important: true,
      content: [
        "You have the right to access, update, or delete your personal information.",
        "You can opt-out of certain data collection and processing activities.",
        "You have the right to data portability and can request a copy of your data.",
        "You can withdraw consent for data processing at any time where consent is the legal basis.",
        "You have the right to lodge a complaint with a supervisory authority if you believe your rights have been violated.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: Cookie,
      content: [
        "We use cookies and similar technologies to enhance your experience and analyze app usage.",
        "Essential cookies are necessary for app functionality and cannot be disabled.",
        "Analytics cookies help us understand how you use the app and improve our services.",
        "You can manage cookie preferences through your device settings or app preferences.",
        "Third-party analytics services may use their own cookies subject to their privacy policies.",
      ],
    },
    {
      id: "children",
      title: "Children's Privacy",
      icon: Users,
      content: [
        "Our service is not intended for children under the age of 13.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware that we have collected information from a child under 13, we will delete it promptly.",
        "Parents or guardians who believe their child has provided us with information should contact us immediately.",
        "Users between 13-18 should have parental consent before using our service.",
      ],
    },
    {
      id: "international",
      title: "International Data Transfers",
      icon: Globe,
      content: [
        "Your information may be transferred to and processed in countries other than your own.",
        "We ensure appropriate safeguards are in place for international data transfers.",
        "We comply with applicable data protection laws regarding cross-border data transfers.",
        "Standard contractual clauses or adequacy decisions are used where required.",
        "You consent to such transfers by using our service.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: Calendar,
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
        "We will notify you of any material changes through the app or by email.",
        "The updated policy will be effective immediately upon posting unless otherwise specified.",
        "Your continued use of the service after changes constitutes acceptance of the updated policy.",
        "We encourage you to review this policy periodically to stay informed about our privacy practices.",
      ],
    },
  ]

  const complianceBadges = [
    { name: "GDPR", description: "EU General Data Protection Regulation", icon: Shield },
    { name: "CCPA", description: "California Consumer Privacy Act", icon: Eye },
    { name: "SOC 2", description: "Security & Availability", icon: Lock },
    { name: "ISO 27001", description: "Information Security Management", icon: FileText },
  ]

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)

    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const savedControls = localStorage.getItem("privacyControls")
    if (savedControls) {
      setPrivacyControls(JSON.parse(savedControls))
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(Math.min(progress, 100))

      const sections = document.querySelectorAll("[data-section]")
      let currentSection = ""

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute("data-section") || ""
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handlePrivacyControlChange = (control: string, value: boolean) => {
    const newControls = { ...privacyControls, [control]: value }
    setPrivacyControls(newControls)
    localStorage.setItem("privacyControls", JSON.stringify(newControls))
  }

  const handleDataExport = async () => {
    // Simulate data export
    const exportData = {
      profile: {
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: "2024-01-15",
      },
      preferences: privacyControls,
      scanHistory: [],
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodsnap-privacy-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowDataExport(false)
  }

  const handleDataDeletion = () => {
    // In a real app, this would trigger account deletion
    alert("Account deletion request submitted. You will receive a confirmation email within 24 hours.")
    setShowDataDeletion(false)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
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
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-lime-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

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
            Privacy Policy
          </h1>

          <Button
            onClick={() => setShowDataExport(true)}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </Button>
        </motion.header>

        {/* Document Info */}
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
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">FoodSnap Privacy Policy</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Updated: {lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Effective: {effectiveDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {complianceBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-lg text-center ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-md border border-green-200 dark:border-green-800`}
              >
                <badge.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-sm">{badge.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="w-5 h-5 mr-2 text-blue-500" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(privacyControls).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {key === "analytics" && "Help improve the app with usage analytics"}
                        {key === "marketing" && "Receive promotional communications"}
                        {key === "personalization" && "Get personalized recommendations"}
                        {key === "thirdParty" && "Share data with trusted partners"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handlePrivacyControlChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Database className="w-5 h-5 mr-2 text-purple-500" />
                Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 rounded-lg border ${
                      category.collected
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          category.collected ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                        }`}
                      >
                        <category.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{category.name}</h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              category.collected
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                            }`}
                          >
                            {category.collected ? "Collected" : "Not Collected"}
                          </span>
                        </div>
                        <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {category.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Purpose:</span>
                            <ul className="list-disc list-inside ml-2">
                              {category.purpose.map((purpose, index) => (
                                <li key={index}>{purpose}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium">Retention:</span>
                            <p className="ml-2">{category.retention}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.id}
              data-section={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`shadow-lg border-0 transition-all duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ${section.important ? "ring-2 ring-blue-500/20" : ""}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center space-x-3 ${
                      section.important ? "text-blue-600 dark:text-blue-400" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        section.important
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      }`}
                    >
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      {section.important && (
                        <div className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                          <Info className="w-3 h-3" />
                          <span>Important Section</span>
                        </div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className={`text-sm sm:text-base leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.important && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          This section contains important information about your privacy rights and our data practices.
                          Please read carefully.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Data Rights Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <UserCheck className="w-5 h-5 mr-2 text-green-500" />
                Exercise Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowDataExport(true)}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Export My Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Download all your personal data</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowDataDeletion(true)}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div className="text-left">
                      <div className="font-medium">Delete My Account</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account</div>
                    </div>
                  </div>
                </Button>

                <Link href="/help" className="sm:col-span-2">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">Contact Privacy Team</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Questions about your privacy rights
                        </div>
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Privacy Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    For privacy-related questions or concerns:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>Email: privacy@foodsnap.com</p>
                    <p>Data Protection Officer: dpo@foodsnap.com</p>
                    <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <Link href="/terms">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Terms of Service
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Info className="w-4 h-4 mr-2" />
                      Help Center
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={`mt-12 pt-8 border-t text-center ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <p>© 2024 FoodSnap. All rights reserved.</p>
              <p className="text-xs mt-1">Last updated: {lastUpdated}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowDataExport(true)} variant="outline" size="sm" className="sm:hidden">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </motion.footer>
      </div>

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
              className={`w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Export Your Data</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Download a copy of all your personal data stored in FoodSnap.
                  </p>
                </div>

                <div className={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h4 className="font-medium mb-2">Your export will include:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Profile information and preferences</li>
                    <li>• Scan history and product data</li>
                    <li>• Health goals and progress</li>
                    <li>• Privacy settings and consents</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setShowDataExport(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDataExport}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Deletion Modal */}
      <AnimatePresence>
        {showDataDeletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDataDeletion(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Delete Your Account</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>

                <div className="p-4 rounded-lg mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <p className="font-medium mb-1">This will permanently delete:</p>
                      <ul className="space-y-1">
                        <li>• Your profile and account information</li>
                        <li>• All scan history and product data</li>
                        <li>• Health goals and progress tracking</li>
                        <li>• Badges and achievements</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setShowDataDeletion(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleDataDeletion} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
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
