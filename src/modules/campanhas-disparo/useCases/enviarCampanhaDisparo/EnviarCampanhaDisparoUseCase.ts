import { AppError } from '../../../../core/errors/AppError'
import type { ICampanhaDisparoRepository } from '../../repositories/ICampanhaDisparoRepository'
import type { IRemetenteSmtpRepository } from '../../../remetentes-smtp/repositories/IRemetenteSmtpRepository'
import { CampanhaDisparo } from '../../entities/CampanhaDisparo'
import type { EnviarCampanhaDisparoDTO } from '../../dto/EnviarCampanhaDisparoDTO'
import nodemailer from 'nodemailer'
import { decryptPassword } from '../../../../core/utils/passwordCipher'
import { env } from '../../../../config/env'
import axios from 'axios'
import { pool } from '../../../../infra/database/pool'

interface ClienteDTO {
  id_cliente: number
  nome_completo: string
  email: string
  whatsapp: string
  saldo: number
  cep: string
  id_loja: number | null
}

interface UsuarioDTO {
  id_usuario: number
  email: string
  login: string
  id_grupo_usuario: number
}

export class EnviarCampanhaDisparoUseCase {
  constructor(
    private readonly campanhaDisparoRepository: ICampanhaDisparoRepository,
    private readonly remetenteSmtpRepository: IRemetenteSmtpRepository
  ) {}

  async execute(schema: string, id: string, data: EnviarCampanhaDisparoDTO, accessToken?: string) {
    // Buscar a campanha
    const campanhaProps = await this.campanhaDisparoRepository.findById(schema, id)
    if (!campanhaProps) {
      throw new AppError('Campanha não encontrada', 404)
    }

    const campanha = CampanhaDisparo.restore(campanhaProps)

    // Verificar se a campanha pode ser enviada manualmente (apenas manual)
    if (campanhaProps.tipo_envio !== 'manual') {
      throw new AppError('Apenas campanhas do tipo manual podem ser enviadas manualmente', 400)
    }

    // Buscar o remetente SMTP
    const remetente = await this.remetenteSmtpRepository.findById(schema, campanhaProps.remetente_id)
    if (!remetente) {
      throw new AppError('Remetente SMTP não encontrado', 404)
    }

    // Verificar se a senha está em formato antigo (bcrypt)
    if (remetente.senha.startsWith('$2')) {
      throw new AppError(
        'A senha do remetente SMTP está em formato antigo e não pode ser usada para envio de emails. ' +
        'Por favor, acesse "Configurações SMTP", edite o remetente e atualize a senha para continuar.',
        400
      )
    }

    // Resolver destinatários
    const destinatarios = await this.resolverDestinatarios(schema, campanhaProps, accessToken)

    if (destinatarios.length === 0) {
      throw new AppError('Nenhum destinatário encontrado para esta campanha', 400)
    }

    // Descriptografar senha do remetente
    let senhaDescriptografada = remetente.senha
    try {
      // Tentar descriptografar (se estiver criptografada no formato iv:encrypted)
      if (remetente.senha.includes(':')) {
        senhaDescriptografada = decryptPassword(remetente.senha)
      } else if (remetente.senha.startsWith('$2')) {
        // Se for bcrypt (formato antigo), não podemos descriptografar
        // Tentar buscar a senha original do banco ou usar um fallback
        // Por enquanto, vamos tentar usar a senha como está (pode funcionar em alguns casos)
        // Mas é recomendado atualizar a senha do remetente
        console.warn('Aviso: Senha do remetente está em formato antigo (bcrypt). Recomenda-se atualizar a senha do remetente para o novo formato criptografado.')
        // Não podemos usar bcrypt para autenticação SMTP, então vamos lançar erro
        throw new AppError('Senha do remetente está em formato antigo (hash bcrypt). Por favor, atualize a senha do remetente na tela de "Configurações SMTP" para que o envio de emails funcione corretamente.', 400)
      }
      // Se não tiver ':' nem começar com '$2', assumir que está em texto plano (não recomendado, mas funcional)
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      // Se não conseguir descriptografar, usar a senha como está (pode estar em texto plano)
      senhaDescriptografada = remetente.senha
    }

    // Configurar transporter do nodemailer
    const transporter = nodemailer.createTransport({
      host: remetente.smtp_host,
      port: remetente.smtp_port,
      secure: remetente.smtp_secure,
      auth: {
        user: remetente.email,
        pass: senhaDescriptografada,
      },
    })

    // Preparar anexos se houver
    const attachments = data.anexos?.map((anexo) => ({
      filename: anexo.nome,
      content: Buffer.from(anexo.conteudo, 'base64'),
      contentType: anexo.tipo,
    })) || []

    // Enviar emails
    let totalEnviados = 0
    let totalEntregues = 0

    for (const cliente of destinatarios) {
      try {
        // Substituir variáveis no HTML
        const htmlPersonalizado = this.substituirVariaveis(campanhaProps.html, cliente)

        // Enviar email
        const info = await transporter.sendMail({
          from: `"${remetente.nome}" <${remetente.email}>`,
          to: cliente.email,
          subject: campanhaProps.assunto,
          html: htmlPersonalizado,
          attachments,
        })

        totalEnviados++
        if (info.accepted && info.accepted.length > 0) {
          totalEntregues++
        }
      } catch (error: any) {
        console.error(`Erro ao enviar email para ${cliente.email}:`, error)
        // Continuar enviando para os outros destinatários
      }
    }

    // Atualizar contadores da campanha usando SQL direto para atualizar total_enviados e total_entregues
    const client = await pool.connect()
    try {
      await client.query(
        `UPDATE "${schema}".campanhas_disparo 
         SET status = 'concluida',
             total_enviados = total_enviados + $1,
             total_entregues = total_entregues + $2,
             dt_altera = NOW(),
             usu_altera = $3
         WHERE id_campanha = $4`,
        [totalEnviados, totalEntregues, 1, id] // TODO: pegar usu_altera do token JWT
      )
    } finally {
      client.release()
    }

    return {
      message: `Campanha enviada com sucesso! ${totalEnviados} email(s) enviado(s), ${totalEntregues} entregue(s).`,
      total_enviados: totalEnviados,
      total_entregues: totalEntregues,
    }
  }

  private async resolverDestinatarios(schema: string, campanha: any, accessToken?: string): Promise<ClienteDTO[]> {
    const { tipo_destinatario, lojas_ids, clientes_ids } = campanha

    try {
      // Se for grupo_acesso, buscar usuários do grupo
      if (tipo_destinatario === 'grupo_acesso' && clientes_ids) {
        return await this.resolverDestinatariosGrupoAcesso(schema, clientes_ids)
      }

      // Buscar clientes da API de clientes
      const apiClientesUrl = process.env.API_CLIENTES_V2_URL || 'http://localhost:7773/api'
      
      if (tipo_destinatario === 'todos') {
        // Buscar todos os clientes
        const response = await axios.get(`${apiClientesUrl}/clientes/${schema}`, {
          params: { limit: 10000, offset: 0 },
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        })
        return response.data.data || []
      } else if (tipo_destinatario === 'lojas_especificas' && lojas_ids) {
        // Buscar clientes das lojas especificadas
        const lojaIds = lojas_ids.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id))
        const clientes: ClienteDTO[] = []
        
        for (const lojaId of lojaIds) {
          try {
            const response = await axios.get(`${apiClientesUrl}/clientes/${schema}`, {
              params: { limit: 10000, offset: 0, id_loja: lojaId },
              headers: {
                Authorization: `Bearer ${process.env.API_CLIENTES_TOKEN || ''}`,
              },
            })
            if (response.data.data) {
              clientes.push(...response.data.data)
            }
          } catch (error) {
            console.error(`Erro ao buscar clientes da loja ${lojaId}:`, error)
          }
        }
        
        // Remover duplicatas
        const uniqueClientes = clientes.filter((cliente, index, self) =>
          index === self.findIndex((c) => c.id_cliente === cliente.id_cliente)
        )
        return uniqueClientes
      } else if (tipo_destinatario === 'clientes_especificos' && clientes_ids) {
        // Buscar clientes específicos
        const clienteIds = clientes_ids.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id))
        const clientes: ClienteDTO[] = []
        
        for (const clienteId of clienteIds) {
          try {
            const response = await axios.get(`${apiClientesUrl}/clientes/${schema}/${clienteId}`, {
              headers: {
                Authorization: `Bearer ${process.env.API_CLIENTES_TOKEN || ''}`,
              },
            })
            if (response.data) {
              clientes.push(response.data)
            }
          } catch (error) {
            console.error(`Erro ao buscar cliente ${clienteId}:`, error)
          }
        }
        
        return clientes
      }
      
      return []
    } catch (error: any) {
      console.error('Erro ao resolver destinatários:', error)
      throw new AppError('Erro ao buscar destinatários', 500)
    }
  }

  /**
   * Busca usuários de um grupo de acesso pela chave do grupo
   * Usa clientes_ids para armazenar a chave do grupo (ex: "ADM-FRANQUIA")
   */
  private async resolverDestinatariosGrupoAcesso(schema: string, grupoChave: string): Promise<ClienteDTO[]> {
    try {
      const apiUsuariosUrl = env.apiUsuarios.url.replace(/\/api\/?$/, '').replace(/\/$/, '')
      
      // Buscar grupos com a chave especificada
      // O schema é passado no header x-schema
      const response = await axios.get(`${apiUsuariosUrl}/api/groups/public/grupo/${grupoChave}`, {
        headers: {
          'x-schema': schema,
        },
      })
      
      const grupos = response.data?.data || []
      const usuarios: UsuarioDTO[] = []
      
      // Extrair todos os usuários dos grupos
      for (const grupo of grupos) {
        if (grupo.usuarios && Array.isArray(grupo.usuarios)) {
          usuarios.push(...grupo.usuarios.map((u: any) => ({
            id_usuario: u.id || u.id_usuario,
            email: u.email || u.emailUsuario,
            login: u.login || u.loginUsuario,
            id_grupo_usuario: u.idGrupoUsuario || u.id_grupo_usuario,
          })))
        }
      }
      
      // Converter para formato ClienteDTO (adaptando campos)
      // Para grupos de acesso, usamos os dados do usuário como cliente
      return usuarios
        .filter((u) => u.email && u.email.trim() !== '')
        .map((u) => ({
          id_cliente: u.id_usuario, // Usando id_usuario como id_cliente para compatibilidade
          nome_completo: u.login || u.email, // Usando login como nome
          email: u.email,
          whatsapp: '', // Usuários não têm whatsapp
          saldo: 0, // Usuários não têm saldo
          cep: '', // Usuários não têm CEP
          id_loja: null,
        }))
    } catch (error: any) {
      console.error(`Erro ao buscar usuários do grupo ${grupoChave}:`, error.message)
      // Se o endpoint não existir, tentar buscar via endpoint ADMIN como fallback
      // ou retornar vazio
      return []
    }
  }

  private substituirVariaveis(html: string, cliente: ClienteDTO): string {
    return html
      .replace(/\{\{cliente\.nome_completo\}\}/g, cliente.nome_completo || '')
      .replace(/\{\{cliente\.email\}\}/g, cliente.email || '')
      .replace(/\{\{cliente\.whatsapp\}\}/g, cliente.whatsapp || '')
      .replace(/\{\{cliente\.saldo\}\}/g, String(cliente.saldo || 0))
      .replace(/\{\{cliente\.cep\}\}/g, cliente.cep || '')
      .replace(/\{\{cliente\.id_cliente\}\}/g, String(cliente.id_cliente || ''))
      .replace(/\{\{cliente\.id_loja\}\}/g, String(cliente.id_loja || ''))
  }
}

