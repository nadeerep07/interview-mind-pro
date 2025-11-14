"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vocabularyService = void 0;
const Vocabulary_1 = require("../models/Vocabulary");
exports.vocabularyService = {
    async addWord(userId, word, meaning, exampleSentence) {
        const vocab = new Vocabulary_1.Vocabulary({
            userId,
            word,
            meaning,
            exampleSentence,
        });
        await vocab.save();
        return vocab;
    },
    async getUserVocabulary(userId) {
        return await Vocabulary_1.Vocabulary.find({ userId }).sort({ createdAt: -1 });
    },
    async deleteWord(wordId) {
        return await Vocabulary_1.Vocabulary.findByIdAndDelete(wordId);
    },
    async recordReview(wordId) {
        const word = await Vocabulary_1.Vocabulary.findByIdAndUpdate(wordId, {
            reviewCount: { $inc: 1 },
            lastReviewedAt: new Date(),
        }, { new: true });
        return word;
    },
    async getVocabularyStats(userId) {
        const words = await Vocabulary_1.Vocabulary.find({ userId });
        const reviewedWords = words.filter((w) => w.reviewCount > 0);
        return {
            totalWords: words.length,
            reviewedWords: reviewedWords.length,
            averageReviews: words.length > 0 ? Math.round(words.reduce((sum, w) => sum + w.reviewCount, 0) / words.length) : 0,
            words,
        };
    },
};
