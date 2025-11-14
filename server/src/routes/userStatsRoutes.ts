import { Router } from "express";
import UserStats from "../models/UserStats";

const router = Router();

// GET /api/user/stats/:userId
router.get("/user/stats/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    let stats = await UserStats.findOne({ userId });

if (!stats) {
  return res.json({
    success: true,
    stats: {
      userId,
      profileStrength: 0,
      sessionsCompleted: 0,
      wordsLearned: 0,
      streakDays: 0,

      communicationScore: 0,
      technicalKnowledge: 0,
      confidence: 0,

      recentSessions: [],
      upcomingChallenges: [
        { category: "Behavioral", difficulty: "Intermediate" },
        { category: "Technical", difficulty: "Hard" },
        { category: "Case Study", difficulty: "Medium" },
      ]
    }
  });
}


    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: "Stats fetch failed" });
  }
});

router.get("/user/stats/all/distribution", async (req, res) => {
  try {
    const allStats = await UserStats.find({});

    // Calculate overall score for each user
    const results = allStats.map(s => {
      const communication = s.communicationScore || 0;
      const technical = s.technicalKnowledge || 0;
      const confidence = s.confidence || 0;

      const problemSolving = Math.round((communication + technical) / 2);
      const clarity = Math.round((communication + confidence) / 2);
      const resilience = Math.round((technical + confidence) / 2);

      const overall = Math.round(
        (communication + technical + confidence + problemSolving + clarity + resilience) / 6
      );

      return {
        userId: s.userId,
        overall
      };
    });

    // Distribution buckets
    const distribution = {
      Expert: 0,
      Advanced: 0,
      Intermediate: 0,
      Beginner: 0
    };

    results.forEach(u => {
      if (u.overall >= 85) distribution.Expert++;
      else if (u.overall >= 70) distribution.Advanced++;
      else if (u.overall >= 55) distribution.Intermediate++;
      else distribution.Beginner++;
    });

    res.json({
      success: true,
      distribution,
      totalUsers: results.length
    });

  } catch (err) {
    console.error("Error fetching distribution:", err);
    res.status(500).json({ success: false, error: "Failed to fetch distribution data" });
  }
});


export default router;
