import { AppError } from '../../../../core/errors/AppError'
import type { IRemetenteSmtpRepository } from '../../repositories/IRemetenteSmtpRepository'
import type { CreateRemetenteSmtpDTO } from '../../dto/CreateRemetenteSmtpDTO'
import { RemetenteSmtp } from '../../entities/RemetenteSmtp'
import { encryptPassword } from '../../../../core/utils/passwordCipher'

export class CreateRemetenteSmtpUseCase {
  constructor(private readonly remetenteSmtpRepository: IRemetenteSmtpRepository) {}

  async execute(schema: string, data: CreateRemetenteSmtpDTO) {
    // Verificar se já existe remetente com o mesmo email
    const existing = await this.remetenteSmtpRepository.findByEmail(schema, data.email)
    if (existing) {
      throw new AppError('Já existe um remetente com este email', 409)
    }

    // Criptografar a senha antes de salvar (usar criptografia, não hash, para poder descriptografar depois)
    const encryptedPassword = encryptPassword(data.senha)

    const remetente = RemetenteSmtp.create({
      nome: data.nome,
      email: data.email,
      senha: encryptedPassword,
      smtp_host: data.smtp_host,
      smtp_port: data.smtp_port,
      smtp_secure: data.smtp_secure,
      usu_cadastro: data.usu_cadastro,
    })

    return await this.remetenteSmtpRepository.create(schema, remetente)
  }
}

