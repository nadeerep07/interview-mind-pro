import mongoose, { Schema, type Document } from "mongoose"

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId
  question: string
  response: string
  category: string
  score: number
  feedback: {
    strengths: string[]
    improvements: string[]
    tips: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const interviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      strengths: [String],
      improvements: [String],
      tips: [String],
    },
  },
  { timestamps: true },
)

export const Interview = mongoose.model<IInterview>("Interview", interviewSchema)
