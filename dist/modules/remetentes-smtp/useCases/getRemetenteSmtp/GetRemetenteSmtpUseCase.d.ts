import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository';
export declare class GetRemetenteSmtpUseCase {
    private readonly remetenteSmtpRepository;
    constructor(remetenteSmtpRepository: IRemetenteSmtpRepository);
    execute(schema: string, id: string): Promise<import("../../entities/RemetenteSmtp").RemetenteSmtpProps>;
}
//# sourceMappingURL=GetRemetenteSmtpUseCase.d.ts.map