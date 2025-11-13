import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { question, userResponse, interviewType } = await req.json();

    const systemPrompt = `
You are an expert HR interviewer. Analyze the candidate's interview response and return only valid JSON.
STRICTLY follow this JSON structure:

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
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    let content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Groq returned empty content:", completion);
      return NextResponse.json({
        success: false,
        error: "Groq returned empty content",
      });
    }

    // Sanitize
    content = content.trim().replace(/```json|```/g, "");

    // Parse JSON safely
    const analysis = JSON.parse(content);

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
