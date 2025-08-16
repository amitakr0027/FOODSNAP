import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"  // ✅ import our AuthProvider

export const metadata: Metadata = {
  title: "FoodSnap - Scan Smart, Eat Fresh",
  description:
    "Scan food barcodes. Get instant nutrition insights. Make delicious, healthy choices. Your personal food companion for better eating.",
  keywords: "food scanner, nutrition, health, barcode, AI analysis, diet, healthy eating",
  authors: [{ name: "FoodSnap Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f97316",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* ✅ Wrap the whole app with AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
