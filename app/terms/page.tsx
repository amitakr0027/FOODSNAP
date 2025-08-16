"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Download,
  Eye,
  Shield,
  Users,
  Globe,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Scale,
  Gavel,
  UserCheck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface TermsSection {
  id: string
  title: string
  icon: React.ComponentType<any>
  content: string[]
  important?: boolean
}

export default function TermsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [hasAccepted, setHasAccepted] = useState(false)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  const lastUpdated = "January 15, 2024"
  const effectiveDate = "January 15, 2024"

  const termsSection: TermsSection[] = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: UserCheck,
      important: true,
      content: [
        "By accessing and using FoodSnap ('the App'), you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service.",
        "We reserve the right to update these terms at any time without prior notice.",
      ],
    },
    {
      id: "description",
      title: "Service Description",
      icon: BookOpen,
      content: [
        "FoodSnap is a mobile application that helps users analyze food products by scanning barcodes and providing nutritional information.",
        "The app uses AI technology to provide personalized health insights and recommendations.",
        "We integrate with third-party databases including OpenFoodFacts to provide comprehensive product information.",
        "The service includes features such as product scanning, nutritional analysis, health tracking, and community features.",
      ],
    },
    {
      id: "user-accounts",
      title: "User Accounts and Registration",
      icon: Users,
      content: [
        "To access certain features, you must register for an account and provide accurate, complete information.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to notify us immediately of any unauthorized use of your account.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
        "One person or legal entity may not maintain more than one account.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: Shield,
      important: true,
      content: [
        "You agree not to use the service for any unlawful purpose or in any way that could damage the service.",
        "Prohibited activities include: harassment, spam, malware distribution, or attempting to gain unauthorized access.",
        "You may not reverse engineer, decompile, or disassemble any part of the service.",
        "Commercial use of the service without explicit permission is prohibited.",
        "You agree not to interfere with or disrupt the service or servers connected to the service.",
      ],
    },
    {
      id: "content-policy",
      title: "User Content and Conduct",
      icon: FileText,
      content: [
        "Users may contribute content such as product reviews, photos, and community posts.",
        "You retain ownership of content you create, but grant us a license to use, modify, and distribute it.",
        "All user content must comply with our Community Guidelines and applicable laws.",
        "We reserve the right to remove content that violates our policies without notice.",
        "You are solely responsible for the content you post and its consequences.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy and Data Protection",
      icon: Eye,
      important: true,
      content: [
        "Your privacy is important to us. Please review our Privacy Policy for detailed information.",
        "We collect and process personal data in accordance with applicable privacy laws including GDPR and CCPA.",
        "We implement appropriate security measures to protect your personal information.",
        "You have rights regarding your personal data, including access, correction, and deletion.",
        "We do not sell your personal information to third parties.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: Scale,
      content: [
        "The service and its original content, features, and functionality are owned by FoodSnap and are protected by copyright, trademark, and other laws.",
        "Our trademarks and trade dress may not be used without our prior written consent.",
        "You may not copy, modify, distribute, sell, or lease any part of our services.",
        "Third-party content is used under appropriate licenses and remains the property of respective owners.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: AlertTriangle,
      important: true,
      content: [
        "The information provided by FoodSnap is for informational purposes only and should not replace professional medical advice.",
        "We do not guarantee the accuracy, completeness, or reliability of any information provided.",
        "The service is provided 'as is' without warranties of any kind, either express or implied.",
        "We are not liable for any damages arising from your use of the service.",
        "Users should consult healthcare professionals for medical advice and dietary decisions.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: Gavel,
      content: [
        "In no event shall FoodSnap be liable for any indirect, incidental, special, consequential, or punitive damages.",
        "Our total liability to you for all damages shall not exceed the amount paid by you for the service in the past 12 months.",
        "Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability.",
        "These limitations apply to the fullest extent permitted by applicable law.",
      ],
    },
    {
      id: "termination",
      title: "Termination",
      icon: X,
      content: [
        "We may terminate or suspend your account and access to the service immediately, without prior notice.",
        "Termination may occur for violations of these terms or for any other reason at our sole discretion.",
        "Upon termination, your right to use the service will cease immediately.",
        "You may terminate your account at any time by contacting our support team.",
        "Provisions that should survive termination will remain in effect.",
      ],
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: Calendar,
      content: [
        "We reserve the right to modify these terms at any time.",
        "Changes will be effective immediately upon posting to the application.",
        "Continued use of the service after changes constitutes acceptance of the new terms.",
        "We will notify users of significant changes through the app or email.",
        "It is your responsibility to review these terms periodically.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law and Jurisdiction",
      icon: Globe,
      content: [
        "These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].",
        "Any disputes arising from these terms will be resolved in the courts of [Your Jurisdiction].",
        "If any provision of these terms is found to be unenforceable, the remaining provisions will remain in effect.",
        "These terms constitute the entire agreement between you and FoodSnap regarding the service.",
      ],
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

    const savedAcceptance = localStorage.getItem("termsAccepted")
    if (savedAcceptance === "true") {
      setHasAccepted(true)
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(Math.min(progress, 100))

      // Update active section based on scroll position
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

  const handleAcceptTerms = () => {
    setHasAccepted(true)
    localStorage.setItem("termsAccepted", "true")
    localStorage.setItem("termsAcceptedDate", new Date().toISOString())
    setShowAcceptModal(false)
  }

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    const element = document.createElement("a")
    const file = new Blob(
      [
        `FoodSnap Terms of Service\n\nLast Updated: ${lastUpdated}\n\n` +
          termsSection.map((section) => `${section.title}\n${section.content.join("\n")}\n\n`).join(""),
      ],
      { type: "text/plain" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `FoodSnap-Terms-of-Service-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
            Terms of Service
          </h1>

          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2 bg-transparent"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">FoodSnap Terms of Service</h2>
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

                <div className="flex items-center space-x-3">
                  {hasAccepted ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Accepted</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowAcceptModal(true)}
                      className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                    >
                      Accept Terms
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {termsSection.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      activeSection === section.id
                        ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <section.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{section.title}</span>
                    {section.important && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsSection.map((section, index) => (
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
                } ${section.important ? "ring-2 ring-amber-500/20" : ""}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center justify-between cursor-pointer ${
                      section.important ? "text-amber-600 dark:text-amber-400" : ""
                    }`}
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          section.important
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                        }`}
                      >
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        {section.important && (
                          <div className="flex items-center space-x-1 text-sm text-amber-600 dark:text-amber-400">
                            <Info className="w-3 h-3" />
                            <span>Important Section</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </CardTitle>
                </CardHeader>

                <AnimatePresence>
                  {(expandedSection === section.id || expandedSection === null) && (
                    <motion.div
                      initial={expandedSection === null ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0">
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
                          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start space-x-2">
                              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-amber-800 dark:text-amber-200">
                                This section contains important terms that significantly affect your rights and
                                obligations. Please read carefully.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className={`shadow-lg border-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Questions About These Terms?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>Email: legal@foodsnap.com</p>
                    <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
                    <p>Phone: +1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <Link href="/help">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Info className="w-4 h-4 mr-2" />
                      Visit Help Center
                    </Button>
                  </Link>
                  <Link href="/privacy">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Policy
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`mt-12 pt-8 border-t text-center ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <p>© 2024 FoodSnap. All rights reserved.</p>
              <p className="text-xs mt-1">Last updated: {lastUpdated}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="sm:hidden bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Accept Terms Modal */}
      <AnimatePresence>
        {showAcceptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAcceptModal(false)}
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
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Accept Terms of Service</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    By accepting these terms, you agree to be bound by all the conditions outlined in this document.
                  </p>
                </div>

                <div className={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm space-y-1">
                      <p className="font-medium">I confirm that I have:</p>
                      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <li>• Read and understood all terms and conditions</li>
                        <li>• Agree to comply with the acceptable use policy</li>
                        <li>• Understand the limitations and disclaimers</li>
                        <li>• Accept the privacy and data protection terms</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setShowAcceptModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAcceptTerms}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                  >
                    Accept Terms
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
