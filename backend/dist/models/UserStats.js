"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// models/UserStats.ts
const mongoose_1 = __importStar(require("mongoose"));
const MilestoneSchema = new mongoose_1.Schema({
    title: { type: String, default: "" },
    type: { type: String, default: "general" },
    target: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    deadline: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
});
const UserStatsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    profileStrength: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    wordsLearned: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    lastSessionDate: { type: String, default: null },
    communicationScore: { type: Number, default: 0 },
    technicalKnowledge: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    recentSessions: [
        {
            title: String,
            score: Number,
            date: String,
        },
    ],
    upcomingChallenges: [
        {
            category: String,
            difficulty: String,
        },
    ],
    // user-created milestones (replaces defaults in UI)
    milestones: [MilestoneSchema],
});
exports.default = mongoose_1.default.model("UserStats", UserStatsSchema);
