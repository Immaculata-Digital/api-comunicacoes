"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRemetenteSmtpUseCase = void 0;
const AppError_1 = require("../../../../core/errors/AppError");
const RemetenteSmtp_1 = require("../../entities/RemetenteSmtp");
const passwordCipher_1 = require("../../../../core/utils/passwordCipher");
class UpdateRemetenteSmtpUseCase {
    constructor(remetenteSmtpRepository) {
        this.remetenteSmtpRepository = remetenteSmtpRepository;
    }
    async execute(schema, id, data) {
        const existing = await this.remetenteSmtpRepository.findById(schema, id);
        if (!existing) {
            throw new AppError_1.AppError('Remetente não encontrado', 404);
        }
        // Se estiver atualizando o email, verificar se não existe outro com o mesmo email
        if (data.email && data.email !== existing.email) {
            const emailExists = await this.remetenteSmtpRepository.findByEmail(schema, data.email);
            if (emailExists) {
                throw new AppError_1.AppError('Já existe um remetente com este email', 409);
            }
        }
        const remetente = RemetenteSmtp_1.RemetenteSmtp.restore(existing);
        const updateData = {
            usu_altera: data.usu_altera,
        };
        if (data.nome !== undefined)
            updateData.nome = data.nome;
        if (data.email !== undefined)
            updateData.email = data.email;
        // Se senha for fornecida e não estiver vazia, criptografar e atualizar
        if (data.senha !== undefined && data.senha.trim() !== '') {
            const encryptedPassword = (0, passwordCipher_1.encryptPassword)(data.senha);
            updateData.senha = encryptedPassword;
        }
        if (data.smtp_host !== undefined)
            updateData.smtp_host = data.smtp_host;
        if (data.smtp_port !== undefined)
            updateData.smtp_port = data.smtp_port;
        if (data.smtp_secure !== undefined)
            updateData.smtp_secure = data.smtp_secure;
        remetente.update(updateData);
        return await this.remetenteSmtpRepository.update(schema, remetente);
    }
}
exports.UpdateRemetenteSmtpUseCase = UpdateRemetenteSmtpUseCase;
//# sourceMappingURL=UpdateRemetenteSmtpUseCase.js.map