import express from "express";
import { Groq } from "groq-sdk";

export const dailyQuestionRouter = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

dailyQuestionRouter.get("/", async (req, res) => {
  try {
    const category = (req.query.category as string) || "behavioral";

    //  NEW — parse stack array coming from frontend
    let stack: string[] = [];
    if (req.query.stack) {
      try {
        stack = JSON.parse(req.query.stack as string);
      } catch (err) {
        console.log("Invalid stack JSON");
      }
    }

    //  NEW — dynamic prompt based on category + stack
    let prompt = "";
    console.log("Category:", category);
    if (category === "technical") {
      prompt = `
You are generating a *fresher-level technical interview question*.

Stacks provided: ${
        stack.length > 0 ? stack.join(", ") : "General Software Engineering"
      }

Follow these rules STRICTLY:

❌ HARD RULES — DO NOT ASK:
- No "Design a system..."
- No "Design a function..."
- No system design questions at all
- No architecture-level questions
- No algorithms or DSA questions
- No trees, graphs, tries, heaps, DP, complexities
- No math-heavy or research questions
- No advanced optimization or distributed systems topics

✔ ALLOWED QUESTION TYPES (PICK ONLY ONE):
- **theoretical** (meaning, concept, definition)
- **why/how** questions (explain why X happens in this stack)
- **basic practical** (how to use a common feature)
- **debugging** (simple error scenario)
- **best practices** (fresher-level)

❗ VERY IMPORTANT:
- If multiple stacks are provided, choose **ONLY ONE** stack randomly & ask about that stack.
- The question MUST mention the chosen stack.  
  Example: “In React, what is the purpose of useEffect?”
- The question must be **1–2 sentences maximum**.
- KEEP IT VERY SIMPLE — college student level.
- NO system design phrasing, no complexity, no architecture.
- Only output the question text. No explanation.

### GOOD EXAMPLES:
"In React, what is the difference between state and props?"
"In Node.js, what does the event loop do?"
"In MongoDB, what is a collection and how is it different from a table?"
"In Express.js, what is middleware used for?"
"In SQL, what is the purpose of a primary key?"
"In JavaScript, what does '===’ compare?"

### NOW GENERATE:
ONE very simple fresher-level technical interview question based ONLY on the chosen stack.`;
    } else {
      prompt = `
Generate ONE fresh, unique ${category} interview question.

Rules:
- Only output the question text.
- Must be fresher-friendly.
- Must NOT repeat common textbook questions.
- No explanation.
`;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
