"use client"

import Link from "next/link"
import { GlowButton } from "@/components/animated-components"
import { GradientTextWrapper } from "@/components/glass-wrapper"
import Navbar from "@/components/navbar" // ⬅ correct import (default export)
import { Brain, Zap, BarChart3, Users } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI Interview Analysis",
      description: "Get instant feedback on your responses with advanced AI analysis",
    },
    {
      icon: Zap,
      title: "Daily Challenges",
      description: "Practice with curated interview questions every day",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics",
    },
    {
      icon: Users,
      title: "Vocabulary Builder",
      description: "Learn professional words and improve your communication",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Master Your <GradientTextWrapper>Interviews</GradientTextWrapper> with AI
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get real-time feedback, improve your communication skills, and land your dream job with InterviewMind Pro’s
            AI-powered coaching platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <GlowButton variant="primary" size="lg">
                Start Free Today
              </GlowButton>
            </Link>
            <Link href="#features">
              <GlowButton variant="outline" size="lg">
                Learn More
              </GlowButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powerful Tools for Interview <GradientTextWrapper>Success</GradientTextWrapper>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to prepare and excel in your interviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Interview Skills?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals already using InterviewMind Pro to land better jobs
          </p>
          <Link href="/register">
            <GlowButton variant="primary" size="lg">
              Get Started Free
            </GlowButton>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-12 text-center text-muted-foreground text-sm">
        © 2025 InterviewMind Pro. All rights reserved.
      </footer>
    </div>
  )
}
