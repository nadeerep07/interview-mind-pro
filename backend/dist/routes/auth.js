"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const authService_1 = require("../services/authService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/register", async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService_1.authService.register(email, password, name);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService_1.authService.login(email, password);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/me", auth_1.authMiddleware, async (req, res, next) => {
    try {
        const user = await authService_1.authService.getCurrentUser(req.userId);
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.authRoutes = router;
