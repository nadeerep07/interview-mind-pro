"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vocabularyRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const vocabularyService_1 = require("../services/vocabularyService");
const router = (0, express_1.Router)();
router.post("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const { word, meaning, exampleSentence } = req.body;
        const vocab = await vocabularyService_1.vocabularyService.addWord(req.userId, word, meaning, exampleSentence);
        res.json(vocab);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const vocab = await vocabularyService_1.vocabularyService.getUserVocabulary(req.userId);
        res.json(vocab);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/stats", auth_1.authMiddleware, async (req, res) => {
    try {
        const stats = await vocabularyService_1.vocabularyService.getVocabularyStats(req.userId);
        res.json(stats);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        await vocabularyService_1.vocabularyService.deleteWord(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/:id/review", auth_1.authMiddleware, async (req, res) => {
    try {
        const word = await vocabularyService_1.vocabularyService.recordReview(req.params.id);
        res.json(word);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.vocabularyRoutes = router;
