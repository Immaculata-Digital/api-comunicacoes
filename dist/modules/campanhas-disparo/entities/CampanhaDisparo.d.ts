export type TipoCampanha = 'email';
export type TipoEnvio = 'manual' | 'agendado' | 'boas_vindas' | 'atualizacao_pontos' | 'resgate' | 'reset_senha' | 'resgate_nao_retirar_loja';
export type StatusCampanha = 'rascunho' | 'agendada' | 'enviando' | 'concluida' | 'cancelada';
export type TipoDestinatario = 'todos' | 'lojas_especificas' | 'clientes_especificos' | 'grupo_acesso';
export interface CampanhaDisparoProps {
    id_campanha: string;
    tipo: TipoCampanha;
    descricao: string;
    assunto: string;
    html: string;
    remetente_id: string;
    tipo_envio: TipoEnvio;
    data_agendamento: Date | null;
    status: StatusCampanha;
    total_enviados: number;
    total_entregues: number;
    total_abertos: number;
    total_cliques: number;
    chave: string;
    tipo_destinatario: TipoDestinatario;
    lojas_ids: string | null;
    clientes_ids: string | null;
    cliente_pode_excluir: boolean;
    dt_cadastro: Date;
    usu_cadastro: number;
    dt_altera: Date | null;
    usu_altera: number | null;
}
export type CreateCampanhaDisparoProps = Omit<CampanhaDisparoProps, 'id_campanha' | 'dt_cadastro' | 'dt_altera' | 'total_enviados' | 'total_entregues' | 'total_abertos' | 'total_cliques' | 'status' | 'usu_altera' | 'chave'> & {
    chave?: string;
    tipo_destinatario?: TipoDestinatario;
    lojas_ids?: string | null;
    clientes_ids?: string | null;
    cliente_pode_excluir?: boolean;
};
export type UpdateCampanhaDisparoProps = {
    descricao?: string;
    assunto?: string;
    html?: string;
    remetente_id?: string;
    tipo_envio?: TipoEnvio;
    data_agendamento?: Date | null;
    status?: StatusCampanha;
    tipo_destinatario?: TipoDestinatario;
    lojas_ids?: string | null;
    clientes_ids?: string | null;
    cliente_pode_excluir?: boolean;
    usu_altera: number;
};
export declare class CampanhaDisparo {
    private props;
    private constructor();
    static create(data: CreateCampanhaDisparoProps): CampanhaDisparo;
    static restore(props: CampanhaDisparoProps): CampanhaDisparo;
    update(data: UpdateCampanhaDisparoProps): void;
    toJSON(): CampanhaDisparoProps;
}
//# sourceMappingURL=CampanhaDisparo.d.ts.map