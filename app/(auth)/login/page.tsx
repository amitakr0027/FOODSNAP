"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Scan, ArrowLeft, Check, AlertCircle, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const { login, loginWithGoogle, sendPasswordReset } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [isResetLoading, setIsResetLoading] = useState(false)

  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      await login(formData.email, formData.password)

      setShowSuccess(true)

      // Redirect existing users to home after 1 second
      setTimeout(() => {
        router.push("/home")
      }, 1000)
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "Invalid email or password"
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address"
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password"
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address"
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled"
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later"
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setErrors({})

    try {
      const { isNewUser } = await loginWithGoogle()

      setShowSuccess(true)

      // Check if user is new or existing and redirect accordingly
      setTimeout(() => {
        if (isNewUser) {
          router.push("/profile/setup") // New Google users → profile setup
        } else {
          router.push("/home") // Existing Google users → home
        }
      }, 1000)
    } catch (error: any) {
      console.error("Google login error:", error)
      let errorMessage = "Failed to sign in with Google"
      
      // Handle specific Google Auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled"
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by browser"
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in was cancelled"
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter your email address first" })
      return
    }

    setIsResetLoading(true)
    setErrors({})

    try {
      await sendPasswordReset(formData.email)
      setResetEmailSent(true)
      setShowForgotPassword(false)
    } catch (error: any) {
      console.error("Password reset error:", error)
      let errorMessage = "Failed to send password reset email"
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address"
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address"
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsResetLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back to{" "}
                <span className="bg-gradient-to-r from-orange-600 to-lime-600 bg-clip-text text-transparent">
                  FoodSnap
                </span>
              </CardTitle>
              <p className="text-gray-600">Sign in to continue your healthy food journey</p>
            </CardHeader>

            <CardContent>
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
                        <p className="text-green-800 font-medium">Login successful!</p>
                        <p className="text-green-600 text-sm">Redirecting...</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset Email Sent */}
              <AnimatePresence>
                {resetEmailSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-blue-800 font-medium">Password reset email sent!</p>
                        <p className="text-blue-600 text-sm">Check your inbox for reset instructions</p>
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

              <form onSubmit={handleEmailLogin} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 h-12 ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } focus:border-orange-500 focus:ring-orange-500`}
                      placeholder="Enter your email"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 h-12 ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      } focus:border-orange-500 focus:ring-orange-500`}
                      placeholder="Enter your password"
                      disabled={isLoading || isGoogleLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading || isGoogleLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      disabled={isLoading || isGoogleLoading}
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-orange-600 hover:text-orange-700 underline"
                    disabled={isLoading || isGoogleLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">or continue with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 rounded-full font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in with Google...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5 mr-3"
                    />
                    Continue with Google
                  </div>
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-medium underline">
                    Sign up here
                  </Link>
                </p>
              </div>

              {/* Skip Option */}
              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  disabled={isLoading || isGoogleLoading}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowForgotPassword(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
                <p className="text-gray-600 mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <div className="space-y-4">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12"
                    disabled={isResetLoading}
                  />
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => setShowForgotPassword(false)} 
                      variant="outline" 
                      className="flex-1"
                      disabled={isResetLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleForgotPassword}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-lime-500"
                      disabled={isResetLoading}
                    >
                      {isResetLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Sending...
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}