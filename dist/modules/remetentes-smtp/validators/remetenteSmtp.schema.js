"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRemetenteSmtpSchema = exports.createRemetenteSmtpSchema = void 0;
const zod_1 = require("zod");
exports.createRemetenteSmtpSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    senha: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    smtp_host: zod_1.z.string().min(1, 'Host SMTP é obrigatório'),
    smtp_port: zod_1.z.coerce.number().int().min(1).max(65535, 'Porta SMTP deve estar entre 1 e 65535'),
    smtp_secure: zod_1.z.boolean(),
    usu_cadastro: zod_1.z.number().int().positive('ID do usuário deve ser positivo'),
});
exports.updateRemetenteSmtpSchema = zod_1.z
    .object({
    nome: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    senha: zod_1.z.string().min(6).optional().or(zod_1.z.literal('')),
    smtp_host: zod_1.z.string().min(1).optional(),
    smtp_port: zod_1.z.coerce.number().int().min(1).max(65535).optional(),
    smtp_secure: zod_1.z.boolean().optional(),
    usu_altera: zod_1.z.number().int().positive(),
})
    .refine((data) => Object.keys(data).some((key) => key !== 'usu_altera'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
});
//# sourceMappingURL=remetenteSmtp.schema.js.map