import "./loadEnv"; // MUST BE FIRST
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import aiAnalysisRoutes from "./routes/aiAnalysisRoutes";
import userStatsRoutes from "./routes/userStatsRoutes";
import { dailyQuestionRouter } from "./routes/dailyQuestionRoutes";
import updateStackRoutes from "./routes/updateStackRoutes";
import vocabRouter from "./routes/vocabRoutes";
import updateUserProfileRoutes from "./routes/profileRoute";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", aiAnalysisRoutes);
app.use("/api", userStatsRoutes);
app.use("/api/daily-question", dailyQuestionRouter);
app.use("/api", updateStackRoutes);
app.use("/api/vocab", vocabRouter);
app.use("/api/user", updateUserProfileRoutes);

app.get("/", (_, res) => {
  res.send("API Running...");
});

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🔥 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server startup failed", err);
    process.exit(1);
  }
})();
