"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const interviewService_1 = require("../services/interviewService");
const router = (0, express_1.Router)();
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const growth = await interviewService_1.growthService.getUserGrowth(req.userId);
        res.json(growth);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/stats", auth_1.authMiddleware, async (req, res) => {
    try {
        const stats = await interviewService_1.growthService.getGrowthStats(req.userId);
        res.json(stats);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.growthRoutes = router;
