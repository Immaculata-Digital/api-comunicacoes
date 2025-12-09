import type { RemetenteSmtp, RemetenteSmtpProps } from '../entities/RemetenteSmtp';
import type { IRemetenteSmtpRepository } from './IRemetenteSmtpRepository';
export declare class PostgresRemetenteSmtpRepository implements IRemetenteSmtpRepository {
    findAll(schema: string): Promise<RemetenteSmtpProps[]>;
    findById(schema: string, id: string): Promise<RemetenteSmtpProps | null>;
    findByEmail(schema: string, email: string): Promise<RemetenteSmtpProps | null>;
    create(schema: string, remetente: RemetenteSmtp): Promise<RemetenteSmtpProps>;
    update(schema: string, remetente: RemetenteSmtp): Promise<RemetenteSmtpProps>;
    delete(schema: string, id: string): Promise<void>;
}
//# sourceMappingURL=PostgresRemetenteSmtpRepository.d.ts.map