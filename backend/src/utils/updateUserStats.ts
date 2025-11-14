import UserStats from "../models/UserStats";

export async function updateUserStats(userId: string, analysis: any) {
  let stats = await UserStats.findOne({ userId });

  if (!stats) {
    stats = new UserStats({ userId });
  }

  // ------------------------
  // 🔥 DAILY STREAK LOGIC
  // ------------------------
  const today = new Date().toDateString();
  const last = stats.lastSessionDate;

  if (!last) {
    stats.streakDays = 1;
  } else if (new Date(last).toDateString() !== today) {
    const diff =
      (new Date(today).getTime() - new Date(last).getTime()) /
      (1000 * 60 * 60 * 24);

    stats.streakDays = diff === 1 ? stats.streakDays + 1 : 1;
  }

  stats.lastSessionDate = today;

  // ------------------------
  // 🔥 SESSION COUNT
  // ------------------------
  stats.sessionsCompleted += 1;

  // Profile strength boost (max 100)
  stats.profileStrength = Math.min(100, stats.profileStrength + 5);

  if (analysis.fromDailyQuestion === true && analysis.dailyQuestion) {
    const dq = analysis.dailyQuestion;

    stats.communicationScore = dq.communicationScore ?? stats.communicationScore;
    stats.confidence = dq.confidenceScore ?? stats.confidence;
    stats.technicalKnowledge = dq.clarityScore ?? stats.technicalKnowledge;
  } else {
    // fallback for practice sessions
    stats.communicationScore = analysis.communicationScore ?? stats.communicationScore;
    stats.confidence = analysis.confidenceScore ?? stats.confidence;
    stats.technicalKnowledge = analysis.clarityScore ?? stats.technicalKnowledge;
  }

  // ------------------------
  // 🔥 RECENT SESSION HISTORY
  // ------------------------
  const sessionTitle =
    analysis.fromDailyQuestion === true
      ? "Daily Question Attempt"
      : "AI Practice Session";

  const sessionScore =
    analysis.dailyQuestion?.overallScore ??
    analysis.overallScore ??
    0;

  stats.recentSessions.unshift({
    title: sessionTitle,
    score: sessionScore,
    date: today,
  });

  stats.recentSessions = stats.recentSessions.slice(0, 5);

  await stats.save();
  return stats;
}
