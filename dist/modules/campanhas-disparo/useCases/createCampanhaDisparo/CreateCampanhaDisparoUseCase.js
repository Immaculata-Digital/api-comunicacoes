"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCampanhaDisparoUseCase = void 0;
const AppError_1 = require("../../../../core/errors/AppError");
const CampanhaDisparo_1 = require("../../entities/CampanhaDisparo");
class CreateCampanhaDisparoUseCase {
    constructor(campanhaDisparoRepository) {
        this.campanhaDisparoRepository = campanhaDisparoRepository;
    }
    async execute(schema, data) {
        // Verificar se já existe campanha com a mesma chave (se fornecida)
        if (data.chave !== undefined && data.chave !== null) {
            const existing = await this.campanhaDisparoRepository.findByChave(schema, data.chave);
            if (existing) {
                throw new AppError_1.AppError('Já existe uma campanha com esta chave', 409);
            }
        }
        const dataAgendamento = data.data_agendamento && typeof data.data_agendamento === 'string'
            ? new Date(data.data_agendamento)
            : null;
        const createProps = {
            tipo: data.tipo,
            descricao: data.descricao,
            assunto: data.assunto,
            html: data.html,
            remetente_id: data.remetente_id,
            tipo_envio: data.tipo_envio,
            data_agendamento: dataAgendamento,
            tipo_destinatario: data.tipo_destinatario || 'todos',
            lojas_ids: data.lojas_ids || null,
            clientes_ids: data.clientes_ids || null,
            cliente_pode_excluir: data.cliente_pode_excluir !== undefined ? data.cliente_pode_excluir : true,
            usu_cadastro: data.usu_cadastro,
        };
        if (data.chave !== undefined) {
            createProps.chave = data.chave;
        }
        const campanha = CampanhaDisparo_1.CampanhaDisparo.create(createProps);
        return await this.campanhaDisparoRepository.create(schema, campanha);
    }
}
exports.CreateCampanhaDisparoUseCase = CreateCampanhaDisparoUseCase;
//# sourceMappingURL=CreateCampanhaDisparoUseCase.js.map