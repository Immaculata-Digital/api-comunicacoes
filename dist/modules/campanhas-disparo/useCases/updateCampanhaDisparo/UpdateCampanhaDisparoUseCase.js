"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCampanhaDisparoUseCase = void 0;
const AppError_1 = require("../../../../core/errors/AppError");
const CampanhaDisparo_1 = require("../../entities/CampanhaDisparo");
class UpdateCampanhaDisparoUseCase {
    constructor(campanhaDisparoRepository) {
        this.campanhaDisparoRepository = campanhaDisparoRepository;
    }
    async execute(schema, id, data) {
        const existing = await this.campanhaDisparoRepository.findById(schema, id);
        if (!existing) {
            throw new AppError_1.AppError('Campanha não encontrada', 404);
        }
        const campanha = CampanhaDisparo_1.CampanhaDisparo.restore(existing);
        const updateData = {
            usu_altera: data.usu_altera,
        };
        if (data.descricao !== undefined)
            updateData.descricao = data.descricao;
        if (data.assunto !== undefined)
            updateData.assunto = data.assunto;
        if (data.html !== undefined)
            updateData.html = data.html;
        if (data.remetente_id !== undefined)
            updateData.remetente_id = data.remetente_id;
        if (data.tipo_envio !== undefined)
            updateData.tipo_envio = data.tipo_envio;
        if (data.data_agendamento !== undefined) {
            const dataAgendamento = data.data_agendamento && typeof data.data_agendamento === 'string'
                ? new Date(data.data_agendamento)
                : null;
            updateData.data_agendamento = dataAgendamento;
        }
        if (data.status !== undefined)
            updateData.status = data.status;
        campanha.update(updateData);
        return await this.campanhaDisparoRepository.update(schema, campanha);
    }
}
exports.UpdateCampanhaDisparoUseCase = UpdateCampanhaDisparoUseCase;
//# sourceMappingURL=UpdateCampanhaDisparoUseCase.js.map