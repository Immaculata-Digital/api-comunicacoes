export interface UpdateCampanhaDisparoDTO {
    descricao?: string | undefined;
    assunto?: string | undefined;
    html?: string | undefined;
    remetente_id?: string | undefined;
    tipo_envio?: 'imediato' | 'agendado' | undefined;
    data_agendamento?: string | null | undefined;
    status?: 'rascunho' | 'agendada' | 'enviando' | 'concluida' | 'cancelada' | undefined;
    usu_altera: number;
}
//# sourceMappingURL=UpdateCampanhaDisparoDTO.d.ts.map