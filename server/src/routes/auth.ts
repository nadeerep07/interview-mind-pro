import { Router } from "express"
import { authService } from "../services/authService"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    const result = await authService.register(email, password, name)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.userId!)
    res.json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export const authRoutes = router
