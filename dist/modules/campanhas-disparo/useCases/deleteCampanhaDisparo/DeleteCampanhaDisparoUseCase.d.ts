import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository';
export declare class DeleteCampanhaDisparoUseCase {
    private readonly campanhaDisparoRepository;
    constructor(campanhaDisparoRepository: ICampanhaDisparoRepository);
    execute(schema: string, id: string): Promise<void>;
}
//# sourceMappingURL=DeleteCampanhaDisparoUseCase.d.ts.map