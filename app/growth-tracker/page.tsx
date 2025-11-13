"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, GlowButton, GradientText, StatsCard, AnimatedBadge } from "@/components/animated-components"
import { CardGrid } from "@/components/card-grid"
import { SimpleLineChart, SimpleBarChart } from "@/components/simple-chart"
import { useAuth } from "@/lib/auth-context"
import { TrendingUp, Calendar, Target, Zap } from "lucide-react"

export default function GrowthTrackerPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("month")

  const scoreHistory = [
    { label: "W1", value: 62 },
    { label: "W2", value: 65 },
    { label: "W3", value: 68 },
    { label: "W4", value: 70 },
  ]

  const categoryProgress = [
    { label: "Comm", value: 72 },
    { label: "Tech", value: 58 },
    { label: "Problem", value: 81 },
    { label: "Conf", value: 65 },
  ]

  const milestones = [
    { title: "10 Sessions Completed", date: "2 weeks ago", status: "completed" },
    { title: "Reached 70 Score", date: "1 week ago", status: "completed" },
    { title: "Vocabulary Streak (7 days)", date: "3 days ago", status: "completed" },
    { title: "Master All Categories", date: "In Progress", status: "in-progress" },
  ]

  const insights = [
    {
      title: "Most Improved Area",
      description: "Communication skills improved by 15% this month",
      icon: "📈",
    },
    {
      title: "Consistency Award",
      description: "You have a 5-day practice streak!",
      icon: "🔥",
    },
    {
      title: "Next Goal",
      description: "Reach 75+ overall score next week",
      icon: "🎯",
    },
  ]

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Growth <GradientText>Tracker</GradientText>
          </h1>
          <p className="text-muted-foreground">Monitor your interview preparation progress over time</p>
        </div>

        {/* Time Range Selection */}
        <div className="flex gap-3 mb-8">
          {["week", "month", "3months", "6months"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                timeRange === range
                  ? "bg-gradient-to-r from-purple-neon to-blue-neon text-white"
                  : "bg-white/10 text-foreground hover:bg-white/20"
              }`}
            >
              {range === "week" && "This Week"}
              {range === "month" && "This Month"}
              {range === "3months" && "3 Months"}
              {range === "6months" && "6 Months"}
            </button>
          ))}
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Overall Progress"
            value="32%"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            label="Sessions This Month"
            value="12"
            icon={<Calendar className="w-5 h-5" />}
            trend={{ value: 3, isPositive: true }}
          />
          <StatsCard label="Current Streak" value="5 days" icon={<Zap className="w-5 h-5" />} />
          <StatsCard
            label="Avg Session Score"
            value="70.2"
            icon={<Target className="w-5 h-5" />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score Progression */}
          <GlassCard className="p-6">
            <SimpleLineChart data={scoreHistory} title="Overall Score Progression" height={250} />
          </GlassCard>

          {/* Category Performance */}
          <GlassCard className="p-6">
            <SimpleBarChart data={categoryProgress} title="Category Performance" height={250} />
          </GlassCard>
        </div>

        {/* Insights */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">AI Insights</h2>
          <CardGrid cols={3}>
            {insights.map((insight, index) => (
              <GlassCard key={index} className="space-y-4">
                <div className="text-4xl">{insight.icon}</div>
                <h3 className="font-bold text-foreground">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </GlassCard>
            ))}
          </CardGrid>
        </div>

        {/* Milestones */}
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Milestones</h2>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <GlassCard key={index} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      milestone.status === "completed" ? "bg-green-400" : "bg-purple-neon"
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                  </div>
                </div>
                <AnimatedBadge>{milestone.status === "completed" ? "✓ Done" : "In Progress"}</AnimatedBadge>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Next Steps</h2>
          <GlassCard className="p-6 space-y-4">
            <p className="text-foreground">Based on your progress, here's what we recommend:</p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">1.</span>
                <span className="text-foreground">Focus on technical interview preparation - your weakest area</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">2.</span>
                <span className="text-foreground">Maintain your current momentum with daily vocabulary reviews</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">3.</span>
                <span className="text-foreground">Join a mock interview session this week to practice with others</span>
              </li>
            </ul>
            <GlowButton variant="primary" size="lg" className="w-full mt-6">
              View Personalized Plan
            </GlowButton>
          </GlassCard>
        </div>
      </div>
    </ProtectedLayout>
  )
}
