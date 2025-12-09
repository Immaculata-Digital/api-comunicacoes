"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemetenteSmtp = void 0;
const crypto_1 = require("crypto");
class RemetenteSmtp {
    constructor(props) {
        this.props = props;
    }
    static create(data) {
        const timestamp = new Date();
        return new RemetenteSmtp({
            ...data,
            id_remetente: (0, crypto_1.randomUUID)(),
            dt_cadastro: timestamp,
            dt_altera: null,
            usu_altera: null,
        });
    }
    static restore(props) {
        return new RemetenteSmtp(props);
    }
    update(data) {
        if (data.nome !== undefined) {
            this.props.nome = data.nome;
        }
        if (data.email !== undefined) {
            this.props.email = data.email;
        }
        // Só atualizar senha se foi fornecida e não está vazia
        if (data.senha !== undefined && data.senha.trim() !== '') {
            this.props.senha = data.senha;
        }
        if (data.smtp_host !== undefined) {
            this.props.smtp_host = data.smtp_host;
        }
        if (data.smtp_port !== undefined) {
            this.props.smtp_port = data.smtp_port;
        }
        if (data.smtp_secure !== undefined) {
            this.props.smtp_secure = data.smtp_secure;
        }
        this.props.usu_altera = data.usu_altera;
        this.props.dt_altera = new Date();
    }
    toJSON() {
        return { ...this.props };
    }
}
exports.RemetenteSmtp = RemetenteSmtp;
//# sourceMappingURL=RemetenteSmtp.js.map