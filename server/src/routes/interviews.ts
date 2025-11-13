import { Router } from "express"
import { authMiddleware } from "../middleware/auth"
import { interviewService } from "../services/interviewService"

const router = Router()

router.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { question, response, category } = req.body
    const interview = await interviewService.analyzeResponse(req.userId!, question, response, category)
    res.json(interview)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await interviewService.getUserInterviews(req.userId!)
    res.json(interviews)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const interview = await interviewService.getInterviewById(req.params.id)
    res.json(interview)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export const interviewRoutes = router
