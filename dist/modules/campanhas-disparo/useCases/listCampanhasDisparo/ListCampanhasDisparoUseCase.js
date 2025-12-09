"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCampanhasDisparoUseCase = void 0;
class ListCampanhasDisparoUseCase {
    constructor(campanhaDisparoRepository) {
        this.campanhaDisparoRepository = campanhaDisparoRepository;
    }
    async execute(schema) {
        return await this.campanhaDisparoRepository.findAll(schema);
    }
}
exports.ListCampanhasDisparoUseCase = ListCampanhasDisparoUseCase;
//# sourceMappingURL=ListCampanhasDisparoUseCase.js.map