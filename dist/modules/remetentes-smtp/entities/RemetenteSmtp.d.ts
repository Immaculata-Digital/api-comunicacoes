export interface RemetenteSmtpProps {
    id_remetente: string;
    nome: string;
    email: string;
    senha: string;
    smtp_host: string;
    smtp_port: number;
    smtp_secure: boolean;
    dt_cadastro: Date;
    usu_cadastro: number;
    dt_altera: Date | null;
    usu_altera: number | null;
}
export type CreateRemetenteSmtpProps = Omit<RemetenteSmtpProps, 'id_remetente' | 'dt_cadastro' | 'dt_altera' | 'usu_altera'>;
export type UpdateRemetenteSmtpProps = {
    nome?: string | undefined;
    email?: string | undefined;
    senha?: string | undefined;
    smtp_host?: string | undefined;
    smtp_port?: number | undefined;
    smtp_secure?: boolean | undefined;
    usu_altera: number;
};
export declare class RemetenteSmtp {
    private props;
    private constructor();
    static create(data: CreateRemetenteSmtpProps): RemetenteSmtp;
    static restore(props: RemetenteSmtpProps): RemetenteSmtp;
    update(data: UpdateRemetenteSmtpProps): void;
    toJSON(): RemetenteSmtpProps;
}
//# sourceMappingURL=RemetenteSmtp.d.ts.map