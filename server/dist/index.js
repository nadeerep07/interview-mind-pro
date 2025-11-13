"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./routes/auth");
const interviews_1 = require("./routes/interviews");
const vocabulary_1 = require("./routes/vocabulary");
const growth_1 = require("./routes/growth");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database Connection
(0, database_1.default)();
// Routes
app.use("/api/auth", auth_1.authRoutes);
app.use("/api/interviews", interviews_1.interviewRoutes);
app.use("/api/vocabulary", vocabulary_1.vocabularyRoutes);
app.use("/api/growth", growth_1.growthRoutes);
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});
// Error Handler
app.use(errorHandler_1.errorHandler);
const PORT = env_1.config.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
