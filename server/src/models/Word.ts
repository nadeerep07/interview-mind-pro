import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  word: { type: String, required: true },
  definition: String,
  usage: String,
  examples: [String],
  reviewCount: { type: Number, default: 0 },
  lastReviewedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Word", wordSchema);
