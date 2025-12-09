import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository'

export class ListCampanhasDisparoUseCase {
  constructor(private readonly campanhaDisparoRepository: ICampanhaDisparoRepository) {}

  async execute(schema: string) {
    return await this.campanhaDisparoRepository.findAll(schema)
  }
}

