import { Vocabulary } from "../models/Word"

export const vocabularyService = {
  async addWord(userId: string, word: string, meaning: string, exampleSentence: string) {
    const vocab = new Vocabulary({
      userId,
      word,
      meaning,
      exampleSentence,
    })

    await vocab.save()
    return vocab
  },

  async getUserVocabulary(userId: string) {
    return await Vocabulary.find({ userId }).sort({ createdAt: -1 })
  },

  async deleteWord(wordId: string) {
    return await Vocabulary.findByIdAndDelete(wordId)
  },

  async recordReview(wordId: string) {
    const word = await Vocabulary.findByIdAndUpdate(
      wordId,
      {
        reviewCount: { $inc: 1 },
        lastReviewedAt: new Date(),
      },
      { new: true },
    )
    return word
  },

  async getVocabularyStats(userId: string) {
    const words = await Vocabulary.find({ userId })
    const reviewedWords = words.filter((w) => w.reviewCount > 0)

    return {
      totalWords: words.length,
      reviewedWords: reviewedWords.length,
      averageReviews:
        words.length > 0 ? Math.round(words.reduce((sum, w) => sum + w.reviewCount, 0) / words.length) : 0,
      words,
    }
  },
}
