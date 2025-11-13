"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthService = exports.interviewService = void 0;
const Interview_1 = require("../models/Interview");
const Growth_1 = require("../models/Growth");
const groqService_1 = require("./groqService");
exports.interviewService = {
    async analyzeResponse(userId, question, response, category) {
        try {
            const analysis = await groqService_1.groqService.analyzeInterview(question, response);
            const interview = new Interview_1.Interview({
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
            });
            await interview.save();
            // Update growth metrics
            await exports.growthService.recordSession(userId, analysis);
            return interview;
        }
        catch (error) {
            throw new Error(`Interview analysis failed: ${error}`);
        }
    },
    async getUserInterviews(userId) {
        return await Interview_1.Interview.find({ userId }).sort({ createdAt: -1 });
    },
    async getInterviewById(interviewId) {
        return await Interview_1.Interview.findById(interviewId);
    },
};
exports.growthService = {
    async recordSession(userId, analysis) {
        const growth = new Growth_1.Growth({
            userId,
            communicationScore: analysis.communicationScore || 75,
            clarityScore: analysis.clarityScore || 80,
            confidenceScore: analysis.confidenceScore || 70,
            keyPointsScore: analysis.keyPointsScore || 85,
            overallScore: analysis.score,
        });
        await growth.save();
        return growth;
    },
    async getUserGrowth(userId) {
        return await Growth_1.Growth.find({ userId }).sort({ date: -1 });
    },
    async getGrowthStats(userId) {
        const growth = await Growth_1.Growth.find({ userId }).sort({ date: -1 }).limit(30);
        if (growth.length === 0) {
            return {
                averageScore: 0,
                trend: "no-data",
                milestones: [],
            };
        }
        const averageScore = growth.reduce((sum, g) => sum + g.overallScore, 0) / growth.length;
        const latestScore = growth[0].overallScore;
        const oldestScore = growth[growth.length - 1].overallScore;
        const trend = latestScore > oldestScore ? "improving" : latestScore < oldestScore ? "declining" : "stable";
        return {
            averageScore: Math.round(averageScore),
            trend,
            totalSessions: growth.length,
            data: growth,
        };
    },
};
