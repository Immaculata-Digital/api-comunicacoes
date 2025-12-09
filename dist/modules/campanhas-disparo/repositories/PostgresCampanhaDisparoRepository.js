"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresCampanhaDisparoRepository = void 0;
const pool_1 = require("../../../infra/database/pool");
const mapRowToProps = (row) => ({
    id_campanha: row.id_campanha,
    tipo: row.tipo,
    descricao: row.descricao,
    assunto: row.assunto,
    html: row.html,
    remetente_id: row.remetente_id,
    tipo_envio: row.tipo_envio,
    data_agendamento: row.data_agendamento,
    status: row.status,
    total_enviados: row.total_enviados,
    total_entregues: row.total_entregues,
    total_abertos: row.total_abertos,
    total_cliques: row.total_cliques,
    chave: row.chave,
    dt_cadastro: row.dt_cadastro,
    usu_cadastro: row.usu_cadastro,
    dt_altera: row.dt_altera,
    usu_altera: row.usu_altera,
});
class PostgresCampanhaDisparoRepository {
    async findAll(schema) {
        const client = await pool_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "${schema}".campanhas_disparo ORDER BY dt_cadastro DESC`);
            return result.rows.map(mapRowToProps);
        }
        finally {
            client.release();
        }
    }
    async findById(schema, id) {
        const client = await pool_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "${schema}".campanhas_disparo WHERE id_campanha = $1`, [id]);
            const row = result.rows[0];
            return row ? mapRowToProps(row) : null;
        }
        finally {
            client.release();
        }
    }
    async findByChave(schema, chave) {
        const client = await pool_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "${schema}".campanhas_disparo WHERE chave = $1`, [chave]);
            const row = result.rows[0];
            return row ? mapRowToProps(row) : null;
        }
        finally {
            client.release();
        }
    }
    async findByRemetenteId(schema, remetenteId) {
        const client = await pool_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "${schema}".campanhas_disparo WHERE remetente_id = $1 ORDER BY dt_cadastro DESC`, [remetenteId]);
            return result.rows.map(mapRowToProps);
        }
        finally {
            client.release();
        }
    }
    async create(schema, campanha) {
        const client = await pool_1.pool.connect();
        try {
            const data = campanha.toJSON();
            await client.query(`
          INSERT INTO "${schema}".campanhas_disparo (
            id_campanha, tipo, descricao, assunto, html, remetente_id, tipo_envio,
            data_agendamento, status, total_enviados, total_entregues, total_abertos,
            total_cliques, chave, dt_cadastro, usu_cadastro, dt_altera, usu_altera
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        `, [
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
                data.dt_cadastro,
                data.usu_cadastro,
                data.dt_altera,
                data.usu_altera,
            ]);
            const inserted = await this.findById(schema, data.id_campanha);
            if (!inserted) {
                throw new Error('Falha ao recuperar campanha inserida');
            }
            return inserted;
        }
        finally {
            client.release();
        }
    }
    async update(schema, campanha) {
        const client = await pool_1.pool.connect();
        try {
            const data = campanha.toJSON();
            await client.query(`
          UPDATE "${schema}".campanhas_disparo
          SET
            descricao = $2,
            assunto = $3,
            html = $4,
            remetente_id = $5,
            tipo_envio = $6,
            data_agendamento = $7,
            status = $8,
            dt_altera = $9,
            usu_altera = $10
          WHERE id_campanha = $1
        `, [
                data.id_campanha,
                data.descricao,
                data.assunto,
                data.html,
                data.remetente_id,
                data.tipo_envio,
                data.data_agendamento,
                data.status,
                data.dt_altera,
                data.usu_altera,
            ]);
            const updated = await this.findById(schema, data.id_campanha);
            if (!updated) {
                throw new Error('Falha ao recuperar campanha atualizada');
            }
            return updated;
        }
        finally {
            client.release();
        }
    }
    async delete(schema, id) {
        const client = await pool_1.pool.connect();
        try {
            await client.query(`DELETE FROM "${schema}".campanhas_disparo WHERE id_campanha = $1`, [id]);
        }
        finally {
            client.release();
        }
    }
}
exports.PostgresCampanhaDisparoRepository = PostgresCampanhaDisparoRepository;
//# sourceMappingURL=PostgresCampanhaDisparoRepository.js.map