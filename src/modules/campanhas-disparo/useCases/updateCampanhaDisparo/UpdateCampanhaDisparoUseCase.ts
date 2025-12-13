import { AppError } from '../../../../core/errors/AppError'
import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository'
import type { UpdateCampanhaDisparoDTO } from '../../dto/UpdateCampanhaDisparoDTO'
import { CampanhaDisparo } from '../../entities/CampanhaDisparo'

export class UpdateCampanhaDisparoUseCase {
  constructor(private readonly campanhaDisparoRepository: ICampanhaDisparoRepository) {}

  async execute(schema: string, id: string, data: UpdateCampanhaDisparoDTO) {
    const existing = await this.campanhaDisparoRepository.findById(schema, id)
    if (!existing) {
      throw new AppError('Campanha não encontrada', 404)
    }

    const campanha = CampanhaDisparo.restore(existing)
    const updateData: {
      descricao?: string
      assunto?: string
      html?: string
      remetente_id?: string
      tipo_envio?: 'manual' | 'agendado' | 'boas_vindas' | 'atualizacao_pontos' | 'resgate' | 'reset_senha' | 'resgate_nao_retirar_loja'
      data_agendamento?: Date | null
      status?: 'rascunho' | 'agendada' | 'enviando' | 'concluida' | 'cancelada'
      tipo_destinatario?: 'todos' | 'lojas_especificas' | 'clientes_especificos' | 'grupo_acesso'
      lojas_ids?: string | null
      clientes_ids?: string | null
      cliente_pode_excluir?: boolean
      usu_altera: number
    } = {
      usu_altera: data.usu_altera,
    }
    if (data.descricao !== undefined) updateData.descricao = data.descricao
    if (data.assunto !== undefined) updateData.assunto = data.assunto
    if (data.html !== undefined) updateData.html = data.html
    if (data.remetente_id !== undefined) updateData.remetente_id = data.remetente_id
    if (data.tipo_envio !== undefined) {
      updateData.tipo_envio = data.tipo_envio
      // Se mudou para um tipo automático, anular vínculos com destinatários e data de agendamento
      const tiposAutomaticos = ['boas_vindas', 'atualizacao_pontos', 'resgate', 'reset_senha', 'resgate_nao_retirar_loja']
      if (tiposAutomaticos.includes(data.tipo_envio)) {
        // Para resgate_nao_retirar_loja, manter tipo_destinatario como 'grupo_acesso'
        if (data.tipo_envio === 'resgate_nao_retirar_loja') {
          updateData.tipo_destinatario = 'grupo_acesso'
        } else {
          updateData.tipo_destinatario = 'todos'
        }
        updateData.lojas_ids = null
        updateData.clientes_ids = null
        updateData.data_agendamento = null
      }
    }
    if (data.data_agendamento !== undefined) {
      const dataAgendamento = data.data_agendamento && typeof data.data_agendamento === 'string'
        ? new Date(data.data_agendamento)
        : null
      updateData.data_agendamento = dataAgendamento
    }
    if (data.status !== undefined) updateData.status = data.status
    if (data.tipo_destinatario !== undefined) updateData.tipo_destinatario = data.tipo_destinatario
    if (data.lojas_ids !== undefined) updateData.lojas_ids = data.lojas_ids
    if (data.clientes_ids !== undefined) updateData.clientes_ids = data.clientes_ids
    if (data.cliente_pode_excluir !== undefined) updateData.cliente_pode_excluir = data.cliente_pode_excluir
    campanha.update(updateData)

    return await this.campanhaDisparoRepository.update(schema, campanha)
  }
}

