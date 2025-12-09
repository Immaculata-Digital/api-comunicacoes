import { z } from 'zod';
export declare const createRemetenteSmtpSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    senha: z.ZodString;
    smtp_host: z.ZodString;
    smtp_port: z.ZodCoercedNumber<unknown>;
    smtp_secure: z.ZodBoolean;
    usu_cadastro: z.ZodNumber;
}, z.core.$strip>;
export declare const updateRemetenteSmtpSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    senha: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    smtp_host: z.ZodOptional<z.ZodString>;
    smtp_port: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    smtp_secure: z.ZodOptional<z.ZodBoolean>;
    usu_altera: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=remetenteSmtp.schema.d.ts.map