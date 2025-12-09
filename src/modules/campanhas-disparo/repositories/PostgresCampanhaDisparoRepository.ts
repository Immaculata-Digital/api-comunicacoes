import type { PoolClient } from 'pg'
import { pool } from '../../../infra/database/pool'
import type { CampanhaDisparo, CampanhaDisparoProps } from '../entities/CampanhaDisparo'
import type { ICampanhaDisparoRepository } from './ICampanhaDisparoRepository'

type CampanhaDisparoRow = {
  id_campanha: string
  tipo: string
  descricao: string
  assunto: string
  html: string
  remetente_id: string
  tipo_envio: string
  data_agendamento: Date | null
  status: string
  total_enviados: number
  total_entregues: number
  total_abertos: number
  total_cliques: number
  chave: string
  tipo_destinatario: string
  lojas_ids: string | null
  clientes_ids: string | null
  dt_cadastro: Date
  usu_cadastro: number
  dt_altera: Date | null
  usu_altera: number | null
}

const mapRowToProps = (row: CampanhaDisparoRow): CampanhaDisparoProps => ({
  id_campanha: row.id_campanha,
  tipo: row.tipo as CampanhaDisparoProps['tipo'],
  descricao: row.descricao,
  assunto: row.assunto,
  html: row.html,
  remetente_id: row.remetente_id,
  tipo_envio: row.tipo_envio as CampanhaDisparoProps['tipo_envio'],
  data_agendamento: row.data_agendamento,
  status: row.status as CampanhaDisparoProps['status'],
  total_enviados: row.total_enviados,
  total_entregues: row.total_entregues,
  total_abertos: row.total_abertos,
  total_cliques: row.total_cliques,
  chave: row.chave,
  tipo_destinatario: (row.tipo_destinatario || 'todos') as CampanhaDisparoProps['tipo_destinatario'],
  lojas_ids: row.lojas_ids,
  clientes_ids: row.clientes_ids,
  dt_cadastro: row.dt_cadastro,
  usu_cadastro: row.usu_cadastro,
  dt_altera: row.dt_altera,
  usu_altera: row.usu_altera,
})

export class PostgresCampanhaDisparoRepository implements ICampanhaDisparoRepository {
  async findAll(schema: string): Promise<CampanhaDisparoProps[]> {
    const client = await pool.connect()
    try {
      const result = await client.query<CampanhaDisparoRow>(
        `SELECT * FROM "${schema}".campanhas_disparo ORDER BY dt_cadastro DESC`
      )
      return result.rows.map(mapRowToProps)
    } finally {
      client.release()
    }
  }

  async findById(schema: string, id: string): Promise<CampanhaDisparoProps | null> {
    const client = await pool.connect()
    try {
      const result = await client.query<CampanhaDisparoRow>(
        `SELECT * FROM "${schema}".campanhas_disparo WHERE id_campanha = $1`,
        [id]
      )
      const row = result.rows[0]
      return row ? mapRowToProps(row) : null
    } finally {
      client.release()
    }
  }

  async findByChave(schema: string, chave: string): Promise<CampanhaDisparoProps | null> {
    const client = await pool.connect()
    try {
      const result = await client.query<CampanhaDisparoRow>(
        `SELECT * FROM "${schema}".campanhas_disparo WHERE chave = $1`,
        [chave]
      )
      const row = result.rows[0]
      return row ? mapRowToProps(row) : null
    } finally {
      client.release()
    }
  }

  async findByRemetenteId(schema: string, remetenteId: string): Promise<CampanhaDisparoProps[]> {
    const client = await pool.connect()
    try {
      const result = await client.query<CampanhaDisparoRow>(
        `SELECT * FROM "${schema}".campanhas_disparo WHERE remetente_id = $1 ORDER BY dt_cadastro DESC`,
        [remetenteId]
      )
      return result.rows.map(mapRowToProps)
    } finally {
      client.release()
    }
  }

  async create(schema: string, campanha: CampanhaDisparo): Promise<CampanhaDisparoProps> {
    const client = await pool.connect()
    try {
      const data = campanha.toJSON()
      await client.query(
        `
          INSERT INTO "${schema}".campanhas_disparo (
            id_campanha, tipo, descricao, assunto, html, remetente_id, tipo_envio,
            data_agendamento, status, total_enviados, total_entregues, total_abertos,
            total_cliques, chave, tipo_destinatario, lojas_ids, clientes_ids,
            dt_cadastro, usu_cadastro, dt_altera, usu_altera
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        `,
        [
          data.id_campanha,
          data.tipo,
          data.descricao,
          data.assunto,
          data.html,
          data.remetente_id,
          data.tipo_envio,
          data.data_agendamento,
          data.status,
          data.total_enviados,
          data.total_entregues,
          data.total_abertos,
          data.total_cliques,
          data.chave,
          data.tipo_destinatario,
          data.lojas_ids,
          data.clientes_ids,
          data.dt_cadastro,
          data.usu_cadastro,
          data.dt_altera,
          data.usu_altera,
        ]
      )
      const inserted = await this.findById(schema, data.id_campanha)
      if (!inserted) {
        throw new Error('Falha ao recuperar campanha inserida')
      }
      return inserted
    } finally {
      client.release()
    }
  }

  async update(schema: string, campanha: CampanhaDisparo): Promise<CampanhaDisparoProps> {
    const client = await pool.connect()
    try {
      const data = campanha.toJSON()
      await client.query(
        `
          UPDATE "${schema}".campanhas_disparo
          SET
            descricao = $2,
            assunto = $3,
            html = $4,
            remetente_id = $5,
            tipo_envio = $6,
            data_agendamento = $7,
            status = $8,
            tipo_destinatario = $9,
            lojas_ids = $10,
            clientes_ids = $11,
            dt_altera = $12,
            usu_altera = $13
          WHERE id_campanha = $1
        `,
        [
          data.id_campanha,
          data.descricao,
          data.assunto,
          data.html,
          data.remetente_id,
          data.tipo_envio,
          data.data_agendamento,
          data.status,
          data.tipo_destinatario,
          data.lojas_ids,
          data.clientes_ids,
          data.dt_altera,
          data.usu_altera,
        ]
      )
      const updated = await this.findById(schema, data.id_campanha)
      if (!updated) {
        throw new Error('Falha ao recuperar campanha atualizada')
      }
      return updated
    } finally {
      client.release()
    }
  }

  async delete(schema: string, id: string): Promise<void> {
    const client = await pool.connect()
    try {
      await client.query(
        `DELETE FROM "${schema}".campanhas_disparo WHERE id_campanha = $1`,
        [id]
      )
    } finally {
      client.release()
    }
  }
}

