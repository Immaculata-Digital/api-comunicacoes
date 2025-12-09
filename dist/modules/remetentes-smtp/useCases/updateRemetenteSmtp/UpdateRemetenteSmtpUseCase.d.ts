import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository';
import type { UpdateRemetenteSmtpDTO } from '../../dto/UpdateRemetenteSmtpDTO';
export declare class UpdateRemetenteSmtpUseCase {
    private readonly remetenteSmtpRepository;
    constructor(remetenteSmtpRepository: IRemetenteSmtpRepository);
    execute(schema: string, id: string, data: UpdateRemetenteSmtpDTO): Promise<import("../../entities/RemetenteSmtp").RemetenteSmtpProps>;
}
//# sourceMappingURL=UpdateRemetenteSmtpUseCase.d.ts.map