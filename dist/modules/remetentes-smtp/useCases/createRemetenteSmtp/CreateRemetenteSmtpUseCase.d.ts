import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository';
import type { CreateRemetenteSmtpDTO } from '../../dto/CreateRemetenteSmtpDTO';
export declare class CreateRemetenteSmtpUseCase {
    private readonly remetenteSmtpRepository;
    constructor(remetenteSmtpRepository: IRemetenteSmtpRepository);
    execute(schema: string, data: CreateRemetenteSmtpDTO): Promise<import("../../entities/RemetenteSmtp").RemetenteSmtpProps>;
}
//# sourceMappingURL=CreateRemetenteSmtpUseCase.d.ts.map