import { AppError } from '../../../../core/errors/AppError'
import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository'

export class GetRemetenteSmtpUseCase {
  constructor(private readonly remetenteSmtpRepository: IRemetenteSmtpRepository) {}

  async execute(schema: string, id: string) {
    const remetente = await this.remetenteSmtpRepository.findById(schema, id)
    if (!remetente) {
      throw new AppError('Remetente não encontrado', 404)
    }
    return remetente
  }
}

