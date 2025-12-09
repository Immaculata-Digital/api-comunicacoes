import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { remetenteSmtpRepository } from '../repositories'
import { ListRemetentesSmtpUseCase } from '../useCases/listRemetentesSmtp/ListRemetentesSmtpUseCase'
import { GetRemetenteSmtpUseCase } from '../useCases/getRemetenteSmtp/GetRemetenteSmtpUseCase'
import { CreateRemetenteSmtpUseCase } from '../useCases/createRemetenteSmtp/CreateRemetenteSmtpUseCase'
import { UpdateRemetenteSmtpUseCase } from '../useCases/updateRemetenteSmtp/UpdateRemetenteSmtpUseCase'
import { DeleteRemetenteSmtpUseCase } from '../useCases/deleteRemetenteSmtp/DeleteRemetenteSmtpUseCase'
import { createRemetenteSmtpSchema, updateRemetenteSmtpSchema } from '../validators/remetenteSmtp.schema'

export class RemetenteSmtpController {
  private readonly listRemetentesSmtp: ListRemetentesSmtpUseCase
  private readonly getRemetenteSmtp: GetRemetenteSmtpUseCase
  private readonly createRemetenteSmtp: CreateRemetenteSmtpUseCase
  private readonly updateRemetenteSmtp: UpdateRemetenteSmtpUseCase
  private readonly deleteRemetenteSmtp: DeleteRemetenteSmtpUseCase

  constructor() {
    this.listRemetentesSmtp = new ListRemetentesSmtpUseCase(remetenteSmtpRepository)
    this.getRemetenteSmtp = new GetRemetenteSmtpUseCase(remetenteSmtpRepository)
    this.createRemetenteSmtp = new CreateRemetenteSmtpUseCase(remetenteSmtpRepository)
    this.updateRemetenteSmtp = new UpdateRemetenteSmtpUseCase(remetenteSmtpRepository)
    this.deleteRemetenteSmtp = new DeleteRemetenteSmtpUseCase(remetenteSmtpRepository)
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const remetentes = await this.listRemetentesSmtp.execute(schema)
      return res.json(remetentes)
    } catch (error) {
      return next(error)
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const { id } = req.params
      if (!id) {
        throw new AppError('ID é obrigatório', 400)
      }
      const remetente = await this.getRemetenteSmtp.execute(schema, id)
      return res.json(remetente)
    } catch (error) {
      return next(error)
    }
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const parseResult = createRemetenteSmtpSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Dados inválidos', 400, parseResult.error.issues)
      }

      const remetente = await this.createRemetenteSmtp.execute(schema, parseResult.data)
      return res.status(201).json(remetente)
    } catch (error) {
      return next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const { id } = req.params
      if (!id) {
        throw new AppError('ID é obrigatório', 400)
      }
      const parseResult = updateRemetenteSmtpSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Dados inválidos', 400, parseResult.error.issues)
      }

      const remetente = await this.updateRemetenteSmtp.execute(schema, id, parseResult.data)
      return res.json(remetente)
    } catch (error) {
      return next(error)
    }
  }

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const { id } = req.params
      if (!id) {
        throw new AppError('ID é obrigatório', 400)
      }
      await this.deleteRemetenteSmtp.execute(schema, id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export const remetenteSmtpController = new RemetenteSmtpController()

