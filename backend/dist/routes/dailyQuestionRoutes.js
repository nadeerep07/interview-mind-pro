"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyQuestionRouter = void 0;
const express_1 = __importDefault(require("express"));
const groq_sdk_1 = require("groq-sdk");
exports.dailyQuestionRouter = express_1.default.Router();
const groq = new groq_sdk_1.Groq({
    apiKey: process.env.GROQ_API_KEY,
});
exports.dailyQuestionRouter.get("/", async (req, res) => {
    try {
        const category = req.query.category || "behavioral";
        const difficulty = req.query.difficulty || "beginner";
        // Parse stack from frontend
        let stack = [];
        if (req.query.stack) {
            try {
                stack = JSON.parse(req.query.stack);
            }
            catch {
                console.log("Invalid stack JSON");
            }
        }
        let prompt = "";
        if (category === "technical") {
            // Choose 1 stack randomly
            const chosenStack = stack.length > 0
                ? stack[Math.floor(Math.random() * stack.length)]
                : "General Software Engineering";
            let difficultyRules = "";
            if (difficulty === "beginner") {
                difficultyRules = `
- Ask super simple, direct questions.
- No code-heavy questions.
- No tricky wording.
- Focus on definitions and basic concepts.
- Example: "What is a widget in Flutter?"
        `;
            }
            if (difficulty === "intermediate") {
                difficultyRules = `
- Ask practical questions used in day-to-day development.
- Allow mild debugging scenarios.
- Use lifecycle, state management, async, build methods, hooks.
- Example: "Explain how setState works in Flutter."
        `;
            }
            if (difficulty === "advanced") {
                difficultyRules = `
- Ask deeper conceptual questions.
- You may ask about rendering, memory, performance, advanced state mgmt.
- Internal framework architecture allowed.
- Example: "How does Flutter’s rendering pipeline convert widgets → elements → render objects?"
        `;
            }
            prompt = `
Generate a *${difficulty}-level* technical interview question for the stack: ${chosenStack}

STRICT RULES:
${difficultyRules}

General Rules:
- 1–2 sentences maximum.
- NO system design of distributed systems.
- NO DSA/algorithm questions.
- Must NOT repeat common textbook questions.
- Must feel like a real interview question.
- Only output the question text. No explanation.
`;
        }
        else {
            // Behavioral & Case
            prompt = `
Generate ONE fresh, unique ${category} interview question.

Rules:
- Only output the question text.
- Must be fresher-friendly.
- Must not repeat common textbook questions.
- No explanation.
      `;
        }
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
        });
        const question = completion.choices?.[0]?.message?.content?.trim() ||
            "No question generated.";
        return res.json({
            success: true,
            question,
            generatedAt: new Date(),
        });
    }
    catch (err) {
        console.error("Daily question error:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
