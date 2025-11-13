import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { growthService } from "../services/interviewService"

const router = Router()

router.get("/", authMiddleware, async (req, res) => {
  try {
    const growth = await growthService.getUserGrowth(req.userId!)
    res.json(growth)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const stats = await growthService.getGrowthStats(req.userId!)
    res.json(stats)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export const growthRoutes = router
