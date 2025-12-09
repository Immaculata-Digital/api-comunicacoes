"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCampanhaDisparoUseCase = void 0;
const AppError_1 = require("../../../../core/errors/AppError");
class GetCampanhaDisparoUseCase {
    constructor(campanhaDisparoRepository) {
        this.campanhaDisparoRepository = campanhaDisparoRepository;
    }
    async execute(schema, id) {
        const campanha = await this.campanhaDisparoRepository.findById(schema, id);
        if (!campanha) {
            throw new AppError_1.AppError('Campanha não encontrada', 404);
        }
        return campanha;
    }
}
exports.GetCampanhaDisparoUseCase = GetCampanhaDisparoUseCase;
//# sourceMappingURL=GetCampanhaDisparoUseCase.js.map