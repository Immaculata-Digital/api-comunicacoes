import type { ICampanhaDisparoRepository } from '../repositories/ICampanhaDisparoRepository'
import type { IRemetenteSmtpRepository } from '../../remetentes-smtp/repositories/IRemetenteSmtpRepository'
import { AppError } from '../../../core/errors/AppError'
import { CampanhaDisparo } from '../entities/CampanhaDisparo'
import { decryptPassword } from '../../../core/utils/passwordCipher'
import nodemailer from 'nodemailer'
import { pool } from '../../../infra/database/pool'

interface ClienteData {
  id_cliente: number
  nome_completo: string
  email: string
  codigo_cliente?: string
  saldo_pontos?: number
  pontos_acumulados?: number
  total_pontos?: number
  codigo_resgate?: string
  item_nome?: string
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
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'boas_vindas')
    
    for (const campanhaProps of campanhas) {
      try {
        // Criar uma campanha temporária para envio
        // Substituir variáveis no HTML
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, cliente.nome_completo || 'Cliente')
        html = html.replace(/\{\{codigo_cliente\}\}/g, cliente.codigo_cliente || '')
        html = html.replace(/\{\{email_cliente\}\}/g, cliente.email || '')
        
        // Criar payload de envio com apenas o cliente específico
        const enviarUseCase = new EnviarCampanhaDisparoUseCase(
          this.campanhaDisparoRepository,
          this.remetenteSmtpRepository
        )
        
        // Temporariamente modificar a campanha para enviar apenas para este cliente
        // Como não podemos modificar diretamente, vamos criar uma cópia temporária
        // ou usar o método de envio direto
        
        // Por enquanto, vamos usar uma abordagem diferente: criar uma campanha temporária
        // ou modificar o EnviarCampanhaDisparoUseCase para aceitar clientes específicos
        
        // Por simplicidade, vamos chamar diretamente o envio com o cliente específico
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          cliente,
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
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'atualizacao_pontos')
    
    for (const campanhaProps of campanhas) {
      try {
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, cliente.nome_completo || 'Cliente')
        html = html.replace(/\{\{pontos_acumulados\}\}/g, String(cliente.pontos_acumulados || 0))
        html = html.replace(/\{\{total_pontos\}\}/g, String(cliente.total_pontos || cliente.saldo_pontos || 0))
        html = html.replace(/\{\{email_cliente\}\}/g, cliente.email || '')
        
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          cliente,
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
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'resgate')
    
    for (const campanhaProps of campanhas) {
      try {
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, cliente.nome_completo || 'Cliente')
        html = html.replace(/\{\{codigo_resgate\}\}/g, cliente.codigo_resgate || '')
        html = html.replace(/\{\{item_nome\}\}/g, cliente.item_nome || '')
        html = html.replace(/\{\{pontos_apos_resgate\}\}/g, String(cliente.pontos_apos_resgate || cliente.saldo_pontos || 0))
        html = html.replace(/\{\{email_cliente\}\}/g, cliente.email || '')
        
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          cliente,
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
    const campanhas = await this.campanhaDisparoRepository.findByTipoEnvio(schema, 'reset_senha')
    
    for (const campanhaProps of campanhas) {
      try {
        let html = campanhaProps.html
        html = html.replace(/\{\{nome_cliente\}\}/g, cliente.nome_completo || 'Cliente')
        html = html.replace(/\{\{token_reset\}\}/g, cliente.token_reset || '')
        html = html.replace(/\{\{email_cliente\}\}/g, cliente.email || '')
        
        await this.enviarParaCliente(
          schema,
          campanhaProps.id_campanha,
          cliente,
          html,
          accessToken
        )
      } catch (error: any) {
        console.error(`Erro ao disparar email de reset de senha para cliente ${cliente.id_cliente}:`, error)
      }
    }
  }

  /**
   * Método auxiliar para enviar email para um cliente específico
   */
  private async enviarParaCliente(
    schema: string,
    campanhaId: string,
    cliente: ClienteData,
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

