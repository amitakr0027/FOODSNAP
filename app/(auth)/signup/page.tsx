"use client"

import React, { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, User, Scan, ArrowLeft, Check, AlertCircle, Loader2, Shield } from "lucide-react"

// Import Firebase instance from your lib
import { auth, db } from "@/lib/firebase"

// Firebase auth imports
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth'

// Firestore imports
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp
} from 'firebase/firestore'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  // Password strength calculation
  useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[a-z]/.test(password)) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      if (/[^A-Za-z0-9]/.test(password)) strength += 25
      return Math.min(strength, 100)
    }
    setPasswordStrength(calculateStrength(formData.password))
  }, [formData.password])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters"
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (passwordStrength < 75) {
      newErrors.password = "Password is too weak. Include uppercase, lowercase, numbers, and symbols"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
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

  // Email signup with setDoc
  const handleEmailSignup = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Create user document in Firestore using setDoc
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: formData.fullName || user.displayName || "",
        fullName: formData.fullName || "",
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        signUpMethod: "email",
        updatedAt: serverTimestamp(),
      })

      setShowSuccess(true)

      // Redirect to profile setup after success
      setTimeout(() => {
        window.location.href = "/profile/setup"
      }, 2000)
    } catch (error: any) {
      console.error("Signup error:", error)
      let errorMessage = "Failed to create account. Please try again."
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists. Try signing in instead."
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password."
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Google signup with setDoc
  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    setErrors({})

    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user document already exists
      const userDocRef = doc(db, "users", user.uid)
      const userDocSnap = await getDoc(userDocRef)
      
      const isNewUser = !userDocSnap.exists()

      if (isNewUser) {
        // Create new user document using setDoc
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          fullName: user.displayName || "",
          photoURL: user.photoURL || null,
          emailVerified: user.emailVerified,
          profileComplete: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          signUpMethod: "google",
          updatedAt: serverTimestamp(),
        })
      } else {
        // Update existing user's last login using setDoc with merge
        await setDoc(userDocRef, {
          lastLoginAt: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        }, { merge: true })
      }

      setShowSuccess(true)

      // Redirect based on user status
      setTimeout(() => {
        if (isNewUser) {
          window.location.href = "/profile/setup"
        } else {
          window.location.href = "/home"
        }
      }, 2000)
    } catch (error: any) {
      console.error("Google signup error:", error)
      let errorMessage = "Failed to sign up with Google. Please try again."
      
      // Handle specific Google Auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-up was cancelled"
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by browser"
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-up was cancelled"
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSkip = () => {
    window.location.href = "/home"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button 
          onClick={() => window.location.href = "/"}
          className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-xl p-6">
            <div className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Join{" "}
                <span className="bg-gradient-to-r from-orange-600 to-lime-600 bg-clip-text text-transparent">
                  FoodSnap
                </span>
              </h1>
              <p className="text-gray-600">Create your account to start your healthy food journey</p>
            </div>

            <div>
              {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-green-800 font-medium">Account created successfully!</p>
                      <p className="text-green-600 text-sm">Redirecting to profile setup...</p>
                    </div>
                  </div>
                </div>
              )}

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-800 text-sm">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`w-full pl-10 h-12 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.fullName 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      }`}
                      placeholder="Enter your full name"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full pl-10 h-12 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.email 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      }`}
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

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`w-full pl-10 pr-10 h-12 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.password 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      }`}
                      placeholder="Create a strong password"
                      disabled={isLoading || isGoogleLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Password strength:</span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength >= 75
                              ? "text-green-600"
                              : passwordStrength >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`w-full pl-10 pr-10 h-12 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.confirmPassword 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading || isGoogleLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 mt-1"
                      disabled={isLoading || isGoogleLoading}
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="/terms" className="text-orange-600 hover:text-orange-700 underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleEmailSignup}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">or continue with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading || isGoogleLoading}
                className="w-full h-12 border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 bg-white"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing up with Google...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5 mr-3"
                    />
                    Continue with Google
                  </div>
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-orange-600 hover:text-orange-700 font-medium underline">
                    Sign in here
                  </a>
                </p>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}