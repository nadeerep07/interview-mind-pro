"use client"

import { useEffect, useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, StatsCard, GlowButton, GradientText, AnimatedBadge } from "@/components/animated-components"
import { CardGrid } from "@/components/card-grid"
import { ProgressBar } from "@/components/progress-bar"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Brain, Zap, Target, TrendingUp, BookOpen } from "lucide-react"

// 📊 Charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid
} from "recharts"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  if (!user) return
  
  const fetchStats = async () => {
    try {
      const userId = user._id || user.id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/${userId}`
      )
      const data = await res.json()

      const s = data.stats || {}

      // Apply all defaults (fixes the crash)
      setStats({
        profileStrength: s.profileStrength ?? 0,
        sessionsCompleted: s.sessionsCompleted ?? 0,
        wordsLearned: s.wordsLearned ?? 0,
        streakDays: s.streakDays ?? 0,

        communicationScore: s.communicationScore ?? 0,
        technicalKnowledge: s.technicalKnowledge ?? 0,
        confidence: s.confidence ?? 0,

        recentSessions: s.recentSessions ?? [],
        upcomingChallenges: s.upcomingChallenges ?? [
          { category: "Behavioral", difficulty: "Intermediate" },
          { category: "Technical", difficulty: "Hard" },
          { category: "Case Study", difficulty: "Medium" }
        ]
      })

    } catch (err) {
      console.error("Stats fetch failed", err)
    } finally {
      setLoading(false)
    }
  }

  fetchStats()
}, [user])


  if (loading || !stats) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-full p-10 text-xl text-muted-foreground">
          Loading your dashboard...
        </div>
      </ProtectedLayout>
    )
  }

  // 📊 Radar chart data
  const radarData = [
    { skill: "Communication", value: stats.communicationScore },
    { skill: "Technical", value: stats.technicalKnowledge },
    { skill: "Confidence", value: stats.confidence },
  ]

  // 📈 Performance trend (recent session scores)
  const lineData = stats.recentSessions.map((s: any) => ({
    name: s.date,
    score: s.score,
  }))

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
            />
            <StatsCard
              label="Sessions Completed"
              value={stats.sessionsCompleted}
              icon={<Brain className="w-5 h-5" />}
            />
            <StatsCard
              label="Words Learned"
              value={stats.wordsLearned}
              icon={<BookOpen className="w-5 h-5" />}
            />
            <StatsCard
              label="Current Streak"
              value={`${stats.streakDays} days`}
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </CardGrid>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 📈 Performance Trend Line Chart */}
          <GlassCard className="lg:col-span-2 p-6">
            <h2 className="text-xl font-bold mb-4">Performance Trend</h2>
            {lineData.length === 0 ? (
              <p className="text-muted-foreground">No activity yet. Start your first AI session!</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={lineData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* 🎯 Skills Radar Chart */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4">Skill Breakdown</h2>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Recent Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Recent Sessions</h2>
              <Link href="/ai-analysis">
                <button className="text-purple-neon hover:text-purple-neon/80 text-sm font-semibold">
                  View All
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentSessions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No sessions yet. Try your first AI analysis!</p>
              ) : (
                stats.recentSessions.map((session: any, idx: number) => (
                  <GlassCard key={idx} className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <GradientText className="text-2xl">{session.score}</GradientText>
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">/10</span>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </div>

          {/* Profile Strength */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Profile Strength</h2>
            <GlassCard className="space-y-6">
              <ProgressBar value={stats.profileStrength} label="Overall Score" showPercentage />

              {/* Breakdown */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground">Communication</p>
                <ProgressBar value={stats.communicationScore} />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Technical Knowledge</p>
                <ProgressBar value={stats.technicalKnowledge} />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <ProgressBar value={stats.confidence} />
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Upcoming Challenges */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Challenges</h2>
          <CardGrid cols={3}>
            {stats.upcomingChallenges.map((challenge: any, idx: number) => (
              <GlassCard key={idx} className="flex flex-col gap-4 p-4">
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
