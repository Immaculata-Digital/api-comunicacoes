import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { campanhaDisparoRepository } from '../repositories'
import { ListCampanhasDisparoUseCase } from '../useCases/listCampanhasDisparo/ListCampanhasDisparoUseCase'
import { GetCampanhaDisparoUseCase } from '../useCases/getCampanhaDisparo/GetCampanhaDisparoUseCase'
import { CreateCampanhaDisparoUseCase } from '../useCases/createCampanhaDisparo/CreateCampanhaDisparoUseCase'
import { UpdateCampanhaDisparoUseCase } from '../useCases/updateCampanhaDisparo/UpdateCampanhaDisparoUseCase'
import { DeleteCampanhaDisparoUseCase } from '../useCases/deleteCampanhaDisparo/DeleteCampanhaDisparoUseCase'
import { EnviarCampanhaDisparoUseCase } from '../useCases/enviarCampanhaDisparo/EnviarCampanhaDisparoUseCase'
import { createCampanhaDisparoSchema, updateCampanhaDisparoSchema } from '../validators/campanhaDisparo.schema'
import { enviarCampanhaDisparoSchema } from '../validators/enviarCampanhaDisparo.schema'
import { remetenteSmtpRepository } from '../../remetentes-smtp/repositories'
import type { EnviarCampanhaDisparoDTO } from '../dto/EnviarCampanhaDisparoDTO'

export class CampanhaDisparoController {
  private readonly listCampanhasDisparo: ListCampanhasDisparoUseCase
  private readonly getCampanhaDisparo: GetCampanhaDisparoUseCase
  private readonly createCampanhaDisparo: CreateCampanhaDisparoUseCase
  private readonly updateCampanhaDisparo: UpdateCampanhaDisparoUseCase
  private readonly deleteCampanhaDisparo: DeleteCampanhaDisparoUseCase
  private readonly enviarCampanhaDisparo: EnviarCampanhaDisparoUseCase

  constructor() {
    this.listCampanhasDisparo = new ListCampanhasDisparoUseCase(campanhaDisparoRepository)
    this.getCampanhaDisparo = new GetCampanhaDisparoUseCase(campanhaDisparoRepository)
    this.createCampanhaDisparo = new CreateCampanhaDisparoUseCase(campanhaDisparoRepository)
    this.updateCampanhaDisparo = new UpdateCampanhaDisparoUseCase(campanhaDisparoRepository)
    this.deleteCampanhaDisparo = new DeleteCampanhaDisparoUseCase(campanhaDisparoRepository)
    this.enviarCampanhaDisparo = new EnviarCampanhaDisparoUseCase(campanhaDisparoRepository, remetenteSmtpRepository)
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const campanhas = await this.listCampanhasDisparo.execute(schema)
      return res.json(campanhas)
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
      const campanha = await this.getCampanhaDisparo.execute(schema, id)
      return res.json(campanha)
    } catch (error) {
      return next(error)
    }
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const parseResult = createCampanhaDisparoSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Dados inválidos', 400, parseResult.error.issues)
      }

      const campanha = await this.createCampanhaDisparo.execute(schema, parseResult.data)
      return res.status(201).json(campanha)
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
      const parseResult = updateCampanhaDisparoSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Dados inválidos', 400, parseResult.error.issues)
      }

      const campanha = await this.updateCampanhaDisparo.execute(schema, id, parseResult.data)
      return res.json(campanha)
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
      await this.deleteCampanhaDisparo.execute(schema, id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }

  enviar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.schema!
      const { id } = req.params
      if (!id) {
        throw new AppError('ID é obrigatório', 400)
      }
      
      const parseResult = enviarCampanhaDisparoSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Dados inválidos', 400, parseResult.error.issues)
      }

      // Obter token de autenticação do header para passar para a API de clientes
      const authHeader = req.headers.authorization
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined

      const enviarData: EnviarCampanhaDisparoDTO = {}
      if (parseResult.data.anexos !== undefined) {
        enviarData.anexos = parseResult.data.anexos
      }

      const result = await this.enviarCampanhaDisparo.execute(schema, id, enviarData, accessToken)
      return res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}

export const campanhaDisparoController = new CampanhaDisparoController()

