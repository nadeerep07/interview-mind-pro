import { Interview } from "../models/Interview"
import { Growth } from "../models/Growth"
import { groqService } from "./groqService"

export const interviewService = {
  async analyzeResponse(userId: string, question: string, response: string, category: string) {
    try {
      const analysis = await groqService.analyzeInterview(question, response)

      const interview = new Interview({
        userId,
        question,
        response,
        category,
        score: analysis.score,
        feedback: {
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          tips: analysis.tips,
        },
      })

      await interview.save()

      // Update growth metrics
      await growthService.recordSession(userId, analysis)

      return interview
    } catch (error) {
      throw new Error(`Interview analysis failed: ${error}`)
    }
  },

  async getUserInterviews(userId: string) {
    return await Interview.find({ userId }).sort({ createdAt: -1 })
  },

  async getInterviewById(interviewId: string) {
    return await Interview.findById(interviewId)
  },
}

export const growthService = {
  async recordSession(userId: string, analysis: any) {
    const growth = new Growth({
      userId,
      communicationScore: analysis.communicationScore || 75,
      clarityScore: analysis.clarityScore || 80,
      confidenceScore: analysis.confidenceScore || 70,
      keyPointsScore: analysis.keyPointsScore || 85,
      overallScore: analysis.score,
    })

    await growth.save()
    return growth
  },

  async getUserGrowth(userId: string) {
    return await Growth.find({ userId }).sort({ date: -1 })
  },

  async getGrowthStats(userId: string) {
    const growth = await Growth.find({ userId }).sort({ date: -1 }).limit(30)

    if (growth.length === 0) {
      return {
        averageScore: 0,
        trend: "no-data",
        milestones: [],
      }
    }

    const averageScore = growth.reduce((sum, g) => sum + g.overallScore, 0) / growth.length
    const latestScore = growth[0].overallScore
    const oldestScore = growth[growth.length - 1].overallScore

    const trend = latestScore > oldestScore ? "improving" : latestScore < oldestScore ? "declining" : "stable"

    return {
      averageScore: Math.round(averageScore),
      trend,
      totalSessions: growth.length,
      data: growth,
    }
  },
}
