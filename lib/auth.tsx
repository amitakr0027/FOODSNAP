"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";

import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
} from "firebase/auth";

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

// Initialize Google Provider with proper configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, fullName: string) => Promise<{ user: User; isNewUser: boolean }>;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<{ user: User; isNewUser: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>; // ✅ Added this
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email signup with setDoc
  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName: fullName });

      // Create user document in Firestore using setDoc
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: fullName || user.displayName || "",
        fullName: fullName || "",
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        signUpMethod: "email",
        updatedAt: serverTimestamp(),
      });

      return { user, isNewUser: true };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Email login
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login using setDoc with merge
      await setDoc(doc(db, "users", user.uid), {
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Google login/signup with setDoc
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const additionalUserInfo = getAdditionalUserInfo(result);
      
      // Check if user document already exists
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      const isNewUser = !userDocSnap.exists() || additionalUserInfo?.isNewUser === true;

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
        });
      } else {
        // Update existing user's last login using setDoc with merge
        await setDoc(userDocRef, {
          lastLoginAt: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      return { user, isNewUser };
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Reset password (original function)
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  // ✅ Added sendPasswordReset function (alias for resetPassword)
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    try {
      if (!user) throw new Error("No user logged in");

      const updates: { displayName?: string; photoURL?: string } = {};
      if (displayName !== undefined) updates.displayName = displayName;
      if (photoURL !== undefined) updates.photoURL = photoURL;

      await updateProfile(user, updates);

      // Update Firestore document using setDoc with merge
      const firestoreUpdates: any = {
        updatedAt: serverTimestamp(),
      };
      if (displayName !== undefined) {
        firestoreUpdates.displayName = displayName;
        firestoreUpdates.fullName = displayName;
      }
      if (photoURL !== undefined) firestoreUpdates.photoURL = photoURL;

      await setDoc(doc(db, "users", user.uid), firestoreUpdates, { merge: true });
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  // Update email
  const updateUserEmail = async (newEmail: string) => {
    try {
      if (!user) throw new Error("No user logged in");

      await updateEmail(user, newEmail);

      // Update Firestore document using setDoc with merge
      await setDoc(doc(db, "users", user.uid), {
        email: newEmail,
        emailVerified: false,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Email update error:", error);
      throw error;
    }
  };

  // Update password
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user || !user.email) throw new Error("No user logged in");

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Update last password change in Firestore using setDoc with merge
      await setDoc(doc(db, "users", user.uid), {
        lastPasswordChange: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    try {
      if (!user) throw new Error("No user logged in");
      await sendEmailVerification(user);
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    sendPasswordReset, // ✅ Added to context value
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to update profile completion status
export const updateProfileComplete = async (userId: string, profileData?: any) => {
  try {
    const updateData: any = {
      profileComplete: true,
      updatedAt: serverTimestamp(),
    };

    // Add any additional profile data
    if (profileData) {
      Object.assign(updateData, profileData);
    }

    await setDoc(doc(db, "users", userId), updateData, { merge: true });
  } catch (error) {
    console.error("Profile completion update error:", error);
    throw error;
  }
};