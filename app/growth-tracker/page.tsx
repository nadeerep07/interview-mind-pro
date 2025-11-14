"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, GlowButton, GradientText, StatsCard, AnimatedBadge } from "@/components/animated-components"
import { CardGrid } from "@/components/card-grid"
import { SimpleLineChart, SimpleBarChart } from "@/components/simple-chart"
import { useAuth } from "@/lib/auth-context"
import { TrendingUp, Calendar, Target, Zap, Loader2 ,Rocket,Flame} from "lucide-react"

export default function GrowthTrackerPage() {
  const { user } = useAuth()

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("month")

  // FETCH REAL USER STATS
  useEffect(() => {
    if (!user?.id) return

    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/${user.id}`)
        const data = await res.json()

        if (data.success) {
          setStats(data.stats)
        }
      } catch (err) {
        console.error("GrowthTracker: Failed to load stats", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])

  if (loading || !stats) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
        </div>
      </ProtectedLayout>
    )
  }

  // -----------------------------
  // 🔥 REAL-TIME DERIVED METRICS
  // -----------------------------

  const overallProgress = Math.round(
    (stats.communicationScore + stats.technicalKnowledge + stats.confidence) / 3
  )

  const sessionsThisMonth = stats.recentSessions.filter((s: any) => {
    const d = new Date(s.date)
    return d.getMonth() === new Date().getMonth()
  }).length

  const avgSessionScore =
    stats.recentSessions.length > 0
      ? Math.round(
          stats.recentSessions.reduce((a: number, b: any) => a + b.score, 0) /
            stats.recentSessions.length
        )
      : 0

  // Score History Chart (REAL)
  const scoreHistory = stats.recentSessions.map((s: any, index: number) => ({
    label: `S${stats.recentSessions.length - index}`,
    value: s.score,
  }))

  // Category Performance Chart (REAL)
  const categoryProgress = [
    { label: "Comm", value: stats.communicationScore },
    { label: "Tech", value: stats.technicalKnowledge },
    { label: "Problem", value: Math.round((stats.communicationScore + stats.technicalKnowledge) / 2) },
    { label: "Conf", value: stats.confidence },
  ]

  // Dynamic Milestones
  const milestones = [
    {
      title: "Sessions Completed",
      date: `${stats.sessionsCompleted} total`,
      status: "completed",
    },
    {
      title: "Vocabulary Learned",
      date: `${stats.wordsLearned} words`,
      status: stats.wordsLearned >= 20 ? "completed" : "in-progress",
    },
    {
      title: "Current Streak",
      date: `${stats.streakDays} days`,
      status: stats.streakDays >= 5 ? "completed" : "in-progress",
    },
    {
      title: "Overall Score Goal",
      date: `${overallProgress}% achieved`,
      status: overallProgress >= 70 ? "completed" : "in-progress",
    },
  ]

  // Dynamic Insights
 const insights = [
  {
    title: "Most Improved Area",
    description:
      stats.communicationScore > stats.technicalKnowledge
        ? "Communication has shown the strongest growth"
        : "Technical Skills have shown the strongest improvement",
    icon: <Rocket className="w-6 h-6 text-purple-neon" />,
  },
  {
    title: "Consistency",
    description: `You currently have a ${stats.streakDays}-day streak!`,
    icon: <Flame className="w-6 h-6 text-orange-400" />,
  },
  {
    title: "Next Goal",
    description: `Aim for ${overallProgress + 5}% next month`,
    icon: <Target className="w-6 h-6 text-green-400" />,
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
          <p className="text-muted-foreground">
            Monitor your interview preparation progress over time
          </p>
        </div>

        {/* Time Range Selector */}
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

        {/* Key Stats (REAL DATA) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Overall Progress"
            value={`${overallProgress}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            label="Sessions This Month"
            value={sessionsThisMonth.toString()}
            icon={<Calendar className="w-5 h-5" />}
            trend={{ value: 1, isPositive: true }}
          />
          <StatsCard
            label="Current Streak"
            value={`${stats.streakDays} days`}
            icon={<Zap className="w-5 h-5" />}
          />
          <StatsCard
            label="Avg Session Score"
            value={avgSessionScore.toString()}
            icon={<Target className="w-5 h-5" />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6">
            <SimpleLineChart
              data={scoreHistory}
              title="Overall Score Progression"
              height={250}
            />
          </GlassCard>

          <GlassCard className="p-6">
            <SimpleBarChart
              data={categoryProgress}
              title="Category Performance"
              height={250}
            />
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

                <AnimatedBadge>
                  {milestone.status === "completed" ? "✓ Done" : "In Progress"}
                </AnimatedBadge>
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
                <span className="text-foreground">
                  Improve technical interview preparation
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">2.</span>
                <span className="text-foreground">
                  Maintain your streak and daily vocabulary reviews
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">3.</span>
                <span className="text-foreground">
                  Join a mock interview session this week
                </span>
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
