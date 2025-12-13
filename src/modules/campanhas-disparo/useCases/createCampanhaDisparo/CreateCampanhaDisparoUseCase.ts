import { AppError } from '../../../../core/errors/AppError'
import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository'
import type { CreateCampanhaDisparoDTO } from '../../dto/CreateCampanhaDisparoDTO'
import { CampanhaDisparo } from '../../entities/CampanhaDisparo'

export class CreateCampanhaDisparoUseCase {
  constructor(private readonly campanhaDisparoRepository: ICampanhaDisparoRepository) {}

  async execute(schema: string, data: CreateCampanhaDisparoDTO) {
    // Verificar se já existe campanha com a mesma chave (se fornecida)
    if (data.chave !== undefined && data.chave !== null) {
      const existing = await this.campanhaDisparoRepository.findByChave(schema, data.chave)
      if (existing) {
        throw new AppError('Já existe uma campanha com esta chave', 409)
      }
    }

    const dataAgendamento = data.data_agendamento && typeof data.data_agendamento === 'string' 
      ? new Date(data.data_agendamento) 
      : null
    
    const createProps: {
      tipo: 'email'
      descricao: string
      assunto: string
      html: string
      remetente_id: string
      tipo_envio: 'manual' | 'agendado' | 'boas_vindas' | 'atualizacao_pontos' | 'resgate' | 'reset_senha'
      data_agendamento: Date | null
      chave?: string
      tipo_destinatario?: 'todos' | 'lojas_especificas' | 'clientes_especificos'
      lojas_ids?: string | null
      clientes_ids?: string | null
      cliente_pode_excluir?: boolean
      usu_cadastro: number
    } = {
      tipo: data.tipo,
      descricao: data.descricao,
      assunto: data.assunto,
      html: data.html,
      remetente_id: data.remetente_id,
      tipo_envio: data.tipo_envio,
      data_agendamento: dataAgendamento,
      tipo_destinatario: data.tipo_destinatario || 'todos',
      lojas_ids: data.lojas_ids || null,
      clientes_ids: data.clientes_ids || null,
      cliente_pode_excluir: data.cliente_pode_excluir !== undefined ? data.cliente_pode_excluir : true,
      usu_cadastro: data.usu_cadastro,
    }
    
    if (data.chave !== undefined) {
      createProps.chave = data.chave
    }

    const campanha = CampanhaDisparo.create(createProps)

    return await this.campanhaDisparoRepository.create(schema, campanha)
  }
}

