import { z } from 'zod'

export const createRemetenteSmtpSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  smtp_host: z.string().min(1, 'Host SMTP é obrigatório'),
  smtp_port: z.coerce.number().int().min(1).max(65535, 'Porta SMTP deve estar entre 1 e 65535'),
  smtp_secure: z.boolean(),
  usu_cadastro: z.number().int().positive('ID do usuário deve ser positivo'),
})

export const updateRemetenteSmtpSchema = z
  .object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    senha: z.string().min(6).optional().or(z.literal('')),
    smtp_host: z.string().min(1).optional(),
    smtp_port: z.coerce.number().int().min(1).max(65535).optional(),
    smtp_secure: z.boolean().optional(),
    usu_altera: z.number().int().positive(),
  })
  .refine((data) => Object.keys(data).some((key) => key !== 'usu_altera'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
  })

