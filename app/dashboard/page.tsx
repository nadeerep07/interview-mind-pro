"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, StatsCard, GlowButton, GradientText, AnimatedBadge } from "@/components/animated-components"
import { CardGrid } from "@/components/card-grid"
import { ProgressBar } from "@/components/progress-bar"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Brain, Zap, Target, TrendingUp, BookOpen } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats] = useState({
    profileStrength: 65,
    sessionsCompleted: 12,
    wordsLearned: 24,
    streakDays: 5,
  })

  const recentSessions = [
    { id: 1, title: "Why do you want this job?", score: 8.5, date: "Today" },
    { id: 2, title: "Tell me about yourself", score: 7.8, date: "Yesterday" },
    { id: 3, title: "Describe your experience", score: 8.2, date: "2 days ago" },
  ]

  const upcomingChallenges = [
    { id: 1, category: "Behavioral", difficulty: "Intermediate" },
    { id: 2, category: "Technical", difficulty: "Hard" },
    { id: 3, category: "Case Study", difficulty: "Medium" },
  ]

  return (
    <ProtectedLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, <GradientText>{user?.name}</GradientText>
            </h1>
            <p className="text-muted-foreground">Here's your interview preparation progress</p>
          </div>
          <Link href="/daily">
            <GlowButton variant="primary" size="lg">
              <Zap className="w-5 h-5" />
              Daily Challenge
            </GlowButton>
          </Link>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Your Stats</h2>
          <CardGrid cols={4}>
            <StatsCard
              label="Profile Strength"
              value={`${stats.profileStrength}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              label="Sessions Completed"
              value={stats.sessionsCompleted}
              icon={<Brain className="w-5 h-5" />}
              trend={{ value: 2, isPositive: true }}
            />
            <StatsCard
              label="Words Learned"
              value={stats.wordsLearned}
              icon={<BookOpen className="w-5 h-5" />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              label="Current Streak"
              value={`${stats.streakDays} days`}
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ value: 1, isPositive: true }}
            />
          </CardGrid>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Recent Sessions</h2>
              <Link href="/ai-analysis">
                <button className="text-purple-neon hover:text-purple-neon/80 text-sm font-semibold">View All</button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentSessions.map((session) => (
                <GlassCard key={session.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <GradientText className="text-2xl">{session.score}</GradientText>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">/10</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Profile Strength */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Profile Strength</h2>
            <GlassCard className="space-y-6">
              <ProgressBar value={stats.profileStrength} label="Overall Score" showPercentage />

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Communication</span>
                  <span className="font-semibold text-foreground">72%</span>
                </div>
                <ProgressBar value={72} />
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Technical Knowledge</span>
                  <span className="font-semibold text-foreground">58%</span>
                </div>
                <ProgressBar value={58} />
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold text-foreground">65%</span>
                </div>
                <ProgressBar value={65} />
              </div>

              <Link href="/profile-strength" className="block">
                <GlowButton variant="outline" size="sm" className="w-full">
                  View Full Report
                </GlowButton>
              </Link>
            </GlassCard>
          </div>
        </div>

        {/* Daily Challenges */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Challenges</h2>
          <CardGrid cols={3}>
            {upcomingChallenges.map((challenge) => (
              <GlassCard key={challenge.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Target className="w-6 h-6 text-purple-neon" />
                  <AnimatedBadge>{challenge.difficulty}</AnimatedBadge>
                </div>
                <h3 className="font-semibold text-foreground">{challenge.category} Interview</h3>
                <p className="text-sm text-muted-foreground flex-1">
                  Practice {challenge.category.toLowerCase()} interview skills
                </p>
                <GlowButton variant="secondary" size="sm" className="w-full">
                  Start Challenge
                </GlowButton>
              </GlassCard>
            ))}
          </CardGrid>
        </div>
      </div>
    </ProtectedLayout>
  )
}

function BarChart3Icon(props: any) {
  return <TrendingUp {...props} />
}
