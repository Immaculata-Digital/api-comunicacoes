import { randomUUID } from 'crypto'

export interface RemetenteSmtpProps {
  id_remetente: string
  nome: string
  email: string
  senha: string
  smtp_host: string
  smtp_port: number
  smtp_secure: boolean
  dt_cadastro: Date
  usu_cadastro: number
  dt_altera: Date | null
  usu_altera: number | null
}

export type CreateRemetenteSmtpProps = Omit<
  RemetenteSmtpProps,
  'id_remetente' | 'dt_cadastro' | 'dt_altera' | 'usu_altera'
>

export type UpdateRemetenteSmtpProps = {
  nome?: string | undefined
  email?: string | undefined
  senha?: string | undefined
  smtp_host?: string | undefined
  smtp_port?: number | undefined
  smtp_secure?: boolean | undefined
  usu_altera: number
}

export class RemetenteSmtp {
  private constructor(private props: RemetenteSmtpProps) {}

  static create(data: CreateRemetenteSmtpProps): RemetenteSmtp {
    const timestamp = new Date()
    return new RemetenteSmtp({
      ...data,
      id_remetente: randomUUID(),
      dt_cadastro: timestamp,
      dt_altera: null,
      usu_altera: null,
    })
  }

  static restore(props: RemetenteSmtpProps): RemetenteSmtp {
    return new RemetenteSmtp(props)
  }

  update(data: UpdateRemetenteSmtpProps): void {
    if (data.nome !== undefined) {
      this.props.nome = data.nome
    }
    if (data.email !== undefined) {
      this.props.email = data.email
    }
    // Só atualizar senha se foi fornecida e não está vazia
    if (data.senha !== undefined && data.senha.trim() !== '') {
      this.props.senha = data.senha
    }
    if (data.smtp_host !== undefined) {
      this.props.smtp_host = data.smtp_host
    }
    if (data.smtp_port !== undefined) {
      this.props.smtp_port = data.smtp_port
    }
    if (data.smtp_secure !== undefined) {
      this.props.smtp_secure = data.smtp_secure
    }
    this.props.usu_altera = data.usu_altera
    this.props.dt_altera = new Date()
  }

  toJSON(): RemetenteSmtpProps {
    return { ...this.props }
  }
}

