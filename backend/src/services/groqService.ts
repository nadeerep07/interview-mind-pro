import axios from "axios"
import { config } from "../config/env"

export const groqService = {
  async analyzeInterview(question: string, response: string) {
    try {
      if (!config.GROQ_API_KEY) {
        return getMockAnalysis(question, response)
      }

      const prompt = `You are an expert interview coach. Analyze the following interview response and provide structured feedback.

Question: "${question}"
Response: "${response}"

Provide your response as a JSON object with exactly this structure (ensure valid JSON):
{
  "score": <number 0-100>,
  "communicationScore": <number 0-100>,
  "clarityScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "keyPointsScore": <number 0-100>,
  "strengths": [<3-4 string strengths>],
  "improvements": [<3-4 string improvements>],
  "tips": [<3-4 string actionable tips>]
}

Be concise and practical. Return ONLY the JSON object, no other text.`

      const response_data = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${config.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      )

      const content = response_data.data.choices[0].message.content
      const analysis = JSON.parse(content)

      return {
        score: Math.min(100, Math.max(0, analysis.score || 75)),
        communicationScore: Math.min(100, Math.max(0, analysis.communicationScore || 75)),
        clarityScore: Math.min(100, Math.max(0, analysis.clarityScore || 80)),
        confidenceScore: Math.min(100, Math.max(0, analysis.confidenceScore || 70)),
        keyPointsScore: Math.min(100, Math.max(0, analysis.keyPointsScore || 85)),
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
        tips: Array.isArray(analysis.tips) ? analysis.tips : [],
      }
    } catch (error) {
      console.error("Groq API error:", error)
      return getMockAnalysis(question, response)
    }
  },
}

// Fallback mock analysis for development/testing
function getMockAnalysis(question: string, response: string) {
  const responseLength = response.length
  const hasExamples = response.toLowerCase().includes("example") || response.toLowerCase().includes("like")
  const hasMetrics = /\d+%|\d+\$|\d+x/i.test(response)

  return {
    score: Math.min(
      100,
      Math.max(65, 70 + Math.floor(Math.random() * 20) + (hasExamples ? 5 : 0) + (hasMetrics ? 5 : 0)),
    ),
    communicationScore: 75 + Math.floor(Math.random() * 15),
    clarityScore: 78 + Math.floor(Math.random() * 12),
    confidenceScore: 72 + Math.floor(Math.random() * 15),
    keyPointsScore: 80 + Math.floor(Math.random() * 15),
    strengths: [
      "Clear and structured response",
      hasExamples ? "Excellent use of real-world examples" : "Good communication flow",
      "Professional and confident tone",
      hasMetrics ? "Quantified achievements effectively" : "Relevant and focused answer",
    ],
    improvements: [
      responseLength < 200 ? "Could provide more depth and detail" : "Could be slightly more concise",
      "Consider using the STAR method for better structure",
      "Add more specific metrics or outcomes",
    ],
    tips: [
      "Practice maintaining composure and speaking at a steady pace",
      "Use concrete examples to support your points",
      "Prepare stories that demonstrate your key strengths",
      "Research the company culture and align your answers accordingly",
    ],
  }
}
