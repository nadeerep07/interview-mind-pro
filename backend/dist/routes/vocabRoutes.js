"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groq_sdk_1 = require("groq-sdk");
const Word_1 = __importDefault(require("../models/Word"));
const UserStats_1 = __importDefault(require("../models/UserStats"));
const router = express_1.default.Router();
const groq = new groq_sdk_1.Groq({
    apiKey: process.env.GROQ_API_KEY
});
// Helper to safely parse AI
function safeParseJSON(content) {
    try {
        return JSON.parse(content);
    }
    catch (err) {
        console.log("❌ AI returned non-JSON. Running fallback parser...");
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            }
            catch { }
        }
        return { definition: "", usage: "", examples: [] };
    }
}
// 🔥 Add Word (AI + DB)
router.post("/add-word", async (req, res) => {
    try {
        const { word, userId } = req.body;
        if (!word || !userId) {
            return res.status(400).json({ error: "word and userId required" });
        }
        const prompt = `
Generate professional vocabulary details for interview preparation.
Word: ${word}

Return JSON in this structure:
{
  "definition": "",
  "usage": "",
  "examples": []
}
`;
        const aiResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });
        const aiText = aiResponse.choices[0].message.content;
        const json = safeParseJSON(aiText);
        const newWord = await Word_1.default.create({
            userId,
            word,
            definition: json.definition || "",
            usage: json.usage || "",
            examples: json.examples || [],
            reviewCount: 0,
            lastReviewedAt: new Date()
        });
        await UserStats_1.default.findOneAndUpdate({ userId }, { $inc: { wordsLearned: 1 } }, { new: true, upsert: true });
        res.json(newWord);
    }
    catch (err) {
        console.error("❌ Add Word Error:", err);
        res.status(500).json({ error: "AI or DB error" });
    }
});
// 📌 Get all words
router.get("/list/:userId", async (req, res) => {
    try {
        const words = await Word_1.default.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(words);
    }
    catch (err) {
        console.error("❌ List Error:", err);
        res.status(500).json({ error: "Failed to load words" });
    }
});
// 🗑 Delete Word
router.delete("/:id", async (req, res) => {
    try {
        await Word_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        console.error("❌ Delete Error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});
// 🔁 Review (increment count)
router.post("/review/:id", async (req, res) => {
    try {
        const word = await Word_1.default.findById(req.params.id);
        if (!word) {
            return res.status(404).json({ error: "Word not found" });
        }
        word.reviewCount += 1;
        word.lastReviewedAt = new Date();
        await word.save();
        res.json(word);
    }
    catch (err) {
        console.error("❌ Review Error:", err);
        res.status(500).json({ error: "Review failed" });
    }
});
exports.default = router;
