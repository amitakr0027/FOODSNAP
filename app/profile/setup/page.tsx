"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Heart,
  Shield,
  Volume2,
  VolumeX,
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useProfile } from "@/hooks/use-profile"

export default function ProfileSetupPage() {
  const { profile, updateProfile, markProfileComplete, isProfileComplete } = useProfile()
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    dietaryPreferences: [] as string[],
    accessibility: {
      audioOutput: false,
      audioSpeed: "1",
    },
  })

  const steps = [
    {
      title: "Personal Information",
      description: "Tell us about yourself",
      icon: <User className="w-6 h-6" />,
      color: "from-orange-500 to-yellow-500",
    },
    {
      title: "Health & Fitness",
      description: "Your physical details",
      icon: <Heart className="w-6 h-6" />,
      color: "from-yellow-500 to-lime-500",
    },
    {
      title: "Preferences",
      description: "Dietary and accessibility settings",
      icon: <Shield className="w-6 h-6" />,
      color: "from-lime-500 to-green-500",
    },
  ]

  // Load existing profile data when component mounts
  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        birthdate: profile.birthdate || "",
        gender: profile.gender || "",
        age: profile.age || "",
        height: profile.height || "",
        weight: profile.weight || "",
        activityLevel: profile.activityLevel || "",
        dietaryPreferences: profile.dietaryPreferences || [],
        accessibility: {
          audioOutput: profile.accessibility?.audioOutput || false,
          audioSpeed: profile.accessibility?.audioSpeed || "1",
        },
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }))
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }))
    }

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDietaryPreferenceChange = (preference: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      dietaryPreferences: checked
        ? [...prev.dietaryPreferences, preference]
        : prev.dietaryPreferences.filter((p) => p !== preference),
    }))
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0) {
      if (!profileData.fullName.trim()) {
        newErrors.fullName = "Full name is required"
      }
      if (!profileData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveProfile = async () => {
    if (!validateCurrentStep()) return

    setSaving(true)
    setErrors({})

    try {
      // Update profile with all collected data
      updateProfile({
        ...profileData,
        profileComplete: true,
        lastLoginAt: new Date().toISOString(),
      })

      // Mark profile as complete
      markProfileComplete()

      setShowSuccess(true)

      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = "/home"
      }, 2000)
    } catch (error: any) {
      setErrors({ general: "Failed to save profile. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    if (confirm("Are you sure you want to skip profile setup? You can complete it later in settings.")) {
      // Save partial profile data
      updateProfile({
        ...profileData,
        profileComplete: false,
      })
      window.location.href = "/home"
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                <Input
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={`h-12 ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <Input
                    type="date"
                    value={profileData.birthdate}
                    onChange={(e) => handleInputChange("birthdate", e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                {["Male", "Female", "Other"].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={profileData.gender === gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <Input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                <Input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="Enter your height"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                <Input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="Enter your weight"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Activity Level</label>
                <select
                  value={profileData.activityLevel}
                  onChange={(e) => handleInputChange("activityLevel", e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500 text-sm bg-white"
                >
                  <option value="">Select activity level</option>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">Light Exercise</option>
                  <option value="Moderate">Moderate Exercise</option>
                  <option value="Active">Active</option>
                  <option value="Very Active">Very Active</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            {/* Dietary Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Dietary Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Vegetarian",
                  "Vegan",
                  "Gluten Free",
                  "Dairy Free",
                  "Nut Free",
                  "Keto",
                  "Paleo",
                  "Low Carb",
                  "Low Fat",
                ].map((preference) => (
                  <label
                    key={preference}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={profileData.dietaryPreferences.includes(preference)}
                      onChange={(e) => handleDietaryPreferenceChange(preference, e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">{preference}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Accessibility Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Accessibility Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={profileData.accessibility.audioOutput}
                    onChange={(e) => handleInputChange("accessibility.audioOutput", e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 flex-shrink-0"
                  />
                  <div className="flex items-center">
                    {profileData.accessibility.audioOutput ? (
                      <Volume2 className="w-5 h-5 mr-2 text-green-500" />
                    ) : (
                      <VolumeX className="w-5 h-5 mr-2 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Enable Audio Output</span>
                  </div>
                </label>

                {profileData.accessibility.audioOutput && (
                  <div className="ml-4 sm:ml-8 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Audio Speed</label>
                    <select
                      value={profileData.accessibility.audioSpeed}
                      onChange={(e) => handleInputChange("accessibility.audioSpeed", e.target.value)}
                      className="w-full max-w-xs h-10 px-3 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500 text-sm bg-white"
                    >
                      <option value="0.75">Slow (0.75x)</option>
                      <option value="1">Normal (1x)</option>
                      <option value="1.25">Fast (1.25x)</option>
                      <option value="1.5">Very Fast (1.5x)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 py-8 px-4">
      <div className="max-w-2xl mx-auto px-2 sm:px-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us personalize your FoodSnap experience</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative flex-1">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 transition-colors duration-500 ${
                    currentStep > index ? "bg-gradient-to-r from-orange-500 to-lime-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Step Circle */}
              <motion.div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 z-10 ${
                  currentStep >= index ? `bg-gradient-to-r ${step.color} text-white` : "bg-gray-200 text-gray-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentStep > index ? <Check className="w-6 h-6" /> : step.icon}
              </motion.div>

              {/* Step Label */}
              <div className="text-center mt-2">
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    currentStep >= index ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {/* Success Message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <p className="text-green-800 font-medium">Profile saved successfully!</p>
                        <p className="text-green-600 text-sm">Redirecting to dashboard...</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* General Error */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-800 text-sm">{errors.general}</p>
                  </div>
                </motion.div>
              )}

              {/* Current Step Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-600">{steps[currentStep].description}</p>
              </div>

              {/* Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-3">
                  <div className="flex flex-col space-y-2">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="w-full flex items-center justify-center bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={handleSkip}
                      variant="ghost"
                      className="w-full text-gray-500 hover:text-gray-700"
                    >
                      Skip for Now
                    </Button>
                  </div>

                  <div className="w-full">
                    {currentStep < steps.length - 1 ? (
                      <Button
                        onClick={nextStep}
                        className="w-full bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white flex items-center justify-center"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                      >
                        {saving ? (
                          <div className="flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Saving Profile...
                          </div>
                        ) : (
                          "Complete Setup"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex justify-between items-center">
                  <div className="flex space-x-3">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex items-center bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={handleSkip}
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Skip for Now
                    </Button>
                  </div>

                  <div>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        onClick={nextStep}
                        className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white flex items-center"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white"
                      >
                        {saving ? (
                          <div className="flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Saving Profile...
                          </div>
                        ) : (
                          "Complete Setup"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
