import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository';
export declare class DeleteRemetenteSmtpUseCase {
    private readonly remetenteSmtpRepository;
    constructor(remetenteSmtpRepository: IRemetenteSmtpRepository);
    execute(schema: string, id: string): Promise<void>;
}
//# sourceMappingURL=DeleteRemetenteSmtpUseCase.d.ts.map