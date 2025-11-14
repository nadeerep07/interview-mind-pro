import { Router } from "express";
import UserStats from "../models/UserStats";

const router = Router();

// GET /api/user/stats/:userId
router.get("/user/stats/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    let stats = await UserStats.findOne({ userId });

    if (!stats) {
      stats = await UserStats.create({
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
        ],
        milestones: [],
      });
    }

    if (!stats.milestones) stats.milestones = [];

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: "Stats fetch failed" });
  }
});

router.get("/user/stats/all/distribution", async (req, res) => {
  try {
    const allStats = await UserStats.find({});

    // Calculate overall score for each user
    const results = allStats.map((s) => {
      const communication = s.communicationScore || 0;
      const technical = s.technicalKnowledge || 0;
      const confidence = s.confidence || 0;

      const problemSolving = Math.round((communication + technical) / 2);
      const clarity = Math.round((communication + confidence) / 2);
      const resilience = Math.round((technical + confidence) / 2);

      const overall = Math.round(
        (communication +
          technical +
          confidence +
          problemSolving +
          clarity +
          resilience) /
          6
      );

      return {
        userId: s.userId,
        overall,
      };
    });

    // Distribution buckets
    const distribution = {
      Expert: 0,
      Advanced: 0,
      Intermediate: 0,
      Beginner: 0,
    };

    results.forEach((u) => {
      if (u.overall >= 85) distribution.Expert++;
      else if (u.overall >= 70) distribution.Advanced++;
      else if (u.overall >= 55) distribution.Intermediate++;
      else distribution.Beginner++;
    });

    res.json({
      success: true,
      distribution,
      totalUsers: results.length,
    });
  } catch (err) {
    console.error("Error fetching distribution:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch distribution data" });
  }
});

router.post("/user/milestones/add", async (req, res) => {
  const { userId, title, type, target, deadline } = req.body;

  try {
    await UserStats.updateOne(
      { userId },
      {
        $push: {
          milestones: {
            title,
            type,
            target: Number(target),
            deadline,
            current: 0,
            completed: false,
          },
        },
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to add milestone" });
  }
});

router.post("/user/milestones/complete", async (req, res) => {
  const { userId, index } = req.body;

  try {
    await UserStats.updateOne(
      { userId },
      { $set: { [`milestones.${index}.completed`]: true } }
    );

    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to complete milestone" });
  }
});

router.post("/user/milestones/delete", async (req, res) => {
  const { userId, index } = req.body;

  try {
    await UserStats.updateOne(
      { userId },
      { $unset: { [`milestones.${index}`]: 1 } }
    );

    await UserStats.updateOne({ userId }, { $pull: { milestones: null } });

    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete milestone" });
  }
});

export default router;
