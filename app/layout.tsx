import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "MySaadi - Find Your Soulmate in Just ₹39",
  description:
    "The modern matrimony platform for Gen-Z. Discover meaningful connections with verified profiles, smart matching, and affordable pricing.",
  keywords: ["matrimony", "marriage", "dating", "soulmate", "wedding", "match"],
  openGraph: {
    title: "MySaadi - Find Your Soulmate in Just ₹39",
    description: "The modern matrimony platform for Gen-Z",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#c86464",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
