"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, GradientText, StatsCard } from "@/components/animated-components"
import { ProgressBar } from "@/components/progress-bar"
import { useAuth } from "@/lib/auth-context"
import { TrendingUp, Award, Target, Loader2 } from "lucide-react"

interface UserStats {
  userId: string
  profileStrength: number
  sessionsCompleted: number
  wordsLearned: number
  streakDays: number
  lastSessionDate: string | null
  communicationScore: number
  technicalKnowledge: number
  confidence: number
  recentSessions: {
    title: string
    score: number
    date: string
  }[]
  upcomingChallenges: {
    category: string
    difficulty: string
  }[]
}

interface CompetencyDistribution {
  name: string
  range: string
  color: string
  users: number
}

export default function ProfileStrengthPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [distribution, setDistribution] = useState({
  Expert: 0,
  Advanced: 0,
  Intermediate: 0,
  Beginner: 0
});


  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/${user.id}`)
        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
        } else {
          setError("Failed to load stats")
        }
      } catch (err) {
        setError("Error fetching stats")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])
  useEffect(() => {
  const fetchDistribution = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/all/distribution`);
      const data = await res.json();

      if (data.success) {
        setDistribution(data.distribution);
      }
    } catch (err) {
      console.log("Distribution fetch error", err);
    }
  };

  fetchDistribution();
}, []);


  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
        </div>
      </ProtectedLayout>
    )
  }

  if (error || !stats) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <GlassCard className="p-8 text-center">
            <p className="text-red-400">{error || "Unable to load profile data"}</p>
          </GlassCard>
        </div>
      </ProtectedLayout>
    )
  }

  // Calculate derived metrics
  const strengthScores = {
    communication: stats.communicationScore,
    technical: stats.technicalKnowledge,
    confidence: stats.confidence,
    problemSolving: Math.round((stats.communicationScore + stats.technicalKnowledge) / 2),
    clarity: Math.round((stats.communicationScore + stats.confidence) / 2),
    resilience: Math.round((stats.technicalKnowledge + stats.confidence) / 2),
  }

  const overallScore = Math.round(
    Object.values(strengthScores).reduce((sum, score) => sum + score, 0) / 
    Object.keys(strengthScores).length
  )

  // Determine competency level
  const getCompetencyLevel = (score: number) => {
    if (score >= 85) return "Expert"
    if (score >= 70) return "Advanced"
    if (score >= 55) return "Intermediate"
    return "Beginner"
  }

  const userLevel = getCompetencyLevel(overallScore)

const competencyLevels = [
  { name: "Expert", range: "85-100", color: "text-green-400", users: distribution.Expert },
  { name: "Advanced", range: "70-84", color: "text-blue-neon", users: distribution.Advanced },
  { name: "Intermediate", range: "55-69", color: "text-purple-neon", users: distribution.Intermediate },
  { name: "Beginner", range: "0-54", color: "text-yellow-400", users: distribution.Beginner },
];


  // Calculate improvements from recent sessions
  const improvements = stats.recentSessions
    .slice(0, 3)
    .map((session, index) => {
      const previousScore = stats.recentSessions[index + 1]?.score || session.score - 5
      const improvement = session.score - previousScore
      return {
        date: new Date(session.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        action: session.title,
        improvement: improvement > 0 ? `+${improvement}%` : `${improvement}%`,
      }
    })

  // Find best competency
  const bestCompetency = Object.entries(strengthScores).reduce((best, [key, value]) => 
    value > best.value ? { key, value } : best
  , { key: "", value: 0 })

  const formatCompetencyName = (name: string) => 
    name.replace(/([A-Z])/g, " $1").trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const recommendations = [
    stats.technicalKnowledge < 70 && "Focus on technical depth - practice with coding challenges",
    stats.confidence < 70 && "Record yourself answering questions to improve body language",
    stats.communicationScore < 70 && "Work on structured problem-solving methodology",
    stats.sessionsCompleted < 10 && "Join mock interview sessions with peers",
  ].filter(Boolean) as string[]

  // Add default recommendations if none needed
  if (recommendations.length === 0) {
    recommendations.push(
      "Keep practicing to maintain your excellent performance",
      "Challenge yourself with harder difficulty levels",
      "Help mentor others to reinforce your knowledge"
    )
  }

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
            value={overallScore.toString()}
            icon={<Award className="w-5 h-5" />}
            trend={{ 
              value: stats.recentSessions.length > 1 
                ? stats.recentSessions[0].score - stats.recentSessions[1].score 
                : 0, 
              isPositive: stats.recentSessions.length > 1 
                ? stats.recentSessions[0].score > stats.recentSessions[1].score 
                : true 
            }}
          />
          <StatsCard 
            label="Best Competency" 
            value={formatCompetencyName(bestCompetency.key)} 
            icon={<Target className="w-5 h-5" />} 
          />
          <StatsCard
            label="Sessions Completed"
            value={stats.sessionsCompleted.toString()}
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ 
              value: Math.min(stats.sessionsCompleted, 8), 
              isPositive: true 
            }}
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
                      {formatCompetencyName(competency)}
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
                  <GradientText>{userLevel}</GradientText>
                </div>
                <p className="text-muted-foreground text-sm">
                  Score: {overallScore}%
                </p>
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
        {improvements.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Recent Improvements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {improvements.map((item, index) => (
                <GlassCard key={index} className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                  <h4 className="font-semibold text-foreground">{item.action}</h4>
                  <span className={`text-lg font-bold ${
                    item.improvement.startsWith('+') ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {item.improvement}
                  </span>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

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

        {/* Upcoming Challenges */}
        {stats.upcomingChallenges.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Upcoming Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.upcomingChallenges.map((challenge, index) => (
                <GlassCard key={index} className="space-y-3">
                  <h4 className="font-semibold text-foreground">{challenge.category}</h4>
                  <span className={`text-sm font-medium ${
                    challenge.difficulty === 'Hard' ? 'text-red-400' :
                    challenge.difficulty === 'Medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}