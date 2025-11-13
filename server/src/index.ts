import express, { type Express } from "express"
import cors from "cors"
import { config } from "./config/env"
import connectDB from "./config/database"
import { errorHandler } from "./middleware/errorHandler"
import { authRoutes } from "./routes/auth"
import { interviewRoutes } from "./routes/interviews"
import { vocabularyRoutes } from "./routes/vocabulary"
import { growthRoutes } from "./routes/growth"

const app: Express = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database Connection
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/interviews", interviewRoutes)
app.use("/api/vocabulary", vocabularyRoutes)
app.use("/api/growth", growthRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

// Error Handler
app.use(errorHandler)

const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
