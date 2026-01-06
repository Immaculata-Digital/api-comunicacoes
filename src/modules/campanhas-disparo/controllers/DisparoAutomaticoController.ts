import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { campanhaDisparoRepository } from '../repositories'
import { remetenteSmtpRepository } from '../../remetentes-smtp/repositories'
import { DisparoAutomaticoService } from '../services/DisparoAutomaticoService'
import { z } from 'zod'

// Schema base para cliente
const clienteBaseSchema = {
  nome_completo: z.string(),
  email: z.string().email(),
  codigo_cliente: z.string().optional(),
  saldo_pontos: z.number().optional(),
  pontos_acumulados: z.number().optional(),
  total_pontos: z.number().optional(),
  codigo_resgate: z.string().optional(),
  item_nome: z.string().optional(),
  pontos_apos_resgate: z.number().optional(),
  token_reset: z.string().optional(),
}

// Schema que aceita id_cliente como número ou string (para reset_senha de usuários do sistema)
const disparoAutomaticoSchema = z.object({
  tipo_envio: z.enum(['boas_vindas', 'atualizacao_pontos', 'resgate', 'reset_senha', 'resgate_nao_retirar_loja']),
  cliente: z.object({
    id_cliente: z.union([z.number().int().positive(), z.string()]),
    ...clienteBaseSchema,
  }),
})

export class DisparoAutomaticoController {
  private readonly disparoAutomaticoService: DisparoAutomaticoService

  constructor() {
    this.disparoAutomaticoService = new DisparoAutomaticoService(
      campanhaDisparoRepository,
      remetenteSmtpRepository
    )
  }

  disparar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      
      const parseResult = disparoAutomaticoSchema.safeParse(req.body)
      
      if (!parseResult.success) {
        console.error('Erro de validação:', parseResult.error.issues)
        throw new AppError('Dados inválidos', 400, parseResult.error.issues)
      }

      const { tipo_envio, cliente } = parseResult.data
      const accessToken = req.headers.authorization?.replace('Bearer ', '')

      // Criar objeto clienteData apenas com propriedades definidas
      // id_cliente pode ser number (clientes) ou string (usuários do sistema)
      const clienteData: {
        id_cliente: number | string
        nome_completo: string
        email: string
        whatsapp?: string
        cep?: string
        codigo_cliente?: string
        saldo_pontos?: number
        pontos_acumulados?: number
        total_pontos?: number
        codigo_resgate?: string
        item_nome?: string
        item_descricao?: string
        item_qtd_pontos?: number
        pontos_apos_resgate?: number
        token_reset?: string
      } = {
        id_cliente: cliente.id_cliente,
        nome_completo: cliente.nome_completo,
        email: cliente.email,
      }
      const clienteAny = cliente as any
      if (clienteAny.whatsapp !== undefined && clienteAny.whatsapp !== null) clienteData.whatsapp = clienteAny.whatsapp
      if (clienteAny.cep !== undefined && clienteAny.cep !== null) clienteData.cep = clienteAny.cep
      if (clienteAny.codigo_cliente !== undefined && clienteAny.codigo_cliente !== null) clienteData.codigo_cliente = clienteAny.codigo_cliente
      if (clienteAny.saldo_pontos !== undefined && clienteAny.saldo_pontos !== null) clienteData.saldo_pontos = clienteAny.saldo_pontos
      if (clienteAny.pontos_acumulados !== undefined && clienteAny.pontos_acumulados !== null) clienteData.pontos_acumulados = clienteAny.pontos_acumulados
      if (clienteAny.total_pontos !== undefined && clienteAny.total_pontos !== null) clienteData.total_pontos = clienteAny.total_pontos
      if (clienteAny.codigo_resgate !== undefined && clienteAny.codigo_resgate !== null) clienteData.codigo_resgate = clienteAny.codigo_resgate
      if (clienteAny.item_nome !== undefined && clienteAny.item_nome !== null) clienteData.item_nome = clienteAny.item_nome
      if (clienteAny.item_descricao !== undefined && clienteAny.item_descricao !== null) clienteData.item_descricao = clienteAny.item_descricao
      if (clienteAny.item_qtd_pontos !== undefined && clienteAny.item_qtd_pontos !== null) clienteData.item_qtd_pontos = clienteAny.item_qtd_pontos
      if (clienteAny.pontos_apos_resgate !== undefined && clienteAny.pontos_apos_resgate !== null) clienteData.pontos_apos_resgate = clienteAny.pontos_apos_resgate
      if (clienteAny.token_reset !== undefined && clienteAny.token_reset !== null) clienteData.token_reset = clienteAny.token_reset

      switch (tipo_envio) {
        case 'boas_vindas':
          await this.disparoAutomaticoService.dispararBoasVindas(schema, clienteData, accessToken)
          break
        case 'atualizacao_pontos':
          await this.disparoAutomaticoService.dispararAtualizacaoPontos(schema, clienteData, accessToken)
          break
        case 'resgate':
          await this.disparoAutomaticoService.dispararResgate(schema, clienteData, accessToken)
          break
        case 'reset_senha':
          await this.disparoAutomaticoService.dispararResetSenha(schema, clienteData, accessToken)
          break
        case 'resgate_nao_retirar_loja':
          await this.disparoAutomaticoService.dispararResgateNaoRetirarLoja(schema, clienteData, accessToken)
          break
        default:
          console.error('Tipo de disparo inválido:', tipo_envio)
          throw new AppError('Tipo de disparo inválido', 400)
      }

      return res.status(204).send()
    } catch (error) {
      console.error('Erro no processamento:', error)
      return next(error)
    }
  }
}

export const disparoAutomaticoController = new DisparoAutomaticoController()

