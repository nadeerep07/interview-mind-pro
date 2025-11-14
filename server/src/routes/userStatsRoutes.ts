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


export default router;
