export declare const interviewService: {
    analyzeResponse(userId: string, question: string, response: string, category: string): Promise<import("mongoose").Document<unknown, {}, import("../models/Interview").IInterview, {}, {}> & import("../models/Interview").IInterview & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserInterviews(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Interview").IInterview, {}, {}> & import("../models/Interview").IInterview & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getInterviewById(interviewId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Interview").IInterview, {}, {}> & import("../models/Interview").IInterview & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
export declare const growthService: {
    recordSession(userId: string, analysis: any): Promise<import("mongoose").Document<unknown, {}, import("../models/Growth").IGrowth, {}, {}> & import("../models/Growth").IGrowth & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserGrowth(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Growth").IGrowth, {}, {}> & import("../models/Growth").IGrowth & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getGrowthStats(userId: string): Promise<{
        averageScore: number;
        trend: string;
        milestones: never[];
        totalSessions?: undefined;
        data?: undefined;
    } | {
        averageScore: number;
        trend: string;
        totalSessions: number;
        data: (import("mongoose").Document<unknown, {}, import("../models/Growth").IGrowth, {}, {}> & import("../models/Growth").IGrowth & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        milestones?: undefined;
    }>;
};
//# sourceMappingURL=interviewService.d.ts.map