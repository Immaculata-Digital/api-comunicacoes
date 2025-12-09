export interface CreateCampanhaDisparoDTO {
    tipo: 'email';
    descricao: string;
    assunto: string;
    html: string;
    remetente_id: string;
    tipo_envio: 'imediato' | 'agendado';
    data_agendamento?: string | null | undefined;
    chave?: string | undefined;
    usu_cadastro: number;
}
//# sourceMappingURL=CreateCampanhaDisparoDTO.d.ts.map