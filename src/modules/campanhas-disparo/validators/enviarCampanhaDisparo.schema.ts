import { z } from 'zod'

export const enviarCampanhaDisparoSchema = z.object({
  anexos: z.array(
    z.object({
      nome: z.string().min(1, 'Nome do anexo é obrigatório'),
      conteudo: z.string().min(1, 'Conteúdo do anexo é obrigatório'),
      tipo: z.string().min(1, 'Tipo do anexo é obrigatório'),
    })
  ).optional(),
})

