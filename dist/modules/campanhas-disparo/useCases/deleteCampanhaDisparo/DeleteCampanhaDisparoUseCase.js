"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCampanhaDisparoUseCase = void 0;
const AppError_1 = require("../../../../core/errors/AppError");
class DeleteCampanhaDisparoUseCase {
    constructor(campanhaDisparoRepository) {
        this.campanhaDisparoRepository = campanhaDisparoRepository;
    }
    async execute(schema, id) {
        const campanha = await this.campanhaDisparoRepository.findById(schema, id);
        if (!campanha) {
            throw new AppError_1.AppError('Campanha não encontrada', 404);
        }
        await this.campanhaDisparoRepository.delete(schema, id);
    }
}
exports.DeleteCampanhaDisparoUseCase = DeleteCampanhaDisparoUseCase;
//# sourceMappingURL=DeleteCampanhaDisparoUseCase.js.map