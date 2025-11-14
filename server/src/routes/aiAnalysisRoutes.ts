import { Router } from "express";
import Groq from "groq-sdk";
import { updateUserStats } from "../utils/updateUserStats";

const router = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

router.post("/analyze", async (req, res) => {
  try {
    const { question, userResponse, interviewType, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const systemPrompt = `
You are an expert HR interviewer. Analyze the candidate's interview answer and reply ONLY with this JSON strictly:

{
  "overallScore": number,
  "communicationScore": number,
  "clarityScore": number,
  "confidenceScore": number,
  "strengths": [string],
  "improvements": [string],
  "tips": [string]
}
`;

    const userPrompt = `
Interview Type: ${interviewType}
Question: ${question}

Candidate Response:
${userResponse}
`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL!,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    let content = completion.choices?.[0]?.message?.content;

    content = content.trim().replace(/```json|```/g, "");

    const analysis = JSON.parse(content);

    // 🔥 Update stats here
    const updatedStats = await updateUserStats(userId, analysis);

    res.json({ success: true, analysis, updatedStats });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
