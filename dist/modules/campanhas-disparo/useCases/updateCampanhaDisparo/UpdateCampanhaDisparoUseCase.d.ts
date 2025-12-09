import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository';
import type { UpdateCampanhaDisparoDTO } from '../../dto/UpdateCampanhaDisparoDTO';
export declare class UpdateCampanhaDisparoUseCase {
    private readonly campanhaDisparoRepository;
    constructor(campanhaDisparoRepository: ICampanhaDisparoRepository);
    execute(schema: string, id: string, data: UpdateCampanhaDisparoDTO): Promise<import("../../entities/CampanhaDisparo").CampanhaDisparoProps>;
}
//# sourceMappingURL=UpdateCampanhaDisparoUseCase.d.ts.map