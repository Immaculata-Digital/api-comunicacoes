"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampanhaDisparoSchema = exports.createCampanhaDisparoSchema = void 0;
const zod_1 = require("zod");
exports.createCampanhaDisparoSchema = zod_1.z.object({
    tipo: zod_1.z.literal('email'),
    descricao: zod_1.z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
    assunto: zod_1.z.string().min(3, 'Assunto deve ter no mínimo 3 caracteres'),
    html: zod_1.z.string().min(1, 'Conteúdo HTML é obrigatório'),
    remetente_id: zod_1.z.string().uuid('ID do remetente inválido'),
    tipo_envio: zod_1.z.preprocess((val) => {
        if (typeof val === 'string' && val.trim() === '') {
            return 'manual';
        }
        return val;
    }, zod_1.z.enum(['manual', 'agendado', 'boas_vindas', 'atualizacao_pontos', 'resgate', 'reset_senha', 'resgate_nao_retirar_loja'])),
    data_agendamento: zod_1.z.string().nullable().optional(),
    chave: zod_1.z.string().optional(),
    tipo_destinatario: zod_1.z.enum(['todos', 'lojas_especificas', 'clientes_especificos', 'grupo_acesso']).optional(),
    lojas_ids: zod_1.z.string().nullable().optional(),
    clientes_ids: zod_1.z.string().nullable().optional(),
    usu_cadastro: zod_1.z.number().int().positive('ID do usuário deve ser positivo'),
});
exports.updateCampanhaDisparoSchema = zod_1.z
    .object({
    descricao: zod_1.z.string().min(3).optional(),
    assunto: zod_1.z.string().min(3).optional(),
    html: zod_1.z.string().min(1).optional(),
    remetente_id: zod_1.z.string().uuid().optional(),
    tipo_envio: zod_1.z.enum(['manual', 'agendado', 'boas_vindas', 'atualizacao_pontos', 'resgate', 'reset_senha', 'resgate_nao_retirar_loja']).optional(),
    data_agendamento: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(['rascunho', 'agendada', 'enviando', 'concluida', 'cancelada']).optional(),
    tipo_destinatario: zod_1.z.enum(['todos', 'lojas_especificas', 'clientes_especificos', 'grupo_acesso']).optional(),
    lojas_ids: zod_1.z.string().nullable().optional(),
    clientes_ids: zod_1.z.string().nullable().optional(),
    usu_altera: zod_1.z.number().int().positive(),
})
    .refine((data) => Object.keys(data).some((key) => key !== 'usu_altera'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
});
//# sourceMappingURL=campanhaDisparo.schema.js.map