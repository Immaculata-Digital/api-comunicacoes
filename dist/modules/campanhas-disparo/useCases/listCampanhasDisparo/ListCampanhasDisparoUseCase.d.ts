import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository';
export declare class ListCampanhasDisparoUseCase {
    private readonly campanhaDisparoRepository;
    constructor(campanhaDisparoRepository: ICampanhaDisparoRepository);
    execute(schema: string): Promise<import("../../entities/CampanhaDisparo").CampanhaDisparoProps[]>;
}
//# sourceMappingURL=ListCampanhasDisparoUseCase.d.ts.map