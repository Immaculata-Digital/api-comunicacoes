import { AppError } from '../../../../core/errors/AppError'
import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository'

export class GetCampanhaDisparoUseCase {
  constructor(private readonly campanhaDisparoRepository: ICampanhaDisparoRepository) {}

  async execute(schema: string, id: string) {
    const campanha = await this.campanhaDisparoRepository.findById(schema, id)
    if (!campanha) {
      throw new AppError('Campanha não encontrada', 404)
    }
    return campanha
  }
}

