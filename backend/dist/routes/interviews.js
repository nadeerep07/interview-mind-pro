"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const interviewService_1 = require("../services/interviewService");
const router = (0, express_1.Router)();
router.post("/analyze", auth_1.authMiddleware, async (req, res) => {
    try {
        const { question, response, category } = req.body;
        const interview = await interviewService_1.interviewService.analyzeResponse(req.userId, question, response, category);
        res.json(interview);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const interviews = await interviewService_1.interviewService.getUserInterviews(req.userId);
        res.json(interviews);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        const interview = await interviewService_1.interviewService.getInterviewById(req.params.id);
        res.json(interview);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.interviewRoutes = router;
