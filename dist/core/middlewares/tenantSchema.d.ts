import type { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            schema?: string;
        }
    }
}
export declare function tenantSchema(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tenantSchema.d.ts.map