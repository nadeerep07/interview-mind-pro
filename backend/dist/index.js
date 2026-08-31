"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./loadEnv"); // MUST BE FIRST
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiAnalysisRoutes_1 = __importDefault(require("./routes/aiAnalysisRoutes"));
const userStatsRoutes_1 = __importDefault(require("./routes/userStatsRoutes"));
const dailyQuestionRoutes_1 = require("./routes/dailyQuestionRoutes");
const updateStackRoutes_1 = __importDefault(require("./routes/updateStackRoutes"));
const vocabRoutes_1 = __importDefault(require("./routes/vocabRoutes"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api", aiAnalysisRoutes_1.default);
app.use("/api", userStatsRoutes_1.default);
app.use("/api/daily-question", dailyQuestionRoutes_1.dailyQuestionRouter);
app.use("/api", updateStackRoutes_1.default);
app.use("/api/vocab", vocabRoutes_1.default);
app.use("/api/user", profileRoute_1.default);
app.get("/", (_, res) => {
    res.send("API Running...");
});
(async () => {
    try {
        await (0, db_1.connectDB)();
        app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
    }
    catch (err) {
        console.error("❌ Server startup failed", err);
        process.exit(1);
    }
})();
