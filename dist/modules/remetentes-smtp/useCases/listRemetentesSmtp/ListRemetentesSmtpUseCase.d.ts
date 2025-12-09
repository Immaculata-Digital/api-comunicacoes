import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository';
export declare class ListRemetentesSmtpUseCase {
    private readonly remetenteSmtpRepository;
    constructor(remetenteSmtpRepository: IRemetenteSmtpRepository);
    execute(schema: string): Promise<import("../../entities/RemetenteSmtp").RemetenteSmtpProps[]>;
}
//# sourceMappingURL=ListRemetentesSmtpUseCase.d.ts.map