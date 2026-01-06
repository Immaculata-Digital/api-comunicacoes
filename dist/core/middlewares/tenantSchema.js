"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantSchema = tenantSchema;
const VALID = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
async function tenantSchema(req, res, next) {
    const { schema } = req.params;
    if (!schema || !VALID.test(schema)) {
        console.error('Schema inválido:', schema);
        return res.status(400).json({
            mensagem: "Schema inválido. Use apenas letras, números e '_' e inicie com letra ou '_' (ex.: loja_1)",
            recebido: schema ?? null,
        });
    }
    req.schema = schema;
    next();
}
//# sourceMappingURL=tenantSchema.js.map