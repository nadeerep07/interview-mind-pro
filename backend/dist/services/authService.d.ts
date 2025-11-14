export declare const authService: {
    register(email: string, password: string, name: string): Promise<{
        token: string;
        user: {
            id: unknown;
            email: string;
            name: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: unknown;
            email: string;
            name: string;
        };
    }>;
    getCurrentUser(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=authService.d.ts.map