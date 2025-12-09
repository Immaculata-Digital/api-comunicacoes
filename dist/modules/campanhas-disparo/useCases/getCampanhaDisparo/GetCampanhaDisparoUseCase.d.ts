import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository';
export declare class GetCampanhaDisparoUseCase {
    private readonly campanhaDisparoRepository;
    constructor(campanhaDisparoRepository: ICampanhaDisparoRepository);
    execute(schema: string, id: string): Promise<import("../../entities/CampanhaDisparo").CampanhaDisparoProps>;
}
//# sourceMappingURL=GetCampanhaDisparoUseCase.d.ts.map