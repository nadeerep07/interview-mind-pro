import mongoose, { Schema, type Document } from "mongoose"

export interface IVocabulary extends Document {
  userId: mongoose.Types.ObjectId
  word: string
  meaning: string
  exampleSentence: string
  reviewCount: number
  lastReviewedAt: Date
  createdAt: Date
  updatedAt: Date
}

const vocabularySchema = new Schema<IVocabulary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    word: {
      type: String,
      required: true,
    },
    meaning: {
      type: String,
      required: true,
    },
    exampleSentence: {
      type: String,
      required: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    lastReviewedAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true },
)

export const Vocabulary = mongoose.model<IVocabulary>("Vocabulary", vocabularySchema)
