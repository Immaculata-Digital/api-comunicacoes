import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository';
import type { CreateCampanhaDisparoDTO } from '../../dto/CreateCampanhaDisparoDTO';
export declare class CreateCampanhaDisparoUseCase {
    private readonly campanhaDisparoRepository;
    constructor(campanhaDisparoRepository: ICampanhaDisparoRepository);
    execute(schema: string, data: CreateCampanhaDisparoDTO): Promise<import("../../entities/CampanhaDisparo").CampanhaDisparoProps>;
}
//# sourceMappingURL=CreateCampanhaDisparoUseCase.d.ts.map