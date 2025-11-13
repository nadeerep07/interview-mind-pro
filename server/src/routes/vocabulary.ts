import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { vocabularyService } from "../services/vocabularyService"

const router = Router()

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { word, meaning, exampleSentence } = req.body
    const vocab = await vocabularyService.addWord(req.userId!, word, meaning, exampleSentence)
    res.json(vocab)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/", authMiddleware, async (req, res) => {
  try {
    const vocab = await vocabularyService.getUserVocabulary(req.userId!)
    res.json(vocab)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const stats = await vocabularyService.getVocabularyStats(req.userId!)
    res.json(stats)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await vocabularyService.deleteWord(req.params.id)
    res.json({ success: true })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.post("/:id/review", authMiddleware, async (req, res) => {
  try {
    const word = await vocabularyService.recordReview(req.params.id)
    res.json(word)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export const vocabularyRoutes = router
