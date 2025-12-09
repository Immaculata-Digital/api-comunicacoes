import type { NextFunction, Request, Response } from 'express';
export declare class RemetenteSmtpController {
    private readonly listRemetentesSmtp;
    private readonly getRemetenteSmtp;
    private readonly createRemetenteSmtp;
    private readonly updateRemetenteSmtp;
    private readonly deleteRemetenteSmtp;
    constructor();
    index: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    show: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    store: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
}
export declare const remetenteSmtpController: RemetenteSmtpController;
//# sourceMappingURL=RemetenteSmtpController.d.ts.map