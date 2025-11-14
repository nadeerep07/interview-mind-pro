import mongoose, { type Document } from "mongoose";
export interface IInterview extends Document {
    userId: mongoose.Types.ObjectId;
    question: string;
    response: string;
    category: string;
    score: number;
    feedback: {
        strengths: string[];
        improvements: string[];
        tips: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Interview: mongoose.Model<IInterview, {}, {}, {}, mongoose.Document<unknown, {}, IInterview, {}, {}> & IInterview & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Interview.d.ts.map