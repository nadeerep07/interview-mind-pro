import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = "https://interview-mind-pro.vercel.app"
const authorUrl = "https://nadeerep-portfolio.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "InterviewMind Pro | AI Interview Preparation Platform by Nadeer E P",
    template: "%s | InterviewMind Pro",
  },
  description:
    "AI-powered interview coach built by Nadeer E P. Practice technical & behavioral interview questions with real-time feedback and intelligent scoring.",
  keywords: [
    "InterviewMind Pro",
    "Nadeer E P",
    "Nadeer Flutter Developer",
    "AI Interview Coach",
    "Nadeer Developer",
    "Full Stack Developer",
    "Next.js AI App",
  ],
  authors: [{ name: "Nadeer E P", url: authorUrl }],
  creator: "Nadeer E P",
  publisher: "Nadeer E P",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "InterviewMind Pro | AI Interview Preparation Platform by Nadeer E P",
    description:
      "AI-powered interview coach built by Nadeer E P. Practice technical & behavioral interview questions with real-time feedback and intelligent scoring.",
    siteName: "InterviewMind Pro",
    images: [
      {
        url: "/nadeer-icon.png",
        width: 800,
        height: 800,
        alt: "InterviewMind Pro - AI Interview Preparation Platform by Nadeer E P",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewMind Pro | AI Interview Preparation Platform by Nadeer E P",
    description:
      "AI-powered interview coach built by Nadeer E P. Practice technical & behavioral interview questions with real-time feedback and intelligent scoring.",
    creator: "@nadeerep",
    images: ["/nadeer-icon.png"],
  },
  icons: {
    icon: [{ url: "/nadeer-icon.png" }],
    apple: "/nadeer-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1e" },
  ],
  userScalable: false,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "InterviewMind Pro",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "AI-powered interview coach built by Nadeer E P. Practice technical & behavioral interview questions with real-time feedback and intelligent scoring.",
  author: {
    "@type": "Person",
    name: "Nadeer E P",
    url: authorUrl,
    sameAs: [
      "https://github.com/nadeerep07",
      "https://www.linkedin.com/in/nadeerep/",
      "https://nadeerep-portfolio.vercel.app",
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${_geist.className} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
