// lib/firebase.ts
"use client";

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // ✅ correct
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Analytics (safe check so it doesn’t break in Node.js/SSR)
// export let analytics: any = null;
// if (typeof window !== "undefined") {
//   isSupported().then((yes) => {
//     if (yes) analytics = getAnalytics(app);
//   });
// }

// ✅ Emulators (only in dev + browser)
// if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
//   try {
//     connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
//     connectFirestoreEmulator(db, "127.0.0.1", 8080);
//   } catch (e) {
//     console.log("Emulators already connected");
//   }
// }

export default app;
