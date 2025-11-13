"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, GradientText, StatsCard } from "@/components/animated-components"
import { ProgressBar } from "@/components/progress-bar"
import { useAuth } from "@/lib/auth-context"
import { TrendingUp, Award, Target } from "lucide-react"

export default function ProfileStrengthPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const strengthScores = {
    communication: 72,
    technical: 58,
    problemSolving: 81,
    confidence: 65,
    clarity: 68,
    bodyLanguage: 74,
  }

  const competencyLevels = [
    { name: "Expert", range: "85-100", color: "text-green-400", users: 15 },
    { name: "Advanced", range: "70-84", color: "text-blue-neon", users: 42 },
    { name: "Intermediate", range: "55-69", color: "text-purple-neon", users: 58 },
    { name: "Beginner", range: "0-54", color: "text-yellow-400", users: 28 },
  ]

  const improvements = [
    { date: "2 weeks ago", action: "Communication", improvement: "+8%" },
    { date: "3 weeks ago", action: "Technical Knowledge", improvement: "+5%" },
    { date: "1 month ago", action: "Confidence", improvement: "+12%" },
  ]

  const recommendations = [
    "Focus on technical depth - practice with coding challenges",
    "Record yourself answering questions to improve body language",
    "Work on structured problem-solving methodology",
    "Join mock interview sessions with peers",
  ]

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Profile <GradientText>Strength</GradientText>
          </h1>
          <p className="text-muted-foreground">Track your interview readiness across key competencies</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            label="Overall Score"
            value="70"
            icon={<Award className="w-5 h-5" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard label="Best Competency" value="Problem Solving" icon={<Target className="w-5 h-5" />} />
          <StatsCard
            label="Sessions Completed"
            value="24"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competency Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Competency Breakdown</h2>

            <div className="space-y-4">
              {Object.entries(strengthScores).map(([competency, score]) => (
                <div key={competency}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {competency.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        score >= 80
                          ? "text-green-400"
                          : score >= 70
                            ? "text-blue-neon"
                            : score >= 60
                              ? "text-purple-neon"
                              : "text-yellow-400"
                      }`}
                    >
                      {score}%
                    </span>
                  </div>
                  <ProgressBar value={score} max={100} />
                </div>
              ))}
            </div>
          </div>

          {/* Competency Levels */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Your Level</h2>
            <GlassCard className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2">
                  <GradientText>Intermediate</GradientText>
                </div>
                <p className="text-muted-foreground text-sm">Score: 55-69 range</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                {competencyLevels.map((level) => (
                  <div key={level.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${level.color}`}></div>
                      <span className="text-foreground">{level.name}</span>
                    </div>
                    <span className="text-muted-foreground">{level.users} users</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Recent Improvements */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Recent Improvements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {improvements.map((item, index) => (
              <GlassCard key={index} className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.date}</p>
                <h4 className="font-semibold text-foreground">{item.action}</h4>
                <span className="text-lg font-bold text-green-400">{item.improvement}</span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Recommendations</h2>
          <GlassCard className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-neon to-blue-neon flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-foreground">{rec}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </ProtectedLayout>
  )
}
