"use client";

import { useState, useEffect } from "react";
import { ProtectedLayout } from "@/components/protected-layout";
import {
  GlassCard,
  GlowButton,
  GradientText,
  StatsCard,
  AnimatedBadge,
} from "@/components/animated-components";
import { CardGrid } from "@/components/card-grid";
import { SimpleLineChart, SimpleBarChart } from "@/components/simple-chart";
import { useAuth } from "@/lib/auth-context";
import { GoalModal } from "@/components/GoalModal";
import {
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Loader2,
  Rocket,
  Flame,
  Trash2,
  CheckCircle2,
} from "lucide-react";

export default function GrowthTrackerPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [showGoalModal, setShowGoalModal] = useState(false);

  // -----------------------------
  // 🔥 FETCH REAL USER STATS
  // -----------------------------
  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/${user.id}`
        );
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("GrowthTracker: Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  // -----------------------------
  // 🔥 CALCULATE MILESTONE PROGRESS
  // -----------------------------
  const getMilestoneProgress = (milestone: any) => {
    let current = 0;

    switch (milestone.type) {
      case "score":
        // Overall progress percentage
        current = Math.round(
          (stats.communicationScore +
            stats.technicalKnowledge +
            stats.confidence) /
            3
        );
        break;
      case "sessions":
        current = stats.sessionsCompleted;
        break;
      case "streak":
        current = stats.streakDays;
        break;
      case "vocab":
        current = stats.wordsLearned;
        break;
    }

    const progress = Math.min(100, Math.round((current / milestone.target) * 100));
    const isCompleted = current >= milestone.target;

    return { current, progress, isCompleted };
  };

  // -----------------------------
  // 🔥 DELETE MILESTONE
  // -----------------------------
  const handleDeleteMilestone = async (index: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/milestones/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, index }),
        }
      );

      // Refresh stats
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/${user?.id}`
      );
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error("Failed to delete milestone", err);
    }
  };

  // -----------------------------
  // 🔥 MARK MILESTONE COMPLETE
  // -----------------------------
  const handleCompleteMilestone = async (index: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/milestones/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, index }),
        }
      );

      // Refresh stats
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/${user?.id}`
      );
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error("Failed to complete milestone", err);
    }
  };

  if (loading || !stats) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
        </div>
      </ProtectedLayout>
    );
  }

  // -----------------------------
  // 🔥 RANGE FILTERING UTILITY
  // -----------------------------
  function filterByRange(sessions: any[], range: string) {
    const now = new Date();

    return sessions.filter((session: any) => {
      const date = new Date(session.date);
      const days = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      if (range === "week") return days <= 7;
      if (range === "month") return date.getMonth() === now.getMonth();
      if (range === "3months") {
        const diffMonths =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth());
        return diffMonths <= 3;
      }
      if (range === "6months") {
        const diffMonths =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth());
        return diffMonths <= 6;
      }
      return true;
    });
  }

  const filteredSessions = filterByRange(stats.recentSessions || [], timeRange);

  // -----------------------------
  // 🔥 REAL METRICS (Range Based) - WITH NULL CHECKS
  // -----------------------------
  const communicationScore = stats.communicationScore || 0;
  const technicalKnowledge = stats.technicalKnowledge || 0;
  const confidence = stats.confidence || 0;

  const overallProgress = Math.round(
    (communicationScore + technicalKnowledge + confidence) / 3
  );

  const sessionsInRange = filteredSessions.length;

  const avgSessionScore =
    filteredSessions.length > 0
      ? Math.round(
          filteredSessions.reduce((a: number, b: any) => a + (b.score || 0), 0) /
            filteredSessions.length
        )
      : 0;

  // Score History (Range-based) - WITH NULL CHECKS
  const scoreHistory = filteredSessions.length > 0 
    ? filteredSessions.map((s: any, index: number) => ({
        label: `S${filteredSessions.length - index}`,
        value: s.score || 0,
      }))
    : [
        { label: "S1", value: 0 },
        { label: "S2", value: 0 },
        { label: "S3", value: 0 },
      ];

  // Category Performance (Range-based) - WITH NULL CHECKS
  const categoryProgress = [
    {
      label: "Comm",
      value: communicationScore,
    },
    {
      label: "Tech",
      value: technicalKnowledge,
    },
    {
      label: "Problem",
      value: Math.round((communicationScore + technicalKnowledge) / 2),
    },
    {
      label: "Conf",
      value: confidence,
    },
  ];

  // -----------------------------
  // 🔥 Insights (Range-based)
  // -----------------------------
  const insights = [
    {
      title: "Most Improved Area",
      description:
        communicationScore > technicalKnowledge
          ? "Communication is your strongest trend this period"
          : "Technical skills have shown more growth in this range",
      icon: <Rocket className="w-6 h-6 text-purple-neon" />,
    },
    {
      title: "Consistency",
      description: `You completed ${filteredSessions.length} sessions in this period`,
      icon: <Flame className="w-6 h-6 text-orange-400" />,
    },
    {
      title: "Next Goal",
      description: `Aim for +5% improvement by next ${timeRange}`,
      icon: <Target className="w-6 h-6 text-green-400" />,
    },
  ];

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
          />

          <StatsCard
            label="Sessions"
            value={sessionsInRange.toString()}
            icon={<Calendar className="w-5 h-5" />}
          />

          <StatsCard
            label="Current Streak"
            value={`${stats.streakDays || 0} days`}
            icon={<Zap className="w-5 h-5" />}
          />

          <StatsCard
            label="Avg Score"
            value={avgSessionScore.toString()}
            icon={<Target className="w-5 h-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6">
            <SimpleLineChart
              data={scoreHistory}
              title="Score Progression"
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
          <h2 className="text-2xl font-bold text-foreground mb-6">
            AI Insights
          </h2>
          <CardGrid cols={3}>
            {insights.map((insight, index) => (
              <GlassCard key={index} className="space-y-4">
                <div>{insight.icon}</div>
                <h3 className="font-bold text-foreground">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </GlassCard>
            ))}
          </CardGrid>
        </div>

        {/* User Milestones */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>

            <GlowButton
              variant="secondary"
              size="sm"
              onClick={() => setShowGoalModal(true)}
              className="px-4 py-2"
            >
              + Add Goal
            </GlowButton>
          </div>

          {stats.milestones && stats.milestones.length > 0 ? (
            <div className="space-y-3">
              {stats.milestones.map((milestone: any, index: number) => {
                const { current, progress, isCompleted } =
                  getMilestoneProgress(milestone);

                return (
                  <GlassCard
                    key={index}
                    className="p-6 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                            isCompleted || milestone.completed
                              ? "bg-green-400"
                              : "bg-purple-neon animate-pulse"
                          }`}
                        ></div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {milestone.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {current} / {milestone.target}{" "}
                            {milestone.type === "score" && "%"}
                            {milestone.type === "sessions" && "sessions"}
                            {milestone.type === "streak" && "days"}
                            {milestone.type === "vocab" && "words"}
                          </p>

                          {milestone.deadline && (
                            <p className="text-xs text-muted-foreground">
                              Deadline: {new Date(milestone.deadline).toLocaleDateString()}
                            </p>
                          )}

                          {/* Progress Bar */}
                          <div className="mt-3 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isCompleted
                                  ? "bg-green-400"
                                  : "bg-gradient-to-r from-purple-neon to-blue-neon"
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <AnimatedBadge>
                          {isCompleted || milestone.completed
                            ? "✓ Completed"
                            : `${progress}%`}
                        </AnimatedBadge>

                        {!milestone.completed && isCompleted && (
                          <button
                            onClick={() => handleCompleteMilestone(index)}
                            className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="Mark as complete"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteMilestone(index)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete goal"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No goals set yet. Create your first goal to start tracking progress!
              </p>
              <GlowButton
                variant="primary"
                onClick={() => setShowGoalModal(true)}
              >
                Create Your First Goal
              </GlowButton>
            </GlassCard>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Next Steps</h2>

          <GlassCard className="p-6 space-y-4">
            <p className="text-foreground">
              Based on your progress, here's what we recommend:
            </p>

            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">1.</span>
                <span className="text-foreground">
                  Focus on technical improvement
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">2.</span>
                <span className="text-foreground">Maintain your streak</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-neon font-bold">3.</span>
                <span className="text-foreground">
                  Increase session frequency
                </span>
              </li>
            </ul>

            <GlowButton variant="primary" size="lg" className="w-full mt-6">
              View Personalized Plan
            </GlowButton>
          </GlassCard>
        </div>
      </div>

      <GoalModal
        open={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSave={async (goal) => {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/milestones/add`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user?.id, ...goal }),
            }
          );
          console.log("Saving milestone for:", user?.id);
          // Refresh stats after saving
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/stats/${user?.id}`
          );
          const data = await res.json();
          if (data.success) setStats(data.stats);
        }}
      />
    </ProtectedLayout>
  );
}