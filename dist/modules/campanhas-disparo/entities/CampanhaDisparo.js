"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampanhaDisparo = void 0;
const crypto_1 = require("crypto");
class CampanhaDisparo {
    constructor(props) {
        this.props = props;
    }
    static create(data) {
        const timestamp = new Date();
        const chave = data.chave || `${data.tipo}-${Date.now()}-${(0, crypto_1.randomUUID)().substring(0, 8)}`;
        return new CampanhaDisparo({
            ...data,
            id_campanha: (0, crypto_1.randomUUID)(),
            chave,
            status: data.tipo_envio === 'agendado' ? 'agendada' : 'rascunho',
            total_enviados: 0,
            total_entregues: 0,
            total_abertos: 0,
            total_cliques: 0,
            dt_cadastro: timestamp,
            dt_altera: null,
            usu_altera: null,
        });
    }
    static restore(props) {
        return new CampanhaDisparo(props);
    }
    update(data) {
        if (data.descricao !== undefined) {
            this.props.descricao = data.descricao;
        }
        if (data.assunto !== undefined) {
            this.props.assunto = data.assunto;
        }
        if (data.html !== undefined) {
            this.props.html = data.html;
        }
        if (data.remetente_id !== undefined) {
            this.props.remetente_id = data.remetente_id;
        }
        if (data.tipo_envio !== undefined) {
            this.props.tipo_envio = data.tipo_envio;
        }
        if (data.data_agendamento !== undefined) {
            this.props.data_agendamento = data.data_agendamento;
        }
        if (data.status !== undefined) {
            this.props.status = data.status;
        }
        this.props.usu_altera = data.usu_altera;
        this.props.dt_altera = new Date();
    }
    toJSON() {
        return { ...this.props };
    }
}
exports.CampanhaDisparo = CampanhaDisparo;
//# sourceMappingURL=CampanhaDisparo.js.map