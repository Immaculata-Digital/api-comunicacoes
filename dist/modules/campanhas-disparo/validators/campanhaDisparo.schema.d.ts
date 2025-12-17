import { z } from 'zod';
export declare const createCampanhaDisparoSchema: z.ZodObject<{
    tipo: z.ZodLiteral<"email">;
    descricao: z.ZodString;
    assunto: z.ZodString;
    html: z.ZodString;
    remetente_id: z.ZodString;
    tipo_envio: z.ZodEnum<{
        manual: "manual";
        agendado: "agendado";
        boas_vindas: "boas_vindas";
        atualizacao_pontos: "atualizacao_pontos";
        resgate: "resgate";
        reset_senha: "reset_senha";
        resgate_nao_retirar_loja: "resgate_nao_retirar_loja";
    }>;
    data_agendamento: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    chave: z.ZodOptional<z.ZodString>;
    tipo_destinatario: z.ZodOptional<z.ZodEnum<{
        todos: "todos";
        lojas_especificas: "lojas_especificas";
        clientes_especificos: "clientes_especificos";
        grupo_acesso: "grupo_acesso";
    }>>;
    lojas_ids: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    clientes_ids: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    usu_cadastro: z.ZodNumber;
}, z.core.$strip>;
export declare const updateCampanhaDisparoSchema: z.ZodObject<{
    descricao: z.ZodOptional<z.ZodString>;
    assunto: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    remetente_id: z.ZodOptional<z.ZodString>;
    tipo_envio: z.ZodOptional<z.ZodEnum<{
        manual: "manual";
        agendado: "agendado";
        boas_vindas: "boas_vindas";
        atualizacao_pontos: "atualizacao_pontos";
        resgate: "resgate";
        reset_senha: "reset_senha";
        resgate_nao_retirar_loja: "resgate_nao_retirar_loja";
    }>>;
    data_agendamento: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        rascunho: "rascunho";
        agendada: "agendada";
        enviando: "enviando";
        concluida: "concluida";
        cancelada: "cancelada";
    }>>;
    tipo_destinatario: z.ZodOptional<z.ZodEnum<{
        todos: "todos";
        lojas_especificas: "lojas_especificas";
        clientes_especificos: "clientes_especificos";
        grupo_acesso: "grupo_acesso";
    }>>;
    lojas_ids: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    clientes_ids: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    usu_altera: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=campanhaDisparo.schema.d.ts.map