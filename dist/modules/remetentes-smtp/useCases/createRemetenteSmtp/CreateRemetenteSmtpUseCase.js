"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRemetenteSmtpUseCase = void 0;
const AppError_1 = require("../../../../core/errors/AppError");
const RemetenteSmtp_1 = require("../../entities/RemetenteSmtp");
const passwordCipher_1 = require("../../../../core/utils/passwordCipher");
class CreateRemetenteSmtpUseCase {
    constructor(remetenteSmtpRepository) {
        this.remetenteSmtpRepository = remetenteSmtpRepository;
    }
    async execute(schema, data) {
        // Verificar se já existe remetente com o mesmo email
        const existing = await this.remetenteSmtpRepository.findByEmail(schema, data.email);
        if (existing) {
            throw new AppError_1.AppError('Já existe um remetente com este email', 409);
        }
        // Criptografar a senha antes de salvar (usar criptografia, não hash, para poder descriptografar depois)
        const encryptedPassword = (0, passwordCipher_1.encryptPassword)(data.senha);
        const remetente = RemetenteSmtp_1.RemetenteSmtp.create({
            nome: data.nome,
            email: data.email,
            senha: encryptedPassword,
            smtp_host: data.smtp_host,
            smtp_port: data.smtp_port,
            smtp_secure: data.smtp_secure,
            usu_cadastro: data.usu_cadastro,
        });
        return await this.remetenteSmtpRepository.create(schema, remetente);
    }
}
exports.CreateRemetenteSmtpUseCase = CreateRemetenteSmtpUseCase;
//# sourceMappingURL=CreateRemetenteSmtpUseCase.js.map