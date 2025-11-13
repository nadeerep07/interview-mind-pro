export declare const vocabularyService: {
    addWord(userId: string, word: string, meaning: string, exampleSentence: string): Promise<import("mongoose").Document<unknown, {}, import("../models/Vocabulary").IVocabulary, {}, {}> & import("../models/Vocabulary").IVocabulary & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserVocabulary(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Vocabulary").IVocabulary, {}, {}> & import("../models/Vocabulary").IVocabulary & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteWord(wordId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Vocabulary").IVocabulary, {}, {}> & import("../models/Vocabulary").IVocabulary & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    recordReview(wordId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Vocabulary").IVocabulary, {}, {}> & import("../models/Vocabulary").IVocabulary & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    getVocabularyStats(userId: string): Promise<{
        totalWords: number;
        reviewedWords: number;
        averageReviews: number;
        words: (import("mongoose").Document<unknown, {}, import("../models/Vocabulary").IVocabulary, {}, {}> & import("../models/Vocabulary").IVocabulary & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
};
//# sourceMappingURL=vocabularyService.d.ts.map