"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PoweredBySectionProps {
  isDarkMode: boolean
}

export default function PoweredBySection({ isDarkMode }: PoweredBySectionProps) {
  const partners = [
    {
      name: "OpenFoodFacts",
      description: "World's largest food database",
      icon: Database,
      color: "from-green-500 to-emerald-500",
      stats: "2M+ Products",
    },
    {
      name: "GEMINI AI",
      description: "Lightning-fast AI analysis",
      icon: Zap,
      color: "from-purple-500 to-violet-500",
      stats: "< 1s Response",
    },
    {
      name: "Secure & Private",
      description: "Your data stays protected",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      stats: "100% Secure",
    },
  ]

  return (
    <Card
      className={`shadow-lg border-0 transition-colors duration-300 hover:shadow-xl ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <CardContent className="p-6 lg:p-8">
        <div className="text-center mb-6 lg:mb-8">
          <h3 className="text-lg lg:text-2xl font-semibold mb-2">Powered By</h3>
          <p className={`text-sm lg:text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Trusted technology partners ensuring the best experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`text-center p-4 lg:p-6 rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div
                className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-full bg-gradient-to-r ${partner.color} flex items-center justify-center shadow-lg`}
              >
                <partner.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h4 className="font-semibold text-sm lg:text-base mb-1 lg:mb-2">{partner.name}</h4>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-2">{partner.description}</p>
              <span
                className={`text-xs lg:text-sm font-medium px-2 py-1 rounded-full ${
                  isDarkMode ? "bg-gray-600 text-gray-300" : "bg-white text-gray-700"
                }`}
              >
                {partner.stats}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6 lg:mt-8">
          <div className="flex justify-center items-center space-x-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                ⭐
              </motion.div>
            ))}
          </div>
          <p className={`text-sm lg:text-base mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Trusted by 10,000+ health-conscious users
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
