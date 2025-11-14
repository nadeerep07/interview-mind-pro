import UserStats from "../models/UserStats";

export async function updateUserStats(userId: string, analysis: any) {
  let stats = await UserStats.findOne({ userId });

  if (!stats) {
    stats = new UserStats({ userId });
  }

  // ---- STREAK LOGIC ----
  const today = new Date().toDateString();
  const last = stats.lastSessionDate;

  if (!last) {
    stats.streakDays = 1; // first time ever
  } else if (new Date(last).toDateString() === today) {
    // same day -> do nothing
  } else {
    const diff =
      (new Date(today).getTime() - new Date(last).getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      stats.streakDays += 1; // streak continues
    } else {
      stats.streakDays = 0; // streak broken
    }
  }

  stats.lastSessionDate = today;

  // ---- BASIC STATS ----
  stats.sessionsCompleted += 1;

  // Increase profile strength per session (max 100)
  stats.profileStrength = Math.min(100, stats.profileStrength + 5);

  // ---- SCORE EXTRACTION ----
  stats.communicationScore = analysis.communicationScore;
  stats.technicalKnowledge = analysis.clarityScore;
  stats.confidence = analysis.confidenceScore;

  // ---- RECENT SESSIONS ----
  stats.recentSessions.unshift({
    title: "AI Practice Session",
    score: analysis.overallScore,
    date: today,
  });

  stats.recentSessions = stats.recentSessions.slice(0, 5);

  await stats.save();
  return stats;
}
