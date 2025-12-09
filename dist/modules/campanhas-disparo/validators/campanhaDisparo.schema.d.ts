import { z } from 'zod';
export declare const createCampanhaDisparoSchema: z.ZodObject<{
    tipo: z.ZodLiteral<"email">;
    descricao: z.ZodString;
    assunto: z.ZodString;
    html: z.ZodString;
    remetente_id: z.ZodString;
    tipo_envio: z.ZodEnum<{
        imediato: "imediato";
        agendado: "agendado";
    }>;
    data_agendamento: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    chave: z.ZodOptional<z.ZodString>;
    usu_cadastro: z.ZodNumber;
}, z.core.$strip>;
export declare const updateCampanhaDisparoSchema: z.ZodObject<{
    descricao: z.ZodOptional<z.ZodString>;
    assunto: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    remetente_id: z.ZodOptional<z.ZodString>;
    tipo_envio: z.ZodOptional<z.ZodEnum<{
        imediato: "imediato";
        agendado: "agendado";
    }>>;
    data_agendamento: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        rascunho: "rascunho";
        agendada: "agendada";
        enviando: "enviando";
        concluida: "concluida";
        cancelada: "cancelada";
    }>>;
    usu_altera: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=campanhaDisparo.schema.d.ts.map