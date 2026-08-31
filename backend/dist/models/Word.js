"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wordSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    word: { type: String, required: true },
    definition: String,
    usage: String,
    examples: [String],
    reviewCount: { type: Number, default: 0 },
    lastReviewedAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model("Word", wordSchema);
