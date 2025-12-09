export interface UpdateCampanhaDisparoDTO {
  descricao?: string | undefined
  assunto?: string | undefined
  html?: string | undefined
  remetente_id?: string | undefined
  tipo_envio?: 'manual' | 'agendado' | undefined
  data_agendamento?: string | null | undefined
  status?: 'rascunho' | 'agendada' | 'enviando' | 'concluida' | 'cancelada' | undefined
  tipo_destinatario?: 'todos' | 'lojas_especificas' | 'clientes_especificos' | undefined
  lojas_ids?: string | null | undefined
  clientes_ids?: string | null | undefined
  usu_altera: number
}

