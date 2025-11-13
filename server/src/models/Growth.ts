import mongoose, { Schema, type Document } from "mongoose"

export interface IGrowth extends Document {
  userId: mongoose.Types.ObjectId
  date: Date
  communicationScore: number
  clarityScore: number
  confidenceScore: number
  keyPointsScore: number
  overallScore: number
  createdAt: Date
  updatedAt: Date
}

const growthSchema = new Schema<IGrowth>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    communicationScore: {
      type: Number,
      default: 0,
    },
    clarityScore: {
      type: Number,
      default: 0,
    },
    confidenceScore: {
      type: Number,
      default: 0,
    },
    keyPointsScore: {
      type: Number,
      default: 0,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export const Growth = mongoose.model<IGrowth>("Growth", growthSchema)
