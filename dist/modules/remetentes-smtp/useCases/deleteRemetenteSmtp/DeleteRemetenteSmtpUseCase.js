"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRemetenteSmtpUseCase = void 0;
const AppError_1 = require("../../../../core/errors/AppError");
class DeleteRemetenteSmtpUseCase {
    constructor(remetenteSmtpRepository) {
        this.remetenteSmtpRepository = remetenteSmtpRepository;
    }
    async execute(schema, id) {
        const remetente = await this.remetenteSmtpRepository.findById(schema, id);
        if (!remetente) {
            throw new AppError_1.AppError('Remetente não encontrado', 404);
        }
        await this.remetenteSmtpRepository.delete(schema, id);
    }
}
exports.DeleteRemetenteSmtpUseCase = DeleteRemetenteSmtpUseCase;
//# sourceMappingURL=DeleteRemetenteSmtpUseCase.js.map