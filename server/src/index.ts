import "../src/loadEnv";  // MUST BE FIRST, above everything
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import aiAnalysisRoutes from "./routes/aiAnalysisRoutes";
import userStatsRoutes from "./routes/userStatsRoutes";
import { dailyQuestionRouter } from "./routes/dailyQuestionRoutes";
import updateStackRoutes from "./routes/updateStackRoutes";
import vocabRouter from "./routes/vocabRoutes";


console.log("GROQ KEY LOADED IN INDEX:", process.env.GROQ_API_KEY);

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", aiAnalysisRoutes);
app.use("/api", userStatsRoutes);
app.use("/api/daily-question", dailyQuestionRouter);
app.use("/api", updateStackRoutes);
app.use("/api/vocab", vocabRouter);





app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
