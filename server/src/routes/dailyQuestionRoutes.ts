import express from "express";
import { Groq } from "groq-sdk";

export const dailyQuestionRouter = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

dailyQuestionRouter.get("/", async (req, res) => {
  try {
    const category =
      (req.query.category as string) || "behavioral";

    const prompt = `
Generate ONE fresh, unique ${category} interview question.

Rules:
- Only output the question text.
- Must be fresher-friendly.
- Must NOT repeat common textbook questions.
- No explanation.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",   // <-- ALWAYS set manually
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const question =
      completion.choices?.[0]?.message?.content?.trim() ||
      "No question generated.";

    return res.json({
      success: true,
      question,
      generatedAt: new Date(),
    });
  } catch (err: any) {
    console.error("Daily question error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
