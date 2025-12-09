import type { NextFunction, Request, Response } from 'express';
export declare class CampanhaDisparoController {
    private readonly listCampanhasDisparo;
    private readonly getCampanhaDisparo;
    private readonly createCampanhaDisparo;
    private readonly updateCampanhaDisparo;
    private readonly deleteCampanhaDisparo;
    constructor();
    index: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    show: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    store: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
}
export declare const campanhaDisparoController: CampanhaDisparoController;
//# sourceMappingURL=CampanhaDisparoController.d.ts.map