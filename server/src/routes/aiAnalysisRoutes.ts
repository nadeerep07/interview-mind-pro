import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

router.post("/analyze", async (req, res) => {
  try {
    const { question, userResponse, interviewType } = req.body;

    if (!question || !userResponse) {
      return res.status(400).json({
        success: false,
        error: "Question and response are required",
      });
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

    if (!content) {
      return res.json({ success: false, error: "Empty response from Groq" });
    }

    // remove code fences
    content = content.trim().replace(/```json|```/g, "");

    const analysis = JSON.parse(content);

    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
