import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository'

export class ListRemetentesSmtpUseCase {
  constructor(private readonly remetenteSmtpRepository: IRemetenteSmtpRepository) {}

  async execute(schema: string) {
    return await this.remetenteSmtpRepository.findAll(schema)
  }
}

