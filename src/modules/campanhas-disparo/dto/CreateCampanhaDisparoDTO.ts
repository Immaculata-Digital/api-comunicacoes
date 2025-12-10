export interface CreateCampanhaDisparoDTO {
  tipo: 'email'
  descricao: string
  assunto: string
  html: string
  remetente_id: string
  tipo_envio: 'manual' | 'agendado' | 'boas_vindas' | 'atualizacao_pontos' | 'resgate' | 'reset_senha'
  data_agendamento?: string | null | undefined
  chave?: string | undefined
  tipo_destinatario?: 'todos' | 'lojas_especificas' | 'clientes_especificos' | undefined
  lojas_ids?: string | null | undefined
  clientes_ids?: string | null | undefined
  usu_cadastro: number
}

