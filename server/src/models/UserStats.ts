import mongoose, { Schema, Document } from "mongoose";

export interface IUserStats extends Document {
  userId: string;
  profileStrength: number;
  sessionsCompleted: number;
  wordsLearned: number;
  streakDays: number;
  lastSessionDate: string | null;
  communicationScore: number;
  technicalKnowledge: number;
  confidence: number;
  recentSessions: {
    title: string;
    score: number;
    date: string;
  }[];
  upcomingChallenges: {
    category: string;
    difficulty: string;
  }[];
}

const UserStatsSchema = new Schema<IUserStats>({
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
});

export default mongoose.model<IUserStats>("UserStats", UserStatsSchema);
