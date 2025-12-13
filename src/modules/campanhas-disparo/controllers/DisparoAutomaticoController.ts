import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { campanhaDisparoRepository } from '../repositories'
import { remetenteSmtpRepository } from '../../remetentes-smtp/repositories'
import { DisparoAutomaticoService } from '../services/DisparoAutomaticoService'
import { z } from 'zod'

const disparoAutomaticoSchema = z.object({
  tipo_envio: z.enum(['boas_vindas', 'atualizacao_pontos', 'resgate', 'reset_senha', 'resgate_nao_retirar_loja']),
  cliente: z.object({
    id_cliente: z.number().int().positive(),
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
        throw new AppError('Dados inválidos', 400, parseResult.error.issues)
      }

      const { tipo_envio, cliente } = parseResult.data
      const accessToken = req.headers.authorization?.replace('Bearer ', '')

      switch (tipo_envio) {
        case 'boas_vindas':
          await this.disparoAutomaticoService.dispararBoasVindas(schema, cliente, accessToken)
          break
        case 'atualizacao_pontos':
          await this.disparoAutomaticoService.dispararAtualizacaoPontos(schema, cliente, accessToken)
          break
        case 'resgate':
          await this.disparoAutomaticoService.dispararResgate(schema, cliente, accessToken)
          break
        case 'reset_senha':
          await this.disparoAutomaticoService.dispararResetSenha(schema, cliente, accessToken)
          break
        case 'resgate_nao_retirar_loja':
          await this.disparoAutomaticoService.dispararResgateNaoRetirarLoja(schema, cliente, accessToken)
          break
        default:
          throw new AppError('Tipo de disparo inválido', 400)
      }

      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export const disparoAutomaticoController = new DisparoAutomaticoController()

