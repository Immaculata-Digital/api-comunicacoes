export interface UpdateCampanhaDisparoDTO {
    descricao?: string | undefined;
    assunto?: string | undefined;
    html?: string | undefined;
    remetente_id?: string | undefined;
    tipo_envio?: 'manual' | 'agendado' | 'boas_vindas' | 'atualizacao_pontos' | 'resgate' | 'reset_senha' | 'resgate_nao_retirar_loja' | undefined;
    data_agendamento?: string | null | undefined;
    status?: 'rascunho' | 'agendada' | 'enviando' | 'concluida' | 'cancelada' | undefined;
    tipo_destinatario?: 'todos' | 'lojas_especificas' | 'clientes_especificos' | 'grupo_acesso' | undefined;
    lojas_ids?: string | null | undefined;
    clientes_ids?: string | null | undefined;
    cliente_pode_excluir?: boolean | undefined;
    usu_altera: number;
}
//# sourceMappingURL=UpdateCampanhaDisparoDTO.d.ts.map