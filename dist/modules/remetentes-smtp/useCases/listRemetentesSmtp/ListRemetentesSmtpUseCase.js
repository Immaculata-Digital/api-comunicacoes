"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRemetentesSmtpUseCase = void 0;
class ListRemetentesSmtpUseCase {
    constructor(remetenteSmtpRepository) {
        this.remetenteSmtpRepository = remetenteSmtpRepository;
    }
    async execute(schema) {
        return await this.remetenteSmtpRepository.findAll(schema);
    }
}
exports.ListRemetentesSmtpUseCase = ListRemetentesSmtpUseCase;
//# sourceMappingURL=ListRemetentesSmtpUseCase.js.map