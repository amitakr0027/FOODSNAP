"use client"

import { useState, useEffect } from "react"
import { profileStore, type UserProfile } from "@/lib/profile-store"

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial profile
    const initialProfile = profileStore.getProfile()
    setProfile(initialProfile)
    setLoading(false)

    // Subscribe to profile changes
    const unsubscribe = profileStore.subscribe((updatedProfile) => {
      setProfile(updatedProfile)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const updateProfile = (updates: Partial<UserProfile>) => {
    profileStore.updateProfile(updates)
  }

  const calculateDailyNeeds = () => {
    profileStore.calculateDailyNeeds()
  }

  const addScanToProgress = (scanData: any) => {
    profileStore.addScanToProgress(scanData)
  }

  const resetDailyProgress = () => {
    profileStore.resetDailyProgress()
  }

  const isProfileComplete = () => {
    return profileStore.isProfileComplete()
  }

  const markProfileComplete = () => {
    profileStore.markProfileComplete()
  }

  return {
    profile,
    loading,
    updateProfile,
    calculateDailyNeeds,
    addScanToProgress,
    resetDailyProgress,
    isProfileComplete,
    markProfileComplete,
  }
}
