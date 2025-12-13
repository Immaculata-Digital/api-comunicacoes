import { randomUUID } from 'crypto'

export type TipoCampanha = 'email'
export type TipoEnvio = 'manual' | 'agendado' | 'boas_vindas' | 'atualizacao_pontos' | 'resgate' | 'reset_senha'
export type StatusCampanha = 'rascunho' | 'agendada' | 'enviando' | 'concluida' | 'cancelada'
export type TipoDestinatario = 'todos' | 'lojas_especificas' | 'clientes_especificos'

export interface CampanhaDisparoProps {
  id_campanha: string
  tipo: TipoCampanha
  descricao: string
  assunto: string
  html: string
  remetente_id: string
  tipo_envio: TipoEnvio
  data_agendamento: Date | null
  status: StatusCampanha
  total_enviados: number
  total_entregues: number
  total_abertos: number
  total_cliques: number
  chave: string
  tipo_destinatario: TipoDestinatario
  lojas_ids: string | null
  clientes_ids: string | null
  cliente_pode_excluir: boolean
  dt_cadastro: Date
  usu_cadastro: number
  dt_altera: Date | null
  usu_altera: number | null
}

export type CreateCampanhaDisparoProps = Omit<
  CampanhaDisparoProps,
  'id_campanha' | 'dt_cadastro' | 'dt_altera' | 'total_enviados' | 'total_entregues' | 'total_abertos' | 'total_cliques' | 'status' | 'usu_altera' | 'chave'
> & {
  chave?: string
  tipo_destinatario?: TipoDestinatario
  lojas_ids?: string | null
  clientes_ids?: string | null
  cliente_pode_excluir?: boolean
}

export type UpdateCampanhaDisparoProps = {
  descricao?: string
  assunto?: string
  html?: string
  remetente_id?: string
  tipo_envio?: TipoEnvio
  data_agendamento?: Date | null
  status?: StatusCampanha
  tipo_destinatario?: TipoDestinatario
  lojas_ids?: string | null
  clientes_ids?: string | null
  cliente_pode_excluir?: boolean
  usu_altera: number
}

export class CampanhaDisparo {
  private constructor(private props: CampanhaDisparoProps) {}

  static create(data: CreateCampanhaDisparoProps): CampanhaDisparo {
    const timestamp = new Date()
    const chave = data.chave || `${data.tipo}-${Date.now()}-${randomUUID().substring(0, 8)}`
    
    return new CampanhaDisparo({
      ...data,
      id_campanha: randomUUID(),
      chave,
      status: data.tipo_envio === 'agendado' ? 'agendada' : 'rascunho', // Tipos automáticos também ficam como rascunho até serem disparados
      total_enviados: 0,
      total_entregues: 0,
      total_abertos: 0,
      total_cliques: 0,
      tipo_destinatario: data.tipo_destinatario || 'todos',
      lojas_ids: data.lojas_ids || null,
      clientes_ids: data.clientes_ids || null,
      cliente_pode_excluir: data.cliente_pode_excluir !== undefined ? data.cliente_pode_excluir : true,
      dt_cadastro: timestamp,
      dt_altera: null,
      usu_altera: null,
    })
  }

  static restore(props: CampanhaDisparoProps): CampanhaDisparo {
    return new CampanhaDisparo(props)
  }

  update(data: UpdateCampanhaDisparoProps): void {
    if (data.descricao !== undefined) {
      this.props.descricao = data.descricao
    }
    if (data.assunto !== undefined) {
      this.props.assunto = data.assunto
    }
    if (data.html !== undefined) {
      this.props.html = data.html
    }
    if (data.remetente_id !== undefined) {
      this.props.remetente_id = data.remetente_id
    }
    if (data.tipo_envio !== undefined) {
      this.props.tipo_envio = data.tipo_envio
    }
    if (data.data_agendamento !== undefined) {
      this.props.data_agendamento = data.data_agendamento
    }
    if (data.status !== undefined) {
      this.props.status = data.status
    }
    if (data.tipo_destinatario !== undefined) {
      this.props.tipo_destinatario = data.tipo_destinatario
    }
    if (data.lojas_ids !== undefined) {
      this.props.lojas_ids = data.lojas_ids
    }
    if (data.clientes_ids !== undefined) {
      this.props.clientes_ids = data.clientes_ids
    }
    if (data.cliente_pode_excluir !== undefined) {
      this.props.cliente_pode_excluir = data.cliente_pode_excluir
    }
    this.props.usu_altera = data.usu_altera
    this.props.dt_altera = new Date()
  }

  toJSON(): CampanhaDisparoProps {
    return { ...this.props }
  }
}

