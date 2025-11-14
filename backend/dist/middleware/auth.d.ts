import type { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const generateToken: (userId: string) => string;
//# sourceMappingURL=auth.d.ts.map