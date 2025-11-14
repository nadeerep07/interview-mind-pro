import mongoose, { type Document } from "mongoose";
export interface IGrowth extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    communicationScore: number;
    clarityScore: number;
    confidenceScore: number;
    keyPointsScore: number;
    overallScore: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Growth: mongoose.Model<IGrowth, {}, {}, {}, mongoose.Document<unknown, {}, IGrowth, {}, {}> & IGrowth & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Growth.d.ts.map