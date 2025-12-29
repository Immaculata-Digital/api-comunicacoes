import type { ICampanhaDisparoRepository } from '../repositories/ICampanhaDisparoRepository'
import type { IRemetenteSmtpRepository } from '../../remetentes-smtp/repositories/IRemetenteSmtpRepository'
import { AppError } from '../../../core/errors/AppError'
import { CampanhaDisparo } from '../entities/CampanhaDisparo'
import { decryptPassword } from '../../../core/utils/passwordCipher'
import nodemailer from 'nodemailer'
import { pool } from '../../../infra/database/pool'
import axios from 'axios'
import { env } from '../../../config/env'
import { EnviarCampanhaDisparoUseCase } from '../useCases/enviarCampanhaDisparo/EnviarCampanhaDisparoUseCase'

interface ClienteData {
  id_cliente: number
  nome_completo: string
  email: string
  whatsapp?: string
  cep?: string
  codigo_cliente?: string
  saldo_pontos?: number
  pontos_acumulados?: number
  total_pontos?: number
  codigo_resgate?: string
  item_nome?: string
  item_descricao?: string
  item_qtd_pontos?: number
  pontos_apos_resgate?: number
  token_reset?: string
}

interface ClienteDataForService {
  id_cliente: number | string  // number para clientes, string (UUID) para usuários do sistema
  nome_completo: string
  email: string
  whatsapp?: string
  cep?: string
  codigo_cliente: string
  saldo_pontos?: number
  pontos_acumulados?: number
  total_pontos?: number
  codigo_resgate?: string
  item_nome?: string
  item_descricao?: string
  item_qtd_pontos?: number
  pontos_apos_resgate?: number
  token_reset?: string
}

export class DisparoAutomaticoService {
  constructor(
    private readonly campanhaDisparoRepository: ICampanhaDisparoRepository,
    private readonly remetenteSmtpRepository: IRemetenteSmtpRepository
  ) {}

  /**
   * Dispara email de boas-vindas quando um cliente se cadastra
   */
  async dispararBoasVindas(
    schema: string,
    cliente: ClienteData,
    accessToken?: string
  ): Promise<void> {
    const clienteData: ClienteDataForService = {
      ...cliente,
      codigo_cliente: cliente.codigo_cliente || `CLI-${cliente.id_cliente}`,
    }
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'boas_vindas')
    
    for (const campanhaProps of campanhas) {
      try {
        // Criar uma campanha temporária para envio
        // Substituir variáveis no HTML
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, clienteData.nome_completo || 'Cliente')
        html = html.replace(/\{\{codigo_cliente\}\}/g, clienteData.codigo_cliente || '')
        html = html.replace(/\{\{email_cliente\}\}/g, clienteData.email || '')
        
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          clienteData,
          html,
          accessToken
        )
      } catch (error: any) {
        console.error(`Erro ao disparar email de boas-vindas para cliente ${cliente.id_cliente}:`, error)
        // Continuar com outras campanhas mesmo se uma falhar
      }
    }
  }

  /**
   * Dispara email de atualização de pontos quando há crédito
   */
  async dispararAtualizacaoPontos(
    schema: string,
    cliente: ClienteData,
    accessToken?: string
  ): Promise<void> {
    const clienteData: ClienteDataForService = {
      ...cliente,
      codigo_cliente: cliente.codigo_cliente || `CLI-${cliente.id_cliente}`,
    }
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'atualizacao_pontos')
    
    for (const campanhaProps of campanhas) {
      try {
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, clienteData.nome_completo || 'Cliente')
        html = html.replace(/\{\{pontos_acumulados\}\}/g, String(clienteData.pontos_acumulados || 0))
        html = html.replace(/\{\{total_pontos\}\}/g, String(clienteData.total_pontos || clienteData.saldo_pontos || 0))
        html = html.replace(/\{\{email_cliente\}\}/g, clienteData.email || '')
        
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          clienteData,
          html,
          accessToken
        )
      } catch (error: any) {
        console.error(`Erro ao disparar email de atualização de pontos para cliente ${cliente.id_cliente}:`, error)
      }
    }
  }

  /**
   * Dispara email de resgate quando há débito de pontos
   */
  async dispararResgate(
    schema: string,
    cliente: ClienteData,
    accessToken?: string
  ): Promise<void> {
    const clienteData: ClienteDataForService = {
      ...cliente,
      codigo_cliente: cliente.codigo_cliente || `CLI-${cliente.id_cliente}`,
    }
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'resgate')
    
    for (const campanhaProps of campanhas) {
      try {
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, clienteData.nome_completo || 'Cliente')
        html = html.replace(/\{\{codigo_resgate\}\}/g, clienteData.codigo_resgate || '')
        html = html.replace(/\{\{item_nome\}\}/g, clienteData.item_nome || '')
        html = html.replace(/\{\{pontos_apos_resgate\}\}/g, String(clienteData.pontos_apos_resgate || clienteData.saldo_pontos || 0))
        html = html.replace(/\{\{email_cliente\}\}/g, clienteData.email || '')
        
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          clienteData,
          html,
          accessToken
        )
      } catch (error: any) {
        console.error(`Erro ao disparar email de resgate para cliente ${cliente.id_cliente}:`, error)
      }
    }
  }

  /**
   * Dispara email de reset de senha
   */
  async dispararResetSenha(
    schema: string,
    cliente: ClienteData,
    accessToken?: string
  ): Promise<void> {
    const clienteData: ClienteDataForService = {
      ...cliente,
      codigo_cliente: cliente.codigo_cliente || `CLI-${cliente.id_cliente}`,
    }
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'reset_senha')
    
    // Construir URL de reset se houver token
    let urlReset = ''
    if (clienteData.token_reset) {
      const baseUrl = env.app.webUrl.replace(/\/$/, '')
      const path = env.app.passwordResetPath.startsWith('/') ? env.app.passwordResetPath : `/${env.app.passwordResetPath}`
      urlReset = `${baseUrl}${path}?token=${clienteData.token_reset}`
    }
    
    for (const campanhaProps of campanhas) {
      try {
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, clienteData.nome_completo || 'Cliente')
        html = html.replace(/\{\{token_reset\}\}/g, clienteData.token_reset || '')
        html = html.replace(/\{\{email_cliente\}\}/g, clienteData.email || '')
        html = html.replace(/\{\{url_reset\}\}/g, urlReset)
        
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          clienteData,
          html,
          accessToken
        )
      } catch (error: any) {
        console.error(`Erro ao disparar email de reset de senha para cliente ${cliente.id_cliente}:`, error)
      }
    }
  }

  /**
   * Dispara email de resgate não retirar loja para grupo ADM-FRANQUIA
   * Este tipo de disparo envia para usuários do grupo, não para clientes
   */
  async dispararResgateNaoRetirarLoja(
    schema: string,
    cliente: ClienteData,
    accessToken?: string
  ): Promise<void> {
    const clienteData: ClienteDataForService = {
      ...cliente,
      codigo_cliente: cliente.codigo_cliente || `CLI-${cliente.id_cliente}`,
    }
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'resgate_nao_retirar_loja')
    
    for (const campanhaProps of campanhas) {
      try {
        // Para resgate_nao_retirar_loja, o destinatário é o grupo ADM-FRANQUIA
        // Precisamos usar o EnviarCampanhaDisparoUseCase que já suporta grupos
        if (campanhaProps.tipo_destinatario !== 'grupo_acesso') {
          console.warn(`Campanha ${campanhaProps.id_campanha} não está configurada para grupo_acesso. Pulando.`)
          continue
        }

        let html = campanhaProps.html
        // Substituir variáveis do cliente
        html = html.replace(/\{\{cliente\.nome_completo\}\}/g, clienteData.nome_completo || '')
        html = html.replace(/\{\{cliente\.email\}\}/g, clienteData.email || '')
        html = html.replace(/\{\{cliente\.whatsapp\}\}/g, clienteData.whatsapp || '')
        html = html.replace(/\{\{cliente\.cep\}\}/g, clienteData.cep || '')
        html = html.replace(/\{\{cliente\.saldo\}\}/g, String(clienteData.saldo_pontos || 0))
        html = html.replace(/\{\{cliente\.id_cliente\}\}/g, String(clienteData.id_cliente || ''))
        
        // Substituir variáveis do item
        html = html.replace(/\{\{codigo_resgate\}\}/g, clienteData.codigo_resgate || '')
        html = html.replace(/\{\{item\.nome_item\}\}/g, clienteData.item_nome || '')
        html = html.replace(/\{\{item\.descricao\}\}/g, clienteData.item_descricao || '')
        html = html.replace(/\{\{item\.qtd_pontos\}\}/g, String(clienteData.item_qtd_pontos || 0))
        
        await this.enviarParaGrupoAcesso(
          schema,
          campanhaProps.id_campanha,
          campanhaProps.assunto,
          html,
          accessToken
        )
      } catch (error: any) {
        console.error(`Erro ao disparar email de resgate não retirar loja para grupo:`, error)
      }
    }
  }

  /**
   * Método auxiliar para enviar email para grupo de acesso
   */
  private async enviarParaGrupoAcesso(
    schema: string,
    campanhaId: string,
    assunto: string,
    html: string,
    accessToken?: string
  ): Promise<void> {
    // Buscar a campanha
    const campanhaProps = await this.campanhaDisparoRepository.findById(schema, campanhaId)
    if (!campanhaProps) {
      throw new AppError('Campanha não encontrada', 404)
    }

    if (campanhaProps.tipo_destinatario !== 'grupo_acesso' || !campanhaProps.clientes_ids) {
      throw new AppError('Campanha não configurada para grupo de acesso', 400)
    }

    // Buscar o remetente SMTP
    const remetente = await this.remetenteSmtpRepository.findById(schema, campanhaProps.remetente_id)
    if (!remetente) {
      throw new AppError('Remetente SMTP não encontrado', 404)
    }

    // Verificar senha antiga
    if (remetente.senha.startsWith('$2')) {
      console.warn(`Remetente ${remetente.id_remetente} tem senha em formato antigo. Pulando envio.`)
      return
    }

    // Descriptografar senha
    let senhaDescriptografada = remetente.senha
    try {
      if (remetente.senha.includes(':')) {
        senhaDescriptografada = decryptPassword(remetente.senha)
      }
    } catch (error) {
      senhaDescriptografada = remetente.senha
    }

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      host: remetente.smtp_host,
      port: remetente.smtp_port,
      secure: remetente.smtp_secure,
      auth: {
        user: remetente.email,
        pass: senhaDescriptografada,
      },
    })

    // Buscar usuários do grupo
    const grupoChave = campanhaProps.clientes_ids
    const apiUsuariosUrl = env.apiUsuarios.url.replace(/\/api\/?$/, '').replace(/\/$/, '')
    
    const response = await axios.get(`${apiUsuariosUrl}/api/grupos-usuarios/public/grupo/${grupoChave}`)
    
    const grupos = response.data?.data || []
    const usuarios: any[] = []
    
    for (const grupo of grupos) {
      if (grupo.usuarios && Array.isArray(grupo.usuarios)) {
        usuarios.push(...grupo.usuarios.filter((u: any) => (u.email || u.emailUsuario)?.trim()))
      }
    }

    // Enviar email para cada usuário
    let totalEnviados = 0
    for (const usuario of usuarios) {
      try {
        const emailUsuario = usuario.email || usuario.emailUsuario
        await transporter.sendMail({
          from: `"${remetente.nome}" <${remetente.email}>`,
          to: emailUsuario,
          subject: assunto,
          html: html,
        })
        totalEnviados++
      } catch (error: any) {
        console.error(`Erro ao enviar email para ${usuario.email}:`, error)
      }
    }

    // Atualizar contadores
    const client = await pool.connect()
    try {
      await client.query(
        `UPDATE "${schema}".campanhas_disparo 
         SET total_enviados = total_enviados + $1, 
             total_entregues = total_entregues + $1
         WHERE id_campanha = $2`,
        [totalEnviados, campanhaId]
      )
    } finally {
      client.release()
    }
  }

  /**
   * Método auxiliar para enviar email para um cliente específico
   */
  private async enviarParaCliente(
    schema: string,
    campanhaId: string,
    cliente: ClienteDataForService,
    html: string,
    accessToken?: string
  ): Promise<void> {
    // Buscar a campanha
    const campanhaProps = await this.campanhaDisparoRepository.findById(schema, campanhaId)
    if (!campanhaProps) {
      throw new AppError('Campanha não encontrada', 404)
    }

    // Buscar o remetente SMTP
    const remetente = await this.remetenteSmtpRepository.findById(schema, campanhaProps.remetente_id)
    if (!remetente) {
      throw new AppError('Remetente SMTP não encontrado', 404)
    }

    // Verificar senha antiga
    if (remetente.senha.startsWith('$2')) {
      console.warn(`Remetente ${remetente.id_remetente} tem senha em formato antigo. Pulando envio.`)
      return
    }

    // Descriptografar senha
    let senhaDescriptografada = remetente.senha
    try {
      if (remetente.senha.includes(':')) {
        senhaDescriptografada = decryptPassword(remetente.senha)
      }
    } catch (error) {
      // Se não conseguir descriptografar, usar como está
      senhaDescriptografada = remetente.senha
    }

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      host: remetente.smtp_host,
      port: remetente.smtp_port,
      secure: remetente.smtp_secure,
      auth: {
        user: remetente.email,
        pass: senhaDescriptografada,
      },
    })

    // Enviar email
    await transporter.sendMail({
      from: remetente.email,
      to: cliente.email,
      subject: campanhaProps.assunto,
      html: html,
    })

    // Atualizar contadores (usar SQL direto para evitar loop)
    const client = await pool.connect()
    try {
      await client.query(
        `UPDATE "${schema}".campanhas_disparo 
         SET total_enviados = total_enviados + 1, 
             total_entregues = total_entregues + 1
         WHERE id_campanha = $1`,
        [campanhaId]
      )
    } finally {
      client.release()
    }
  }
}

