import type { Request, Response, NextFunction } from 'express';
import { type AuthTokenPayload } from '../utils/jwt';
declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=authenticate.d.ts.map