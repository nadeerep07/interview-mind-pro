import mongoose, { type Document } from "mongoose";
export interface IVocabulary extends Document {
    userId: mongoose.Types.ObjectId;
    word: string;
    meaning: string;
    exampleSentence: string;
    reviewCount: number;
    lastReviewedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Vocabulary: mongoose.Model<IVocabulary, {}, {}, {}, mongoose.Document<unknown, {}, IVocabulary, {}, {}> & IVocabulary & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Vocabulary.d.ts.map