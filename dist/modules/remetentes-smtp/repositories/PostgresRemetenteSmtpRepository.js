"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresRemetenteSmtpRepository = void 0;
const pool_1 = require("../../../infra/database/pool");
const mapRowToProps = (row) => ({
    id_remetente: row.id_remetente,
    nome: row.nome,
    email: row.email,
    senha: row.senha,
    smtp_host: row.smtp_host,
    smtp_port: row.smtp_port,
    smtp_secure: row.smtp_secure,
    dt_cadastro: row.dt_cadastro,
    usu_cadastro: row.usu_cadastro,
    dt_altera: row.dt_altera,
    usu_altera: row.usu_altera,
});
class PostgresRemetenteSmtpRepository {
    async findAll(schema) {
        const client = await pool_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "${schema}".remetentes_smtp ORDER BY nome ASC`);
            return result.rows.map(mapRowToProps);
        }
        finally {
            client.release();
        }
    }
    async findById(schema, id) {
        const client = await pool_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "${schema}".remetentes_smtp WHERE id_remetente = $1`, [id]);
            const row = result.rows[0];
            return row ? mapRowToProps(row) : null;
        }
        finally {
            client.release();
        }
    }
    async findByEmail(schema, email) {
        const client = await pool_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "${schema}".remetentes_smtp WHERE LOWER(email) = LOWER($1)`, [email]);
            const row = result.rows[0];
            return row ? mapRowToProps(row) : null;
        }
        finally {
            client.release();
        }
    }
    async create(schema, remetente) {
        const client = await pool_1.pool.connect();
        try {
            const data = remetente.toJSON();
            await client.query(`
          INSERT INTO "${schema}".remetentes_smtp (
            id_remetente, nome, email, senha, smtp_host, smtp_port, smtp_secure,
            dt_cadastro, usu_cadastro, dt_altera, usu_altera
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
                data.id_remetente,
                data.nome,
                data.email,
                data.senha,
                data.smtp_host,
                data.smtp_port,
                data.smtp_secure,
                data.dt_cadastro,
                data.usu_cadastro,
                data.dt_altera,
                data.usu_altera,
            ]);
            const inserted = await this.findById(schema, data.id_remetente);
            if (!inserted) {
                throw new Error('Falha ao recuperar remetente inserido');
            }
            return inserted;
        }
        finally {
            client.release();
        }
    }
    async update(schema, remetente) {
        const client = await pool_1.pool.connect();
        try {
            const data = remetente.toJSON();
            const existing = await this.findById(schema, data.id_remetente);
            if (!existing) {
                throw new Error('Remetente não encontrado');
            }
            // Construir query dinamicamente para não atualizar senha se não foi modificada
            const updates = [];
            const values = [];
            let paramIndex = 2;
            updates.push(`nome = $${paramIndex++}`);
            values.push(data.nome);
            updates.push(`email = $${paramIndex++}`);
            values.push(data.email);
            // Só atualizar senha se ela foi modificada (não é a mesma do banco)
            // Isso funciona porque o use case só inclui senha no updateData se ela foi fornecida e não está vazia
            if (data.senha !== existing.senha) {
                updates.push(`senha = $${paramIndex++}`);
                values.push(data.senha);
            }
            updates.push(`smtp_host = $${paramIndex++}`);
            values.push(data.smtp_host);
            updates.push(`smtp_port = $${paramIndex++}`);
            values.push(data.smtp_port);
            updates.push(`smtp_secure = $${paramIndex++}`);
            values.push(data.smtp_secure);
            updates.push(`dt_altera = $${paramIndex++}`);
            values.push(data.dt_altera);
            updates.push(`usu_altera = $${paramIndex++}`);
            values.push(data.usu_altera);
            values.unshift(data.id_remetente); // Adicionar ID no início
            await client.query(`
          UPDATE "${schema}".remetentes_smtp
          SET ${updates.join(', ')}
          WHERE id_remetente = $1
        `, values);
            const updated = await this.findById(schema, data.id_remetente);
            if (!updated) {
                throw new Error('Falha ao recuperar remetente atualizado');
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
            await client.query(`DELETE FROM "${schema}".remetentes_smtp WHERE id_remetente = $1`, [id]);
        }
        finally {
            client.release();
        }
    }
}
exports.PostgresRemetenteSmtpRepository = PostgresRemetenteSmtpRepository;
//# sourceMappingURL=PostgresRemetenteSmtpRepository.js.map