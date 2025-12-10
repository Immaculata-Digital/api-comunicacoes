import { z } from 'zod'

export const createCampanhaDisparoSchema = z.object({
  tipo: z.literal('email'),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  assunto: z.string().min(3, 'Assunto deve ter no mínimo 3 caracteres'),
  html: z.string().min(1, 'Conteúdo HTML é obrigatório'),
  remetente_id: z.string().uuid('ID do remetente inválido'),
  tipo_envio: z.enum(['manual', 'agendado', 'boas_vindas', 'atualizacao_pontos', 'resgate', 'reset_senha']),
  data_agendamento: z.string().nullable().optional(),
  chave: z.string().optional(),
  tipo_destinatario: z.enum(['todos', 'lojas_especificas', 'clientes_especificos']).optional(),
  lojas_ids: z.string().nullable().optional(),
  clientes_ids: z.string().nullable().optional(),
  usu_cadastro: z.number().int().positive('ID do usuário deve ser positivo'),
})

export const updateCampanhaDisparoSchema = z
  .object({
    descricao: z.string().min(3).optional(),
    assunto: z.string().min(3).optional(),
    html: z.string().min(1).optional(),
    remetente_id: z.string().uuid().optional(),
    tipo_envio: z.enum(['manual', 'agendado', 'boas_vindas', 'atualizacao_pontos', 'resgate', 'reset_senha']).optional(),
    data_agendamento: z.string().nullable().optional(),
    status: z.enum(['rascunho', 'agendada', 'enviando', 'concluida', 'cancelada']).optional(),
    tipo_destinatario: z.enum(['todos', 'lojas_especificas', 'clientes_especificos']).optional(),
    lojas_ids: z.string().nullable().optional(),
    clientes_ids: z.string().nullable().optional(),
    usu_altera: z.number().int().positive(),
  })
  .refine((data) => Object.keys(data).some((key) => key !== 'usu_altera'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
  })

